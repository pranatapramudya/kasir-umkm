import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RekapKomisiClient from './RekapKomisiClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Rekap Komisi | PJTech Kasir',
  description: 'Rekapitulasi komisi karyawan',
};

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function RekapKomisiPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const role = (sessionClaims?.metadata as any)?.role;
  const tenantId = (sessionClaims?.metadata as any)?.tenantId;
  const targetUserId = role === 'CASHIER' ? tenantId : userId;

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const fromStr = getLocalDateString(firstDay);
  const toStr = getLocalDateString(today);

  let dateFilter: any = {};
  dateFilter.gte = new Date(fromStr);
  const endDate = new Date(toStr);
  endDate.setHours(23, 59, 59, 999);
  dateFilter.lte = endDate;

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: targetUserId,
      status: 'completed',
      createdAt: dateFilter
    },
    include: { items: true }
  });

  const commissionByWorker: Record<string, { workerId: string, totalQty: number, totalCommission: number }> = {};

  transactions.forEach(t => {
    t.items.forEach(item => {
      if (item.workerId) {
        const commissionPerItem = item.commissionSnapshot || 0;
        if (commissionPerItem > 0) {
          const totalCommission = commissionPerItem * item.qty;
          if (!commissionByWorker[item.workerId]) {
            commissionByWorker[item.workerId] = { workerId: item.workerId, totalQty: 0, totalCommission: 0 };
          }
          commissionByWorker[item.workerId].totalQty += item.qty;
          commissionByWorker[item.workerId].totalCommission += totalCommission;
        }
      }
    });
  });

  const workerIds = Object.keys(commissionByWorker);
  const employees = workerIds.length > 0
    ? await prisma.employee.findMany({
        where: { id: { in: workerIds } },
        select: { id: true, name: true }
      })
    : [];
  const employeeMap = new Map(employees.map(e => [e.id, e.name]));

  const data = Object.values(commissionByWorker).map(w => ({
    ...w,
    workerName: employeeMap.get(w.workerId) || 'Karyawan'
  })).sort((a, b) => b.totalCommission - a.totalCommission);

  return (
    <RekapKomisiClient 
      initialData={data} 
      initialDateRange={{ from: fromStr, to: toStr }} 
    />
  );
}
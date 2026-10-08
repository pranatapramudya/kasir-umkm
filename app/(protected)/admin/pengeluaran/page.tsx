import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PengeluaranClient from './PengeluaranClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pengeluaran | PJTech Kasir',
  description: 'Catat dan pantau biaya operasional bisnis Anda',
};

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function PengeluaranPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const role = (sessionClaims?.metadata as any)?.role;
  const tenantId = (sessionClaims?.metadata as any)?.tenantId;
  const targetUserId = role === 'CASHIER' ? tenantId : userId;

  // Default range: First day of current month to today (WIB UTC+7)
  const now = new Date();
  const wibDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
  const [year, month] = wibDateStr.split('-');
  
  const fromStr = `${year}-${month}-01`;
  const toStr = wibDateStr;

  const initialExpenses = await prisma.expense.findMany({
    where: {
      userId: targetUserId,
      date: {
        gte: new Date(`${fromStr}T00:00:00+07:00`),
        lte: new Date(`${toStr}T23:59:59.999+07:00`)
      }
    },
    orderBy: { date: 'desc' }
  });

  const serializedExpenses = initialExpenses.map((e: any) => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    category: e.category,
    date: e.date.toISOString(),
  }));

  return (
    <PengeluaranClient 
      initialExpenses={serializedExpenses} 
      tenantId={targetUserId}
      initialDateRange={{ from: fromStr, to: toStr }}
    />
  );
}

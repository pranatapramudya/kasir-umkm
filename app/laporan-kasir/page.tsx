import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { checkSubscriptionStatus } from '@/lib/subscription';
import LaporanKasirClient from './LaporanKasirClient';

export const dynamic = 'force-dynamic';

export default async function LaporanKasirPage(props: {
  searchParams: Promise<{ date?: string }>
}) {
  const searchParams = await props.searchParams;
  const { isExpired } = await checkSubscriptionStatus();
  if (isExpired) redirect('/');
  
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/');
  
  const role = (sessionClaims?.metadata as any)?.role;
  
  // Timezone Safety (Asia/Jakarta)
  const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
  const selectedDateStr = searchParams.date || nowStr;
  const startOfDay = new Date(`${selectedDateStr}T00:00:00+07:00`);
  const endOfDay = new Date(`${selectedDateStr}T23:59:59.999+07:00`);

  let targetUserIds = [userId];

  if (role !== 'CASHIER') {
    const cashiers = await prisma.employee.findMany({
      where: { tenantId: userId },
      select: { clerkUserId: true }
    });
    targetUserIds = [userId, ...cashiers.map(c => c.clerkUserId)];
  }

  let whereClause: any = {
    createdAt: { gte: startOfDay, lte: endOfDay },
    userId: { in: targetUserIds }
  };

  const [transactions, totalCount, aggResult, allTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
      include: { items: true }
    }),
    prisma.transaction.count({ where: whereClause }),
    prisma.transaction.groupBy({
      by: ['method'],
      where: whereClause,
      _sum: { total: true }
    }),
    prisma.transaction.findMany({
      where: whereClause,
      select: { items: true }
    })
  ]);

  const targetProductUserId = role === 'CASHIER' ? (sessionClaims?.metadata as any)?.tenantId : userId;
  const products = await prisma.product.findMany({
    where: { userId: targetProductUserId },
    select: { id: true, name: true }
  });
  const productMap = new Map(products.map(p => [p.id, p.name]));

  const soldSummary: Record<string, number> = {};
  allTransactions.forEach(tx => {
    tx.items.forEach(item => {
      const name = productMap.get(item.productId) || 'Produk Dihapus';
      soldSummary[name] = (soldSummary[name] || 0) + item.qty;
    });
  });

  transactions.forEach(tx => {
    tx.items.forEach((item: any) => {
      item.productName = productMap.get(item.productId) || 'Produk Dihapus';
    });
  });

  let totalGross = 0;
  let totalCash = 0;
  let totalQRIS = 0;

  aggResult.forEach(item => {
    const sum = item._sum.total || 0;
    totalGross += sum;
    const methodStr = (item.method || '').toUpperCase();
    if (methodStr === 'CASH' || methodStr === 'TUNAI') totalCash += sum;
    if (methodStr === 'QRIS') totalQRIS += sum;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  const initialData = {
    transactions,
    totalPages,
    metrics: { totalGross, totalCash, totalQRIS },
    soldSummary
  };

  return <LaporanKasirClient sidebar={<Sidebar />} initialDate={selectedDateStr} initialData={initialData} />;
}

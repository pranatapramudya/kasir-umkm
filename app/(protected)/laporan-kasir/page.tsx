import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { checkSubscriptionStatus } from '@/lib/subscription';
import LaporanKasirClient from './LaporanKasirClient';
import { isRentalTravelCategory } from '@/lib/business-category';

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

  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  const isEmployee = !!employee;
  const activeTenantId = employee ? employee.tenantId : userId;

  const tenant = await prisma.tenant.findUnique({
    where: { userId: activeTenantId },
    select: { category: true }
  });
  const tenantCategory = tenant?.category || null;
  const isRental = isRentalTravelCategory(tenantCategory);

  let whereClause: any = {
    createdAt: { gte: startOfDay, lte: endOfDay },
    userId: activeTenantId
  };

  if (isEmployee) {
    whereClause.cashierId = employee.id; // Hanya tampilkan transaksi kasir ini
  }

  const [
    transactions,
    totalCount,
    aggResult,
    allTransactions,
    products,
    bookingDPGroups,
    bookingTransactions
  ] = await Promise.all([
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
    }),
    prisma.product.findMany({
      where: { userId: activeTenantId },
      select: { id: true, name: true }
    }),
    // DP Booking Metrics (Khusus Rental)
    isRental ? prisma.booking.groupBy({
      by: ['paymentMethod'],
      where: { userId: activeTenantId, createdAt: { gte: startOfDay, lte: endOfDay }, downPayment: { gt: 0 } },
      _sum: { downPayment: true },
    }) : Promise.resolve([]),
    // DP Booking Transactions (Khusus Rental)
    isRental ? prisma.booking.findMany({
      where: { userId: activeTenantId, createdAt: { gte: startOfDay, lte: endOfDay }, downPayment: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
    }) : Promise.resolve([]),
  ]);

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

  // DP Booking (Rental Khusus)
  if (isRental) {
    bookingDPGroups.forEach((group: any) => {
      const dp = group._sum.downPayment ?? 0;
      totalGross += dp;
      const methodStr = (group.paymentMethod || '').toUpperCase();
      if (methodStr === 'CASH' || methodStr === 'TUNAI') totalCash += dp;
      if (methodStr === 'QRIS') totalQRIS += dp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  const initialData = {
    transactions,
    totalPages,
    metrics: { totalGross, totalCash, totalQRIS },
    soldSummary
  };

  return <LaporanKasirClient sidebar={<Sidebar />} initialDate={selectedDateStr} initialData={initialData} tenantCategory={tenantCategory} />;
}

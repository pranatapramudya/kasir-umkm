import { prisma } from "@/lib/prisma";
import { resolveBusinessCategory } from "@/lib/business-category";

export async function getAnalyticsData(userId: string, filter: string, customDate?: string | null) {
  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  const activeTenantId = employee ? employee.tenantId : userId;

  // Resolusi tenant untuk mendapatkan Clerk userId & Tenant DB id secara bersamaan
  // Menjamin multi-tenant isolation antar pebisnis dan sinkronisasi data antar owner & kasir
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { userId: activeTenantId },
        { id: activeTenantId }
      ]
    }
  });

  const possibleUserIds = Array.from(new Set([
    activeTenantId,
    userId,
    tenant?.userId,
    tenant?.id
  ].filter(Boolean) as string[]));

  // 1. Unified Date Filter (WIB - Asia/Jakarta)
  const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];

  let startOfDay: Date;
  let endOfDay: Date;

  if (filter === 'hari_ini') {
    startOfDay = new Date(`${nowStr}T00:00:00+07:00`);
    endOfDay = new Date(`${nowStr}T23:59:59.999+07:00`);
  } else if (filter === 'bulan_ini') {
    const yearMonth = nowStr.substring(0, 7); // YYYY-MM
    startOfDay = new Date(`${yearMonth}-01T00:00:00+07:00`);
    const lastDay = new Date(parseInt(yearMonth.split('-')[0]), parseInt(yearMonth.split('-')[1]), 0).getDate();
    endOfDay = new Date(`${yearMonth}-${lastDay}T23:59:59.999+07:00`);
  } else if (filter === 'tahun_ini') {
    const year = nowStr.substring(0, 4);
    startOfDay = new Date(`${year}-01-01T00:00:00+07:00`);
    endOfDay = new Date(`${year}-12-31T23:59:59.999+07:00`);
  } else if (filter === 'manual' && customDate) {
    startOfDay = new Date(`${customDate}T00:00:00+07:00`);
    endOfDay = new Date(`${customDate}T23:59:59.999+07:00`);
  } else {
    // Fallback (hari_ini)
    startOfDay = new Date(`${nowStr}T00:00:00+07:00`);
    endOfDay = new Date(`${nowStr}T23:59:59.999+07:00`);
  }

  const startDate = startOfDay;
  const endDate = endOfDay;

  const transactionWhere = {
    userId: { in: possibleUserIds },
    createdAt: { gte: startDate, lte: endDate },
  };

  // 2. Jalankan semua query berat secara paralel di sisi Database Engine
  const [
    transactionAggr,      // SUM(total) + COUNT(*) kalkulasi di Database
    expenseAggr,          // SUM(amount) kalkulasi di Database
    transactionItemsAggr, // SUM(qty) groupBy productId untuk HPP
    salesTrendRaw,        // Hanya 2 kolom (createdAt, total) untuk trend per hari
    products,             // Untuk mapping productId -> hpp & deteksi kategori
    tenantData,
  ] = await Promise.all([
    // A. Revenue & Transaction Count sepenuhnya di Database
    prisma.transaction.aggregate({
      where: transactionWhere,
      _sum: { total: true },
      _count: { id: true },
    }),

    // B. Total Expense sepenuhnya di Database
    prisma.expense.aggregate({
      where: {
        userId: { in: possibleUserIds },
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),

    // C. HPP groupBy di Database
    prisma.transactionItem.groupBy({
      by: ['productId'],
      where: {
        transaction: {
          userId: { in: possibleUserIds },
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      _sum: { qty: true },
    }),

    // D. Sales Trend perlu createdAt per baris untuk grouping by WIB date
    prisma.transaction.findMany({
      where: transactionWhere,
      select: { createdAt: true, total: true },
    }),

    // E. Products untuk mapping hpp & productId -> hpp dan deteksi kategori
    prisma.product.findMany({
      where: { userId: { in: possibleUserIds } },
      select: { id: true, name: true, description: true, category: true, hpp: true },
    }),

    // F. Tenant category & name
    tenant ? Promise.resolve(tenant) : prisma.tenant.findFirst({
      where: {
        OR: [
          { userId: { in: possibleUserIds } },
          { id: { in: possibleUserIds } }
        ]
      },
      select: { name: true, category: true },
    }),
  ]);

  // 3. Ekstrak nilai dari aggregate (kalkulasi sudah selesai di Database)
  const totalRevenue = transactionAggr._sum.total ?? 0;
  const totalTransactions = transactionAggr._count.id ?? 0;
  const totalExpense = expenseAggr._sum.amount ?? 0;

  // 4. Hitung HPP menggunakan hasil groupBy dari Database
  const productMap = new Map(products.map(p => [p.id, p.hpp]));
  let totalHpp = 0;
  transactionItemsAggr.forEach(item => {
    const hpp = productMap.get(item.productId) ?? 0;
    totalHpp += hpp * (item._sum.qty ?? 0);
  });

  // 5. Net Profit kalkulasi sederhana dari nilai yang sudah diagregasi
  const netProfit = totalRevenue - totalHpp - totalExpense;

  // 6. Sales Trend group by WIB date (harus dilakukan di JS karena timezone)
  const salesTrendMap = new Map<string, number>();
  salesTrendRaw.forEach(t => {
    const localDateStr = new Date(t.createdAt).toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
    salesTrendMap.set(localDateStr, (salesTrendMap.get(localDateStr) ?? 0) + t.total);
  });

  const salesTrend = Array.from(salesTrendMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));

  const effectiveCategory = resolveBusinessCategory(tenantData?.category, tenantData?.name, products);

  // Return exactly the fields needed with strings, no raw Date objects
  return {
    totalRevenue,
    totalHpp,
    totalExpense,
    netProfit,
    totalTransactions,
    salesTrend,
    category: effectiveCategory,
    tenantId: activeTenantId,
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
  };
}

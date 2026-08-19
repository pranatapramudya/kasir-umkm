import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    const activeTenantId = employee ? employee.tenantId : userId;

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'bulan_ini';
    const customDate = searchParams.get('customDate');

    // 1. Unified Date Filter (WIB - Asia/Jakarta)
    const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];

    let startOfDay, endOfDay;

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
      userId: activeTenantId,
      createdAt: { gte: startDate, lte: endDate },
    };

    // 2. Jalankan semua query berat secara paralel di sisi Database Engine
    const [
      transactionAggr,      // SUM(total) + COUNT(*) — kalkulasi di PostgreSQL
      expenseAggr,          // SUM(amount) — kalkulasi di PostgreSQL
      transactionItemsAggr, // SUM(qty) groupBy productId — untuk HPP
      salesTrendRaw,        // Hanya 2 kolom (createdAt, total) untuk trend per hari
      products,             // Untuk mapping productId → hpp & salesTrend per WIB date
      tenant,
    ] = await Promise.all([
      // A. Revenue & Transaction Count — sepenuhnya di Database
      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: { total: true },
        _count: { id: true },
      }),

      // B. Total Expense — sepenuhnya di Database
      prisma.expense.aggregate({
        where: {
          userId: activeTenantId,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),

      // C. HPP — groupBy di Database (sudah optimal)
      prisma.transactionItem.groupBy({
        by: ['productId'],
        where: {
          transaction: {
            userId: activeTenantId,
            createdAt: { gte: startDate, lte: endDate },
          },
        },
        _sum: { qty: true },
      }),

      // D. Sales Trend — perlu createdAt per baris untuk grouping by WIB date
      // Select minimal (hanya 2 kolom), tidak ada alternatif murni DB karena
      // PostgreSQL tidak bisa timezone-aware date_trunc ke WIB via Prisma ORM.
      prisma.transaction.findMany({
        where: transactionWhere,
        select: { createdAt: true, total: true },
      }),

      // E. Products untuk mapping hpp & productId → hpp
      prisma.product.findMany({
        where: { userId: activeTenantId },
        select: { id: true, hpp: true },
      }),

      // F. Tenant category
      prisma.tenant.findUnique({
        where: { userId: activeTenantId },
        select: { category: true },
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

    // 5. Net Profit — kalkulasi sederhana dari nilai yang sudah diagregasi
    const netProfit = totalRevenue - totalHpp - totalExpense;

    // 6. Sales Trend — group by WIB date (harus dilakukan di JS karena timezone)
    const salesTrendMap = new Map<string, number>();
    salesTrendRaw.forEach(t => {
      const localDateStr = new Date(t.createdAt).toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
      salesTrendMap.set(localDateStr, (salesTrendMap.get(localDateStr) ?? 0) + t.total);
    });

    const salesTrend = Array.from(salesTrendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }));

    return NextResponse.json({
      totalRevenue,
      totalHpp,
      totalExpense,
      netProfit,
      totalTransactions,
      salesTrend,
      category: tenant?.category || 'Retail',
      tenantId: activeTenantId,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

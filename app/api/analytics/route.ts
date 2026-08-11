import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const role = (sessionClaims?.metadata as any)?.role;

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

    let startDate = startOfDay;
    let endDate = endOfDay;

    // 2. Tenant Scoping
    let targetUserIds = [userId];

    if (role !== 'CASHIER') {
      // Owner: lihat transaksi dari dirinya sendiri & semua kasirnya
      const cashiers = await prisma.employee.findMany({
        where: { tenantId: userId },
        select: { clerkUserId: true }
      });
      const cashierIds = cashiers.map(c => c.clerkUserId);
      targetUserIds = [userId, ...cashierIds];
    }

    // 3. Tarik data seringan mungkin (Hindari Payload Kiamat)
    const transactionsLight = await prisma.transaction.findMany({
      where: {
        userId: { in: targetUserIds },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { createdAt: true, total: true }
    });

    // 4. Kalkulasi HPP menggunakan groupBy di level DB (Sangat ringan)
    const targetProductUserId = role === 'CASHIER' ? (sessionClaims?.metadata as any)?.tenantId : userId;
    const products = await prisma.product.findMany({
      where: { userId: targetProductUserId },
      select: { id: true, hpp: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.hpp]));

    const transactionItemsAggr = await prisma.transactionItem.groupBy({
      by: ['productId'],
      where: {
        transaction: {
          userId: { in: targetUserIds },
          createdAt: { gte: startDate, lte: endDate },
        }
      },
      _sum: { qty: true }
    });

    let totalHpp = 0;
    transactionItemsAggr.forEach(item => {
      const hpp = productMap.get(item.productId) || 0;
      totalHpp += hpp * (item._sum.qty || 0);
    });

    // Ambil data pengeluaran (Expense) untuk periode ini
    const expenses = await prisma.expense.findMany({
      where: {
        userId: { in: targetUserIds },
        date: { gte: startDate, lte: endDate },
      },
    });

    let totalRevenue = 0;
    const salesTrendMap = new Map<string, number>();

    transactionsLight.forEach(t => {
      totalRevenue += t.total;
      // Group by date (WIB)
      const localDateStr = new Date(t.createdAt).toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
      salesTrendMap.set(localDateStr, (salesTrendMap.get(localDateStr) || 0) + t.total);
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalHpp - totalExpense;
    const totalTransactions = transactionsLight.length;

    // Sort trend data by date
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
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });

  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

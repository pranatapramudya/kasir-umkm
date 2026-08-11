"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAnalyticsData(fromStr?: string, toStr?: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    let fromDate: Date;
    let toDate: Date;
    
    if (fromStr && toStr) {
      fromDate = new Date(fromStr);
      toDate = new Date(toStr);
      toDate.setHours(23, 59, 59, 999);
    } else {
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date();
    }

    const dateFilter = {
      gte: fromDate,
      lte: toDate
    };

    // 1. Data Jam Sibuk
    const transactions = await prisma.transaction.findMany({
      where: { userId, createdAt: dateFilter },
      select: { createdAt: true }
    });

    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourCounts[i] = 0;
    
    transactions.forEach(t => {
      const hour = t.createdAt.getHours();
      hourCounts[hour]++;
    });
    
    const busyHours = Object.keys(hourCounts)
      .map(hour => ({
        hour: `${hour.padStart(2, '0')}:00`,
        count: hourCounts[parseInt(hour)]
      }))
      .filter(h => h.count > 0);

    // 2. Data Analitik Produk (Top & Bottom)
    const transactionItems = await prisma.transactionItem.groupBy({
      by: ['productId'],
      _sum: { qty: true },
      where: { 
        transaction: { 
          userId,
          createdAt: dateFilter
        } 
      }
    });
    
    const productIds = transactionItems.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });
    
    const productMap = new Map(products.map(p => [p.id, p.name]));
    
    const productStats = transactionItems
      .map(item => ({
        name: productMap.get(item.productId) || 'Produk Dihapus',
        qty: item._sum.qty || 0
      }))
      .sort((a, b) => b.qty - a.qty);

    const topProducts = productStats.slice(0, 5);
    const bottomProducts = productStats.slice(-5).reverse();

    // 3. Stok Menipis
    const lowStock = await prisma.product.findMany({
      where: { userId, stock: { lte: 10 } },
      select: { name: true, stock: true },
      orderBy: { stock: 'asc' },
      take: 10
    });

    // 4. Performa Kasir (Group by userId)
    const cashierStats = await prisma.transaction.groupBy({
      by: ['userId'],
      _sum: { total: true },
      where: { userId, createdAt: dateFilter }
    });

    const tenant = await prisma.tenant.findUnique({
      where: { userId }
    });

    return {
      busyHours,
      topProducts,
      bottomProducts,
      lowStock,
      category: tenant?.category || 'Retail',
      cashierStats: cashierStats.map(stat => ({
        userId: stat.userId,
        total: stat._sum.total || 0
      }))
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { error: "Failed to fetch analytics data" };
  }
}

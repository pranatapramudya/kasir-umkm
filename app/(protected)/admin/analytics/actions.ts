"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resolveBusinessCategory } from "@/lib/business-category";

export async function getAnalyticsData(fromStr?: string, toStr?: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const { sessionClaims } = await auth();
    let targetUserId = userId;
    const role = (sessionClaims?.metadata as any)?.role;
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;
    if (role === 'CASHIER' && metaTenantId) {
      targetUserId = metaTenantId;
    }
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      targetUserId = employee.tenantId;
    }
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
      where: { userId: targetUserId, createdAt: dateFilter },
      select: { createdAt: true },
    });

    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourCounts[i] = 0;
    
    transactions.forEach(t => {
      // Konversi UTC ke UTC+7 (Asia/Jakarta)
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        hour12: false
      });
      let hourStr = formatter.format(t.createdAt);
      if (hourStr === '24') hourStr = '0'; // Handle '24' formatting issue in some JS engines
      const hour = parseInt(hourStr, 10);
      
      if (!isNaN(hour) && hour >= 0 && hour <= 23) {
        hourCounts[hour]++;
      }
    });
    
    const busyHours = Object.keys(hourCounts)
      .map(hour => ({
        hour: `${hour.padStart(2, '0')}:00`,
        count: hourCounts[parseInt(hour)]
      }))
      .filter(h => h.count > 0);

    // 2. Data Analitik Produk (Top & Bottom)
    // Tarik semua produk master untuk memastikan produk dengan 0 penjualan tetap masuk kalkulasi
    const allProducts = await prisma.product.findMany({
      where: { userId: targetUserId },
      select: { id: true, name: true, description: true, category: true }
    });

    const statsMap = new Map<number, { name: string, qty: number }>();
    allProducts.forEach(p => {
      statsMap.set(p.id, { name: p.name, qty: 0 });
    });

    const transactionItems = await prisma.transactionItem.groupBy({
      by: ['productId'],
      _sum: { qty: true },
      where: { 
        transaction: { 
          userId: targetUserId,
          createdAt: dateFilter
        } 
      }
    });
    
    transactionItems.forEach(item => {
      if (statsMap.has(item.productId)) {
        statsMap.get(item.productId)!.qty += (item._sum.qty || 0);
      } else {
        statsMap.set(item.productId, { name: 'Produk Dihapus', qty: item._sum.qty || 0 });
      }
    });
    
    const productStats = Array.from(statsMap.values());

    const topProducts = [...productStats].sort((a, b) => b.qty - a.qty).slice(0, 5);
    const bottomProducts = [...productStats].sort((a, b) => a.qty - b.qty).slice(0, 5);

    // 3. Stok Menipis
    const lowStock = await prisma.product.findMany({
      where: { userId: targetUserId, stock: { lte: 10 }, isArchived: false },
      select: { name: true, stock: true },
      orderBy: { stock: 'asc' },
      take: 10
    });

    // 4. Performa Kasir (Group by userId)
    const cashierStats = await prisma.transaction.groupBy({
      by: ['userId'],
      _sum: { total: true },
      where: { userId: targetUserId, createdAt: dateFilter }
    });

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { name: true, category: true }
    });

    const effectiveCategory = resolveBusinessCategory(tenant?.category, tenant?.name, allProducts);

    return {
      busyHours,
      topProducts,
      bottomProducts,
      lowStock,
      category: effectiveCategory,
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

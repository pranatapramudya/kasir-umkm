import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;
    
    const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
    const selectedDateStr = dateParam || nowStr;
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

    const allTransactions = await prisma.transaction.findMany({
      where: whereClause,
      select: { total: true, method: true, items: true }
    });

    const targetProductUserId = role === 'CASHIER' ? (sessionClaims?.metadata as any)?.tenantId : userId;
    const products = await prisma.product.findMany({
      where: { userId: targetProductUserId },
      select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    let totalGross = 0;
    let totalCash = 0;
    let totalQRIS = 0;
    const soldSummary: Record<string, number> = {};

    allTransactions.forEach(t => {
      totalGross += t.total;
      const methodStr = (t.method || '').toUpperCase();
      if (methodStr === 'CASH' || methodStr === 'TUNAI') totalCash += t.total;
      if (methodStr === 'QRIS') totalQRIS += t.total;
      
      t.items.forEach(item => {
        const name = productMap.get(item.productId) || 'Produk Dihapus';
        soldSummary[name] = (soldSummary[name] || 0) + item.qty;
      });
    });

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: true }
      }),
      prisma.transaction.count({ where: whereClause })
    ]);

    transactions.forEach(tx => {
      tx.items.forEach((item: any) => {
        item.productName = productMap.get(item.productId) || 'Produk Dihapus';
      });
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({ 
      transactions, 
      totalPages,
      metrics: { totalGross, totalCash, totalQRIS },
      soldSummary
    });

  } catch (error) {
    console.error("GET Shift Report error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

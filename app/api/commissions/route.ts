import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const { searchParams } = new URL(request.url);
    const startDateStr = searchParams.get('start');
    const endDateStr = searchParams.get('end');

    let dateFilter: any = {};
    if (startDateStr) {
      const startDate = new Date(startDateStr);
      if (!isNaN(startDate.getTime())) {
        dateFilter.gte = startDate;
      }
    }
    
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      if (!isNaN(endDate.getTime())) {
        // Sertakan seluruh waktu pada hari terakhir
        endDate.setHours(23, 59, 59, 999);
        dateFilter.lte = endDate;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: targetUserId,
        status: 'completed',
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      },
      include: {
        items: true
      }
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

    const data = Object.values(commissionByWorker).sort((a, b) => b.totalCommission - a.totalCommission);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("GET Commissions error:", error);
    return NextResponse.json({ error: "Gagal memuat rekap komisi", details: error.message }, { status: 500 });
  }
}

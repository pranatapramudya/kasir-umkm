import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET: Ambil daftar pesanan aktif untuk layar dapur
export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

    let activeTenantId = userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      activeTenantId = employee.tenantId;
    } else if (role === 'CASHIER' && metaTenantId) {
      activeTenantId = metaTenantId;
    }

    // Ambil transaksi aktif (pending, cooking, ready) dalam 24 jam terakhir agar shift malam / lintas tanggal tetap aman
    const sinceTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orders = await prisma.transaction.findMany({
      where: {
        userId: activeTenantId,
        createdAt: { gte: sinceTime },
        status: { in: ['pending', 'cooking', 'ready'] },
      },
      include: {
        table: true,
        items: true,
      },
      orderBy: { createdAt: 'asc' }, // Urutkan dari yang paling awal pesan
    });

    // Ambil detail nama produk untuk tiap item
    const productIds = Array.from(new Set(orders.flatMap(o => o.items.map(i => i.productId))));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, category: true },
    });
    const productMap = new Map(products.map(p => [p.id, p]));

    const formattedOrders = orders.map(o => ({
      id: o.id,
      customerName: o.customerName,
      status: o.status,
      tableName: o.table ? o.table.name : 'Takeaway / Bungkus',
      createdAt: o.createdAt.toISOString(),
      items: o.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: productMap.get(item.productId)?.name || `Produk #${item.productId}`,
        qty: item.qty,
        note: item.note || '',
      })),
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (err: any) {
    console.error('Error fetching kitchen orders:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH: Update status pesanan (pending -> cooking -> ready -> completed)
export async function PATCH(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

    let activeTenantId = userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      activeTenantId = employee.tenantId;
    } else if (role === 'CASHIER' && metaTenantId) {
      activeTenantId = metaTenantId;
    }

    const body = await request.json();
    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    const validStatuses = ['pending', 'cooking', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Status tidak valid' }, { status: 400 });
    }

    const updated = await prisma.transaction.updateMany({
      where: {
        id: String(transactionId),
        userId: activeTenantId,
      },
      data: { status },
    });

    if (updated.count === 0) {
      return NextResponse.json({ success: false, message: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    // Broadcast WebSocket event for real-time KDS update
    try {
      const { broadcastToTenant } = await import('../../../scripts/websocket-server');
      broadcastToTenant(activeTenantId, {
        type: 'order_status_update',
        transactionId: String(transactionId),
        status,
        timestamp: Date.now()
      });
    } catch (wsErr) {
      console.warn('[WS] Broadcast failed (server may not be running):', wsErr);
    }

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    console.error('Error updating kitchen order status:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
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

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;

    // Filter tanggal ketat (hanya rentang shift hari ini atau tanggal dipilih)
    const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
    const selectedDateStr = dateParam || nowStr;
    const startOfDay = new Date(`${selectedDateStr}T00:00:00+07:00`);
    const endOfDay = new Date(`${selectedDateStr}T23:59:59.999+07:00`);

    // Resolve tenant
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    const isEmployee = !!employee;
    const activeTenantId = employee ? employee.tenantId : userId;

    const tenant = await prisma.tenant.findUnique({ where: { userId: activeTenantId } });
    const isRental = tenant?.category === "Rental & Travel" || tenant?.category === "RENTAL";

    const whereClause: any = {
      userId: activeTenantId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    };

    if (isEmployee) {
      whereClause.cashierId = employee.id;
    }

    // 1. Jalankan semua query secara paralel — satu kali sentuh DB per kebutuhan
    const [
      methodGroups,       // Metrics (totalGross, totalCash, totalQRIS) groupBy method
      partialTransactions,// Partial transactions perlu kalkulasi downPayment khusus
      soldSummaryRaw,     // soldSummary — groupBy productId di DB
      transactions,       // Halaman transaksi untuk tampilan tabel
      totalCount,         // COUNT untuk pagination
      products,           // Mapping productId → name
      bookingDPGroups,    // DP dari Booking (khusus Rental)
      bookingTransactions // List DP Booking (khusus Rental)
    ] = await Promise.all([
      // A. Metrics per metode pembayaran — kalkulasi SUM di Database Engine
      prisma.transaction.groupBy({
        by: ['method'],
        where: { ...whereClause, status: { not: 'partial' } },
        _sum: { total: true },
        _count: { id: true },
      }),

      // B. Partial transactions (subset kecil) — perlu downPayment sebagai effective total
      prisma.transaction.findMany({
        where: { ...whereClause, status: 'partial' },
        select: { total: true, method: true, downPayment: true },
      }),

      // C. Sold Summary — groupBy productId di Database, bukan iterasi JS
      prisma.transactionItem.groupBy({
        by: ['productId'],
        where: {
          transaction: whereClause,
        },
        _sum: { qty: true },
      }),

      // D. Paginated transactions untuk tabel detail
      prisma.transaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: true },
      }),

      // E. Total count untuk pagination
      prisma.transaction.count({ where: whereClause }),

      // F. Product name mapping
      prisma.product.findMany({
        where: { userId: activeTenantId },
        select: { id: true, name: true },
      }),

      // G. DP Booking Metrics (Khusus Rental)
      isRental ? prisma.booking.groupBy({
        by: ['paymentMethod'],
        where: { userId: activeTenantId, createdAt: { gte: startOfDay, lte: endOfDay }, downPayment: { gt: 0 } },
        _sum: { downPayment: true },
      }) : Promise.resolve([]),

      // H. DP Booking Transactions (Khusus Rental)
      isRental ? prisma.booking.findMany({
        where: { userId: activeTenantId, createdAt: { gte: startOfDay, lte: endOfDay }, downPayment: { gt: 0 } },
        orderBy: { createdAt: 'desc' },
      }) : Promise.resolve([]),
    ]);

    // 2. Hitung metrics dari hasil groupBy (sudah diagregasi di Database)
    let totalGross = 0;
    let totalCash = 0;
    let totalQRIS = 0;

    // Non-partial: ambil dari groupBy results
    methodGroups.forEach(group => {
      const sum = group._sum.total ?? 0;
      totalGross += sum;
      const methodStr = (group.method || '').toUpperCase();
      if (methodStr === 'CASH' || methodStr === 'TUNAI') totalCash += sum;
      if (methodStr === 'QRIS') totalQRIS += sum;
    });

    // Partial: effective total = downPayment
    partialTransactions.forEach(t => {
      const effectiveTotal = t.downPayment > 0 ? t.downPayment : t.total;
      totalGross += effectiveTotal;
      const methodStr = (t.method || '').toUpperCase();
      if (methodStr === 'CASH' || methodStr === 'TUNAI') totalCash += effectiveTotal;
      if (methodStr === 'QRIS') totalQRIS += effectiveTotal;
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

    // 3. Build soldSummary dari groupBy result — tanpa iterasi nested items di JS
    const productMap = new Map(products.map(p => [p.id, p.name]));
    const soldSummary: Record<string, number> = {};
    soldSummaryRaw.forEach(item => {
      const name = productMap.get(item.productId) || 'Produk Dihapus';
      soldSummary[name] = (soldSummary[name] || 0) + (item._sum.qty ?? 0);
    });

    // 4. Inject productName ke items transaksi (untuk tampilan tabel)
    transactions.forEach(tx => {
      tx.items.forEach((item: any) => {
        item.productName = productMap.get(item.productId) || 'Produk Dihapus';
      });
    });

    // 5. Gabungkan DP Booking ke transaksi riwayat (Khusus Rental)
    if (isRental && bookingTransactions.length > 0) {
      const mappedBookings = bookingTransactions.map((b: any) => {
        const pName = b.productId ? productMap.get(b.productId) : 'Booking';
        return {
          id: b.id,
          createdAt: b.createdAt,
          customerName: b.customerName,
          method: b.paymentMethod || 'TUNAI',
          status: 'partial',
          total: b.downPayment,
          discount: 0,
          items: [
            {
              productId: b.productId,
              productName: `DP - ${pName || 'Rental'}`,
              qty: 1,
              price: b.downPayment,
              note: 'Down Payment (Booking)'
            }
          ]
        };
      });

      (transactions as any[]).push(...mappedBookings);
      // Sort ulang berdasarkan createdAt descending
      transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({
      transactions,
      totalPages,
      metrics: { totalGross, totalCash, totalQRIS },
      soldSummary,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("GET /api/reports/shift error:", message, stack);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memuat laporan shift. Silakan coba lagi.", detail: message },
      { status: 500 }
    );
  }
}


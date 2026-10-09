import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve tenantId (same pattern as other pages)
    let tenantId = (sessionClaims?.metadata as unknown as { tenantId?: string })?.tenantId || userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      tenantId = employee.tenantId;
    }

    const rawBookings = await prisma.booking.findMany({
      where: {
        userId: tenantId,
        status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS", "FINISHED"] }
      },
      include: {
        product: { select: { name: true, hargaJual: true } }
      },
      orderBy: { startDate: "asc" }
    });

    const rawTransactions = await prisma.transaction.findMany({
      where: {
        userId: tenantId,
        startDate: { not: null },
        status: { not: "CANCELLED" }
      },
      include: {
        items: true
      },
      orderBy: { startDate: "asc" }
    });

    const productIds = Array.from(new Set(rawTransactions.flatMap(tx => tx.items.map(i => i.productId))));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    const now = new Date();

    const bookings = rawBookings.map(b => {
      let derivedStatus: "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE" = "COMPLETED";
      const start = b.startDate || b.bookingDate;
      const end = b.endDate || b.bookingDate;

      const safeStart = start ? start.toISOString() : new Date().toISOString();
      const safeEnd = end ? end.toISOString() : new Date().toISOString();

      const startDateObj = start ? new Date(start) : now;
      const endDateObj = end ? new Date(end) : now;

      // Status otomatis berbasis waktu:
      if (b.status === "FINISHED" || (b.status as unknown as string) === "CANCELLED") {
        derivedStatus = "FINISHED";
      } else if (b.status === "PENDING") {
        // Reservasi Baru Masuk Online: Tetap PENDING agar admin/owner bisa klik ACC / Setujui!
        derivedStatus = "PENDING";
      } else if (now > endDateObj) {
        // Lewat waktu sewa / check-out tapi belum di-finish oleh admin
        derivedStatus = "OVERDUE";
      } else if (now >= startDateObj && now <= endDateObj) {
        // Sedang berlangsung (Tamu menginap / Armada sedang jalan / Alat sedang disewa)
        derivedStatus = "IN_PROGRESS";
      } else {
        // Belum masuk jam sewa (Terjadwal / Siap Check-in)
        derivedStatus = "COMPLETED";
      }

      return {
        id: b.id,
        customerName: b.customerName,
        customerPhone: b.customerPhone || undefined,
        itemName: b.product?.name || "Tanpa Armada",
        startDate: safeStart,
        endDate: safeEnd,
        status: derivedStatus,
        pickupLocation: b.pickupLocation || undefined,
        dropoffLocation: b.dropoffLocation || undefined,
        pickupTime: b.pickupTime || (b.startDate ? b.startDate.toISOString().slice(11, 16) : undefined),
        returnTime: b.returnTime || (b.endDate ? b.endDate.toISOString().slice(11, 16) : undefined),
        notes: b.notes || undefined,
        deposit: b.deposit || undefined,
        downPayment: b.downPayment || undefined,
        total: b.product?.hargaJual || undefined,
        remainingBalance: (b.product?.hargaJual && b.downPayment && b.downPayment > 0)
          ? Math.max(0, b.product.hargaJual - b.downPayment)
          : (b.notes?.includes('[PELUNASAN_DP_LUNAS') ? 0 : undefined),
        conditionNotes: b.conditionNotes || undefined,
        source: "ONLINE" as const
      };
    });

    const txBookings = rawTransactions.map(tx => {
      const start = tx.startDate;
      const end = tx.endDate || tx.startDate;

      if (!start || !end) {
        return null;
      }

      let startDateObj = new Date(start);
      let endDateObj = new Date(end);

      if (tx.pickupTime) {
        const dStr = startDateObj.toISOString().split('T')[0];
        const combinedStart = new Date(`${dStr}T${tx.pickupTime}:00+07:00`);
        if (!isNaN(combinedStart.getTime())) startDateObj = combinedStart;
      }

      if (tx.returnTime) {
        const dStr = endDateObj.toISOString().split('T')[0];
        const combinedEnd = new Date(`${dStr}T${tx.returnTime}:00+07:00`);
        if (!isNaN(combinedEnd.getTime())) endDateObj = combinedEnd;
      }

      let derivedStatus: "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE" = "FINISHED";

      // Transaksi POS kasir:
      // Jika status transaksi sudah completed/FINISHED, status KALENDER adalah FINISHED (Selesai & Lunas)!
      if (tx.status === "FINISHED" || (tx.conditionNotes && tx.conditionNotes.includes("[RENTAL_SELESAI]"))) {
        derivedStatus = "FINISHED";
      } else if (now > endDateObj) {
        derivedStatus = "OVERDUE";
      } else if (now >= startDateObj && now <= endDateObj) {
        derivedStatus = "IN_PROGRESS";
      } else {
        derivedStatus = "COMPLETED";
      }

      return {
        id: tx.id,
        customerName: tx.customerName || "Pelanggan POS",
        customerPhone: tx.customerPhone || undefined,
        itemName: tx.items.map(i => productMap.get(i.productId) || `Produk ${i.productId}`).join(", ") || "Transaksi POS",
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        status: derivedStatus,
        pickupLocation: tx.pickupLocation || undefined,
        dropoffLocation: tx.dropoffLocation || undefined,
        pickupTime: tx.pickupTime || undefined,
        returnTime: tx.returnTime || undefined,
        driverName: tx.driverName || undefined,
        licensePlate: tx.licensePlate || undefined,
        guarantee: tx.guarantee || undefined,
        deposit: tx.deposit || undefined,
        downPayment: tx.downPayment || undefined,
        remainingBalance: tx.remainingBalance || undefined,
        total: tx.total || undefined,
        conditionNotes: tx.conditionNotes || undefined,
        method: tx.method || undefined,
      source: "POS" as const
      };
    }).filter((b): b is NonNullable<typeof b> => b !== null);

    const allBookings = [...bookings, ...txBookings].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error("Fetch calendar error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

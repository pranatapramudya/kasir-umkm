import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/booking/check-slots?date=YYYY-MM-DD&slug=nama-toko&productId=123
 * Mengembalikan array jam yang sudah terisi pada tanggal tersebut.
 * Mendukung booking jasa (per slot), rental transit (per jam), dan rental harian (multi-hari).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const slug = searchParams.get("slug");
    const productId = searchParams.get("productId");

    if (!date || !slug) {
      return NextResponse.json(
        { error: "Parameter 'date' dan 'slug' wajib diisi." },
        { status: 400 }
      );
    }

    // Validasi format tanggal YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Format tanggal tidak valid. Gunakan YYYY-MM-DD." },
        { status: 400 }
      );
    }

    // 1. Cari tenant berdasarkan slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { userId: true },
    });

    if (!tenant) {
      return NextResponse.json({ bookedSlots: [] });
    }

    // 2. Tentukan rentang hari dalam UTC untuk waktu Indonesia WIB (UTC+7)
    // 00:00:00 WIB = 17:00:00 UTC hari sebelumnya
    // 23:59:59 WIB = 16:59:59 UTC hari yang sama
    const [y, m, d] = date.split("-").map(Number);
    const dayStartUtc = new Date(Date.UTC(y, m - 1, d, 0 - 7, 0, 0, 0));
    const dayEndUtc = new Date(Date.UTC(y, m - 1, d, 23 - 7, 59, 59, 999));

    // Standard time slots untuk perbandingan
    const allSlots: string[] = [];
    for (let h = 0; h < 24; h++) {
      allSlots.push(`${String(h).padStart(2, "0")}:00`);
      allSlots.push(`${String(h).padStart(2, "0")}:30`);
    }

    const bookedSlotsSet = new Set<string>();

    const prodIdNum = productId ? Number(productId) : undefined;

    // 3. Query Booking Online (Aktif)
    const bookings = await prisma.booking.findMany({
      where: {
        userId: tenant.userId,
        status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS", "FINISHED"] },
        ...(prodIdNum ? { productId: prodIdNum } : {}),
        OR: [
          {
            bookingDate: {
              gte: dayStartUtc,
              lte: dayEndUtc,
            },
          },
          {
            startDate: { lte: dayEndUtc },
            endDate: { gte: dayStartUtc },
          },
        ],
      },
      select: { bookingDate: true, startDate: true, endDate: true },
    });

    // 4. Query Transaksi Offline / Kasir POS (Aktif)
    const txWhere: any = {
      userId: tenant.userId,
      status: { not: "CANCELLED" },
      startDate: { lte: dayEndUtc },
      endDate: { gte: dayStartUtc },
    };
    if (prodIdNum) {
      txWhere.items = { some: { productId: prodIdNum } };
    }

    const transactions = await prisma.transaction.findMany({
      where: txWhere,
      select: { startDate: true, endDate: true },
    });

    // Helper untuk memproses interval sewa (startDate & endDate)
    const processRange = (startRaw: Date, endRaw: Date) => {
      const start = new Date(startRaw);
      const end = new Date(endRaw);

      // Cek apakah booking ini mencakup seluruh hari (Full Day Daily Booking)
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const isMultiDay = start < dayStartUtc && end > dayEndUtc;
      const isWholeDay = diffHours >= 20 || isMultiDay;

      if (isWholeDay) {
        allSlots.forEach((s) => bookedSlotsSet.add(s));
        return;
      }

      // Transit / Hourly booking: tandai slot waktu yang beririsan di hari ini
      allSlots.forEach((slot) => {
        const [slotH, slotM] = slot.split(":").map(Number);
        const slotUtc = new Date(Date.UTC(y, m - 1, d, slotH - 7, slotM, 0, 0));
        const slotEndUtc = new Date(slotUtc.getTime() + 30 * 60 * 1000);

        // Jika slot 30 menit beririsan dengan [start, end]
        if (slotUtc < end && slotEndUtc > start) {
          bookedSlotsSet.add(slot);
        }
      });
    };

    // Proses bookings
    bookings.forEach((b) => {
      if (b.startDate && b.endDate) {
        processRange(b.startDate, b.endDate);
      } else if (b.bookingDate) {
        // Jasa / Single Slot
        const dObj = new Date(b.bookingDate);
        const wibHours = (dObj.getUTCHours() + 7) % 24;
        const minutes = dObj.getUTCMinutes();
        bookedSlotsSet.add(
          `${String(wibHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        );
      }
    });

    // Proses transactions
    transactions.forEach((tx) => {
      if (tx.startDate && tx.endDate) {
        processRange(tx.startDate, tx.endDate);
      }
    });

    return NextResponse.json({ bookedSlots: Array.from(bookedSlotsSet) });
  } catch (error) {
    console.error("GET /api/booking/check-slots error:", error);
    return NextResponse.json(
      { error: "Gagal mengecek ketersediaan slot." },
      { status: 500 }
    );
  }
}

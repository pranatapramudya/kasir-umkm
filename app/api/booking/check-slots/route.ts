import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/booking/check-slots?date=YYYY-MM-DD&slug=nama-toko
 * Mengembalikan array jam yang sudah terisi pada tanggal tersebut.
 * Format response: { bookedSlots: ["09:00", "14:30"] }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const slug = searchParams.get("slug");

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
      // Kembalikan array kosong — slug mungkin belum diatur
      return NextResponse.json({ bookedSlots: [] });
    }

    // 2. Tentukan rentang tanggal: dari 00:00:00 sampai 23:59:59 UTC
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // 3. Query semua booking aktif (PENDING / COMPLETED) pada tanggal itu
    const bookings = await prisma.booking.findMany({
      where: {
        userId: tenant.userId,
        bookingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ["PENDING", "COMPLETED"] },
      },
      select: { bookingDate: true },
    });

    // 4. Ekstrak jam:menit dalam format "HH:MM" (WIB = UTC+7)
    const bookedSlots = bookings.map((b) => {
      const d = new Date(b.bookingDate);
      // Konversi ke WIB (UTC+7)
      const wibHours = (d.getUTCHours() + 7) % 24;
      const minutes = d.getUTCMinutes();
      return `${String(wibHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    });

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("GET /api/booking/check-slots error:", error);
    return NextResponse.json(
      { error: "Gagal mengecek ketersediaan slot." },
      { status: 500 }
    );
  }
}

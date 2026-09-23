import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const serviceId = searchParams.get("serviceId");

    if (!slug) {
      return NextResponse.json(
        { error: "Parameter 'slug' wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cari tenant berdasarkan slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { userId: true },
    });

    if (!tenant) {
      return NextResponse.json({ bookedRanges: [] });
    }

    const whereClause: any = {
      userId: tenant.userId,
      status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS"] }, // FINISHED diabaikan
      startDate: { not: null },
      endDate: { not: null },
    };

    if (serviceId) {
      whereClause.productId = Number(serviceId);
    }

    // Menggunakan offset hari ini
    const today = new Date();
    // Kita biarkan filter pada UTC tapi kurangi 1 hari agar aman
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1); // Buffer timezone
    whereClause.endDate = { gte: today };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: { startDate: true, endDate: true },
    });

    const txWhereClause: any = {
      userId: tenant.userId,
      status: { not: "CANCELLED" },
      startDate: { not: null },
      endDate: { gte: today },
    };

    if (serviceId) {
      txWhereClause.items = {
        some: {
          productId: Number(serviceId),
        },
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: txWhereClause,
      select: { startDate: true, endDate: true },
    });

    const bookedRanges = [
      ...bookings.map((b) => ({
        startDate: b.startDate,
        endDate: b.endDate,
      })),
      ...transactions.map((tx) => ({
        startDate: tx.startDate,
        endDate: tx.endDate,
      })),
    ];

    return NextResponse.json({ bookedRanges });
  } catch (error) {
    console.error("GET /api/booking/availability error:", error);
    return NextResponse.json(
      { error: "Gagal mengecek ketersediaan rental." },
      { status: 500 }
    );
  }
}

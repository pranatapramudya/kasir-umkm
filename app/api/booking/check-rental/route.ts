import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/booking/check-rental?slug=nama-toko&productId=123
 * Mengembalikan array rentang waktu yang sudah disewa.
 * Format response: { bookedRanges: [{ startDate: "2026-08-15T00:00:00.000Z", endDate: "2026-08-18T00:00:00.000Z" }] }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const productId = searchParams.get("productId");

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
      status: { in: ["PENDING", "COMPLETED", "FINISHED"] }, // Ambil yang aktif
      startDate: { not: null },
      endDate: { not: null },
    };

    if (productId) {
      whereClause.productId = Number(productId);
    }

    // 2. Query semua booking aktif untuk rental ini yang punya endDate di masa depan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

    if (productId) {
      txWhereClause.items = {
        some: {
          productId: Number(productId),
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
    console.error("GET /api/booking/check-rental error:", error);
    return NextResponse.json(
      { error: "Gagal mengecek ketersediaan rental." },
      { status: 500 }
    );
  }
}

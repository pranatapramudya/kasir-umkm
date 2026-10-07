import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { isRentalTravelCategory } from "@/lib/business-category";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { category: true }
    });
    const isJasa = tenant?.category === "Jasa / Servis" || tenant?.category === "Jasa/Servis" || tenant?.category === "JASA";
    const isRental = isRentalTravelCategory(tenant?.category);

    // PENTING: PENDING harus selalu diikutsertakan agar pesanan online baru langsung muncul dan bisa ditarik kasir
    const validStatuses = ["PENDING", "COMPLETED", "IN_PROGRESS"];

    let dateFilter: any = {};

    if (dateParam === "all") {
      // Tampilkan seluruh antrean / pesanan tanpa batas tanggal
      dateFilter = {};
    } else {
      let startOfToday: Date;
      let endOfToday: Date;

      if (dateParam) {
        const parts = dateParam.split("-").map(Number);
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          startOfToday = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
          endOfToday = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
        } else {
          const now = new Date();
          startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
          endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        }
      } else {
        const now = new Date();
        startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      }

      if (isRental) {
        dateFilter = {
          OR: [
            // Berangkat pada tanggal ini
            {
              startDate: {
                gte: startOfToday,
                lte: endOfToday,
              },
            },
            // Atau rentang perjalanan mencakup tanggal ini
            {
              startDate: { lte: endOfToday },
              endDate: { gte: startOfToday },
            },
            // Atau tanggal pesanan dibuat / kunjungan pada tanggal ini
            {
              bookingDate: {
                gte: startOfToday,
                lte: endOfToday,
              },
            },
          ],
        };
      } else {
        dateFilter = {
          bookingDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        };
      }
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: targetUserId,
        status: { in: validStatuses as any },
        ...dateFilter,
      },
      include: {
        product: true,
      },
      orderBy: isRental ? { startDate: "asc" } : { bookingDate: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching today's bookings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

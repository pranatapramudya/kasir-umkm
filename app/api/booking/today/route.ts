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
    
    let targetDate = new Date();
    if (dateParam) {
      targetDate = new Date(dateParam);
    }
    
    const startOfToday = new Date(targetDate);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(targetDate);
    endOfToday.setHours(23, 59, 59, 999);

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { category: true }
    });
    const isJasa = tenant?.category === "Jasa / Servis";
    const isRental = isRentalTravelCategory(tenant?.category);

    const validStatuses = isJasa 
      ? ["PENDING", "COMPLETED"] 
      : isRental 
        ? ["COMPLETED", "IN_PROGRESS"]
        : ["COMPLETED"];

      const bookings = await prisma.booking.findMany({
        where: {
          userId: targetUserId,
          status: { in: validStatuses as any },
          bookingDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      include: {
        product: true,
      },
      orderBy: {
        bookingDate: "asc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching today's bookings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const count = await prisma.booking.count({
      where: {
        userId: targetUserId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET /api/booking/pending-count error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

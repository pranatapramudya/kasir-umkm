import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// [PATCH] Update pengaturan jadwal booking (jam operasional & durasi jeda slot)
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingOpenTime, bookingCloseTime, bookingSlotDuration } = body;

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { id: true, slug: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Data toko tidak ditemukan." },
        { status: 404 }
      );
    }

    // Validasi sederhana format HH:MM
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const validOpen = timeRegex.test(bookingOpenTime) ? bookingOpenTime : "08:00";
    const validClose = timeRegex.test(bookingCloseTime) ? bookingCloseTime : "21:00";
    const validDuration = [15, 30, 45, 60, 90, 120].includes(Number(bookingSlotDuration))
      ? Number(bookingSlotDuration)
      : 30;

    const updated = await prisma.tenant.update({
      where: { userId: targetUserId },
      data: {
        bookingOpenTime: validOpen,
        bookingCloseTime: validClose,
        bookingSlotDuration: validDuration,
      },
      select: {
        bookingOpenTime: true,
        bookingCloseTime: true,
        bookingSlotDuration: true,
      },
    });

    revalidatePath("/admin/settings");
    if (tenant.slug) {
      revalidatePath(`/book/${tenant.slug}`);
    }

    return NextResponse.json({
      success: true,
      ...updated,
    });
  } catch (error) {
    console.error("PATCH /api/tenant/booking-schedule error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menyimpan jadwal booking." },
      { status: 500 }
    );
  }
}

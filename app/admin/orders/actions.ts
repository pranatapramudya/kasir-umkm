"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function approveOrder(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  // Determine actual tenantId
  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  if (employee) targetUserId = employee.tenantId;

  // We should also ensure startDate and endDate are valid.
  // We can default them to bookingDate if they are missing.
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { success: false, error: "Booking tidak ditemukan" };

  await prisma.booking.update({
    where: { id },
    data: { 
      status: "COMPLETED",
      startDate: booking.startDate ?? booking.bookingDate,
      endDate: booking.endDate ?? booking.bookingDate,
    },
  });

  return { success: true };
}

export async function rejectOrder(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}

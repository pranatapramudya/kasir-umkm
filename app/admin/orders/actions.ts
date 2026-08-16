"use server";
import { revalidatePath } from "next/cache";

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

export async function finishOrder(id: string, overtimeFee: number) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  if (employee) targetUserId = employee.tenantId;

  const booking = await prisma.booking.findUnique({ 
    where: { id },
    include: { product: true }
  });
  if (!booking) return { success: false, error: "Booking tidak ditemukan" };

  const start = booking.startDate ?? booking.bookingDate;
  const end = booking.endDate ?? booking.bookingDate;
  const diffTime = end.getTime() - start.getTime();
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 1) diffDays = 1;

  const basePrice = booking.product ? booking.product.hargaJual * diffDays : 0;
  const total = basePrice + overtimeFee;

  const transactionId = `TRX-${Date.now()}`;
  
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id },
      data: {
        status: "FINISHED",
        overtimeFee,
      }
    });

    await tx.transaction.create({
      data: {
        id: transactionId,
        userId: targetUserId,
        timestamp: Date.now(),
        customerName: booking.customerName,
        cashierId: employee ? employee.id : null,
        total: total,
        method: "TUNAI",
        status: "completed",
        startDate: start,
        endDate: end,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        items: {
          create: booking.productId ? [
            {
              productId: booking.productId,
              qty: diffDays,
              price: booking.product?.hargaJual || 0,
            }
          ] : []
        }
      }
    });
  });

  return { success: true };
}

export async function startOrder(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false };

    await prisma.booking.update({
      where: { id, userId },
      data: { 
        status: "IN_PROGRESS",
        actualStartedAt: new Date(),
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to start order:", error);
    return { success: false };
  }
}

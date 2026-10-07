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

export async function finishOrder(id: string, overtimeFee: number, paymentMethod: string = "TUNAI") {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  if (employee) targetUserId = employee.tenantId;

  const fee = Number(overtimeFee) || 0;

  // 1. Cek apakah ini transaksi yang dibuat dari Kasir POS (misal id: "#6882" atau sejenisnya)
  const tx = await prisma.transaction.findFirst({
    where: {
      id,
      userId: targetUserId
    }
  });

  if (tx) {
    const newTotal = (tx.total || 0) + fee;
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "completed",
        remainingBalance: 0,
        total: newTotal,
        method: paymentMethod || tx.method || "TUNAI",
      }
    });

    revalidatePath("/admin/rental-calendar");
    revalidatePath("/admin/orders");
    return { success: true, transactionId: tx.id };
  }

  // 2. Jika bukan transaksi POS, cek tabel booking (reservasi online)
  const booking = await prisma.booking.findUnique({ 
    where: { id },
    include: { product: true }
  });
  if (!booking) return { success: false, error: "Pesanan sewa tidak ditemukan" };

  const start = booking.startDate ?? booking.bookingDate;
  const now = new Date();
  const end = now;
  const diffTime = end.getTime() - start.getTime();
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 1) diffDays = 1;

  const basePrice = booking.product ? booking.product.hargaJual * diffDays : 0;
  const total = basePrice + fee;

  const transactionId = `TRX-${Date.now()}`;
  
  await prisma.$transaction(async (prismaTx) => {
    await prismaTx.booking.update({
      where: { id },
      data: {
        status: "FINISHED",
        overtimeFee: fee,
        endDate: now,
      }
    });

    await prismaTx.transaction.create({
      data: {
        id: transactionId,
        userId: targetUserId,
        timestamp: Date.now(),
        customerName: booking.customerName,
        cashierId: employee ? employee.id : null,
        total: total,
        method: paymentMethod || "TUNAI",
        status: "completed",
        startDate: start,
        endDate: end,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        remainingBalance: 0,
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

  revalidatePath("/admin/rental-calendar");
  revalidatePath("/admin/orders");
  return { success: true, transactionId };
}

export async function startOrder(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false };

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) targetUserId = employee.tenantId;

    const now = new Date();
    await prisma.booking.update({
      where: { id },
      data: { 
        status: "IN_PROGRESS",
        startDate: now,
        actualStartedAt: now,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to start order:", error);
    return { success: false };
  }
}

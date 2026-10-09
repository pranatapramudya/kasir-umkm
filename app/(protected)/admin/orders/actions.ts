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

export async function finishOrder(
  id: string, 
  overtimeFee: number, 
  paymentMethod: string = "TUNAI",
  keepRemainingDebt: boolean = false
) {
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
    const finalRemaining = keepRemainingDebt ? ((tx.remainingBalance || 0) + fee) : 0;
    const tag = keepRemainingDebt ? "[RENTAL_SELESAI] | [STATUS_PIUTANG]" : "[RENTAL_SELESAI]";
    const existingNotes = tx.conditionNotes || "";
    const updatedNotes = [existingNotes, tag].filter(Boolean).join(" | ");

    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "FINISHED",
        remainingBalance: finalRemaining,
        total: newTotal,
        method: keepRemainingDebt ? (tx.method ? `${tx.method} (Ada Piutang)` : "PIUTANG") : (paymentMethod || tx.method || "TUNAI"),
        conditionNotes: updatedNotes,
      }
    });

    revalidatePath("/admin/rental-calendar");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/transactions");
    revalidatePath("/laporan-kasir");
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
  const downPayment = booking.downPayment || 0;
  const finalRemaining = keepRemainingDebt ? Math.max(0, total - downPayment) : 0;

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
        downPayment: downPayment,
        method: keepRemainingDebt ? "PIUTANG" : (paymentMethod || "TUNAI"),
        status: keepRemainingDebt ? "partial" : "completed",
        startDate: start,
        endDate: end,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        remainingBalance: finalRemaining,
        conditionNotes: keepRemainingDebt 
          ? `ONLINE_BOOKING:${booking.id} | [RENTAL_SELESAI] | [STATUS_PIUTANG]` 
          : `ONLINE_BOOKING:${booking.id} | [RENTAL_SELESAI]`,
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
  revalidatePath("/admin/transactions");
  revalidatePath("/laporan-kasir");
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

    // 1. Cek apakah ini transaksi POS
    const tx = await prisma.transaction.findFirst({
      where: { id, userId: targetUserId }
    });

    if (tx) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          startDate: now,
          status: "pending" // Masih aktif disewa (IN_PROGRESS)
        }
      });
      revalidatePath("/admin/rental-calendar");
      revalidatePath("/admin/orders");
      return { success: true };
    }

    // 2. Jika bukan transaksi POS, update booking online
    await prisma.booking.update({
      where: { id },
      data: { 
        status: "IN_PROGRESS",
        startDate: now,
        actualStartedAt: now,
      },
    });

    revalidatePath("/admin/rental-calendar");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to start order:", error);
    return { success: false };
  }
}


export async function settleRentalBalance({
  id,
  paymentMethod = "TUNAI",
  completeRental = false,
  overtimeFee = 0,
  notes,
}: {
  id: string;
  paymentMethod?: string;
  completeRental?: boolean;
  overtimeFee?: number;
  notes?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) targetUserId = employee.tenantId;

    const fee = Number(overtimeFee) || 0;

    // 1. Cek tabel Transaction (transaksi POS atau sudah dikonversi)
    const tx = await prisma.transaction.findFirst({
      where: { id, userId: targetUserId }
    });

    if (tx) {
      const newTotal = (tx.total || 0) + fee;
      const existingNotes = tx.conditionNotes || "";
      const tag = completeRental ? "[RENTAL_SELESAI]" : "[PELUNASAN_DP_LUNAS]";
      const updatedNotes = [
        existingNotes,
        tag,
        notes ? `Catatan: ${notes}` : ""
      ].filter(Boolean).join(" | ");

      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          status: completeRental ? "FINISHED" : "completed",
          remainingBalance: 0,
          total: newTotal,
          method: tx.method ? `${tx.method} + Pelunasan: ${paymentMethod}` : paymentMethod,
          conditionNotes: updatedNotes,
        }
      });

      revalidatePath("/admin/rental-calendar");
      revalidatePath("/admin/orders");
      revalidatePath("/admin/transactions");
      revalidatePath("/laporan-kasir");
      return { success: true, transactionId: tx.id };
    }

    // 2. Cek tabel Booking (reservasi online)
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!booking) return { success: false, error: "Pesanan sewa tidak ditemukan" };

    if (completeRental) {
      return finishOrder(id, fee, paymentMethod);
    } else {
      await prisma.booking.update({
        where: { id },
        data: {
          notes: [booking.notes, `[PELUNASAN_DP_LUNAS via ${paymentMethod}]`].filter(Boolean).join(" | "),
        }
      });
      revalidatePath("/admin/rental-calendar");
      revalidatePath("/admin/orders");
      revalidatePath("/admin/transactions");
      return { success: true, bookingId: id };
    }
  } catch (error: any) {
    console.error("Error in settleRentalBalance:", error);
    return { success: false, error: error?.message || "Gagal memproses pelunasan" };
  }
}

export async function updateRentalBookingDetails({
  id,
  customerName,
  customerPhone,
  downPayment,
  notes,
  conditionNotes,
  licensePlate,
  driverName,
  guarantee,
}: {
  id: string;
  customerName?: string;
  customerPhone?: string;
  downPayment?: number;
  notes?: string;
  conditionNotes?: string;
  licensePlate?: string;
  driverName?: string;
  guarantee?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) targetUserId = employee.tenantId;

    // Cek jika ini transaksi POS
    const tx = await prisma.transaction.findFirst({
      where: { id, userId: targetUserId }
    });

    if (tx) {
      const dp = typeof downPayment === 'number' ? Math.max(0, downPayment) : (tx.downPayment || 0);
      const total = tx.total || 0;
      const remaining = Math.max(0, total - dp);

      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          customerName: customerName?.trim() || tx.customerName,
          downPayment: dp,
          remainingBalance: remaining,
          notes: notes !== undefined ? notes : tx.notes,
          conditionNotes: conditionNotes !== undefined ? conditionNotes : tx.conditionNotes,
          licensePlate: licensePlate !== undefined ? licensePlate : tx.licensePlate,
          driverName: driverName !== undefined ? driverName : tx.driverName,
          guarantee: guarantee !== undefined ? guarantee : tx.guarantee,
        }
      });

      revalidatePath('/admin/rental-calendar');
      revalidatePath('/admin/orders');
      revalidatePath('/admin/transactions');
      return { success: true };
    }

    // Cek jika ini booking online
    const booking = await prisma.booking.findFirst({
      where: { id, userId: targetUserId }
    });

    if (!booking) return { success: false, error: 'Pesanan sewa tidak ditemukan' };

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        customerName: customerName?.trim() || booking.customerName,
        customerPhone: customerPhone?.trim() || booking.customerPhone,
        downPayment: typeof downPayment === 'number' ? Math.max(0, downPayment) : booking.downPayment,
        notes: notes !== undefined ? notes : booking.notes,
        conditionNotes: conditionNotes !== undefined ? conditionNotes : booking.conditionNotes,
      }
    });

    revalidatePath('/admin/rental-calendar');
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err: any) {
    console.error('Error in updateRentalBookingDetails:', err);
    return { success: false, error: err?.message || 'Gagal memperbarui data' };
  }
}

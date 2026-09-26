import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RentalCalendarClient from "./RentalCalendarClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalender Sewa — PJTECH KASIR",
  description: "Kelola kalender sewa harian Anda.",
};

export default async function RentalCalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Resolve targetUserId
  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({
    where: { clerkUserId: userId },
  });
  if (employee) {
    targetUserId = employee.tenantId;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId },
    select: { name: true, category: true, slug: true },
  });

  if (!tenant) {
    redirect("/onboarding");
  }

  const rawBookings = await prisma.booking.findMany({
    where: {
      userId: targetUserId,
      status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS", "FINISHED"] }
    },
    include: {
      product: { select: { name: true } }
    },
    orderBy: { startDate: "asc" }
  });

  const rawTransactions = await prisma.transaction.findMany({
    where: {
      userId: targetUserId,
      startDate: { not: null },
      status: { not: "CANCELLED" }
    },
    include: {
      items: true
    },
    orderBy: { startDate: "asc" }
  });

  const productIds = Array.from(new Set(rawTransactions.flatMap(tx => tx.items.map(i => i.productId))));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true }
  });
  const productMap = new Map(products.map(p => [p.id, p.name]));

  const now = new Date();

  const bookings = rawBookings.map(b => {
      let derivedStatus: "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE" = "COMPLETED";
      const start = b.startDate || b.bookingDate;
      const end = b.endDate || b.bookingDate;

      const safeStart = start ? start.toISOString() : new Date().toISOString();
      const safeEnd = end ? end.toISOString() : new Date().toISOString();

      const startDateObj = start ? new Date(start) : now;
      const endDateObj = end ? new Date(end) : now;

      // Status otomatis berbasis waktu:
      if (b.status === "FINISHED" || (b.status as any) === "CANCELLED") {
        derivedStatus = "FINISHED";
      } else if (now > endDateObj) {
        // Lewat batas waktu sewa / check-out tapi belum di-finish
        derivedStatus = "OVERDUE";
      } else if (now >= startDateObj && now <= endDateObj) {
        // Sedang berlangsung (Tamu menginap / Armada sedang jalan / Alat sedang disewa)
        derivedStatus = "IN_PROGRESS";
      } else {
        // Belum masuk jam sewa (Terjadwal / Siap Check-in)
        derivedStatus = "COMPLETED";
      }

      return {
        id: b.id,
        customerName: b.customerName,
        customerPhone: b.customerPhone || undefined,
        itemName: b.product?.name || "Tanpa Armada",
        startDate: safeStart,
        endDate: safeEnd,
        status: derivedStatus,
        pickupLocation: b.pickupLocation || undefined,
        dropoffLocation: b.dropoffLocation || undefined,
        returnTime: b.returnTime || undefined,
        deposit: b.deposit || undefined,
        conditionNotes: b.conditionNotes || undefined,
        source: "ONLINE" as const
      };
    });

  const txBookings = rawTransactions.map(tx => {
      const start = tx.startDate;
      const end = tx.endDate || tx.startDate;

      if (!start || !end) return null;

      const startDateObj = new Date(start);
      const endDateObj = new Date(end);

      let derivedStatus: "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE" = "FINISHED";

      // Transaksi POS kasir:
      if (now >= startDateObj && now <= endDateObj) {
        derivedStatus = "IN_PROGRESS";
      } else if (tx.status !== "completed" && now > endDateObj) {
        derivedStatus = "OVERDUE";
      } else {
        derivedStatus = "FINISHED";
      }

      return {
        id: tx.id,
        customerName: tx.customerName || "Pelanggan POS",
        itemName: tx.items.map(i => productMap.get(i.productId) || `Produk ${i.productId}`).join(", ") || "Transaksi POS",
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        status: derivedStatus,
        pickupLocation: tx.pickupLocation || undefined,
        dropoffLocation: tx.dropoffLocation || undefined,
        returnTime: tx.returnTime || undefined,
        deposit: tx.deposit || undefined,
        conditionNotes: tx.conditionNotes || undefined,
        source: "POS" as const
      };
    }).filter((b): b is NonNullable<typeof b> => b !== null);

  const allBookings = [...bookings, ...txBookings].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return <RentalCalendarClient initialBookings={allBookings} tenantId={targetUserId} tenantCategory={tenant.category} tenantSlug={tenant.slug} />;
  }

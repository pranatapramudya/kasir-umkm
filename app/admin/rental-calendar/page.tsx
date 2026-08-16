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
    select: { name: true, category: true },
  });

  if (!tenant) {
    redirect("/onboarding");
  }

  const rawBookings = await prisma.booking.findMany({
    where: {
      userId: targetUserId,
      status: "COMPLETED"
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
    let derivedStatus = b.status as string;
    const start = b.startDate || b.bookingDate;
    const end = b.endDate || b.bookingDate;

    if (b.status === "COMPLETED") {
      if (now > end) {
        derivedStatus = "OVERDUE";
      } else if (now >= start && now <= end) {
        derivedStatus = "ACTIVE";
      } else if (now < start) {
        derivedStatus = "PENDING";
      }
    }

    return {
      id: b.id,
      customerName: b.customerName,
      itemName: b.product?.name || "Tanpa Armada",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: derivedStatus as "PENDING" | "ACTIVE" | "OVERDUE" | "COMPLETED",
      destination: b.destination || undefined,
      driverName: undefined,
      licensePlate: undefined,
      guarantee: undefined,
      source: "ONLINE" as const
    };
  });

  const txBookings = rawTransactions.map(tx => {
    let derivedStatus = "COMPLETED";
    const start = tx.startDate!;
    const end = tx.endDate || tx.startDate!;

    if (now > end) {
      derivedStatus = "OVERDUE";
    } else if (now >= start && now <= end) {
      derivedStatus = "ACTIVE";
    } else if (now < start) {
      derivedStatus = "PENDING";
    }

    return {
      id: tx.id,
      customerName: tx.customerName || "Pelanggan POS",
      itemName: tx.items.map(i => productMap.get(i.productId) || `Produk ${i.productId}`).join(", ") || "Transaksi POS",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: derivedStatus as "PENDING" | "ACTIVE" | "OVERDUE" | "COMPLETED",
      destination: tx.destination || undefined,
      driverName: tx.driverName || undefined,
      licensePlate: tx.licensePlate || undefined,
      guarantee: tx.guarantee || undefined,
      source: "POS" as const
    };
  });

  const allBookings = [...bookings, ...txBookings].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return <RentalCalendarClient initialBookings={allBookings} />;
}

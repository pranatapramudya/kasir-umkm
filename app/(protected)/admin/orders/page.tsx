import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InboxClient from "./InboxClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inbox Pesanan — PJTECH KASIR",
  description: "Kelola pesanan online dari katalog.",
};

export default async function PesananOnlinePage() {
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
    select: { category: true }
  });
  const isJasa = tenant?.category === "Jasa / Servis" || tenant?.category === "Jasa/Servis" || tenant?.category === "JASA";

  const rawBookings = await prisma.booking.findMany({
    where: {
      userId: targetUserId,
      status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS"] }
    },
    take: 20,
    select: {
      id: true,
      customerName: true,
      bookingDate: true,
      startDate: true,
      endDate: true,
      status: true,
      product: { select: { name: true, hargaJual: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const bookings = rawBookings.map(b => ({
    id: b.id,
    customerName: b.customerName,
    itemName: b.product?.name || (isJasa ? "Layanan Umum" : "Tanpa Armada"),
    bookingDate: b.bookingDate.toISOString(),
    startDate: b.startDate?.toISOString() || null,
    endDate: b.endDate?.toISOString() || null,
    status: b.status,
    total: b.product?.hargaJual || 0,
  }));

  return <InboxClient initialOrders={bookings} isJasa={isJasa} />;
}

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

  const bookings = rawBookings.map(b => {
    let derivedStatus = b.status as string;
    const now = new Date();
    const start = b.startDate || b.bookingDate;
    const end = b.endDate || b.bookingDate;

    if (b.status === "COMPLETED") {
      if (now > end) {
        derivedStatus = "OVERDUE";
      } else if (now >= start && now <= end) {
        derivedStatus = "ACTIVE";
      } else if (now < start) {
        derivedStatus = "PENDING"; // Approved but not yet started (still booking)
      }
    }

    return {
      id: b.id,
      customerName: b.customerName,
      itemName: b.product?.name || "Tanpa Armada",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: derivedStatus as "PENDING" | "ACTIVE" | "OVERDUE" | "COMPLETED",
    };
  });

  return <RentalCalendarClient initialBookings={bookings} />;
}

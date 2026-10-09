import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/url";
import { isRentalTravelCategory } from "@/lib/business-category";
import BookingDashboardClient from "./BookingDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jadwal Booking — PJTECH KASIR",
  description: "Kelola jadwal booking pelanggan Anda.",
};

export default async function BookingDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Resolve targetUserId: bisa owner atau employee
  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({
    where: { clerkUserId: userId },
  });
  if (employee) {
    targetUserId = employee.tenantId;
  }

  // Validasi tenant ada
  const tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId },
    select: { name: true, slug: true, category: true },
  });

  if (!tenant) {
    redirect("/onboarding");
  }

  // Jika bisnis Rental/Travel/Properti/Alat, arahkan ke kalender sewa khusus rental
  if (isRentalTravelCategory(tenant.category)) {
    redirect("/admin/rental-calendar");
  }

  // Query awal: booking milik tenant ini saja (Multi-Tenant Isolation)
  const rawBookings = await prisma.booking.findMany({
    where: { userId: targetUserId },
    orderBy: { bookingDate: "asc" },
    include: {
      product: { select: { name: true, hargaJual: true } },
    },
  });

  // Serialisasi Date → string untuk Server→Client boundary
  const bookings = rawBookings.map((b) => ({
    ...b,
    bookingDate: b.bookingDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
    startDate: b.startDate?.toISOString() || null,
    endDate: b.endDate?.toISOString() || null,
  }));


  const tenantSlug = tenant.slug ?? null;
  const bookingLink = tenantSlug
    ? `${getAppUrl()}/book/${tenantSlug}`
    : null;

  return (
    <BookingDashboardClient
      initialBookings={bookings}
      tenantName={tenant.name}
      bookingLink={bookingLink}
      tenantSlug={tenantSlug}
      tenantCategory={tenant.category}
      tenantId={targetUserId}
    />
  );
}

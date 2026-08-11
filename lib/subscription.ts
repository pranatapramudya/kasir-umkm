import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function checkSubscriptionStatus() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role as string | undefined;
  
  if (!userId) {
    return { isExpired: true, plan: null, status: null };
  }

  let ownerSearchKey = userId;

  // Jika yang login adalah Kasir/Karyawan, kita cari Tenant pemiliknya dari DB secara absolut
  const employee = await prisma.employee.findUnique({
    where: { clerkUserId: userId },
  });
  
  if (employee) {
    ownerSearchKey = employee.tenantId;
  }

  // Cari tenant menggunakan ownerSearchKey (bisa cocok dengan userId atau id)
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { userId: ownerSearchKey },
        { id: ownerSearchKey }
      ]
    }
  });

  if (!tenant) {
    return { isExpired: true, plan: null, status: null };
  }

  const endsAt = tenant.subscriptionEndsAt;
  let isExpired = false;

  if (!endsAt) {
    isExpired = true; // Jika tidak ada tanggal berakhir, dianggap habis/belum aktif
  } else {
    // Beri masa tenggang (Grace Period) 1 hari (24 jam)
    // endsAt ditambah 1 hari (24 * 60 * 60 * 1000 ms)
    const endsAtPlusGracePeriod = new Date(endsAt).getTime() + (24 * 60 * 60 * 1000);
    isExpired = endsAtPlusGracePeriod < Date.now();
  }

  return { 
    isExpired, 
    plan: tenant.subscriptionPlan,
    status: tenant.subscriptionStatus,
    endsAt: endsAt ? endsAt.toISOString() : null,
    storeName: tenant.name
  };
}

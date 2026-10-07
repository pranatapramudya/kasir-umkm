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
  let inTrial = false;

  if ((tenant.subscriptionPlan === "FREE" || tenant.subscriptionPlan === "TRIAL") && !endsAt) {
    // Gunakan createdAt sebagai basis trial 14 hari
    const trialEndsAt = new Date(tenant.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > trialEndsAt) {
      isExpired = true; // Trial habis
    } else {
      inTrial = true;
      isExpired = false; // Masih trial
    }
  } else if (!endsAt) {
    isExpired = true; // Selain free plan, kalau endsAt gak ada = habis
  } else {
    // Beri masa tenggang (Grace Period) 1 hari (24 jam)
    const endsAtPlusGracePeriod = new Date(endsAt).getTime() + (24 * 60 * 60 * 1000);
    isExpired = endsAtPlusGracePeriod < Date.now();
    
    if (tenant.subscriptionPlan === "TRIAL" && !isExpired) {
      inTrial = true;
    }
  }

  return { 
    isExpired, 
    inTrial,
    plan: tenant.subscriptionPlan,
    status: tenant.subscriptionStatus,
    endsAt: endsAt ? endsAt.toISOString() : null,
    trialEndsAt: inTrial ? (endsAt ? endsAt.toISOString() : new Date(tenant.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()) : null,
    storeName: tenant.name
  };
}

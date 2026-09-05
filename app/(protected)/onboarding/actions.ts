"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not Authenticated");
  }

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const phone = formData.get("phone") as string;

  if (!name || !category || !phone) {
    throw new Error("Nama, Kategori Usaha, dan Nomor Telepon wajib diisi");
  }

  try {
    // 1. Simpan Tenant (Idempotent Upsert)
    await prisma.tenant.upsert({
      where: {
        userId,
      },
      update: {
        name,
        category,
        phone,
      },
      create: {
        userId,
        name,
        category,
        phone,
      },
    });

    // 2. Set Role Owner di awal, agar API selanjutnya (extend) tidak Forbidden
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "OWNER",
        category,
      },
    });

  } catch (error: any) {
    console.error("Error completing onboarding:", error);
    // Transparansi Error: melempar error asli agar mudah di-debug
    throw new Error(error.message || "Gagal menyimpan data toko (Unknown Error)");
  }

  // 3. Return success (NO redirect, NO revalidatePath)
  return { success: true, message: "Toko berhasil dibuat" };
}

export async function selectSubscriptionPackage(plan: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not Authenticated");
  }

  let subscriptionEndsAt = null;
  if (plan === "FREE" || plan === "TRIAL") {
    // Paket Trial 14 Hari
    subscriptionEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  } else if (plan === "BASIC" || plan === "MONTHLY") {
    // Paket 6 Bulan
    subscriptionEndsAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  } else if (plan === "PREMIUM" || plan === "YEARLY") {
    // Paket 1 Tahun
    subscriptionEndsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  }

  try {
    await prisma.tenant.update({
      where: { userId },
      data: {
        subscriptionPlan: plan,
        subscriptionEndsAt,
      }
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        role: "OWNER",
        plan: plan.toLowerCase(),
        subscriptionEndsAt: subscriptionEndsAt ? subscriptionEndsAt.toISOString() : null,
      },
    });
  } catch (error: any) {
    console.error("Error setting subscription package:", error);
    throw new Error(error.message || "Gagal menyimpan paket langganan");
  }

  // Force revalidation of all layouts to pull fresh session tokens & DB data
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');

  return { success: true };
}

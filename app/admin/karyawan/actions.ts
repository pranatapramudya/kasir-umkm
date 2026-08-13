"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCashier(formData: FormData) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  const role = sessionClaims?.role || (sessionClaims?.metadata as any)?.role;
  if (role === "CASHIER") {
    return { success: false, message: "Akses ditolak: Hanya Owner yang dapat membuat akun kasir." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password minimal 8 karakter." };
  }

  // Cek batas maksimum kasir (MVP: 2)
  const currentCashiers = await prisma.employee.count({
    where: { tenantId: userId },
  });

  if (currentCashiers >= 2) {
    return { success: false, message: "Batas maksimum kasir tercapai (2 Kasir). Upgrade ke Pro untuk menambah lebih banyak." };
  }

  let newClerkUser: any = null;
  const client = await clerkClient();

  try {
    // 1. Buat User di Clerk
    newClerkUser = await client.users.createUser({
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || undefined,
      emailAddress: [email],
      password: password,
      publicMetadata: {
        role: "CASHIER",
        tenantId: userId,
        onboardingComplete: true // Kasir tidak perlu onboarding
      },
    });

    // 2. Simpan referensi ke Prisma
    await prisma.employee.create({
      data: {
        clerkUserId: newClerkUser.id,
        tenantId: userId,
        name: name,
        email: email,
      },
    });

    revalidatePath("/admin/karyawan");
    return { success: true };

  } catch (error: any) {
    console.error("Gagal membuat kasir:", error);

    // Pembersihan data yatim (Orphan Data) jika Prisma gagal
    if (newClerkUser?.id) {
      try {
        await client.users.deleteUser(newClerkUser.id);
        console.log(`Rollback berhasil: Menghapus user clerk yatim ${newClerkUser.id}`);
      } catch (rollbackError) {
        console.error("Gagal rollback data yatim clerk:", rollbackError);
      }
    }

    const errorMessage = error.errors?.[0]?.longMessage || error.message || "Gagal menyimpan data pegawai.";
    return { success: false, message: errorMessage };
  }
}

export async function deleteEmployee(employeeId: string, clerkUserId: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  const role = sessionClaims?.role || (sessionClaims?.metadata as any)?.role;
  if (role === "CASHIER") {
    return { success: false, message: "Akses ditolak: Hanya Owner yang dapat menghapus akun kasir." };
  }

  const client = await clerkClient();

  try {
    // 1. Hapus user di Clerk
    await client.users.deleteUser(clerkUserId);

    // 2. Hapus data dari Prisma
    await prisma.employee.delete({
      where: {
        id: employeeId,
        tenantId: userId // Pastikan yang dihapus benar-benar milik owner ini
      }
    });

    revalidatePath("/admin/karyawan");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menghapus kasir:", error);
    return { success: false, message: error.message || "Terjadi kesalahan saat menghapus karyawan." };
  }
}

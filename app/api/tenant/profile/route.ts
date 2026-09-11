import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// [PATCH] Update data profil dasar toko (nama toko & nomor telepon)
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Nama toko / usaha wajib diisi." },
        { status: 400 }
      );
    }

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Data toko tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.tenant.update({
      where: { userId: targetUserId },
      data: {
        name: name.trim(),
        phone: typeof phone === "string" ? phone.trim() : "",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        category: true,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/settings");

    return NextResponse.json({ success: true, ...updated });
  } catch (error) {
    console.error("PATCH /api/tenant/profile error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan profil toko. Coba lagi." },
      { status: 500 }
    );
  }
}

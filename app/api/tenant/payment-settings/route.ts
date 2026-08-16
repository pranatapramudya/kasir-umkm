import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// [PATCH] Update payment settings toko milik tenant yang sedang login
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { adminWhatsApp, bankName, bankAccount, bankAccountName } = body;

    // Pastikan tenant milik user ini ada
    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!tenant) {
      revalidatePath('/', 'layout');
      return NextResponse.json(
        { error: "Data toko tidak ditemukan." },
        { status: 404 }
      );
    }

    // Update settings
    const updated = await prisma.tenant.update({
      where: { userId },
      data: { 
        adminWhatsApp: adminWhatsApp || null, 
        bankName: bankName || null, 
        bankAccount: bankAccount || null, 
        bankAccountName: bankAccountName || null 
      },
      select: { 
        adminWhatsApp: true, 
        bankName: true, 
        bankAccount: true, 
        bankAccountName: true 
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, ...updated });
  } catch (error) {
    console.error("PATCH /api/tenant/payment-settings error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json(
      { error: "Gagal menyimpan informasi pembayaran. Coba lagi." },
      { status: 500 }
    );
  }
}

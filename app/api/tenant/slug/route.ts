import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// [PATCH] Update slug toko milik tenant yang sedang login
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug } = body;

    // 1. Validasi format slug: lowercase, alphanumeric, boleh pakai strip (-)
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Slug tidak boleh kosong." },
        { status: 400 }
      );
    }

    const slugTrimmed = slug.trim().toLowerCase();

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slugTrimmed)) {
      return NextResponse.json(
        {
          error:
            "Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda strip (-). Tidak boleh diawali/diakhiri strip.",
        },
        { status: 400 }
      );
    }

    if (slugTrimmed.length < 3 || slugTrimmed.length > 50) {
      return NextResponse.json(
        { error: "Slug harus antara 3–50 karakter." },
        { status: 400 }
      );
    }

    // 2. Cek apakah slug sudah dipakai toko lain
    const conflict = await prisma.tenant.findFirst({
      where: {
        slug: slugTrimmed,
        NOT: { userId },
      },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Slug sudah digunakan oleh toko lain. Pilih slug yang berbeda." },
        { status: 409 }
      );
    }

    // 3. Pastikan tenant milik user ini ada
    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Data toko tidak ditemukan." },
        { status: 404 }
      );
    }

    // 4. Update slug
    const updated = await prisma.tenant.update({
      where: { userId },
      data: { slug: slugTrimmed },
      select: { slug: true, name: true },
    });

    return NextResponse.json({ success: true, slug: updated.slug });
  } catch (error) {
    console.error("PATCH /api/tenant/slug error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan slug. Coba lagi." },
      { status: 500 }
    );
  }
}

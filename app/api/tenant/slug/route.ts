import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// [GET] Ambil data slug dan nama toko tenant yang sedang login
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      select: { slug: true, name: true, category: true },
    });

    return NextResponse.json({
      success: true,
      slug: tenant?.slug || null,
      name: tenant?.name || null,
      category: tenant?.category || null,
    });
  } catch (error) {
    console.error("GET /api/tenant/slug error:", error);
    return NextResponse.json({ error: "Gagal memuat slug" }, { status: 500 });
  }
}

// [PATCH] Update slug toko milik tenant yang sedang login
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug } = body;

    // 1. Validasi format slug: lowercase, alphanumeric, boleh pakai strip (-)
    if (!slug || typeof slug !== "string") {
      revalidatePath('/', 'layout');
    return NextResponse.json(
        { error: "Slug tidak boleh kosong." },
        { status: 400 }
      );
    }

    const slugTrimmed = slug.trim().toLowerCase();

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slugTrimmed)) {
      revalidatePath('/', 'layout');
    return NextResponse.json(
        {
          error:
            "Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda strip (-). Tidak boleh diawali/diakhiri strip.",
        },
        { status: 400 }
      );
    }

    if (slugTrimmed.length < 3 || slugTrimmed.length > 50) {
      revalidatePath('/', 'layout');
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
      revalidatePath('/', 'layout');
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
      revalidatePath('/', 'layout');
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

    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/settings');
    revalidatePath(`/book/${slugTrimmed}`);
    return NextResponse.json({ success: true, slug: updated.slug });
  } catch (error) {
    console.error("PATCH /api/tenant/slug error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json(
      { error: "Gagal menyimpan slug. Coba lagi." },
      { status: 500 }
    );
  }
}

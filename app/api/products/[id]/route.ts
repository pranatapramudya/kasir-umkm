import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory } from '@/lib/business-category';
import { cacheInvalidateByTag, CacheTags } from '@/lib/redis-cache';

// [PUT] Memperbarui produk (Edit)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);

    if (!productId || isNaN(productId)) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "ID Produk tidak ditemukan di rute API" }, { status: 400 });
    }

    // 1. Validasi Sesi
    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa mengedit produk." }, { status: 403 });
    }

    const body = await request.json();
    console.log("PAYLOAD DITERIMA:", body);
    console.log("ID PRODUK:", resolvedParams.id);
    const { kodeBarang, name, hpp, hargaJual, category, stock, discount, image, brand, variant, minStockThreshold, employeeCommission, description } = body;

    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    const isService = isServiceBusinessCategory(tenant?.category);

    const finalKodeBarang = kodeBarang || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 2 & 3. Eksekusi Atomic UpdateMany (Menghindari TOCTOU)
    const result = await prisma.product.updateMany({
      where: { id: productId, userId },
      data: {
        kodeBarang: finalKodeBarang,
        name: name || "",
        hpp: parseInt(hpp, 10) || 0,
        hargaJual: parseInt(hargaJual, 10) || 0,
        category: category || "",
        stock: isService ? 999999 : (parseInt(stock, 10) || 0),
        minStockThreshold: isService ? 0 : (parseInt(minStockThreshold, 10) || 5),
        discount: parseInt(discount, 10) || 0,
        brand: brand || "",
        variant: variant || "",
        image: image || "",
        description: description || null,
        isService,
        employeeCommission: isService ? (parseInt(employeeCommission, 10) || 0) : 0,
      }
    });

    if (result.count === 0) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Produk tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    // Invalidate cache for this tenant's products
    await cacheInvalidateByTag(CacheTags.products(userId));

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui" });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";
    console.error("PRISMA ERROR:", error);
    if (error?.code === 'P2002') {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Kode Barang sudah digunakan" }, { status: 400 });
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// [DELETE] Menghapus produk
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);

    // 1. Validasi Sesi
    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa menghapus produk." }, { status: 403 });
    }

    // 2. Keamanan dan Eksekusi Atomic (Soft Delete / Arsip)
    const result = await prisma.product.updateMany({
      where: { id: productId, userId },
      data: { isArchived: true }
    });

    if (result.count === 0) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Produk tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    // Invalidate cache for this tenant's products
    await cacheInvalidateByTag(CacheTags.products(userId));

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: "Produk berhasil diarsipkan (soft delete)" });
  } catch (error) {
    console.error("DELETE Product error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}

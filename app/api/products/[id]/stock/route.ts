import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory } from '@/lib/business-category';

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
    return NextResponse.json({ error: "ID Produk tidak valid" }, { status: 400 });
    }

    if (!userId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa mengelola stok." }, { status: 403 });
    }

    const body = await request.json();
    const { amount } = body;
    const addedStock = parseInt(amount, 10);

    if (isNaN(addedStock) || addedStock <= 0) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Jumlah stok masuk harus angka positif" }, { status: 400 });
    }

    // Eksekusi Atomic Increment
    const result = await prisma.product.updateMany({
      where: { id: productId, userId },
      data: {
        stock: { increment: addedStock }
      }
    });

    if (result.count === 0) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Produk tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: "Stok berhasil ditambahkan" });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";
    console.error("QUICK RESTOCK ERROR:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Data produk tidak valid atau kosong" }, { status: 400 });
    }

    // Prepare data for createMany
    const productsToInsert = products.map((p: any, index: number) => ({
      userId,
      kodeBarang: p.kodeBarang || `SKU-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
      name: p.name,
      hargaJual: typeof p.hargaJual === 'number' ? p.hargaJual : parseInt(p.hargaJual) || 0,
      hpp: typeof p.hpp === 'number' ? p.hpp : parseInt(p.hpp) || 0,
      stock: typeof p.stock === 'number' ? p.stock : parseInt(p.stock) || 0,
      category: p.category || "Umum",
      brand: p.brand || undefined,
      variant: p.variant || undefined,
      isService: Boolean(p.isService),
      minStockThreshold: typeof p.minStockThreshold === 'number' ? p.minStockThreshold : parseInt(p.minStockThreshold) || 5,
      employeeCommission: typeof p.employeeCommission === 'number' ? p.employeeCommission : parseInt(p.employeeCommission) || 0,
    }));

    const result = await prisma.product.createMany({
      data: productsToInsert,
      skipDuplicates: true, // IMPORTANT: to avoid failing the whole batch if one kodeBarang exists
    });

    return NextResponse.json({ 
      success: true, 
      message: `${result.count} produk berhasil ditambahkan.`,
      count: result.count 
    });
  } catch (error: any) {
    console.error("[BULK_PRODUCTS_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan data massal: " + error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const parseNumber = (val: any, fallback = 0): number => {
  if (typeof val === 'number') return isNaN(val) ? fallback : Math.round(val);
  if (!val) return fallback;
  const clean = String(val).replace(/[^0-9-]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = tenantId || userId;

    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Data produk tidak valid atau kosong" }, { status: 400 });
    }

    // Prepare data for createMany with alias tolerance and sanitization
    const productsToInsert = products.map((p: any, index: number) => {
      const rawName = String(p.name || p.nama || p.namaBarang || p.namaLayanan || p.unit || '').trim();
      const rawHpp = p.hpp ?? p.bOps ?? p.biayaOperasional ?? p.bops ?? p.BiayaOperasional ?? p.BOps ?? 0;
      const rawHargaJual = p.hargaJual ?? p.harga ?? p.tarif ?? p.price ?? 0;
      const rawStock = p.stock ?? p.stok ?? 0;
      const rawMinStock = p.minStockThreshold ?? p.minStock ?? p.batasMinStok ?? 5;
      const rawCommission = p.employeeCommission ?? p.komisi ?? p.commission ?? p.komisiStaf ?? 0;
      const rawDesc = p.description ?? p.deskripsi ?? p.fasilitas ?? p.keterangan ?? '';

      return {
        userId: targetUserId,
        kodeBarang: p.kodeBarang ? String(p.kodeBarang).trim().toUpperCase() : `SKU-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        name: rawName,
        hargaJual: parseNumber(rawHargaJual, 0),
        hpp: parseNumber(rawHpp, 0),
        stock: parseNumber(rawStock, 0),
        category: (p.category || p.kategori || "Umum").toString().trim(),
        brand: p.brand ? String(p.brand).trim() : undefined,
        variant: p.variant ? String(p.variant).trim() : undefined,
        isService: Boolean(p.isService),
        minStockThreshold: parseNumber(rawMinStock, 5),
        employeeCommission: parseNumber(rawCommission, 0),
        description: rawDesc ? String(rawDesc).trim() : null,
      };
    }).filter(p => Boolean(p.name));

    if (productsToInsert.length === 0) {
      return NextResponse.json({ error: "Tidak ada data produk yang valid untuk disimpan (Pastikan kolom nama terisi)." }, { status: 400 });
    }

    const result = await prisma.product.createMany({
      data: productsToInsert,
      skipDuplicates: true, // IMPORTANT: to avoid failing the whole batch if one kodeBarang exists
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ 
      success: true, 
      message: `${result.count} data berhasil ditambahkan ke katalog.`,
      count: result.count 
    });
  } catch (error: any) {
    console.error("[BULK_PRODUCTS_POST]", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menyimpan data massal: " + error.message }, { status: 500 });
  }
}

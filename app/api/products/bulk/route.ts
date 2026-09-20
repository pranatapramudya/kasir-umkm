import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory } from '@/lib/business-category';

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

    const tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });
    const isService = isServiceBusinessCategory(tenant?.category);

    // Prepare data for createMany with alias tolerance and sanitization
    const productsToInsert = products.map((p: any, index: number) => {
      const rawName = String(p.name || p.nama || p.namaBarang || p.namaLayanan || p.unit || '').trim();
      const rawCategory = (p.category || p.kategori || "Umum").toString().trim();
      const categoryLower = rawCategory.toLowerCase();
      const isJasaMurni = isService && (categoryLower === "jasa" || categoryLower === "jasa / servis" || categoryLower === "jasa/servis" || categoryLower === "layanan" || categoryLower === "jasa servis");
      const normalizedCategory = isService ? (isJasaMurni ? "Jasa / Servis" : "Produk / Barang") : rawCategory;

      const rawHpp = p.hpp ?? p['HPP'] ?? p['Harga Modal'] ?? p['Harga Modal (HPP)'] ?? p['HPP (Modal)'] ?? p['HPP / Modal Beli (Rp)'] ?? p['HPP / Biaya Modal (Rp)'] ?? p['Modal'] ?? p.bOps ?? p.biayaOperasional ?? p.bops ?? p.BiayaOperasional ?? p.BOps ?? p['Biaya Modal / Bahan (Rp)'] ?? p['Biaya Modal'] ?? 0;
      const rawHargaJual = p.hargaJual ?? p['Harga Jual'] ?? p['Harga Jual (Rp)'] ?? p['Tarif Layanan (Rp)'] ?? p['Tarif'] ?? p.harga ?? p.tarif ?? p.price ?? 0;
      const rawStock = p.stock ?? p['Stok'] ?? p.stok ?? 0;
      const rawMinStock = p.minStockThreshold ?? p['Min Stok'] ?? p['Batas Minimum Stok'] ?? p.minStock ?? p.batasMinStok ?? 5;
      const rawCommission = p.employeeCommission ?? p.komisi ?? p.komisiKaryawan ?? p['Komisi'] ?? p['Komisi Staf (Rp)'] ?? p['Komisi Staf'] ?? p.commission ?? p.komisiStaf ?? 0;
      const rawDesc = p.description ?? p['Deskripsi'] ?? p['Deskripsi Layanan'] ?? p['Fasilitas'] ?? p.deskripsi ?? p.fasilitas ?? p.keterangan ?? '';
      const rawBiayaModal = p.biayaModal ?? p['Biaya Modal / Bahan (Rp)'] ?? p['Biaya Modal'] ?? rawHpp;
      const modalCost = parseNumber(rawHpp || rawBiayaModal, 0);

      return {
        userId: targetUserId,
        kodeBarang: p.kodeBarang ? String(p.kodeBarang).trim().toUpperCase() : `SKU-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        name: rawName,
        hargaJual: parseNumber(rawHargaJual, 0),
        hpp: modalCost, // HPP tersimpan untuk Jasa & Barang agar kalkulasi laba bersih akurat
        biayaModal: isJasaMurni ? modalCost : 0,
        stock: isJasaMurni ? 999999 : parseNumber(rawStock, 0), // Jasa murni: unlimited stock
        category: normalizedCategory,
        brand: p.brand ? String(p.brand).trim() : undefined,
        variant: p.variant ? String(p.variant).trim() : undefined,
        isService: isJasaMurni,
        minStockThreshold: isJasaMurni ? 0 : parseNumber(rawMinStock, 5),
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

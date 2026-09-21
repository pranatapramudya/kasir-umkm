import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory, isRentalTravelCategory, detectRentalItemType } from '@/lib/business-category';

const parseNumber = (val: any, fallback = 0): number => {
  if (typeof val === 'number') return isNaN(val) ? fallback : Math.round(val);
  if (!val) return fallback;
  const clean = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? fallback : Math.round(parsed);
};

// Helper: normalize category from sheet name
const getCategoryFromSheet = (sheetName: string): string => {
  const name = sheetName.toLowerCase();
  if (name.includes('armada') || name.includes('kendaraan') || name.includes('travel') || name.includes('mobil') || name.includes('motor')) return 'Armada';
  if (name.includes('properti') || name.includes('kamar') || name.includes('villa') || name.includes('kost') || name.includes('hotel') || name.includes('penginapan')) return 'Properti';
  if (name.includes('alat') || name.includes('peralatan') || name.includes('equipment') || name.includes('kamera') || name.includes('sound') || name.includes('camping')) return 'Peralatan';
  if (name.includes('layanan') || name.includes('tambahan') || name.includes('supir') || name.includes('asuransi') || name.includes('extra') || name.includes('addon') || name.includes('driver') || name.includes('operator')) return 'Layanan Tambahan';
  return 'Umum';
};

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = tenantId || userId;

    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: 'Data produk tidak valid atau kosong' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });
    const isService = isServiceBusinessCategory(tenant?.category);
    const isRental = isRentalTravelCategory(tenant?.category);

    // Prepare data for createMany with sheet-aware logic
    const productsToInsert = products.map((p: any, index: number) => {
      // --- Basic fields ---
      const rawName = String(
        p.name || 
        p['Nama Unit Kendaraan / Plat'] || 
        p['Nama Unit / Plat'] || 
        p['Nama Unit Kendaraan'] || 
        p['Nama Unit / No. Kamar'] || 
        p['Nama Kamar / Unit'] || 
        p['Nama Unit'] || 
        p['Nama Unit / Properti'] || 
        p['Nama Layanan'] || 
        p['Nama Produk'] || 
        p['Nama Produk / Barang'] || 
        p['Nama Barang'] || 
        p['Nama Menu'] || 
        p['Nama Layanan / Produk'] || 
        p['Nama Layanan / Barang'] || 
        p.nama || 
        p.namaBarang || 
        p.namaLayanan || 
        p.unit || 
        ''
      ).trim();

      const rawDesc = p.description ?? p['Deskripsi'] ?? p['Deskripsi Layanan'] ?? p['Fasilitas'] ?? p.deskripsi ?? p.fasilitas ?? p.keterangan ?? p['Catatan / Spesifikasi'] ?? p['Fasilitas / Catatan'] ?? p['Catatan / Fasilitas'] ?? p['Detail HPP (Listrik,Air,Internet,Kebersihan,Penyusutan)'] ?? '';
      const rawCategory = (p.category || p.kategori || p.Kategori || '').toString().trim();
      const sheetCategory = getCategoryFromSheet(p._sheetName || '');
      
      // Determine final category: prefer sheet-based for rental, fallback to smart detection
      let finalCategory = rawCategory || sheetCategory || 'Umum';
      if (isRental) {
        if (sheetCategory !== 'Umum') {
          finalCategory = sheetCategory; // Trust sheet name for rental
        } else {
          // Fallback using smart keyword detection if sheet name was modified
          const rentalType = detectRentalItemType(rawName, String(rawDesc));
          if (rentalType === 'vehicle') finalCategory = 'Armada';
          else if (rentalType === 'property') finalCategory = 'Properti';
          else finalCategory = rawCategory || 'Armada';
        }
      }

      // Normalize category for service businesses (strictly isolated)
      const categoryLower = finalCategory.toLowerCase();
      const isJasaMurni = isService && (categoryLower === 'jasa' || categoryLower === 'jasa / servis' || categoryLower === 'jasa/servis' || categoryLower === 'layanan' || categoryLower === 'jasa servis');
      const normalizedCategory = isService ? (isJasaMurni ? 'Jasa / Servis' : 'Produk / Barang') : finalCategory;

      // --- Rental-specific logic ---
      const isLayananTambahan = finalCategory === 'Layanan Tambahan' || 
        finalCategory.toLowerCase().includes('layanan') || 
        finalCategory.toLowerCase().includes('tambahan') || 
        finalCategory.toLowerCase().includes('operator') ||
        p._sheetName?.toLowerCase().includes('layanan') ||
        p._sheetName?.toLowerCase().includes('operator');
      const isRentalItem = isRental && !isLayananTambahan;
      const isLayananItem = isRental && isLayananTambahan;

      // HPP handling
      const rawHpp = p.hpp ?? p['HPP'] ?? p['Harga Modal'] ?? p['Harga Modal (HPP)'] ?? p['HPP (Modal)'] ?? p['HPP / Modal Beli (Rp)'] ?? p['HPP / Biaya Modal (Rp)'] ?? p['Modal'] ?? p.bOps ?? p.biayaOperasional ?? p.bops ?? p.BiayaOperasional ?? p.BOps ?? p['Biaya Modal / Bahan (Rp)'] ?? p['Biaya Modal'] ?? p['HPP / Biaya Operasional per Hari (Rp)'] ?? p['Biaya Operasional/Hari (Rp)'] ?? 0;
      const rawBiayaModal = p.biayaModal ?? p['Biaya Modal / Bahan (Rp)'] ?? p['Biaya Modal'] ?? rawHpp;
      const modalCost = parseNumber(rawHpp || rawBiayaModal, 0);

      // Harga jual
      const rawHargaJual = p.hargaJual ?? p['Harga Jual'] ?? p['Harga Jual (Rp)'] ?? p['Tarif Layanan (Rp)'] ?? p['Tarif'] ?? p.harga ?? p.tarif ?? p.price ?? p['Harga Sewa/Hari (Rp)'] ?? p['Harga Sewa (Rp)'] ?? 0;

      // Stock: rental units = 1 per unit, layanan = unlimited, jasa = unlimited
      const rawStock = p.stock ?? p['Stok'] ?? p.stok ?? p['Qty (Stok)'] ?? p['Qty'] ?? p['Quantity'] ?? p.qty ?? p.quantity ?? (isRentalItem ? 1 : 0);
      const rawMinStock = p.minStockThreshold ?? p['Min Stok'] ?? p['Batas Minimum Stok'] ?? p.minStock ?? p.batasMinStok ?? (isRentalItem ? 1 : 5);
      const rawCommission = p.employeeCommission ?? p.komisi ?? p.komisiKaryawan ?? p['Komisi'] ?? p['Komisi Staf (Rp)'] ?? p['Komisi Staf'] ?? p.commission ?? p.komisiStaf ?? 0;

      // Kode barang
      const kodeBarang = p.kodeBarang ? String(p.kodeBarang).trim().toUpperCase() : `SKU-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;

      // --- Build product object based on type ---
      if (isRentalItem) {
        // ARMADA / PROPERTI: Physical units, stock=1, track availability
        return {
          userId: targetUserId,
          kodeBarang,
          name: rawName,
          hargaJual: parseNumber(rawHargaJual, 0),
          hpp: modalCost, // HPP = biaya operasional per hari
          biayaModal: 0,
          stock: 1, // Each row = 1 unit
          category: normalizedCategory,
          brand: p.brand ? String(p.brand).trim() : undefined,
          variant: p.variant ? String(p.variant).trim() : undefined,
          isService: false,
          minStockThreshold: 1,
          employeeCommission: parseNumber(rawCommission, 0),
          description: rawDesc ? String(rawDesc).trim() : null,
        };
      } else if (isLayananItem) {
        // LAYANAN TAMBAHAN: Services, unlimited stock, no HPP
        return {
          userId: targetUserId,
          kodeBarang,
          name: rawName,
          hargaJual: parseNumber(rawHargaJual, 0),
          hpp: 0,
          biayaModal: 0,
          stock: 999999, // Unlimited
          category: normalizedCategory,
          brand: undefined,
          variant: p.satuan ? String(p.satuan).trim() : undefined, // Store satuan in variant
          isService: true,
          minStockThreshold: 0,
          employeeCommission: parseNumber(rawCommission, 0),
          description: rawDesc ? String(rawDesc).trim() : null,
        };
      } else if (isJasaMurni) {
        // JASA MURNI (Service business)
        return {
          userId: targetUserId,
          kodeBarang,
          name: rawName,
          hargaJual: parseNumber(rawHargaJual, 0),
          hpp: 0,
          biayaModal: modalCost, // Modal bahan per pengerjaan
          stock: 999999,
          category: normalizedCategory,
          brand: undefined,
          variant: undefined,
          isService: true,
          minStockThreshold: 0,
          employeeCommission: parseNumber(rawCommission, 0),
          description: rawDesc ? String(rawDesc).trim() : null,
        };
      } else {
        // RETAIL / FNB / PRODUCT
        return {
          userId: targetUserId,
          kodeBarang,
          name: rawName,
          hargaJual: parseNumber(rawHargaJual, 0),
          hpp: modalCost,
          biayaModal: 0,
          stock: parseNumber(rawStock, 0),
          category: normalizedCategory,
          brand: p.brand ? String(p.brand).trim() : undefined,
          variant: p.variant ? String(p.variant).trim() : undefined,
          isService: false,
          minStockThreshold: parseNumber(rawMinStock, 5),
          employeeCommission: parseNumber(rawCommission, 0),
          description: rawDesc ? String(rawDesc).trim() : null,
        };
      }
    }).filter(p => Boolean(p.name));

    if (productsToInsert.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data produk yang valid untuk disimpan (Pastikan kolom nama terisi).' }, { status: 400 });
    }

    const result = await prisma.product.createMany({
      data: productsToInsert,
      skipDuplicates: true,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({
      success: true,
      message: `${result.count} data berhasil ditambahkan ke katalog.`,
      count: result.count,
      breakdown: {
        unitSewa: productsToInsert.filter(p => !p.isService && isRental).length,
        armada: productsToInsert.filter(p => p.category === 'Armada').length,
        properti: productsToInsert.filter(p => p.category === 'Properti').length,
        peralatan: productsToInsert.filter(p => p.category === 'Peralatan' || p.category?.toLowerCase().includes('alat') || p.category?.toLowerCase().includes('kamera') || p.category?.toLowerCase().includes('sound')).length,
        layananTambahan: productsToInsert.filter(p => p.category === 'Layanan Tambahan' || p.isService).length,
        lainnya: productsToInsert.filter(p => !['Armada', 'Properti', 'Peralatan', 'Layanan Tambahan'].includes(p.category) && !p.isService).length,
      }
    });
  } catch (error: any) {
    console.error('[BULK_PRODUCTS_POST]', error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: 'Gagal menyimpan data massal: ' + error.message }, { status: 500 });
  }
}
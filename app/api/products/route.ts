import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory, isRentalTravelCategory } from '@/lib/business-category';
import { cacheInvalidateByTag, CacheTags } from '@/lib/redis-cache';

export const dynamic = 'force-dynamic';

// [GET] Mengambil daftar produk milik tenant yang sedang login
export async function GET(request: Request) {
  try {
    // Karena Next.js 15 / Clerk terbaru, auth() mengembalikan Promise
    const { userId, sessionClaims } = await auth();

    // 1. Validasi Sesi: Tolak jika tidak ada user (401)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetUserId = userId;

    // 1.5. Cek apakah user yang sedang login adalah Karyawan (Cashier)
    // Jangan hanya bergantung pada sessionClaims karena bisa delay/out-of-sync
    const employeeInfo = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
      select: { tenantId: true }
    });

    if (employeeInfo) {
      targetUserId = employeeInfo.tenantId;
    }

    // Ekstrak parameter paginasi & filter
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const conditions: any[] = [
      { userId: targetUserId },
      { isArchived: false }
    ];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { kodeBarang: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    if (category && category !== 'Semua' && category !== 'ALL') {
      const catTrim = category.trim();
      const catLower = catTrim.toLowerCase();

      if (
        catTrim === 'ADDON' ||
        catTrim === 'Layanan & Add-on' ||
        catTrim === 'Layanan & Supir' ||
        catTrim === 'Layanan & Operator' ||
        catTrim === 'Layanan Tambahan' ||
        catLower.includes('layanan') ||
        catLower.includes('tambahan') ||
        catLower.includes('supir') ||
        catLower.includes('driver') ||
        catLower.includes('operator') ||
        catLower.includes('addon')
      ) {
        conditions.push({
          OR: [
            { isService: true },
            { category: 'Layanan Tambahan' },
            { category: { in: ['Layanan Tambahan', 'Layanan', 'Add-on', 'Supir', 'Driver', 'Supir/Driver', 'Operator'] } },
            { category: { contains: 'Layanan', mode: 'insensitive' } },
            { category: { contains: 'Tambahan', mode: 'insensitive' } },
            { category: { contains: 'Add-on', mode: 'insensitive' } },
            { category: { contains: 'Supir', mode: 'insensitive' } },
            { category: { contains: 'Driver', mode: 'insensitive' } },
            { category: { contains: 'Operator', mode: 'insensitive' } }
          ]
        });
      } else if (
        catTrim === 'UNIT' ||
        catTrim === 'Unit Sewa' ||
        catTrim === 'Unit Fisik (Kendaraan)' ||
        catTrim === 'Unit Fisik (Kamar)' ||
        catTrim === 'Unit Fisik (Alat)'
      ) {
        conditions.push({
          AND: [
            { isService: false },
            { NOT: { category: { in: ['Layanan Tambahan', 'Layanan', 'Add-on', 'Supir', 'Driver', 'Supir/Driver', 'Operator'] } } }
          ]
        });
      } else if (catTrim === 'VEHICLE' || catTrim === 'Armada' || catTrim === 'Kendaraan' || catTrim.includes('Kendaraan')) {
        conditions.push({
          AND: [
            { isService: false },
            {
              OR: [
                { category: 'Armada' },
                { category: { in: ['Armada', 'Kendaraan', 'Mobil', 'Motor', 'Travel', 'MPV', 'SUV', 'Sedan', 'Minibus', 'Bus', 'Pickup', 'Truck'] } },
                { category: { contains: 'Armada', mode: 'insensitive' } },
                { category: { contains: 'Kendaraan', mode: 'insensitive' } },
                { category: { contains: 'Mobil', mode: 'insensitive' } },
                { category: { contains: 'Motor', mode: 'insensitive' } },
                { category: { contains: 'Travel', mode: 'insensitive' } }
              ]
            }
          ]
        });
      } else if (catTrim === 'PROPERTY' || catTrim === 'Properti' || catTrim === 'Kamar' || catTrim.includes('Properti')) {
        conditions.push({
          AND: [
            { isService: false },
            {
              OR: [
                { category: 'Properti' },
                { category: { in: ['Properti', 'Kamar', 'Villa', 'Kost', 'Hotel', 'Penginapan'] } },
                { category: { contains: 'Properti', mode: 'insensitive' } },
                { category: { contains: 'Kamar', mode: 'insensitive' } },
                { category: { contains: 'Villa', mode: 'insensitive' } },
                { category: { contains: 'Kost', mode: 'insensitive' } },
                { category: { contains: 'Hotel', mode: 'insensitive' } }
              ]
            }
          ]
        });
      } else if (catTrim === 'EQUIPMENT' || catTrim === 'Peralatan' || catTrim === 'Alat' || catTrim.includes('Alat')) {
        conditions.push({
          AND: [
            { isService: false },
            {
              OR: [
                { category: { in: ['Peralatan', 'Alat', 'Equipment', 'Unit Alat & Perlengkapan'] } },
                { category: { contains: 'Alat', mode: 'insensitive' } },
                { category: { contains: 'Peralatan', mode: 'insensitive' } },
                { category: { contains: 'Kamera', mode: 'insensitive' } },
                { category: { contains: 'Sound', mode: 'insensitive' } },
                { category: { contains: 'Camping', mode: 'insensitive' } },
                { category: { contains: 'Game', mode: 'insensitive' } }
              ]
            }
          ]
        });
      } else if (catTrim === 'Jasa / Servis' || catTrim === 'Jasa' || catTrim === 'Servis') {
        conditions.push({
          OR: [
            { category: { in: ['Jasa', 'Jasa / Servis', 'Jasa/Servis', 'Layanan'] } },
            { isService: true }
          ]
        });
      } else if (catTrim === 'Produk / Barang' || catTrim === 'Produk' || catTrim === 'Barang') {
        conditions.push({
          OR: [
            { category: { in: ['Produk', 'Barang', 'Sparepart', 'Produk / Barang', 'Produk/Barang'] } },
            { isService: false }
          ]
        });
      } else {
        conditions.push({
          category: { equals: category, mode: 'insensitive' }
        });
      }
    }

    const whereClause = { AND: conditions };

    // 2. Ambil data dengan memfilter berdasarkan targetUserId dan paginasi
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ]);
    
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const response = { products, totalPages, totalCount };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET_PRODUCTS_ERROR]", error);
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

// [POST] Menambahkan produk baru untuk tenant yang sedang login
export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    // 1. Validasi Sesi
    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa menambahkan produk." }, { status: 403 });
    }

    const body = await request.json();
    const { kodeBarang, name, hpp, hargaJual, category, stock, discount, image, brand, variant, minStockThreshold, employeeCommission, description, biayaModal } = body;

    // 2. Validasi Input Dasar (astikan name, hpp, dan hargaJual ada)
    // Untuk Jasa murni: hpp bisa 0, biayaModal dipakai
    if (!name || hargaJual === undefined) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Nama dan Harga Jual wajib diisi" }, { status: 400 });
    }

    // 2.5 Cek Kategori Usaha untuk set isService & employeeCommission
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    const isService = isServiceBusinessCategory(tenant?.category);
    const isRental = isRentalTravelCategory(tenant?.category);
    const categoryLower = (category || "").toLowerCase().trim();
    const isJasaMurni = isService && (categoryLower === "jasa" || categoryLower === "jasa / servis" || categoryLower === "jasa/servis" || categoryLower === "layanan" || categoryLower === "");
    const isRentalLayanan = isRental && (categoryLower.includes("layanan") || categoryLower.includes("tambahan") || categoryLower.includes("operator") || categoryLower.includes("supir") || body.isService === true);
    const finalIsService = isJasaMurni || isRentalLayanan || Boolean(body.isService);
    const normalizedCategory = isService ? (isJasaMurni ? "Jasa / Servis" : "Produk / Barang") : (category || "Umum");

    const finalKodeBarang = kodeBarang || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Simpan ke database dengan menempelkan userId dari Clerk
    const modalValue = Number(biayaModal) || Number(hpp) || 0;
    const newProduct = await prisma.product.create({
      data: {
        userId,
        kodeBarang: finalKodeBarang,
        name,
        hpp: modalValue, // Simpan HPP untuk Jasa, Rental & Barang
        biayaModal: isJasaMurni ? modalValue : 0,
        hargaJual: Number(hargaJual) || 0,
        category: normalizedCategory,
        stock: finalIsService ? 999999 : (Number(stock) || 0),
        minStockThreshold: finalIsService ? 0 : (Number(minStockThreshold) || (isRental ? 1 : 5)),
        discount: Number(discount) || 0,
        brand: brand || "",
        variant: variant || "",
        image: image || "",
        description: description || null,
        isService: finalIsService,
        employeeCommission: (isService || isRental) ? (Number(employeeCommission) || 0) : 0,
      }
    });

    // Invalidate cache for this tenant's products
    await cacheInvalidateByTag(CacheTags.products(userId));
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST Product error:", error);
    
    // Penanganan error Prisma jika kodeBarang duplikat dalam satu tenant
    if (error?.code === 'P2002') {
      revalidatePath('/', 'layout');
      return NextResponse.json({ error: "Kode Barang (SKU) sudah digunakan" }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Gagal menyimpan produk", details: error.message }, { status: 500 });
  }
}

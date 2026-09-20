import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory } from '@/lib/business-category';
import { 
  cacheGet, 
  cacheSet, 
  cacheInvalidateByTag, 
  CacheKeys, 
  CacheTags 
} from '@/lib/redis-cache';

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

    // Generate cache key based on query params
    const cacheKey = `${CacheKeys.products(targetUserId)}:p${page}:l${limit}:s${search}:c${category}`;
    const cacheTag = CacheTags.products(targetUserId);

    // Try cache first
    const cached = await cacheGet<{ products: any[]; totalPages: number; totalCount: number }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }

    const whereClause: any = { userId: targetUserId, isArchived: false };
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { kodeBarang: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'Semua') {
      if (category === "Jasa / Servis" || category === "Jasa") {
        whereClause.OR = [
          { category: { in: ["Jasa", "Jasa / Servis", "Jasa/Servis", "Layanan"] } },
          { isService: true }
        ];
      } else if (category === "Produk / Barang" || category === "Produk" || category === "Barang") {
        whereClause.OR = [
          { category: { in: ["Produk", "Barang", "Sparepart", "Produk / Barang", "Produk/Barang"] } },
          { isService: false }
        ];
      } else {
        whereClause.category = category;
      }
    }

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
    
    // Cache for 5 minutes
    await cacheSet(cacheKey, response, { ttl: 300, tags: [cacheTag] });
    
    return NextResponse.json(response, { headers: { 'X-Cache': 'MISS' } });
  } catch (error) {
    console.error("GET Products error:", error);
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

    // 2.5 Cek Kategori Usaha untuk set isService
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    const isService = isServiceBusinessCategory(tenant?.category);
    const categoryLower = (category || "").toLowerCase().trim();
    const isJasaMurni = isService && (categoryLower === "jasa" || categoryLower === "jasa / servis" || categoryLower === "jasa/servis" || categoryLower === "layanan" || categoryLower === "");
    const normalizedCategory = isService ? (isJasaMurni ? "Jasa / Servis" : "Produk / Barang") : (category || "Umum");

    const finalKodeBarang = kodeBarang || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Simpan ke database dengan menempelkan userId dari Clerk
    const modalValue = Number(biayaModal) || Number(hpp) || 0;
    const newProduct = await prisma.product.create({
      data: {
        userId,
        kodeBarang: finalKodeBarang,
        name,
        hpp: modalValue, // Simpan HPP untuk Jasa & Barang
        biayaModal: isJasaMurni ? modalValue : 0,
        hargaJual: Number(hargaJual) || 0,
        category: normalizedCategory,
        stock: isJasaMurni ? 999999 : (Number(stock) || 0),
        minStockThreshold: isJasaMurni ? 0 : (Number(minStockThreshold) || 5),
        discount: Number(discount) || 0,
        brand: brand || "",
        variant: variant || "",
        image: image || "",
        description: description || null,
        isService: isJasaMurni,
        employeeCommission: isService ? (Number(employeeCommission) || 0) : 0,
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

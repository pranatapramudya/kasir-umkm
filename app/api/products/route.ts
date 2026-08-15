import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isServiceBusinessCategory } from '@/lib/business-category';

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

    const whereClause: any = { userId: targetUserId, isActive: true };
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { kodeBarang: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'Semua') {
      whereClause.category = category;
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
    
    return NextResponse.json({ products, totalPages, totalCount });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      return NextResponse.json({ error: "Akses ditolak. Hanya Pemilik/Admin yang bisa menambahkan produk." }, { status: 403 });
    }

    const body = await request.json();
    const { kodeBarang, name, hpp, hargaJual, category, stock, discount, image, brand, variant, minStockThreshold, employeeCommission } = body;

    // 2. Validasi Input Dasar (astikan name, hpp, dan hargaJual ada)
    if (!name || hpp === undefined || hargaJual === undefined) {
      return NextResponse.json({ error: "Nama, HPP, dan Harga Jual wajib diisi" }, { status: 400 });
    }

    // 2.5 Cek Kategori Usaha untuk set isService
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    const isService = isServiceBusinessCategory(tenant?.category);

    const finalKodeBarang = kodeBarang || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Simpan ke database dengan menempelkan userId dari Clerk
    const newProduct = await prisma.product.create({
      data: {
        userId,
        kodeBarang: finalKodeBarang,
        name,
        hpp: Number(hpp) || 0,
        hargaJual: Number(hargaJual) || 0,
        category: category || "Umum",
        stock: isService ? 999999 : (Number(stock) || 0),
        minStockThreshold: isService ? 0 : (Number(minStockThreshold) || 5),
        discount: Number(discount) || 0,
        brand: brand || "",
        variant: variant || "",
        image: image || "",
        isService,
        employeeCommission: isService ? (Number(employeeCommission) || 0) : 0,
      }
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST Product error:", error);
    
    // Penanganan error Prisma jika kodeBarang duplikat dalam satu tenant
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: "Kode Barang (SKU) sudah digunakan" }, { status: 400 });
    }

    return NextResponse.json({ error: "Gagal menyimpan produk", details: error.message }, { status: 500 });
  }
}

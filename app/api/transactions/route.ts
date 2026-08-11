import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Sesuaikan path alias jika diperlukan
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // PROTEKSI: Karena ini menyinggung database (stok), 
    // meski transaksi datang dari storefront, kita pastikan struktur dan limit sesuai.
    // Catatan: Jika storefront sepenuhnya publik, mungkin kita tidak mewajibkan auth().
    // Untuk saat ini kita jalankan tanpa proteksi ketat auth() clerk karena kasir (storefront) bersifat publik.
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetUserId = role === 'CASHIER' ? tenantId : userId;

    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Keranjang kosong' }, { status: 400 });
    }

    const rawDiscount = Math.round(Number(body.discount || 0));
    const rawTotal = Math.round(Number(body.total));
    const baseTotal = rawTotal + rawDiscount;

    if (rawDiscount > (baseTotal * 0.10) && role === 'CASHIER') {
      return NextResponse.json({ success: false, message: 'Diskon >10% dari total harus disetujui Admin/Owner' }, { status: 403 });
    }

    // Ambil employeeCommission untuk snapshot
    const productIds = body.items.map((item: any) => Math.round(Number(item.id)));
    const productsInfo = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, employeeCommission: true }
    });
    const productMap = new Map(productsInfo.map(p => [p.id, p.employeeCommission || 0]));

    // 1. Eksekusi Prisma Transaction (Atomic)
    const result = await prisma.$transaction(async (tx) => {

      const newTransaction = await tx.transaction.create({
        data: {
          id: body.id, // e.g. "#1234"
          userId: targetUserId, // Use targetUserId (Tenant ID)
          timestamp: Math.round(Number(body.timestamp)),
          customerName: body.customerName,
          tableId: body.tableId || null,
          total: rawTotal,
          discount: rawDiscount,
          cashierId: body.cashierId || null,
          method: body.method,
          status: 'completed', // langsung completed untuk versi POS ini
          items: {
            create: body.items.map((item: any) => {
              const pId = Math.round(Number(item.id));
              return {
                productId: pId,
                qty: Math.round(Number(item.qty)),
                price: Math.round(Number(item.hargaJual)),
                note: item.note ? String(item.note) : null,
                workerId: item.workerId ? String(item.workerId) : null,
                serviceDuration: item.serviceDuration ? Math.round(Number(item.serviceDuration)) : 0,
                commissionSnapshot: productMap.get(pId) || 0,
              };
            })
          }
        }
      });

      // b. Pencegahan N+1 Query (Pre-fetch & Promise.all)
      const itemIds = body.items.map((i: any) => Math.round(Number(i.id)));
      const productsInCart = await tx.product.findMany({
        where: { id: { in: itemIds }, userId: targetUserId }
      });

      if (productsInCart.length !== itemIds.length) {
        throw new Error(`Beberapa produk tidak ditemukan atau akses ditolak.`);
      }

      const productStockMap = new Map(productsInCart.map(p => [p.id, p]));

      // Validasi Stok di Memori
      for (const item of body.items) {
        const product = productStockMap.get(item.id);
        if (!product?.isService && product!.stock < item.qty) {
          throw new Error(`Stok produk ${product!.name} tidak mencukupi.`);
        }
      }

      // Kurangi stok serentak tanpa loop await sekuensial (Konkuren)
      const stockUpdatePromises = body.items.map((item: any) => {
        const product = productStockMap.get(item.id);
        if (!product?.isService) {
          return tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.qty } }
          });
        }
        return Promise.resolve();
      });

      await Promise.all(stockUpdatePromises);

      // c. Audit Log untuk diskon besar yang di-approve owner/admin
      if (rawDiscount > (baseTotal * 0.10)) {
        await tx.auditLog.create({
          data: {
            tenantId: targetUserId,
            userId: userId,
            action: 'DISCOUNT_OVERRIDE',
            details: {
              transactionId: body.id,
              discountAmount: rawDiscount,
              baseTotal: baseTotal
            }
          }
        });
      }

      return newTransaction;
    });

    // --- SINKRONISASI STATUS MEJA (Background Process) ---
    if (body.tableId) {
      prisma.diningTable.update({
        where: { id: body.tableId },
        data: { status: 'Terisi' }
      }).catch(err => console.error("Gagal update otomatis status meja:", err));
    }

    // Mengembalikan response sukses. 
    // Data dikembalikan dalam bentuk string/parsial untuk mencegah isu BigInt serialization di JSON
    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil disimpan dan stok telah diperbarui',
      data: {
        id: result.id,
        total: result.total,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Gagal memproses transaksi:", error);
    // Jika error datang dari manual throw kita (stok kurang), message-nya akan terkirim
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan internal pada server' }, { status: 500 });
  }
}

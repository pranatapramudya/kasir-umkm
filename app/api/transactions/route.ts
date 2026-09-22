import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { isRentalTravelCategory, isPureServiceCategory } from '@/lib/business-category';

const safeInt = (val: any, fallback = 0): number => {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : Math.round(num);
};

const safeParseDate = (dateVal: any): Date | null => {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? null : d;
};

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

    let isEmployee = false;
    let activeTenantId = userId;
    let validCashierId = null;

    // Prioritaskan Database (Tabel Employee) untuk menghindari isu stale JWT
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      isEmployee = true;
      activeTenantId = employee.tenantId;
      validCashierId = employee.id;
    } else if (role === 'CASHIER' && metaTenantId) {
      // Fallback ke Metadata jika DB belum tersinkronisasi
      isEmployee = true;
      activeTenantId = metaTenantId;
    }

    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: false, message: 'Keranjang kosong' }, { status: 400 });
    }

    const rawDiscount = safeInt(body.discount, 0);
    const rawTotal = safeInt(body.total, 0);
    const baseTotal = rawTotal + rawDiscount;

    if (rawDiscount > (baseTotal * 0.10) && isEmployee) {
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: false, message: 'Diskon >10% dari total harus disetujui Admin/Owner' }, { status: 403 });
    }

    // Ambil employeeCommission untuk snapshot
    const productIds: number[] = Array.from(new Set<number>(body.items.map((item: any) => Math.round(Number(item.id)))));
    const productsInfo = await prisma.product.findMany({
      where: { id: { in: productIds }, userId: activeTenantId },
      select: { id: true, employeeCommission: true }
    });
    const productMap = new Map(productsInfo.map(p => [p.id, p.employeeCommission || 0]));

    // 1. Validasi cashierId (Mencegah Foreign Key Constraint Error P2003)
    if (!validCashierId && body.cashierId) {
      try {
        const emp = await prisma.employee.findFirst({
          where: {
            tenantId: activeTenantId,
            OR: [
              { id: String(body.cashierId) },
              { clerkUserId: String(body.cashierId) }
            ]
          }
        });
        if (emp) {
          validCashierId = emp.id;
        } else {
          console.warn(`[WARNING] cashierId ${body.cashierId} tidak ditemukan di tabel Employee. Menggunakan null.`);
        }
      } catch (err) {
        console.error("Gagal memvalidasi cashierId:", err);
      }
    }

    // 2. Validasi tableId untuk Bisnis F&B (Mencegah Foreign Key Constraint Error P2003)
    let validTableId: string | null = null;
    if (body.tableId && typeof body.tableId === 'string' && body.tableId.trim() !== '' && body.tableId !== 'takeaway' && body.tableId !== 'TAKEAWAY') {
      try {
        const table = await prisma.diningTable.findFirst({
          where: {
            id: body.tableId.trim(),
            userId: activeTenantId
          },
          select: { id: true }
        });
        if (table) {
          validTableId = table.id;
        } else {
          console.warn(`[WARNING] tableId ${body.tableId} tidak ditemukan di DiningTable. Menggunakan null.`);
        }
      } catch (err) {
        console.error("Gagal memvalidasi tableId:", err);
      }
    }

    // 3. Validasi workerId untuk Bisnis Jasa (Mencegah Foreign Key Constraint Error P2003 jika admin_owner atau staf tidak valid)
    const candidateWorkerIds: string[] = Array.from(
      new Set<string>(
        body.items
          .map((it: any) => (it?.workerId ? String(it.workerId).trim() : ''))
          .filter((wId: string) => Boolean(wId) && wId !== 'admin_owner')
      )
    );

    const validWorkerIdSet = new Set<string>();
    if (candidateWorkerIds.length > 0) {
      try {
        const validEmps = await prisma.employee.findMany({
          where: {
            tenantId: activeTenantId,
            id: { in: candidateWorkerIds }
          },
          select: { id: true }
        });
        validEmps.forEach(emp => validWorkerIdSet.add(emp.id));
      } catch (err) {
        console.error("Gagal memvalidasi workerIds:", err);
      }
    }

    // 4. Eksekusi Prisma Transaction (Atomic)
    const result = await prisma.$transaction(async (tx) => {
          // Cek kategori bisnis tenant untuk menentukan logika stok
          const tenant = await tx.tenant.findUnique({
            where: { userId: activeTenantId },
            select: { category: true }
          });
          const tenantCategory = tenant?.category || '';
          const isRentalBusiness = isRentalTravelCategory(tenantCategory);
          const isPureJasaBusiness = isPureServiceCategory(tenantCategory);

      const newTransaction = await tx.transaction.create({
        data: {
          id: String(body.id), // e.g. "#1234"
          userId: activeTenantId, // Multi-tenant isolation
          timestamp: safeInt(body.timestamp, Date.now()),
          customerName: body.customerName ? String(body.customerName).trim() : "Pelanggan",
          tableId: validTableId,
          total: rawTotal,
          discount: rawDiscount,
          cashierId: validCashierId,
                    method: String(body.method || "Tunai"),
                              status: (() => {
                                // F&B: status 'pending' supaya muncul di KDS, baru dapur update ke cooking/ready/completed
                                // Non-F&B: 'completed' langsung (atau 'partial' jika ada remainingBalance)
                                // Gunakan isFnBCategory untuk konsistensi dengan frontend
                                const isFNB = body.tableId && typeof body.tableId === 'string' && body.tableId.trim() !== '';
                                const hasRemaining = safeInt(body.remainingBalance, 0) > 0;
                                if (isFNB) return 'pending';
                                return hasRemaining ? 'partial' : 'completed';
                              })(),
                    driverName: body.driverName ? String(body.driverName).trim() : null,
                              licensePlate: body.licensePlate ? String(body.licensePlate).trim() : null,
                              pickupLocation: body.pickupLocation ? String(body.pickupLocation).trim() : null,
                              dropoffLocation: body.dropoffLocation ? String(body.dropoffLocation).trim() : null,
                              startDate: safeParseDate(body.startDate),
                              endDate: safeParseDate(body.endDate),
                              serviceDate: safeParseDate(body.serviceDate),
                              guarantee: body.guarantee ? String(body.guarantee).trim() : null,
                              returnTime: body.returnTime ? String(body.returnTime).trim() : null,
                              deposit: safeInt(body.deposit, 0),
                              conditionNotes: body.conditionNotes ? String(body.conditionNotes).trim() : null,
                              pickupTime: body.pickupTime ? String(body.pickupTime).trim() : null,
                              downPayment: safeInt(body.downPayment, 0),
                              remainingBalance: safeInt(body.remainingBalance, 0),
          items: {
            create: body.items.map((item: any) => {
              const pId = Math.round(Number(item.id));
              const rawWorkerId = item.workerId ? String(item.workerId).trim() : null;
              const isOwnerWorker = rawWorkerId === 'admin_owner';
              // workerId hanya diisi jika ID ada di tabel Employee (valid relational FK)
              const safeWorkerId = (rawWorkerId && validWorkerIdSet.has(rawWorkerId)) ? rawWorkerId : null;

              let itemNote = item.note ? String(item.note).trim() : null;
              if (isOwnerWorker && (!itemNote || !itemNote.includes('Admin/Pemilik'))) {
                itemNote = itemNote ? `${itemNote} (Dikerjakan oleh Admin/Pemilik)` : 'Dikerjakan oleh Admin/Pemilik';
              }

              return {
                productId: pId,
                qty: Math.max(1, safeInt(item.qty, 1)),
                price: safeInt(item.hargaJual, 0),
                note: itemNote || null,
                workerId: safeWorkerId,
                serviceDuration: safeInt(item.serviceDuration, 0),
                commissionSnapshot: productMap.get(pId) || 0,
              };
            })
          }
        }
      });

      // b. Akumulasi & Validasi Stok (Mendukung Keranjang dengan Item Duplikat & Mencegah Deadlock)
      const qtyPerProduct = new Map<number, number>();
      for (const item of body.items) {
        const pId = Math.round(Number(item.id));
        const qty = Math.max(1, safeInt(item.qty, 1));
        qtyPerProduct.set(pId, (qtyPerProduct.get(pId) || 0) + qty);
      }

      const uniqueItemIds = Array.from(qtyPerProduct.keys());
      const productsInCart = await tx.product.findMany({
        where: { id: { in: uniqueItemIds }, userId: activeTenantId }
      });

      if (productsInCart.length !== uniqueItemIds.length) {
        throw new Error(`Beberapa produk tidak ditemukan atau akses ditolak.`);
      }

      const productStockMap = new Map(productsInCart.map(p => [p.id, p]));

            // Validasi & Kurangi Stok: HANYA untuk bisnis non-Rental dan non-Jasa murni
            // Rental: ketersediaan berbasis kalender (unit tersedia pada rentang tanggal), bukan stok kuantitas
            // Jasa Murni: isService=true, stok tidak dibatasi
            if (!isRentalBusiness && !isPureJasaBusiness) {
              // Validasi Stok di Memori
              for (const [pId, neededQty] of qtyPerProduct.entries()) {
                const product = productStockMap.get(pId);
                if (!product?.isService && product!.stock < neededQty) {
                  throw new Error(`Stok produk "${product!.name}" tidak mencukupi (Tersisa: ${product!.stock}, Dibutuhkan: ${neededQty}).`);
                }
              }

              // Kurangi stok serentak tanpa duplicate conflict
              const stockUpdatePromises: Promise<any>[] = [];
              for (const [pId, totalQty] of qtyPerProduct.entries()) {
                const product = productStockMap.get(pId);
                if (!product?.isService) {
                  stockUpdatePromises.push(
                    tx.product.update({
                      where: { id: pId },
                      data: { stock: { decrement: totalQty } }
                    })
                  );
                }
              }

              await Promise.all(stockUpdatePromises);
            }

      // d. Update Booking if bookingId is provided (Tarik Antrean)
      if (body.bookingId) {
        try {
          const existingBooking = await tx.booking.findFirst({
            where: { id: String(body.bookingId), userId: activeTenantId }
          });
          if (existingBooking) {
            await tx.booking.update({
              where: { id: existingBooking.id },
              data: { status: "FINISHED" }
            });
          }
        } catch (bkErr) {
          console.warn("Gagal update status booking:", bkErr);
        }
      }

      // c. Audit Log untuk diskon besar yang di-approve owner/admin
      if (rawDiscount > (baseTotal * 0.10)) {
        await tx.auditLog.create({
          data: {
            tenantId: activeTenantId,
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
    if (validTableId) {
      prisma.diningTable.update({
        where: { id: validTableId },
        data: { status: 'Terisi' }
      }).catch(err => console.error("Gagal update otomatis status meja:", err));
    }

    // Mengembalikan response sukses
    revalidatePath('/', 'layout');
    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil disimpan dan stok telah diperbarui',
      data: {
        id: result.id,
        total: result.total,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("[TRANSACTION_ERROR]: ", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan internal pada server' }, { status: 500 });
  }
}

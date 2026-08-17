import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { sendPushNotification } from "@/lib/webpush";

export const dynamic = "force-dynamic";

// [POST] Terima booking dari form publik pelanggan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, customerName, customerPhone, bookingDate, notes, productId, startDate, endDate, pickupLocation, dropoffLocation } =
      body;

    // 1. Validasi kelengkapan data
    if (!slug || !customerName?.trim() || !customerPhone?.trim() || !bookingDate) {
      revalidatePath('/', 'layout');
    return NextResponse.json(
        { error: "Data tidak lengkap. Isi semua field yang wajib." },
        { status: 400 }
      );
    }

    // 2. Cari tenant berdasarkan slug (Multi-Tenant Isolation)
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { userId: true, name: true },
    });

    if (!tenant) {
      revalidatePath('/', 'layout');
    return NextResponse.json(
        { error: "Toko tidak ditemukan." },
        { status: 404 }
      );
    }

    // 3. Validasi productId jika dikirim
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: Number(productId), userId: tenant.userId, isArchived: false },
      });
      if (!product) {
        revalidatePath('/', 'layout');
    return NextResponse.json(
          { error: "Layanan tidak ditemukan atau tidak aktif." },
          { status: 400 }
        );
      }
    }

    // 4. Backend double-booking guard (pengecekan ganda sebelum simpan)
    const requestedDateTime = new Date(bookingDate);
    let isConflict = false;
    let conflictMessage = "Jadwal sudah tidak tersedia.";

    if (startDate && endDate) {
      // Logic Rental (Berbasis Rentang Tanggal)
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      newStart.setHours(0, 0, 0, 0);
      newEnd.setHours(23, 59, 59, 999);

      const conflictRental = await prisma.booking.findFirst({
        where: {
          userId: tenant.userId,
          productId: productId ? Number(productId) : undefined,
          status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS"] },
          startDate: { lte: newEnd },
          endDate: { gte: newStart },
        },
        select: { id: true },
      });

      if (conflictRental) {
        isConflict = true;
        conflictMessage = "Armada sudah disewa pada tanggal tersebut.";
      }
    } else {
      // Logic Jasa (Berbasis Slot Waktu)
      const conflictJasa = await prisma.booking.findFirst({
        where: {
          userId: tenant.userId,
          productId: productId ? Number(productId) : undefined,
          bookingDate: requestedDateTime,
          status: { in: ["PENDING", "COMPLETED", "FINISHED"] },
        },
        select: { id: true },
      });

      if (conflictJasa) {
        isConflict = true;
        conflictMessage = "Jadwal penuh, silakan pilih jam lain.";
      }
    }

    if (isConflict) {
      revalidatePath('/', 'layout');
      return NextResponse.json(
        { error: conflictMessage },
        { status: 400 }
      );
    }

    // 5. Simpan booking dengan userId dari tenant (bukan dari slug langsung)
    const booking = await prisma.booking.create({
      data: {
        userId: tenant.userId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        bookingDate: requestedDateTime,
        notes: notes?.trim() || null,
        productId: productId ? Number(productId) : null,
        status: "PENDING",
        // Field rental (null untuk kategori non-Rental)
        startDate:   startDate   ? new Date(startDate)   : null,
        endDate:     endDate     ? new Date(endDate)     : null,
        pickupLocation: pickupLocation?.trim() || null,
        dropoffLocation: dropoffLocation?.trim() || null,
      },
    });

    // 6. Kirim Push Notification ke Owner & Super Admin
    // Dibungkus try-catch: kegagalan push TIDAK boleh menggagalkan proses booking
    try {
      const superAdminIds = (process.env.SUPER_ADMIN_USER_IDS ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      // Kumpulkan userId yang perlu dinotifikasi (Owner + Super Admin, tanpa duplikat)
      const notifyUserIds = Array.from(
        new Set([tenant.userId, ...superAdminIds])
      );

      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: { in: notifyUserIds } },
      });

      const bookingDateFormatted = requestedDateTime.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      });

      const pushPayload = {
        title: "📅 Booking Baru Masuk!",
        body: `${customerName.trim()} — ${bookingDateFormatted}`,
        url: "/admin/booking",
        icon: "/icon-192x192.png",
      };

      await Promise.allSettled(
        subscriptions.map((sub) =>
          sendPushNotification(
            { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
            pushPayload
          )
        )
      );
    } catch (pushError) {
      // Log error tapi lanjutkan — booking sudah berhasil disimpan
      console.error("[booking] Push notification error (non-fatal):", pushError);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/booking error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json(
      { error: "Gagal menyimpan jadwal. Coba lagi." },
      { status: 500 }
    );
  }
}

// [GET] Ambil booking milik tenant yang sedang login (untuk dashboard owner)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pastikan targetUserId = owner toko (bukan employee)
    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: targetUserId }, // ← Multi-Tenant Isolation WAJIB
      orderBy: { bookingDate: "asc" },
      include: {
        product: {
          select: { name: true, hargaJual: true },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("GET /api/booking error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data booking." },
      { status: 500 }
    );
  }
}

// [PATCH] Update status booking (COMPLETED / CANCELLED)
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetUserId = userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (employee) {
      targetUserId = employee.tenantId;
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !["COMPLETED", "CANCELLED"].includes(status)) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }

    // Pastikan booking ini memang milik tenant yang sedang login
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: targetUserId },
      include: { product: { select: { name: true, hargaJual: true } } },
    });

    if (!booking) {
      revalidatePath('/', 'layout');
    return NextResponse.json(
        { error: "Booking tidak ditemukan atau akses ditolak." },
        { status: 404 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: { product: { select: { name: true, hargaJual: true } } },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("PATCH /api/booking error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json(
      { error: "Gagal memperbarui status booking." },
      { status: 500 }
    );
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/push/subscribe
 * Menerima subscription object dari browser dan menyimpannya ke database.
 * Dipanggil oleh PushNotificationManager.tsx setelah user mengizinkan notifikasi.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint, p256dh, auth: authKey } = body as {
      endpoint?: string;
      p256dh?: string;
      auth?: string;
    };

    if (!endpoint || !p256dh || !authKey) {
      return NextResponse.json(
        { error: "Data subscription tidak lengkap." },
        { status: 400 }
      );
    }

    // Upsert: update jika endpoint sudah ada, insert jika belum
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        endpoint,
        p256dh,
        auth: authKey,
        userId,
      },
      update: {
        p256dh,
        auth: authKey,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/push/subscribe error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan subscription." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/push/subscribe
 * Menghapus subscription ketika user berhenti berlangganan notifikasi.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint } = body as { endpoint?: string };

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint tidak ditemukan." },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/push/subscribe error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus subscription." },
      { status: 500 }
    );
  }
}

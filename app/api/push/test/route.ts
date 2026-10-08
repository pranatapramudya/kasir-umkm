import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/webpush";

export const dynamic = "force-dynamic";

/**
 * POST /api/push/test
 * Mengirimkan notifikasi tes real-time ke semua perangkat aktif milik user yang sedang login.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Belum ada perangkat yang terdaftar. Silakan aktifkan notifikasi di browser terlebih dahulu.",
        },
        { status: 404 }
      );
    }

    const payload = {
      title: "🔔 Tes Notifikasi Realtime Berhasil!",
      body: "Sistem push notification PJTECH Kasir terhubung dan berfungsi dengan lancar.",
      url: "/admin/booking",
      icon: "/icon-192x192.png",
    };

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendPushNotification(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payload
        )
      )
    );

    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value === true
    ).length;

    return NextResponse.json(
      {
        success: true,
        sent: successCount,
        total: subscriptions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/push/test error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim tes notifikasi." },
      { status: 500 }
    );
  }
}

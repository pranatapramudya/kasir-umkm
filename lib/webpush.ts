import webpush from "web-push";

// Inisialisasi VAPID details — hanya dijalankan sekali saat module di-load
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:admin@pjtech.id";

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn(
    "[webpush] VAPID keys not set. Push notifications will not work. " +
      "Run `npx web-push generate-vapid-keys` and set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env"
  );
} else {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Mengirim push notification ke satu subscription.
 * @returns true jika berhasil, false jika gagal (misal: subscription sudah expired/invalid)
 */
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload
): Promise<boolean> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("[webpush] Skipping push — VAPID keys not configured.");
    return false;
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    // Status 410 Gone = subscription sudah tidak valid (user unsubscribe atau browser cleared)
    const statusCode =
      error instanceof webpush.WebPushError ? error.statusCode : null;
    console.error(
      `[webpush] Failed to send to ${subscription.endpoint.slice(0, 40)}...`,
      statusCode ? `(HTTP ${statusCode})` : error
    );
    return false;
  }
}

export default webpush;

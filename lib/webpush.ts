import webpush from "web-push";

// VAPID keys wajib dari environment variables — JANGAN hardcode di sini
// Generate key baru: npx web-push generate-vapid-keys
// Simpan ke .env.local (dev) dan Vercel Dashboard (production)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:pranatachain@gmail.com";

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn("[webpush] VAPID keys tidak ditemukan di environment variables. Push notification dinonaktifkan.");
} else {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (err) {
    console.warn("[webpush] Failed to set VAPID details:", err);
  }
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

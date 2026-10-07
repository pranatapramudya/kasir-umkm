"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Mengkonversi base64url string ke Uint8Array<ArrayBuffer>
 * Diperlukan untuk mengkonversi VAPID public key sebelum dikirim ke pushManager.subscribe()
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  // Gunakan new ArrayBuffer(n) agar tipe menjadi Uint8Array<ArrayBuffer>
  // (bukan Uint8Array<ArrayBufferLike> yang tidak kompatibel dengan PushManager API)
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Mendaftarkan Service Worker dan meng-subscribe push notification.
 * Mengirimkan subscription ke API backend untuk disimpan.
 */
async function subscribeAndSave(): Promise<boolean> {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    console.warn("[PushManager] NEXT_PUBLIC_VAPID_PUBLIC_KEY tidak di-set.");
    return false;
  }

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("[PushManager] Browser tidak mendukung Push Notifications.");
    return false;
  }

  try {
    // Daftarkan service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    // Subscribe push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const subscriptionJSON = subscription.toJSON();

    // Kirim ke backend
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        p256dh: subscriptionJSON.keys?.p256dh,
        auth: subscriptionJSON.keys?.auth,
      }),
    });

    if (!response.ok) {
      console.error("[PushManager] Gagal menyimpan subscription ke server.");
      return false;
    }

    return true;
  } catch (error: any) {
    if (error?.name === "AbortError" || (typeof error?.message === "string" && error.message.includes("push service error"))) {
      console.warn("[PushManager] Push service tidak tersedia / di-abort browser di localhost (non-kritis):", error?.message);
    } else {
      console.warn("[PushManager] Peringatan saat subscribe:", error?.message || error);
    }
    return false;
  }
}

/**
 * PushNotificationManager
 * Client component yang dipasang di /admin layout.
 * Secara otomatis meminta izin notifikasi dan mendaftarkan subscription.
 */
export default function PushNotificationManager() {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const toastShownRef = useRef(false);
  const subscribedRef = useRef(false);

  useEffect(() => {
    // Pastikan browser mendukung Notification API
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const current = Notification.permission;
    setPermissionStatus(current);

    if (current === "granted" && !subscribedRef.current) {
      // Sudah diizinkan sebelumnya, langsung subscribe (silent)
      subscribedRef.current = true;
      subscribeAndSave().catch((err) => {
        if (err?.name !== "AbortError") {
          console.warn("[PushManager] Silent subscribe issue:", err);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (permissionStatus === "default" && !toastShownRef.current) {
      toastShownRef.current = true;

      // Tampilkan toast ajakan mengaktifkan notifikasi
      toast("🔔 Aktifkan notifikasi untuk pesanan baru", {
        description:
          "Dapatkan notifikasi real-time setiap ada booking atau pesanan masuk.",
        duration: 12000,
        action: {
          label: "Aktifkan",
          onClick: async () => {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === "granted") {
              const success = await subscribeAndSave();
              if (success) {
                toast.success("Notifikasi berhasil diaktifkan! 🎉", {
                  description: "Anda akan menerima notifikasi pesanan baru.",
                });
              } else {
                toast.error("Gagal mendaftarkan notifikasi.", {
                  description:
                    "Pastikan service worker berjalan dan coba lagi.",
                });
              }
            } else if (permission === "denied") {
              toast.error("Notifikasi diblokir.", {
                description:
                  "Aktifkan di pengaturan browser untuk menerima notifikasi.",
              });
            }
          },
        },
        cancel: {
          label: "Nanti saja",
          onClick: () => {},
        },
      });
    }
  }, [permissionStatus]);

  // Komponen ini tidak me-render apapun secara visual
  return null;
}

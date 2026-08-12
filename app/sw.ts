import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkFirst } from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts-cache",
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response?.status === 0 || response?.status === 200
                ? response
                : null;
            },
          },
        ],
      }),
    },
    {
      matcher: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "gstatic-fonts-cache",
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response?.status === 0 || response?.status === 200
                ? response
                : null;
            },
          },
        ],
      }),
    },
    {
      matcher: /^\/api\/(?!push).*/,
      handler: new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
      }),
    },
    {
      matcher: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: new CacheFirst({
        cacheName: "image-cache",
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response?.status === 0 || response?.status === 200
                ? response
                : null;
            },
          },
        ],
      }),
    },
  ],
});

serwist.addEventListeners();

// Beberapa property Push API (vibrate, actions, requireInteraction) tidak ada
// di definisi TS webworker lib — extend lokal agar type-safe
type ExtendedNotificationOptions = NotificationOptions & {
  vibrate?: number[];
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
  badge?: string;
};

// Handle push notifications
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  try {
    const data = event.data.json() as {
      title: string;
      body: string;
      url?: string;
      icon?: string;
    };

    const options: ExtendedNotificationOptions = {
      body: data.body,
      icon: data.icon ?? "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url ?? "/admin/booking",
      },
      actions: [
        {
          action: "open",
          title: "Buka Dashboard",
        },
        {
          action: "close",
          title: "Tutup",
        },
      ],
      requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch {
    // fallback jika payload bukan JSON
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("PJTECH Kasir", {
        body: text,
        icon: "/icon-192x192.png",
      })
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const url: string = event.notification.data?.url ?? "/admin/booking";

  if (event.action === "close") return;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

// Service Worker for PJTECH KASIR PWA & Realtime Push Notifications
// Serves offline capabilities, web push events, and notification interaction

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push notification events sent from backend
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "Pesanan Baru Masuk! 🔔";
    const options = {
      body: data.body || "Ada pesanan atau reservasi baru di sistem kasir Anda.",
      icon: data.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/admin/booking",
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

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("PJTECH Kasir 🔔", {
        body: text || "Pesanan baru telah masuk.",
        icon: "/icon-192x192.png",
      })
    );
  }
});

// Handle notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin/booking";

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

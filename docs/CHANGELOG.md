# Changelog — PJTECH KASIR UMKM

Semua perubahan signifikan pada proyek ini didokumentasikan di sini.  
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.2.13 – 0.2.20] — 2026-08-12

### 🚀 Fitur Baru

- **Dynamic Multi-Tenant Booking System (Modul Jasa)**
  - Halaman booking publik per-tenant (`/book/[slug]`) dengan form pemilihan layanan, tanggal, dan jam.
  - Anti-double-booking guard di backend (backend race-condition safe).
  - Kalender interaktif untuk owner (berbasis `react-big-calendar`) di dashboard `/admin/booking`.
  - API slot-checking (`/api/booking/check-slots`) untuk validasi ketersediaan jadwal secara real-time.

- **Progressive Web App (PWA) Full-Screen**
  - `app/manifest.ts` — Web App Manifest dengan `display: "standalone"` dan `orientation: "portrait"`.
  - Service Worker (`app/sw.ts`) via `@serwist/next` dengan caching strategy (CacheFirst / NetworkFirst).
  - Meta tags `appleWebApp` di root layout untuk pengalaman PWA di perangkat iOS.

- **Web Push Notifications (Real-Time)**
  - Model database `PushSubscription` (Prisma) untuk menyimpan subscription per-user.
  - API `POST/DELETE /api/push/subscribe` — upsert/hapus subscription browser ke DB.
  - Utility backend `lib/webpush.ts` dengan VAPID keys via library `web-push`.
  - Notifikasi otomatis dikirim ke Owner toko & Super Admin setiap ada booking baru masuk.
  - Client Component `PushNotificationManager.tsx` — toast izin notifikasi (via Sonner), auto-subscribe jika sudah granted.

- **Web Bluetooth ESC/POS Thermal Printing**
  - Cetak struk thermal nirkabel langsung dari browser via Web Bluetooth API.
  - Kompatibel dengan printer ESC/POS standar tanpa driver atau aplikasi pihak ketiga.

---

### 🐛 Perbaikan (Bugfix & UI/UX)

- **Redirect expired trial** — Perbaikan logika redirect saat sesi trial habis agar tidak terjadi infinite loop atau redirect yang salah.
- **Kalkulasi harga di komponen Pricing** — Koreksi formula perhitungan harga/diskon di halaman Pricing agar akurat.
- **Isolasi menu mobile (Multi-Tenant)** — Perbaikan race-condition UI saat perpindahan tenant di perangkat mobile.
- **Header responsif Super Admin (v0.2.19)**
  - Hapus tombol Logout redundan (digantikan oleh `UserButton` Clerk bawaan).
  - Tipografi responsif: `text-base md:text-xl leading-tight`.
  - Teks "Command Center" disembunyikan di layar HP kecil (`hidden sm:inline`).
- **Refaktor UI Filter Kategori Super Admin (v0.2.20)**
  - Tab/pill group horizontal diganti dengan `<CategoryFilter />` dropdown (`<select>` native).
  - Responsif: `w-full md:w-64`, ikon Filter (corong) di dalam select.
  - Logika URL param & pagination tetap berfungsi penuh.

---

### 🔧 Perubahan Teknis (Chores)

- Install dependencies: `@serwist/next`, `serwist`, `web-push`, `@types/web-push`.
- Tambah `"webworker"` ke `lib` di `tsconfig.json` untuk type-checking Service Worker.
- Script `build` diubah ke `next build --webpack` agar kompatibel dengan `@serwist/next`.
- Script `build:prod` ditambahkan sebagai alias eksplisit.
- `turbopack: {}` ditambahkan ke `next.config.ts` untuk silence peringatan Turbopack saat `next dev`.
- VAPID env vars ditambahkan: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
- `SUPER_ADMIN_USER_IDS` env var untuk mendefinisikan penerima notifikasi Super Admin.

---

## [0.2.0 – 0.2.12] — Sebelumnya

Lihat [`docs/RELEASE-NOTES-v0.2.md`](./RELEASE-NOTES-v0.2.md) untuk detail versi sebelumnya.

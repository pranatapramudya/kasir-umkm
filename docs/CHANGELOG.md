# Changelog — PJTECH KASIR UMKM

Semua perubahan signifikan pada proyek ini didokumentasikan di sini.  
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.0 – 0.3.32] — 2026-08-17

### 🚀 Fitur Baru & Arsitektur Utama
- **Arsitektur Isolasi Tenant (Anti-Leakage):** Pencatatan mekanisme pembersihan *cache* (SWR & `localStorage`) pada level sesi pengguna dan proteksi `<LoadingSkeleton>` untuk mencegah kebocoran data antar pengguna.
- **Integrasi Supabase Real-time:** Peralihan dari metode *fast polling* menjadi *Postgres Changes Listener* yang diisolasi menggunakan filter `tenantId`, dipadukan dengan SWR `mutate` untuk pembaruan UI instan yang hemat *resource*.
- **Sistem Kalender Anti Double-Booking:** Penambahan kapabilitas pengecekan ketersediaan jadwal via `/api/booking/availability`, serta integrasi `react-day-picker` berbalut *Popover Modal* dengan pengamanan sinkronisasi zona waktu lokal (WIB/Lokal) vs UTC.
- **Dynamic Multi-Tenant UX & Export:** Implementasi utilitas terminologi teks yang menyesuaikan bahasa UI berdasarkan model bisnis (Rental vs Jasa vs Retail/F&B), termasuk adaptasi format kolom pada *export* Excel.
- **Modul Onboarding (Buku Panduan):** Penambahan fitur dokumentasi interaktif (SOP) internal pada *Sidebar* untuk memandu alur kerja pengguna berdasarkan entitas bisnis masing-masing.

---

## [0.2.21 – 0.2.32] — 2026-08-13

### 🚀 Fitur Baru
- **Implementasi Ekosistem "Rental & Travel":** Dukungan rentang tanggal (Date Range booking), form input armada (nama supir & plat nomor) di POS Kasir, dan integrasi cetak struk via Bluetooth khusus untuk Rental.
- **Pemisahan UI Dual-Role Login:** Akses masuk ke sistem kini terpisah secara visual antara Pemilik Bisnis (Owner) dan Karyawan pada komponen Landing Page.
- **Lokalisasi Bahasa Indonesia (Clerk Auth):** Seluruh antarmuka autentikasi Clerk (Sign In, Sign Up, User Profile, validasi form) menggunakan dialek ID (id-ID).
- **Ekspor Excel Dinamis:** Kolom laporan Excel kini beradaptasi secara otomatis dengan kategori bisnis (*Dynamic Excel Export*).

### ⚡ Optimasi & Pembaruan
- **Navigasi Instan:** Implementasi *Prefetching* pada navigasi dan penambahan *Skeleton Loading* untuk meminimalisasi jeda pergantian rute.

### 🐛 Perbaikan Bug (Bugfixes)
- **Foreign Key Constraint:** Mencegah terjadinya error foreign key saat melakukan *checkout* (menyimpan transaksi) oleh Kasir.
- **Server Components Render Error:** Perbaikan masalah *serialize data* (throw err object) saat penambahan data karyawan/kasir baru.
- **Flickering Data Karyawan:** Menanggulangi hilangnya daftar produk yang kadang terjadi saat kasir/karyawan me-refresh halaman POS.
- **Filter Kategori (Superadmin):** Mencegah efek layar terlempar ke atas (*scroll-to-top*) saat melakukan filter tabel data tenant.
- **Invalid Prisma Invocation:** Mengubah eksekusi `findUnique` menjadi `findFirst` guna mencegah crash saat pendaftaran toko/tenant (Onboarding).

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

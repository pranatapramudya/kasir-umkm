# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.18
**Fokus:** Konfigurasi PWA Full-Screen & Sistem Web Push Notification (Owner & Super Admin)

## 1. Objektif
Mengubah aplikasi Next.js menjadi Progressive Web App (PWA) agar dapat diinstal ke Home Screen perangkat *mobile* dengan tampilan *standalone/fullscreen*. Selanjutnya, mengimplementasikan sistem Web Push Notifications agar Owner (Penyedia Jasa/UMKM) dan Super Admin menerima notifikasi *real-time* saat ada pesanan atau *booking* masuk.

## 2. Konfigurasi PWA (Progressive Web App)
**Instruksi untuk AI:**
1. **Manifest Web:** Buat file `app/manifest.ts` (mengikuti standar Next.js App Router) yang me-return objek manifest. Pastikan menggunakan properti `display: "standalone"`, `orientation: "portrait"`, nama aplikasi ("PJTECH Kasir"), dan konfigurasi ikon dasar (sertakan placeholder path `/icon-192x192.png` dan `/icon-512x512.png`).
2. **Meta Tags iOS:** Pada `app/layout.tsx`, tambahkan metadata PWA pendukung untuk perangkat Apple, seperti `appleWebApp: { capable: true, statusBarStyle: "default", title: "PJTECH Kasir" }`.
3. **PWA Wrapper/Plugin:** Gunakan pendekatan standar Next.js PWA. Sangat direkomendasikan menggunakan library `@serwist/next` (rekomendasi modern pengganti `next-pwa` untuk App Router) atau `next-pwa` yang dikonfigurasi dengan benar di `next.config.mjs` untuk meng- *generate* Service Worker (`sw.js`).

## 3. Database Schema: Penyimpanan Subskripsi Notifikasi
**Target:** `prisma/schema.prisma`
**Instruksi:**
1. Buat model baru bernama `PushSubscription`.
2. Field yang dibutuhkan: 
   - `id` (String/UUID)
   - `endpoint` (String)
   - `p256dh` (String)
   - `auth` (String)
   - `userId` (String) -> Relasi ke Clerk user ID (Tenant/Owner/SuperAdmin).
3. Jalankan `npx prisma db push` setelah skema dibuat.

## 4. Konfigurasi VAPID & Library Push
**Instruksi:**
1. Install library backend: `npm install web-push` dan types-nya `@types/web-push`.
2. Instruksikan *developer* (pengguna) untuk men-generate VAPID keys menggunakan command `npx web-push generate-vapid-keys` (infokan untuk menyimpan hasilnya di `.env` sebagai `NEXT_PUBLIC_VAPID_PUBLIC_KEY` dan `VAPID_PRIVATE_KEY`).
3. Setup inisialisasi `web-push.setVapidDetails()` di sebuah utility backend.

## 5. API Routes untuk Notifikasi
**Instruksi:**
1. **Route Subscribe (`POST /api/push/subscribe`):** Menerima objek *subscription* dari browser klien dan `userId` dari session Clerk, lalu menyimpannya ke tabel `PushSubscription`.
2. **Injeksi di Route Booking (`POST /api/booking`):**
   - Setelah logika sukses menyimpan data `Booking` ke database, lakukan *query* ke `PushSubscription` untuk mencari data milik DUA pihak:
     a. `userId` milik Owner toko tersebut (berdasarkan *slug*).
     b. `userId` milik Super Admin (buat array/konstanta berisi ID Super Admin lu).
   - Gunakan `web-push.sendNotification()` untuk mengirim payload JSON (berisi *title*, *body*, dan *url* tujuan ke dashboard) kepada *endpoints* yang ditemukan tersebut. Bungkus dengan blok `try-catch` agar kegagalan notifikasi tidak menggagalkan proses *booking*.

## 6. Frontend: Meminta Izin & Register Service Worker
**Target:** Buat Client Component (misal `components/PushNotificationManager.tsx`) dan pasang di *layout* Dashboard (`/admin/layout.tsx`).
**Instruksi:**
1. Saat komponen di-mount, cek status `Notification.permission`.
2. Jika *default*, tampilkan tombol atau *toast* kecil untuk meminta izin: "Aktifkan notifikasi untuk pesanan baru".
3. Jika *granted* (diizinkan), jalankan fungsi untuk mendapatkan status *Service Worker registration*, panggil `pushManager.subscribe()` menggunakan `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, lalu kirim hasil *subscription* tersebut ke endpoint `/api/push/subscribe`.

Silakan analisis instruksi ini dan generate struktur file serta kodenya secara bertahap! Dilarang keras merusak rute yang sudah berjalan normal!
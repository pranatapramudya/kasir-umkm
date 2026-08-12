# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.21
**Fokus:** Bugfix PWA Start URL & Whitelist Public Assets di Clerk Middleware

## 1. Objektif
Memperbaiki *routing* PWA agar saat aplikasi dibuka dari *Home Screen* perangkat *mobile*, pengguna diarahkan ke *Landing Page* (`/`), bukan langsung ke modal *Login*. Selain itu, memperbaiki isu ikon PWA yang tidak muncul akibat terblokir oleh otentikasi *middleware*.

## 2. Bugfix: Konfigurasi Manifest PWA
**Target File:** `app/manifest.ts`
**Instruksi:**
1. Pastikan properti `start_url` bernilai `"/"`. Jika sebelumnya bernilai `.` atau `"/admin"`, segera ubah menjadi `"/"`.
2. Pastikan path ikon menggunakan *absolute path* dari *root*. 
   - Ubah/Pastikan menjadi: `src: "/icon-192x192.png"` dan `src: "/icon-512x512.png"`. (Gunakan garis miring di awal).

## 3. Bugfix: Whitelist Assets di Clerk Middleware
**Target File:** `middleware.ts` (biasanya berada di *root* proyek atau di dalam folder `src/`).
**Instruksi:**
1. Komponen PWA seperti Manifest, Service Worker, dan Ikon HARUS bisa diakses tanpa otentikasi.
2. Update konfigurasi `clerkMiddleware`. Jika menggunakan format `createRouteMatcher` atau `publicRoutes`, tambahkan *array* *whitelist* berikut ke dalam rute publik:
   - `\` (Landing page utama)
   - `\/(.*)\.png$` (Semua file gambar PNG, termasuk ikon PWA)
   - `\/manifest\.(json|webmanifest)` atau sekadar `\/manifest(.*)`
   - `\/sw\.js`
   - `\/workbox-(.*)`
3. Pastikan regex pada `matcher` di bagian paling bawah `middleware.ts` tidak secara tidak sengaja memblokir file statis yang dibutuhkan oleh PWA.

## 4. Eksekusi & Validasi
Silakan perbarui kedua file di atas. Pastikan tidak ada *error* TypeScript pada `middleware.ts` setelah modifikasi.
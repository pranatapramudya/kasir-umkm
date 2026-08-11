# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.17
**Fokus:** Resolusi Infinite Redirect Loop & Clock Skew Auth (Clerk JWT)

## 1. Analisis Masalah (Authentication Bug)
Berdasarkan log terminal, aplikasi terjebak dalam masalah otentikasi fatal yang ditandai dengan dua *error* utama:
*   **Clock Skew (Waktu Tidak Sinkron):** Waktu (*clock*) pada komputer lokal (localhost) tertinggal sekitar 7 detik dari server Clerk (`Current date: 15:50:09 GMT`, sedangkan Token `Issued at date: 15:50:16 GMT`). JWT (*JSON Web Token*) sangat sensitif terhadap waktu. Karena token seolah-olah diterbitkan di "masa depan", sistem menolaknya demi keamanan.
*   **Infinite Redirect Loop:** Karena token ditolak, *middleware* Clerk menganggap sesi tidak valid dan terus melempar pengguna ke halaman `/sign-in`. Halaman `/sign-in` mencoba memvalidasi lagi, gagal lagi, lalu melempar kembali. Hal ini menciptakan *loop* tanpa batas yang menghasilkan layar *blank* putih.

## 2. Solusi Teknis & Langkah Resolusi

Masalah ini mayoritas bukan berasal dari kode React/Next.js, melainkan dari konfigurasi *environment* lokal dan *middleware*.

### A. Sinkronisasi Waktu Sistem (OS Level - Wajib)
Ini adalah penyebab utama JWT ditolak.
*   **Tindakan:** Buka pengaturan waktu di sistem operasi komputer (Windows: *Date & Time Settings* -> Matikan lalu nyalakan kembali *Set time automatically*, atau klik tombol **Sync now**). Pastikan jam komputer benar-benar akurat dengan standar waktu global.

### B. Hard Reset Sesi Browser (Clear Cookies)
Token JWT dari "masa depan" yang sudah terlanjur dibuat saat ini masih nyangkut di *browser* dan membuat *looping* terus berjalan.
*   **Tindakan:** Buka *tab browser* tempat `localhost:3000` berjalan. Tekan `F12` (*Developer Tools*) -> Masuk ke tab **Application** -> Di menu kiri bawah, pilih **Cookies** -> `http://localhost:3000`. Klik kanan dan pilih **Clear** (Hapus semua cookies). 

### C. Verifikasi Konfigurasi Middleware (`middleware.ts`)
Pastikan file *middleware* tidak memicu perlindungan ganda pada halaman otentikasi itu sendiri.
*   **Target File:** `middleware.ts` (di root proyek atau folder `src`).
*   **Implementasi:** Pastikan kodenya menggunakan standar pengecualian terbaru agar `/sign-in` tidak ikut terkunci:
    ```typescript
    import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

    // Hanya lindungi rute /admin dan anak-anaknya
    const isProtectedRoute = createRouteMatcher([
      '/admin(.*)'
    ]);

    export default clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) auth().protect();
    });

    export const config = {
      matcher: [
        // Abaikan file statis dan internal Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Eksekusi middleware pada rute API
        '/(api|trpc)(.*)',
      ],
    };
    ```

### D. Pengecekan Environment Variables
Jika setelah sinkronisasi waktu dan *clear cookies* masih terjadi *infinite loop*.
*   **Tindakan:** Verifikasi kembali isi `.env.local`. Pastikan nilai `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY` benar-benar disalin utuh (tidak ada spasi ekstra) dari Dashboard Clerk.
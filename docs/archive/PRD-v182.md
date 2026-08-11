# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.82
**Fokus:** Perbaikan Infinite Redirect Loop pada Middleware Clerk (Role Authorization)

## 1. Objektif & Analisis Masalah
Saat ini terjadi kendala *Infinite Redirect Loop* (layar putih) ketika pengguna terautentikasi mencoba mengakses rute `/superadmin` namun gagal membaca klaim `role`. Kesalahan terletak pada logika penanganan *redirect*. Jika pengguna sudah login namun bukan Superadmin, mengarahkan mereka kembali ke `/sign-in` akan memicu Clerk untuk memantulkan kembali pengguna ke halaman sebelumnya, menciptakan *loop* tanpa henti.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan logika autentikasi dan otorisasi pada *middleware* utama aplikasi.

### A. Refaktor `middleware.ts`
*   **Target File:** `middleware.ts` (berada di *root* direktori atau di dalam `src/` tergantung struktur Next.js).
*   **Instruksi:** 
    1. Ganti seluruh isi file `middleware.ts` dengan logika baru yang lebih aman.
    2. Deteksi rute yang diproteksi menggunakan `createRouteMatcher(['/superadmin(.*)'])`.
    3. Ekstrak `sessionClaims` dan `userId` dari objek `auth()`.
    4. **ATURAN MUTLAK 1 (Unauthenticated):** Jika tidak ada `userId` (belum login), gunakan `auth().redirectToSignIn()` untuk melempar pengguna ke halaman login Clerk.
    5. **ATURAN MUTLAK 2 (Unauthorized):** Jika ada `userId` (sudah login) TETAPI `sessionClaims?.role !== 'SUPERADMIN'`, MAKA **WAJIB** melempar pengguna ke halaman Beranda (`/`) menggunakan `NextResponse.redirect(new URL('/', req.url))`. DILARANG KERAS melempar ke halaman `/sign-in` untuk mencegah *infinite loop*.

### B. Output Kode yang Diharapkan
Tulis ulang `middleware.ts` dengan mengimplementasikan TypeScript bawaan dari `@clerk/nextjs/server` dan `next/server`. Pastikan blok `export const config` untuk `matcher` tidak berubah dan tetap mengecualikan rute statis Next.js.

Silakan eksekusi perbaikan *middleware* ini secara langsung!
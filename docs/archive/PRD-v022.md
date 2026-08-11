# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.22
**Fokus:** Resolusi Rute Sign-In (Authentication UI Rendering)

## 1. Analisis Masalah
*   **Gejala:** Aplikasi berhasil mengarahkan pengguna yang belum diotentikasi ke rute `/sign-in?redirect_url=...`, namun pengguna seolah terjebak di sana (kemungkinan blank atau 404).
*   **Penyebab:** *Middleware* Clerk sudah bekerja secara semestinya dengan memblokir akses ke `/admin` bagi pengguna yang tidak memiliki sesi aktif. Namun, *fallback routing* menuju form *login* belum terkonfigurasi dengan benar di tingkat aplikasi Next.js (App Router), sehingga aplikasi tidak tahu komponen UI apa yang harus dirender pada URL tersebut.

## 2. Instruksi untuk AI Agent
Sebagai AI Agent, jalankan audit dan perbaikan pada arsitektur autentikasi proyek dengan langkah-langkah eksak berikut:

### A. Konfigurasi Halaman Kustom Autentikasi (App Router)
1.  Periksa keberadaan direktori *catch-all* untuk halaman login. Pastikan terdapat file di *path*: `app/sign-in/[[...sign-in]]/page.tsx`.
2.  Jika file tersebut belum ada atau isinya salah, buat/perbaiki agar file tersebut mengimpor dan merender komponen `<SignIn />` bawaan `@clerk/nextjs`. 
3.  Lakukan prosedur yang sama persis untuk halaman daftar di *path*: `app/sign-up/[[...sign-up]]/page.tsx` dengan komponen `<SignUp />`.

### B. Validasi Environment Variables
Buka file `.env.local` di proyek. Sistem Clerk memerlukan penunjuk arah rute yang absolut. Pastikan variabel pendukung berikut terdefinisi secara eksplisit:
*   `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
*   `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
*   `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/admin`
*   `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/admin`

### C. Isolasi Middleware
Verifikasi kembali file `middleware.ts`. Pastikan variabel `isProtectedRoute` HANYA menargetkan `/admin(.*)`. Rute `/sign-in` dan `/sign-up` harus berstatus publik. Jika rute *sign-in* ikut terproteksi, itu akan menciptakan *infinite loop* atau layar *blank* saat Clerk mencoba merender komponen.
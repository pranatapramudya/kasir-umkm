# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.73
**Fokus:** Simplifikasi "Secret Backdoor" Tanpa Logika Auth Frontend

## 1. Analisis Bug UX
*   **Masalah:** Pintu rahasia di logo "PJTECH KASIR" tidak bisa diklik. Hal ini terjadi karena agen AI kebingungan memproses logika kondisional autentikasi (Clerk) di komponen Landing Page.
*   **Solusi:** Simplifikasi total. Frontend tidak perlu memikirkan apakah pengguna itu Superadmin atau bukan. Biarkan logo tersebut SELALU menjadi tautan aktif. Kita akan mengandalkan perlindungan rute yang sudah ada di `middleware.ts` untuk memblokir akses tidak sah.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent (DILARANG MEMBERIKAN KODE MENTAH)
Buat logo tersebut menjadi tautan statis biasa tanpa logika pengecekan pengguna.

### A. Simplifikasi Tautan Logo
*   **Target File:** `app/page.tsx` (Area form login kanan)
*   **Instruksi Konseptual:**
    1. Cari elemen Logo/Teks "PJTECH KASIR" di dalam kartu *Glassmorphism*.
    2. Hapus SEMUA logika pengecekan *role*, `auth()`, `sessionClaims`, atau `useUser()` yang sebelumnya Anda buat untuk logo ini. Hapus bersih!
    3. Cukup bungkus elemen Logo tersebut secara statis dan permanen dengan komponen Tautan (Link) Next.js yang mengarah ke rute `/superadmin`.
    4. Pastikan kursor berubah menjadi penunjuk (pointer) saat diarahkan ke logo tersebut, namun jangan ubah warna teks logo menjadi biru tautan standar (pertahankan warna aslinya agar tetap "stealth").

Silakan eksekusi penyederhanaan ini. Jangan berpikir terlalu rumit, cukup jadikan logo tersebut sebuah Link biasa!
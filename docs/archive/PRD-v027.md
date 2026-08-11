# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.27
**Fokus:** Perbaikan Target Redirect Pasca-Otentikasi (Fokus Halaman Kasir)

## 1. Analisis Masalah
*   **Perilaku Saat Ini:** Setelah pengguna berhasil masuk (Sign-In) atau mendaftar (Sign-Up), aplikasi secara otomatis melempar pengguna ke rute Dasbor Admin (`/admin`).
*   **Perilaku yang Diharapkan:** Pengguna harus diarahkan kembali atau tetap berada di halaman Kasir/Storefront utama (rute `/`) setelah otentikasi berhasil, bukan ke Dasbor Admin.
*   **Akar Masalah:** Properti `fallbackRedirectUrl` pada komponen Clerk atau variabel lingkungan (`.env.local`) masih diatur secara *hardcode* menuju `/admin`.

## 2. Instruksi Pemeriksaan & Perbaikan untuk AI Agent
Sebagai agen pengembang, tugas Anda adalah mengubah alur navigasi pasca-otentikasi. Eksekusi instruksi berikut tanpa mengubah logika sistem lainnya:

### A. Update Target Redirect di Komponen Autentikasi
1.  Buka file `app/sign-in/[[...sign-in]]/page.tsx`. Temukan komponen bawaan Clerk dan ubah properti arah *redirect* jatuh-mundurnya (*fallback redirect*) agar menunjuk langsung ke rute utama kasir (biasanya `/`).
2.  Buka file `app/sign-up/[[...sign-up]]/page.tsx` dan lakukan perubahan properti yang sama persis menuju rute utama kasir (`/`).

### B. Sinkronisasi Environment Variables
*   Buka file `.env.local` pada *root* proyek.
*   Cari variabel yang mengatur target URL setelah *login* dan *register* (seperti `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` dan varian `SIGN_UP`).
*   Ubah nilainya yang semula `/admin` menjadi `/`.

### C. Validasi Skenario
*   Pastikan ketika *user* melakukan *login*, transisinya langsung diarahkan ke antarmuka Point of Sales (Kasir) tempat transaksi dilakukan.
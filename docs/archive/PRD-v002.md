# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.2
**Fokus:** Integrasi UI Autentikasi Frontend (Clerk) & Penanganan Error 401

## 1. Latar Belakang Masalah
Setelah API berhasil diproteksi menggunakan `auth().userId` (SaaS Multi-tenant), aplikasi klien (Storefront di `app/page.tsx`) mengalami *crash* dengan pesan `Error: Unauthorized (401)`. Hal ini terjadi karena klien mencoba melakukan *fetch* data sebelum pengguna melakukan login, dan antarmuka belum menyediakan opsi untuk registrasi/autentikasi melalui Clerk.

## 2. Solusi Arsitektur Frontend
Kita harus menghubungkan komponen UI Clerk dengan halaman utama agar sistem SaaS bisa mulai menerima pendaftaran *tenant* (owner).

### A. Konfigurasi Global (`app/layout.tsx`)
* Pastikan seluruh aplikasi sudah dibungkus oleh `<ClerkProvider>`. Tanpa ini, semua *hooks* dan komponen Clerk tidak akan berfungsi.

### B. Conditional Rendering di Storefront (`app/page.tsx`)
Halaman kasir harus dibagi menjadi dua keadaan (menggunakan komponen `<SignedIn>` dan `<SignedOut>` dari `@clerk/nextjs`):
1. **State Belum Login (`<SignedOut>`):**
   - Tampilkan *landing page* mini atau *hero section* sederhana.
   - Judul: "Selamat Datang di PJTECH KASIR POS".
   - Deskripsi: "Platform kasir digital untuk mengelola usaha Anda."
   - Tombol: Gunakan `<SignInButton mode="modal">` dari Clerk agar pengguna bisa mendaftar/login langsung dari *pop-up*.
   - **Penting:** Hentikan proses *fetching* API (SWR atau `fetch` biasa) jika berada di state ini agar tidak memicu error 401.

2. **State Sudah Login (`<SignedIn>`):**
   - Tampilkan UI aplikasi Kasir POS secara utuh (yang sudah ada saat ini).
   - Pastikan ada komponen `<UserButton />` di bagian Header/Navbar (pojok kanan atas) agar *tenant* bisa melakukan *logout* atau mengatur profil akunnya.
   - Proses *fetching* ke `/api/products` baru boleh dijalankan di state ini.

### C. Refaktor Fungsi Fetcher
* Modifikasi blok `if (res.status === 401)` pada fungsi *fetcher*. Daripada melempar (*throw*) error yang membuat aplikasi *crash*, lebih baik kembalikan array kosong `[]` atau string pesan error yang bisa ditangkap oleh UI secara elegan.
# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.68
**Fokus:** Kustomisasi UI Clerk, Default Role Assignment, & Alur Onboarding (Tenant Setup)

## 1. Analisis Kebutuhan Arsitektur (SaaS Multi-Tenant)
*   **Masalah UI Clerk:** Tampilan *login/signup* saat ini masih menggunakan tema bawaan (*default*) Clerk yang terasa terpisah dari identitas *branding* PJTECH (biru modern).
*   **Masalah Alur Bisnis:** Saat pengguna baru mendaftar, mereka langsung dilempar ke Dasbor tanpa sistem mengetahui nama toko atau jenis usahanya. Selain itu, belum ada pemisahan jalur pendaftaran antara Pemilik (Owner) dan Karyawan (Kasir).
*   **Tujuan:** Mengkustomisasi UI Clerk agar selaras dengan tema aplikasi, menetapkan *role* `OWNER` secara *default* untuk pendaftar publik, dan membuat halaman *Onboarding* wajib bagi pendaftar baru.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Terapkan arsitektur ini tanpa menulis kode statis HTML mentah. Manfaatkan fitur bawaan Clerk dan Next.js Middleware.

### A. Kustomisasi Tema Clerk (Branding UI)
*   **Target File:** `layout.tsx` (Root Layout tempat `<ClerkProvider>` berada).
*   **Instruksi:**
    1. Gunakan *prop* `appearance` pada `<ClerkProvider>`.
    2. Modifikasi properti `variables` untuk mengubah `colorPrimary` menjadi kode warna biru utama PJTECH (misalnya `#3b82f6` atau hex biru tombol mulai di *landing page*).
    3. Tambahkan URL logo PJTECH pada properti `logoImageUrl` agar logo *default* Clerk tergantikan.
    4. *(Opsional)* Sesuaikan `borderRadius` agar melengkung modern (misal `0.75rem`) menyesuaikan tema LumeStack.

### B. Arsitektur Default Role & Route Interception
*   **Target File:** `middleware.ts` & Basis Data (Prisma).
*   **Instruksi Logika:**
    1. **Asumsi Dasar:** Semua pendaftaran publik yang masuk melalui `<SignUp />` Clerk adalah `OWNER` bisnis (Tenant).
    2. **Logika Middleware (Onboarding):** Setelah pengguna *login*, cek apakah pengguna ini sudah memiliki data "Toko/Tenant" di dalam basis data kita. (Bisa dengan mengecek *flag* `onboardingComplete` di `sessionClaims` atau *database*).
    3. JIKA belum komplit, cegah mereka masuk ke `/admin` atau `/`, dan *redirect* paksa secara terus-menerus ke rute baru: `/onboarding`.

### C. Pembuatan Halaman Onboarding (Setup Wizard)
*   **Target File:** Buat rute baru `app/onboarding/page.tsx`.
*   **Instruksi UI/UX:**
    1. Buat halaman berdesain bersih (tanpa *Sidebar* atau navigasi utama) yang menyambut pengguna baru.
    2. Tampilkan Form Setup Bisnis yang menanyakan:
       * **Nama Toko / Usaha** (Input Teks)
       * **Kategori Usaha** (Dropdown: F&B/Kuliner, Retail/Toko Kelontong, Jasa, Lainnya)
    3. **Logika Aksi:** Saat form di- *submit*, simpan data ini ke tabel `Store` atau `Tenant` di Prisma, lalu *update* metadata pengguna di Clerk (tandai *onboarding* selesai dan tetapkan *role* `OWNER`).
    4. Setelah sukses, arahkan pengguna ke `/admin` (Dasbor).

### D. Konsep Penciptaan Akun Kasir (Untuk Fase Selanjutnya)
*   *Peringatan untuk Agent:* Jangan bangun fitur pendaftaran kasir di halaman publik. Nantinya, kita akan membuat menu khusus **"Pegawai"** di dalam Dasbor Admin, di mana `OWNER` bisa membuatkan akun dengan metadata `role: 'CASHIER'` secara internal.
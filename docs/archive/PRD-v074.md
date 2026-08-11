# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.74
**Fokus:** Manajemen Pegawai (Penciptaan Akun CASHIER via Clerk Backend API)

## 1. Analisis Kebutuhan Fitur (SaaS Multi-Tenant)
*   **Kebutuhan:** Owner membutuhkan panel untuk membuat dan mengelola akun karyawan (kasir) agar setiap transaksi memiliki *audit trail* yang jelas. 
*   **Batas (Limitasi):** Untuk MVP, sediakan kuota maksimal 2 akun kasir per Tenant/Toko.
*   **Arsitektur Keamanan:** Akun kasir TIDAK mendaftar sendiri dari luar. Akun diciptakan dari dalam (*Dashboard Owner*) menggunakan Server Action yang menembak langsung ke Backend API Clerk.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Sebagai agen pengembang, jangan membuat UI publik untuk kasir mendaftar. Gunakan `@clerk/nextjs/server` untuk membuat *user* secara terprogram dari dalam aplikasi.

### A. Rancang UI Manajemen Pegawai
*   **Target File:** Buat rute baru `app/admin/pegawai/page.tsx`
*   **Instruksi Layout:**
    1.  Tambahkan menu "Pegawai" di *Sidebar* dan *Bottom Nav* (khusus untuk role `OWNER`).
    2.  Di halaman tersebut, buat tabel sederhana yang menampilkan daftar kasir yang sudah ada.
    3.  Tambahkan tombol utama: **"Tambah Kasir Baru"**.
    4.  Batasi tombol ini: JIKA jumlah kasir yang terdaftar sudah 2, *disable* tombol tersebut dan beri teks "Batas Maksimal 2 Kasir".

### B. Form Pembuatan Akun (Modal)
*   **Instruksi Form:**
    1.  Saat tombol ditekan, munculkan *Modal* (Pop-up).
    2.  Hanya butuh 3 kolom *input*: 
        *   **Nama Lengkap Kasir**
        *   **Email Aktif / Username** (Untuk login)
        *   **Password Sementara** (Minimal 8 karakter)

### C. Server Action: Penciptaan User Clerk
*   **Target File:** `app/admin/pegawai/actions.ts`
*   **Instruksi Integrasi API Clerk:**
    1.  Terima data dari form di atas.
    2.  Validasi apakah *user* yang melakukan aksi ini memiliki `role: 'OWNER'` dan *fetch* `tenantId` (atau `userId` *owner* tersebut).
    3.  Gunakan metode dari Clerk SDK: `clerkClient.users.createUser({ ... })`.
    4.  Berikan parameter `emailAddress` dan `password` dari inputan form.
    5.  **WAJIB INJEKSI METADATA:** Saat memanggil `createUser`, langsung tanamkan objek `publicMetadata`:
        ```javascript
        publicMetadata: { 
          role: 'CASHIER', 
          tenantId: ownerTenantId // Ikat kasir ini ke toko milik Owner
        }
        ```
    6.  Jika sukses, berikan *feedback* sukses ke UI dan segarkan (*refresh*) tabel daftar pegawai.
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.80
**Fokus:** Relasi Data Tenant (Produk), Customisasi Clerk UserButton, & Pembaruan Middleware RBAC

## 1. Analisis Kebutuhan Arsitektur
*   **Data Isolation Issue:** Kasir tidak dapat melihat produk karena kueri basis data menggunakan `userId` kasir tersebut. Kueri harus menggunakan `tenantId` (ID Owner) jika pengguna adalah kasir.
*   **UI Leak (Upgrade Pro):** Tombol "Upgrade ke Pro" di dalam profil Clerk (`UserButton`) masih terlihat oleh kasir. Ini harus difilter.
*   **Routing Update:** Kasir perlu mengakses halaman Dashboard (`/admin`), namun rute tersebut saat ini diblokir sepenuhnya oleh Middleware.

## 2. Instruksi Eksekusi untuk AI Agent
Lakukan modifikasi pada kueri Prisma, UI Clerk, navigasi, dan Middleware secara presisi.

### A. Relasi Data Kueri (Menampilkan Produk Toko untuk Kasir)
*   **Target File:** `app/page.tsx` (atau *Server Component* tempat Anda mengambil data `prisma.product.findMany`).
*   **Instruksi Logika:**
    1.  Ekstrak nilai `role` dan `tenantId` dari metadata Clerk:
        `const role = auth().sessionClaims?.metadata?.role;`
        `const tenantId = auth().sessionClaims?.metadata?.tenantId;`
    2.  Buat variabel penentu ID target: 
        `const targetUserId = role === 'CASHIER' ? tenantId : userId;`
    3.  Ubah kueri Prisma Anda untuk menggunakan variabel target tersebut:
        `await prisma.product.findMany({ where: { userId: targetUserId } });`
    4.  Terapkan logika `targetUserId` ini pada SEMUA kueri di halaman Kasir (seperti saat mengambil daftar Kategori).

### B. Customisasi Clerk UserButton (Menyembunyikan Upgrade Pro)
*   **Target File:** Komponen Header/Topbar (tempat `<UserButton />` berada).
*   **Instruksi UI:**
    1.  Jika Anda sebelumnya memasukkan tautan kustom "Upgrade ke Pro", pastikan Anda menggunakan `<UserButton.MenuItems>`.
    2.  Bungkus aksi Upgrade Pro tersebut dengan *Conditional Rendering* berdasarkan `role`.
    3.  *Contoh Implementasi:*
        ```jsx
        <UserButton>
          <UserButton.MenuItems>
            {role !== 'CASHIER' && (
              <UserButton.Action label="Upgrade ke Pro" labelIcon="{<CrownIcon"/>} onClick={...} />
            )}
          </UserButton.MenuItems>
        </UserButton>
        ```

### C. Pembaruan Middleware & Navigasi (Membuka Akses Dashboard)
*   **Target File 1: `middleware.ts`**
    1.  Ubah logika proteksi untuk `CASHIER`. Sebelumnya, mereka diblokir dari `/admin(.*)`.
    2.  Ganti aturan pemblokiran tersebut agar lebih spesifik. Kasir HANYA BOLEH mengakses `/` (Kasir POS) dan `/admin` (Dashboard).
    3.  Blokir secara spesifik rute: `/admin/karyawan`, `/admin/pengeluaran`, `/admin/analitik`, `/admin/produk`, dan `/admin/pengaturan`. Jika kasir mengakses rute-rute ini, *redirect* ke `/admin`.
*   **Target File 2: Navigasi (`Sidebar.tsx` & `BottomNav.tsx`)**
    1.  Ubah logika filter *array* menu untuk `CASHIER`.
    2.  Pastikan menu yang dirender untuk kasir menyisakan dua item: **"Dashboard"** dan **"Kasir POS"**. Sisanya tetap disembunyikan.

### D. Keamanan Data Dashboard (Conditional Rendering)
*   **Target File:** `app/admin/page.tsx` (Halaman Dashboard Utama).
*   **Instruksi UI:**
    1.  Di halaman Dashboard, ambil data `role` pengguna.
    2.  Sembunyikan kartu metrik yang bersifat rahasia (seperti **Laba Bersih**, **Total Pengeluaran**, dan **HPP**) jika `role === 'CASHIER'`. Kasir hanya boleh melihat Total Pendapatan shift mereka atau Total Transaksi.
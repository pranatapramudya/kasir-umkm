# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.37
**Fokus:** Bugfix Data Analitik Dashboard (Rp0) untuk Role Karyawan

## 1. Objektif
Menyelesaikan bug di mana halaman Dashboard Utama (Ringkasan Bisnis) menampilkan Total Pendapatan Rp0 dan 0 Transaksi saat diakses oleh Karyawan (Kasir). Memastikan Karyawan dapat melihat total pendapatan toko/tenant tempat mereka bekerja agar bisa melakukan pencocokan/rekonsiliasi kas.

## 2. Analisis Masalah
Logika pengambilan data (Data Fetching) untuk widget Dashboard (seperti Total Pendapatan, Total Transaksi, dan Grafik Tren) saat ini masih memfilter data secara kaku menggunakan `userId` dari session Clerk (`auth()`). 
Karena Karyawan login menggunakan `userId` mereka sendiri, Prisma gagal menemukan transaksi yang terkait, karena semua transaksi sebenarnya disimpan di bawah ID Toko (Owner/Tenant).

## 3. Eksekusi Perbaikan (Server Component / API Route)
**Target File:** Komponen yang merender Dashboard Analitik (kemungkinan besar di `app/admin/page.tsx`, `app/admin/dashboard/page.tsx`, atau endpoint API terkait analitik).
**Instruksi Eksekusi:**

1. **Resolusi Identitas Tenant (activeTenantId):**
   - Di bagian atas fungsi *data fetching*, ambil `userId` dari Clerk.
   - Cek apakah user ini Karyawan: `const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } })`.
   - Tetapkan variabel `activeTenantId`:
     - JIKA `employee` ditemukan ➔ `activeTenantId = employee.tenantId`.
     - JIKA TIDAK ditemukan (berarti Owner) ➔ `activeTenantId = userId` (atau ID Tenant milik owner tersebut sesuai skema Prisma Anda).

2. **Perbarui Filter Query Prisma:**
   - Cari semua query yang menghitung transaksi di halaman tersebut (misal: `prisma.transaction.aggregate`, `prisma.transaction.count`, `prisma.transaction.findMany`).
   - Ubah parameter filter `where` yang sebelumnya menggunakan `userId: userId` menjadi menggunakan `activeTenantId`.
   - Pastikan juga filter *date range* (Periode Bulan Ini, dll) tetap berfungsi normal.

Silakan rombak logika data fetching di Dashboard ini sekarang juga. Pastikan Karyawan di semua 4 kategori bisnis dapat melihat data transaksi yang sinkron dengan data Owner.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.38
**Fokus:** Bugfix Data Analitik Halaman "Laporan Shift" (Rp0) untuk Karyawan

## 1. Objektif
Memperbaiki bug pada halaman Laporan Shift di mana data Total Pendapatan, Kas Tunai, QRIS, dan Riwayat Transaksi Harian masih kosong (Rp0) saat diakses oleh Karyawan. Memastikan Karyawan dapat melihat rekapitulasi shift mereka dengan akurat berdasarkan transaksi toko.

## 2. Analisis Masalah
Sama seperti bug pada Dashboard sebelumnya, komponen atau API yang bertugas menarik data untuk Laporan Shift masih menggunakan filter strict `userId` dari session Clerk, sehingga gagal mencocokkan data transaksi yang sebenarnya tersimpan di bawah ID Tenant (Owner).

## 3. Eksekusi Perbaikan (Server Component / Data Fetching)
**Target File:** Halaman Laporan Shift (kemungkinan di `app/admin/laporan-shift/page.tsx`, `app/admin/reports/page.tsx`, atau API endpoint yang mensuplai data ke halaman tersebut).
**Instruksi Eksekusi:**

1. **Injeksi Logika Resolusi Tenant:**
   - Ambil `userId` menggunakan `auth()` dari Clerk.
   - Lakukan query ke database: `const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } })`.
   - Deklarasikan variabel identitas:
     - JIKA `employee` ada ➔ `activeTenantId = employee.tenantId` (dan secara opsional simpan `cashierId = employee.id`).
     - JIKA `employee` tidak ada ➔ `activeTenantId = userId` (Owner).

2. **Perbarui Filter Prisma Query:**
   - Cari blok kode Prisma yang melakukan `findMany`, `aggregate`, atau menghitung pendapatan hari ini (Tunai vs QRIS).
   - Ubah argumen `where` yang tadinya menggunakan `userId` menjadi `tenantId: activeTenantId`.
   - *(Opsional tapi Direkomendasikan)*: JIKA user adalah employee, tambahkan filter `cashierId: employee.id` ke dalam query agar Laporan Shift benar-benar hanya menampilkan uang yang masuk dari tangan kasir tersebut pada hari itu (mencegah kasir melihat transaksi dari shift kasir lain). Jika arsitektur belum mendukung filter cashierId, cukup gunakan `activeTenantId`.

Silakan terapkan refaktor identitas ini pada halaman Laporan Shift sekarang juga agar kasir dapat melakukan rekonsiliasi uang fisik di laci dengan data sistem.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.36
**Fokus:** Bugfix Otorisasi Checkout & Transaksi untuk Role Karyawan

## 1. Objektif
Menyelesaikan bug "Beberapa produk tidak ditemukan atau akses ditolak" saat Karyawan (Kasir) mencoba memproses pembayaran (checkout) di halaman POS. Memastikan Karyawan dari Halaman Bisnis manapun (Retail, F&B, Jasa, Rental) dapat menyelesaikan transaksi, mengurangi stok, dan mencetak struk secara sah.

## 2. Analisis Masalah
Error ini berasal dari endpoint backend yang menangani pembuatan transaksi (kemungkinan besar `POST /api/transactions` atau `POST /api/checkout`). Pada endpoint tersebut, logika validasi produk (sebelum di-checkout) masih memfilter secara kaku menggunakan `userId` dari session Clerk aktif. Karena Karyawan memiliki `userId` yang berbeda dengan Owner (pembuat produk), Prisma mengembalikan array kosong, sehingga memicu error akses ditolak.

## 3. Eksekusi Perbaikan Backend (API Route)
**Target File:** Endpoint POST Transaksi (misal: `app/api/transactions/route.ts` atau file server action yang menangani *submit* pembayaran).
**Instruksi Eksekusi:**

1. **Refaktor Logika Autentikasi (Identifikasi Tenant):**
   - Saat request masuk, ambil `userId` dari Clerk.
   - Lakukan pengecekan ke tabel Employee: `const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } })`.
   - JIKA user adalah Employee, maka tetapkan `activeTenantId = employee.tenantId`.
   - JIKA user adalah Owner (tidak ada di tabel employee), pastikan ambil ID tenant miliknya: `activeTenantId = owner.tenant[0].id` (atau sesuai struktur relasi lu).

2. **Perbaiki Validasi Ketersediaan Produk:**
   - Cari baris kode tempat backend memeriksa produk yang akan dibeli (misal: `prisma.product.findMany(...)`).
   - Ganti parameter filter `userId: userId` menjadi `tenantId: activeTenantId`. Ini memastikan produk valid selama produk tersebut berada di dalam toko yang sama tempat Kasir itu bekerja.

3. **Injeksi Relasi Kasir (Cashier Record):**
   - Saat mengeksekusi `prisma.transaction.create(...)`, pastikan Anda memasukkan `tenantId: activeTenantId`.
   - JIKA transaksi dilakukan oleh Karyawan, simpan juga data kasir pada field relasi yang tersedia di tabel transaksi (misalnya `cashierId: employee.id` atau `cashierName: employee.name`) agar Laporan Shift nanti bisa membaca siapa yang melakukan transaksi.

Silakan rombak endpoint POST tersebut sekarang juga. Pastikan transaksi dari semua 4 kategori bisnis dapat diproses mulus oleh Karyawan tanpa ada halangan otorisasi.
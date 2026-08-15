# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.60
**Fokus:** Integritas Laporan Keuangan Keuangan & Implementasi Soft Delete

## 1. Analisis Masalah (Critical Data Integrity)
Terdapat pertanyaan kritis mengenai integritas data pada laporan unduhan Excel (Analitik). Jika pengguna menghapus sebuah produk dari Manajemen Produk, riwayat penjualan produk tersebut di masa lalu tidak boleh ikut terhapus atau mengubah kalkulasi total pendapatan di laporan Excel. Penghapusan secara mutlak (*Hard Delete*) akan merusak integritas pembukuan akuntansi UMKM.

## 2. Instruksi Eksekusi (Database Schema & API Logic)
**Target File:** Prisma Schema (`schema.prisma`), API Hapus Produk (`/api/products/[id]/route.ts`), API Analitik, dan API Unduh Excel.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE):**

1. **Implementasi Soft Delete (Prisma Schema & API):**
   - JANGAN gunakan `prisma.product.delete` jika produk tersebut sudah memiliki riwayat di tabel `TransactionItem`.
   - Tambahkan kolom `isArchived` (Boolean, default `false`) atau `deletedAt` (DateTime, nullable) pada model `Product`.
   - Ubah logika API Hapus Produk: Saat user mengklik hapus, cukup *update* produk tersebut dengan `isArchived: true`.

2. **Perbaikan Query Read (Dashboard & Kasir):**
   - Pada endpoint `GET /api/products` (untuk Katalog Admin dan POS Kasir), pastikan filter `where: { isArchived: false }` diaplikasikan. Sehingga produk yang dihapus tidak akan muncul lagi di layar aplikasi.

3. **Integritas Laporan Excel & Analitik:**
   - Pada API yang memproses pembuatan laporan Excel dan grafik Analitik, JANGAN memfilter produk berdasarkan `isArchived`.
   - Riwayat penjualan dari produk yang sudah di-*archive* (dihapus) HARUS tetap dihitung dalam agregasi total pendapatan dan tetap dicetak di dalam file Excel Laporan Transaksi, lengkap dengan nama produk dan harga saat transaksi itu terjadi.

Silakan rombak logika penghapusan ini menjadi *Soft Delete* agar tidak ada uang UMKM yang "menguap" secara gaib di pembukuan Excel mereka. Lapor jika migrasi logika ini sudah selesai!
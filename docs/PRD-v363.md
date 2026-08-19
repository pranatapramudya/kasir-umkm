# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.63
**Fokus:** Vercel CPU Optimization (Query Refactoring) & Error Handling

## 1. Analisis Masalah (Vercel Observability Data)
Berdasarkan metrik Vercel per tanggal 19 Agustus 2026, penggunaan `Fluid Active CPU` proyek `kasir-umkm` melonjak tajam akibat inefisiensi *query database* pada beberapa *route* API utama:
1. **`/api/booking/pending-count` (Active CPU: 4.13s):** Waktu eksekusi sangat tidak wajar untuk sekadar menghitung jumlah (count). Terindikasi mengambil seluruh objek data ke *memory* (RAM) Node.js.
2. **`/api/analytics` (Active CPU: 2.4s):** Sangat membebani CPU. Terindikasi melakukan perhitungan agregasi finansial menggunakan manipulasi *array* (*reduce/map*) di level aplikasi/Vercel.
3. **`/api/reports/shift` (Error Rate: 31.3%):** Tingginya angka *error* kemungkinan disebabkan oleh *Database Connection Timeout* atau OOM (*Out of Memory*) karena memuat terlalu banyak baris data tanpa limitasi atau agregasi yang tepat.

## 2. Instruksi Eksekusi (Database Query & Caching Refactor)
**Target File:** API routes pada `/api/booking/pending-count`, `/api/analytics`, dan `/api/reports/shift`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Optimasi Route: `/api/booking/pending-count`**
1. Buka *route handler* ini.
2. Hapus penggunaan *query* yang menarik *array* data utuh (seperti `prisma.booking.findMany()`).
3. Ganti murni dengan fungsi bawaan ORM untuk menghitung langsung di sisi *Database Engine* (contoh: `prisma.booking.count({ where: {...} })`). Kembalikan hanya nilai integer mentah ke *client*.

**B. Optimasi Route: `/api/analytics`**
1. Hapus segala bentuk perhitungan manual di dalam *Javascript/Typescript* (seperti `transactions.reduce(...)` untuk mencari total pendapatan).
2. Gunakan metode *Aggregate* atau *GroupBy* bawaan ORM (contoh: `prisma.transaction.aggregate({ _sum: { totalAmount: true } })`). 
3. Biarkan *Database* (PostgreSQL/Supabase) yang melakukan perhitungan berat, Vercel hanya bertugas mengirim hasil akhirnya.

**C. Perbaikan Route: `/api/reports/shift` (Menekan Error Rate)**
1. Terapkan `try-catch` blok yang solid. Jika terjadi *error* dari *database*, pastikan mereturn status `500` dengan pesan *error* yang rapi, BUKAN membiarkan fungsi *crash*.
2. Jika *route* ini menarik data historis transaksi untuk rekonsiliasi, pastikan ada filter tanggal (rentang *shift*) yang ketat sehingga *query* tidak menarik data bulan-bulan sebelumnya secara tidak sengaja.
3. Pertimbangkan untuk menambahkan indeks (Index) pada kolom yang sering di- *filter*, seperti `tenantId` dan `createdAt` / `shiftId` pada skema Prisma Anda.

Silakan refactor ketiga API Route tersebut! Prioritas utama adalah memindahkan beban komputasi dari Vercel CPU ke Database Engine. Lapor kembali jika seluruh fungsi ORM sudah diubah menjadi *Count* dan *Aggregate*!
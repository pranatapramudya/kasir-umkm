# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.78
**Fokus:** Ultimate Architecture Patch (Eksekusi Penambalan Skalabilitas)

## 1. Objektif Eksekusi
Berdasarkan Laporan Audit Skalabilitas (Vektor A, B, C, dan D) yang Anda hasilkan sebelumnya, arsitektur saat ini memiliki cacat struktural yang kritis untuk lingkungan *High-Concurrency*. Tugas Anda sekarang adalah **mengeksekusi seluruh rekomendasi perbaikan yang Anda buat sendiri**.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan operasi penambalan (*patching*) pada *backend* dan *frontend*. DILARANG memberikan *output* kode mentah panjang secara penuh, cukup eksekusi dan berikan rangkuman blok logika yang diubah.

### A. Penambalan Vektor A (Isolasi Multi-Tenant Absolut)
*   **Target File:** `app/api/products/[id]/route.ts` dan `app/api/tables/[id]/route.ts` (serta API mutasi sejenis).
*   **Instruksi:** 
    Hapus pola validasi memori ganda (TOCTOU). Gunakan eksekusi atomik Prisma tingkat database: `updateMany` atau `deleteMany` dengan parameter `where: { id: targetId, userId: currentUserId }`. Validasi responsnya: Jika `count === 0`, kembalikan status 404/403.

### B. Penambalan Vektor B (Pemusnahan N+1 Query)
*   **Target File:** `app/api/transactions/route.ts`
*   **Instruksi:**
    Bongkar fungsi *checkout*. DILARANG keras melakukan `findUnique` dan `update` stok di dalam sebuah *looping* array keranjang! 
    1. Lakukan ekstraksi array `productIds`.
    2. Lakukan kueri massal 1 kali di luar *loop*: `findMany({ where: { id: { in: productIds } } })`.
    3. Setelah validasi stok berhasil di memori, jalankan operasi mutasi (*decrement* stok) secara serentak/konkuren menggunakan `Promise.all` di dalam blok `prisma.$transaction`.

### C. Penambalan Vektor C (Pencegahan Kiamat RAM Vercel)
*   **Target File:** `app/api/analytics/route.ts` (atau API Laporan Sejenis)
*   **Instruksi:**
    Hapus logika penarikan data mentah `findMany` yang bervolume raksasa hanya untuk dijumlahkan secara manual menggunakan `.forEach()` atau `.reduce()` di sisi Node.js. 
    Wajib gunakan fungsi agregasi database murni: `prisma.transaction.aggregate({ _sum: { totalAmount: true }, where: { ... } })` agar Vercel hanya memproses 1 baris hasil perhitungan kalkulator PostgreSQL.

### D. Penambalan Vektor D (Idempotency UI & Debouncing)
*   **Target File:** `app/page-client.tsx` (atau Komponen Tombol Bayar di Keranjang)
*   **Instruksi:**
    Cegah spam klik dan *error* P2002. Bungkus tombol eksekusi "Bayar/Checkout" dengan *state* pelindung absolut (`isSubmitting`). Saat diklik, tombol WAJIB menjadi *disabled* (tidak bisa diklik ulang) dan memunculkan indikator *loading* hingga proses API merespons sukses atau gagal.

Silakan eksekusi operasi kritis ini sekarang agar aplikasi PJTECH KASIR resmi layak menyandang gelar *Enterprise Production-Ready*!
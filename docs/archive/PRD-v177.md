# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.77
**Fokus:** Ultimate Scalability & Multi-Tenant Isolation Audit (Production Readiness)

## 1. Objektif Audit
Bertindaklah sebagai **Principal Cloud Architect (Y-Combinator Standard)**. Sistem ini akan digunakan oleh ribuan UMKM secara bersamaan di lingkungan *Serverless* (Next.js di Vercel + Prisma + Neon PostgreSQL). 
Tugas Anda adalah melakukan audit logika mental paling brutal dan kritis terhadap seluruh arsitektur *codebase* saat ini. Jika Anda menemukan satu saja celah pada 4 vektor di bawah ini, laporkan sebagai **BLOCKER** dan berikan solusi arsitekturnya.

## 2. Vektor Audit Mutlak (High-Concurrency & Isolation)

### Vektor A: Multi-Tenant Data Bleed (Kebocoran Data Antar Klien)
*   **Ancaman:** Pengguna memanipulasi *Payload* atau ID pada URL API untuk melihat/menghapus data toko lain.
*   **Tugas Audit:** Lakukan pengecekan pada SETIAP *API Route* (GET, POST, PATCH, DELETE). Apakah ada operasi Prisma (seperti `findUnique`, `findMany`, `update`, `delete`) yang LUPA menyertakan filter `where: { tenantId: currentTenantId }`? Jika ada satu saja operasi yang hanya mengandalkan `id` baris tanpa memvalidasi kepemilikan *Tenant*, itu adalah kebocoran fatal.

### Vektor B: Prisma N+1 Query Problem (Pembunuh Database)
*   **Ancaman:** Halaman Kasir atau Laporan memuat data yang merelasikan banyak tabel dengan melakukan *looping query* alih-alih menggunakan `JOIN` / `include`.
*   **Tugas Audit:** Apakah ada pemanggilan `prisma.*` di dalam sebuah *looping* (misal: `map` atau `for` *loop*) pada API transaksi/laporan? Untuk skala ribuan pengguna, ini akan membunuh *connection pool* Neon seketika. Pastikan semuanya menggunakan fitur `include` pada Prisma.

### Vektor C: Serverless Payload Limits & Pagination
*   **Ancaman:** Fungsi Vercel Serverless memiliki batas memori dan waktu eksekusi.
*   **Tugas Audit:** Pada API pencarian produk (di Kasir) atau daftar Riwayat Transaksi, apakah kueri menarik SELURUH isi tabel ke memori tanpa batasan? Apakah `take` dan `skip` (Pagination) sudah diterapkan mutlak di level API (bukan hanya di *frontend*)?

### Vektor D: Idempotency & Rate Limiting pada Checkout
*   **Ancaman:** Kasir menekan tombol "Bayar" 10 kali dengan sangat cepat (atau jaringan nge-lag dan ter-klik ganda), menyebabkan 10 transaksi kembar tercipta dan memotong stok 10 kali lipat.
*   **Tugas Audit:** Apakah API `/api/transactions` memiliki penanganan *Idempotency* (mencegah *double-submit*)? Meskipun kita tidak menggunakan Redis, apakah ada perlindungan *debouncing* dari sisi UI dan penguncian *state loading* yang absolut di *frontend*?

## 3. Format Laporan yang Diharapkan
DILARANG memberikan kode mentah sebelum melaporkan hasilnya. Berikan laporan audit dengan format:
1. **Nama Vektor:** Lulus / Gagal.
2. **Temuan Kritis:** (Jelaskan baris atau *logic* mana yang berpotensi hancur di skala ribuan pengguna).
3. **Rekomendasi Patch:** (Konsep perbaikannya).

Jalankan inspeksi mutlak ini sekarang! Nyawa bisnis platform ini bergantung pada arsitektur Anda.
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.10 (Planning Mode)
**Fokus:** Sinkronisasi Data Finansial Laporan Shift & Dashboard Admin (Single Source of Truth)

## 1. Analisis Bug Kritis (Diskrepansi Data)
*   **Gejala:** Halaman Laporan Shift sukses menampilkan Total Pendapatan Rp 450.000, namun Halaman Dashboard Admin menampilkan Rp 0 dan Total Transaksi 0 untuk periode yang sama.
*   **Akar Masalah:** Terjadi duplikasi kueri atau perbedaan logika filter (*Date Filtering / Tenant Scoping*) antara halaman Dashboard dan Laporan Shift. Dashboard gagal mengeksekusi penjumlahan transaksi karena parameter filter waktu (misal: "Hari Ini" / *Today*) menggunakan acuan zona waktu atau format yang tidak sinkron dengan data di *database*.

## 2. Batasan Arsitektur (Constraints)
*   **Single Source of Truth:** Logika pengambilan data finansial (`Total Pendapatan`, `Total Transaksi`) di Dashboard Admin harus menggunakan standar kueri yang sama persis dengan yang sudah terbukti berhasil di Laporan Shift.
*   **Unified Date Filter:** Pastikan *Dropdown* filter waktu di Dashboard (seperti "Hari Ini", "Bulan Ini") menerjemahkan rentang tanggal (`gte` dan `lte`) dengan memperhitungkan zona waktu lokal yang akurat, sehingga transaksi hari ini tidak pernah luput dari perhitungan.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda mengubah kode pada komponen Dashboard (`app/admin/page.tsx` atau rute API Dashboard terkait), berikan rancangan Anda:
1.  **Audit Perbedaan Kueri:** Jelaskan mengapa Dashboard menghasilkan angka `Rp 0` sementara Laporan Shift berhasil menampilkan `Rp 450.000`. Di mana letak perbedaan kueri Prisma keduanya?
2.  **Strategi Penyatuan (Refactoring):** Usulkan cara untuk menyeragamkan fungsi agregasi pendapatan ini agar Dashboard dan Laporan Shift memanggil utilitas/fungsi *backend* yang sama.
3.  **Validasi Filter Waktu:** Bagaimana Anda memastikan opsi "Hari Ini" di Dashboard mencakup rentang waktu penuh dari `00:00:00` hingga `23:59:59` waktu lokal?

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengeksekusi perbaikan kode Dashboard!**
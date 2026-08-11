# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.59
**Fokus:** Autonomous End-to-End Audit & Auto-Correction (Modul Jasa)

## 1. Tujuan Simulasi & Audit
Sistem akan diuji menggunakan alur kerja operasional nyata di bisnis Jasa (Salon/Barbershop). AI Agent diinstruksikan untuk menganalisis alur dari Kasir hingga Laporan Komisi, mengidentifikasi kelemahan logika (*edge cases*), dan langsung melakukan perbaikan otomatis pada *codebase*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Jalankan simulasi mental pada arsitektur kode saat ini, temukan masalahnya, dan terapkan perbaikan. DILARANG memberikan *output* kode mentah. Berikan laporan masalah yang ditemukan dan tindakan perbaikannya.

### A. Audit 1: Integritas Data Riwayat Komisi (Snapshotting)
*   **Skenario:** Owner mengubah nominal `employeeCommission` pada master data Layanan dari Rp 15.000 menjadi Rp 20.000. Apakah laporan komisi bulan lalu ikut berubah (rusak)?
*   **Instruksi Perbaikan:** 
    1. Pastikan model `TransactionItem` di Prisma menyimpan nilai `commissionSnapshot` (Int) secara terpisah dari relasi produk, sama seperti `priceSnapshot`.
    2. Saat *Checkout*, simpan nilai komisi yang berlaku SAAT ITU KE DALAM `commissionSnapshot`.
    3. Halaman `Rekap Komisi` WAJIB mengkalkulasi total berdasarkan `commissionSnapshot` ini, bukan menarik (JOIN) dari tabel master Layanan/Produk. 

### B. Audit 2: Fleksibilitas Multi-Pekerja dalam Satu Transaksi
*   **Skenario:** 1 Pelanggan membeli 2 Layanan sekaligus dalam 1 keranjang (misal: Potong Rambut oleh Pekerja A, dan Cuci Muka oleh Pekerja B).
*   **Instruksi Perbaikan:**
    1. Validasi komponen Keranjang (`Kasir Jasa`). Pastikan state `workerName` mengikat secara individual per *Item ID* (baris keranjang), bukan satu `workerName` untuk seluruh keranjang.
    2. Jika fungsi *Checkout* masih gagal membedakan pekerja per item, perbaiki struktur *payload* JSON-nya agar `workerName` terpetakan per produk.

### C. Audit 3: Bukti Fisik (Cetak Struk Jasa)
*   **Skenario:** Struk dicetak untuk diberikan kepada pelanggan dan diarsipkan oleh kasir, namun tidak ada keterangan siapa yang mengerjakan layanan tersebut.
*   **Instruksi Perbaikan:**
    1. Periksa komponen Cetak Struk (Receipt).
    2. Jika `kategoriUsaha === 'Jasa'`, di bawah setiap nama item yang dibeli, tambahkan baris kecil (*font* lebih kecil): `(Oleh: [workerName])`.
    3. Pastikan layout struk tidak pecah akibat penambahan teks ini.

Silakan jalankan audit ini, perbaiki celah yang ada, dan laporkan statusnya (Temuan & Resolusi) secara profesional!
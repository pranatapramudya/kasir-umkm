# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.22
**Fokus:** Conditional Copywriting Laporan Shift & Detail Transaksi (Retail vs Rental)

## 1. Analisis Masalah
Terdapat ketidaksesuaian *copywriting* pada halaman "Laporan Shift" dan modal "Detail Transaksi" saat aplikasi digunakan oleh *tenant* bisnis Rental/Travel. Sistem menampilkan teks "Produk Terjual" dan menggunakan kolom "Qty" (Quantity). Pada konteks rental mobil/travel, armada disewakan (bukan dijual) dan besaran pengali harga adalah Durasi (Hari/Jam), bukan jumlah unit barang. Hal ini menciptakan kebingungan dalam pembacaan laporan keuangan.

## 2. Instruksi Eksekusi (Frontend Conditional Rendering & Copywriting)
**Target File:** Komponen Halaman Laporan Shift (`app/admin/laporan-shift/page.tsx` atau sejenisnya) dan Komponen Modal Detail Transaksi (`TransactionDetailModal.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ambil State Tipe Bisnis:**
Pastikan komponen-komponen ini memiliki akses ke state/variabel tipe bisnis (`isRental` atau `isJasa`).

**B. Modifikasi Copywriting Laporan Shift:**
1. Temukan bagian (Card) yang memiliki judul "Ringkasan Produk Terjual Hari Ini".
2. Terapkan *conditional rendering* pada judul tersebut:
   - Jika tipe bisnis **RENTAL/TRAVEL (`isRental`)**: Ubah judul menjadi **"Ringkasan Armada Disewa Hari Ini"**.
   - Jika tipe bisnis **JASA**: Ubah judul menjadi **"Ringkasan Layanan Hari Ini"**.

**C. Modifikasi Header Kolom di Modal Detail Transaksi:**
1. Buka komponen yang merender modal Detail Transaksi (tabel rincian *item*).
2. Temukan *header* tabel yang bernama **"Qty"**.
3. Terapkan *conditional rendering*:
   - Jika **RENTAL/TRAVEL (`isRental`)**: Ubah header menjadi **"Durasi (Hari)"**.
   - Jika **JASA**: Tetap gunakan **"Qty"**.
4. (Opsional namun disarankan): Ubah *header* **"Item"** menjadi **"Armada / Layanan"**.

Silakan terapkan perubahan teks dinamis ini! Lapor jika laporan shift sudah menggunakan terminologi operasional transportasi yang benar!
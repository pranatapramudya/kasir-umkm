# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.40
**Fokus:** Persetujuan Rencana Ekspor Excel & Resolusi Logika Bisnis

## 1. Tanggapan atas "User Review Required"
Rencana implementasi *Export to Excel* menggunakan library `xlsx` (SheetJS) disetujui. Berikut adalah keputusan mutlak (*executive decisions*) untuk pertanyaan terbuka yang diajukan:

### A. Resolusi PPN (Pajak Pertambahan Nilai)
*   **Keputusan:** Default ke `0`.
*   **Alasan:** Target pasar SaaS ini adalah UMKM yang sebagian besar belum wajib memungut pajak. 
*   **Instruksi:** Tetap pertahankan kolom "PPN" di dalam laporan Excel yang diekspor (diisi angka `0` bertipe *Float/Number*). Ini sebagai bentuk *future-proofing* apabila nanti kita merilis fitur "Pengaturan Pajak Toko".

### B. Resolusi Dropdown Periode
*   **Keputusan:** YA, sertakan opsi "Semua Waktu" (*All Time*).
*   **Alasan:** Sangat berguna bagi pengguna baru atau saat fase *testing* untuk menarik seluruh data tanpa terhalang filter tanggal, guna memastikan format tabel Excel sudah benar-benar rapi.

### C. Resolusi Logika Laba Bersih & HPP (Penting!)
*   **Keputusan Sementara:** Untuk MVP fitur Ekspor ini, **setujui** usulan Anda untuk mengambil seluruh produk dan melakukan pemetaan (mapping) `productId` ke `hpp` saat ini guna menghitung Margin/Laba Bersih.
*   **Technical Debt Note:** Tambahkan komentar `// TODO:` yang jelas di dalam `app/api/export/route.ts` yang menyatakan: *"Skema TransactionItem harus di-update untuk menyimpan hppAtPurchase dan priceAtPurchase agar laporan historis tidak berubah ketika harga Master Produk diubah."*

## 2. Instruksi Lanjutan Eksekusi
Silakan lanjutkan penulisan kode (*coding*) berdasarkan rencana Anda dengan menginkorporasikan tiga resolusi di atas. Pastikan hal berikut tidak terlewat:
1. File `.xlsx` yang diunduh memiliki tipe data angka (Number) pada kolom uang, BUKAN *String*, agar fungsi kalkulasi bawaan Excel milik pengguna (*Owner*) dapat langsung bekerja.
2. Tombol unduh memiliki *feedback state* (seperti efek *loading* atau rotasi ikon) selama proses *fetching* dari `/api/export` berlangsung, agar pengguna tidak mengklik tombol berkali-kali secara tidak sengaja.
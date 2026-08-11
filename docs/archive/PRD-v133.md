# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.33
**Fokus Utama:** FASE 1 - Selesaikan Tuntas Kamar "Retail" & Database Clean-Slate

## 1. Strategi Pengembangan Berkelanjutan (Phase-by-Phase)
*   **Prinsip Kerja:** Kita fokus menyelesaikan, merapikan, dan membersihkan seluruh bug pada **Kamar Retail** terlebih dahulu hingga 100% tuntas. Kamar F&B dan Jasa/Servis untuk sementara dikunci/disembunyikan dari navigasi hingga modul Retail benar-benar sempurna.
*   **Database Reset:** Seluruh data *dummy* atau *tenant* lama akan dibersihkan agar pengujian dilakukan dari kondisi bersih (*clean-slate*).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan arsitektur dan pembersihan database sesuai instruksi berikut. DILARANG memberikan *output* kode mentah.

### A. Reset Database (Clean-Slate)
*   **Instruksi Terminal/Prisma:** 
    1. Jalankan perintah *reset* database Prisma untuk menghapus seluruh tabel/data uji coba sebelumnya: `npx prisma db push --force-reset` (atau jalankan migrasi ulang yang bersih).
    2. Pastikan tabel ter-generate ulang dengan skema terbaru (termasuk field `kategoriUsaha`, `minStockThreshold`, `isService`, dll).

### B. Strict Feature Toggling (Kunci Kamar Lain, Fokus Retail)
*   **Target File:** `components/SidebarClient.tsx`
*   **Instruksi Toggling:**
    1. Evaluasi nilai `kategoriUsaha` milik *tenant* yang sedang login.
    2. **Hanya tampilkan fitur standar Retail:** Dashboard, Kasir POS, Laporan Shift, Produk (Manajemen Produk), Karyawan, Pengeluaran, Analitik, Cek Langganan, Pengaturan.
    3. **SEMBUNYIKAN TOTAL / LOCK:** Menu "Kasir Resto" dan "Manajemen Meja" **HANYA** boleh muncul jika kategori usaha adalah `F&B / Kuliner`. Sembunyikan dari akun Retail dan Jasa.
    4. **Sembunyikan menu Layanan/Servis** dari akun Retail.

### C. Audit & Polish Fitur Inti "Retail" (Fokus Utama)
Pastikan seluruh fitur di bawah ini berjalan mulus tanpa celah sedikit pun untuk kategori **Retail**:
1.  **Manajemen Produk (Retail):** 
    - Pastikan penambahan produk mendukung SKU, Harga Jual, Harga Modal (HPP), Stok, dan `minStockThreshold` (Peringatan stok menipis).
    - Jika stok produk kurang dari atau sama dengan `minStockThreshold`, berikan badge peringatan warna merah/kuning di tabel produk.
2.  **Kasir POS (Retail):**
    - Alur *checkout* produk fisik **wajib** mengurangi stok di *database* secara akurat.
    - Validasi: Jika stok habis (`stock === 0`), sistem harus menolak penjualan atau memberi peringatan keras.
    - Cetak struk / ringkasan transaksi berjalan normal.
3.  **Laporan & Analitik (Retail):**
    - Grafik tren penjualan, laba bersih (Pendapatan - HPP - Pengeluaran), dan filter rentang tanggal (Kalender) berfungsi akurat.

Silakan eksekusi *database reset* dan penguncian modul ini sekarang juga. Kita pastikan fondasi Kamar Retail benar-benar kokoh sebelum melangkah ke F&B!
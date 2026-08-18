# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.42
**Fokus:** Dynamic Copywriting & SOP Separation untuk Entitas F&B dan Retail

## 1. Analisis Masalah
Melanjutkan perbaikan pada `BukuPanduanModal.tsx`, alur kerja (SOP) untuk entitas `FNB` dan `RETAIL` tidak boleh digabung atau disamaratakan. Meskipun keduanya menggunakan modul kasir dasar, F&B memiliki fitur "Manajemen Meja" dan "Tiket Dapur", sedangkan Retail berfokus pada "Stok Barang" dan "Scan Barcode". Copywriting pada buku panduan harus merujuk pada nama menu yang spesifik dan secara otomatis mengikuti terminologi masing-masing bisnis (memanfaatkan *helper* dari PRD-v330).

## 2. Instruksi Eksekusi (Context-Aware Copywriting & SOP Segregation)
**Target File:** Komponen `BukuPanduanModal.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pisahkan Blok Logika F&B dan Retail:**
Di dalam `BukuPanduanModal.tsx`, pastikan ada dua blok *conditional rendering* yang terpisah untuk `businessType === 'FNB'` dan `businessType === 'RETAIL'`. Jangan gunakan `businessType === 'FNB' || businessType === 'RETAIL'`.

**B. Susun Redaksi SOP Khusus F&B (Resto/Kafe):**
Render *array of steps* berikut dengan UI penomoran yang sudah diperbaiki (Warna Oranye/Merah):
1. **Tambah Menu & Kategori:** Buka menu **Produk / Menu**, masukkan daftar makanan/minuman beserta harganya.
2. **Atur Meja (Opsional):** Jika melayani *Dine-in*, buka **Manajemen Meja** untuk mengatur nomor dan kapasitas meja.
3. **Buka Kasir Resto:** Masuk ke menu **Kasir POS**, pilih menu pesanan pelanggan, dan tentukan nomor meja jika diperlukan.
4. **Cetak Tiket Dapur:** Simpan pesanan dan cetak **Tiket Dapur** agar koki dapat menyiapkan pesanan.
5. **Pembayaran & Struk:** Saat pelanggan selesai, selesaikan pembayaran dan cetak Struk Thermal untuk pelanggan.

**C. Susun Redaksi SOP Khusus Retail (Toko/Minimarket):**
Render *array of steps* berikut dengan UI penomoran yang sudah diperbaiki (Warna Biru Tua/Abu-abu):
1. **Tambah Produk & Barcode:** Buka menu **Produk / Barang**, masukkan data barang, harga, dan wajib isi/scan **Barcode**.
2. **Atur Stok Inventaris:** Buka menu **Manajemen Stok** untuk mengatur jumlah stok fisik awal.
3. **Buka Kasir POS:** Masuk ke menu **Kasir POS**, gunakan alat *Scanner* Barcode atau ketik nama barang untuk memasukkan ke keranjang dengan cepat.
4. **Pembayaran & Struk:** Selesaikan transaksi dan cetak Struk Thermal sebagai bukti pembelian pelanggan.

**D. Validasi Nama Menu:**
Pastikan nama menu yang dicetak tebal (Bold) pada panduan di atas **sama persis** dengan nama menu aktual yang muncul di *Sidebar* pengguna pada masing-masing tipe bisnis tersebut.

Silakan pisahkan dan terapkan *dynamic copywriting* ini! Lapor kembali jika F&B dan Retail sudah memiliki SOP yang sangat spesifik dan akurat sesuai alur kerja mereka masing-masing!
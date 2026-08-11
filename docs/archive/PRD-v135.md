# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.35
**Fokus:** Hotfix Excel Export API (Zero-Data Handling & Dynamic Category Columns)

## 1. Analisis Bug & Kebutuhan Laporan
*   **Edge-Case Crash (Data 0):** Memanggil `/api/export` pada akun baru tanpa transaksi menyebabkan server mengembalikan *response code* error (!res.ok). API harus mampu mencetak file Excel yang valid meskipun data transaksi kosong.
*   **Dynamic Excel Columns:** Format file Excel yang diunduh harus menyesuaikan dengan `kategoriUsaha` milik *tenant* yang sedang *login*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan pada *backend route* dan komponen *export handler*. DILARANG memberikan *output* kode mentah.

### A. Fix Edge-Case Zero Data & Safe Date Parsing
*   **Target File:** `app/api/export/route.ts`
*   **Instruksi:**
    1. Bungkus seluruh logika di dalam blok `try...catch` yang rapi.
    2. Lakukan validasi parameter `from` dan `to`. Jika tidak ada, tetapkan *default* rentang bulan berjalan.
    3. Jika pencarian transaksi di Prisma mengembalikan array kosong (`transactions.length === 0`), **JANGAN LEMPAR ERROR 500/400**. 
    4. Tetap buat workbook Excel (menggunakan `exceljs` atau library yang terpasang) dengan header resmi, lalu tambahkan 1 baris catatan: `"Belum ada data transaksi pada periode ini"`.

### B. Dynamic Columns berdasarkan `kategoriUsaha`
*   **Target File:** `app/api/export/route.ts`
*   **Instruksi:**
    1. Ambil data `kategoriUsaha` dari profil *Tenant* pengguna yang sedang terautentikasi.
    2. Atur *header* kolom file Excel sesuai kategorinya:
       - **Kategori `Retail` (Default):**
         `[No, Tanggal, ID Transaksi, Nama Produk, SKU/Kode, Qty Terjual, Harga Satuan, Total HPP, Total Pendapatan, Laba Bersih, Metode Pembayaran]`
       - **Kategori `F&B / Kuliner`:**
         `[No, Tanggal, ID Transaksi, No. Meja, Nama Menu, Catatan Pesanan, Qty, Harga Satuan, Total Pendapatan, Metode Pembayaran]`
       - **Kategori `Jasa / Servis`:**
         `[No, Tanggal, ID Transaksi, Nama Layanan, Petugas/Karyawan, Qty, Total Pendapatan, Metode Pembayaran]`
    3. Pastikan penamaan file `.xlsx` yang diunduh menyertakan nama toko dan rentang tanggal (Contoh: `Laporan_PJTECH_[NamaToko]_[Tanggal].xlsx`).

Silakan eksekusi perbaikan API Ekspor ini sekarang. Pastikan tombol Unduh Excel tetap memuat file .xlsx dengan mulus walaupun data transaksi masih 0!
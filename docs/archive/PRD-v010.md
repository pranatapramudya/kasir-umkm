# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.10
**Fokus:** Enhancements Form CRUD (Image, Diskon, IDR Auto-format), UX Empty State, dan Setup Dashboard Laporan Bulanan

## 1. Analisis Kebutuhan
Sistem CRUD Produk membutuhkan penyempurnaan UI/UX agar setara dengan standar aplikasi *enterprise*. Input harga masih berupa angka mentah yang menyulitkan pembacaan nominal besar, form belum mengakomodasi foto produk dan diskon bawaan produk, serta area Dashboard Admin masih kosong dari data analitik bulanan.

## 2. Spesifikasi Teknis & Solusi

### A. Penyempurnaan UX Empty State (`app/admin/products/page.tsx`)
* Ubah teks pada tombol CTA utama di area tengah dari "Tambah Produk Sekarang" menjadi "Tambah Barang".
* Tambahkan ikon (misalnya ikon `Plus` atau `PackagePlus` dari `lucide-react`) di sebelah kiri teks tombol tersebut agar lebih komunikatif.

### B. Auto-Formatting Rupiah (IDR) pada Form Modal
* Modifikasi input untuk `hpp` dan `hargaJual`.
* Saat pengguna mengetik, angka harus secara otomatis diformat menggunakan pemisah ribuan (titik). Contoh: mengetik `15000` akan langsung tampil sebagai `15.000` di layar.
* **Logika State:** Simpan nilai mentah (*raw integer*) di *state* internal untuk dikirim ke *database* Prisma, namun tampilkan nilai yang sudah diformat ke properti `value` pada tag `<input>`.

### C. Penambahan Input Diskon & Foto Produk (Modal Form)
* **Input Diskon:** Tambahkan kolom input "Diskon (Rp)" di sebelah atau di bawah Harga Jual. Pastikan input ini juga memiliki *auto-formatting* Rupiah. (Pastikan skema Prisma `Product` memiliki kolom `discount` atau `diskon` Int default 0, jika belum ada, mohon di-update).
* **Input Upload Foto (Image):**
  - Ganti input *text* URL lama menjadi elemen *drag-and-drop* atau tombol "Pilih Foto" (input type `file` dengan `accept="image/*"`).
  - Saat file dipilih, tampilkan *preview thumbnail* kecil dari foto tersebut di dalam form.
  - Untuk versi MVP ini, konversi file gambar menjadi format teks Base64 menggunakan `FileReader` sebelum dikirim via API (atau gunakan pendekatan UI preview terlebih dahulu).

### D. Blueprint Laporan Bulanan (`app/admin/page.tsx`)
* Halaman utama admin (`/admin`) akan didedikasikan untuk Laporan Bulanan (Dashboard Analytics).
* Buat *layout* statis (UI Skeleton) terlebih dahulu yang berisi:
  1. Header: "Ringkasan Bisnis Bulan Ini".
  2. 3 Kartu Metrik (Summary Cards): Total Pendapatan, Laba Bersih, dan Total Transaksi.
  3. Area kosong berbingkai di bawahnya yang disiapkan untuk *Chart* (Grafik) tren penjualan nantinya.
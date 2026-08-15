# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.51
**Fokus:** Fitur Quick Restock (Stok Masuk Cepat) Tanpa Membuka Form Edit Utama

## 1. Analisis Masalah
Saat ini, untuk menambah stok barang yang habis, pengguna harus membuka form "Edit Produk" secara keseluruhan. Hal ini berisiko tinggi terhadap perubahan data sensitif (seperti harga atau SKU) secara tidak sengaja, dan memaksa pengguna menghitung penambahan stok secara manual di luar sistem.

## 2. Instruksi Eksekusi (Frontend & Backend Logic)
**Target File:** Halaman Manajemen Produk (Admin/Owner) & API Route `/api/products/[id]/stock` (atau modifikasi API yang ada).

**A. Perubahan UI (Halaman Manajemen Produk - Admin):**
1. Di setiap kartu produk/baris tabel produk, tambahkan satu tombol aksi cepat berukuran kecil bernama **"+ Stok"** (atau ikon kotak/plus) di sebelah tombol Edit/Delete.
2. JIKA tombol **"+ Stok"** diklik, munculkan modal (pop-up) kecil yang sangat sederhana, berjudul: *"Tambah Stok: [Nama Produk]"*.
3. Isi modal hanya menampilkan:
   - Informasi Sisa Stok Saat Ini (Read-only).
   - Satu field input *Number*: *"Jumlah Stok Masuk"* (Default: 0).
   - Tombol "Simpan Stok".

**B. Perubahan Logika Backend (Penjumlahan Otomatis):**
1. Saat user menginput angka (misal: 40) dan menyimpan, sistem/API JANGAN me-replace/menimpa stok lama dengan angka 40.
2. Sistem WAJIB melakukan kalkulasi penjumlahan: 
   `Stok Baru = Stok Saat Ini (di database) + Jumlah Stok Masuk (inputan user)`.
3. Setelah berhasil disimpan, tutup modal dan *refresh state* produk agar UI langsung menampilkan jumlah stok terbaru.

Silakan eksekusi fitur Quick Restock ini. Pastikan *flow* penambahan stok ini terisolasi dari form Edit Produk utama agar lebih aman dan cepat bagi kasir/admin gudang!
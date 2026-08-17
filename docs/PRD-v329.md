# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.29
**Fokus:** UI/UX Copywriting Revamp & Re-branding Halaman Kasir Rental

## 1. Analisis Masalah
Terminologi dan *copywriting* pada halaman transaksi penyewaan (saat ini bernama "Kasir Rental") masih menggunakan sisa-sisa istilah dari sistem retail (seperti "produk", "barcode", dan "Kasir"). Hal ini membuat aplikasi terasa kaku (rigid) dan tidak sesuai dengan konteks (*out of context*) bagi pengusaha rental mobil/travel. Diperlukan penyesuaian istilah agar lebih natural, baik di Sidebar (Desktop/Mobile) maupun di dalam antarmuka halaman tersebut.

## 2. Instruksi Eksekusi (Frontend Copywriting)
**Target File:** Komponen *Sidebar* (Desktop & Mobile Nav), Komponen Halaman `app/admin/rental-pos/page-client.tsx`, dan Komponen *Header* POS.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Revamp Sidebar & Mobile Nav:**
1. Temukan item navigasi yang saat ini berlabel **"Kasir Rental"**.
2. Ubah label tersebut menjadi **"Transaksi Sewa"** (atau "Buat Transaksi" jika ruang terbatas di Mobile).

**B. Revamp Header Halaman Transaksi:**
1. Ubah teks statis di Header atas dari **"PJTECH KASIR POS"** menjadi **"Form Transaksi Sewa"**.
2. Pada *Search Bar* (Input Pencarian), ubah *placeholder* dari *"Cari produk atau barcode..."* menjadi *"Cari nama armada / plat nomor..."*.

**C. Revamp Panel Keranjang (Kanan):**
1. Judul panel atas: Ubah dari **"Detail Sewa"** menjadi **"Form Surat Jalan & Invoice"**.
2. Tombol Tarik Data: Ubah dari **"Tarik Antrean Online"** menjadi **"Tarik Pesanan Online"** (karena istilah "Antrean" lebih cocok untuk Jasa/Klinik).
3. Jika keranjang kosong, pastikan *empty state text* berbunyi: *"Belum ada armada dipilih. Silakan pilih armada atau tarik pesanan online."*

Silakan sapu bersih istilah-istilah retail ini! Lapor jika antarmuka sudah 100% menggunakan bahasa yang biasa digunakan oleh admin *pool* travel atau rental mobil!
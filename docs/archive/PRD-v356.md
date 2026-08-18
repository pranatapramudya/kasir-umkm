# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.56
**Fokus:** Bug Fix - Dynamic Copywriting pada Table Header Detail Transaksi

## 1. Analisis Masalah
Berdasarkan pengujian pada entitas `RETAIL`, *modal* `Detail Transaksi` (yang diakses melalui Riwayat Transaksi / Laporan Shift) menampilkan *header* tabel statis dengan teks **"Armada / Layanan"**.
Teks ini sangat tidak relevan untuk bisnis non-rental (misalnya: Retail menjual barang/produk fisik, F&B menjual menu makanan). Penggunaan teks yang di- *hardcode* ini merusak pengalaman *multi-tenant* dan membocorkan terminologi Rental ke semua jenis bisnis.

## 2. Instruksi Eksekusi (Dynamic Table Header Labeling)
**Target File:** Komponen UI Modal Detail Transaksi (contoh: `TransactionDetailModal.tsx`, `DetailTransaksi.tsx`, atau komponen tabel terkait).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Implementasi Kamus Terminologi (Dynamic Header):**
1. Buka komponen yang merender tabel detail item pada modal transaksi.
2. Temukan elemen `<th>` atau `<div>` yang me- *render* teks **"Armada / Layanan"**.
3. Ubah teks statis tersebut menjadi dinamis berdasarkan parameter `businessType` dari *tenant* yang sedang aktif, dengan menggunakan *mapping* atau *switch-case* berikut:
   - Jika `RENTAL`: Tampilkan **"Armada / Layanan"**
   - Jika `JASA`: Tampilkan **"Layanan"**
   - Jika `FNB`: Tampilkan **"Menu"**
   - Jika `RETAIL`: Tampilkan **"Produk / Barang"**
   - *Fallback* (Jika tidak terdeteksi): Tampilkan **"Item"**

**B. Verifikasi Komponen Global:**
1. Pastikan logika ini diterapkan pada *modal detail* transaksi yang dipanggil dari berbagai tempat (baik dari halaman Laporan Shift, Analitik, maupun Kasir POS).
2. Pastikan komponen ini tetap membaca `businessType` dari *state management* (SWR / Zustand / Context) dengan benar.

Silakan ubah teks *header* tabel ini menjadi dinamis! Lapor kembali jika bos Retail sudah melihat teks "Produk / Barang" saat mereka mengecek struk penjualan rokok dan sembakonya!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.50
**Fokus:** Sinkronisasi UI & Logika Diskon pada Halaman POS Kasir (Semua Kategori Bisnis)

## 1. Analisis Masalah
Ditemukan *bug* visual dan logika pada halaman POS Kasir. Saat *Owner* menambahkan diskon pada suatu produk (terlihat normal di dashboard Admin), halaman POS Kasir gagal merender informasi diskon tersebut. Kartu produk di POS Kasir hanya menampilkan harga normal (harga jual asli), sehingga kasir berpotensi salah menagih pelanggan.

## 2. Instruksi Eksekusi (Frontend & Cart Logic)
**Target File:** Komponen Kartu Produk di POS (misal: `app/page-client.tsx` atau `components/ProductCardPOS.tsx`) dan Logika Keranjang (`Cart State`).

1. **Perbaikan Visual Kartu Produk (POS):**
   - Lakukan pengecekan: JIKA `product.discount > 0`.
   - Jika ADA diskon:
     - Tampilkan harga asli (`product.price`) dengan gaya dicoret (`line-through`) dan warna abu-abu/pudar yang lebih kecil ukurannya.
     - Tampilkan harga akhir (`product.price - product.discount`) dengan ukuran font utama (bold) dan warna mencolok (misal: merah atau biru utama).
     - (Opsional) Tambahkan *badge* kecil bertuliskan "Promo" atau "Diskon" di sudut gambar produk agar kasir/pelanggan mudah melihatnya.
   - Jika TIDAK ADA diskon:
     - Tampilkan harga normal seperti biasa.

2. **Perbaikan Logika Keranjang (Add to Cart):**
   - Saat kasir menekan tombol `+` (Tambah ke Keranjang), pastikan harga yang dimasukkan ke dalam *state* keranjang adalah **Harga Akhir (setelah diskon)**, BUKAN harga asli.
   - Periksa juga fungsi kalkulasi total di keranjang agar tidak ada selisih perhitungan akibat diskon ini.

3. **Global Scope:**
   - Pastikan pembaruan komponen ini berlaku secara global (ter- *render* dengan baik di tampilan POS untuk bisnis F&B, Retail, Jasa, maupun Rental).

Silakan perbaiki komponen rendering harga di layar POS Kasir ini sekarang. Lapor jika UI sudah selaras dengan tampilan Admin!
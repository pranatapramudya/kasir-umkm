# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.62
**Fokus:** Edukasi UI Link Booking & Redesain Layout Checkout Rental

## 1. Analisis Masalah
1. **Kurangnya Konteks UI pada Link Booking:** Di halaman "Informasi Toko" (`image_20cfe5.png`), pengguna Jasa/Rental tidak mendapat penjelasan memadai mengenai perbedaan fungsi link booking publik.
2. **Layout Keranjang Rental yang Sempit:** Di halaman POS Kasir Rental (`image_20c4fc.png`), *sidebar* keranjang sisi kanan terlalu sempit untuk memuat form "Data Armada & Sewa" yang panjang, membuat *User Experience* menjadi berantakan.

## 2. Instruksi Eksekusi (Frontend Redesign)
**Target File:** Komponen Halaman `Informasi Toko` dan Halaman `POS Kasir (Rental)`.

**A. Edukasi UI (Halaman Informasi Toko):**
- Di bawah kotak "Link Booking Publik Toko", tambahkan *Alert* informasi bergaya UI yang elegan (misal: kotak dengan *background* biru muda/hijau dan *icon* info).
- **Teks Dinamis (Render sesuai tipe bisnis):**
  - **Jika Tipe Bisnis = JASA:** "💡 **Tips:** Bagikan link ini di bio Instagram/WhatsApp Anda. Pelanggan dapat memilih layanan dan memilih slot waktu (jam) yang tersedia tanpa harus menelepon Anda."
  - **Jika Tipe Bisnis = RENTAL:** "💡 **Tips:** Bagikan link ini ke penyewa. Mereka dapat melihat armada/barang yang tersedia dan melakukan *booking* harian berdasarkan tanggal, sehingga meminimalisir bentrok jadwal."

**B. Redesain Layout POS Kasir (Khusus Bisnis RENTAL):**
- Jangan paksakan form "Data Armada & Sewa" (Nama Supir, Pelat, Jaminan, Tgl Mulai/Selesai) berada di dalam *sidebar* keranjang kanan yang sempit.
- **Solusi UX:**
  1. Pindahkan seluruh form "Data Armada & Sewa" ke area tengah layar (*main content area*), mungkin di bawah daftar produk/armada, atau buat *modal popup* yang lebar saat kasir mengklik tombol "Lengkapi Data Sewa".
  2. *Sidebar* keranjang di sisi kanan HANYA BOLEH diisi oleh: 
     - Daftar barang yang disewa (beserta harga total).
     - Nama Pelanggan.
     - Metode Pembayaran & Uang Diterima.
     - Rincian Total & Tombol "Bayar".
- Pastikan perubahan *layout* ini berlaku khusus saat bisnis yang aktif adalah Rental.

Silakan perbaiki UI ini agar edukasi link *booking* jelas dan kasir rentalan tidak kesulitan mengisi form yang terjepit!
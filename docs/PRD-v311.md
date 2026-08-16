# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.11
**Fokus:** Bug Fix - Conditional Rendering Instruksi Pembayaran (Halaman Sukses Slug)

## 1. Analisis Masalah
Pada PRD sebelumnya, pembedaan teks peringatan DP antara bisnis Jasa dan Rental sudah diterapkan di form awal. Namun, pada **Halaman Sukses / Tiket Reservasi** (setelah form di-submit), blok "Instruksi Pembayaran" (yang berisi Total Tagihan DP dan Nomor Rekening) masih dirender secara statis untuk semua tipe bisnis. Hal ini menyebabkan pelanggan bisnis Jasa kebingungan karena mereka seharusnya membayar penuh di lokasi (Kasir), bukan transfer DP.

## 2. Instruksi Eksekusi (Frontend Conditional Rendering di Halaman Sukses)
**Target File:** Komponen Halaman Sukses/Tiket di rute publik (kemungkinan `app/book/[slug]/success/page.tsx` atau komponen yang merender *UI Tiket*).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Sembunyikan Blok Instruksi Pembayaran untuk Jasa:**
1. Ambil data atau *state* tipe bisnis dari toko yang bersangkutan (cek apakah `isJasa` / kategorinya "Jasa").
2. Cari elemen `<div>` atau kartu (Card) yang membungkus bagian **"Instruksi Pembayaran"** (yang berisi *Total Tagihan (DP)* dan *Transfer ke Rekening*).
3. Bungkus elemen tersebut dengan *conditional rendering*. Jika tipe bisnis adalah **JASA**, maka elemen tersebut **TIDAK BOLEH DIRENDER** (hilangkan sepenuhnya dari UI). Jika **RENTAL/TRAVEL**, tetap tampilkan seperti biasa.

**B. Sesuaikan Teks Tombol WhatsApp:**
1. Di bawah blok pembayaran, terdapat tombol hijau "Konfirmasi Pembayaran via WhatsApp".
2. Buat *conditional text* pada tombol tersebut:
   - Jika bisnis **RENTAL/TRAVEL**: Teks tetap *"Konfirmasi Pembayaran via WhatsApp"*.
   - Jika bisnis **JASA**: Ubah teksnya menjadi *"Hubungi Admin via WhatsApp"* (karena tidak ada pembayaran DP yang perlu dikonfirmasi saat itu).

Silakan perbaiki anomali UI di halaman sukses ini! Pastikan alur *booking* bisnis Jasa benar-benar bebas dari tagihan DP dari awal form hingga halaman tiket! Lapor jika sudah dieksekusi!
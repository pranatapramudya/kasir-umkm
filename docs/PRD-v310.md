# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.10
**Fokus:** Conditional Copywriting - Informasi Pembayaran (DP vs Bayar di Tempat)

## 1. Analisis Masalah
Kotak peringatan kuning (*alert box*) pada form booking publik saat ini selalu menampilkan teks "Pesanan ini memerlukan Down Payment (DP) minimal 50%...". Teks ini sangat cocok untuk bisnis Rental/Travel, namun menciptakan friksi tinggi dan tidak relevan untuk bisnis Jasa (seperti Barbershop/Klinik) yang umumnya menggunakan sistem "Booking dulu, Bayar di Kasir setelah selesai".

## 2. Instruksi Eksekusi (Frontend Conditional UI)
**Target File:** Komponen Form Booking di halaman Katalog Publik (kemungkinan `app/book/[slug]/BookingForm.tsx` atau komponen *alert* di dalamnya).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Buat Logika Conditional Berdasarkan Tipe Bisnis:**
1. Ambil state/variabel tipe bisnis dari toko yang sedang diakses (apakah `isJasa` atau `isRental`).
2. Terapkan *ternary operator* pada kotak "Informasi Pembayaran & Konfirmasi" di bagian bawah form.

**B. Variasi Teks Copywriting:**
1. **Jika Tipe Bisnis = RENTAL / TRAVEL:**
   - Judul: Tetap **"Informasi Pembayaran & Konfirmasi:"**
   - Teks: Tetap gunakan peringatan kewajiban **DP 50%** dan konfirmasi via WhatsApp.
2. **Jika Tipe Bisnis = JASA (Barbershop, Klinik, dll):**
   - Judul: Ubah menjadi **"Informasi Kedatangan:"**
   - Teks: Ubah menjadi: *"Silakan datang ke lokasi sesuai dengan jadwal yang telah Anda pilih. Pembayaran dapat dilakukan langsung di Kasir setelah pelayanan selesai."*

Silakan terapkan perubahan teks dinamis ini agar sesuai dengan kebiasaan pelanggan di masing-masing sektor bisnis! Lapor jika teks sudah berhasil dibedakan!
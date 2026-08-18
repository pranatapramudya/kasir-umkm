# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.06
**Fokus:** Bug Fix - Pemisahan UI Form Rute di Halaman Booking Publik

## 1. Analisis Masalah
Pada eksekusi PRD sebelumnya (Pemisahan Rute), pembaruan pada level Frontend/UI terlewatkan. Form pemesanan publik (Katalog Slug) masih merender satu input gabungan dengan label "LOKASI PENJEMPUTAN / TUJUAN (opsional)". UI ini harus segera dipecah menjadi dua input terpisah sesuai dengan skema database yang baru (`pickupLocation` dan `dropoffLocation`).

## 2. Instruksi Eksekusi (Frontend React/JSX)
**Target File:** Komponen form booking publik (kemungkinan berada di `app/book/[slug]/BookingForm.tsx` atau komponen form di dalam direktori tersebut).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pisahkan JSX Input Lokasi:**
1. Temukan elemen `<div>` atau struktur komponen yang merender label "LOKASI PENJEMPUTAN / TUJUAN".
2. Hapus blok tersebut dan ganti dengan DUA blok input terpisah.
3. **Blok Input 1: Lokasi Penjemputan**
   - Label: **"LOKASI PENJEMPUTAN / TITIK AWAL"**
   - Input: Teks field yang di-bind ke *state* `pickupLocation`.
   - UI Tambahan: **Pertahankan tombol "📍 GPS"** di sebelah input ini agar pelanggan bisa mengirimkan koordinat jemputan.
4. **Blok Input 2: Lokasi Tujuan**
   - Label: **"LOKASI TUJUAN / TITIK AKHIR"**
   - Input: Teks field yang di-bind ke *state* `dropoffLocation`.
   - UI Tambahan: **TIDAK PERLU** tombol GPS di sini (hanya input teks biasa).

**B. Verifikasi Payload Submit:**
1. Pastikan fungsi `onSubmit` atau `handleSubmit` pada form tersebut mengirimkan objek payload yang memuat KEDUA variabel tersebut (`pickupLocation` dan `dropoffLocation`) ke API `/api/booking`.
2. Pastikan field lama `destination` sudah dihapus sepenuhnya dari *state* komponen dan *payload* API.

Silakan perbaiki form *frontend* ini sekarang juga agar antarmuka pengguna sesuai dengan skema database yang sudah dimigrasi! Lapor jika UI sudah terpecah menjadi dua input!
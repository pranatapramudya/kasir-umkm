# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.13
**Fokus:** Bug Fix - UI Bleeding Status & Tab Label pada Menu Jadwal Booking

## 1. Analisis Masalah
Terdapat *UI Bleeding* pada menu "Jadwal Booking". Saat ini, sistem merender label status "Siap Berangkat" untuk pesanan bisnis Jasa (seperti Cukur Rambut) yang sudah berstatus `COMPLETED` (Di-approve). Selain itu, penamaan Tab Filter juga membingungkan karena menggunakan label "Selesai" untuk pesanan yang sebenarnya baru masuk antrean. Sistem harus membedakan label UI antara tipe bisnis Jasa dan Rental secara menyeluruh di halaman ini.

## 2. Instruksi Eksekusi (Frontend Conditional Status & Tab Labels)
**Target File:** Komponen Halaman Jadwal Booking (kemungkinan `app/admin/jadwal-booking/page.tsx` atau `BookingListClient.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ambil State Tipe Bisnis:**
Pastikan komponen Jadwal Booking memiliki akses ke data `isJasa` atau `isRental` dari toko yang sedang aktif.

**B. Perbaikan Fungsi Label Status (Badge):**
Cari fungsi atau komponen yang merender *badge* status di dalam kartu pesanan (seperti tulisan "Siap Berangkat" berwarna biru), lalu terapkan logika kondisional:
1. **Untuk Bisnis JASA (`isJasa`):**
   - Status `PENDING` -> Label: **"Menunggu"** (Warna: Kuning/Orange)
   - Status `COMPLETED` -> Label: **"Antrean Aktif"** (Warna: Biru)
   - Status `FINISHED` -> Label: **"Selesai"** (Warna: Hijau)
2. **Untuk Bisnis RENTAL/TRAVEL (`isRental`):**
   - Status `PENDING` -> Label: **"Persiapan"**
   - Status `COMPLETED` -> Label: **"Siap Berangkat"**
   - Status `IN_PROGRESS` -> Label: **"Sedang Jalan"**
   - Status `FINISHED` -> Label: **"Selesai / Tiba di Pool"**

**C. Perbaikan Label Tab Filter:**
Di atas daftar pesanan, terdapat Tab Filter (Semua, Menunggu, Selesai, Dibatalkan). Ubah label tab tersebut secara dinamis berdasarkan tipe bisnis.
- **Tab untuk JASA:** "Semua", "Menunggu", **"Antrean"** (filter status `COMPLETED`), "Selesai" (filter status `FINISHED`), "Dibatalkan".
- **Tab untuk RENTAL:** "Semua", "Persiapan", **"Siap Berangkat"**, "Sedang Jalan", "Selesai", "Dibatalkan".

Silakan sapu bersih sisa-sisa label "Siap Berangkat" di halaman Jasa ini! Pastikan semua tab dan *badge* sudah sesuai dengan konteks operasional Barbershop/Klinik. Lapor jika sudah diperbaiki!
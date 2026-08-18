# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.25
**Fokus:** Bug Fix - Format Waktu 24 Jam (Indonesian Standard) & Kalkulasi Durasi Sewa Dinamis

## 1. Analisis Masalah
1. **Format Waktu AM/PM:** Input "Jam Penjemputan" saat ini menggunakan elemen *native* `<input type="time">` yang bergantung pada *locale* perangkat klien (menampilkan AM/PM jika OS berbahasa Inggris). Hal ini berisiko menyebabkan miskomunikasi operasional di Indonesia yang menggunakan standar 24 jam.
2. **Durasi Sewa Statis:** Teks "Durasi sewa: 1 hari" tidak berubah (statis) meskipun pengguna telah memilih rentang tanggal `Mulai Sewa` dan `Selesai Sewa` yang panjang. Teks ini harus bersifat reaktif (*dynamic*) sesuai input pengguna.

## 2. Instruksi Eksekusi (Frontend React/Next.js State & UI)
**Target File:** Komponen Form Booking Publik (`BookingForm.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ganti Input Waktu ke Format 24 Jam (Custom Dropdown/Select):**
1. Hapus elemen `<input type="time">` pada field "Jam Penjemputan / Pengiriman".
2. Ganti dengan elemen `<select>` (Dropdown) kustom.
3. *Generate options* untuk dropdown tersebut dengan interval 30 menit atau 1 jam dalam format 24 jam murni (Contoh: "06:00", "06:30", "07:00", ..., "23:30"). 
4. Simpan *value* yang dipilih ke dalam state `pickupTime` untuk digabungkan dengan `startDate` pada saat *submit* (seperti pada PRD-v324).
5. Dengan cara ini, UI dijamin 100% menggunakan format standar Indonesia tanpa terpengaruh sistem HP pelanggan.

**B. Kalkulasi Durasi Sewa Secara Dinamis (Reactivity):**
1. Buat fungsi kalkulasi durasi sewa di dalam komponen (gunakan *library* seperti `date-fns` dengan fungsi `differenceInDays`, atau gunakan hitungan matematika Date Vanilla JS).
2. Logika perhitungannya:
   - Hitung selisih hari antara state `endDate` dan `startDate`.
   - Karena sewa di hari yang sama dihitung 1 hari, tambahkan `+ 1` pada hasil selisihnya (atau sesuaikan dengan logika penagihan bisnis rental Anda).
3. Cari elemen teks yang merender tulisan statis "Durasi sewa: 1 hari".
4. Terapkan *data binding* pada teks tersebut menjadi dinamis: `"Durasi sewa: " + calculatedDuration + " hari"`.

Silakan perbaiki kedua anomali UI ini! Lapor jika dropdown jam sudah bersih dari "AM/PM" dan durasi sewa otomatis berubah saat tanggal kalender diubah!
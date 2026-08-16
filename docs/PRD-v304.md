# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.04
**Fokus:** Anti Double-Booking System (Slot Waktu Jasa & Rentang Hari Rental)

## 1. Analisis Masalah
Saat ini, pelanggan publik yang mengakses *link slug* (Katalog Online) masih bisa melakukan pemesanan pada jadwal yang sudah dibooking oleh orang lain. Hal ini menyebabkan *double-booking* (tabrakan jadwal). Sistem membutuhkan validasi ketat (Backend) dan indikator visual (Frontend) yang memblokir jadwal/unit jika sudah ada transaksi masuk (status PENDING, COMPLETED, atau FINISHED).

## 2. Instruksi Eksekusi (API Validation, Database Query, & UI Disable)
**Target File:** Endpoint API pembuatan booking (`app/api/booking/route.ts`), halaman *checkout slug* (`app/book/[slug]/page.tsx` atau form komponen).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Logika Pemblokiran Bisnis Jasa (Berbasis Waktu/Jam):**
1. **API Check:** Saat merender halaman pemesanan Jasa, *fetch* semua data *Booking* untuk Jasa/Layanan tersebut pada tanggal yang dipilih pengguna.
2. **UI Frontend:** Jika Anda menggunakan *dropdown* waktu atau tombol slot jam (misal: 10:00, 11:00, 12:00), *disable* (matikan interaksi dan ubah warna menjadi abu-abu) pada slot waktu yang sudah ada di database.
3. **Backend Validation:** Saat di-submit, pastikan backend mengecek ulang: `Jika Jasa X pada Tanggal Y dan Jam Z sudah terisi (status PENDING/COMPLETED) -> Return Error "Jadwal penuh, silakan pilih jam lain"`.

**B. Logika Pemblokiran Bisnis Rental (Berbasis Rentang Tanggal):**
1. **API Check:** Saat pelanggan memilih armada (misal Mobil Avanza), *fetch* data *Booking* untuk armada tersebut yang masih aktif.
2. **UI Frontend:** Pada DatePicker (Pemilih Tanggal `Tgl Mulai` dan `Tgl Selesai`), matikan (*disable*) tanggal-tanggal yang beririsan (*overlapping*) dengan pesanan orang lain agar pelanggan tidak bisa mengkliknya.
3. **Backend Validation:** Gunakan rumus irisan rentang waktu di database saat form di-submit:
   - Rumus Overlap: `(BookingBaru.TglMulai <= BookingEksisting.TglSelesai) AND (BookingBaru.TglSelesai >= BookingEksisting.TglMulai)`
   - `Jika query ini menghasilkan data -> Return Error "Armada sudah disewa pada tanggal tersebut"`.

**C. Prinsip "First Come, First Serve" (Race Condition Handling):**
- Lakukan validasi ini di tingkat Backend (saat `prisma.booking.create`) sebagai lapis keamanan terakhir. Walaupun dua orang membuka halaman secara bersamaan, orang yang mengklik tombol "Pesan" sekian milidetik lebih lambat harus ditolak oleh sistem dan diminta memilih waktu/armada lain.

Silakan implementasikan sistem *Anti Double-Booking* yang presisi ini! Pisahkan logika Jasa (per jam) dan Rental (per hari). Lapor jika bentrokan jadwal sudah berhasil dicegah sepenuhnya!
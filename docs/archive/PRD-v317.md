# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.17
**Fokus:** API Integration & State Mapping - Tarik Antrean Kasir Rental

## 1. Analisis Masalah
Fitur "Tarik Antrean Online" pada halaman **Kasir Rental** belum terhubung sempurna dengan database. Meskipun UI Modal sudah tersedia, logika penarikan data (API) dan *mapping* data ke form "Surat Jalan" belum disesuaikan dengan skema database Rental yang baru (memiliki `pickupLocation` dan `dropoffLocation`). Kasir Rental harus bisa menarik pesanan online dan langsung mengisi otomatis data Surat Jalan untuk dicetak.

## 2. Instruksi Eksekusi (API Endpoint & Frontend State Mapping)
**Target File:** API Endpoint `app/api/booking/today/route.ts` (atau endpoint khusus rental) dan Komponen POS Rental (`app/admin/rental-pos/page-client.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. API Filter Khusus Kasir Rental:**
1. Pastikan logika API yang melayani Tarik Antrean Kasir Rental memfilter *Booking* dengan kriteria:
   - Tipe Bisnis = **Rental / Travel**.
   - Status = **`COMPLETED`** (Siap Berangkat) ATAU **`IN_PROGRESS`** (Sedang Jalan).
   - Filter Tanggal = Berdasarkan tanggal yang dipilih di Modal (menggunakan *Date Picker* seperti perbaikan pada Jasa).

**B. Data Mapping ke Form Surat Jalan (Frontend):**
1. Saat admin Kasir Rental menekan tombol **"Proses"** di dalam Modal Tarik Antrean, tangkap objek `booking` tersebut.
2. Petakan (*map*) nilai dari *database* ke *state* keranjang / form Surat Jalan Kasir Rental:
   - `booking.customerName` -> State **Nama Pelanggan**.
   - `booking.pickupLocation` -> State **Titik Jemput**.
   - `booking.dropoffLocation` -> State **Titik Tujuan**.
   - `booking.startDate` & `booking.endDate` -> State **Mulai Sewa & Selesai Sewa** (Pastikan format tanggal/waktu di-*parse* dengan benar agar tidak terjadi bug *empty date*).
   - `booking.id` -> Simpan sebagai `activeBookingId` untuk keperluan *update* saat *checkout*.

**C. Logika Pembayaran (Auto-Finish):**
1. Saat admin menekan "Bayar Sekarang" (Lunas & Selesai) di Kasir Rental, kirimkan `activeBookingId` ke API transaksi.
2. Gunakan `prisma.$transaction` untuk membuat rekam `Transaction` pendapatan, sekaligus meng-*update* status *Booking* tersebut menjadi **`FINISHED`** (Selesai).

Silakan integrasikan aliran data ini secara penuh! Lapor jika pesanan Rental/Travel dari web publik sudah bisa ditarik dan mem-populate form Surat Jalan secara otomatis!
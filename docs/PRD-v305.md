# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.05
**Fokus:** Pemisahan Titik Rute, Dispatch Lifecycle (Start/Stop Timer), & Integrasi Surat Jalan Rental

## 1. Analisis Masalah
1. **Form Rute Terlalu Sederhana:** Input "Lokasi Penjemputan / Tujuan" yang digabung menyulitkan navigasi *driver* dan tidak rapi untuk dicetak di Surat Jalan. Harus dipisah menjadi Titik Awal dan Titik Akhir.
2. **Lifecycle Keberangkatan Tidak Realistis:** Pesanan yang baru di-acc langsung berstatus "Sedang Jalan". Padahal, di lapangan terdapat jeda waktu antara persetujuan admin dan momen keberangkatan supir. Dibutuhkan tombol "Mulai (Start)" manual untuk memicu *timer* aktual penyewaan.
3. **Surat Jalan Manual:** Kasir Rental belum terhubung dengan Pesanan Online, sehingga admin harus mengetik ulang data untuk membuat Surat Jalan.

## 2. Instruksi Eksekusi (Database Schema, UI Form, & Status Logic)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pembaruan Form Booking (Pemisahan Rute):**
1. **Schema Prisma:** Jika sebelumnya menggunakan satu *field* (misal: `location`), ubah atau tambahkan menjadi dua *field*: `pickupLocation` (String) dan `dropoffLocation` (String).
2. **UI Halaman Slug:** Pisahkan input menjadi dua kolom:
   - **Lokasi Penjemputan (Titik Awal):** Pertahankan tombol "📍 GPS" di samping input ini.
   - **Lokasi Tujuan (Titik Akhir):** Input teks biasa untuk alamat tujuan.

**B. Dispatch Lifecycle (Siklus Keberangkatan 3 Tahap):**
1. **Schema Prisma:** Tambahkan status `IN_PROGRESS` pada enum `BookingStatus`. Tambahkan juga *field* `actualStartedAt (DateTime?)` untuk mencatat waktu klik "Start".
2. **Logika Tombol (Inbox Pesanan Online):**
   - **Tahap 1 (Approve):** Saat admin menerima pesanan, ubah status menjadi `COMPLETED` namun ganti label UI-nya menjadi **"Siap Berangkat"** (bukan "Sedang Jalan").
   - **Tahap 2 (Start / Keberangkatan):** Untuk pesanan berstatus "Siap Berangkat", tampilkan tombol aksi baru: **"🚀 Mulai Perjalanan (Start)"**. Saat diklik, ubah status menjadi `IN_PROGRESS` (Label UI: "Sedang Jalan") dan catat `actualStartedAt = now()`. Waktu inilah yang menjadi patokan hitungan durasi/overtime di lapangan.
   - **Tahap 3 (Finish):** Tombol **"✅ Tiba di Pool / Finish"** hanya boleh muncul jika pesanan berstatus `IN_PROGRESS` (Sedang Jalan).

**C. Integrasi "Tarik Antrean" & Pencetakan Surat Jalan:**
1. Di halaman **Kasir Rental** (`/admin/rental-pos`), tambahkan tombol **"📋 Tarik Pesanan Online"**.
2. Buat API endpoint untuk mem-fetch pesanan yang berstatus `COMPLETED` (Siap Berangkat) atau `IN_PROGRESS` (Sedang Jalan) pada hari ini.
3. Tampilkan data tersebut di Modal. Saat Kasir mengklik **"Proses"**, pindahkan seluruh data (Nama, Armada, Titik Jemput, Tujuan) ke panel Detail Sewa (Keranjang).
4. Data yang ditarik ini kemudian siap dibayar dan dicetak (Print) ke dalam format **Surat Jalan / Invoice** fisik untuk diserahkan kepada *driver*.

Silakan mutasikan skema database Anda, pisahkan form rute, dan bangun sistem *Start-Finish* yang akurat ini! Lapor jika semuanya sudah terintegrasi dari toko *online* ke Surat Jalan!
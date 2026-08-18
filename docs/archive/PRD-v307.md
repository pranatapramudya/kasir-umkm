# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.07
**Fokus:** UI Copywriting "Surat Jalan", Re-mapping Status Lifecycle, & Fitur Tarik Antrean Rental

## 1. Analisis Masalah
1. **Copywriting Kurang Kontekstual:** Tombol peringatan "Lengkapi Data Sewa" pada Kasir Rental kurang relevan dengan operasional transportasi yang lebih akrab dengan istilah "Surat Jalan".
2. **Lifecycle Status Kebalik/Membingungkan:** Alur penamaan status sebelumnya (COMPLETED lalu IN_PROGRESS) membuat alur lapangan kebingungan. Harus disesuaikan dengan bahasa operasional yang natural: Persiapan -> Sedang Dalam Perjalanan -> Selesai.
3. **Workflow Kasir Rental Terputus:** Belum ada tombol "Tarik Antrean" di Kasir Rental untuk memanggil data pemesanan *online* (Booking) agar terintegrasi langsung dengan pembuatan Surat Jalan.

## 2. Instruksi Eksekusi (Frontend UI, Status Logic, & API Integration)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ubah Copywriting "Lengkapi Surat Jalan":**
1. Buka komponen panel "Detail Sewa" di Kasir Rental (`app/page-client.tsx` atau sejenisnya).
2. Cari elemen tombol/peringatan yang bertuliskan "Lengkapi Data Sewa *".
3. Ubah teks tersebut menjadi: **"Lengkapi Surat Jalan *"**.

**B. Re-mapping Status Lifecycle & Label UI (PENTING!):**
Rombak alur pergantian status di *Inbox Pesanan* dan perbaiki label UI-nya agar sesuai dengan urutan ini:
1. **Tahap 1 (Baru Masuk / PENDING):** Label UI tampilkan sebagai **"Persiapan"**.
2. **Tahap 2 (Supir OTW):** Saat admin menekan tombol "Mulai Perjalanan/Start", ubah status database menjadi `IN_PROGRESS`. Label UI tampilkan sebagai **"Sedang Dalam Perjalanan"**.
3. **Tahap 3 (Tiba di Pool):** Saat admin menekan tombol "Tiba di Pool/Finish" (setelah *IN_PROGRESS*), ubah status database menjadi `COMPLETED` (atau `FINISHED` sesuai skema akhir Anda). Label UI tampilkan sebagai **"Selesai"**.

**C. Fitur Tarik Antrean (Kasir Rental):**
1. Pada panel Keranjang/Detail Sewa di halaman **Kasir Rental**, tambahkan tombol **"📋 Tarik Antrean Online"** (mirip dengan yang ada di Kasir Jasa).
2. Saat diklik, panggil API untuk mem-*fetch* data pemesanan *online* (Booking) yang berstatus `PENDING` (Persiapan) atau `IN_PROGRESS` pada hari ini.
3. Tampilkan di Modal. Jika admin menekan tombol **"Proses"** pada salah satu antrean:
   - Tarik otomatis data: Nama Pelanggan, Jasa/Armada yang dipilih, Titik Jemput, dan Tujuan ke dalam state keranjang (Cart) Kasir.
   - Admin hanya tinggal mengklik "Lengkapi Surat Jalan" untuk memasukkan data internal (seperti Nama Supir / Pelat Nomor) tanpa perlu mengetik ulang data pelanggan.
   - Setelah pembayaran diproses (Bayar Sekarang / Lunas & Selesai), pastikan status pesanan `Booking` tersebut ter-update dengan benar di database.

Silakan rapikan alur operasional dan integrasi Kasir Rental ini! Lapor jika tombol "Tarik Antrean" sudah berhasil memindahkan data ke form Surat Jalan!
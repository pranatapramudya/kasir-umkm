# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.12
**Fokus:** Bug Fix - Conditional Copywriting & Lifecycle Actions di Inbox Pesanan Online

## 1. Analisis Masalah
Berdasarkan temuan di lapangan, antarmuka `Inbox Pesanan Online` saat ini menggunakan *copywriting* dan tombol aksi (Action Buttons) yang dikunci mati (hardcoded) untuk alur bisnis Rental/Travel. Ketika tenant bisnis Jasa (contoh: Barbershop) menerima pesanan, sistem menampilkan teks "...dimasukkan ke Kalender Sewa" dan menampilkan tombol aksi "Mulai Perjalanan / Start" untuk pesanan *Cukur Rambut*. Hal ini sangat fatal dan membingungkan secara operasional.

## 2. Instruksi Eksekusi (Frontend Conditional Logic & State UI)
**Target File:** Komponen Dashboard/Inbox Pesanan Online (kemungkinan `app/admin/orders/InboxClient.tsx` atau `app/admin/booking/BookingDashboardClient.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ambil State Tipe Bisnis:**
Pastikan komponen ini mengetahui tipe bisnis dari *tenant* yang sedang aktif (apakah `isJasa` atau `isRental`).

**B. Conditional Teks Header/Deskripsi:**
Cari teks deskripsi di bagian atas (*header card*):
- Jika `isRental`: "...dimasukkan ke **Kalender Sewa**."
- Jika `isJasa`: "...dimasukkan ke **Jadwal Booking**."

**C. Pemisahan Logika Status & Tombol Aksi (Krusial!):**
Rombak logika *rendering* tombol aksi di tabel berdasarkan tipe bisnis:

**1. Logika untuk Bisnis JASA (`isJasa`):**
- Status `PENDING`: Label UI tampilkan sebagai **"Menunggu"**. Tombol Aksi: **"Terima Pesanan"** (Ubah status ke `COMPLETED`).
- Status `COMPLETED`: Label UI tampilkan sebagai **"Antrean Aktif"**. Tombol Aksi: **TIDAK ADA TOMBOL / KOSONGKAN**. (Pesanan Jasa yang sudah `COMPLETED` di Inbox HANYA bisa diselesaikan dengan cara di-"Tarik Antrean" dari halaman Kasir Jasa untuk dibayar).

**2. Logika untuk Bisnis RENTAL/TRAVEL (Tetap seperti PRD sebelumnya):**
- Status `PENDING`: Label UI **"Persiapan"**. Tombol Aksi: **"Setujui"** (Ubah ke `COMPLETED`).
- Status `COMPLETED`: Label UI **"Siap Berangkat"**. Tombol Aksi: **"🚀 Mulai Perjalanan / Start"** (Ubah ke `IN_PROGRESS`).
- Status `IN_PROGRESS`: Label UI **"Sedang Jalan"**. Tombol Aksi: **"✅ Tiba di Pool / Finish"**.

Silakan pisahkan alur (*lifecycle*) komponen tabel pesanan ini menggunakan *ternary operator* atau `if/else` berdasarkan tipe bisnisnya! Lapor jika pesanan Jasa sudah tidak disuruh "Mulai Perjalanan" lagi!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.20
**Fokus:** Bug Fix - IN_PROGRESS Visibility & Real-time Timestamp UI di Inbox

## 1. Analisis Masalah
Setelah implementasi *overwrite* `startDate` secara *real-time*, pesanan yang di-klik "Start" (berubah menjadi `IN_PROGRESS`) justru menghilang dari daftar "Pesanan Online" (Tampilan menjadi Empty State). Selain itu, diperlukan penambahan UI pada tabel Inbox untuk menampilkan jam aktual/real-time kapan perjalanan dimulai (Start) dan kapan diselesaikan (Finish).

## 2. Instruksi Eksekusi (Backend Filter & Frontend UI Table)
**Target File:** API Endpoint `app/api/orders/route.ts` (atau yang me-load data Inbox) dan Komponen Tabel Inbox `app/admin/booking/BookingDashboardClient.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kembalikan Visibilitas Status `IN_PROGRESS` di Inbox:**
1. Periksa fungsi *fetch* atau pemanggilan API pada halaman Inbox Pesanan Online.
2. Pastikan filter `where` pada Prisma memuat pesanan dengan status `IN_PROGRESS` (Sedang Jalan). Jangan sembunyikan status ini. Admin masih membutuhkan pesanan ini berada di Inbox agar bisa menekan tombol "✅ Tiba di Pool / Finish".

**B. UI Waktu Real-time di Tabel Inbox:**
1. Pada tabel Pesanan Online, di bawah kolom **"ID PESANAN"** (tempat tanggal biasanya dirender), ubah cara merender tanggal tersebut menggunakan *conditional rendering*:
   - Jika Status = `PENDING` atau `COMPLETED`: Tampilkan "Jadwal: [Format Tanggal Awal]".
   - Jika Status = `IN_PROGRESS`: Tampilkan **"Mulai: [Format startDate yang baru di-overwrite]"** (dengan jam/menit).
   - Jika Status = `FINISHED`: Tampilkan **"Selesai: [Format endDate]"**.

**C. Overwrite `endDate` saat Event "Finish":**
1. Buka *Server Action* / fungsi API yang menangani event tombol "✅ Tiba di Pool / Finish".
2. Sama seperti fitur Start, pastikan saat tombol Finish diklik, sistem menimpa (*overwrite*) nilai `endDate` menjadi `new Date()` (waktu server saat itu juga).
3. Ini akan mengunci argometer penyewaan secara akurat untuk perhitungan *overtime* nantinya.

Silakan perbaiki filter Inbox dan tambahkan *tracker* waktu ini! Lapor jika pesanan yang "Sedang Jalan" sudah kembali muncul di Inbox lengkap dengan jam keberangkatannya!
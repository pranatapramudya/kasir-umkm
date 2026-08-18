# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.96
**Fokus:** Navigasi Cleanup & Database Sinkronisasi (Inbox -> Calendar)

## 1. Analisis Masalah
1. **Navigasi Double:** Sidebar menampilkan menu duplikat/ganda karena terdapat kekacauan pada file konfigurasi navigasi (kemungkinan besar ada dua *array* atau *mapping* yang dijalankan bersamaan).
2. **Sinkronisasi Data:** Fitur "Inbox Pesanan Online" dan "Kalender Sewa" saat ini terputus. Data booking yang sudah di-Approve (Diterima) di Inbox tidak muncul otomatis di Kalender Sewa.

## 2. Instruksi Eksekusi (Navigasi & Data Logic)
**Target File:** `lib/navigation.ts` (atau file penentu menu Sidebar), `app/admin/orders/page.tsx` (Inbox), dan `app/admin/rental-calendar/page.tsx` (Kalender).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Bersihkan Navigasi Ganda:**
1. Periksa file `lib/navigation.ts`. Cari bagian yang mendefinisikan *array* menu Sidebar.
2. Hapus duplikasi item menu. Pastikan hanya ada satu set menu tunggal yang dirender ke dalam Sidebar, bukan dua atau lebih komponen yang bertumpuk.

**B. Sinkronisasi Data (Database Binding):**
1. **Logika Approve:** Pada halaman "Inbox Pesanan Online", saat tombol "Approve" (Diterima) diklik, pastikan *function* tersebut tidak hanya mengubah status `status: 'Diterima'` di database, tetapi juga memastikan data transaksi tersebut memiliki `start_date` dan `end_date` yang valid di tabel `Bookings` atau `Rentals`.
2. **Logika Kalender:** Ubah query pengambilan data di halaman "Kalender Sewa". Pastikan query Prisma memfilter transaksi dengan kriteria: `status === 'Diterima'`. 
3. Dengan cara ini, Kalender Sewa akan secara otomatis "hidup" dan menampilkan data hanya setelah admin meng-approve pesanan dari Inbox.

**C. Verifikasi:**
- Pastikan perubahan status di Inbox langsung terlihat secara *real-time* (atau setelah *refresh*) di Kalender Sewa.

Silakan bersihkan menu navigasi yang ganda dan "jahit" database antara Inbox dan Kalender ini! Lapor jika setelah di-approve di Inbox, pesanan langsung muncul di Kalender Sewa!
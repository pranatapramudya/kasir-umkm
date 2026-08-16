# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.95
**Fokus:** Fix Dead Link "Kasir Rental" & Fitur Inbox "Pesanan Masuk/Online"

## 1. Analisis Masalah
1. **Dead Link Kasir Rental:** Tombol menu "Kasir Rental" di Sidebar tidak merespons (bukan 404, tetapi tidak bisa diklik). Ini mengindikasikan komponen tidak dirender sebagai link aktif (href kosong/undefined, atau tag `<Link>` terblokir oleh logika kondisional tipe bisnis).
2. **Missing Flow Pemesanan Online:** Klien menanyakan ke mana perginya pesanan (Booking) yang masuk dari *link slug* toko publik (Katalog Online). Saat ini belum ada halaman/menu untuk menampung pesanan masuk dari pelanggan online.

## 2. Instruksi Eksekusi (Sidebar Navigation & Routing)
**Target File:** Konfigurasi menu navigasi (misal: `lib/navigation.ts` atau `Sidebar.tsx`), dan pembuatan rute baru untuk Pesanan Online.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Bedah Tuntas Bug Klik "Kasir Rental":**
1. Buka file yang merender *array* atau daftar menu Sidebar.
2. Cari definisi untuk item "Kasir Rental". Pastikan logika kondisional tipe bisnis (Rental/Travel) merender atribut `href` dengan nilai string yang valid (misal: `href: "/admin/pos"`), BUKAN `null`, `undefined`, atau `#`.
3. Pastikan komponen pembungkusnya benar-benar menggunakan `<Link href="...">` dari `next/link` tanpa ada `pointer-events-none` atau status *disabled*.

**B. Buat Menu & Halaman "Pesanan Online" (Inbox Order Slug):**
1. Tambahkan menu baru di Sidebar: **"Pesanan Online"** (Letakkan di bawah menu "Kasir Rental" atau "Kalender Sewa").
2. Arahkan *href* menu ini ke rute baru: `/admin/orders` (atau `/admin/pesanan`).
3. Buat file `page.tsx` baru di rute tersebut yang berisi UI Daftar Pesanan (Tabel/Card).
4. Halaman ini berfungsi sebagai "Inbox". Semua data transaksi/booking yang datang dari halaman *slug* toko publik pelanggan harus ditampilkan di sini agar admin bisa melakukan *Approve* (Terima) atau *Reject* (Tolak) sebelum jadwalnya masuk ke Kalender Sewa.

Silakan hidupkan kembali tombol "Kasir Rental" dan buatkan wadah "Pesanan Online" untuk menampung konversi dari toko publik! Lapor jika eksekusi selesai.
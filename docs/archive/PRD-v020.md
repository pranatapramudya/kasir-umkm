# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.20
**Fokus:** Resolusi 404 Halaman Pengaturan & Integrasi Data Dasbor Analitik

## 1. Analisis Masalah
*   **Error 404 (Pengaturan):** Saat pengguna menekan menu "Pengaturan" pada *Bottom Navigation* di halaman Admin, aplikasi menampilkan layar putih / halaman 404 Not Found. Hal ini mengindikasikan ketiadaan direktori dan file `page.tsx` untuk rute tujuan (misal: `/admin/settings`).
*   **Dasbor Statis (Data Tidak Sinkron):** Metrik pada halaman Dasbor utama Admin (`/admin`) seperti Total Pendapatan, Laba Bersih, dan Total Transaksi saat ini masih menampilkan angka 0 (statis). Komponen tersebut belum terhubung dengan kalkulasi data transaksi riil dari Prisma *database*.

## 2. Solusi Teknis & Instruksi Implementasi untuk AI Agent

### A. Resolusi 404 (Membuat Halaman Pengaturan)
*   **Tugas:** Buat file rute baru di `app/admin/settings/page.tsx`.
*   **Spesifikasi UI:**
    *   Gunakan desain *Mobile-First* yang konsisten dengan halaman lain.
    *   Tampilkan judul halaman "Pengaturan Toko".
    *   Untuk versi MVP ini, sisipkan komponen manajemen akun bawaan dari Clerk (`<UserProfile />`) di dalam halaman tersebut agar pengguna dapat mengelola profil mereka secara mandiri. Pastikan dibungkus dengan kontainer yang memiliki *padding* dan *overflow* yang aman untuk tampilan seluler.

### B. Integrasi Data Dasbor Analitik
*   **Tugas:** Hubungkan komponen UI Dasbor di `app/admin/page.tsx` dengan basis data (Prisma).
*   **Logika Implementasi:**
    1.  **Fetch Data:** Ambil data transaksi dari *database* berdasarkan rentang waktu yang dipilih pada *Date Picker* (Filter Bulan/Tahun). Jika *Date Picker* diatur ke "Bulan Ini", ambil semua transaksi yang terjadi pada bulan berjalan.
    2.  **Kalkulasi Metrik (Aggregasi):**
        *   **Total Transaksi:** Hitung total jumlah baris/data transaksi (`count`).
        *   **Total Pendapatan:** Jumlahkan (*sum*) total nilai bayar dari semua transaksi di periode tersebut.
        *   **Laba Bersih:** Lakukan kalkulasi secara dinamis. Laba = Total Pendapatan dikurangi Total HPP (Harga Pokok Penjualan) dari semua barang (SKU) yang terjual di dalam transaksi tersebut.
    3.  **State Management:** Pastikan perubahan pada filter tanggal (Date Picker) memicu pembaruan data secara *real-time* atau *client-side fetching* (gunakan *SWR* atau eksekusi *Server Actions* yang direvalidasi).
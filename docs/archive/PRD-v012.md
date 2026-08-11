# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.12
**Fokus:** Kompresi Gambar, Navigasi Bottom Bar Admin, Advanced Date Picker, & Paywall Fitur Pro

## 1. Analisis Masalah & Kebutuhan Baru
* **Bug "Gagal Menyimpan Produk":** Disebabkan oleh *payload* Base64 gambar yang melampaui batas maksimal request Next.js/Prisma. Diperlukan kompresi gambar di sisi klien sebelum dikirim.
* **Layout Admin Usang:** Penggunaan Sidebar di `app/admin/layout.tsx` memakan ruang layar, terutama pada perangkat *mobile* dan *tablet* kasir.
* **Filter Waktu Kurang Fleksibel:** Pengguna membutuhkan *Date Picker* yang bisa memilih rentang harian, bulanan, dan tahunan, bukan sekadar input bulan standar.
* **Upsell Fitur SaaS (Paywall):** Diperlukan tombol pemicu (*hook*) di halaman kasir untuk mengarahkan pengguna gratisan agar berlangganan versi Pro.

## 2. Solusi Teknis & Instruksi Implementasi

### A. Kompresi Gambar Klien (Client-Side Compression)
* Buka komponen Modal di `app/admin/products/page.tsx`.
* Implementasikan fitur pengecilan ukuran *file* pada fungsi *handler* unggah foto. 
* Gunakan elemen `<canvas>` bawaan HTML5 untuk me- *resize* gambar (misalnya maksimal lebar/tinggi 800px) dan menurunkan kualitasnya (misal `0.7` untuk JPEG/WEBP) sebelum dikonversi menjadi *string Base64*. Pastikan ukurannya turun drastis (di bawah 500KB) agar aman disimpan di basis data.

### B. Perombakan Layout Admin (Bottom Navigation)
* Buka `app/admin/layout.tsx`.
* Hapus sepenuhnya komponen *Sidebar* vertikal.
* Ganti dengan *Bottom Navigation Bar* (Footer Menu) yang *fixed* di bagian bawah layar `fixed bottom-0 w-full bg-white border-t shadow-lg z-50`.
* Susun ikon-ikon menu (Dashboard, Produk, Pengaturan) secara horizontal dengan `flex justify-around items-center p-3`. Berikan warna *highlight* (misal biru) pada menu yang sedang aktif.

### C. Advanced Date Picker (Dashboard)
* Buka `app/admin/page.tsx`.
* Ganti input bawaan browser dengan komponen UI pemilih tanggal yang lebih interaktif (misalnya menggunakan elemen input tipe `date` yang dimodifikasi, atau memanggil komponen *Dropdown* yang memberikan opsi: "Hari Ini", "Bulan Ini", "Tahun Ini", dan "Pilih Tanggal Manual").

### D. Fitur Paywall "Lihat Analitik" (Halaman Kasir)
* Buka halaman Storefront Kasir di `app/page.tsx`.
* Tambahkan tombol "Lihat Analitik 👑" di area *Header* atau di dekat Keranjang.
* Implementasikan logika pengecekan langganan menggunakan metadata Clerk (contoh: mengecek `user?.publicMetadata?.plan === 'pro'`).
* Jika pengguna belum Pro, klik tombol tersebut akan memunculkan *Modal Paywall* berdesain premium yang berisi penawaran langganan (contoh: "Tingkatkan ke Pro untuk melihat laporan keuntungan harian Anda!"). Jika sudah Pro, arahkan ke rute `/admin`.
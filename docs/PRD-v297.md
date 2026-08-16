# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.97
**Fokus:** UI Fixes (Header/Sticky), Agenda Details, Slug Payment Flow, & Order Notification Badge

## 1. Analisis Masalah
1. **Layout & Sticky Header:** Header utama pada Kasir Rental tidak merentang penuh (*full width*). Di halaman Kalender Sewa, area header/navigasi bulan ikut tergulung (*scroll*) sehingga membingungkan pengguna.
2. **Kekurangan Detail Agenda:** Kartu agenda di bagian bawah Kalender Sewa (Split View) belum menampilkan rincian dari Form Lengkapi Data Sewa (seperti Nama Supir, Plat Nomor, Tujuan, dan Jaminan).
3. **Alur Pembayaran Toko Publik (Slug):** Klien membutuhkan alur pembayaran yang sangat simpel dan minim potongan (Efisien). Metode terbaik adalah Pembayaran Transfer Manual yang diakhiri dengan Konfirmasi WhatsApp.
4. **Notifikasi Pesanan Masuk (Badge):** Tidak ada indikator visual di Sidebar jika ada pesanan baru. Admin harus menebak atau merefresh halaman terus-menerus.

## 2. Instruksi Eksekusi (Frontend, Routing, & State)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan Header & Sticky Position:**
1. **Global Header:** Periksa komponen `Header` atau `Layout` utama. Pastikan lebarnya menggunakan `w-full` dan tidak terpotong oleh *padding* dari pembungkus luar.
2. **Kalender Sewa:** Berikan kelas `sticky top-0 z-40 bg-white` pada bagian atas Kalender (area nama bulan dan navigasi hari) agar tetap menempel di layar saat pengguna menggulir daftar agenda di bawahnya.

**B. Pengayaan Data Kartu Agenda (Kalender Sewa):**
1. Buka komponen yang merender Kartu Agenda di `app/admin/rental-calendar/page.tsx`.
2. Tarik (*fetch*) dan tampilkan data relasional dari tabel pemesanan: Tampilkan **Plat Nomor**, **Nama Supir**, dan **Jaminan** di dalam kartu (gunakan font ukuran kecil `text-sm` atau *badge* abu-abu agar tetap rapi).

**C. Alur Pembayaran Manual & Konfirmasi WA (Katalog Slug):**
1. Pada halaman *Checkout* di toko publik pelanggan (`/toko/[slug]`), modifikasi halaman *Success/Payment*.
2. Tampilkan UI **"Instruksi Pembayaran"** yang memuat: Total Tagihan, Nama Bank, dan Nomor Rekening Pemilik Toko (ambil dari pengaturan toko jika ada, atau buatkan *placeholder* UI-nya).
3. Buat tombol Call-to-Action (CTA) besar berwarna hijau: **"Konfirmasi Pembayaran via WhatsApp"**.
4. Tombol tersebut harus mengarah ke URL `https://wa.me/` nomor toko dengan teks bawaan (*pre-filled text*) berisi: *"Halo, saya sudah melakukan pembayaran untuk ID Pesanan: [ID]. Berikut bukti transfernya..."*.

**D. Pembuatan Notification Badge (Sidebar):**
1. Buka komponen `Sidebar` / `Navigation`.
2. Buat fungsi pengambilan data ringan (*data fetching / SWR*) untuk menghitung jumlah pesanan di tabel `Orders/Bookings` yang memiliki `status === 'Menunggu'`.
3. Tampilkan angka tersebut sebagai *Badge* (lingkaran kecil berwarna merah dengan angka putih) di sebelah kanan menu **"Pesanan Online"**. (Misal: Pesanan Online 🔴 3).

Silakan eksekusi keempat poin ini dengan presisi tinggi! Desain harus tetap bersih (*clean SaaS look*). Lapor jika semuanya sudah di-*push* dan berjalan mulus!
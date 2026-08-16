# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.98
**Fokus:** Layout Fixes, Ticket Download Activation, & Dynamic Tenant Payment Info

## 1. Analisis Masalah
1. **Layout Kasir Rental (Tombol Tertutup):** Pada panel "Detail Sewa" di sisi kanan halaman Kasir Rental, tombol aksi utama (Bayar/Selesai) terdorong ke luar batas bawah layar (*viewport*) dan tidak dapat di-scroll.
2. **Header Kalender Tidak Sticky:** Baris nama hari (Senin-Minggu) pada Kalender Sewa ikut tergulung saat di-scroll ke bawah.
3. **Fungsi Download Tiket:** Tombol "Unduh Tiket Reservasi" pada halaman sukses *Booking Slug* belum memiliki fungsi eksekusi (mati).
4. **Data Pembayaran Hardcoded:** Instruksi pembayaran (Nomor Rekening) dan nomor tujuan WhatsApp di halaman *Booking Slug* masih menggunakan data statis/dummy. Ini harus dibuat dinamis berdasarkan data spesifik masing-masing toko (Multi-Tenant).

## 2. Instruksi Eksekusi (Frontend, Routing, & Database Logic)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Fix Layout Sidebar Kasir Rental (Flex & Overflow):**
1. Buka komponen yang membungkus panel kanan ("Detail Sewa").
2. Pastikan kontainer utamanya menggunakan `h-screen` atau `h-full` dengan `flex flex-col`.
3. Berikan kelas `flex-1 overflow-y-auto` pada area daftar item/form di tengah, sehingga hanya bagian tengah yang bisa di-scroll, sementara bagian footer (Total dan Tombol Bayar) tetap terkunci/terlihat di posisi paling bawah.

**B. Fix Sticky Header Kalender Sewa:**
1. Buka komponen Grid Kalender.
2. Tambahkan kelas `sticky top-0 z-20 bg-white shadow-sm` (atau warna background yang sesuai) pada elemen baris (*row*) yang merender nama-nama hari (Sen, Sel, Rab, dst.) agar menempel saat di-scroll.

**C. Pembuatan Input Data Pembayaran Dinamis (Informasi Toko):**
1. Buka halaman/komponen **Informasi Toko** (Settings) di *dashboard* admin.
2. Tambahkan *input field* baru untuk pengaturan toko: 
   - **Nomor WhatsApp Admin**
   - **Informasi Rekening Bank** (Nama Bank, No. Rekening, Atas Nama).
3. Pastikan data ini tersimpan ke tabel `Store` atau `Tenant` di database.

**D. Integrasi Data Dinamis & Download Tiket pada Halaman Slug:**
1. Pada halaman *Success/Payment Booking* (`/toko/[slug]/...`), ambil data toko (Tenant) dari database.
2. Gantikan teks rekening dummy ("BCA - 1234567890") dengan data Rekening Bank milik toko tersebut.
3. Pastikan tombol "Konfirmasi Pembayaran via WhatsApp" mengarah ke URL API WhatsApp yang menggunakan Nomor WhatsApp asli dari toko tersebut.
4. **Aktifkan Tombol Unduh:** Implementasikan fungsi pada tombol "Unduh Tiket Reservasi". Anda bisa menggunakan `window.print()` dengan CSS khusus print, atau menggunakan *library* ringan (seperti `html2canvas` / `jspdf`) untuk menyimpan area div Bukti Reservasi menjadi gambar/PDF.

Silakan bereskan isu layout dan hubungkan logika data *Multi-Tenant* ini agar alur pemesanan *online* benar-benar bisa digunakan di dunia nyata! Lapor jika semuanya sudah berfungsi.
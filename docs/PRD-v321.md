# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.21
**Fokus:** Dynamic Pricing Disclaimer & Editable Cart Price (Kasir Rental)

## 1. Analisis Masalah
Terdapat kelemahan logika bisnis pada alur penyewaan Rental/Travel. Sistem saat ini mengunci harga secara statis dari *database* (misal: Avanza Rp 200.000). Jika pelanggan menginput rute antar kota yang sangat jauh (misal: Sumedang ke Lombok), harga tetap terhitung Rp 200.000, yang mana akan merugikan pemilik bisnis. Sistem membutuhkan fitur penyesuaian harga manual (Custom Pricing) di meja Kasir, serta *copywriting* yang tepat di form pelanggan agar tidak terjadi miskomunikasi.

## 2. Instruksi Eksekusi (Frontend Copywriting & Cart State Logic)
**Target File:** Komponen Form Booking Publik (`BookingForm.tsx`) dan Komponen Keranjang Kasir Rental (`app/admin/rental-pos/page-client.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Penyesuaian Copywriting di Form Publik:**
1. Pada halaman form *booking* pelanggan, ubah cara merender harga layanan/armada. Jangan gunakan teks absolut ("Rp 200.000").
2. Ubah format teksnya menjadi: **"Estimasi / Mulai dari Rp 200.000"**.
3. Di bawah kotak input "LOKASI TUJUAN", tambahkan teks kecil berwarna abu-abu/kuning (sebagai *disclaimer*): *"Catatan: Harga di atas adalah harga dasar/dalam kota. Harga final akan disesuaikan dengan jarak rute tujuan Anda dan dikonfirmasi melalui WhatsApp."*

**B. Fitur "Editable Price" di Keranjang Kasir (Krusial!):**
1. Buka komponen yang merender *item* di dalam keranjang Kasir (panel "Detail Sewa").
2. Saat ini, harga *item* (misal Rp 200.000) dirender sebagai teks statis. Ubah elemen tersebut menjadi `<input type="number">` (atau *currency input* yang bersih).
3. Berikan nilai *default* input tersebut dari harga *database* (Rp 200.000).
4. Hubungkan input ini dengan fungsi `onChange` yang langsung memutasi *state* harga *item* tersebut di dalam keranjang.
5. Dengan fitur ini, saat admin menarik antrean pelanggan yang bertujuan ke Lombok, admin dapat dengan mudah menghapus "200000" di keranjang dan mengetik nominal baru (misal "2000000").

**C. Sinkronisasi Subtotal & Total:**
1. Pastikan logika kalkulasi `Subtotal` dan `Total Belanja` di bagian bawah keranjang melakukan kalkulasi ulang secara *real-time* setiap kali admin mengubah harga di input tersebut.

Silakan eksekusi perubahan harga dinamis ini! Lapor jika harga di keranjang Kasir sudah bisa diedit/diketik manual oleh Admin!
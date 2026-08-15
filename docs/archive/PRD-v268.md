# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.68
**Fokus:** Hard-Override Grid Sidebar, Fix Overflow, & Hapus Fitur DP Jasa

## 1. Analisis Masalah (Kritikal)
Agen sebelumnya GAGAL memperlebar *sidebar* keranjang. Kemungkinan besar *sidebar* terkunci oleh properti `grid-cols` atau pembatasan `max-width` pada *wrapper* utamanya. Selain itu, fitur "Bayar Uang Muka (DP)" muncul di Kasir Jasa, padahal untuk transaksi jasa *walk-in* (seperti cukur rambut langsung), pelanggan membayar lunas di akhir, bukan DP.

## 2. Instruksi Eksekusi (Strict Layouting & Logic)
**Target File:** Komponen `page-client.tsx` (atau file utama layout Kasir Jasa) dan komponen *Cart Item*.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE):**

**A. Bongkar Grid/Flex Parent (Penyebab Gagal Melebar):**
1. Cari *wrapper* paling luar yang membagi layar menjadi Kiri (Daftar Produk) dan Kanan (Keranjang).
2. Jika menggunakan `grid` (misal: `grid-cols-12`), ubah proporsinya! Berikan *span* yang lebih besar untuk *sidebar* keranjang (contoh: Kiri `col-span-7`, Kanan `col-span-5`).
3. Jika menggunakan `flex`, pastikan *sidebar* kanan menggunakan class `w-full lg:w-[450px] shrink-0` agar ukurannya tidak bisa digencet oleh area kiri. Area kiri harus memakai `flex-1`.

**B. Basmi Scrollbar Horizontal:**
1. Pada *card item* yang ada di dalam keranjang, tambahkan class `overflow-hidden`.
2. Pastikan baris yang memuat Harga dan Tombol (+ / -) Kuantitas menggunakan `flex-wrap` atau ditumpuk vertikal jika ruangnya tidak muat. JANGAN biarkan mereka mendesak *container* sampai menembus batas.

**C. Sembunyikan Checkbox DP (Khusus Jasa):**
1. Hapus atau sembunyikan (`hidden`) elemen *checkbox* "Bayar Uang Muka (DP)" berserta logikanya di halaman **Kasir Jasa**. 
2. Transaksi *walk-in* untuk Jasa harus selalu diasumsikan lunas (bayar penuh) agar UI keranjang lebih bersih dan tidak membingungkan kasir.

Silakan eksekusi perbaikan *layout* ini dengan benar. Jangan hanya menambah *padding*! Rombak struktur *Grid/Flex*-nya sekarang juga!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.84 (REVISI)
**Fokus:** Smart Printing Surat Jalan A4 & Clean UX Sidebar Detail Sewa

## 1. Analisis Masalah (UX Copywriting & Dokumen Cetak)
1. **UX Tweak:** Pada halaman Kasir Rental, *empty state* di sidebar "Detail Sewa" menampilkan ikon troli dan teks "Keranjang masih kosong...". Kosakata ini terlalu lekat dengan *Retail* dan tidak cocok untuk *Rental*. Lebih baik dihilangkan agar *background* bersih.
2. **Dokumen Cetak:** Modul Rental membutuhkan dokumen cetak berupa Invoice A4/Surat Jalan yang memuat informasi spesifik dari modal "Lengkapi Data Sewa" (Tgl Mulai, Tgl Selesai, Plat Nomor, Jaminan, dll), bukan struk thermal memanjang.

## 2. Instruksi Eksekusi (Frontend & Print CSS)
**Target File:** Komponen Sidebar Keranjang/Detail Sewa (`app/admin/rental-pos/page.tsx`), dan Komponen Cetak Print (`InvoiceRentalA4.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. UX Cleanup pada "Detail Sewa":**
1. Cari komponen yang merender *empty state* pada sidebar "Detail Sewa" saat belum ada layanan/armada yang dipilih.
2. **Hapus/Sembunyikan** ikon troli belanja dan teks *"Keranjang masih kosong, silakan pilih produk"*. Biarkan area tersebut bersih/kosong (atau berikan ilustrasi minimalis abstrak tanpa teks retail).

**B. Logika Smart Printing (Conditional Layout):**
1. Buat logika kondisional pada fungsi *Print/Checkout*.
2. Jika tipe bisnis = `F&B` / `Retail` / `Jasa` -> Render struk Thermal 58mm.
3. Jika tipe bisnis = `Rental` / `Travel` -> Render komponen khusus `InvoiceRentalA4`.

**C. Pembuatan Template InvoiceRentalA4 & Integrasi Data Modal:**
1. Buat komponen baru untuk format A4 menggunakan CSS Print murni: `@media print { @page { size: A4; margin: 1cm; } }`.
2. **Struktur Dokumen (Tailwind CSS):**
   - **Header:** Logo, Nama Toko, Tulisan "INVOICE SEWA / SURAT JALAN", No. Transaksi, Tanggal Cetak.
   - **Informasi Rental (Ambil dari State Modal 'Lengkapi Data Sewa'):** 
     - Render data yang diinput dari form: Nama Supir, Plat Nomor, Tujuan, Jaminan Diserahkan, Tgl Mulai, dan Tgl Selesai.
   - **Tabel Item:** Nama Armada, Harga, Durasi, dan Subtotal.
   - **Ringkasan Biaya:** Total Bayar, Metode Pembayaran (Tunai/QRIS).
   - **Footer (Tanda Tangan):** Sediakan ruang kosong 2 kolom di bawah. Kiri: "Penyewa/Customer". Kanan: "Petugas/Admin".

Silakan bersihkan UI *empty state* tersebut dan eksekusi sistem cetak pintar format A4 ini yang terintegrasi dengan form data sewa! Lapor jika sudah siap diuji coba.
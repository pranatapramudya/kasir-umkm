# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.03
**Fokus:** Contextual UX Modul Jasa, Stock Removal, & Seamless Queue Integration

## 1. Analisis Masalah
1. **Copywriting Modul Jasa:** Label pada form "Tambah Layanan" masih terlalu kaku untuk bisnis Jasa (Barbershop, Klinik, Bengkel, dll). Selain itu, pada halaman Kasir Jasa, kartu layanan menampilkan *badge* "Sisa Stok (999999)", yang mana tidak relevan untuk layanan *Service/Jasa*.
2. **Workflow Kasir Terputus:** Saat ini, kasir harus bolak-balik antara menu Pesanan Online, Jadwal Booking, dan Kasir Jasa. Dibutuhkan mekanisme *seamless* di dalam Kasir Jasa untuk menarik (pull) data pelanggan yang sudah melakukan *booking online* hari ini agar tidak perlu input manual dua kali.

## 2. Instruksi Eksekusi (Frontend Context, DB Sync, & UI Integration)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Contextual Copywriting (Form Tambah Jasa):**
1. Buka logika *Conditional Copywriting* di Form Tambah Layanan. Jika tipe bisnis adalah `Jasa`:
   - "Nama Layanan" -> **"Nama Jasa / Paket"**
   - "Harga Jual" -> **"Tarif Jasa"**
   - "Biaya Bahan" -> **"Biaya Modal / Bahan Dasar (Opsional)"** (Contoh: Obat salon, oli).
   - "Komisi Pekerja" -> **"Komisi Staf / Terapis / Kapster (Rp)"**

**B. Hapus Badge Stok Fisik di Kasir Jasa:**
1. Buka komponen yang merender *Grid Card* layanan di halaman Kasir Jasa (`app/admin/jasa-pos/page.tsx`).
2. Buat logika kondisional: Jika tipe bisnis = `Jasa` (atau `Rental`), **SEMBUNYIKAN/HAPUS** elemen UI badge stok ("Sisa: 999999"). Layanan jasa bersifat *unlimited supply*.

**C. Integrasi Tarik Antrean Online (Seamless Workflow):**
1. Buka komponen panel "Detail Layanan / Keranjang" di halaman Kasir Jasa.
2. Tambahkan tab atau tombol kecil di area atas panel bernama: **"📋 Tarik Antrean Online"**.
3. Saat diklik, munculkan Modal/Daftar yang melakukan *fetch* data pesanan dari database dengan syarat: 
   - `status === 'Diterima' / 'APPROVED'` (Sudah di-acc dari Inbox)
   - Tanggal jadwal = **Hari Ini** (Today).
4. Di samping setiap nama antrean tersebut, berikan tombol **"Proses"**.
5. Jika Kasir menekan "Proses", otomatis pindahkan data pesanan tersebut (Nama Pelanggan, Jasa yang dipilih, Waktu Layanan) ke dalam Keranjang/Detail Layanan yang sedang aktif di Kasir, sehingga Kasir tinggal menekan "Bayar Sekarang" setelah pelayanan selesai.
6. Pastikan setelah dibayar, status pesanan aslinya diubah menjadi "Selesai" (COMPLETED).

Silakan implementasikan *Contextual UX* dan fitur "Tarik Antrean" ini! Lapor jika alur pemesanan *online* Jasa sudah terhubung sempurna ke meja Kasir tanpa perlu *input* ulang!
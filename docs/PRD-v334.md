# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.35
**Fokus:** Bug Fix - Dynamic Content Buku Panduan & Mobile Navigation Integration

## 1. Analisis Masalah
Terdapat dua isu pada fitur "Buku Panduan / Bantuan" paska-rilis:
1. **Context Mismatch (Isi Panduan Salah):** Konten SOP di dalam `BukuPanduanModal.tsx` masih menampilkan alur kerja statis (misal: "Jasa") meskipun pengguna yang login adalah tipe bisnis "Rental". Komponen tidak merender teks secara dinamis berdasarkan *state* `businessType`.
2. **Missing UI on Mobile:** Tombol untuk membuka "Buku Panduan" tidak tersedia saat aplikasi diakses melalui layar kecil (*mobile*), karena integrasi tombol baru hanya dilakukan pada komponen *Sidebar* Desktop, sedangkan menu *mobile* tertinggal.

## 2. Instruksi Eksekusi (Frontend Conditional Rendering & UI Sync)
**Target File:** Komponen `BukuPanduanModal.tsx` dan Komponen Navigasi Mobile (misal: `MobileNav.tsx`, `HeaderMobile.tsx`, atau *Drawer* navigasi Anda).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaiki Logika Render di Buku Panduan (Modal):**
1. Buka komponen `BukuPanduanModal.tsx`.
2. Pastikan komponen ini menerima `businessType` pengguna saat ini (bisa melalui *props*, *global state* Zustand, atau membaca *session context*).
3. Buat struktur *Conditional Rendering* (Switch/Case atau If/Else) yang merender UI/Teks berbeda untuk setiap tipe bisnis:
   - **Jika `RENTAL`:** Tampilkan langkah-langkah: (1) Tambah Armada, (2) Atur Harga Sewa, (3) Tarik Pesanan / Input Kalender Sewa, (4) Klik Start (Mulai Perjalanan), (5) Finish & Lunas.
   - **Jika `JASA`:** Tampilkan langkah-langkah: (1) Buat Layanan (Klinik/Salon), (2) Bagikan Link Booking, (3) Terima Antrean, (4) Proses di Kasir.
   - **Jika `RETAIL` atau `FNB`:** Tampilkan langkah-langkah: (1) Tambah Produk/Menu, (2) Atur Stok, (3) Buka Kasir, (4) Cetak Struk/Faktur.

**B. Sinkronisasi Menu Navigasi Mobile:**
1. Cari komponen yang bertanggung jawab untuk menampilkan menu di layar *mobile* (contoh: *hamburger menu* atau *bottom navigation bar*).
2. Tambahkan tombol/ikon **"Bantuan & Panduan"** yang persis sama dengan yang ada di *Sidebar* Desktop.
3. Pastikan *onClick event* dari tombol di versi *mobile* ini juga memicu *state* yang sama untuk membuka `BukuPanduanModal.tsx`.
4. Uji responsivitas: Kecilkan layar *browser* (Inspect Element -> Mobile View) dan pastikan tombol tersebut bisa diklik dan memunculkan Modal dengan sempurna di tengah layar.

Silakan perbaiki anomali UI dan konten ini! Lapor kembali jika SOP panduan sudah 100% akurat menyesuaikan bisnis dan tombolnya sudah bisa diakses dari HP!
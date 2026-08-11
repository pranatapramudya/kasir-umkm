# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.14
**Fokus:** Optimasi Mobile-First Layout (Product Cards) & Aksesibilitas Navigasi "Lihat Kasir"

## 1. Analisis Masalah (UI/UX Review)
* **Keterbatasan Tabel di Mobile:** Pada halaman `app/admin/products/page.tsx`, penggunaan elemen tabel (`<table>`) untuk merender daftar produk menyebabkan UI terpotong di layar perangkat seluler. Pengguna kehilangan visibilitas langsung terhadap informasi krusial seperti Harga, Stok, dan tombol Aksi.
* **Jebakan Navigasi (Navigation Trap):** Setelah pengguna (Admin/Owner) masuk ke area Dasbor (`/admin`), tidak ada tombol "Lihat Kasir" atau "Storefront" yang menonjol dan mudah diakses, terutama pada tampilan *mobile*. Pengguna kesulitan untuk kembali ke layar transaksi.

## 2. Solusi Teknis & Spesifikasi UI

### A. Refaktor Daftar Produk (Mobile-First Card Layout)
* **Target File:** `app/admin/products/page.tsx`
* **Perubahan UI:** Tinggalkan elemen `<table>` tradisional. Ubah cara *rendering* daftar (array) produk menjadi **Grid of Cards** menggunakan CSS Grid atau Flexbox.
* **Spesifikasi Tampilan (Responsif):**
  - **Mobile (`< md`):** Gunakan `grid-cols-1`. Setiap produk dirender sebagai satu kartu penuh (Card) yang memuat Foto di sebelah kiri, dan detail (Nama, SKU, Kategori, HPP, Harga Jual, Stok) tertata vertikal di sebelah kanan, lengkap dengan tombol Edit/Hapus.
  - **Tablet/Desktop (`>= md`):** Gunakan `grid-cols-2` atau `grid-cols-3` agar tampilan kartu produk menyebar dan mengisi ruang kosong di layar secara rapi.

### B. Penempatan Tombol "Lihat Kasir" (Global Admin Header)
* **Target File:** `app/admin/layout.tsx` (Pada bagian komponen *Header* atas).
* **Perubahan UI:** Tambahkan tombol atau tautan navigasi persisten untuk kembali ke halaman utama (`/`).
* **Spesifikasi Tampilan:**
  - Letakkan tombol "Lihat Kasir" di area *Header* paling atas (berdampingan dengan teks "Halo, Admin" dan `<UserButton />`).
  - Gunakan ikon visual (seperti `Store` atau `ArrowLeft` dari `lucide-react`) disertai teks "Kasir".
  - Pastikan tombol ini menggunakan *styling* yang kontras namun tidak mendominasi (misalnya: *outline button* atau teks berwarna biru dengan efek *hover*), dan tetap responsif (terlihat jelas tanpa terpotong di layar *mobile*).
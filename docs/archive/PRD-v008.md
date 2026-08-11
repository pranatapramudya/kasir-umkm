# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.8
**Fokus:** Implementasi CRUD Produk & Layout Dashboard Admin (Role Owner)

## 1. Tujuan (Objective)
Membangun antarmuka manajemen produk (CRUD) yang terintegrasi dengan API backend baru, serta memisahkan area publik (Storefront Kasir) dengan area privat (Dashboard Owner) menggunakan sistem routing Next.js.

## 2. Arsitektur Routing & RBAC Dasar
Untuk memisahkan area kerja, kita akan membuat grup rute baru khusus untuk manajemen toko.
* **Storefront (`app/page.tsx`):** Area kasir (sudah ada).
* **Admin Layout (`app/admin/layout.tsx`):** *Wrapper* khusus untuk halaman admin yang memiliki *Sidebar* navigasi (Analitik, Produk, Pengaturan).
* **Manajemen Produk (`app/admin/products/page.tsx`):** Halaman utama untuk melakukan Create, Read, Update, dan Delete data produk.

## 3. Spesifikasi UI/UX CRUD Produk

### A. Layout Halaman Produk (`app/admin/products/page.tsx`)
* **Header:** Judul halaman "Manajemen Produk" dan tombol "Tambah Produk Baru" (memanggil Modal).
* **Tabel Data:** Menampilkan daftar produk milik *tenant* yang sedang *login*. Kolom yang wajib ada:
  - Kode Barang (SKU)
  - Nama & Kategori Produk
  - HPP (Harga Modal) - Diformat Rupiah
  - Harga Jual - Diformat Rupiah
  - Stok
  - Aksi (Tombol Edit & Hapus)
* **Empty State:** Jika array produk kosong, tampilkan ilustrasi atau teks "Belum ada produk. Silakan tambah produk pertama Anda."

### B. Form Modal (Tambah/Edit Produk)
Gunakan komponen antarmuka *pop-up* (Modal) yang rapi. Form wajib memiliki input untuk skema Prisma terbaru:
1. `kodeBarang` (Input teks, Opsional)
2. `name` (Input teks, Wajib)
3. `category` (Dropdown modern, Wajib)
4. `hpp` (Input angka, Wajib)
5. `hargaJual` (Input angka, Wajib)
6. `stock` (Input angka, default 0)
7. `image` (Input file/URL sementara)

### C. Integrasi API & State Management
* Gunakan SWR atau `useEffect` untuk melakukan *fetch* ke `GET /api/products`.
* Pada saat form disubmit, lakukan request ke `POST /api/products` (untuk tambah) atau `PUT /api/products/[id]` (untuk edit).
* Berikan *feedback* visual (Toast/Alert) setiap kali operasi CRUD berhasil atau gagal dieksekusi.
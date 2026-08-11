# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.9
**Fokus:** Perbaikan UX Redundansi Tombol & Aksesibilitas Kontras Form Modal

## 1. Analisis Masalah (UX & Accessibility Bug)
* **Redundansi Call to Action (CTA):** Pada halaman `app/admin/products/page.tsx`, saat data produk kosong (Empty State), terdapat dua tombol tambah produk yang merender secara bersamaan (satu di header kanan atas, satu di tengah area empty state). Ini melanggar prinsip *Single Primary Action*.
* **Low Contrast (Aksesibilitas):** Di dalam form Modal Tambah Produk, elemen input (terutama Kategori, HPP, Harga Jual, dan Stok) menggunakan warna teks/placeholder yang terlalu terang (abu-abu muda/putih) di atas latar belakang putih, sehingga nyaris tidak terbaca oleh pengguna.

## 2. Solusi Teknis

### A. Perbaikan Logika Tombol (Conditional Rendering)
* Tombol CTA "+ Tambah Produk Baru" yang berada di **Header Kanan Atas** HANYA boleh di-render jika `products.length > 0` (tabel sudah terisi) ATAU saat aplikasi sedang dalam status *loading* mengambil data.
* Jika `products.length === 0` (Empty State), sembunyikan tombol di header tersebut, sehingga pengguna secara intuitif hanya akan mengeklik tombol "Tambah Produk Sekarang" yang berada di tengah layar.

### B. Perbaikan Kontras UI Form Modal (Tailwind CSS)
* Cari seluruh tag `<input>` dan `<select>` di dalam komponen Modal Tambah/Edit Produk.
* Hapus class warna teks yang terlalu terang seperti `text-gray-300`, `text-gray-200`, atau `text-white/50`.
* Standardisasi semua input dengan *utility classes* Tailwind berikut agar terlihat tegas dan premium:
  `bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`
* Untuk *placeholder*, pastikan menggunakan warna yang terbaca namun tidak mendominasi teks isian: `placeholder-gray-400`.
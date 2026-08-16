# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.80
**Fokus:** Bug Fix UI/UX Mobile Responsiveness (Manajemen Layanan Card)

## 1. Analisis Masalah (CSS Flexbox Overflow)
Berdasarkan pengujian tampilan *mobile* pada halaman "Manajemen Layanan", terdapat isu *layout* pada komponen *Card* (Kartu) yang menampilkan daftar layanan (contoh: item "Cukur Rambut Dewasa"). 
Elemen di sisi paling kanan kartu (tombol aksi/opsi) terpotong (*cut-off*) dan keluar dari batas *viewport* layar. Ini mengindikasikan masalah pada struktur Flexbox/Grid di Tailwind CSS, di mana pembungkus teks mendorong elemen lain hingga menyebabkan *horizontal overflow*.

## 2. Instruksi Eksekusi (Frontend Tailwind CSS)
**Target File:** Komponen yang merender daftar item layanan/produk (misalnya `ServiceCard.tsx`, `ProductList.tsx`, atau langsung di `app/admin/services/page.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan Layout Kartu Layanan (Flexbox Constraint):**
1. Pastikan kontainer utama pembungkus setiap kartu menggunakan kelas `w-full` dan margin/padding horizontal yang aman (contoh: `mx-auto px-4` pada parent utamanya) agar tidak menabrak tepi tepi layar ponsel.
2. Perbaiki struktur Flexbox di dalam kartu:
   - Berikan pembungkus teks (yang berisi Judul Layanan, SKU, dan Harga) kelas `flex-1` dan mutlak tambahkan `min-w-0`. Kelas `min-w-0` ini sangat krusial di Tailwind agar teks panjang bisa terpotong (menggunakan `truncate`) dan tidak mendesak elemen di sebelahnya.
   - Pastikan Judul Layanan dan SKU memiliki kelas `truncate` agar berubah menjadi titik-titik (...) jika terlalu panjang di layar kecil.
   - Tetapkan lebar yang pasti atau *flex-shrink-0* pada elemen ikon di sisi kanan agar ukurannya tidak mengecil atau terdorong keluar.

**B. Penyesuaian Visual Z-Index & Padding Bawah:**
1. Pastikan area daftar kartu (list) memiliki `padding-bottom` yang cukup besar (misal: `pb-24` atau `pb-32`). Hal ini untuk memastikan kartu paling bawah tidak tertutup oleh komponen *Bottom Navigation* atau tombol melayang (FAB) "Lainnya" yang ukurannya cukup besar.

Silakan refaktor struktur Tailwind pada komponen kartu tersebut! Pastikan UI kembali presisi, responsif di layar sempit, dan tidak ada lagi elemen biru yang terpotong di tepi kanan layar! Lapor jika sudah dieksekusi.
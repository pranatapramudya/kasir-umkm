# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.5
**Fokus:** Optimalisasi Mobile UX (Above-the-Fold CTA) pada Landing Page

## 1. Analisis Masalah (UX Bug)
Pada tampilan *mobile* (layar kecil), tata letak *grid* secara default akan menumpuk elemen dari kiri ke kanan menjadi atas ke bawah. Hal ini menyebabkan Hero Text dan deretan *bullet points* mendominasi seluruh layar awal, mendorong Kartu Autentikasi (CTA utama) hingga keluar dari batas pandang (*below the fold*). Pengguna harus melakukan *scroll* yang cukup panjang untuk menemukan tombol "Mulai Sekarang".

## 2. Solusi Teknis (CSS Reordering)
Kita akan menerapkan teknik *Responsive DOM Reordering* menggunakan Tailwind CSS. 

### A. Perubahan Hirarki Visual
* **Mobile Mode (`< lg`):** Kartu Autentikasi diprioritaskan tampil di urutan pertama (atas), diikuti oleh Hero Text dan *bullet points* di urutan kedua (bawah).
* **Desktop Mode (`>= lg`):** Tata letak kembali ke format *Split-Screen* standar (Hero Text di kiri, Kartu Autentikasi di kanan).

### B. Implementasi Tailwind Utilities
* Gunakan *utility* `order-1` dan `order-2` yang dipadukan dengan *breakpoint* `lg:order-1` dan `lg:order-2` pada masing-masing kolom di dalam *grid container*.
* Kurangi sedikit ukuran *font* pada Hero Text khusus di perangkat mobile (misalnya menggunakan `text-3xl` untuk layar kecil, dan `lg:text-5xl` untuk layar besar) agar ruang layar lebih efisien.
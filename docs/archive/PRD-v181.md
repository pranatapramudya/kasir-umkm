# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.81
**Fokus:** Image Optimization & Next.js Image Component Audit

## 1. Analisis Performa
Aplikasi B2B *High-Traffic* membutuhkan pemuatan halaman yang instan. Penggunaan tag gambar HTML konvensional (`<img>`) akan membebani *bandwidth* klien dan menyebabkan *layout shift*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit pada seluruh file komponen, terutama `app/page.tsx` (Landing Page). DILARANG memberikan *output* kode mentah panjang.

### A. Migrasi ke Next/Image
*   **Target File:** Seluruh file yang memuat aset visual/gambar.
*   **Instruksi:** 
    1. Periksa apakah ada penggunaan tag HTML statis `<img>`.
    2. Jika ada, segera ubah dan impor komponen `<Image>` dari `next/image`.
    3. Pastikan setiap komponen `<Image>` memiliki properti `alt` yang jelas (SEO), serta properti `width` dan `height` (atau menggunakan `fill` dengan kelas *wrapper* relatif) untuk mencegah *Cumulative Layout Shift* (CLS).
    4. Properti `priority` harus ditambahkan khusus untuk logo utama atau gambar di bagian atas (*Above the fold*) agar di-*load* instan tanpa *lazy-loading*.

Silakan eksekusi audit dan migrasi gambar ini agar Landing Page kita memiliki skor kecepatan (*Lighthouse*) yang maksimal!
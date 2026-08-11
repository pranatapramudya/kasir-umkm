# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.99
**Fokus:** Implementasi Mini Chart (Sparkline) pada Kartu Mockup Landing Page

## 1. Objektif Fitur
Menambahkan elemen visual berupa grafik garis/area berukuran kecil (*Sparkline/Mini Area Chart*) ke dalam komponen kartu "Total Pendapatan" pada *Landing Page* (beranda publik). Visual ini murni untuk estetika (menggunakan *dummy data*) agar *landing page* terlihat lebih dinamis, modern, dan menggambarkan fitur analitik secara visual.

## 2. Instruksi Eksekusi Mutlak untuk Agent (Hanya UI, Tanpa Merusak Backend)

### A. Instalasi Library Chart
Jika proyek belum memiliki *library* grafik, instal `recharts` melalui terminal (`npm install recharts` atau `pnpm add recharts`). Ini adalah *library* paling optimal dan reaktif untuk Next.js/React.

### B. Modifikasi Komponen Mockup Landing Page
1. Buka file yang me-render *mockup* visual kartu di halaman beranda (contoh: `app/page.tsx`, `components/Hero.tsx`, atau komponen spesifik yang menampilkan kartu "Total Pendapatan Rp 14.500.000").
2. Buat sebuah konstanta *dummy data* untuk grafik. Contoh:
   `const revenueData = [{ value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 700 }]`
3. Impor komponen `ResponsiveContainer`, `AreaChart`, dan `Area` dari `recharts`.
4. **Desain & Peletakan (Styling):**
   * Sisipkan `<ResponsiveContainer>` dengan tinggi sekitar `60px` - `80px` di dalam kartu "Total Pendapatan" (bisa diletakkan di bawah angka pendapatan atau dijadikan *background* tipis di area bawah kartu).
   * Gunakan `<AreaChart>` tanpa elemen `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, maupun `<Tooltip>`. Tujuannya murni untuk estetika garis minimalis.
   * Atur warna `<Area>` menggunakan *brand color* utama (misal: warna biru terang atau gradasi linear) dengan *opacity* rendah pada bagian isi (*fill*) agar terlihat elegan dan menyatu dengan *background* putih/terang.
5. Pastikan komponen yang memuat `recharts` ini ditandai sebagai `'use client'` di baris paling atas karena *library* grafik membutuhkan eksekusi sisi klien.

## 3. Output yang Diharapkan
Terapkan injeksi grafik statis ini ke kartu *landing page*. Berikan konfirmasi singkat bahwa grafik telah berhasil di- *render* menggunakan *dummy data* untuk mempercantik UI beranda, tanpa mengubah logika bisnis *dashboard* utama.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.98
**Fokus:** Injeksi SEO Nasional (Next.js Metadata, Sitemap, & Open Graph)

## 1. Objektif
Mengoptimalkan *Search Engine Optimization* (SEO) pada aplikasi agar PJTECH Kasir UMKM dapat terindeks oleh Google secara nasional (seluruh Indonesia), bukan hanya di pencarian lokal. Target audiens adalah pelaku usaha F&B, Retail, dan Jasa yang mencari solusi POS/SaaS premium.

## 2. Instruksi Eksekusi Mutlak untuk Agent (Tanpa Merusak UI/Logika)

### A. Konfigurasi Root Metadata (`app/layout.tsx`)
1. Temukan atau buat *export* `metadata` dari tipe `Metadata` (dari `next`).
2. Tuliskan *copywriting* SEO yang kuat dan berstandar nasional:
   * **title:** Gunakan format dinamis (contoh: `template: '%s | PJTECH Kasir UMKM'`, `default: 'PJTECH Kasir UMKM - Aplikasi POS F&B, Retail & Jasa Terbaik'`).
   * **description:** Buat deskripsi yang menjual (contoh: "Tingkatkan omset bisnis UMKM Anda dengan PJTECH. Aplikasi kasir (POS) multi-bisnis terlengkap untuk restoran, toko kelontong, dan jasa. Pantau laba rugi secara real-time dari mana saja.").
   * **keywords:** Masukkan kata kunci bervolume tinggi (contoh: `['Aplikasi Kasir', 'POS UMKM', 'Kasir F&B', 'Kasir Retail', 'Aplikasi Salon', 'Software Kasir Indonesia', 'SaaS POS Terbaik']`).
   * **authors:** Set ke `[{ name: 'PJTECH' }]`.
3. **Open Graph (OG) & Twitter Cards:** Tambahkan konfigurasi `openGraph` agar saat link dibagikan di WhatsApp/Medsos, muncul *preview* gambar, judul, dan deskripsi yang elegan.

### B. Pembuatan file `robots.txt`
1. Buat file `app/robots.ts` atau `public/robots.txt`.
2. Izinkan (`Allow: /`) semua *crawler* (*User-Agent: \**) untuk merayapi halaman publik (*landing page*, fitur, harga).
3. Blokir (`Disallow: /admin`, `Disallow: /superadmin`, `Disallow: /onboarding`) agar Google tidak mencoba mengindeks halaman internal *dashboard* yang dilindungi kata sandi.

### C. Pembuatan file `sitemap.ts`
1. Buat file `app/sitemap.ts` untuk men- *generate* peta situs secara dinamis.
2. Masukkan rute-rute publik utama (Beranda `/`, Halaman Harga, Tentang Kami) dengan *priority* `1.0` untuk Beranda. Ini akan menuntun *bot* Google merayapi seluruh sudut halaman promosi aplikasi.

## 3. Output yang Diharapkan
Terapkan injeksi SEO ini pada file yang disebutkan. Berikan konfirmasi singkat bahwa Metadata, Robots.txt, dan Sitemap telah diatur untuk jangkauan nasional.
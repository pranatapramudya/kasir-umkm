# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.88
**Fokus:** High-Res Logo Replacement & PWA Cache Busting Force Update

## 1. Analisis Masalah
Klien baru saja mengunggah versi final dari logo aplikasi (High-Resolution Upscaled dengan 3D shadow effect). Karena nama file ikon utama (`icon-192x192.png` dan `icon-512x512.png`) tetap sama, kita harus melakukan *force update* pada *browser cache* pengguna menggunakan *query parameter* versi terbaru agar logo premium ini langsung muncul di semua perangkat (Android/iOS).

## 2. Instruksi Eksekusi (Asset Replacement & Manifest Versioning)
**Target File:** Folder `public/`, `public/manifest.json`, dan `app/layout.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Penggantian Aset Ikon Fisik:**
1. Pastikan Anda menggunakan aset gambar terbaru yang diberikan klien.
2. Timpa (replace) file `icon-192x192.png` dan `icon-512x512.png` di dalam folder `public/` dengan gambar logo versi High-Res terbaru ini. (Pastikan ukurannya sesuai dan berbentuk *square* sempurna).

**B. Force Update Cache di manifest.json:**
1. Buka file manifest PWA.
2. Ubah *query parameter* versi pada *array* icons menjadi `v=4` untuk mendobrak cache yang membandel.
   - `"src": "/icon-192x192.png?v=4"`
   - `"src": "/icon-512x512.png?v=4"`

**C. Force Update Cache di app/layout.tsx:**
1. Cari objek `metadata` di *root layout*.
2. Ubah juga parameter versi pada konfigurasi `icons` dan `apple` menjadi `v=4`:
   - `apple: '/icon-192x192.png?v=4'`
   - Arahkan ikon standar lainnya di metadata ke `?v=4`.

Silakan ganti aset fisiknya, ubah parameter *cache busting*, *commit*, dan langsung *push* ke Vercel agar logo High-Res terbaru ini segera mengudara!
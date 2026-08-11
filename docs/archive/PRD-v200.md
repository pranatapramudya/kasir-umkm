# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.00
**Fokus:** UI/UX Polish (Presisi Chart, Typo), dan Mitigasi Hydration Error Next.js

## 1. Objektif
Melakukan penyempurnaan antarmuka (*polishing*) pada *mockup* kartu di *Landing Page* agar elemen grafik (Sparkline) terpasang presisi, memperbaiki kesalahan ejaan (typo), dan menambahkan atribut mitigasi agar ekstensi *browser* pihak ketiga tidak memicu pesan peringatan *React Hydration Error* di *console/layar*.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Mitigasi React Hydration Error (Root Layout)
1. Buka file `app/layout.tsx`.
2. Tambahkan atribut `suppressHydrationWarning` pada tag `<html>` dan `<body>`. 
   *(Alasan: Ekstensi browser seperti Bitdefender sering menyuntikkan atribut `bis_skin_checked` secara otomatis, yang menyebabkan ketidakcocokan pohon DOM antara Server dan Klien pada Next.js).*

### B. Perbaikan Presisi Chart (Landing Page)
1. Buka komponen yang me-render grafik *recharts* di *Landing Page* (`app/page.tsx` atau komponen terkait).
2. Bungkus `<ResponsiveContainer>` milik grafik tersebut dengan sebuah elemen `<div>` pembungkus (wrapper).
3. Berikan *class Tailwind* pada *wrapper* tersebut agar grafik menempel presisi di bagian bawah kartu tanpa menimpa teks. Gunakan kombinasi: `absolute bottom-0 left-0 w-full overflow-hidden rounded-b-xl` (sesuaikan radius *rounded*-nya dengan radius kartu utama).
4. Tambahkan properti `margin={{ top: 0, right: 0, left: 0, bottom: 0 }}` langsung ke dalam komponen `<AreaChart>` agar tidak ada ruang kosong tersisa di dalam *canvas* SVG.

### C. Perbaikan Typo (Landing Page)
1. Pada file yang sama, cari teks statis `"STAF AKTIF"`.
2. Ubah teks tersebut menjadi `"STAFF AKTIF"`.

## 3. Output yang Diharapkan
Terapkan perbaikan kosmetik dan mitigasi error ini secara komprehensif. Berikan konfirmasi bahwa grafik sudah menempel rapi di bawah (tidak meluber), typo telah diperbaiki, dan tag HTML kebal terhadap injeksi *browser extension*.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.52
**Fokus:** UI/UX Native Feel - Mengunci Viewport & Mencegah Pinch-to-Zoom

## 1. Analisis Masalah
Saat aplikasi diakses melalui perangkat *mobile* (browser HP atau di- *install* sebagai PWA/APK wrapper), layar antarmuka masih bisa di- *zoom* (pinch-to-zoom). Hal ini mengurangi kesan profesional dan membuat aplikasi terasa seperti "halaman web biasa" alih-alih aplikasi *Native*. 
Untuk mencapai *Native App Feel*, kita harus membatasi skalabilitas layar secara global.

## 2. Instruksi Eksekusi (Viewport Configuration)
**Target File:** File konfigurasi *layout* utama Next.js Anda (biasanya `app/layout.tsx` atau `src/app/layout.tsx` jika menggunakan App Router).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kunci Viewport Meta Tag:**
1. Buka file *layout* utama Anda.
2. Cari konfigurasi `viewport` (di Next.js 14+ biasanya diekspor sebagai konstanta `viewport` terpisah dari `metadata`, atau digenerate melalui `generateViewport`).
3. Tambahkan atau perbarui properti berikut di dalam konfigurasi *viewport* tersebut:
   - Pastikan *width* diatur ke *device-width*.
   - Atur *initial scale* menjadi 1.
   - **Kunci Skala:** Atur *maximum scale* menjadi 1.
   - **Nonaktifkan Skalabilitas User:** Atur `userScalable` menjadi `false` (atau `0`).

**B. Pengamanan Ekstra (CSS Touch Action - Opsional namun disarankan):**
1. Buka file global CSS Anda (misal: `globals.css`).
2. Pastikan elemen `html` dan `body` memiliki properti yang mencegah *overscroll* atau pantulan efek *zoom* ganda dengan menambahkan sintaks `touch-action: pan-x pan-y;` atau menggunakan utilitas Tailwind yang sesuai jika diperlukan untuk mengunci manipulasi *zoom* berbasis sentuhan ganda.

Silakan eksekusi penguncian layar ini! Lapor kembali jika konfigurasi *viewport* sudah diterapkan sehingga saat diakses via HP, layar aplikasi terkunci solid seperti aplikasi *Native*!
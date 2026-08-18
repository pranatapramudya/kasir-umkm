# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.43
**Fokus:** Bug Fix - Kertas Cetak Jasa/F&B/Retail Masih Berukuran A4 di Desktop

## 1. Analisis Masalah
Pada pengujian cetak Desktop (contoh menggunakan Microsoft Print to PDF), komponen struk untuk entitas `JASA` masih di- *render* menggunakan ukuran kertas A4. Hal ini terjadi karena injeksi CSS `@page` secara kondisional di PRD sebelumnya kemungkinan tidak terbaca oleh *browser* saat *print dialog* dipicu, atau logika kondisionalnya terlewat untuk entitas JASA.
Kita harus memaksa *browser* membaca aturan kertas Thermal 80mm dengan melakukan injeksi elemen `<style>` secara langsung di dalam DOM komponen struk itu sendiri.

## 2. Instruksi Eksekusi (Direct Style Injection & Hardcoded Width)
**Target File:** Komponen `Receipt.tsx` (Atau komponen yang merender UI Struk untuk Kasir Jasa, FNB, dan Retail).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Hard-Injection CSS Print Media:**
1. Buka komponen `Receipt.tsx` (yang menangani struk Jasa, FNB, Retail).
2. Tepat di dalam *return statement* (di atas *wrapper* utama struk), tambahkan elemen `<style>` HTML standar.
3. Isi elemen `<style>` tersebut dengan raw CSS berikut:
   `@media print { @page { size: 80mm 297mm; margin: 0; } body { -webkit-print-color-adjust: exact; } }`
   *(Catatan: Menggunakan tinggi spesifik seperti 297mm atau `auto` memastikan printer PDF di desktop memahami batasan kanvas).*
4. Pastikan elemen `<style>` ini **HANYA** di- *render* jika `businessType` adalah `JASA`, `FNB`, atau `RETAIL`. (Jika Rental, jangan panggil komponen ini atau jangan jalankan style ini).

**B. Penguncian Container Struk:**
1. Pastikan *div wrapper* paling luar dari struk thermal Anda benar-benar terkunci ukurannya, bukan sekadar `w-full`.
2. Gunakan *utility class* Tailwind seperti `w-[80mm] max-w-[80mm] mx-auto overflow-hidden` pada kontainer struk. 
3. Hal ini akan memaksa konten tidak melebar ke ukuran A4 meskipun printer gagal membaca ukuran kertas, sehingga hasilnya akan tetap rata kiri dengan ukuran 80mm di dalam preview print.

Silakan eksekusi perbaikan "brutal" ini! Lapor kembali jika Anda sudah melakukan *test print dialog* di Desktop dan ukuran kertas pada *Preview* secara otomatis menyusut menjadi panjang & sempit khas struk kasir!
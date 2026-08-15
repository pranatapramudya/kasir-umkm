# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.58
**Fokus:** Dinamisasi & Sinkronisasi Navigasi Mobile dan Desktop (Single Source of Truth)

## 1. Analisis Masalah
Terjadi inkonsistensi jumlah menu antara Sidebar Desktop (9 menu) dan Bottom Navigation Mobile (8 menu). Menu "Manajemen Meja" hilang pada tampilan mobile. Akar masalahnya adalah penggunaan *hardcoded array* atau konfigurasi yang terpisah antara komponen navigasi Desktop dan Mobile.

## 2. Instruksi Eksekusi (Frontend Architecture)
**Target File:** Komponen Navigasi (misal: `Sidebar.tsx`, `BottomNav.tsx`, atau file konfigurasi `menuConfig.ts`).

**A. Buat *Single Source of Truth* (SSOT) untuk Navigasi:**
1. Jangan definisikan *array* menu dua kali (di Desktop dan Mobile secara terpisah).
2. Buat satu konfigurasi pusat (contoh: `const NAVIGATION_MENU = [...]`) yang berisi seluruh definisi menu, ikon, URL rute, dan aturan bisnisnya (misal: `showOn: ['FNB']` atau `role: ['OWNER', 'CASHIER']`).

**B. Perbaikan Rendering Mobile Nav:**
1. Impor konfigurasi pusat tersebut ke dalam komponen Bottom Nav / Modal "Lainnya" (`image_612f1d.png`).
2. **Logika Pemisahan Mobile:**
   - Ambil 4 menu pertama yang relevan dengan tipe bisnis dan *role* yang sedang *login* untuk ditampilkan di bilah bawah (Bottom Navigation).
   - Masukkan *SISA MENU* (semua menu yang belum ditampilkan di bilah bawah, termasuk "Manajemen Meja") ke dalam modal popup "Lainnya".
3. Pastikan total menu yang di-*render* (Bilah Bawah + Modal) sama persis 100% dengan total menu yang di-*render* pada Sidebar Desktop untuk peran dan tipe bisnis yang sama.

Silakan refaktor struktur navigasi ini agar terpusat. Pastikan menu "Manajemen Meja" muncul kembali di perangkat Mobile untuk bisnis F&B, dan pastikan logika ini otomatis menyesuaikan untuk bisnis Retail, Jasa, maupun Rental tanpa perlu *hardcode* ulang!
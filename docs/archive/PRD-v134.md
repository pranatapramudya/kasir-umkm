# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.34
**Fokus:** Landing Page Copywriting (Multi-Bisnis) & Global Button Gradient Fix

## 1. Analisis UI/UX
*   **Copywriting Landing Page:** Teks *bullet point* di halaman utama/login saat ini terlalu generik. Sebagai *SaaS Multi-Vertical*, sistem harus secara eksplisit menyebutkan dukungannya terhadap bisnis Retail, F&B, dan Jasa/Servis agar target pasar langsung memahaminya.
*   **Tombol Menu In-App (Solid Blue):** Tombol-tombol di dalam menu *dashboard* masih menggunakan warna biru solid yang menyebabkan mata lelah. Perintah gradasi sebelumnya gagal diterapkan secara menyeluruh.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pembaruan UI secara global. DILARANG memberikan *output* kode mentah.

### A. Update Copywriting Halaman Utama/Login
*   **Target File:** `app/page.tsx` (atau file *layout* halaman login yang sesuai).
*   **Instruksi:** Ubah daftar *bullet point* fitur di bawah teks "Tinggalkan cara manual..." menjadi *copywriting* berorientasi bisnis berikut:
    1. `Fleksibel untuk UMKM Retail, F&B (Kafe/Resto), & Jasa / Servis`
    2. `Fitur Adaptif: Manajemen Meja, Barcode Stok, & Pencatatan Layanan`
    3. `Arsitektur Multi-tenant Terisolasi (Aman untuk Multi-Cabang)`
    4. `Laporan Keuangan & Tren Penjualan Real-time Akurat`

### B. Implementasi Global Button Gradient
*   **Target File:** 
    - Jika menggunakan komponen modular (misal: `shadcn/ui`), edit file `components/ui/button.tsx` pada varian `default`.
    - Jika tidak, lakukan pencarian global untuk *class* `bg-blue-600` pada semua tombol aksi (*submit*, tambah data, simpan) di dalam rute `app/admin/...`.
*   **Instruksi Tailwind:**
    1. Ganti semua *background* biru solid dengan *class* berikut agar seragam dan *soft* di mata:
       `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out`
    2. Pastikan perubahan ini teraplikasi pada tombol di menu Manajemen Produk, Kasir POS, dan Laporan Analitik.

Silakan eksekusi kedua pembaruan UI ini sekarang juga untuk meningkatkan daya tarik marketing dan kenyamanan visual pengguna!
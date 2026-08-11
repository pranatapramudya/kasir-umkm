# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.30
**Fokus:** Eksekusi UI/UX, Skema Database Multi-Bisnis, & Feature Toggling (Buka-Tutup Modul)

## 1. Persetujuan Fase 1 (UI & Dashboard)
> **APPROVED.** Silakan eksekusi perubahan Global UI Gradient pada tombol dan integrasi Recharts untuk Tren Penjualan di Dashboard (pastikan *Tenant Scoping* berjalan sempurna).

## 2. Analisis & Strategi "Pintu by Pintu" (Modul Dinamis)
*   **Visi Produk:** Kasir POS ini tidak boleh terlihat rumit. Fitur F&B tidak boleh muncul di akun Retail, dan sebaliknya. 
*   **Solusi Logika:** Kita akan menggunakan field `kategoriUsaha` (yang dipilih *user* saat *onboarding*) sebagai kunci (*Feature Toggle*). Menu di Sidebar dan fitur di halaman Kasir (POS) harus di-render secara kondisional (*Conditional Rendering*) berdasarkan kategori ini.

## 3. Instruksi Eksekusi Skema Database & Modul
Lakukan perombakan pada Prisma Schema dan Logika Klien. DILARANG memberikan *output* kode mentah.

### A. Upgrade Prisma Schema (Persiapan Fundamental)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi:** Tambahkan *field* yang direkomendasikan dari hasil audit Anda agar sistem siap menampung ketiga bisnis (fokus selesaikan fundamental Retail, dan siapkan jalur F&B/Jasa):
    1. Tambahkan `minStockThreshold Int @default(5)` pada model `Product` (Untuk fitur peringatan stok Retail).
    2. Tambahkan `isService Boolean @default(false)` pada model `Product` (Untuk membedakan barang fisik dan jasa/servis agar stok tidak berkurang).
    3. Tambahkan `tableNumber String?` pada model `Transaction` (Untuk persiapan fitur F&B).
    4. Jalankan perintah `npx prisma db push` atau `npx prisma migrate dev` setelah selesai.

### B. Implementasi Feature Toggling (Sidebar)
*   **Target File:** `components/SidebarClient.tsx` (atau komponen navigasi Anda).
*   **Instruksi:**
    1. Ambil data profil/tenant pengguna saat ini, khususnya field `kategoriUsaha`.
    2. Buat logika *Conditional Rendering* pada daftar menu.
       - **Jika Kategori == 'Jasa / Servis':** Sembunyikan menu "Produk" (ubah namanya menjadi "Layanan"), dan sembunyikan menu/peringatan "Stok Habis".
       - **Jika Kategori == 'F&B / Kuliner':** Munculkan opsi tambahan (persiapan) untuk "Manajemen Meja" atau ubah layout Kasir agar mendukung input Nomor Meja.
       - **Jika Kategori == 'Retail':** Tampilkan layar Kasir POS standar dengan fokus pada Barcode Scanner dan peringatan batas stok (`minStockThreshold`).

### C. Penyesuaian Logika Kasir POS (Checkout)
*   **Target File:** API Checkout atau Server Action Transaksi.
*   **Instruksi:** Saat proses kalkulasi transaksi/pengurangan stok, berikan kondisi:
    `if (!product.isService) { kurangi stok database }`. 
    Ini memastikan jika *user* kategori Jasa menjual produk "Pangkas Rambut" (dimana `isService = true`), sistem tidak akan mencoba mengurangi stok fisik yang nilainya 0.

Silakan eksekusi Fase 1 (UI Gradient & Grafik Dasbor) terlebih dahulu, kemudian lanjutkan dengan Fase 2 (Update Prisma & Feature Toggling Kategori) ini secara berurutan!
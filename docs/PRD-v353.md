# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.53
**Fokus:** Bug Fix - Kebocoran Menu "Pesanan Online" di Sidebar (Strict Isolation)

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada komponen navigasi utama (*Sidebar*), menu **"Pesanan Online"** saat ini muncul secara global untuk semua jenis bisnis, termasuk `RETAIL` dan `FNB`. 
Sistem pemesanan/reservasi online di aplikasi ini dirancang eksklusif hanya untuk entitas bisnis `JASA` (seperti Salon/Klinik/Barbershop yang membutuhkan manajemen antrean). Kehadiran menu ini di bisnis F&B dan Retail menyebabkan kebingungan fungsional (*UX Clutter*).

## 2. Instruksi Eksekusi (Strict Menu Filtering)
**Target File:** Komponen Navigasi Sidebar (contoh: `SidebarClient.tsx`, `Sidebar.tsx`, atau file konfigurasi `menuItems`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Isolasi Logika Menu Sidebar:**
1. Buka komponen yang bertugas me- *render* daftar menu di *Sidebar* bagian "MENU UTAMA".
2. Cari objek atau blok kode yang menampilkan menu **"Pesanan Online"** (biasanya berada setelah "Laporan Shift" atau "Kasir POS").
3. Terapkan logika kondisional (*conditional rendering* atau *array filtering*):
   - Menu **"Pesanan Online" HANYA BOLEH DI-RENDER** jika pengguna yang sedang *login* memiliki `businessType === 'JASA'`.
   - Pastikan menu ini hilang sepenuhnya (tidak dirender sama sekali) jika `businessType` adalah `FNB`, `RETAIL`, atau `RENTAL`.

**B. Verifikasi Integritas Menu Lainnya:**
1. Sembari memperbaiki ini, pastikan menu spesifik lainnya tidak bocor. 
2. Contoh: Pastikan menu **"Manajemen Meja"** (jika ada) hanya muncul untuk `FNB`, dan **"Jadwal Booking"** / **"Kalender Sewa"** hanya muncul untuk `RENTAL`.

Silakan bersihkan *sidebar* ini! Lapor kembali jika menu "Pesanan Online" sudah musnah dari pandangan bos F&B dan Retail!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.33
**Fokus:** Bugfix Sinkronisasi Menu Mobile & Desktop (Role Karyawan) + Isolasi Kategori

## 1. Objektif
Menyamakan jumlah dan jenis menu yang dapat diakses oleh Karyawan (Kasir) di perangkat Mobile (Bottom Navigation) dengan versi PC (Sidebar). Karyawan harus memiliki 3 menu utama: Dashboard, Kasir, dan Laporan Shift di semua perangkat. Selain itu, penamaan menu harus dinamis menyesuaikan 4 kategori bisnis tanpa ada kebocoran akses ke menu Owner.

## 2. Analisis Masalah
Berdasarkan tinjauan UI, `components/SidebarClient.tsx` (versi PC) merender 3 menu untuk Karyawan: Dashboard, Kasir (dinamis), dan Laporan Shift. Namun, `components/BottomNavClient.tsx` (versi Mobile) hanya merender 2 menu: Kasir dan Laporan. Terdapat inkonsistensi *array mapping* antar perangkat.

## 3. Eksekusi Perbaikan (Frontend & Security)
**Target File:** `components/BottomNavClient.tsx` (dan verifikasi silang dengan `components/SidebarClient.tsx`).
**Instruksi Eksekusi:**

1. **Sinkronisasi Array Menu Karyawan:**
   - Tambahkan menu "Dashboard" ke dalam array navigasi khusus `isEmployee` (Karyawan) di `BottomNavClient.tsx`.
   - Gunakan ikon yang konsisten dengan versi Desktop (misal: `LayoutDashboard` atau `Home` dari Lucide React).
   - Pastikan URL `/admin/dashboard` (atau rute root admin yang sesuai) dipetakan dengan benar.

2. **Dinamisasi Nama Menu (Isolasi 4 Kategori Bisnis):**
   - Pastikan logika penamaan menu di Bottom Nav persis sama dengan Sidebar. 
   - Gunakan `tenantCategory` untuk mengecek:
     - JIKA `isRentalTravelCategory(tenantCategory)` ➔ Label menu: "Kasir Rental".
     - JIKA `isServiceBusinessCategory(tenantCategory)` ➔ Label menu: "Kasir Servis" (atau biarkan Kasir POS jika default).
     - DEFAULT (Retail/F&B) ➔ Label menu: "Kasir POS".
   - Terapkan logika yang sama untuk menu Laporan jika diperlukan (misal: "Laporan Shift").

3. **Verifikasi Keamanan (Zero Leakage):**
   - Pastikan array menu Karyawan TIDAK memuat rute milik Owner (seperti `/admin/karyawan`, `/admin/settings`, `/admin/armada`, dll).
   - Validasi bahwa rendering `BottomNavClient` membungkus menu secara ketat di dalam percabangan `if (!isOwner)` atau variabel array yang sudah difilter berdasarkan role.

Silakan update komponen `BottomNavClient.tsx` sekarang juga. Pastikan UI Bottom Nav di layar mobile berubah menjadi 3 pilar icon yang presisi dan rapi.
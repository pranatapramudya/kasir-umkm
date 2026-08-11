# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.88
**Fokus:** Perbaikan UI Sidebar RBAC & Inheritansi Status Langganan Toko

## 1. Deskripsi Bug
Saat pengguna dengan role `CASHIER` (Karyawan) login:
1. **Bug Sidebar:** Mereka dapat melihat seluruh menu navigasi (termasuk Manajemen Bisnis, Produk, Analitik, Pengaturan), yang seharusnya disembunyikan. Karyawan hanya boleh melihat grup "Menu Utama" (Dashboard, Kasir POS, Laporan Shift).
2. **Bug Langganan (Spanduk Merah):** Muncul peringatan bahwa paket berlangganan telah berakhir. Hal ini terjadi karena utilitas/fungsi pengecekan langganan memvalidasi berdasarkan `userId` (milik karyawan), bukan berdasarkan status langganan `storeId` atau pemilik toko sebenarnya.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Perbaikan Komponen Sidebar
1. Buka komponen yang merender menu navigasi kiri (contoh: `components/Sidebar.tsx` atau `components/MainNav.tsx`).
2. Dapatkan *role* pengguna saat ini (dari Clerk `sessionClaims` atau *props*).
3. Filter *array* atau rute menu yang di-*render*. 
4. **Logika Filter:** Jika `role === 'CASHIER'`, HANYA *render* menu "Dashboard", "Kasir POS", dan "Laporan Shift". Sembunyikan semua menu "Manajemen Bisnis" dan "Sistem & Laporan" dari UI.

### B. Perbaikan Logika Pengecekan Langganan (Subscription)
1. Temukan utilitas atau *hook* yang memeriksa status langganan (contoh: `lib/subscription.ts`, `checkSubscription()`, atau logika di dalam `layout.tsx` / komponen *Banner*).
2. **Ubah Logika Query Prisma:** Jangan menggunakan `where: { userId: currentUserId }` jika pengguna adalah Karyawan. 
3. **Solusi yang Benar:** Pengecekan langganan harus merujuk pada `storeId` yang sedang aktif. 
   * Cari toko berdasarkan `storeId` dari parameter URL.
   * Cek langganan menggunakan `userId` pemilik toko tersebut (`store.userId`), ATAU ubah relasi tabel `Subscription` agar terikat langsung pada `storeId`.
4. Pastikan spanduk merah hanya muncul jika paket toko bosnya benar-benar habis, bukan karena karyawan tidak memiliki paket.

## 3. Output yang Diharapkan
Terapkan kedua perbaikan tersebut langsung ke dalam *codebase*. Konfirmasi jika filter *Sidebar* sudah diaktifkan dan logika langganan sudah diperbaiki agar *inherit* (mewarisi) status VIP/PRO dari pemilik toko.
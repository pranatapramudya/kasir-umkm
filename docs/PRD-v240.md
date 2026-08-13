# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.40
**Fokus:** Isolasi Menu "Informasi Toko" & Penghapusan Redundansi Profil Clerk

## 1. Objektif
1. Menyembunyikan menu "Informasi Toko" (sebelumnya Pengaturan) secara penuh dari pandangan Tenant kategori F&B dan Retail. Menu ini EKSKLUSIF hanya boleh muncul di Sidebar/Bottom Nav untuk bisnis "Jasa & Servis" dan "Rental & Travel".
2. Menghapus komponen pengaturan akun bawaan (redundansi) dari dalam halaman "Informasi Toko", karena pengaturan akun sudah dikendalikan penuh oleh komponen bawaan `<UserProfile>` (atau tombol profil) dari Clerk. Halaman "Informasi Toko" difokuskan murni untuk manajemen Slug / Link Booking Publik.

## 2. Isolasi Visibilitas Menu (Sidebar & Bottom Nav)
**Target File:** `components/SidebarClient.tsx` (dan `BottomNavClient.tsx` jika menu ini ada di sana).
**Instruksi Eksekusi:**
1. Cari array navigasi untuk Owner/Superadmin (biasanya menu di bawah label "Sistem & Laporan" atau "Lainnya").
2. Temukan item navigasi "Informasi Toko" (URL: `/admin/settings` atau `/admin/informasi-toko`).
3. Bungkus atau filter (`.filter()`) item navigasi tersebut dengan validasi ketat:
   - JIKA `tenantCategory === 'JASA'` ATAU `tenantCategory === 'RENTAL'` ➔ Menu dirender.
   - JIKA `tenantCategory === 'FNB'` ATAU `tenantCategory === 'RETAIL'` ➔ Menu TIDAK dirender (hilang).

## 3. Pembersihan Halaman Informasi Toko (Hapus Profil Duplikat)
**Target File:** Halaman utama Informasi Toko (`app/admin/settings/page.tsx` atau sejenisnya).
**Instruksi Eksekusi:**
1. Buka file halaman tersebut.
2. Temukan bagian UI "PROFIL & KEAMANAN AKUN" yang merender pengaturan akun manual (seperti yang terlihat pada gambar `image_7b6e1b.png`).
3. HAPUS SELURUH blok kode yang menangani profil dan keamanan akun manual tersebut (termasuk komponen form, jika ada).
4. Sisakan HANYA blok "Informasi Toko" yang bertugas mengelola "Slug Toko" dan "Link Booking Publik Toko".
5. Pastikan halaman tetap terlihat rapi dan proporsional setelah penghapusan komponen profil.

Silakan lakukan pembersihan UI ini sekarang juga untuk menjaga pengalaman pengguna yang clean dan fungsional sesuai kebutuhan per kategori bisnis.
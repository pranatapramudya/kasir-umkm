# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.94
**Fokus:** Bug Fix 404 Not Found - Pemulihan Link Kasir Rental

## 1. Analisis Masalah
Terjadi *error 404 (Not Found)* saat pengguna menekan menu "Kasir Rental" di Sidebar. Ini diakibatkan oleh instruksi sebelumnya yang memaksa pengubahan *href* ke `/admin/rental-pos` yang ternyata eksistensinya tidak ada di struktur direktori. 
Selain itu, aturan *landing page* pasca-login harus TETAP terkunci ke Dashboard utama (`/admin`).

## 2. Instruksi Eksekusi (Sidebar Navigation Revert)
**Target File:** Komponen navigasi Sidebar (misal: `lib/navigation.ts`, `Sidebar.tsx`, atau file definisi menu navigasi).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kembalikan Path Kasir ke Rute Asli:**
1. Cek struktur folder di dalam `app/admin/`. Cari tahu di mana letak persis halaman utama Kasir (kemungkinan besar berada di `app/admin/pos/page.tsx`).
2. Buka file konfigurasi menu Sidebar Anda.
3. Ubah kembali nilai `href` untuk menu "Kasir Rental" (dan menu kasir lainnya) agar menunjuk ke rute Kasir yang benar dan **eksisting** (misalnya menjadi `href: "/admin/pos"`). 

**B. Jangan Sentuh Aturan Landing Page:**
1. Biarkan aturan *redirect* autentikasi tetap mendarat secara absolut di `/admin` (Dashboard). Jangan diubah! 
2. Perbaikan ini murni hanya memperbaiki tujuan (*href*) dari tombol di Sidebar agar tidak mengarah ke halaman kosong (404).

Silakan perbaiki *typo path* navigasi ini agar tombol Kasir Rental hidup dan berfungsi normal kembali! Lapor jika sudah dieksekusi.
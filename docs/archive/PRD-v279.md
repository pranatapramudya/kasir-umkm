# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.79
**Fokus:** Bug Fix Mobile Bottom Navigation Dinamis & Routing Landing Page

## 1. Analisis Masalah (UI Inconsistency & Routing)
Terdapat *bug* pada antarmuka *mobile*. Komponen *Bottom Navigation* tidak tersinkronisasi secara global. Pada halaman tertentu (seperti `/admin/pos`), navigasi bawah malah menampilkan menu "Produk" dan "Kasir POS" (layout Retail/F&B), padahal toko yang sedang aktif adalah tipe "Jasa" yang seharusnya menampilkan "Kasir Jasa" dan "Jadwal Booking". 
Selain itu, *flow* pengguna saat pertama kali login untuk tipe bisnis Jasa/Rental harus diarahkan secara absolut ke Dashboard (`/admin`), bukan ke halaman Kasir.

## 2. Instruksi Eksekusi (Frontend & Routing)
**Target File:** Komponen Global `BottomNav.tsx` (atau sejenisnya), Layout Utama Admin (`app/admin/layout.tsx`), dan konfigurasi Auth Redirect (Clerk middleware / halaman login).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Refaktor Bottom Navigation Mobile (Global & Dinamis):**
1. Pastikan aplikasi hanya menggunakan **satu** komponen `BottomNav` yang dirender di dalam `layout.tsx` (global), jangan dirender berulang-ulang di setiap halaman (`page.tsx`).
2. Buat logika kondisional yang membaca `store.type` (tipe bisnis). 
   - **Jika Retail/F&B:** Menu yang muncul adalah `Dashboard, Kasir POS, Laporan Shift, Produk, Lainnya`.
   - **Jika Jasa/Rental:** Menu yang muncul HARUS `Dashboard, Kasir Jasa, Laporan Shift, Jadwal Booking, Lainnya`.
3. Pastikan *state* ikon yang sedang aktif (ikon membesar dengan lingkaran biru) tersinkronisasi dengan URL (`pathname`) saat ini, apa pun halaman yang sedang dibuka.

**B. Perbaikan Initial Landing Page (Redirect Setelah Login):**
1. Cek logika pasca-autentikasi (Clerk `afterSignInUrl` atau logika *redirect* di dalam komponen *Onboarding/Login*).
2. Terapkan aturan kondisional: Setelah pengguna berhasil *login* dan memilih toko, jika toko tersebut bertipe **Jasa** atau **Rental**, paksa *redirect* (`router.push`) ke halaman `https://www.pjtechumkm.com/admin` (Dashboard Utama).
3. Pastikan tidak ada *fallback* yang melempar pengguna Jasa/Rental ke `/admin/pos` saat pertama kali masuk.

Silakan perbaiki inkonsistensi UI dan *routing* ini sekarang juga agar *user experience* (UX) terasa seperti aplikasi *Enterprise* yang matang!
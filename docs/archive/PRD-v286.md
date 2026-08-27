# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.86
**Fokus:** Universal Post-Login Routing (Absolut ke Dashboard /admin)

## 1. Analisis Masalah (Inkonsistensi Landing Page)
Pada instruksi sebelumnya, terdapat logika *split-routing* di mana bisnis tipe tertentu diarahkan ke `/admin` dan yang lainnya diarahkan ke `/admin/pos` setelah *login* atau mendaftar. Hal ini menyebabkan kebingungan alur (UX). Klien meminta agar **semua pengguna tanpa terkecuali** (baik *Owner* maupun Karyawan, dari tipe bisnis apa pun) wajib mendarat di satu tautan yang sama setelah autentikasi.

## 2. Instruksi Eksekusi (Auth Redirect & Middleware Cleanup)
**Target File:** Konfigurasi autentikasi (misal: Clerk Provider `afterSignInUrl` & `afterSignUpUrl`), file Middleware (`middleware.ts`), dan/atau halaman *callback/onboarding*.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Hapus Logika Conditional Routing Pasca-Login:**
1. Cari sistem *redirect* yang memisahkan navigasi awal berdasarkan `store.category` (yang dibuat pada PRD sebelumnya).
2. Hapus logika *redirect* spesifik ke halaman `/admin/pos` atau rute kasir lainnya saat proses *login/onboarding* baru saja selesai.

**B. Terapkan Universal Absolute Routing:**
1. Atur konfigurasi URL pendaratan (Landing URL) pasca-autentikasi (baik *Sign In* maupun *Sign Up*) agar menunjuk secara absolut dan universal ke: `https://www.pjtechumkm.com/admin` (atau path `/admin` secara internal).
2. Pastikan aturan ini berlaku global untuk semua peran (Role) pengguna, baik entitas pemilik bisnis (*Owner*) maupun staf/karyawan. Semua harus melihat halaman Dashboard/Ringkasan Bisnis terlebih dahulu saat pertama kali masuk ke aplikasi.

Silakan bersihkan logika *routing* sebelumnya dan kunci rute pendaratannya ke `/admin` secara universal! Lapor jika pembaruan ini sudah di-*push*!
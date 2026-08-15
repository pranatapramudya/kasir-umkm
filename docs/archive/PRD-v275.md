# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.75
**Fokus:** Hardening Autentikasi (Anti-Hijacking, HttpOnly Cookies, & Persiapan MFA)

## 1. Analisis Masalah (Human Vulnerability)
Sistem telah terlindungi dari serangan *backend* (SQLi, DDoS, Data Leakage). Namun, pengguna UMKM sangat rentan terhadap serangan *Phishing* dan *Malware/Session Hijacking* di perangkat keras mereka sendiri. Aplikasi membutuhkan kebijakan *Session Management* yang ketat untuk meminimalisir dampak jika perangkat pengguna terkompromi.

## 2. Instruksi Eksekusi (Auth & Session Security)
**Target File:** Konfigurasi *Authentication* (Clerk / Next-Auth / Supabase Auth) dan Edge Middleware.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE KEPADA SAYA):**

**A. Penguncian Session Cookies (Anti-Malware/XSS):**
1. Pastikan seluruh *cookies* sesi otentikasi dikonfigurasi secara absolut dengan atribut:
   - `HttpOnly: true` (Mencegah *javascript client-side* atau ekstensi *browser* jahat membaca *token*).
   - `Secure: true` (Hanya ditransmisikan via HTTPS).
   - `SameSite: 'Lax'` atau `'Strict'` (Melindungi dari serangan CSRF).

**B. Kebijakan Session Expiration (Batas Waktu Login):**
1. Ubah konfigurasi *session maxAge* / waktu kedaluwarsa token.
2. Set agar sesi login kasir/karyawan otomatis *expired* (kedaluwarsa) dalam waktu **maksimal 24 jam** sejak aktivitas terakhir. Jangan biarkan *session* hidup selamanya (seperti 30 hari) untuk aplikasi Point of Sale, guna mencegah penyalahgunaan jika perangkat kasir ditinggalkan menyala.

**C. Persiapan Multi-Factor Authentication (Anti-Phishing):**
1. Jika Anda menggunakan penyedia otentikasi seperti Clerk atau Supabase Auth, aktifkan kapabilitas fitur **MFA (Multi-Factor Authentication)** (seperti TOTP Authenticator atau Email/SMS OTP) di *dashboard* otentikasi tersebut.
2. Siapkan halaman atau komponen UI di pengaturan profil agar *Owner* (Pemilik Toko) nantinya dapat mengaktifkan perlindungan 2 Langkah ini.

Silakan perketat lapisan otentikasi ini sekarang juga! Lapor jika *cookies* sudah diamankan dan konfigurasi *session* sudah diatur!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.76
**Fokus:** Custom Inactivity Timeout (Bypass Clerk Pro Paywall)

## 1. Analisis Masalah
Fitur *Inactivity Timeout* bawaan Clerk ternyata terkunci di balik paket berlangganan (Pro). Untuk menjaga status aplikasi sebagai *low-cost SaaS boilerplate*, kita tidak akan melakukan *upgrade*. Sebagai gantinya, kita akan membangun mekanisme *Auto-Logout* berbasis *frontend* (Client-Side) yang secara mandiri memantau aktivitas pengguna dan memaksa sesi berhenti jika melebihi batas waktu 24 jam tanpa aktivitas.

## 2. Instruksi Eksekusi (Client-Side Auth Wrapper)
**Target File:** Buat atau modifikasi komponen *wrapper* global di klien, misalnya `components/SessionTimeoutGuard.tsx` (lalu pasang di `app/layout.tsx` khusus untuk rute terproteksi/admin).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE KEPADA SAYA):**

1. **Pembuatan Hook/Komponen Pemantau Aktivitas:**
   - Gunakan `useAuth` atau `useClerk` dari `@clerk/nextjs` untuk mendapatkan fungsi `signOut()`.
   - Gunakan `useEffect` untuk memasang *Event Listeners* global pada `mousemove`, `keydown`, `click`, dan `scroll`.
   - Setiap kali *event* tersebut memicu, perbarui nilai *timestamp* di `localStorage` (misal: `localStorage.setItem('lastActivity', Date.now().toString())`).
   - Lakukan *throttling* (pembatasan) pada pembaruan *timestamp* ini (misal: hanya perbarui maksimal 1 kali setiap menit) agar tidak membebani performa *render* React.

2. **Logika Pengecekan Kedaluwarsa (24 Jam):**
   - Buat fungsi `setInterval` yang berjalan di latar belakang (misalnya mengecek setiap 5 menit).
   - Fungsi ini menghitung selisih antara `Date.now()` saat ini dengan nilai `lastActivity` di `localStorage`.
   - Jika selisihnya lebih besar dari 24 jam (24 * 60 * 60 * 1000 milidetik), eksekusi fungsi `signOut()` dari Clerk, hapus data `lastActivity`, dan arahkan pengguna kembali ke halaman *Login*.

3. **Integrasi Global:**
   - Bungkus rute `/admin` (atau area kasir) dengan komponen `SessionTimeoutGuard` ini, sehingga fitur keamanan ini langsung aktif menjaga sesi di latar belakang tanpa harus membayar paket Pro.

Silakan bangun logika *bypass* ini sekarang agar kasir yang lupa *logout* tetap aman keesokan harinya! Lapor jika fungsi *guard* sudah aktif!
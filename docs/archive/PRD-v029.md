# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.29
**Fokus:** Perbaikan Logika Tombol Paywall (Mencegah Premature Redirect)

## 1. Analisis Masalah
*   **Gejala:** Saat pengguna mengklik tombol "Lihat Analitik", antarmuka UI *Paywall* 3 paket (Pricing Tiers) tidak muncul. Alih-alih, aplikasi memicu perpindahan rute secara paksa yang menyebabkan pengguna terlempar ke rute lain atau memicu *redirect loop*.
*   **Akar Masalah (Code Logic):** Terdapat kesalahan pada *event handler* (`onClick`) di tombol "Lihat Analitik". Tombol tersebut kemungkinan besar mengeksekusi navigasi ke rute terproteksi (`router.push('/admin')` atau terbungkus komponen `<Link href="/admin">`) secara membabi buta tanpa memedulikan status langganan.

## 2. Instruksi Eksekusi untuk AI Agent
Fokuskan perbaikan HANYA pada logika interaksi tombol penampil modal di halaman kasir/storefront.

### A. Evaluasi Event Handler Tombol "Lihat Analitik"
*   **Target File:** Komponen yang memuat tombol "Lihat Analitik 👑" (kemungkinan di `app/page.tsx` atau komponen *header* kasir).
*   **Instruksi:**
    1. Pastikan tombol "Lihat Analitik" **TIDAK** dibungkus oleh elemen navigasi seperti `<Link>`.
    2. Periksa dan ubah fungsi `onClick` pada tombol tersebut. Logikanya wajib dirombak menjadi seperti ini:
       * Jika status pengguna adalah 'Pro' (berlangganan) ATAU masa 'Free Trial 14 Hari' masih aktif: Arahkan pengguna ke rute `/admin` secara normal.
       * Jika status langganan/trial sudah habis (Non-Pro): HANYA ubah *state* modal menjadi aktif (contoh: `setShowPaywall(true)`). **Dilarang keras** memanggil fungsi navigasi/redirect rute dalam kondisi ini.

### B. Validasi Integrasi Komponen Modal
*   Pastikan komponen UI Modal 3 Paket (Pricing Tiers) yang berisi Paket Mulai Usaha, Pro Bulanan, dan Pro Tahunan benar-benar di-*import* dan dirender ke dalam DOM halaman Kasir yang sama.
*   Pastikan modal tersebut terikat pada variabel *state* dan hanya akan muncul di layar ketika *state* (misalnya `showPaywall`) bernilai `true`.
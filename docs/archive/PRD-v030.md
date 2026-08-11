# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.30
**Fokus:** Force-Display Modal Paywall & Pemindahan Logika Navigasi

## 1. Analisis Masalah
*   **Gejala:** Modal *Pricing Tiers* (3 Paket) tidak muncul sama sekali, pengguna langsung dialihkan ke `/admin`.
*   **Akar Masalah (Logical Flaw):** AI Agent menerapkan logika *bypass* pada tombol "Lihat Analitik". Karena pengguna saat ini terdeteksi memiliki "Free Trial" yang masih aktif, sistem secara otomatis mengeksekusi `router.push('/admin')` dan menggagalkan render komponen Modal Paywall. 
*   **Dampak UX:** Pengguna tidak melihat penawaran paket harga SaaS, sehingga strategi *up-selling* gagal.

## 2. Instruksi Eksekusi Ekstrim untuk AI Agent
Lakukan perombakan logika navigasi agar antarmuka *Paywall* selalu menjadi gerbang (Gatekeeper) setiap kali tombol "Lihat Analitik" ditekan.

### A. Override Tombol Header "Lihat Analitik"
*   **Target File:** Komponen yang memiliki tombol "Lihat Analitik 👑".
*   **Instruksi:** Hapus SELURUH logika kondisional (`if/else` terkait status *pro* atau *trial*) di dalam fungsi `onClick` tombol ini.
*   Tombol ini **HANYA BOLEH** mengeksekusi satu baris perintah: mengaktifkan *state* modal (misal: `setShowPaywall(true)`). Jangan ada eksekusi navigasi apa pun di sini.

### B. Pindahkan Logika Navigasi ke Dalam Modal
*   **Target File:** Komponen Modal Paywall (Pricing Tiers) yang berisi 3 kartu paket.
*   **Instruksi:** 
    1. Pada kartu **Paket Mulai Usaha (Free Trial)**, ubah tombol CTA-nya menjadi "Gunakan Akses Trial".
    2. Berikan fungsi `onClick` pada tombol CTA tersebut untuk mengeksekusi `router.push('/admin')` HANYA JIKA masa *trial* pengguna masih aktif. Jika sudah habis, munculkan peringatan atau notifikasi.
    3. Untuk tombol CTA di paket Pro Bulanan dan Tahunan, tetap biarkan menampilkan notifikasi "Integrasi pembayaran segera hadir!".
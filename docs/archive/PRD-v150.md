# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.50
**Fokus:** Bugfix UX Onboarding (Glitch Visual) & Standardisasi Branding PJTECH

## 1. Analisis Bug UX & Branding
*   **Glitch Visual Onboarding:** Terdapat jeda visual (*flash*) sesaat setelah pengguna memilih paket langganan. Form pengisian nama toko/kategori sebelumnya sempat terlihat selama beberapa milidetik sebelum sistem berhasil memuat rute Dashboard.
*   **Missing Branding:** Logo/Header pada halaman "Pemilihan Paket Langganan" (saat onboarding) dan halaman "Cek Langganan" (di dalam sistem admin) belum memuat teks `by PJTECH`.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki transisi status UI dan pastikan konsistensi *branding*. DILARANG memberikan *output* kode mentah.

### A. Perbaikan Glitch Transisi Onboarding (UX)
*   **Target File:** Komponen/halaman yang menangani pendaftaran awal dan pemilihan paket (misal: `app/(onboarding)/...` atau komponen yang memuat form toko dan daftar paket).
*   **Instruksi:**
    1. Implementasikan *loading state* global atau *overlay* layar penuh (dengan *spinner* atau teks "Menyiapkan Dashboard...") pada saat transisi rute.
    2. Pastikan komponen Form (Nama Toko & Kategori) **SEGERA** di-*unmount* atau disembunyikan (*hidden*) begitu pengguna berhasil *submit* atau berpindah ke langkah Pemilihan Paket/Dashboard, agar tidak terjadi kebocoran visual (*flashing*) saat menunggu *response* server.

### B. Standardisasi Branding "by PJTECH" (Halaman Langganan)
*   **Target File 1:** Layout/Halaman Pemilihan Paket Langganan (sebelum masuk sistem).
*   **Target File 2:** `app/admin/cek-langganan/page-client.tsx` (atau komponen terkait di dalam *dashboard*).
*   **Instruksi:**
    1. Cari elemen teks/logo yang menampilkan `KASIR POS` atau nama aplikasi di bagian atas (header) halaman tersebut.
    2. Tambahkan teks `by PJTECH` dengan ukuran font yang sedikit lebih kecil (*subtitle/badge style*) di bawah atau di samping logo tersebut.
    3. Pastikan penambahan teks ini selaras dengan desain *header* utama (*Sidebar*).

Silakan eksekusi perbaikan UX transisi dan konsistensi branding ini sekarang!
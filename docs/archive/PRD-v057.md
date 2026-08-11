# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.57
**Fokus:** Dinamisasi Active State Navigasi & Modernisasi Siluman Auto-Refresh

## 1. Analisis Kebutuhan UI/UX
*   **Masalah Navigasi Bawah (Bottom Nav):** Status aktif (warna biru, efek *glowing*, dan posisi ikon membesar/menonjol) saat ini terkunci secara permanen (hardcoded) pada menu "Kasir". Saat pengguna berpindah ke menu "Dashboard" atau "Analitik", menu "Kasir" tetap terlihat aktif.
*   **Masalah Auto-Refresh:** Fitur pembaruan data otomatis (interval 1 menit) memicu indikator visual (seperti *loading state*, *spinner*, atau kedipan layar) yang sangat mengganggu *User Experience* (UX), terutama saat aplikasi sedang aktif digunakan untuk transaksi.
*   **Tujuan:** Mengotomatisasi perpindahan indikator aktif navigasi berdasarkan URL (*route*) saat ini, dan mengubah auto-refresh menjadi proses latar belakang yang hening (*silent background sync*) yang dikontrol oleh sebuah sakelar/tombol modern.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Sebagai agen pengembang, jangan merombak *layout* secara total. Fokus pada penerapan logika *state management* dan *routing* Next.js yang tepat.

### A. Dinamisasi Status Aktif (Bottom Navigation)
*   **Target File:** Komponen `BottomNav` atau `Sidebar` navigasi.
*   **Instruksi Logika Routing:**
    1.  Gunakan *hook* dari Next.js (seperti `usePathname` dari `next/navigation`) untuk membaca rute URL yang sedang aktif.
    2.  Hapus kelas *styling* statis (warna biru dan efek menonjol) yang terpasang mati di tombol "Kasir".
    3.  Terapkan *Conditional Rendering* (Evaluasi Kondisi) pada setiap item menu. 
    4.  **Logika CSS:** JIKA `pathname` sama dengan rute tujuan menu tersebut (misal: `/kasir`), MAKA berikan kelas Tailwind biru, *drop-shadow* biru, dan efek transisi membesar (menonjol). JIKA TIDAK, berikan warna abu-abu standar yang membaur dengan latar belakang.

### B. Mode Siluman Auto-Refresh (Silent Background Fetch)
*   **Target Logika:** Fungsi `setInterval` atau `useSWR` / React Query yang menangani *fetching* 1 menit sekali.
*   **Instruksi Logika Sync:**
    1.  Pastikan proses *fetching* ulang ini TIDAK memicu *state loading* global di seluruh layar.
    2.  Jangan gunakan `router.refresh()` jika itu memicu *loading overlay* bawaan Next.js secara kasat mata. Gunakan pembaruan *state* data secara diam-diam (*background revalidation*).
    3.  Hapus semua *toast notification* atau *alert* yang muncul setiap kali sinkronisasi interval 1 menit ini berhasil. Biarkan berjalan sepenuhnya tanpa suara dan tanpa visual.

### C. Pembuatan Kontrol Toggle Modern
*   **Target UI:** Area *Header* (misalnya di sebelah tombol *badge* "Pro" atau Profil Clerk).
*   **Instruksi Styling (Tailwind):**
    1.  Buat sebuah tombol interaktif berdesain *Switch Toggle* (sakelar geser) modern atau tombol *Sync* berbentuk kapsul kecil.
    2.  Tambahkan ikon "Refresh" atau "Cloud Sync".
    3.  Ikat tombol ini dengan *state* (contoh: `isAutoRefreshEnabled`).
    4.  JIKA aktif (ON): Tombol berwarna hijau/biru dengan animasi ikon berputar sangat pelan (*spin slow*) atau berkedip halus sebagai indikasi bahwa mode sinkronisasi otomatis sedang menyala di latar belakang.
    5.  JIKA mati (OFF): Tombol berwarna abu-abu (*slate/gray*) dan interval 1 menit dihentikan sementara (*clear interval*).
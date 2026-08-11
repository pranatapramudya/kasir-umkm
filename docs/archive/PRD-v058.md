# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.58
**Fokus:** Dinamisasi Komponen Prominent Navbar & Global Silent Auto-Refresh

## 1. Analisis Kebutuhan (Koreksi Logika)
*   **Masalah Visual Bottom Nav:** Status aktif saat ini hanya mengubah warna teks/ikon, sedangkan bentuk fisik lingkaran biru raksasa (efek *floating/pop-up*) terkunci mati secara statis di posisi menu "Kasir". 
*   **Masalah Auto-Refresh:** Instruksi sebelumnya terlalu rumit dengan penambahan tombol. Pengguna (*Owner*) tidak butuh sakelar ON/OFF. Aplikasi harus pintar melakukan *fetching* data secara otomatis setiap saat di latar belakang pada seluruh menu.
*   **Tujuan:** Membuat seluruh kelas CSS pembentuk lingkaran biru berpindah secara dinamis mengikuti rute (URL) yang aktif, serta mengimplementasikan *silent polling* secara global tanpa intervensi UI.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Fokus pada *Conditional Styling* tingkat lanjut dan konfigurasi pengambil data (*data fetcher*). DILARANG menulis tombol *toggle* auto-refresh.

### A. Dinamisasi Bentuk Fisik Navigasi (Prominent Active State)
*   **Target File:** Komponen Navigasi Bawah (`BottomNav` / `MobileNav`).
*   **Instruksi Logika Rendering CSS:**
    1.  Gunakan `usePathname` (atau *router state* setara) untuk mengevaluasi rute saat ini.
    2.  Pindahkan seluruh atribut CSS yang membuat tombol membesar/menonjol (seperti `bg-blue-600`, `rounded-full`, `text-white`, ukuran ikon yang lebih besar, dan efek *negative margin-top* seperti `-mt-X` atau translasi sumbu Y) ke dalam logika kondisional.
    3.  **Logika Mutlak:** Elemen yang mendapat efek lingkaran biru menonjol tersebut HANYALAH elemen yang rutenya sedang sama dengan URL aktif. 
    4.  Menu lainnya (yang tidak aktif) harus dirender dalam mode datar (flat) standar, menggunakan teks dan ikon berwarna netral (abu-abu), tanpa latar belakang lingkaran biru.

### B. Implementasi Global Silent Auto-Refresh
*   **Target Logika:** Komponen *Layout* utama (Root Layout) atau *Wrapper Provider* yang membungkus seluruh aplikasi/dasbor.
*   **Instruksi Konfigurasi Polling:**
    1.  Terapkan logika *Interval Fetching* (misal: 1 menit sekali) di tingkat *Layout/Provider* agar fungsi ini berjalan terus menerus terlepas pengguna sedang berada di halaman Dashboard, Kasir, atau Analitik.
    2.  Pastikan proses ini bersifat **SILENT (Siluman)**. 
    3.  TIDAK BOLEH ada pemicu *loading spinner* global, *skeleton loader* yang me-reset tampilan layar, atau notifikasi pop-up saat data sedang diperbarui. Pembaruan data harus langsung masuk dan mengubah angka di layar secara halus (*seamless state mutation*).
    4.  DILARANG membuat elemen UI (tombol/sakelar) apa pun untuk fitur ini. Fitur ini murni berjalan sebagai layanan latar belakang (*background service*).
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.76
**Fokus:** UI/UX Polish - Revisi Terminologi & Transparansi Modal Backdrop

## 1. Analisis Kebutuhan UI/UX
*   **Masalah Terminologi:** Penggunaan kata "Pegawai" pada menu dan *header* terasa kurang modern untuk standar aplikasi POS premium.
*   **Masalah Visual Modal:** Saat tombol "Tambah Kasir" diklik, latar belakang layar (*backdrop overlay*) di belakang modal menjadi abu-abu solid/pekat. Ini memblokir pandangan ke dasbor dan merusak pengalaman pengguna (*User Experience*). *Backdrop* harus bersifat semi-transparan agar pengguna tetap merasa berada di halaman yang sama.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Tugas Anda HANYA memperbaiki elemen antarmuka (UI) dan *styling* Tailwind. Jangan merombak logika *database* atau *Server Action*.

### A. Refaktor Terminologi (Pegawai -> Karyawan)
*   **Target File:** `components/Sidebar.tsx`, `components/BottomNav.tsx`, dan `app/admin/pegawai/page.tsx`.
*   **Instruksi Teks:**
    1.  Ubah label menu di navigasi dari "Pegawai" menjadi "Karyawan".
    2.  Ubah judul halaman (*Header*) dari "Manajemen Pegawai" menjadi "Manajemen Karyawan".
    3.  Ubah sub-judul tabel dari "Daftar Pegawai (Kasir)" menjadi "Daftar Karyawan (Kasir)".
    4.  *(Opsional namun disarankan)* Ganti nama *folder* rute dari `app/admin/pegawai` menjadi `app/admin/karyawan` agar seragam dengan penamaan UI. Jika ini dilakukan, pastikan semua *href* di navigasi ikut diperbarui.

### B. Perbaikan Modal Backdrop (Overlay Transparan)
*   **Target File:** Komponen Modal di halaman Manajemen Karyawan (baik yang menyatu di `page.tsx` atau dipisah sebagai *Client Component*).
*   **Instruksi Styling (Tailwind):**
    1.  Cari elemen `<div>` terluar yang berfungsi sebagai pembungkus *full-screen* untuk modal (biasanya memiliki kelas seperti `fixed inset-0 z-50`).
    2.  Hapus utilitas warna latar belakang solid yang ada saat ini (seperti `bg-gray-400`, `bg-gray-500`, atau `bg-white`).
    3.  Ganti dengan utilitas hitam semi-transparan: **`bg-black/50`** (atau `bg-black bg-opacity-50`).
    4.  Tambahkan utilitas **`backdrop-blur-sm`** agar halaman dasbor di belakang modal terlihat sedikit buram. Ini adalah standar desain *glassmorphism* modern yang sangat elegan.
    5.  Pastikan kotak modal utama (yang berwarna putih dan berisi form) tetap menggunakan `bg-white` dengan *shadow* yang kuat (`shadow-xl` atau `shadow-2xl`) agar kontras dengan latar belakangnya yang gelap.
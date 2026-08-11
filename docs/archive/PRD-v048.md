# PRD-v048: Implementasi Responsive Hybrid Navigation (Desktop & Mobile)

## 1. Konteks & Tujuan (Instruksi untuk AI Agent)
Sebagai Senior Full-Stack Developer, tugas kamu adalah memperbaiki sistem navigasi aplikasi yang saat ini hilang di tampilan Desktop (akibat pembersihan *header* di PRD sebelumnya). 
Aplikasi ini wajib mendukung *multi-device* (responsif). Tujuan utama dari PRD ini adalah mengimplementasikan **Responsive Hybrid Navigation** menggunakan Tailwind CSS, di mana navigasi menyesuaikan ukuran layar tanpa merusak *layout* utama POS.

## 2. Kebutuhan Fitur & Spesifikasi UI/UX (Tailwind CSS)

### 2.1. Mobile View (Layar Kecil / `< md`)
- **Bottom Navigation:** Pertahankan *Bottom Navigation Bar* (dengan tombol tengah Kasir FAB) yang sudah dibuat sebelumnya.
- **Visibilitas:** Pastikan *Bottom Navigation* hanya muncul di layar *mobile* dan sembunyi di layar desktop (gunakan utilitas Tailwind seperti `block md:hidden`).
- **Sidebar:** Sembunyikan *Left Sidebar* sepenuhnya di layar *mobile*.

### 2.2. Desktop View (Layar Lebar / `>= md`)
- **Left Sidebar (Navigasi Samping Kiri):** Buat sebuah komponen *Sidebar* baru di sebelah kiri layar.
  - **Visibilitas:** Hanya muncul di layar desktop (gunakan `hidden md:flex md:w-64 md:flex-col`).
  - **Struktur Menu:** Berisi daftar menu vertikal: Dashboard, Produk, Kasir, Analitik, Pengaturan.
  - **Styling Menu:** Gunakan kombinasi Ikon + Teks. Berikan efek *hover* yang lembut (misal: `hover:bg-gray-100`) dan *active state* (warna *background* atau teks biru `text-blue-600` dengan *border* kiri yang tegas) untuk menu yang sedang aktif.
- **Header:** Biarkan *header* tetap bersih seperti saat ini (hanya Logo/Judul Aplikasi di kiri dan Profil Avatar di kanan).
- **Bottom Navigation:** Wajib disembunyikan agar tidak *double navigation*.

### 2.3. Penyesuaian Layout Utama (Main Layout Wrapper)
- Karena ada penambahan *Left Sidebar* di Desktop, pastikan kontainer utama (`<main>`) tidak tertutup oleh *Sidebar*. 
- Gunakan struktur Flexbox atau CSS Grid pada *Root Layout* (`layout.tsx` atau sejenisnya) agar area konten utama (yang berisi grid produk dan *sidebar* keranjang belanja) bergeser secara dinamis mengikuti lebar *Left Sidebar*.
- Pastikan area keranjang belanja di sebelah kanan (seperti pada tangkapan layar) tidak terganggu dan tetap merespons *height* layar dengan benar (`h-screen`).

## 3. Acceptance Criteria (Kriteria Selesai)
- [ ] Di layar ukuran HP, *Bottom Navigation* muncul dan *Left Sidebar* hilang.
- [ ] Di layar PC/Desktop, *Left Sidebar* muncul di kiri dan *Bottom Navigation* hilang.
- [ ] Navigasi antar halaman (Dashboard, Produk, Kasir, Analitik, Pengaturan) berjalan normal dari *Sidebar* desktop.
- [ ] Area *grid* produk POS dan keranjang kasir (sebelah kanan) tidak tertimpa oleh *Sidebar* navigasi yang baru.

## 4. Tindakan yang Diharapkan dari AI:
Silakan refaktor struktur `Layout` utama (misalnya `components/Layout.tsx` atau `app/layout.tsx`) dan buat komponen `Sidebar.tsx`. Jangan ubah logika *state* keranjang belanja, cukup fokus pada struktur HTML/CSS dan *responsive utility classes* bawaan Tailwind CSS.
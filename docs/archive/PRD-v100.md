# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.00 (Planning Mode)
**Fokus:** Optimalisasi UI/UX Responsif Cross-Device (Fokus Utama: Tablet)

## 1. Tujuan Akhir (Goal)
Memastikan seluruh antarmuka aplikasi (terutama halaman Kasir POS dan Dashboard Admin) sepenuhnya responsif dan nyaman digunakan di berbagai ukuran layar: *Mobile*, *Tablet*, dan *Desktop*. 
**Prioritas Utama:** Perangkat **Tablet** (terutama dalam mode *Landscape*). Aplikasi ini akan didemonstrasikan dan digunakan secara langsung oleh klien UMKM menggunakan Tablet, sehingga tata letak pada resolusi tablet (sekitar `768px` hingga `1024px`) harus terlihat premium, tidak berantakan, dan proporsional.

## 2. Batasan Arsitektur & Desain (Constraints)
*   **Penggunaan Tailwind CSS:** Dilarang merombak total struktur HTML jika tidak perlu. Manfaatkan *utility classes* responsif bawaan Tailwind (`sm:`, `md:`, `lg:`, `xl:`) untuk menyesuaikan *Grid*, *Flex*, lebar, dan *margin/padding*.
*   **Perilaku Sidebar (Admin & POS):** 
    *   Pada *Desktop/Tablet Landscape* (`lg:`): Sidebar harus tetap muncul penuh (*fixed/sticky*) di sisi kiri.
    *   Pada *Mobile/Tablet Portrait* (`< lg`): Sidebar harus disembunyikan di balik *Hamburger Menu* (Drawer) agar layar tidak sempit.
*   **Layout Halaman Kasir (POS):** 
    *   Pada *Tablet Landscape/Desktop*: Daftar Produk dan area Keranjang (*Cart*) harus bersebelahan (*side-by-side*) dengan proporsi yang pas (misal: 60% Produk, 40% Keranjang).
    *   Pada *Mobile*: Daftar Produk mengambil 100% lebar layar, dan Keranjang bisa dimunculkan melalui tombol *Floating Action Button* (FAB) atau diletakkan di bagian paling bawah (*scroll*).
*   **Keamanan Fitur Berjalan:** Optimalisasi UI ini DILARANG MERUSAK fungsi yang sudah berjalan (seperti *Timer Countdown*, *Banner Soft Lockout*, dan perhitungan Keranjang).

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda menulis atau mengubah baris kode apa pun, lakukan langkah berikut:
1. Audit file *layout* utama: `components/Sidebar.tsx`, halaman Kasir (`app/page-client.tsx`), dan *layout* Admin (`app/admin/AdminLayoutClient.tsx`).
2. Jabarkan rencana penyesuaian kelas Tailwind Anda (apa yang akan diubah pada breakpoint `md:` dan `lg:`).
3. Usulkan bagaimana Anda akan menangani Sidebar pada versi *Mobile* (misalnya menggunakan *state* lokal untuk buka/tutup menu).
4. **Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengubah kode.**
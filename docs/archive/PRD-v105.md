# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.05 (Planning Mode)
**Fokus:** Hierarki Visual & Pengelompokan Menu Sidebar (SaaS Enterprise Style)

## 1. Tujuan Akhir (Goal)
Meningkatkan UX dan estetika Sidebar dengan mengelompokkan tautan navigasi yang saat ini masih berupa *flat list* menjadi beberapa grup logis. Tujuannya adalah membuat Sidebar terlihat profesional, rapi, dan mudah dipindai (*scannable*) layaknya platform SaaS kelas *Enterprise* (seperti Meta Business Suite atau Shopify).

## 2. Batasan Arsitektur & Desain (Constraints)
*   **Kategorisasi Logis:** Bagi menu yang ada ke dalam 3 kelompok utama:
    *   **MENU UTAMA:** Dashboard, Kasir POS
    *   **MANAJEMEN BISNIS:** Produk, Karyawan, Pengeluaran
    *   **SISTEM & LAPORAN:** Analitik, Pengaturan
*   **Gaya Tipografi Kategori:** Judul setiap kategori harus terlihat halus dan tidak mendominasi. Gunakan kelas Tailwind seperti `text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4`.
*   **Keamanan Fungsionalitas:** Perombakan visual ini DILARANG MERUSAK:
    1. Logika *Active State* (penanda menu yang sedang dibuka dengan *background* biru).
    2. Modul *Drawer/Overlay* responsif untuk versi *Mobile/Tablet* yang sudah kita buat sebelumnya.
    3. Komponen *Timer/Subscription Widget* di bagian paling bawah Sidebar.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda menulis atau mengubah baris kode apa pun di `components/Sidebar.tsx` (atau `SidebarClient.tsx`), berikan rancangan Anda:
1.  **Struktur Data:** Jika saat ini menu dirender menggunakan metode `map()` dari sebuah *array* objek, jelaskan bagaimana Anda akan merestrukturisasi *array* tersebut untuk mendukung pengelompokan (misal: menambahkan properti `group` atau membuat *array* multi-dimensi).
2.  **Rencana UI/Tailwind:** Tuliskan draf struktur HTML/Tailwind untuk me-*render* judul grup dan jarak (*spacing*) antar grup agar terlihat bernapas dan rapi.

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengubah kode Sidebar!**
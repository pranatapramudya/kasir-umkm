# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.44
**Fokus:** Modernisasi UI/UX Kartu Analitik Produk (Interactive Dropdown State)

## 1. Analisis Masalah
*   **Kelemahan UX Saat Ini:** Kartu "Analitik Produk" menampilkan daftar "Produk Paling Laris" dan "Paling Kurang Laris" secara bersamaan (ditumpuk vertikal). Hal ini memakan terlalu banyak ruang vertikal dan membuat UI terlihat kaku.
*   **Tujuan:** Mengonversi tata letak statis menjadi komponen interaktif menggunakan *Dropdown* (Select) modern. Daftar yang dirender di layar harus bergantung pada opsi yang dipilih oleh pengguna, sehingga tinggi kartu tetap konsisten dan *compact*.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Terapkan *state management* dan perbarui antarmuka pengguna pada komponen kartu Analitik Produk secara spesifik. Dilarang merusak logika pengambilan data (*data fetching*) yang sudah berjalan.

### A. Implementasi State Control
*   **Target File:** Komponen UI untuk Kartu "Analitik Produk" (berada di dalam `app/admin/analytics/page.tsx` atau komponen terpisahnya).
*   **Instruksi React State:** 
    1.  Ubah komponen ini menjadi *Client Component* (tambahkan `"use client";` di baris paling atas jika belum ada).
    2.  Buat sebuah *state* untuk melacak mode tampilan. Contoh: 
        `const [filterMode, setFilterMode] = useState<'best' | 'worst'>('best');`

### B. Desain Dropdown Filter Modern (Tailwind)
*   **Instruksi UI Header Kartu:**
    1.  Ubah bagian *header* kartu menjadi *flex container* yang sejajar: `flex items-center justify-between`.
    2.  Di sisi kiri, biarkan judul "Analitik Produk" beserta ikonnya.
    3.  Di sisi kanan, tambahkan elemen `<select>` HTML standar (atau komponen `Select` dari *library* seperti Shadcn UI/Radix jika tersedia di proyek).
*   **Styling Dropdown (Tailwind):**
    *   Jika menggunakan `<select>` bawaan, gunakan kelas yang bersih dan modern: 
        `text-xs md:text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`.
    *   Opsi *Dropdown*:
        *   `<option value="best">Paling Laris</option>`
        *   `<option value="worst">Kurang Laris</option>`
    *   Ikat nilai *dropdown* ini dengan fungsi `onChange` untuk mengontrol `setFilterMode`.

### C. Conditional Rendering Daftar Produk
*   **Instruksi Transisi UI:**
    1.  Hapus struktur tumpukan vertikal yang lama.
    2.  Gunakan operator *ternary* atau logika kondisional berdasarkan nilai `filterMode`.
    3.  **Jika `filterMode === 'best'`:** Render HANYA daftar produk dengan tren positif (Ikon Panah Hijau ke atas).
    4.  **Jika `filterMode === 'worst'`:** Render HANYA daftar produk dengan tren negatif/Dead Stock (Ikon Panah Merah ke bawah).
    5.  Berikan animasi *fade-in* ringan pada daftar saat pergantian *state* terjadi (contoh menggunakan Tailwind: `animate-in fade-in duration-300`).

### D. Validasi Hasil
*   Pastikan kartu "Analitik Produk" sekarang memiliki tinggi yang jauh lebih *compact*.
*   Uji pergantian *dropdown*. Daftar produk di bawahnya harus langsung berganti antara data terlaris dan data tidak laris secara instan tanpa memuat ulang halaman (*page reload*).
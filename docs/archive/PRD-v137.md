# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.37
**Fokus:** Fix Responsive Layout S&K Bundling & Inisialisasi Modul Manajemen Meja (F&B)

## 1. Analisis UI & Kebutuhan Fitur
*   **Responsive Layout Bug:** Tampilan modal/komponen Syarat & Ketentuan (serta opsi paket) gagal merender secara horizontal di layar besar (desktop/tablet) dan malah menumpuk secara vertikal. Diperlukan penyesuaian kelas utilitas CSS (Tailwind) untuk responsivitas.
*   **Modul Manajemen Meja (F&B):** Halaman `/admin/manajemen-meja` saat ini masih menampilkan "Coming Soon". Sebagai urat nadi operasional F&B, halaman ini harus segera diubah menjadi antarmuka CRUD dasar untuk mendata meja.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
DILARANG memberikan *output* kode mentah. Lakukan modifikasi langsung pada *file* terkait.

### A. Perbaikan Responsivitas Layout Harga & S&K
*   **Target File:** Komponen Pricing/Bundling dan Modal S&K (`components/PricingSection.tsx` atau file modal terkait).
*   **Instruksi:**
    1. Pastikan *container* utama pembungkus kartu harga menggunakan *grid* yang responsif. Contoh: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
    2. Pada bagian Modal S&K atau rincian tabel perbandingan, gunakan pembungkus flexbox: `flex flex-col md:flex-row items-start justify-between gap-4`.
    3. Pastikan konten teks S&K sejajar di desktop dan tidak memakan terlalu banyak ruang vertikal.

### B. Inisialisasi Halaman Manajemen Meja
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx` (atau struktur terkait).
*   **Instruksi:**
    1. Hapus tampilan "Coming Soon" beserta ikonnya.
    2. Buat antarmuka (UI) dasar berupa Header Halaman: "Manajemen Meja" dengan tombol "Tambah Meja" di pojok kanan atas.
    3. Siapkan kerangka *Table* (Tabel Data) yang memiliki kolom:
       - **No. Meja / Nama Meja** (Contoh: "Meja 1", "VIP A")
       - **Kapasitas** (Contoh: "4 Orang")
       - **Status** (Badge: `Tersedia` atau `Terisi`)
       - **Aksi** (Edit / Hapus)
    4. Buatkan *Form Modal* statis (belum perlu disambung ke API) untuk "Tambah Meja" yang berisi input teks (Nama Meja) dan input angka (Kapasitas).

Silakan eksekusi perbaikan CSS Layout dan siapkan antarmuka Manajemen Meja sekarang juga!
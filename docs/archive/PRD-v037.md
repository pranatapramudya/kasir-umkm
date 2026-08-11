# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.37
**Fokus:** Pembuatan Rute dan Menu "Analitik Lanjutan" pada Dasbor Admin

## 1. Analisis Kebutuhan
*   **Kondisi Saat Ini:** Menu navigasi utama di area Admin/Owner saat ini hanya memiliki 3 tab: `Dashboard` (Ringkasan), `Produk`, dan `Pengaturan`.
*   **Kesenjangan (Gap):** Fitur-fitur premium yang ditawarkan pada *paywall* (seperti Analisis Jam Sibuk, Analitik Produk ABC, Database Pelanggan) belum memiliki ruang/halaman fisik di dalam aplikasi.
*   **Tujuan:** Menambahkan satu tab menu navigasi baru bernama **"Analitik"** dan membuat halaman khusus untuk memamerkan antarmuka fitur-fitur premium tersebut, sehingga pengguna merasa mendapatkan *value* yang besar.

## 2. Instruksi Eksekusi untuk AI Agent
Sebagai agen mandiri, eksekusi pembuatan fitur ini dengan langkah-langkah berikut tanpa merusak navigasi yang sudah ada.

### A. Pembaruan Navigasi Utama (Bottom Nav & Sidebar)
*   **Target File:** Komponen Layout Admin (misal: `app/admin/layout.tsx` atau komponen *Navbar/BottomNav* terkait).
*   **Instruksi:** 
    1. Tambahkan satu *item* menu baru di sebelah atau di antara tab "Produk" dan "Pengaturan".
    2. Beri label teks **"Analitik"** (atau "Laporan").
    3. Gunakan ikon yang merepresentasikan data lanjutan (contoh dari `lucide-react`: `<BarChart />`, `<TrendingUp />`, atau `<PieChart />`).
    4. Arahkan *link* (href) menu ini ke rute baru: `/admin/analytics`.

### B. Pembuatan Halaman Analitik Lanjutan
*   **Target File [NEW]:** Buat file baru di `app/admin/analytics/page.tsx`.
*   **Instruksi UI/UX Halaman Baru:**
    1. **Header:** Tambahkan judul "Analitik & Laporan Premium" dengan sub-judul "Dapatkan wawasan mendalam untuk kembangkan bisnis Anda."
    2. **Grid Layout:** Buat *layout* grid yang responsif (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
    3. **Card Placeholders:** Render 4 hingga 5 buah Kartu (*Card*) UI yang mewakili fitur-fitur premium dari Paket Tahunan:
        *   Kartu 1: Grafik Jam Sibuk Penjualan
        *   Kartu 2: Analitik Produk (Paling Laku vs Dead Stock)
        *   Kartu 3: Peringatan Stok Cerdas
        *   Kartu 4: Laporan Performa Kasir
    4. **Tampilan State (Mockup):** Untuk saat ini, isi kartu-kartu tersebut dengan ilustrasi grafik statis/dummy, atau berikan efek *blur/locked* dengan *badge* "Pro Feature" atau teks "Data sedang dikumpulkan..." agar secara visual terlihat seperti fitur kelas atas tingkat *Enterprise*.
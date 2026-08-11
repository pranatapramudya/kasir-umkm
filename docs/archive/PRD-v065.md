# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.65
**Fokus:** Penambahan Menu Baru "Pengeluaran" (Expense Management) untuk Desktop & Mobile

## 1. Analisis Kebutuhan Bisnis & UX
*   **Kebutuhan Fungsional:** Pengguna memerlukan wadah untuk mencatat biaya operasional harian di luar pembelian stok (seperti listrik, air, sewa, transport, dll.) agar perhitungan laba bersih bisnis akurat.
*   **Posisi Navigasi:** Menu baru bernama **"Pengeluaran"** wajib disematkan tepat di bawah menu **"Analitik"** pada *Sidebar* (Desktop) dan disesuaikan ke dalam *Bottom Navigation* (Mobile).
*   **Kompatibilitas Lintas Perangkat:** Desain harus responsif penuh, mendukung interaksi tabel/kartu di layar besar dan tampilan ringkas berbasis sentuhan di layar seluler.

## 2. Instruksi Arsitektur untuk AI Agent
Terapkan penambahan menu dan tabel pencatatan ini tanpa merusak struktur navigasi dan *state* yang sudah ada. DILARANG KERAS memberikan kode mentah, fokus pada instruksi arsitektur logika berikut.

### A. Perluasan Struktur Navigasi (Sidebar & Mobile Nav)
*   **Target File:** Komponen *Sidebar* (Desktop) dan *Bottom Navigation* (Mobile).
*   **Instruksi Logika:**
    1.  **Sidebar Desktop:** Tambahkan item menu baru dengan label "Pengeluaran" disertai ikon yang relevan (misalnya ikon dompet, koin, atau kuitansi). Posisikan tepat di bawah menu "Analitik" dan di atas "Pengaturan".
    2.  **Bottom Nav Mobile:** Karena ruang navigasi bawah seluler terbatas, tambahkan ikon Pengeluaran (atau sesuaikan ulang *grid* 5 item menjadi 6 item secara proporsional dengan ikon yang bersih) agar pengguna *mobile* bisa mengakses fitur ini langsung dari bilah bawah.
    3.  **Active State Routing:** Pastikan rute aktif (`/admin/pengeluaran` atau setara) menyala dinamis (berubah warna/menonjol) saat menu ini dikunjungi.

### B. Pembuatan Skema Database (Prisma Model Expense)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi Logika Model:**
    1.  Buat model data baru bernama `Expense` (Pengeluaran).
    2.  Atur kolom wajib di dalam model tersebut:
        *   `id` (String / Cuid, Primary Key)
        *   `title` / `name` (String: Nama/keterangan pengeluaran, misal: "Bayar Listrik Bulanan")
        *   `amount` (Float / Int: Nominal uang yang dikeluarkan)
        *   `category` (String: Kategori pengeluaran, misal: "Operasional", "Utilitas", "Lainnya")
        *   `date` (DateTime: Tanggal pengeluaran dilakukan, *default* hari ini)
        *   `createdAt` (DateTime, *default* sekarang)
    3.  Jalankan migrasi basis data untuk menerapkan tabel baru ini.

### C. Pengembangan Halaman Manajemen Pengeluaran (`/admin/pengeluaran`)
*   **Target File:** Buat file halaman baru `app/admin/pengeluaran/page.tsx` (Pastikan menggunakan `export const dynamic = 'force-dynamic';` agar data selalu *real-time*).
*   **Instruksi Fitur & UI:**
    1.  **Header Halaman:** Tampilkan judul "Manajemen Pengeluaran" beserta tombol aksi utama **"Tambah Pengeluaran"** berdesain modern (warna kontras, ikon plus).
    2.  **Ringkasan Cepat (Card Total):** Di bagian atas, tampilkan kotak metrik kecil yang merangkum total pengeluaran pada bulan/periode berjalan.
    3.  **Tabel / Daftar Data (Responsive):** 
        *   Tampilkan daftar pengeluaran dalam bentuk tabel rapi untuk pengguna *Desktop*.
        *   Ubah bentuk tabel menjadi *Card Stack* (tumpukan kartu vertikal) yang bersih untuk pengguna *Mobile*.
        *   Setiap baris/kartu wajib memuat: Tanggal, Nama Pengeluaran, Kategori, Nominal (format Rupiah yang jelas), serta tombol aksi Hapus/Edit.
    4.  **Form Pop-up (Modal Tambah Pengeluaran):**
        *   Ketika tombol "Tambah Pengeluaran" diklik, munculkan modal interaktif dengan animasi halus.
        *   Sediakan kolom input untuk: Nama Pengeluaran (Text), Nominal (Number/Currency), Kategori (Dropdown/Input teks bebas), dan Tanggal (Date Picker).
        *   Sediakan tombol "Simpan" yang langsung memasukkan data ke tabel Prisma dan menutup modal secara otomatis.

### D. Integrasi ke Perhitungan Laba Bersih (Dashboard)
*   **Target Logika:** Halaman Dashboard Utama / Kartu Laba Bersih.
*   **Instruksi Integrasi:**
    *   Perbarui rumus logika perhitungan "Laba Bersih" pada ringkasan bisnis. 
    *   Rumus baru yang sah: $\text{Laba Bersih} = (\text{Total Pendapatan} - \text{Total HPP Barang Terjual}) - \text{Total Pengeluaran Operasional}$. 
    *   Dengan rumus ini, pencatatan pengeluaran operasional akan otomatis mengurangi laba bersih secara akurat.
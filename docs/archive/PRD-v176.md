# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.76
**Fokus:** Spesifikasi Waktu Metrik Omset (Current Month GMV)

## 1. Analisis Metrik SaaS
*   **Masalah:** Kolom "TOTAL OMSET" saat ini menarik data agregasi sepanjang waktu (*All-Time*). Hal ini kurang akurat untuk menilai tingkat keaktifan (*stickiness*) bulanan seorang *Tenant*.
*   **Solusi:** Kueri harus difilter hanya untuk menjumlahkan transaksi pada **bulan berjalan** (dari tanggal 1 hingga akhir bulan saat ini), sehingga Superadmin dapat melihat performa aktual secara *real-time*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Ubah filter waktu pada kueri agregasi Prisma dan perbarui label UI. DILARANG memberikan *output* kode mentah panjang.

### A. Perubahan Label UI
*   **Target File:** `app/superadmin/page.tsx`
*   **Instruksi:** Ubah teks *header* tabel dari **"TOTAL OMSET"** menjadi **"OMSET (BULAN INI)"**.

### B. Injeksi Filter Waktu (Prisma)
*   **Target File:** `app/superadmin/page.tsx` (Fungsi penarikan data)
*   **Instruksi Logika:**
    1. Dapatkan objek tanggal untuk awal bulan ini dan akhir bulan ini.
       *(Contoh: `startOfMonth` dan `endOfMonth` menggunakan `date-fns` atau logika JavaScript native `new Date(year, month, 1)`).*
    2. Pada bagian `include` atau agregasi `Transaction` untuk menghitung `totalAmount`, tambahkan kondisi `where` pada properti tanggal (misal: `createdAt`).
    3. Filter agar hanya menghitung transaksi di mana `createdAt` lebih besar sama dengan (`gte`) awal bulan, dan lebih kecil sama dengan (`lte`) akhir bulan.

Silakan eksekusi penajaman kueri waktu ini agar data yang disajikan sangat relevan untuk analisis bulanan!
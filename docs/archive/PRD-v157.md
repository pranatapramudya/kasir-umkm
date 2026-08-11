# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.57
**Fokus:** Perbaikan UI Analitik Jasa & Pembuatan Halaman Rekap Komisi (MVP)

## 1. Analisis Kebutuhan Sistem Jasa
*   **Analitik Dashboard:** Istilah "Produk" pada kartu analitik harus menyesuaikan menjadi "Layanan" jika `kategoriUsaha === 'Jasa'`.
*   **Rekap Komisi (Missing Page 404):** Sistem membutuhkan halaman khusus untuk merekap total komisi masing-masing pekerja berdasarkan transaksi yang sudah berhasil (Lunas). Ini adalah *killer feature* untuk operasional Jasa.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Buat halaman baru dan sesuaikan UI analitik yang sudah ada. DILARANG memberikan *output* kode mentah.

### A. Penyesuaian Terminologi Analitik
*   **Target File:** `app/admin/analitik/page-client.tsx` (atau komponen *Card* Analitik Produk).
*   **Instruksi:**
    1. Lakukan pengecekan *state/context* kategori usaha.
    2. Jika `kategoriUsaha === 'Jasa'`, ubah teks judul kartu dari `Analitik Produk` menjadi `Analitik Layanan`. Teks deskripsi ubah dari "Identifikasi performa produk" menjadi "Identifikasi layanan paling diminati".

### B. Pembuatan Halaman "Rekap Komisi" (UI Frontend)
*   **Target File:** Buat *route* baru di `app/admin/rekap-komisi/page.tsx` dan `page-client.tsx`.
*   **Instruksi Layout MVP:**
    1. **Header:** Judul "Rekap Komisi Pekerja" dengan sub-judul "Pantau kinerja dan hitung bagi hasil karyawan Anda."
    2. **Filter Tanggal:** Sediakan filter rentang waktu (Bulan Ini, Hari Ini, Semua Waktu) persis seperti komponen di halaman Analitik.
    3. **Tabel Data:** Buat tabel dengan kolom berikut:
       - `Nama Pekerja` (Diambil dari `workerName` pada saat *checkout* Kasir).
       - `Total Layanan Dikerjakan` (Jumlah *qty* / transaksi yang dikerjakan orang tersebut).
       - `Total Komisi (Rp)` (Akumulasi nominal komisi dari layanan yang dikerjakannya).
    4. **Tombol Ekspor (Opsional untuk MVP):** Tambahkan tombol "Unduh Laporan" jika modul Excel/CSV sudah tersedia, jika belum biarkan *disabled* atau lewati.

### C. Logika Backend (API Rekap Komisi)
*   **Target File:** Buat *route handler* baru, misal `app/api/commissions/route.ts` atau gunakan Server Action.
*   **Instruksi Kueri (Prisma):**
    1. Tarik data dari tabel `TransactionItem` (atau relasinya) yang memiliki status transaksi berhasil/lunas.
    2. Filter kueri WAJIB menggunakan `tenantId` atau `userId` pemilik agar data aman.
    3. Filter data berdasarkan rentang waktu (*date range*) yang dikirim dari *client*.
    4. Lakukan agregasi/Grouping (menggunakan `groupBy` di Prisma atau secara manual via JavaScript) berdasarkan `workerName`.
    5. Hitung `Total Komisi` dengan mengalikan `qty` (jumlah layanan) dengan `employeeCommission` dari item tersebut.
    6. Kembalikan respons dalam bentuk Array/JSON untuk dirender oleh tabel di *frontend*.

Silakan eksekusi pembuatan fitur Rekap Komisi ini sebagai standar MVP premium operasional Jasa!
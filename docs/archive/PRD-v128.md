# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.28
**Fokus:** Implementasi Date Range Picker (Kalender) & Dinamisasi Filter Data

## 1. Analisis Kebutuhan Fitur (UX & Logic)
*   **Menu Pengeluaran:** Saat ini tidak ada alat filter tanggal. Pengguna tidak bisa melihat riwayat atau total pengeluaran pada rentang waktu spesifik (hanya *hardcoded* "Bulan Ini").
*   **Menu Analitik:** Filter saat ini hanya berupa *dropdown* statis (Hari Ini, Bulan Ini, dsb). Dibutuhkan kontrol yang lebih granular menggunakan kalender (*Custom Date Range*).
*   **Solusi:** Mengimplementasikan komponen *Date Range Picker* (Kalender Popover) yang seragam di kedua halaman tersebut. Perubahan pada kalender harus langsung memicu pengambilan ulang data (*refetch*) atau pemfilteran data dari *database* (Prisma).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan pada *Client Components* dan *Data Fetching Logic*. DILARANG memberikan *output* kode mentah.

### A. Implementasi UI Date Range Picker
*   **Instruksi Komponen:**
    1. Gunakan atau buat komponen kalender rentang waktu (misalnya menggunakan integrasi `react-day-picker` + `date-fns` yang biasa ada di ekosistem `shadcn/ui`, atau input native HTML5 jika lebih efisien).
    2. Komponen harus memiliki *state* lokal/global: `dateRange: { from: Date, to: Date }`.

### B. Pembaruan Menu Pengeluaran (Expenses)
*   **Target File:** `app/admin/expenses/ExpensesClient.tsx` (atau file yang relevan).
*   **Instruksi:**
    1. Tambahkan komponen *Date Range Picker* di bagian atas halaman (sejajar dengan judul atau tombol "Tambah Pengeluaran").
    2. Hubungkan *state* kalender dengan logika *filtering* pengeluaran.
    3. Pastikan teks "Total Pengeluaran (Bulan Ini)" berubah secara dinamis menjadi rentang tanggal yang dipilih (contoh: "Total Pengeluaran (12 Ags - 18 Ags)").
    4. Kartu total (Rp...) dan daftar pengeluaran di bawahnya harus bereaksi (hanya menampilkan data yang nilai `createdAt`-nya berada di dalam rentang `from` dan `to`).

### C. Pembaruan Menu Analitik
*   **Target File:** `app/admin/analytics/AnalyticsClient.tsx` (atau file yang relevan).
*   **Instruksi:**
    1. Ganti atau modifikasi *dropdown* periode saat ini. Tambahkan opsi "Pilih Tanggal..." yang jika diklik akan membuka kalender *Date Range Picker*.
    2. Saat *user* memilih rentang waktu dari kalender, oper nilai `startDate` dan `endDate` tersebut ke dalam fungsi pemanggilan API atau *Query* Prisma.
    3. Pastikan semua metrik di halaman Analitik (Grafik Jam Sibuk, Analitik Produk Paling Laris) langsung diperbarui berdasarkan rentang waktu tersebut.

### D. Penyesuaian Query Database (Prisma)
*   **Target File:** Fungsi API atau *Server Actions* untuk Analitik dan Pengeluaran.
*   **Instruksi:** Pastikan logika pengambilan data Anda menggunakan filter `where` pada Prisma dengan operator `gte` (Greater Than or Equal) untuk tanggal `from`, dan `lte` (Less Than or Equal) untuk tanggal `to`. 
*(Contoh: `createdAt: { gte: dateRange.from, lte: dateRange.to }`)*.

Silakan eksekusi fitur Kalender Rentang Waktu ini sekarang agar analitik dan pencatatan kasir menjadi benar-benar dinamis dan profesional!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.07
**Fokus:** Hotfix Bug "Empty Data" Laporan Shift (Timezone, Date Parsing, & Role Scoping)

## 1. Analisis Bug (Kritis P0)
*   **Gejala:** Halaman Laporan Shift menampilkan data `Rp 0` dan "Belum ada transaksi" meskipun pengguna sudah memilih tanggal hari ini dan transaksi sebenarnya ada di *database*.
*   **Diagnosa Penyebab:** Terdapat kegagalan dalam proses penarikan data (*Data Fetching*) di sisi Server/API yang kemungkinan besar disebabkan oleh 3 hal: 
    1. Perbedaan zona waktu (UTC vs Lokal) saat memfilter `createdAt` di Prisma.
    2. Format parameter tanggal dari *Client* yang tidak terstandarisasi.
    3. Filter `userId` yang terlalu ketat (Owner tidak bisa melihat transaksi Karyawan).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit dan perbaikan langsung pada *codebase* pengguna. DILARANG memberikan *output* kode mentah.

### A. Standarisasi Parameter Tanggal (Client-Side)
*   **Target File:** `app/laporan-kasir/LaporanKasirClient.tsx` (atau komponen yang mengirim kueri).
*   **Instruksi:** 
    1. Pastikan *state* tanggal yang dikirim ke API/SWR selalu diubah menjadi format standar ISO tanggal mutlak (misal: `YYYY-MM-DD`) menggunakan bantuan fungsi *utility* atau pemotongan string. Jangan mengirim format `DD/MM/YYYY` atau `MM/DD/YYYY` mentah karena akan menyebabkan ambiguitas di *backend*.
    2. Pastikan komponen langsung melakukan *fetch* (menarik data hari ini) pada saat *render* pertama tanpa harus menunggu pengguna menekan tombol "Terapkan".

### B. Perbaikan Logic Kueri Prisma (Server-Side)
*   **Target File:** Rute API yang melayani Laporan Shift (misal: `api/reports/shift/route.ts` atau *Server Action* terkait).
*   **Instruksi Timezone Safety:** 
    1. Tangkap parameter tanggal `YYYY-MM-DD` dari klien.
    2. Bentuk `startOfDay` dan `endOfDay` dengan sangat aman dan pastikan tidak tergeser oleh zona waktu UTC server. Jika Anda tidak menggunakan *library* seperti `date-fns`, pastikan Anda menyetel `Date` dengan kompensasi yang tepat.
*   **Instruksi Role Scoping (Wajib):**
    1. Cek peran pengguna yang memanggil API (`currentUser.role`).
    2. **Jika `CASHIER`:** Filter Prisma `where` wajib menggunakan `userId: currentUser.id`.
    3. **Jika `OWNER`:** **HAPUS** filter `userId`! Owner berhak melihat total keseluruhan transaksi dari semua kasir pada hari itu. (Gunakan filter `tenantId` atau ID Toko jika aplikasi ini *multi-tenant*).

Silakan eksekusi perbaikan logika ini sekarang. Pastikan data transaksi langsung muncul dan terkalkulasi (Total Pendapatan, Tunai, QRIS) dengan akurat!
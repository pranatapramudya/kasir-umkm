# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.58
**Fokus:** Implementasi Date Range Picker (Kalender) pada Rekap Komisi

## 1. Analisis Kebutuhan UX & Logika Bisnis
*   **Masalah:** Filter waktu menggunakan *dropdown* statis ("Hari Ini", "Bulan Ini") pada halaman Rekap Komisi terlalu kaku dan tidak mendukung siklus penggajian (*cut-off payroll*) kustom yang sering digunakan oleh UMKM (misal: tanggal 25 hingga 24).
*   **Solusi:** Mengganti *dropdown* dengan komponen Kalender (Date Range Picker) agar pemilik bisnis dapat memilih rentang tanggal secara bebas dan spesifik.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan pada UI filter dan sesuaikan parameter API untuk memproses rentang tanggal (*Date Range*). DILARANG memberikan *output* kode mentah.

### A. Perombakan Frontend (UI Kalender)
*   **Target File:** `app/admin/rekap-komisi/page-client.tsx` (atau lokasi komponen tabel komisi).
*   **Instruksi:**
    1. Hapus elemen `<select>` (Dropdown statis).
    2. Ganti dengan komponen **Date Range Picker** (Jika menggunakan `shadcn/ui`, gunakan komponen kalender dengan dukungan `mode="range"`. Jika tidak, gunakan input HTML5 ganda `<input type="date">` untuk `Start Date` dan `End Date`).
    3. Hubungkan *state* kalender tersebut (`from` dan `to`) untuk memicu proses `fetch` ulang data ke API setiap kali rentang tanggal diubah.
    4. Pastikan parameter URL API yang dipanggil menyertakan query string, contoh: `/api/commissions?start=2026-08-01&end=2026-08-10`.

### B. Penyesuaian Backend (API Prisma)
*   **Target File:** `app/api/commissions/route.ts`
*   **Instruksi:**
    1. Tangkap parameter pencarian (`searchParams`) yaitu `start` dan `end` dari URL *request*.
    2. Ubah tipe data string tanggal tersebut menjadi objek `Date` pada JavaScript/TypeScript.
    3. Di dalam kueri `prisma.transactionItem.findMany` (atau sejenisnya), tambahkan filter pada klausul `where` untuk waktu transaksi (misal `createdAt`), menggunakan operator kalibrasi batas:
       - `gte` (Greater than or equal) untuk `startDate`.
       - `lte` (Less than or equal) untuk `endDate`.
    4. Pastikan filter ini berjalan beriringan dengan filter keamanan isolasi `tenantId`/`userId` yang sudah ada.

Silakan eksekusi perbaikan komponen filter kalender ini agar perhitungan komisi menjadi fleksibel!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.39
**Fokus:** Ekspor Laporan Excel Dinamis (Harian/Bulanan/Tahunan)

## 1. Analisis Kebutuhan
*   **Kondisi Saat Ini:** Antarmuka (UI) halaman Analitik Premium sudah terbuka (Unlocked) untuk pengguna dalam masa *Trial*, namun belum memiliki fungsi nyata untuk penarikan data transaksi.
*   **Kebutuhan Bisnis:** Pengguna (*Owner*) memerlukan laporan pembukuan yang "lengkap dan rapi". Laporan ini wajib dapat diunduh dalam format `.xlsx` dengan kemampuan filter berdasarkan rentang waktu operasional (Harian, Bulanan, Tahunan).
*   **Tujuan:** Membangun *endpoint* API baru yang menarik data mentah dari *database* (Prisma), memformatnya menjadi tabel Excel yang rapi, dan memberikan kontrol UI kepada pengguna untuk memicu unduhan tersebut.

## 2. Instruksi Eksekusi untuk AI Agent
Fokus pada pembuatan fungsionalitas *Export to Excel* tanpa merusak *layout* UI yang sudah ada. Gunakan *library* standar Node.js untuk Excel seperti `xlsx` (SheetJS) atau `exceljs`.

### A. Penambahan UI Kontrol Ekspor (Frontend)
*   **Target File:** Halaman `app/admin/analytics/page.tsx`
*   **Instruksi:** 
    1. Di bagian atas halaman (di bawah Header "Analitik & Laporan Premium" atau di sudut kanan atas), tambahkan sebuah *Card* kecil atau *Toolbar* khusus untuk Ekspor Data.
    2. Sediakan elemen `Select` (Dropdown) untuk memilih **Periode Laporan**: 
        *   Hari Ini (Harian)
        *   Bulan Ini (Bulanan)
        *   Tahun Ini (Tahunan)
        *   *(Opsional: Semua Waktu)*
    3. Sediakan tombol *Call to Action* bertuliskan **"Unduh Laporan (Excel)"** dengan ikon *download*. Tombol ini harus memicu *fetching* ke API saat diklik.

### B. Pembuatan API Route Ekspor (Backend)
*   **Target File:** Buat *route handler* baru di `app/api/export/route.ts`.
*   **Instruksi Eksekusi API:**
    1. **Otentikasi & Keamanan:** Pastikan *route* ini mengambil *session/userId* dari Clerk. Tolak permintaan (`401 Unauthorized`) jika pengguna tidak terautentikasi atau jika sistem memvalidasi bahwa masa *trial/pro*-nya sudah habis.
    2. **Query Database (Prisma):** Terima parameter URL (misal: `?period=monthly`) dan gunakan Prisma untuk melakukan kueri tabel `Transaction`. Filter tanggal (`createdAt`) menggunakan operator `gte` (greater than or equal) dan `lte` (less than or equal) sesuai periode yang diminta.
    3. **Relasi Data:** Lakukan `include` pada *query* Prisma untuk menarik detail item keranjang (Produk) yang dibeli di setiap transaksi, agar laporan mendetail.

### C. Pemformatan Laporan Excel (Data Structuring)
*   **Instruksi Format Tabel:** Pastikan data yang dimasukkan ke dalam baris/kolom Excel sangat rapi (*business-ready*). Kolom wajib meliputi:
    *   `ID Transaksi` (atau Nomor Struk)
    *   `Tanggal & Waktu`
    *   `Nama Kasir` / `User ID`
    *   `Metode Pembayaran` (Tunai/QRIS)
    *   `Subtotal`
    *   `PPN`
    *   `Laba Bersih` (Margin)
    *   `Total Belanja`
*   **Crucial Formatting Rule:** Pastikan data uang/nominal (seperti Subtotal, PPN, Laba, Total) dikirim ke Excel dalam tipe data **Number / Float**, BUKAN String. Hal ini memastikan ketika *owner* membuka file tersebut, pengaturan *Region Format* Indonesia di OS mereka dapat otomatis merender angka tersebut menjadi format *Accounting* Rupiah tanpa mengalami *error* kalkulasi sum/rumus di Excel.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.97
**Fokus:** Ekspor Master Data ke Excel (.xlsx) Lengkap dengan Kalkulasi Proyeksi Pendapatan

## 1. Objektif Fitur
Mengganti format unduhan ekspor Superadmin dari CSV menjadi format Excel murni (`.xlsx`). File Excel ini harus memiliki format yang rapi (lebar kolom otomatis, *header* tebal) dan memuat kolom kalkulasi otomatis (rumus Excel atau *pre-calculated value*) untuk memproyeksikan potensi pendapatan tahunan jika *tenant* melakukan *upgrade* paket.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Persiapan Library
Jika *codebase* belum memiliki *library* untuk memanipulasi Excel murni, lakukan instalasi `exceljs` atau `xlsx` (SheetJS) melalui npm/pnpm. `exceljs` lebih disarankan karena dukungan format *styling* dan penyematan rumus (formula) yang sangat baik di Node.js.

### B. Modifikasi API Route Ekspor
Buka rute API ekspor data tenant yang sudah ada (contoh: `app/api/superadmin/export-tenants/route.ts`). Rombak logika pembuatannya dari *string* CSV menjadi *workbook* Excel:

1. **Pembuatan Worksheet & Header:**
   * Buat *worksheet* baru.
   * Tetapkan *header* kolom: No, Nama Toko, Kategori, Telepon, Tanggal Daftar, Status Paket, Status Sistem (ON/OFF), Omset Bulan Ini, **Potensi Upgrade Tahunan (Rp)**.
   * Berikan *styling* dasar pada baris *header* (tebal/bold, *background color*).

2. **Pengisian Data & Kalkulasi Otomatis:**
   * Lakukan iterasi data *tenant* dari Prisma.
   * Untuk kolom "Potensi Upgrade Tahunan", terapkan logika bisnis berikut:
     * Jika status paket saat ini adalah `TRIAL`, masukkan nilai asumsi harga paket Pro Tahunan (misal: Rp1.188.000).
     * Jika status sudah `PRO`, masukkan nilai pembaruan tahunan (*renewal*).
     * Ini bisa dihitung di *backend* dan dikirim sebagai angka biasa, ATAU disematkan sebagai formula Excel bawaan.
   * Terapkan format mata uang (Rupiah/Accounting) pada kolom Omset dan Potensi Upgrade.

3. **Penyesuaian Respons HTTP:**
   * Ubah respons *header* untuk Excel murni.
   * `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
   * `Content-Disposition: attachment; filename="Laporan_Tenant_PJTECH.xlsx"`
   * Konversi *workbook* menjadi *buffer* dan kembalikan sebagai `NextResponse`.

### C. Penyesuaian Frontend
Pastikan tombol "Tarik Data" di *Command Center* sudah siap menerima *response* berupa *blob* berformat `.xlsx` (bukan sekadar *text*), lalu memicu aksi unduh menggunakan `window.URL.createObjectURL(blob)` jika pemanggilan API dilakukan via *fetch*.

## 3. Output yang Diharapkan
Terapkan pembuatan file `.xlsx` beserta struktur kalkulasinya pada API. Berikan konfirmasi singkat *library* apa yang digunakan (`exceljs`/`xlsx`) dan konfirmasi bahwa *file* yang diunduh sudah berbentuk Excel rapi (bukan CSV).
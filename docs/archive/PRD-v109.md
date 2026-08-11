# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.09
**Fokus:** Hotfix Aggregation Logic (Tunai vs QRIS) & Cross-Device Responsiveness Audit

## 1. Analisis Bug (Logika Agregasi Gagal)
*   **Gejala:** Pada halaman Laporan Shift, Kartu "Total Pendapatan" berhasil menjumlahkan nominal (Rp 450.000), namun Kartu "Tunai (Kas Laci)" dan "QRIS" tetap menampilkan Rp 0. Padahal di tabel riwayat jelas terdapat transaksi dengan metode "CASH".
*   **Akar Masalah:** Terjadi ketidakcocokan string (String Mismatch) pada fungsi *reduce* atau kalkulasi *backend*. API gagal mengenali nilai `paymentMethod` dari database (misal: "CASH" vs "Tunai" atau "QRIS" vs "qris") sehingga kalkulasi pemisahan metode pembayaran gagal total.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan pada kueri agregasi dan audit layout UI secara menyeluruh. DILARANG memberikan *output* kode mentah.

### A. Perbaikan Logika Agregasi Pembayaran (Otomatisasi Penuh)
*   **Target File:** Rute API Laporan (`api/reports/shift/route.ts`) atau fungsi kalkulasi di `LaporanKasirClient.tsx`.
*   **Instruksi:**
    1. Periksa bagaimana Anda menjumlahkan total `Tunai` dan `QRIS`.
    2. Sesuaikan pengecekan kondisional (`if/else` atau `switch`) dengan nilai eksak yang disimpan di Prisma *database* Anda. 
    3. Gunakan validasi yang aman dan tidak sensitif huruf besar/kecil (Case-Insensitive). Contoh: 
       `if (method.toUpperCase() === 'CASH' || method.toUpperCase() === 'TUNAI') { totalTunai += total; }`
       `if (method.toUpperCase() === 'QRIS') { totalQris += total; }`
    4. Pastikan sistem berjalan 100% OTOMATIS. Nilai pada kartu tidak boleh diinput manual oleh pengguna.

### B. Audit Responsivitas (Cross-Device)
*   **Target File:** Halaman Kasir POS dan Laporan Shift.
*   **Instruksi:**
    1. **Kartu Metrik (Laporan Shift):** Gunakan Grid responsif yang baik.
       - Mobile (`< 768px`): `grid-cols-1` (menumpuk ke bawah).
       - Tablet (`md:`): `grid-cols-2` atau `grid-cols-3`.
       - Desktop (`lg:`): `grid-cols-3` (sejajar rapi).
    2. **Tabel Riwayat:** Berikan *wrapper* `overflow-x-auto` pada kontainer tabel. Jika diakses lewat Mobile, tabel dapat digeser ke kiri-kanan tanpa merusak *layout* halaman utama.
    3. **Konsistensi Layar Karyawan vs Owner:** Pastikan jarak (*margin/padding*) dan hierarki visual pada layar `CASHIER` sama rapinya dengan layar `OWNER` saat dibuka di Desktop, Tablet, dan Smartphone.

Silakan eksekusi perbaikan logika kalkulasi dan kelas Tailwind ini sekarang. Beritahu saya jika nilai Rp 450.000 sudah otomatis masuk ke dalam Kartu "Tunai (Kas Laci)"
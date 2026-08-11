# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.84
**Fokus:** Audit UI/UX Kritis & Validasi MVP Role Karyawan (CASHIER)

## 1. Objektif Audit
Melakukan inspeksi *codebase* secara menyeluruh untuk memastikan tidak ada *broken link* (tombol mati/mental) dan memastikan batasan wewenang (*Role-Based Access Control*) untuk Karyawan sudah memenuhi standar Minimum Viable Product (MVP) pada tiga sektor: F&B, Retail, dan Jasa.

## 2. Instruksi Audit 1: Keamanan Tombol & Navigasi (UI/UX)
Agen harus memindai seluruh komponen klien (`'use client'`) dan komponen server yang mengandung interaksi pengguna.
*   **Inspeksi `<Link>`:** Pastikan seluruh komponen Next.js `<Link>` memiliki properti `href` yang valid dan tidak berujung pada `#` atau rute mati yang menyebabkan *refresh* halaman yang tidak disengaja.
*   **Inspeksi `<Button>` dan Form:** Periksa semua aksi *Submit*. Pastikan tombol yang memicu mutasi data (POST/PATCH/DELETE) memiliki *state* `disabled={isLoading}` untuk mencegah *Double Submit* (pengguna nge-klik berkali-kali saat *loading* lambat).
*   **Laporan yang Diminta:** Sebutkan jika ada tombol atau *form* kritis yang belum memiliki perlindungan *loading state* atau *error handling* (seperti *toast notification* saat gagal).

## 3. Instruksi Audit 2: Validasi MVP Role "KARYAWAN/CASHIER"
Evaluasi struktur *database* (Prisma) dan *middleware/API routes* untuk memastikan *role* "CASHIER" sudah dibatasi dengan ketat sesuai standar fungsionalitas MVP berikut:

*   **Batasan Mutlak (Berlaku untuk semua sektor):**
    *   CASHIER **BISA**: Membuka *shift*, membuat transaksi/faktur baru, mencetak setruk, dan menutup *shift*.
    *   CASHIER **TIDAK BISA**: Menghapus produk, melihat laporan *profit/laba bersih* (hanya boleh melihat total omset *shift*-nya sendiri), mengakses menu langganan/billing, dan menghapus riwayat transaksi lama.
*   **Fungsionalitas Spesifik Sektor:**
    *   **F&B:** Apakah antarmuka/API kasir mendukung pemilihan meja (Table Number) dan catatan pesanan (Modifiers, cth: "Tanpa Gula")?
    *   **Retail:** Apakah pencarian produk sudah mendukung pencarian berdasarkan *barcode* (SKU) dan mencegah penjualan jika stok <= 0?
    *   **Jasa:** Apakah antarmuka transaksi memungkinkan penginputan "Nama Pelanggan/Catatan" untuk layanan yang tidak memerlukan stok fisik?

## 4. Output Laporan dari Agen
Berikan ringkasan laporan audit dengan format:
1. **Status Tombol & Form:** (Aman / Ada temuan yang perlu diperbaiki).
2. **Status MVP Karyawan:** (Apakah batasan role CASHIER sudah aman di level API dan UI? Apakah fitur F&B, Retail, dan Jasa sudah memadai untuk Kasir?).
3. **Rekomendasi Tindakan:** (Jika ada API route yang lupa dilindungi dari akses CASHIER, sebutkan file-nya).
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.64  
**Fokus:** Multi-Category Dynamic Excel (.xlsx) Import & Export Suite

## 1. Latar Belakang & Masalah
Sistem Kasir UMKM PJTech memiliki 4 model bisnis (Retail, F&B, Jasa/Servis, Rental/Properti). Namun sebelumnya, template impor dan ekspor data masih menggunakan format CSV statis hardcoded standar retail yang menimbulkan sejumlah kendala:
1. **Regional Setting Locale Mismatch:** Format `.csv` teks biasa sering berantakan saat dibuka di Microsoft Excel atau sistem operasi ber-regional Indonesia (isu delimiter koma vs titik koma).
2. **Ketidaksesuaian Kolom Bisnis Non-Retail:** Bisnis Jasa tidak memerlukan kolom stok melainkan kolom komisi staf dan deskripsi. Bisnis Rental memerlukan biaya operasional (B.Ops/Maintenance) dan deskripsi/fasilitas unit.
3. **Penyelarasan Header Laporan Universal:** Header laporan transaksi sebelumnya menggunakan istilah sempit (`"Armada"`, `"Terapis/Kapster"`) yang kurang representatif untuk properti sewa atau teknisi jasa.
4. **Ketiadaan Export Katalog:** Pemilik toko belum memiliki cara langsung untuk mengunduh seluruh katalog produk/layanan mereka ke dalam file Excel.

## 2. Solusi & Fitur yang Diterapkan

### A. Template Impor Dinamis (.xlsx Asli)
- Komponen `components/CsvImportModal.tsx` menerima prop `kategoriUsaha` dan menghasilkan file `.xlsx` asli via library SheetJS (`xlsx`).
- Template disesuaikan berdasarkan kategori:
  - **Retail / F&B:** `kodeBarang, name, category, hpp, hargaJual, stock, minStockThreshold`
  - **Jasa / Servis:** `name, category, hargaJual, employeeCommission, description`
  - **Rental / Properti:** `name, category, hpp (B.Ops), hargaJual, description`
- Formulir unggah mendukung format file `.xlsx`, `.xls`, dan `.csv`.

### B. Sinkronisasi Parser Backend Massal
- Endpoint `/api/products/bulk` diperbarui untuk memetakan kolom `description` ke database Prisma.
- Toleransi alias header:
  - `bOps`, `biayaOperasional` $\rightarrow$ `hpp`
  - `komisi`, `commission`, `komisiStaf` $\rightarrow$ `employeeCommission`
- Sanitasi teks mata uang dan pemisah ribuan otomatis dengan helper `parseNumber`.

### C. Penyelarasan Header Laporan Transaksi
- Endpoint `/api/export` dan `/api/admin/export-backup` memperbarui label header:
  - `"Armada"` $\rightarrow$ **`"Unit / Properti / Armada"`**
  - `"Terapis/Kapster"` $\rightarrow$ **`"Staf / Teknisi / Petugas"`**

### D. Export Katalog Produk Tenant
- Endpoint baru `/api/products/export` mengekspor seluruh katalog tenant ke file Excel `Katalog_Produk_[NamaToko].xlsx`.
- Tombol **"Export Data"** ditambahkan di samping "Import Data" pada halaman produk admin (`app/(protected)/admin/products/page-client.tsx`).

# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.61
**Fokus:** Perbaikan UI Mobile (Responsive Import Button) & Pembaruan Format Template Data

## 1. Analisis Masalah
- **UI Issue:** Pada perangkat Mobile, susunan tombol "Tambah Barang" dan "Import Data" di halaman Empty State Manajemen Produk (dan mungkin di header tabel) saling bertabrakan/terpotong hingga keluar dari batas kontainer layar.
- **UX/Business Issue:** Target pengguna (UMKM) sangat kesulitan mengelola dan memahami struktur file `.csv` mentah. Mereka membutuhkan format Spreadsheet/Excel standar yang sel terkolom dengan rapi.

## 2. Instruksi Eksekusi (UI & Template Logic Fix)
**Target File:** Komponen halaman Manajemen Produk (terutama blok UI *Empty State* dan *Header Action*).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE KEPADA SAYA):**

**A. Responsivitas Tombol (Mobile Fix):**
1. Evaluasi *wrapper* `<div>` yang membungkus tombol "Tambah Barang" dan "Import Data".
2. Ubah *class* Tailwind dari yang awalnya memaksa sebaris (misal: `flex-row space-x-4`) menjadi reponsif: gunakan `flex flex-col sm:flex-row gap-3 w-full`. 
3. Pastikan pada layar *mobile*, tombol tersebut menumpuk rapi ke bawah dan mengambil lebar penuh (`w-full`), namun kembali sejajar menyamping saat diakses via Desktop/Tablet (`sm:`).

**B. Evolusi Template (Dari CSV mentah ke format Terstruktur):**
1. Ganti fungsi "Download Template CSV" menjadi "Download Template Excel/Data". 
2. **Opsi 1 (Sangat Disarankan tanpa library berat):** Anda bisa mempertahankan logika pembacaan `.csv` di *client*, namun saat user mengunduh template, berikan file yang sudah diformat dengan pemisah baku atau berikan instruksi UI yang tegas agar mereka menggunakan *Google Sheets* / *Excel* dan menyimpannya sebagai format yang terbaca rapi.
3. **Opsi 2 (Jika Anda siap menambahkan dependensi ringan):** Jika Anda harus mengintegrasikan *parser* Excel sejati, pastikan pustaka tersebut di-*load* secara dinamis (`next/dynamic` atau *dynamic import* fungsi) agar skor *Lighthouse Mobile* kita tidak terjun kembali. 

Silakan perbaiki CSS layout tombol agar tidak terpotong di HP, dan evaluasi mekanisme *template* unduhan agar lebih ramah bagi akal sehat pelaku UMKM. Lapor jika UI sudah sempurna di layar sempit!
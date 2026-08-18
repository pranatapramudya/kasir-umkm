# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.59
**Fokus:** Bug Fix - Dynamic Copywriting Excel Export & Strict Tenant Data Isolation

## 1. Analisis Masalah
Berdasarkan hasil unduhan *file* `Laporan_Transaksi.xlsx`, terdapat dua isu kritikal pada fitur *Export to Excel*:
1. **Copywriting Statis (UX Clutter):** *Header* kolom di dalam *file* Excel di- *hardcode* menggunakan terminologi Retail (contoh: "Total Belanja"). Ini tidak relevan untuk pengguna modul JASA atau RENTAL.
2. **Potensi Data Leak (Security Risk):** Harus ada jaminan mutlak bahwa fungsi yang menarik data untuk diubah menjadi `.xlsx` telah mengimplementasikan *Tenant Isolation*. Tidak boleh ada sebaris data pun dari entitas bisnis lain yang bocor ke dalam dokumen unduhan ini.

## 2. Instruksi Eksekusi (Query Filtering & Dynamic Excel Mapping)
**Target File:** Fungsi *Handler* atau API *Route* yang mengeksekusi `Export to Excel` (contoh: yang menggunakan *library* `xlsx` atau `exceljs`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kunci Keamanan Tenant (Strict Isolation / RLS):**
1. Buka fungsi *query* (Supabase/Prisma) yang digunakan untuk mengambil data transaksi sebelum di- *export* ke Excel.
2. Pastikan *query* tersebut **WAJIB** memiliki filter *where* klausul `tenant_id` atau `store_id` yang sama persis dengan *user* yang sedang melakukan *request*.
3. *(Opsional namun disarankan):* Jika menggunakan Supabase RLS (Row Level Security), pastikan fungsi *export* ini menggunakan klien Supabase yang memiliki *context* otentikasi *user* saat ini, BUKAN menggunakan `service_role_key` yang bisa membypass semua kebijakan keamanan.

**B. Implementasi Header Dinamis (Excel Copywriting):**
1. Sebelum data di- *map* menjadi baris (*rows*) Excel, buat variabel *header* dinamis berdasarkan parameter `businessType` dari entitas tersebut.
2. **Mapping Kolom "Pelanggan":**
   - Jika `RENTAL`: Ubah *header* menjadi **"Nama Penyewa"**.
   - Jika `JASA` / `FNB` / `RETAIL`: Gunakan **"Nama Pelanggan"**.
3. **Mapping Kolom Nominal Uang:**
   - Jika `RENTAL`: Ubah *header* menjadi **"Total Sewa (Rp)"**.
   - Jika `JASA`: Ubah *header* menjadi **"Total Tagihan (Rp)"**.
   - Jika `FNB` / `RETAIL`: Ubah *header* menjadi **"Total Belanja (Rp)"**.
4. Terakhir, jadikan data dinamis tersebut sebagai *header* baris pertama pada *worksheet* Excel yang dihasilkan.

Silakan perbaiki sistem *export* ini! Lapor kembali jika dokumen Excel yang diunduh sudah menggunakan istilah yang tepat untuk masing-masing bisnis dan keamanan data telah digembok dengan Tenant ID!
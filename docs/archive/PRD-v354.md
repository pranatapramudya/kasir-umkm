# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.54
**Fokus:** Bug Fix - Isolasi Field "Catatan Tarif" pada Form Produk (Strict Isolation)

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada *modal* `Tambah Produk Baru` (seperti pada image_667924.png), terdapat *input field* **"Catatan Tarif / Area Layanan (Opsional)"**. 
Saat ini, *field* tersebut bocor dan muncul di entitas bisnis non-rental (seperti Retail, FNB, dan Jasa). Hal ini menyebabkan *cognitive overload* dan kebingungan bagi pengguna karena produk makanan atau barang eceran tidak memiliki "Tarif Area Luar Kota". *Field* ini harus dikunci eksklusif hanya untuk bisnis Rental.

## 2. Instruksi Eksekusi (Conditional Form Rendering)
**Target File:** Komponen Form Produk/Layanan (contoh: `ProductFormModal.tsx`, `AddProductModal.tsx`, atau komponen sejenis yang merender form tersebut).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Strict Isolation pada Input Catatan Tarif:**
1. Buka komponen yang bertugas me- *render* form penambahan atau pengubahan data produk.
2. Temukan blok elemen UI (label dan *textarea*) untuk **"Catatan Tarif / Area Layanan (Opsional)"**.
3. Terapkan *conditional rendering* ketat:
   - *Field* ini **HANYA BOLEH DI-RENDER** jika pengguna yang sedang *login* (tenant) memiliki `businessType === 'RENTAL'`.
   - Pastikan *field* ini hilang sepenuhnya dari struktur DOM form jika entitas adalah `FNB`, `RETAIL`, atau `JASA`.

**B. Verifikasi Payload Data (Form State):**
1. Pastikan logika penyusunan *payload* data (saat tombol "Simpan Produk" diklik) tidak *crash* atau *error* saat *field* ini tidak ada di UI (misalnya untuk bisnis FNB, *value* catatan tarif otomatis diset menjadi `null` atau `""` tanpa menimbulkan peringatan dari sistem validasi form).

Silakan amputasi *field* ini dari bisnis non-rental! Lapor kembali jika form tambah produk milik bos Jasa, F&B, dan Retail sudah menjadi lebih ringkas dan relevan!
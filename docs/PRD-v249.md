# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.49
**Fokus:** Perbaikan "Ghost Error" Duplicate SKU pada Kategori Non-Retail (F&B/Jasa)

## 1. Analisis Masalah
Saat QA menginput menu F&B, muncul error "Kode Barang (SKU) sudah digunakan". Padahal, field SKU sengaja disembunyikan di UI untuk kategori bisnis F&B. 
Penyebabnya: Frontend mengirim string kosong (`""`) atau `undefined` untuk field SKU. Karena Prisma schema menggunakan `@unique` pada kolom `sku`, input kedua yang bernilai kosong (`""`) akan ditolak oleh database sebagai data duplikat.

## 2. Instruksi Eksekusi (Backend/Submit Logic)
**Target File:** API Route pembuatan produk (misal: `/api/products/route.ts`) ATAU fungsi `onSubmit` di dalam form komponen Client.

1. **Injeksi Auto-Generate SKU Siluman:**
   - Sebelum data dikirim ke `prisma.product.create`, periksa *payload* `sku`.
   - JIKA `sku` kosong (`""`), `null`, atau `undefined`, sistem WAJIB membuat *string* unik secara otomatis di balik layar.
   - **Gunakan formula ini untuk keamanan:**
     ```typescript
     const generatedSku = payload.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
     ```
2. **Tanpa Perubahan UI:**
   - Anda tidak perlu memunculkan field SKU di UI kategori F&B. Biarkan UI tetap bersih seperti saat ini. Kita hanya menyelesaikan masalah ini di level data (*payload manipulation*).

Silakan perbaiki logika pencegatan data ini sekarang. Pastikan QA bisa menambahkan puluhan menu F&B tanpa pernah lagi melihat error duplikat SKU!
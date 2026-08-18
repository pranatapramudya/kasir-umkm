# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.60
**Fokus:** Bug Fix Re-Iteration - Kegagalan Evaluasi Variabel "businessType" pada Export Excel

## 1. Analisis Masalah
Berdasarkan hasil Quality Assurance (QA) pada file hasil unduhan Excel (`Laporan_Transaksi.xlsx`), pemisahan data/Tenant Isolation telah berhasil. Namun, **Dynamic Header Copywriting GAGAL**. 
File yang diunduh dari akun RENTAL dan JASA masih menggunakan header fallback: "Nama Pelanggan" dan "Total Belanja (Rp)". Hal ini mengindikasikan bahwa variabel penentu tipe bisnis (misalnya `businessType` atau `storeCategory`) di dalam API Route `/api/export/route.ts` tidak terbaca (undefined) atau evaluasi `if/else` salah sasaran.

## 2. Instruksi Eksekusi (Variable Tracing & Fallback Fix)
**Target File:** API Route `app/api/export/route.ts` (atau handler export Excel).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Audit Variabel Pengkondisian (Condition Tracing):**
1. Buka kembali file API route export Excel.
2. Telusuri dari mana Anda mengambil variabel tipe bisnis (apakah dari parameter *query string* di URL, payload *request body*, atau ditarik langsung dari tabel *store/tenant* di database).
3. Jika variabel tersebut ditarik dari URL atau *state*, pastikan pengirimannya dari *Client Component* sudah benar dan tidak *undefined*.
4. Jika ditarik dari *database*, pastikan nama propertinya sesuai dengan skema (misalnya `store.businessType` atau `store.category`).

**B. Perbaikan Blok Kondisional (Strict Mapping):**
1. Perbaiki blok logika pemetaan *header* Excel Anda.
2. Gunakan validasi eksplisit dengan huruf kapital/kecil yang sesuai (contoh: `if (type === 'RENTAL')`).
3. Pastikan `Total Sewa (Rp)` dan `Nama Penyewa` benar-benar disuntikkan ke dalam *header array* xlsx untuk kondisi `RENTAL`.
4. Pastikan `Total Tagihan (Rp)` disuntikkan untuk `JASA`.

Silakan telusuri kenapa variabel tipe bisnis Anda tidak terbaca di *backend*! Lapor kembali setelah Anda menemukan sumber "undefined"-nya dan berhasil memaksakan *header* yang benar!
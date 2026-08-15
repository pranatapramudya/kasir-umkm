# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.56
**Fokus:** Perbaikan Zona Waktu Analitik & Logika Query Produk "Kurang Laris"

## 1. Analisis Masalah
Terdapat dua *bug* manipulasi data pada dashboard Analitik:
- **Grafik Jam Sibuk (Timezone Issue):** Menampilkan titik puncak pada pukul 07:00 padahal transaksi riil dilakukan pada pukul 14:00 WIB. Agregasi jam saat ini mengandalkan waktu UTC dari database tanpa konversi ke zona waktu pengguna (UTC+7).
- **Analitik Produk (Lazy Frontend Sorting):** Filter "Kurang Laris" saat ini hanya membalik urutan (*reverse array*) dari data "Paling Laris" di sisi klien. Seharusnya, saat filter diubah, sistem melakukan *query* nyata ke *database* untuk mencari produk dengan volume penjualan terendah (termasuk yang penjualannya 0).

## 2. Instruksi Eksekusi (Backend Logic & Query)
**Target File:** API Endpoint untuk Analitik (misal: `app/api/analytics/route.ts`).

**A. Perbaikan Zona Waktu (Jam Sibuk):**
- Saat melakukan iterasi dan *grouping* (pengelompokan) data transaksi berdasarkan jam (`createdAt`), WAJIB konversi waktu UTC tersebut ke zona waktu lokal (gunakan offset `+7` untuk Asia/Jakarta) sebelum mengekstrak jamnya. 
- Anda bisa menggunakan method JavaScript bawaan untuk memanipulasi *offset* sebelum mengelompokkannya ke dalam koordinat sumbu X pada *chart*.

**B. Perbaikan Query "Kurang Laris":**
- JANGAN lakukan manipulasi `reverse()` array di sisi *frontend*. Frontend harus memicu *fetch* ulang atau API sudah harus mengirimkan dua set data terpisah (`topProducts` dan `bottomProducts`).
- **Logika Bottom Products:**
  - Lakukan agregasi untuk mencari produk dengan jumlah penjualan paling sedikit di dalam rentang tanggal yang dipilih.
  - **Sangat Disarankan:** Ambil data master produk dari tabel `Product` (dengan filter `storeId` yang sesuai), lalu cocokkan dengan data di `TransactionItem`. Jika sebuah produk tidak ada di `TransactionItem` pada rentang tanggal tersebut, maka jumlah penjualannya adalah `0`. 
  - Urutkan (*sort*) secara *ascending* (mulai dari 0 ke atas), dan ambil 5 produk teratas dari urutan bawah tersebut.

Silakan perbaiki logika *backend* analitik ini agar data yang disajikan valid, akurat, dan tidak menipu mata Owner UMKM. Lapor jika sudah selesai di-push!
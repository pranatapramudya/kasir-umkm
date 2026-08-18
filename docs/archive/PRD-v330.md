# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.30
**Fokus:** Global Audit Copywriting & Implementasi "Dynamic Terminology Dictionary"

## 1. Analisis Masalah
Pengguna (Tenant) SaaS ini berasal dari berbagai model bisnis (Rental, Jasa, F&B, Retail). Saat ini, masih banyak *hardcoded text* yang menggunakan terminologi Retail (seperti "Tren Penjualan", "HPP", "Faktur", "Produk") yang tersebar di Dashboard, Analitik, dan Laporan. Memperbaiki teks ini satu per satu per komponen sangat tidak efisien. Diperlukan sebuah arsitektur *Dictionary/Helper* terpusat untuk me-render *copywriting* secara dinamis berdasarkan `businessType` tenant yang sedang aktif, tanpa terjadi kebocoran (bleeding) teks antar model bisnis.

## 2. Instruksi Eksekusi (System-wide Refactoring)
**Target File:** Buat file *helper/utility* baru (contoh: `utils/terminology.ts`), lalu terapkan ke komponen global seperti `DashboardClient`, `Laporan`, dan komponen terkait lainnya.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Buat Centralized Terminology Helper:**
Buat sebuah *utility function* (misal `getTerms(businessType)`) yang mengembalikan *object* berisi kosakata khusus sesuai model bisnis:
1. **RETAIL (Default):**
   - item: "Produk", transaction: "Penjualan", pos: "Kasir", cost: "HPP", chartTitle: "Tren Penjualan".
2. **RENTAL/TRAVEL:**
   - item: "Armada/Unit", transaction: "Penyewaan", pos: "Transaksi Sewa", cost: "Biaya Operasional", chartTitle: "Tren Penyewaan".
3. **JASA (Klinik/Salon/Barbershop):**
   - item: "Layanan", transaction: "Order Jasa", pos: "Kasir Jasa", cost: "Biaya Alat/Bahan", chartTitle: "Tren Layanan".
4. **F&B (Resto/Kafe):**
   - item: "Menu", transaction: "Pesanan", pos: "Kasir Resto", cost: "HPP/Bahan Baku", chartTitle: "Tren Pesanan".

**B. Refactor Teks di Halaman Dashboard (Sesuai Konteks Gambar):**
Gunakan *helper* di atas untuk me-render teks di halaman Dashboard:
1. Ubah judul grafik dari statis "Tren Penjualan" menjadi dinamis (misal `terms.chartTitle`).
2. Pada *card* "Laba Bersih", ubah teks *subtitle* "Pendapatan dikurangi HPP & Pengeluaran" secara dinamis (ganti kata HPP sesuai *terms*).
3. Pada *card* "Total Transaksi", ubah teks "Faktur pada periode ini" menjadi "Transaksi pada periode ini" agar universal.

**C. Lakukan Global Audit (Sapu Jagat):**
1. Lakukan *global search* di seluruh *codebase* (terutama di folder `app/admin/`) untuk mencari kata kunci statis berbahasa Indonesia berikut: `"Produk"`, `"Penjualan"`, `"HPP"`, `"Kasir"`.
2. Ganti teks statis tersebut dengan pemanggilan fungsi *Dynamic Terminology* yang sudah dibuat, atau gunakan *conditional logic* (if-else/ternary) berdasarkan *state* `isJasa`, `isRental`, `isFnB`, `isRetail`.
3. Pastikan Audit mencakup halaman: Analitik, Laporan Shift, Rekap Komisi, dan Pengaturan.

Silakan lakukan perombakan arsitektur teks ini! Lapor jika sistem kamus dinamis sudah aktif dan seluruh bahasa di Dashboard/Laporan sudah beradaptasi 100% dengan tipe bisnis yang login (termasuk Jasa dan F&B)!
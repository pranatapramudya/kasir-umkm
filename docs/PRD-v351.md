# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.51
**Fokus:** Integrasi Tautan Afiliasi Shopee pada Rekomendasi Hardware

## 1. Analisis Masalah
Melanjutkan PRD-v350, tombol "Beli di Tokopedia" telah dihapus dan strategi diubah menjadi "Shopee Exclusive". Saat ini, tautan afiliasi (Affiliate Links) resmi dari kreator telah tersedia. Tautan-tautan ini harus dipetakan (di- *mapping*) secara presisi ke dalam *array* atau objek data rekomendasi perangkat keras, agar setiap tombol "Beli di Shopee" mengarah ke halaman produk yang tepat.

## 2. Instruksi Eksekusi (URL Mapping & Routing)
**Target File:** Komponen `Rekomendasi Alat Kasir` (tempat objek/array data produk perangkat keras didefinisikan).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Injeksi Tautan Afiliasi (Mapping URL):**
Petakan URL berikut ke dalam properti `link` (atau *href* tombol Shopee) pada masing-masing objek produk:

1. **Tablet Kasir Android 10 Inch**
   - URL: `https://s.shopee.co.id/5q7T6w0O0h`
2. **Printer Kasir Thermal (58mm / 80mm)** -> *(Khusus JASA, FNB, RETAIL)*
   - URL: `https://s.shopee.co.id/8Koo5bQozu`
3. **Printer Tinta/Dokumen A4 (Thermal A4 Portable)** -> *(Khusus RENTAL)*
   - URL: `https://s.shopee.co.id/7fZ7lQROKy?share_channel_code=1`
4. **Stand Holder & Cash Drawer (Atau Paket Kasir Laci)**
   - URL: `https://s.shopee.co.id/1Lf3krJlpq?share_channel_code=1`
5. **Scanner Barcode USB/Wireless** -> *(Khusus Ekstra untuk RETAIL)*
   - URL: `https://s.shopee.co.id/W5wlObdLM?share_channel_code=1`

**B. Finalisasi UX Target Blank:**
1. Pastikan setiap tombol "Beli di Shopee" menggunakan properti `target="_blank"` dan `rel="noopener noreferrer"`.
2. Hal ini sangat krusial agar saat pengguna mengeklik tombol tersebut, aplikasi LumeStack tidak tertutup, melainkan membuka *tab* baru atau langsung membuka aplikasi Shopee di *smartphone* mereka.

Silakan masukkan tautan-tautan afiliasi ini ke dalam sistem! Lapor kembali jika seluruh tombol sudah terhubung dengan *link* yang tepat dan membuka di *tab* baru!
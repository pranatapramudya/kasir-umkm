# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.50
**Fokus:** Dynamic Hardware Recommendations (Peralatan Kasir Spesifik per Bisnis) & Shopee Exclusive Links

## 1. Analisis Masalah
Berdasarkan evaluasi pada halaman `Rekomendasi Alat Kasir` (Rekomendasi Hardware):
1. **Shopee Exclusive Strategy:** Keputusan bisnis menetapkan hanya akan menggunakan tautan rujukan (referral) ke platform Shopee. Keberadaan tombol "Beli di Tokopedia" memakan ruang UI dan harus dihapus.
2. **Static Printer Recommendation (Fatal UX):** Rekomendasi "Printer Tinta/Dokumen A4" saat ini bersifat statis untuk semua pengguna. Padahal, printer A4 **HANYA** dibutuhkan oleh bisnis **Rental/Travel** (untuk Surat Jalan/Kontrak). Bisnis FNB, Retail, dan Jasa membutuhkan Printer Thermal (58mm/80mm) untuk mencetak struk.

## 2. Instruksi Eksekusi (Conditional Object Mapping & UI Cleanup)
**Target File:** Komponen Halaman `Rekomendasi Alat Kasir` (contoh: `HardwareClient.tsx` atau sejenisnya).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Penghapusan Tombol Tokopedia (Shopee Only):**
1. Buka komponen yang me- *render* daftar perangkat keras.
2. Hapus secara permanen elemen tombol "Beli di Tokopedia" pada setiap kartu produk.
3. Ubah desain tombol "Beli di Shopee" menjadi tombol utama (*primary button*) yang mengambil lebar penuh (full-width) pada kartu tersebut, dengan aksen warna Oranye khas Shopee.

**B. Rendering Dinamis Spesifik per Bisnis (Dynamic Array/Mapping):**
1. Jangan gunakan susunan *array* perangkat keras yang statis. Buat logika *conditional* berdasarkan `businessType` pengguna yang sedang login.
2. **Kondisi RENTAL:** Tampilkan kartu rekomendasi: "Tablet Android", "Printer Tinta/Dokumen A4", dan "Stand Holder & Cash Drawer".
3. **Kondisi FNB, JASA, & RETAIL:** 
   - Ganti kartu "Printer Tinta A4" menjadi **"Printer Kasir Thermal (58mm / 80mm)"**. 
   - Ubah deskripsinya menjadi: *"Printer praktis dengan koneksi Bluetooth/USB untuk mencetak struk pelanggan dan tiket dapur tanpa perlu tinta."*
4. *(Opsional/Nilai Plus):* Khusus untuk kondisi **RETAIL**, Anda boleh menambahkan satu kartu rekomendasi ekstra yaitu **"Scanner Barcode USB/Wireless"** untuk memaksimalkan pengalaman kasir minimarket.

Silakan bangun etalase cerdas ini! Lapor kembali jika tombol Tokopedia sudah musnah dan bos F&B/Retail kini direkomendasikan untuk membeli Printer Thermal yang benar!
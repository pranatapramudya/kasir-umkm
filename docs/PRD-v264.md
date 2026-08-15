# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.64
**Fokus:** Penegasan Edukasi UI Link Booking untuk Kategori Jasa DAN Rental

## 1. Analisis Masalah
Pada iterasi perbaikan sebelumnya (PRD-v262), edukasi fungsi "Link Booking Publik" kemungkinan hanya tereksekusi pada kategori bisnis Jasa, atau belum terimplementasi sempurna untuk kategori Rental. Pemilik bisnis Rental sangat membutuhkan edukasi UI ini agar mereka memahami bahwa *link* tersebut berfungsi sebagai etalase ketersediaan armada mereka di mata publik.

## 2. Instruksi Eksekusi (Frontend Logic)
**Target File:** Komponen `Informasi Toko` (Halaman Manajemen Link Booking Publik).

**Tugas Anda (EKSEKUSI TANPA MEMBERIKAN KODE KEPADA SAYA):**
1. **Pengecekan Tipe Bisnis (Business Type Validation):**
   - Pastikan komponen Alert/Kotak Edukasi yang berisi "💡 Tips" di-*render* **JIKA** tipe bisnis toko saat ini adalah `JASA` **ATAU** `RENTAL`.
   - JIKA tipe bisnis adalah `RETAIL` atau `FNB`, *link booking* publik dan pesan edukasinya sebaiknya disembunyikan (karena mereka biasanya tidak memerlukan *booking* waktu/hari, melainkan *direct order/takeaway*).

2. **Dinamisasi Pesan Edukasi (Strict Override):**
   - **Tipe JASA:** Render teks ini secara presisi:
     *"💡 Tips: Bagikan link ini di bio Instagram atau WhatsApp Anda. Pelanggan dapat melihat layanan Anda dan memesan slot waktu secara mandiri, sehingga Anda tidak perlu membalas chat satu per satu."*
   - **Tipe RENTAL:** Render teks ini secara presisi:
     *"💡 Tips: Berikan link ini kepada calon penyewa. Mereka dapat melihat armada/barang mana yang sedang tersedia dan langsung melakukan *booking* sesuai tanggal, sehingga Anda terhindar dari bentrok jadwal penyewaan."*

Silakan perbaiki logika *conditional rendering* ini. Pastikan *owner* Rental mendapatkan panduan UI yang sama jelasnya dengan *owner* Jasa! Lapor jika logika ini sudah ditambal.
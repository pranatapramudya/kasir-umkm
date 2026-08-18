# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.47
**Fokus:** Bug Fix - Penghapusan Total Kartu "Informasi Pembayaran" untuk Bisnis Non-Rental

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada halaman `Informasi Toko`, *card* pengaturan **Informasi Pembayaran** (Bank & Nomor Rekening) masih muncul saat pengguna masuk sebagai entitas bisnis `JASA`.
Secara logika operasional, bisnis Jasa (Klinik/Salon/Barbershop), Retail, dan F&B melakukan transaksi pembayaran secara langsung di tempat (di Kasir POS) pasca-layanan/pembelian. Mereka tidak memerlukan pembayaran DP atau transfer pra-kedatangan, sehingga tidak perlu mengatur informasi rekening publik. Modul ini harus diisolasi secara ekstrem hanya untuk bisnis `RENTAL`.

## 2. Instruksi Eksekusi (Strict Component Unmounting)
**Target File:** Komponen Halaman Pengaturan Toko (contoh: `InformasiTokoClient.tsx` atau komponen yang me-render UI pada gambar).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Strict Isolation pada Pengaturan Pembayaran:**
1. Buka komponen yang me- *render* area halaman `Informasi Toko` (tempat di mana form *Slug/Link Booking* dan *Informasi Pembayaran* berada).
2. Temukan kontainer atau *Card* pembungkus utama untuk bagian **"Informasi Pembayaran"** (yang berisi input WhatsApp Admin, Nama Bank, Nomor Rekening, Atas Nama).
3. Ubah *conditional rendering*-nya secara radikal. Area ini **HANYA BOLEH DI-RENDER** jika `businessType === 'RENTAL'`.
4. Jika `businessType` adalah `JASA`, `FNB`, atau `RETAIL`, pastikan *Card* tersebut hilang sepenuhnya dari struktur DOM (bukan di- *disable* atau di- *hidden*, tapi benar-benar tidak di- *render*).
5. Pastikan komponen di atasnya ("Informasi Toko / Slug Toko") tetap muncul dan berfungsi normal untuk Jasa dan Rental.

Silakan amputasi komponen pembayaran ini dari bisnis Jasa! Lapor kembali jika halaman pengaturan toko milik bos Jasa kini sudah bersih dan hanya menampilkan pengaturan Link Booking saja tanpa embel-embel bank!
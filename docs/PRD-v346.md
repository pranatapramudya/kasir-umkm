# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.46
**Fokus:** Dynamic Copywriting Informasi Pembayaran & Isolasi Logika DP (Down Payment)

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada menu `Informasi Pembayaran` (pengaturan rekening bank untuk konfirmasi WhatsApp), terdapat dua penyesuaian fungsional yang krusial untuk mencegah kebocoran logika antar tipe bisnis:
1. **Terminologi Label Bank:** Untuk entitas bisnis **Rental/Travel**, pengguna juga menerima pembayaran via Dana, GoPay, OVO, dll. Label harus disesuaikan menjadi "Nama Bank / E-Wallet".
2. **Isolasi Logika DP 50%:** Bisnis F&B, Retail, dan Jasa **TIDAK MENGGUNAKAN** sistem Down Payment (DP). Sistem DP (seperti instruksi transfer 50% di halaman publik/invoice) mutlak HANYA berlaku untuk bisnis Rental.

## 2. Instruksi Eksekusi (Conditional Rendering & Copywriting Isolation)
**Target File:** Komponen Pengaturan `Informasi Pembayaran` (Toko) dan Halaman *Booking Publik* (Bagi pelanggan).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Dynamic Labeling (Pengaturan Pembayaran):**
1. Buka komponen UI tempat pengaturan `Informasi Pembayaran` dirender (seperti pada gambar referensi).
2. Terapkan *conditional rendering* pada label input "Nama Bank".
   - Jika `businessType === 'RENTAL'`, ubah label menjadi: **"Nama Bank / E-Wallet"**. Ubah juga *placeholder*-nya menjadi: *"BCA, Mandiri, Dana, GoPay, dll."*
   - Jika `businessType === 'JASA'`, biarkan label tetap "Nama Bank" (atau sesuaikan jika Jasa membutuhkan transfer, meski jarang).
   - **Isolasi Ekstrem:** Jika `businessType === 'FNB'` atau `'RETAIL'`, sembunyikan sepenuhnya form "Informasi Pembayaran" ini jika mereka tidak memiliki fitur reservasi online sama sekali!

**B. Isolasi Logika Down Payment (DP 50%) di Halaman Publik:**
1. Buka komponen *Booking Form* atau Halaman Sukses Reservasi Publik yang dilihat oleh pelanggan eksternal.
2. Audit semua teks/instruksi yang menyebutkan **"Transfer DP"**, **"Down Payment 50%"**, atau instruksi mengunggah bukti transfer.
3. Bungkus seluruh elemen terkait pembayaran DP tersebut ke dalam blok pengecekan `if (businessType === 'RENTAL')`.
4. Jika bisnis adalah `JASA`, pastikan teks sukses reservasi hanya menampilkan instruksi kedatangan, contoh: *"Antrean Anda berhasil dicatat. Silakan datang sesuai jadwal dan lakukan pembayaran di Kasir."* TANPA menampilkan nomor rekening atau permintaan DP.

Silakan amankan logika pembayaran ini! Lapor kembali jika label Bank sudah dinamis dan logika DP sudah 100% diisolasi hanya untuk bos Rental!
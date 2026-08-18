# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.40
**Fokus:** Conditional Print Media (Pemisahan Format Kertas Thermal vs A4) & Layout Surat Jalan

## 1. Analisis Masalah
Perbaikan `PRD-v339` berhasil menerapkan ukuran kertas Thermal (80mm), namun berisiko memengaruhi seluruh komponen cetak di aplikasi. Untuk entitas bisnis **Rental/Travel**, dokumen transaksi yang dicetak adalah "Surat Jalan / Invoice Sewa" yang bersifat formal, membutuhkan tabel detail, serta ruang untuk tanda tangan serah terima. Ukuran 80mm sangat tidak layak untuk dokumen ini. Format cetak harus bersifat kondisional: **A4 untuk Rental**, dan **Thermal 80mm untuk F&B/Retail/Jasa**.

## 2. Instruksi Eksekusi (Conditional Print Styles & Document Layout)
**Target File:** Komponen Induk Cetak (Print Wrapper), Komponen `SuratJalan.tsx` (atau sejenisnya untuk Rental), dan konfigurasi CSS Print Global.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pisahkan Aturan Ukuran Kertas (Conditional Print Logic):**
1. Cabut aturan `@page { size: 80mm auto; }` dari file CSS Global agar tidak memengaruhi seluruh sistem secara membabi buta.
2. Terapkan ukuran cetak ini di level *Component* atau injeksikan `<style>` secara dinamis berdasarkan `businessType` atau jenis dokumen yang sedang dirender.
3. **Logika Kondisional:**
   - Jika yang dicetak adalah Struk/Tiket Dapur (untuk RETAIL, FNB, JASA): Gunakan injeksi CSS `@page { size: 80mm auto; }`.
   - Jika yang dicetak adalah Surat Jalan/Invoice Sewa (untuk RENTAL): Gunakan injeksi CSS `@page { size: A4 portrait; margin: 10mm; }` dan atur lebar kontainer dokumen (*wrapper*) menjadi ukuran A4 standar (misal `max-w-[210mm]` atau biarkan merespons penuh ukuran kertas A4).

**B. Optimalisasi Layout Surat Jalan Rental (A4):**
1. Buka komponen yang merender tampilan cetak untuk bisnis Rental.
2. Pastikan susunan visualnya menyerupai dokumen formal (menggunakan *Kop Surat* / Header Toko di tengah atau atas, bukan sekadar struk memanjang).
3. Buat tabel informasi penyewaan yang rapi (menampilkan Nama Armada, Plat Nomor, Durasi, Harga, Total).
4. **Wajib Tambahkan:** Di bagian paling bawah dokumen, buat dua kolom sejajar untuk **Area Tanda Tangan** (Kiri: "Penyewa / Supir", Kanan: "Admin / Petugas").

Silakan bangun logika percetakan dinamis ini! Lapor kembali jika sistem sudah otomatis mencetak struk kecil untuk F&B, dan mencetak dokumen A4 rapi berkolom tanda tangan jika yang sedang login adalah bos Rental!
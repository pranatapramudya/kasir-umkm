# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.55
**Fokus:** Bug Fix - Dynamic Copywriting Subteks "Kas Laci" pada Laporan Shift

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada halaman `Laporan Shift`, terdapat kebocoran konteks bisnis pada kartu rekapan "Tunai (Kas Laci)". Teks bantuan (subteks) saat ini bersifat statis dan menampilkan kalimat: *"*Hanya menghitung uang Lunas dan DP masuk. Tidak termasuk sisa piutang."*
Karena bisnis `RETAIL`, `FNB`, dan `JASA` menggunakan sistem *Cash & Carry* (pembayaran lunas di tempat) tanpa termin DP/Piutang, teks ini menyebabkan kebingungan. Redaksi ini harus dipisah secara dinamis berdasarkan tipe bisnis (Tenant).

## 2. Instruksi Eksekusi (Dynamic String Rendering)
**Target File:** Komponen Rekap Laporan Shift (contoh: `LaporanShiftClient.tsx`, `ShiftSummary.tsx`, atau komponen yang merender kartu metrik kas).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Isolasi Redaksi Subteks Kas Laci:**
1. Buka komponen yang me- *render* kartu metrik **"Tunai (Kas Laci)"**.
2. Temukan elemen `<p>` atau `<span>` yang membungkus teks *"*Hanya menghitung uang Lunas dan DP masuk..."*.
3. Terapkan *conditional string* (misalnya menggunakan *ternary operator*) dengan memvalidasi parameter `businessType` dari entitas yang sedang *login*.
4. **Kondisi RENTAL:**
   Jika `businessType === 'RENTAL'`, pertahankan teks aslinya: 
   *"*Hanya menghitung uang Lunas dan DP masuk. Tidak termasuk sisa piutang."*
5. **Kondisi NON-RENTAL (FNB, RETAIL, JASA):**
   Ubah teksnya menjadi redaksi umum yang masuk akal untuk kasir reguler, contoh: 
   *"*Total uang fisik yang diterima pada shift ini."* atau *"*Hanya menghitung transaksi lunas dengan metode Tunai/Cash."*

Silakan terapkan *dynamic copywriting* ini! Lapor kembali jika subteks pada Laporan Shift milik bos Retail dan F&B sudah bersih dari kata-kata "DP" dan "Piutang"!
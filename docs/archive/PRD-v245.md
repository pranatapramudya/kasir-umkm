# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.45
**Fokus:** Eksekusi Quick-Wins UX/UI Berdasarkan Laporan QA (Frontend Only)

## 1. Objektif
Mengimplementasikan perbaikan *Quick-Wins* dari laporan QA untuk meminimalisir kesalahan kasir, mempercepat proses operasional (mengurangi *cognitive load*), dan memberikan kejelasan visual tanpa melakukan perubahan pada struktur database (Prisma Schema).

## 2. Eksekusi Perbaikan (Frontend & State Management)

**A. Microcopy Dinamis pada Tombol Checkout (Target: `Cart.tsx` atau Komponen POS)**
1. Ubah label tombol "Bayar Sekarang" yang statis menjadi dinamis berdasarkan Kategori Tenant dan Status Pembayaran:
   - JIKA `tenantCategory === 'RENTAL'` DAN `downPayment > 0` DAN `remainingBalance > 0`: Label menjadi `"Simpan & Tahan Jaminan"`.
   - JIKA `tenantCategory === 'RENTAL'` DAN Lunas: Label menjadi `"Lunas & Selesai"`.
   - JIKA `tenantCategory === 'FNB'` DAN menggunakan sistem bayar nanti/meja (jika diimplementasikan di state): Label menjadi `"Simpan Pesanan"`.
   - Selain kondisi di atas, pertahankan label `"Bayar Sekarang"`.

**B. Pengingat Jaminan Saat Pelunasan Rental (Target: Logika Pelunasan / Edit Transaksi)**
1. Jika kasir dari kategori `RENTAL` membuka modal/halaman untuk mengedit transaksi dari status `partial` (DP) menjadi `completed` (Lunas):
   - Injeksi sebuah alert/konfirmasi pop-up (menggunakan `window.confirm` atau custom UI Modal): 
     `"PENTING: Pastikan Anda telah mengembalikan jaminan (${guarantee}) kepada pelanggan. Lanjutkan pelunasan?"`
   - Transaksi tidak boleh di-submit menjadi `completed` sebelum kasir menyetujui alert ini.

**C. Klarifikasi Uang Fisik di Laporan Shift (Target: Halaman Laporan Shift Karyawan)**
1. Di halaman Laporan Shift (khususnya widget Kas / Uang Tunai), tambahkan *microcopy* atau *tooltip* yang sangat eksplisit untuk menenangkan kasir:
   - Tambahkan baris teks kecil (misal `text-xs text-gray-500`) di bawah angka Total Kas Tunai: 
     `*Hanya menghitung uang Lunas dan DP masuk. Tidak termasuk sisa piutang.*`
2. Pastikan ada penanda visual (misal label badge "Belum Lunas") pada baris riwayat transaksi harian yang statusnya `partial`.

**D. Visual Cues Stok Habis pada Retail/F&B (Target: Daftar Produk POS)**
1. JIKA `stock === 0` (untuk item yang di-track stoknya):
   - Ubah *background* *card* produk menjadi warna merah pudar (`bg-red-50`).
   - Ubah tombol `+` (tambah ke keranjang) menjadi `disabled` (Abu-abu, tidak bisa diklik).
   - Tampilkan label peringatan kecil "STOK HABIS" di atas *card* tersebut.

## 3. Instruksi Eksekusi
Silakan terapkan keempat poin Quick-Win ini sekarang juga. Jangan menyentuh `schema.prisma`. Fokus pada manipulasi *state* (React) dan *styling* (Tailwind). Jika sudah selesai, laporkan hasilnya!
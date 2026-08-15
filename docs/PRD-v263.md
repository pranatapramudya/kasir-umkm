# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.63
**Fokus:** Perbaikan Visibilitas & Kontras Teks pada Form Modal "Lengkapi Data Sewa" (Rental)

## 1. Analisis Masalah
Berdasarkan hasil QA manual, ditemukan *bug* visual pada modal form "Lengkapi Data Sewa" untuk kategori bisnis Rental. Teks di dalam kolom *input* (baik teks *placeholder* maupun teks yang diketik oleh *user*) tidak terlihat karena warnanya menyatu dengan *background* form (terlalu terang/putih). Hal ini sangat fatal karena kasir tidak bisa melihat apa yang sedang mereka ketik.

## 2. Instruksi Eksekusi (Frontend & CSS Fix)
**Target File:** Komponen Modal Form "Lengkapi Data Sewa" (khusus alur keranjang Rental).

**Tugas Anda (EKSEKUSI TANPA MEMBERIKAN CONTOH KODE KEPADA SAYA):**
1. **Perbaikan Warna Teks Input:** Sisir seluruh elemen `<input>` dan `<textarea>` di dalam komponen modal tersebut (Nama Supir, Plat Nomor, Tujuan, Tgl Mulai, Tgl Selesai, Jaminan).
2. **Injeksi Class Tailwind:** 
   - Tambahkan *class* untuk memaksa warna teks ketikan pengguna menjadi gelap pekat (misal: `text-gray-900` atau `text-black`).
   - Tambahkan *class* untuk memastikan *placeholder* terbaca dengan jelas namun tetap berbeda dari teks utama (misal: `placeholder:text-gray-400` atau `placeholder:text-gray-500`).
   - Pastikan *background* input field memiliki warna solid yang kontras dengan teks (misal: `bg-white` dengan `border-gray-300`).
3. **Validasi Global:** Pastikan perbaikan kontras UI ini juga diterapkan pada form input di modal/komponen lain jika kebetulan memanggil komponen *input* global yang sama.

Silakan perbaiki visibilitas CSS ini sekarang agar kasir penyewaan bisa melihat huruf yang mereka ketik! Lapor jika perbaikan visual sudah di-*push*!
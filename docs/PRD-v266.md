# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.66
**Fokus:** Perbaikan Proporsi Layout POS (Pelebaran Sidebar Keranjang Kasir)

## 1. Analisis Masalah
Berdasarkan pengujian visual pada halaman Kasir Jasa, ditemukan bahwa area *sidebar* keranjang kanan ("Detail Layanan") memiliki lebar yang terlalu sempit (*cramped*). Hal ini menyebabkan elemen UI yang kompleks (seperti *dropdown* pemilihan Karyawan, *increment/decrement* kuantitas, dan *input* kalender) saling berhimpitan, terpotong, dan memunculkan *scrollbar* horizontal. Sementara itu, area utama (kiri) memiliki *white space* (ruang kosong) yang terlalu berlebihan.

## 2. Instruksi Eksekusi (Frontend Layout Fix)
**Target File:** Komponen *Layout* halaman POS Kasir (berlaku untuk Kasir Jasa, dan pastikan tidak merusak kasir kategori lain seperti Retail/F&B).

**Tugas Anda (EKSEKUSI TANPA MEMBERIKAN KODE KEPADA SAYA):**

1. **Evaluasi Grid/Flexbox Wrapper:**
   - Cari elemen *container* utama yang membungkus area kiri (Daftar Layanan) dan area kanan (Keranjang).
   - Ubah proporsi lebarnya. Berikan ruang yang lebih besar untuk *sidebar* keranjang di layar *desktop/tablet*. 
   - **Rekomendasi Tailwind:** Gunakan nilai absolut yang lebih lebar untuk keranjang (misal: `w-[380px]` atau `w-[420px]`), sementara area kiri diatur menggunakan `flex-1` agar mengisi sisa ruang yang ada. Jangan gunakan persentase yang terlalu kecil (seperti `w-1/4`) untuk *sidebar*.

2. **Perbaikan Overflow di Dalam Item Keranjang:**
   - Pada kartu item layanan yang masuk ke keranjang (kotak yang berisi Harga dan Dropdown Karyawan), pastikan Anda menggunakan struktur yang *responsive* di dalam kotak tersebut.
   - Jika lebar masih dirasa kurang, ubah susunan elemen di dalam item keranjang menjadi tumpukan vertikal (`flex-col`) untuk *dropdown* karyawannya agar tidak berebut ruang horizontal dengan harga/kuantitas.
   - Hilangkan penyebab *overflow-x* (hapus elemen yang memaksa lebar melebihi *container*).

Silakan atur ulang CSS *layout* ini agar kasir tidak pusing melihat form yang tergencet. Pastikan *sidebar* keranjang kanan tampil proporsional, lega, dan elegan!
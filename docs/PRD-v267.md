# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.67
**Fokus:** Paksaan Pelebaran Lebar Keranjang & Perbaikan Overflow (Force Layout Width)

## 1. Analisis Masalah Lanjutan
Instruksi pada iterasi sebelumnya gagal merombak layout secara signifikan. Sidebar keranjang kanan ("Detail Layanan") masih terkurung dalam lebar yang terlalu kecil (estimasi `w-80` atau `320px`), menyebabkan *dropdown* "Pilih Karyawan", harga, dan *stepper* kuantitas saling tumpang tindih hingga memicu *overflow-x* (scrollbar horizontal).

## 2. Instruksi Eksekusi (Aggressive Frontend Fix)
**Target File:** Komponen *Layout* halaman POS Kasir (Client-side) dan Komponen *Cart Item* di dalam keranjang.

**Tugas Anda (EKSEKUSI TANPA MEMBERIKAN KODE KEPADA SAYA):**

**A. Paksa Lebar Sidebar Kanan (Right Sidebar Width):**
1. Temukan *container parent* dari *sidebar* kanan (Keranjang).
2. **Hapus** *class* lebar lama seperti `w-1/4`, `w-80`, atau `w-[300px]`.
3. **Wajib Gunakan** class ini: `w-[400px]` atau `w-[450px]` (atau gunakan `min-w-[400px]`). Sidebar keranjang *harus* memakan ruang yang jauh lebih besar secara statis, sedangkan area tengah (daftar produk) harus diset menggunakan `flex-1` agar mengalah dan mengisi sisa ruang yang ada.

**B. Rombak Internal "Cart Item Card" (Biar Tidak Gencet):**
1. Di dalam kartu item yang masuk ke keranjang, elemen sedang berebut ruang horizontal.
2. Buat struktur *flexbox* menjadi vertikal yang rapi:
   - **Baris 1:** Nama Layanan dan Tombol Hapus (`justify-between`).
   - **Baris 2:** Dropdown "DIKERJAKAN OLEH" (Buat agar selebar kontainer penuh / `w-full`).
   - **Baris 3:** Harga dan tombol plus-minus (+/-) kuantitas (Gunakan `flex flex-row justify-between items-center mt-2`).
3. Hilangkan setiap elemen teks atau *padding* yang memaksa konten menembus lebar *parent*-nya. Hilangkan kemunculan *scrollbar* abu-abu horizontal secara permanen.

Silakan lakukan perbaikan *layout* ini secara agresif dan radikal. Pastikan *sidebar* keranjang terlihat LEGA dan form di dalamnya tersusun ke bawah (*flex-col*), bukan saling menabrak ke samping. Lapor jika sudah dieksekusi!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.65
**Fokus:** Perbaikan Conditional Rendering Edukasi Link Booking (Empty State)

## 1. Analisis Masalah
Pesan edukasi "💡 Tips" untuk kategori bisnis Jasa dan Rental tidak muncul di halaman "Informasi Toko". Penyebabnya adalah kotak edukasi tersebut terperangkap di dalam blok pengkondisian `if (slug exist)`. Ketika toko belum mengatur *slug* (URL unik), keseluruhan blok (termasuk edukasi) gagal di-*render*.

## 2. Instruksi Eksekusi (Frontend Logic Fix)
**Target File:** Komponen `Informasi Toko`.

**Tugas Anda (EKSEKUSI TANPA MEMBERIKAN KODE KEPADA SAYA):**
1. **Pindahkan Posisi Kotak Edukasi:** 
   - Keluarkan blok Alert/Edukasi ("💡 Tips: ...") dari dalam *wrapper* pengecekan kondisi keberadaan `slug`.
   - Pastikan kotak edukasi ini SELALU MUNCUL untuk pengguna kategori bisnis **JASA** dan **RENTAL**, tidak peduli apakah `slug` mereka sudah diatur atau masih kosong.
2. **Penempatan UI:**
   - Tempatkan kotak edukasi tersebut di bagian bawah kotak informasi "Slug Toko", tepat di bawah peringatan kuning *"Slug belum diatur..."* (jika slug kosong) ATAU di bawah link biru publik (jika slug sudah ada).
3. **Tujuan UX:**
   - Pengguna harus bisa membaca manfaat fitur *booking* publik terlebih dahulu sebagai bentuk persuasi/edukasi, yang akan mendorong mereka untuk mengeklik tombol "Edit" dan mengatur URL *slug* toko mereka.

Silakan perbaiki logika *rendering* ini agar edukasi tidak ikut tersembunyi saat *slug* masih kosong! Lapor jika UI sudah menyesuaikan!
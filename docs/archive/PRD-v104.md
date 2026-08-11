# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.04 (Planning Mode)
**Fokus:** Kalkulasi Stok Dinamis (Client-Side) & Validasi Pencegahan Over-Checkout di POS

## 1. Tujuan Akhir (Goal)
Memastikan halaman Kasir POS merespons perubahan stok secara *real-time* saat produk ditambahkan ke keranjang (Cart), meskipun transaksi belum diselesaikan (belum klik Bayar).
**Target Utama:**
1. Angka "Sisa Stok" pada kartu produk harus mencerminkan: `Stok Database - Kuantitas di Keranjang`.
2. Mencegah kasir menambahkan barang melebihi ketersediaan stok fisik (*Over-checkout prevention*).

## 2. Batasan Arsitektur (Constraints)
*   **Zero Database Mutation Before Checkout:** Jangan lakukan pembaruan (`UPDATE`) ke Prisma saat barang baru masuk keranjang. Kalkulasi pengurangan stok sementara ini murni harus terjadi di sisi Klien (Client-Side menggunakan React State/Variabel).
*   **Validasi Tombol Add:** Tombol `+` (Tambah ke Keranjang) pada kartu produk DAN di dalam list Keranjang harus dinonaktifkan (`disabled`) jika kuantitas barang di keranjang sudah sama dengan (atau melebihi) stok asli dari *database*.
*   **Visual Feedback:** Saat stok di layar mencapai 0 (karena semua sudah masuk keranjang), ubah *badge* sisa stok menjadi warna merah (misal: "Habis" atau "Sisa: 0") agar kasir langsung paham.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda menulis atau mengubah baris kode apa pun pada `app/page-client.tsx`, berikan rancangan logika Anda:
1.  **Logika Kalkulasi Tampilan:** Jelaskan bagaimana Anda akan memodifikasi *rendering* label "Sisa: X" pada kartu produk agar secara dinamis membaca jumlah *item* yang sedang ada di *state* `cart`.
2.  **Validasi Fungsi Add-to-Cart:** Tunjukkan draf logika pencegatan (interceptor) pada fungsi `addToCart` atau `increaseQuantity` Anda yang akan memblokir penambahan jika `cartItem.qty >= product.stok`.
3.  **Feedback Visual:** Kelas Tailwind apa yang akan Anda gunakan untuk menonaktifkan tombol dan mengubah warna *badge* jika batas stok tercapai?

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengubah kode UI dan state Kasir!**
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.43
**Fokus:** Cleanup UI Pembayaran, Rebranding Struk, & Bugfix Image Upload F&B

## 1. Analisis Kebutuhan & Bug
*   **UI Pembayaran:** Tombol "Kirim Struk via WA" dinilai tidak efisien untuk operasional MVP dan harus dihapus secara global dari semua model bisnis.
*   **Rebranding Struk:** Footer struk pelanggan masih menggunakan teks *hardcoded* "Powered by Pranata". Harus diubah menjadi "Powered by PJTECH" untuk branding komersial.
*   **Bug Upload Foto F&B:** Pada komponen form Tambah/Edit Produk, ketika pengguna berada di mode F&B (`kategoriUsaha === 'F&B'`), gambar/foto yang diunggah tidak muncul (preview gagal dirender). Ini kemungkinan efek samping dari *conditional rendering* sebelumnya.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan secara presisi tanpa merusak logika yang sudah berjalan. DILARANG memberikan *output* kode mentah.

### A. Hapus Tombol "Kirim Struk via WA" (Global)
*   **Target File:** Komponen Modal Pembayaran Sukses (tempat tombol-tombol cetak berada).
*   **Instruksi:** 
    1. Cari dan hapus elemen tombol berlabel "Kirim Struk via WA" (yang berwarna hijau).
    2. Pastikan tombol yang tersisa hanya "Cetak Struk", "Cetak Tiket Dapur" (jika F&B), dan "Selesai".

### B. Rebranding Footer Struk Pelanggan
*   **Target File:** Komponen Cetak Struk (Customer Receipt).
*   **Instruksi:**
    1. Cari teks `Powered by Pranata` di bagian paling bawah/footer struk.
    2. Ubah teks tersebut menjadi `Powered by PJTECH`.

### C. Bugfix Preview Foto Menu (Khusus F&B)
*   **Target File:** `app/admin/products/page-client.tsx` (atau file form produk).
*   **Instruksi:**
    1. Periksa bagian *conditional rendering* untuk F&B yang menyembunyikan field (SKU, Merek, dll).
    2. Pastikan komponen unggah foto (Upload Image / Preview Image) TIDAK ikut tersembunyi atau terganggu state-nya saat `kategoriUsaha === 'F&B'`.
    3. Pastikan *state* `imageUrl` atau file gambar berhasil di-*bind* dan ditampilkan (*preview*) dengan benar setelah pengguna memilih file foto, baik dalam mode Tambah maupun Edit Menu.

### D. Penyesuaian Final Tiket Dapur (Kitchen Ticket)
*   **Target File:** Komponen Cetak Tiket Dapur.
*   **Instruksi:**
    1. Pertahankan layout MVP saat ini (Header PESANAN DAPUR, MEJA [X] besar, tanpa harga).
    2. Cukup pastikan jika ada data `note` (catatan pesanan per item) di dalam keranjang, tampilkan teks catatan tersebut tepat di bawah nama item dengan ukuran font yang sedikit lebih kecil/italic (Contoh: `* Note: Jangan pedas`).

Silakan eksekusi pembersihan dan perbaikan bug ini sekarang!
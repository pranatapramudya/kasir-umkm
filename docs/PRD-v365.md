# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.65  
**Fokus:** POS Hardware Barcode Scanner & Audio Feedback Suite (Retail & F&B)

## 1. Latar Belakang & Kebutuhan
Proses transaksi pada kasir Retail (minimarket, toko kelontong, butik) dan F&B membutuhkan kecepatan pelayanan (*fast-checkout*). Sebelumnya kasir harus mencari produk secara manual melalui input search atau melakukan scroll pada grid produk. Diperlukan integrasi pemindaian barcode hardware (USB / Bluetooth barcode scanner) dan input manual SKU di POS kasir untuk meminimalkan antrean pelanggan.

## 2. Solusi & Fitur yang Diterapkan

### A. Global Hardware Barcode Scanner Listener
- Menggunakan `useEffect` global yang mendengarkan event `keydown` pada objek `window`.
- Membedakan ketukan scanner hardware dengan ketukan manusia melalui perhitungan *keystroke time interval* (< 70ms per karakter).
- Saat tombol `Enter` dipicu oleh scanner, buffer diekstrak dan dicari kecocokannya dengan `kodeBarang`.

### B. Pencarian Cerdas & API Fallback
- Sistem mencari `kodeBarang` pada daftar produk lokal di halaman aktif terlebih dahulu.
- Jika produk tidak ada di 10 item lokal (akibat paginasi), sistem secara otomatis melakukan query ke `/api/products?search=${code}&limit=10`.
- Jika ditemukan, item otomatis ditambahkan ke keranjang via `addToCart(product)`. Jika produk sudah ada di keranjang, *quantity*-nya bertambah (`qty + 1`).

### C. Audio Feedback (Web Audio API Synthesizer)
- Menghasilkan nada bip audio tanpa latensi dan tanpa dependensi file eksternal:
  - **Bip Sukses:** Frekuensi 1200Hz (sine wave, 120ms).
  - **Peringatan Gagal:** Frekuensi 280Hz (sawtooth wave, 250ms) disertai toast notifikasi saat SKU tidak ditemukan atau stok habis.

### D. UI Manual SKU Input
- Input teks khusus tepat di atas grid daftar produk dengan ikon `Barcode` dan placeholder `"Scan atau Ketik SKU/Barcode (Enter)"`.
- Dilengkapi tombol `Enter ↵` dan badge status `"Scanner Siap"`.
- Nilai input otomatis dikosongkan setelah item berhasil dimasukkan ke keranjang.

### E. Isolasi Kategori Bisnis
- Seluruh logika event listener dan UI pemindai barcode diisolasi dengan kondisi `!isJasa && !isRental` (hanya aktif untuk Retail dan F&B).

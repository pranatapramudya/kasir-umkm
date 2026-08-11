# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.01
**Fokus:** Dynamic QR Payment & WhatsApp Checkout Integration

## 1. Objektif
Memperbaiki logika antarmuka modal Konfirmasi Pembayaran agar gambar QRIS menyesuaikan dengan batas limit DANA Bisnis (< Rp 2 Juta), serta mengotomatisasi format pesan WhatsApp menuju nomor bisnis (085723256427) yang menyertakan form alamat khusus untuk pembelian paket Bundling Hardware.

## 2. Instruksi Eksekusi Mutlak untuk Agent (Frontend & Integrasi WA)

### A. Logika Dynamic QR Image pada Modal Pembayaran
1. Buka komponen UI yang me-render Modal Konfirmasi Pembayaran.
2. Buat kondisi (*conditional rendering*) berdasarkan harga atau nama paket yang dipilih:
   * **JIKA Paket = "Pro 6 Bulan" atau "Pro Tahunan (Software Saja)":** Gunakan *render* QRIS DANA Bisnis yang sudah ada (seperti pada `image_adc156.png`).
   * **JIKA Paket = "Pro Tahunan (Bundle)":** HAPUS *render* QRIS bawaan, dan ganti dengan memanggil *asset* gambar statis dari folder public. Gunakan tag `<img src="/qris-1tahun+hardware.jpeg" alt="QRIS Bundle" />` (Pastikan *styling size*-nya rapi dan sesuai dengan ukuran kartu).

### B. Integrasi Tombol "Kirim Bukti via WhatsApp"
1. Ubah fungsi `onClick` atau *href* pada tombol WhatsApp hijau tersebut.
2. Buat fungsi pembuat tautan URL WhatsApp API (`https://wa.me/6285723256427?text=...`).
3. Susun teks pesan (*URL Encoded*) secara dinamis berdasarkan paket:
   * **Format Default (Software):**
     "Halo Tim PJTECH, saya ingin mengonfirmasi pembayaran langganan aplikasi kasir.%0A%0A*Nama Toko:* [Nama Toko/User]%0A*Paket:* [Nama Paket]%0A*Total:* [Harga]%0A%0ABerikut saya lampirkan bukti transfernya."
   * **Format Khusus (Bundle Hardware):**
     "Halo Tim PJTECH, saya ingin mengonfirmasi pembayaran langganan aplikasi kasir + Hardware.%0A%0A*Nama Toko:* [Nama Toko/User]%0A*Paket:* Pro Tahunan (Bundle)%0A*Total:* Rp 2.988.000%0A%0A*Data Pengiriman Hardware:*%0A- Nama Penerima: %0A- No. HP Penerima: %0A- Alamat Lengkap (Jalan, RT/RW, Kota/Kabupaten, Kode Pos): %0A%0ABerikut saya lampirkan bukti transfernya."
4. Pastikan ketika tombol diklik, pengguna langsung diarahkan ke tab baru WhatsApp Web/App dengan teks yang sudah terisi otomatis.

## 3. Output yang Diharapkan
Konfirmasikan bahwa gambar QRIS berhasil berganti secara dinamis berdasarkan paket yang dipilih untuk menghindari limit *payment gateway*. Pastikan juga tautan tombol WhatsApp mengarah ke nomor 6285723256427 dengan format pesan yang meminta data pengiriman jika pelanggan memilih paket *bundle*.
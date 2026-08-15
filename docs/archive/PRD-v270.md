# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.70
**Fokus:** Penambahan Badge Indikator Jumlah Item di Header Keranjang (Global)

## 1. Analisis Masalah (Missing Visual Feedback)
Dari hasil QA manual, kasir tidak mendapatkan *feedback* visual mengenai total kuantitas barang/jasa yang sudah masuk ke keranjang. Terdapat kasus di mana kasir melakukan *multi-click* (total harga sudah terakumulasi benar menjadi Rp 150.000 untuk 5 item), namun judul *sidebar* keranjang hanya menampilkan "Detail Layanan" tanpa ada indikator angka "5". Kasir membutuhkan kepastian visual jumlah angka pesanan (*Checkout Quantity*) untuk mencegah kebingungan operasional.

## 2. Instruksi Eksekusi (Frontend State & UI)
**Target File:** Komponen *Header Sidebar* Keranjang (Pastikan berlaku Global untuk Retail, F&B, Jasa, dan Rental).

**Tugas Anda (KERJAKAN TANPA MEMBERIKAN KODE KEPADA SAYA):**

**A. Kalkulasi Total Kuantitas (State Logic):**
1. Ambil *state* keranjang belanja (misal: `cart` atau `cartItems`).
2. Hitung jumlah total kuantitas pesanan (bukan jumlah baris *array*, melainkan akumulasi nilai `quantity` dari setiap item). 
3. *Clue*: Gunakan fungsi `reduce` pada array keranjang Anda: `const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);`

**B. Implementasi Badge Angka (UI Logic):**
1. Cari elemen judul pada *header* keranjang (contoh yang menampilkan teks "Detail Layanan" atau "Keranjang").
2. Injeksi elemen *Badge* dinamis di sebelah teks judul tersebut. 
3. Tampilkan angka dari `totalItemCount`. Berikan *styling* yang mencolok namun elegan (misal: latar belakang biru pekat/merah dengan teks putih kecil di dalam bulatan bulat/kapsul).
4. *Conditional Rendering*: Jika `totalItemCount` bernilai 0 (keranjang kosong), *badge* ini boleh disembunyikan atau dibiarkan merender angka 0 (sesuaikan dengan estetika terbaik menurut Anda).

Silakan aplikasikan *badge* indikator kuantitas ini secara global ke semua mode bisnis sekarang juga! Lapor jika UI sudah di-push!
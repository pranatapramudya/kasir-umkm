# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.46
**Fokus:** Eksekusi A+ (Anti-Gaptek & Penyempurnaan Skala Enterprise)

## 1. Objektif
Menyelesaikan 4 *Friction Points* terakhir yang diidentifikasi dalam fase QA untuk mencapai tingkat kesempurnaan UX (A+). Fokus pada Onboarding (CSV Import), Edukasi Hardware, Humanisasi Error, dan Fleksibilitas F&B (Modifiers).

## 2. Instruksi Eksekusi Arsitektur & UI (Tanpa Kode Mentah)

**A. Fitur Import Bulk CSV (Solusi Onboarding Gaptek)**
*   **Target File:** Halaman Manajemen Produk (Owner) & Endpoint API `/api/products/bulk`.
*   **Instruksi:** 
    1. Tambahkan tombol "Import Data (Excel/CSV)" di sebelah tombol "Tambah Produk".
    2. Buat modal UI yang menyediakan link "Download Template CSV" agar user tahu format yang benar (Nama, Harga, Stok, Kategori, dll).
    3. Integrasikan library *parser* (seperti `papaparse` atau bawaan pembaca file) di sisi client.
    4. Buat API endpoint baru yang menerima array objek produk dan menggunakan `prisma.product.createMany` untuk menyimpan ratusan produk dalam satu detik.

**B. UI Edukasi Printer Bluetooth (Solusi Hardware Gaptek)**
*   **Target File:** Komponen/Modal Cetak Struk di Halaman POS.
*   **Instruksi:**
    1. Di dekat tombol "Cetak Struk Thermal", tambahkan tombol teks kecil atau ikon info: "Bingung Cara Print? Klik di sini".
    2. Buat modal/dialog box statis yang berisi 3 langkah bergambar/teks tebal:
       - Langkah 1: Nyalakan Bluetooth di perangkat Anda.
       - Langkah 2: Lakukan Pairing (Sambungkan) ke printer (biasanya bernama RPP02N atau sejenisnya) via pengaturan HP/PC.
       - Langkah 3: Kembali ke aplikasi, klik Cetak, lalu izinkan pop-up Chrome.
    3. UX ini akan menyelamatkan waktu Customer Service dari pertanyaan berulang.

**C. Global Error Humanization (Solusi Psikologis)**
*   **Target File:** Global Error Handler (bisa di fetch wrapper, interceptor axios, atau state error handling di client).
*   **Instruksi:**
    1. Buat sebuah utilitas/fungsi mapping error. 
    2. Tangkap pesan error bawaan (seperti `Failed to fetch`, `Network Error`, `500 Internal Server Error`).
    3. Konversi menjadi bahasa manusiawi sebelum ditampilkan ke UI (via Toast/Snackbar).
       - *Mapping 1:* Jika mendeteksi masalah *network* ➔ Tampilkan "Yah, koneksi internet toko sedang putus. Cek WiFi/Kouta Anda ya."
       - *Mapping 2:* Jika 500 Server Error ➔ Tampilkan "Sistem sedang sibuk, mohon coba beberapa saat lagi."
       - *Mapping 3:* Jika 401 Unauthorized ➔ Tampilkan "Sesi Anda sudah habis, silakan login ulang demi keamanan."

**D. Sistem Modifiers / Add-ons (Solusi Kasir F&B)**
*   **Target File:** `schema.prisma`, API Transaksi, & UI POS Kategori F&B.
*   **Instruksi:**
    1. **Prisma:** Modifikasi tabel `TransactionItem` (bukan tabel utama Transaction). Tambahkan kolom `notes` (String, nullable) untuk mencatat request khusus (seperti "Less Sugar, Oat Milk"). Jika ingin lebih canggih, tambahkan kolom `addons` berbasis JSON.
    2. **UI Kasir F&B:** Saat kasir F&B mengklik produk (misal: Kopi Susu), cegah produk langsung masuk keranjang. Munculkan modal/drawer pop-up terlebih dahulu yang menampilkan kolom "Catatan Tambahan (Opsional)".
    3. Kasir dapat mengetik request pelanggan di modal tersebut, lalu klik "Konfirmasi & Masukkan Keranjang".
    4. Pastikan teks *notes* ini tercetak di struk dapur dan struk pelanggan.

Silakan analisis keempat instruksi ini dan mulai eksekusi secara berurutan. Berikan laporan setelah seluruh fitur ini selesai diintegrasikan!
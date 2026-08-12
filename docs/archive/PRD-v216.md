# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.16
**Fokus:** Calendar View Dashboard & Universal Web Bluetooth Printer

## 1. Objektif
Menambahkan visualisasi Kalender pada *dashboard* manajemen jadwal untuk pemilik bisnis jasa, serta membangun utilitas pencetakan struk nirkabel (*wireless*) menggunakan Web Bluetooth API (ESC/POS) yang terintegrasi ke seluruh fitur Kasir.

## 2. Fitur 1: Tampilan Kalender (Dashboard Owner)
**Target File:** `app/admin/booking/page.tsx` (atau komponen anak yang merender daftar *booking*).
**Instruksi:**
1.  **Instalasi Library:** Install library kalender yang ringan dan modern, misalnya `react-big-calendar` atau gunakan `react-day-picker` (jika menggunakan ekosistem shadcn/ui). Jalankan `npm install react-big-calendar date-fns`.
2.  **Toggle View (List vs Calendar):** Tambahkan tombol *toggle* atau *tabs* di bagian atas *dashboard* "Jadwal Booking" untuk beralih antara "Tampilan Daftar" (yang sudah ada saat ini) dan "Tampilan Kalender".
3.  **Integrasi Data:** Petakan (*map*) data `Booking` yang di-*fetch* dari Prisma ke dalam format *events* yang dibutuhkan oleh kalender (membutuhkan parameter `title` (Nama Pelanggan), `start` (Jam Mulai), dan `end` (Jam Selesai - estimasikan +1 jam dari waktu *booking*)).
4.  **Interaksi UX:** Jika *owner* mengklik salah satu *event* di dalam kalender, munculkan *modal* atau pop-up detail yang berisi tombol aksi yang sama seperti di *list view* ("Proses ke Kasir" dan "Batalkan").

## 3. Fitur 2: Web Bluetooth Thermal Printer (ESC/POS)
**Target File:** Buat file utilitas baru `lib/bluetooth-printer.ts`.
**Instruksi:**
1.  **Buat Fungsi Koneksi (`connectPrinter`):**
    - Gunakan `navigator.bluetooth.requestDevice({ filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }], acceptAllDevices: true })` (Catatan: Sesuaikan *service UUID* standar printer thermal atau gunakan `acceptAllDevices: true` dengan `optionalServices`).
    - Buat logika untuk melakukan *connect* ke `device.gatt` dan mengambil *characteristic* yang memiliki properti *write*.
2.  **Buat Fungsi Pembangun Struk (`buildReceipt`):**
    - Buat fungsi yang mengonversi data keranjang (Nama Toko, Tanggal, Item, Total, Harga) menjadi *array of bytes* (`Uint8Array`) menggunakan standar **ESC/POS**.
    - Masukkan kode ESC/POS untuk: Rata tengah (Nama Toko), Rata Kiri-Kanan (Item & Harga), Garis Putus-putus (`---`), dan perintah potong kertas/jeda garis di akhir struk.
3.  **Buat Fungsi Cetak (`printReceipt`):**
    - Kirim *byte array* dari `buildReceipt` ke printer menggunakan `characteristic.writeValue(data)`.
    - Bungkus dalam blok `try...catch` dan berikan *toast notification* yang jelas (misal: "Printer terhubung", "Gagal mencetak: Perangkat tidak ditemukan").

## 4. Integrasi Tombol Cetak di UI Kasir
**Target File:** Halaman Kasir (baik untuk Retail, F&B, maupun Jasa).
**Instruksi:**
1.  Pada komponen struk atau modal pembayaran sukses, tambahkan tombol **"🖨️ Cetak Struk (Bluetooth)"**.
2.  Saat diklik, panggil fungsi `connectPrinter()` lalu `printReceipt()` dari utilitas yang sudah dibuat.
3.  Sembunyikan atau berikan *warning* pada tombol ini jika terdeteksi bahwa *browser* tidak mendukung Web Bluetooth API (`!navigator.bluetooth`).
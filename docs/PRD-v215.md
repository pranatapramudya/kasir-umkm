# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.15
**Fokus:** Customer Booking Receipt (Download Image & Share to WhatsApp)

## 1. Objektif
Menambahkan fungsionalitas pada halaman "Sukses Booking" agar pelanggan yang tidak memiliki akun dapat menyimpan bukti reservasi mereka ke dalam perangkat seluler (Galeri) atau menyalinnya via WhatsApp.

## 2. Instalasi Dependency Baru
- Buka terminal dan install *library* untuk menangkap elemen DOM menjadi gambar:
  `npm install html2canvas`
- Install tipe deklarasinya (jika menggunakan TypeScript):
  `npm install --save-dev @types/html2canvas`

## 3. Modifikasi UI Halaman Sukses (`BookingForm.tsx`)
**Target:** Bagian blok *return* yang merender UI "Jadwal Dibuat!" (Success State).
**Instruksi:**
1. Tambahkan `id="ticket-container"` pada elemen `div` (Card) yang membungkus informasi detail jadwal (Nama, Tanggal, Jam).
2. Buat fungsi `handleDownloadTicket`:
   - Gunakan `html2canvas` untuk menargetkan elemen `ticket-container`.
   - Ubah hasil canvas menjadi *data URL* (PNG/JPEG).
   - Buat elemen `<a>` sementara, set `href` ke data URL tersebut, set `download="Tiket-Booking.png"`, lalu panggil `click()`.
3. Buat fungsi `handleShareWA`:
   - *Generate* teks dinamis: `Halo, saya [Nama]. Ini adalah bukti booking saya di [Nama Toko] pada [Tanggal] jam [Jam].`
   - Gunakan format URL: `https://wa.me/?text={encodeURIComponent(teks)}`.
4. Tambahkan dua buah tombol modern di bawah kotak detail:
   - Tombol 1: "Unduh Tiket (Simpan ke Galeri)" -> `onClick={handleDownloadTicket}`
   - Tombol 2: "Kirim Detail via WA" -> `onClick={handleShareWA}`

Pastikan *styling* tombol responsif dan rapi di perangkat *mobile*!
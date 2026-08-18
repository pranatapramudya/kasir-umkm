# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.08
**Fokus:** Bug Fix - CSS Print Media Query (Surat Jalan Mobile & Desktop)

## 1. Analisis Masalah
Berdasarkan hasil pengujian cetak (*print*) Surat Jalan/Invoice melalui perangkat *mobile*, terdapat dua masalah fatal:
1. **Kebocoran UI (UI Bleeding):** Elemen navigasi aplikasi (seperti *Bottom Navigation Bar* pada mobile atau *Sidebar* pada desktop) ikut tercetak di atas kertas dokumen.
2. **Layout Tidak Presisi & Page Break:** Halaman terpotong menjadi dua halaman (*page 2* kosong/berlebih) karena adanya elemen UI yang mengambil ruang kosong. Selain itu, proporsi kolom di kertas sering berantakan saat dicetak dari *mobile* karena browser membawa sifat responsif *mobile* ke atas kertas cetak.

## 2. Instruksi Eksekusi (Tailwind CSS Print Modifiers)
**Target File:** Komponen Surat Jalan/Invoice yang dirender untuk dicetak (kemungkinan di `app/admin/rental-pos/page.tsx` atau komponen khusus cetak), serta *Global Layout/Navbar*.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Menyembunyikan Elemen UI (Hide Non-Printables):**
1. Buka komponen navigasi (*Sidebar* desktop, *Bottom Nav* mobile, dan *Header/Navbar* atas).
2. Tambahkan kelas utilitas Tailwind `print:hidden` pada elemen-elemen *wrapper* tersebut. Ini memastikan elemen tersebut akan hilang seketika saat dialog *Print* browser muncul.

**B. Pengaturan Isolasi Area Cetak (Print Wrapper):**
1. Pastikan area yang HANYA berisi dokumen Surat Jalan dibungkus dengan div khusus.
2. Berikan kelas Tailwind pada div tersebut: `print:block print:w-full print:m-0 print:p-0`.
3. Tambahkan aturan CSS global (di `globals.css` atau via tag `<style>`) untuk memaksa ukuran kertas jika diperlukan:
   `@media print { @page { size: A4; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`

**C. Memaksa Layout Desktop di Kertas Cetak:**
1. Karena kertas A4 lebar, jangan biarkan *layout* menggunakan `flex-col` (bertumpuk ke bawah) hanya karena dicetak dari HP.
2. Pada setiap baris (seperti blok "INFORMASI PENYEWA" dan "DETAIL SEWA KENDARAAN"), gunakan kelas `print:flex-row print:flex print:justify-between print:w-full` agar grid/kolom tetap terbagi dua sejajar dari kiri ke kanan.

**D. Mencegah Elemen Terpotong (Page Break Avoid):**
1. Pada blok tabel *Total Harga* dan blok *Tanda Tangan* (Penyewa & Admin Kasir), berikan kelas `print:break-inside-avoid`. 
2. Ini mencegah bagian tanda tangan terpisah ke halaman 2 jika kehabisan ruang di halaman 1.

Silakan rombak total kelas CSS `print:` di komponen ini! Lapor jika Surat Jalan sudah tercetak bersih tanpa ada tombol UI yang mengganggu, baik dites via Desktop maupun Mobile!
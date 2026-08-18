# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.23
**Fokus:** Penambahan Field "Catatan Tarif / Deskripsi" pada Data Layanan/Armada

## 1. Analisis Masalah
Saat ini, model database dan form "Tambah Layanan Baru" (Armada) hanya memiliki satu input harga statis (Harga Sewa Per Hari). Hal ini menyulitkan pemilik rental untuk menginformasikan variasi harga berdasarkan zona (misal: Dalam Kota, Luar Kota, Luar Pulau). Pembuatan algoritma harga dinamis berdasarkan jarak tidak efisien untuk skala UMKM. Solusi terbaik adalah menyediakan field deskripsi/catatan tarif agar admin dapat menuliskan Syarat & Ketentuan harga secara teks, yang kemudian ditampilkan kepada pelanggan di form booking publik.

## 2. Instruksi Eksekusi (Database Schema, Admin Form & Public UI)
**Target File:** `prisma/schema.prisma`, API Layanan/Armada, Form Tambah Armada (Admin), dan Komponen Publik `BookingForm.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Modifikasi Skema Database (Jika Diperlukan):**
1. Periksa model `Service` atau `Product` (entitas yang menyimpan data armada).
2. Pastikan terdapat field `description` (String, opsional). Jika belum ada, tambahkan `description String?` atau `pricingNote String?`. Lakukan migrasi database (`npx prisma db push`) jika Anda melakukan perubahan skema.

**B. UI Form Tambah/Edit Armada (Admin):**
1. Buka komponen Modal "Tambah Layanan Baru" / "Edit Layanan".
2. Tambahkan elemen `<textarea>` dengan label **"Catatan Tarif / Area Layanan (Opsional)"**.
3. Berikan *placeholder*: *"Misal: Harga tertera untuk dalam kota. Luar kota dikenakan tambahan biaya Rp 100.000."*
4. Hubungkan input ini ke payload *submit* API agar tersimpan di database.

**C. Tampilkan Catatan di Form Booking Publik:**
1. Buka komponen `BookingForm.tsx` pada halaman publik (Katalog Slug).
2. Di bawah kotak informasi armada (yang menampilkan Nama Mobil dan Harga), tambahkan blok teks kecil (teks berwarna abu-abu/muted, menggunakan *italic* atau *alert box* kecil).
3. Render isi dari field `description` / `pricingNote` armada tersebut di blok teks ini. (Render hanya jika field tersebut tidak kosong).

Silakan bangun fitur Catatan Tarif ini! Lapor jika admin sudah bisa mengisi catatan harga dan catatan tersebut berhasil dibaca oleh pelanggan di halaman booking publik!
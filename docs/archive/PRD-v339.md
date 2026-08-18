# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.39
**Fokus:** Perbaikan UI/UX Cetak Struk (Thermal Print) & Sinkronisasi Data Karyawan/Kasir

## 1. Analisis Masalah
1. **Ukuran Kertas Default (A4):** Saat fungsi cetak struk dijalankan, *browser* mengatur ukuran kertas ke A4 secara *default*. Untuk bisnis F&B, Retail, dan Jasa, ukuran standar printer kasir adalah Thermal 80mm atau 58mm.
2. **Nama Kasir Statis:** Identitas "Kasir" di dalam struk masih berupa *hardcoded text* ("Kasir : Kasir"), belum sinkron dengan akun pengguna (Owner/Staff) yang sedang mengoperasikan sistem.
3. **Bug Render ID Karyawan ("Dikerjakan Oleh"):** Pada bisnis Jasa, nama terapis/kapster yang dipilih di kasir (misal: "Roni") justru tercetak sebagai *raw Database ID* (`cmsugy...`) di struk. Fitur ini **TIDAK BOLEH DIHAPUS** karena krusial untuk perhitungan komisi, namun harus diperbaiki *mapping* datanya.

## 2. Instruksi Eksekusi (CSS Print Media & Data Mapping)
**Target File:** File CSS Global/Tailwind Configuration, Komponen Struk/Invoice (`Receipt.tsx`), dan Handler Keranjang Kasir.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Format Kertas Thermal (Print Media Query):**
1. Buka file CSS global Anda (atau di dalam komponen struk).
2. Buat aturan `@media print` khusus.
3. Di dalam *media query* tersebut, atur properti `@page` dengan `size: 80mm auto` (atau `58mm auto`). Atur margin ke `0`.
4. Pastikan lebar kontainer struk Anda (*wrapper*) menyesuaikan ukuran maksimal printer thermal (misalnya maksimal lebar `300px` atau `100%` dari 80mm). Sembunyikan elemen UI lainnya (seperti tombol "Cetak" atau navigasi) menggunakan *class* `print:hidden`.

**B. Sinkronisasi Otomatis Nama Kasir:**
1. Buka komponen `Receipt.tsx` (yang bertugas merender UI struk).
2. Tangkap objek sesi (*session/user context*) dari pengguna yang sedang *login* (menggunakan *hook auth* yang tersedia, misal dari Clerk atau JWT).
3. Cari properti `firstName`, `fullName`, atau bagian depan `email` pengguna tersebut.
4. Ganti *hardcoded text* "Kasir" dengan variabel nama dinamis tersebut. (Contoh logika: Jika nama pengguna tidak ada, gunakan 'Admin', jika ada gunakan nama aslinya).

**C. Perbaikan Mapping Nama "Dikerjakan Oleh" (Khusus Jasa):**
1. Lacak alur data *item* keranjang dari `Detail Layanan` hingga ke `Receipt.tsx`.
2. Saat ini, *dropdown* "Dikerjakan Oleh" menyimpan *value* berupa `employeeId`.
3. Sebelum mengirim data ke komponen cetak struk (atau sebelum menyimpannya ke *database* untuk dicetak), lakukan pencarian (*lookup*) ID tersebut ke dalam daftar data Karyawan untuk mendapatkan *field* `employeeName`.
4. Pastikan teks yang di- *render* pada baris `(Oleh: ...)` di dalam struk adalah *string* nama asli karyawan (contoh: "Roni"), bukan *string ID hash* dari PostgreSQL/Prisma.

Silakan lakukan perbaikan format cetak dan *mapping* data ini! Lapor kembali jika jendela *print* otomatis menggunakan ukuran kertas kasir dan nama yang tercetak adalah nama manusia yang sebenarnya!
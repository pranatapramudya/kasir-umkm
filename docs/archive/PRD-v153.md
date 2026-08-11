# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.53
**Fokus:** Modifikasi Inti Kasir Jasa (Bypass Stok & Assign Karyawan)

## 1. Analisis Kebutuhan "Dapur" Jasa
Sistem membutuhkan perombakan logika saat `kategoriUsaha === 'Jasa'`:
*   Layanan tidak memiliki batas fisik, sehingga validasi stok (Out of Stock) harus di-bypass.
*   Setiap item layanan yang terjual harus dapat dihubungkan dengan Pekerja/Karyawan (Terapis/Kapster) yang mengerjakannya untuk keperluan rekap komisi di masa depan.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan modifikasi pada Form Manajemen Layanan dan Keranjang Kasir Jasa. DILARANG memberikan *output* kode mentah.

### A. Bypass Sistem Stok pada Form Layanan
*   **Target File:** `app/admin/products/page-client.tsx` (Form Tambah/Edit).
*   **Instruksi:**
    1. Pastikan field `Stok Awal` dan `Batas Stok Menipis` **SEMBUNYI TOTAL** (Hidden) jika `kategoriUsaha === 'Jasa'`.
    2. Pada fungsi `onSubmit` (sebelum mengirim *payload* POST/PUT ke API), manipulasi data khusus untuk Jasa: Set nilai `stok = 999999` (angka sangat besar/infinite) agar validasi keranjang kasir tidak pernah memblokir transaksi karena alasan stok habis.

### B. Injeksi "Pilih Pekerja" di Keranjang Kasir Jasa
*   **Target File:** `app/admin/kasir-jasa/page-client.tsx` (Komponen Keranjang / Cart).
*   **Instruksi:**
    1. Lakukan `fetch` data karyawan yang terdaftar pada *tenant* ini (ambil dari `tabel User/Karyawan` dengan role employee). Jika belum ada API-nya, gunakan data statis `['Karyawan A', 'Karyawan B']` sementara.
    2. Pada setiap **Item Layanan** yang masuk ke keranjang (di bawah nama layanan/harga), tambahkan elemen *Dropdown* (Select) wajib isi berlabel: **"Dikerjakan oleh:"**.
    3. Simpan data pekerja terpilih ke dalam *state* item keranjang tersebut (misal: `cartItem.employeeId` atau `cartItem.workerName`).

### C. Validasi Checkout (Blocker)
*   **Target File:** Fungsi *Checkout* / `BAYAR SEKARANG`.
*   **Instruksi:**
    1. Blokir tombol `BAYAR SEKARANG` (disabled) atau tampilkan *Toast Error* jika mode Jasa sedang aktif NAMUN ada item di keranjang yang belum dipilih "Dikerjakan oleh"-nya.
    2. Pastikan data pekerja (`workerName` atau `employeeId`) ikut terkirim dalam *payload* transaksi ke *backend* untuk disimpan di *database* (Detail Transaksi).

Silakan eksekusi pondasi "Dapur" Jasa ini sekarang!
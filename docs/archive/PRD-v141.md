# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.41
**Fokus:** Bugfix Hardcoded Default Form Values (Stok & Kapasitas Meja)

## 1. Analisis Bug UI/UX
Pada saat pengguna membuka form "Tambah Produk" atau "Tambah Meja", kolom input numerik seperti `Stok Awal` sudah terisi otomatis dengan angka `100` dan `Kapasitas` terisi `4`. 
Hal ini adalah *bad practice* dalam UX karena dapat memicu kesalahan input (pengguna tidak sengaja menyimpan nilai *default* yang salah). Field tersebut harus kosong (`""`) saat form pertama kali diinisialisasi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan pada inisialisasi *React State* untuk form terkait. DILARANG memberikan *output* kode mentah.

### A. Perbaikan State Form Manajemen Produk (Berlaku untuk Semua Kategori)
*   **Target File:** `app/admin/products/page-client.tsx` (atau komponen modal form produk terkait).
*   **Instruksi:**
    1. Cari deklarasi *state* inisial untuk form produk (biasanya di dalam `useState` atau objek form awal).
    2. Ubah nilai *default* untuk `stokAwal`, `minStockThreshold`, `hpp`, dan `hargaJual` dari angka (misal `100` atau `0`) menjadi *empty string* (`""`).
    3. Pada elemen `<input type="number">`, pastikan `value` terikat dengan benar dan menangani *empty string*.
    4. **PENTING (Validasi Submit):** Saat fungsi `onSubmit` dijalankan, pastikan *string* kosong tersebut divakidasi (misal: "Stok wajib diisi!") dan dikonversi kembali menjadi `Number()` atau `parseInt()` sebelum dikirim ke API agar Prisma tidak *crash*.

### B. Perbaikan State Form Manajemen Meja (F&B)
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx` (atau komponen modal meja).
*   **Instruksi:**
    1. Cari inisialisasi state untuk penambahan meja (misal: `const [capacity, setCapacity] = useState(4)`).
    2. Ubah nilai awal `4` menjadi `""` (*empty string*).
    3. Tambahkan atribut `placeholder="Contoh: 4"` pada field Kapasitas agar pengguna tahu format yang diharapkan.
    4. Lakukan konversi tipe data ke `Int` sebelum mengirim *payload* POST/PUT ke `/api/tables`.

### C. Penyesuaian Modul Jasa / Servis (Bypass Stok)
*   **Instruksi Tambahan:** Pastikan jika *tenant* masuk dengan `kategoriUsaha === 'Jasa'`, field `Stok Awal` dan `Batas Stok Menipis` **DISEMBUNYIKAN SEPENUHNYA** dari form, dan pada saat submit API, sistem *backend* secara otomatis menetapkan stok *default* (misal: 0 atau 9999) tanpa perlu input dari pengguna.

Silakan eksekusi perbaikan form *state* ini agar tidak ada lagi angka bayangan yang muncul secara otomatis!
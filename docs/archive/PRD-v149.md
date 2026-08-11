# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.49
**Fokus:** Global Audit (Retail & F&B), Pembuatan Dokumentasi, & Inisiasi Modul Jasa

## 1. Tujuan & Konteks
Sebelum beralih ke pengembangan modul "Jasa / Servis", sistem wajib melalui *Global Audit* untuk memastikan stabilitas model bisnis Retail dan F&B yang sudah dibangun. LumeStack adalah *premium SaaS boilerplate*, sehingga standar fungsionalitas, keamanan (Multi-tenant), dan UI/UX harus berada di atas rata-rata. Hasil audit harus didokumentasikan secara permanen ke dalam repositori lokal.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Jalankan langkah-langkah di bawah ini secara berurutan. DILARANG melompati tahap dokumentasi.

### Tahap 1: Eksekusi Global System Audit
Lakukan *Code Review* dan pengecekan alur logika pada komponen berikut:
1.  **Ekosistem Retail:** Validasi kelancaran form Tambah Produk (Stok, Harga Jual, HPP), keranjang Kasir, dan cetak Struk (dengan nomor telepon dinamis & footer PJTECH).
2.  **Ekosistem F&B:** Validasi alur Manajemen Meja (Quick Toggle Status), form Tambah Menu (tanpa field SKU/Merek), keranjang Kasir Resto dengan opsi Nomor Meja & Catatan Kustom, serta kelancaran Cetak Tiket Dapur.
3.  **Isolasi Keamanan (Multi-tenant):** Pastikan seluruh fungsi CRUD menggunakan filter `tenantId` atau `userId` pemilik.
4.  **Role-Based Access Control (RBAC):** Validasi bahwa akses `role === 'employee'` terbatas dan aman sesuai konfigurasi sebelumnya.

### Tahap 2: Dokumentasi Hasil Audit (File Generation)
*   **Instruksi:** 
    1. Buat folder baru di dalam *root directory* proyek dengan nama: `docs/audits/`
    2. Buat file *Markdown* baru di dalam folder tersebut dengan nama: `audit-retail-fnb-v1.md`
    3. Tuliskan Laporan Hasil Audit (dari Tahap 1) secara detail di dalam file tersebut. Gunakan format tabel atau *bullet points* untuk status (PASS / FAIL).
    4. Berikan Kesimpulan Akhir: Apakah sistem Retail dan F&B sudah di atas rata-rata dan *Production-Ready*?

### Tahap 3: Inisiasi Modul Jasa / Servis (Jika Tahap 2 PASS)
**HANYA JIKA** hasil audit di Tahap 2 menyatakan LULUS (PASS) dan tidak ada *bug* kritikal, segera lakukan inisialisasi awal untuk model bisnis Jasa:
*   **Target File:** Komponen Form Produk/Layanan dan Keranjang Kasir.
*   **Instruksi Awal (Conditional Rendering):** 
    1. Buat kondisi jika `kategoriUsaha === 'Jasa'`, ubah semua istilah teks "Produk" atau "Barang" menjadi "Layanan".
    2. Sembunyikan *field* `Stok Awal` dan `Batas Stok Menipis` pada form Tambah/Edit Layanan (karena bisnis jasa tidak menggunakan inventaris fisik).
    3. *Bypass* validasi stok di *backend* khusus untuk kategori Jasa agar layanan selalu bisa di-*checkout* kapan pun (stok *infinite*).

Silakan jalankan audit komprehensif ini, simpan laporannya ke dalam folder `docs/audits/`, dan lanjutkan ke inisiasi Modul Jasa!
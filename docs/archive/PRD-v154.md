# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.54
**Fokus:** Perombakan UI Form Layanan (Jasa) & Injeksi Sistem Komisi Dasar

## 1. Analisis Kebutuhan Form Jasa
Berdasarkan evaluasi UI pada form Tambah/Edit saat mode Jasa aktif:
*   Terminologi masih menggunakan "Produk", bukan "Layanan".
*   Field identifikasi barang fisik (SKU, Merek, Varian) masih muncul dan tidak relevan.
*   **Kebutuhan Bisnis (Baru):** Bisnis jasa membutuhkan parameter "Komisi Pekerja" pada setiap layanan untuk menghitung upah/bagi hasil bagi kapster/terapis per transaksi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan modifikasi visual (Conditional Rendering) dan perbarui Skema Database untuk mendukung fitur Komisi. DILARANG memberikan *output* kode mentah.

### A. Perubahan Terminologi & Penyembunyian Field (Conditional UI)
*   **Target File:** `app/admin/products/page-client.tsx` (Komponen Modal Form Tambah/Edit).
*   **Instruksi (Hanya aktif jika `kategoriUsaha === 'Jasa'`):**
    1. Ubah teks *Header* Modal dari `Tambah Produk Baru` menjadi `Tambah Layanan Baru`.
    2. Ubah label `Nama Produk *` menjadi `Nama Layanan *`.
    3. Ubah teks tombol *Submit* dari `Simpan Produk` menjadi `Simpan Layanan`.
    4. **SEMBUNYIKAN (Hide)** field input berikut secara permanen dari UI: `Kode Barang (SKU)`, `Merek`, dan `Varian / Ukuran`.
    5. Ubah label `HPP (Modal)` menjadi `Biaya Bahan (Opsional)` (karena beberapa jasa seperti *coloring* rambut membutuhkan modal bahan kimia).

### B. Injeksi Field "Komisi Pekerja" & Update Database
*   **Target File 1 (Backend):** `prisma/schema.prisma`
*   **Instruksi Backend:**
    1. Tambahkan field baru pada model `Product` (yang juga berfungsi sebagai Layanan): `employeeCommission Int? @default(0)`
    2. Jalankan `npx prisma db push` secara senyap untuk memperbarui skema.
    3. Pastikan API POST/PUT di `/api/products` menerima dan memproses *payload* `employeeCommission`.
*   **Target File 2 (Frontend):** `app/admin/products/page-client.tsx`
*   **Instruksi Frontend:**
    1. Tambahkan satu *input field* bertipe `number` baru tepat di bawah/sebelah `Harga Jual`.
    2. Beri label: `Komisi Pekerja (Rp)`.
    3. Berikan *placeholder/helper text*: "Nominal bagi hasil untuk pekerja per transaksi."
    4. Pastikan field ini HANYA MUNCUL jika `kategoriUsaha === 'Jasa'`.
    5. Hubungkan input ini ke dalam *state* form dan pastikan terkirim dalam *payload* saat di-submit.

Silakan eksekusi perombakan Form Jasa ini agar 100% relevan dengan industri layanan!
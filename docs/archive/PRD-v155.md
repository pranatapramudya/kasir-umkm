# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.55
**Fokus:** Dinamisasi Input Kategori (Form Layanan/Produk)

## 1. Analisis Bug Logika
Berdasarkan tinjauan pada form "Tambah Layanan Baru", *field* `Kategori` masih menggunakan elemen `dropdown` (`<select>`) dengan nilai *hardcoded* khusus F&B ("Makanan", "Minuman", dll). Hal ini sangat tidak relevan untuk ekosistem model Jasa atau Retail yang memiliki jenis kategori tak terbatas (seperti "Grooming", "Reparasi", "Sembako", dll).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Ubah pendekatan *input* Kategori agar 100% fleksibel bagi seluruh *tenant* LumeStack. DILARANG memberikan *output* kode mentah.

### A. Perombakan Elemen Kategori (Global untuk Semua Model)
*   **Target File:** `app/admin/products/page-client.tsx` (Komponen Modal Form Tambah/Edit).
*   **Instruksi:**
    1. Cari elemen `Kategori` yang saat ini menggunakan `<select>` beserta *option hardcoded*-nya.
    2. Hapus elemen `<select>` tersebut.
    3. Ganti menjadi elemen `<input type="text" />` standar.
    4. Beri atribut *placeholder*: `Contoh: Pangkas Rambut, Cuci Mobil, dll...` (Sesuaikan jika ini Jasa, atau biarkan generic seperti `Masukkan nama kategori...`).
    5. Pastikan *state binding* (misal `onChange={(e) => setKategori(e.target.value)}`) tetap terhubung dengan *payload* API.

### B. Validasi Konsistensi
*   Pastikan perubahan ini berlaku untuk komponen form Tambah maupun Edit.
*   Dengan menjadi *Free Text Input*, pengguna kini bebas menentukan kategori mereka sendiri sesuai dengan model bisnis masing-masing tanpa terkekang oleh daftar statis.

Silakan eksekusi perbaikan elemen input Kategori ini sekarang agar form sepenuhnya adaptif!
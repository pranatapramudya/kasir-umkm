# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.59
**Fokus:** Konversi Dropdown Kategori Statis Menjadi Input Dinamis (Creatable Autocomplete)

## 1. Analisis Kebutuhan (Skalabilitas Fitur)
*   **Kelemahan Saat Ini:** Form "Tambah Produk Baru" menggunakan elemen `<select>` bawaan dengan daftar kategori yang dikunci secara *hardcode* (Makanan, Minuman, dsb). Ini membatasi fleksibilitas jenis bisnis UMKM yang bisa menggunakan aplikasi ini.
*   **Tujuan:** Mengganti elemen tersebut menjadi kolom teks bebas (`<input type="text">`) yang dilengkapi dengan fitur *Autocomplete/Suggestions*. Daftar saran ini harus diambil secara dinamis dari kategori-kategori yang sudah pernah diinput pengguna sebelumnya ke dalam *database*.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Rombak form input Kategori di sisi *Frontend* dan buat logika pengambilan riwayat kategori di sisi *Backend/Server*.

### A. Ekstraksi Data Kategori Unik (Backend / Prisma)
*   **Target Logika:** Fungsi yang mengambil daftar produk untuk form ini.
*   **Instruksi Query (Prisma):**
    1. Anda harus menarik daftar kategori yang sudah pernah ada di basis data agar bisa dijadikan "saran" (*suggestions*).
    2. Gunakan kueri agregasi pada tabel `Product`. Anda bisa menggunakan metode `findMany` yang dikombinasikan dengan `distinct: ['category']`, atau melakukan seleksi khusus untuk mengambil kolom kategori saja.
    3. Ekstrak hasilnya menjadi sebuah *array of strings* (contoh: `['Makanan', 'Minuman', 'Kopi Susu', 'Snack']`) dan teruskan data ini ke komponen *Client/Form*.

### B. Perombakan Komponen Input UI (Frontend)
*   **Target File:** Komponen Form "Tambah Produk Baru" (elemen Kategori).
*   **Instruksi Logika React & UI:**
    1. Hapus elemen `<select>` dan tag `<option>` yang di-*hardcode*.
    2. Ganti dengan elemen `<input type="text">`. Berikan *placeholder* seperti `"Ketik kategori baru atau pilih dari daftar..."`.
    3. Terapkan kelas Tailwind agar bentuk input ini sama persis dengan kolom "Kode Barang (SKU)" atau "Nama Produk" di atasnya.
    4. **Logika State & Filter:** 
       * Buat *state* untuk menampung teks yang sedang diketik (`inputValue`).
       * Buat logika filter: Saat pengguna mengetik, saring *array* kategori unik dari *backend* yang cocok dengan ketikan pengguna (*case-insensitive*).
    5. **Menu Melayang (Suggestions Dropdown):**
       * Jika hasil saringan ada DAN input sedang fokus (*onFocus*), tampilkan menu melayang (gunakan posisi absolut tepat di bawah kolom input, mirip dengan perbaikan menu periode di PRD sebelumnya).
       * Tampilkan hasil saringan sebagai daftar yang bisa diklik. Jika diklik, *value* dari input teks akan otomatis terisi dengan teks saran tersebut.
    6. **Kebebasan Teks (Creatable):**
       * Pengguna TIDAK WAJIB memilih dari saran. Jika pengguna mengetik kategori yang sama sekali baru dan mengklik "Simpan Produk", kirim teks string baru tersebut apa adanya ke *database*.
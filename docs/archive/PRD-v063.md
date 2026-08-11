# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.63
**Fokus:** Modernisasi UI Kategori - Konversi Horizontal Pills Menjadi Dropdown Filter Menu

## 1. Analisis Kebutuhan UI/UX
*   **Masalah Visual Saat Ini:** Kategori produk ("Semua", "Minuman", dll.) ditampilkan sebagai deretan kapsul (*pills*) secara horizontal di bawah bar pencarian. Desain ini memakan ruang vertikal dan tidak *scalable* jika pengguna memiliki puluhan kategori unik.
*   **Tujuan Desain (Clean UI):** Menyembunyikan seluruh opsi kategori tersebut ke dalam satu tombol "Filter" yang ringkas. Tombol ini akan diletakkan sejajar dengan bar pencarian. Ketika diklik, akan muncul menu *dropdown* (atau *pop-over*) yang berisi daftar kategori untuk dipilih.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Sebagai agen pengembang, jangan merombak logika ekstraksi kategori dinamis yang sudah berjalan. Tugas Anda HANYA mengubah bentuk representasi visualnya (UI) dan *state management* untuk *dropdown* tersebut.

### A. Rombak Tata Letak Bar Pencarian & Filter
*   **Target File:** Komponen Header di halaman Kasir POS (tempat bar pencarian berada).
*   **Instruksi Styling (Tailwind):**
    1.  Hapus kontainer pembungkus yang saat ini menampung deretan kapsul kategori secara horizontal.
    2.  Bungkus bar pencarian (`<input>`) ke dalam sebuah *flex container* baru yang sejajar secara horizontal (`flex flex-row items-center gap-2`).
    3.  Atur agar bar pencarian mengambil sisa ruang yang ada (berikan kelas `flex-1` atau `w-full`).
    4.  Tepat di sebelah kanan bar pencarian, tambahkan sebuah tombol (`<button>`) berbentuk kotak bersudut melengkung (*rounded-lg* atau *rounded-xl*) dengan ukuran proporsional (misal `w-10 h-10` atau `p-2`).
    5.  Isi tombol tersebut dengan ikon **Filter** (seperti corong/funnel atau slider). Berikan gaya dasar tombol sekunder (latar putih, border abu-abu, *hover effect*).

### B. Implementasi Logika Dropdown Menu
*   **Instruksi State & Popover:**
    1.  Buat *state* React baru untuk mengontrol buka/tutup menu filter ini (contoh: `isCategoryMenuOpen`).
    2.  Ikat *state* ini pada *event* `onClick` di tombol ikon Filter yang baru dibuat.
    3.  Buat elemen kontainer *dropdown* dengan posisi absolut (`absolute`) yang melayang tepat di bawah tombol Filter tersebut. Pastikan nilai `z-index` cukup tinggi (misal `z-50`) dan gunakan *background* putih solid dengan bayangan (*shadow-lg*).
    4.  Pindahkan *mapping* *array* kategori unik (yang sebelumnya dirender menjadi kapsul horizontal) ke dalam *dropdown* ini. Render sebagai *list item* vertikal yang rapi.

### C. UX Handling & Pemilihan Kategori
*   **Instruksi Interaksi:**
    1.  Berikan indikator visual (seperti teks tebal, warna latar berbeda, atau ikon centang) pada nama kategori di dalam *dropdown* yang saat ini sedang aktif dipilih.
    2.  Ketika pengguna mengklik salah satu kategori di dalam menu tersebut:
        *   Perbarui *state* kategori aktif untuk memfilter produk.
        *   WAJIB otomatis menutup menu *dropdown* (`isCategoryMenuOpen` menjadi `false`).
    3.  *(Opsional namun sangat direkomendasikan):* Jika kategori yang terpilih BUKAN "Semua", berikan indikator visual pada tombol Filter di luar (misalnya, berikan titik merah kecil atau ubah warna ikon menjadi biru) agar pengguna tahu bahwa filter sedang aktif beroperasi.
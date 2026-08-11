# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.64
**Fokus:** Penyempurnaan UX Tombol Filter Kategori (Label Dinamis)

## 1. Analisis Kebutuhan UI/UX
*   **Masalah Visual:** Tombol filter saat ini hanya berupa ikon corong (*funnel*) tunggal. Meskipun terlihat bersih, ini kurang komunikatif (*kurang discoverable*) bagi pengguna awam yang mungkin tidak memahami arti ikon tersebut.
*   **Tujuan Desain:** Melebarkan tombol filter untuk menampung teks pendamping di sebelah ikon. Teks ini harus bersifat dinamis (berubah sesuai dengan kategori yang sedang aktif dipilih) agar berfungsi ganda sebagai indikator filter.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Fokus pada penyesuaian kelas Tailwind pada tombol Filter dan penerapan logika *Conditional Rendering* untuk teks di dalamnya.

### A. Perubahan Anatomi Tombol Filter
*   **Target File:** Komponen Header di halaman Kasir POS (tempat tombol Filter berada).
*   **Instruksi Styling Dasar (Tailwind):**
    1.  Cari tombol ikon Filter yang baru Anda buat sebelumnya.
    2.  Ubah bentuknya dari bujur sangkar statis menjadi tombol fleksibel yang memanjang. Hapus utilitas lebar/tinggi tetap (seperti `w-10 h-10`).
    3.  Ganti dengan utilitas *padding* horizontal dan vertikal proporsional (contoh: `px-3 py-2`).
    4.  Pastikan tombol memiliki pengaturan `flex items-center gap-2` agar ikon dan teks pendampingnya sejajar rapi di tengah.

### B. Implementasi Teks Dinamis (Active State Label)
*   **Instruksi Logika Render:**
    1.  Sisipkan elemen teks (misal `<span>`) di sebelah kanan ikon corong di dalam tombol tersebut.
    2.  Gunakan operator *ternary* pada variabel *state* kategori aktif Anda (misal `activeCategory`).
    3.  **Logika Teks:** JIKA `activeCategory` bernilai `"Semua"` (atau kosong/null), MAKA render teks `"Kategori"`.
    4.  JIKA `activeCategory` memiliki nilai lain (contoh: `"Minuman"` atau `"Cemilan"`), MAKA render teks tersebut langsung di dalam tombol (contoh teks menjadi `"Minuman"`). Batasi panjang karakter jika perlu agar tombol tidak melar berlebihan (menggunakan utilitas *truncate*).

### C. Indikator Visual Ekstra (Active Highlight)
*   **Instruksi Feedback Visual:**
    1.  Agar lebih jelas bahwa filter sedang aktif beroperasi, ubah warna tombol jika kategorinya BUKAN `"Semua"`.
    2.  JIKA kategori `"Semua"`: Gunakan warna standar (teks abu-abu/hitam, latar putih, border standar).
    3.  JIKA filter aktif (misal `"Minuman"`): Ubah latar belakang tombol menjadi biru sangat muda (contoh `bg-blue-50`), teks menjadi biru tebal (`text-blue-600 font-semibold`), dan border biru (`border-blue-200`). Ini memberikan sinyal kuat kepada pengguna bahwa mereka sedang tidak melihat seluruh katalog produk.
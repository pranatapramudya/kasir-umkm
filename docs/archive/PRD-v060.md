# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.60
**Fokus:** Pembersihan UX Autocomplete Kategori & Bugfix Sinkronisasi Stok (Cache Invalidation)

## 1. Analisis Bug & Kebutuhan UI
*   **UX Kategori (Kerapian Visual):** Daftar saran/riwayat kategori saat ini tampil tidak pada tempatnya atau terlalu persisten. Harus dibuat mode *stealth* (siluman) yang hanya muncul saat berinteraksi.
*   **Fatal Data Mismatch (Stok):** Terdapat perbedaan fatal pada pembacaan data. Halaman "Manajemen Produk" menampilkan stok `97`, sedangkan halaman "Kasir POS" untuk produk yang sama persis menampilkan stok `10`. Hal ini disebabkan oleh *stale data* akibat mekanisme *caching* bawaan Next.js atau perbedaan manajemen *state* antar halaman.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Sebagai agen pengembang, fokuslah pada pengelolaan siklus hidup komponen (*component lifecycle*), *event handler* UI, dan pembatalan *cache* (Cache Invalidation) pada *fetcher*. DILARANG memberikan *output* kode mentah di luar arsitektur ini.

### A. UX Cleanup: Interaktivitas Autocomplete Kategori
*   **Target File:** Komponen Input Kategori di Form Tambah/Edit Produk.
*   **Instruksi Logika Event:**
    1. Ikat elemen kontainer *dropdown* saran kategori dengan logika kondisi berbasis *state* (misal: `isDropdownVisible`).
    2. **Event onFocus:** Saat pengguna mengklik kolom input Kategori, ubah *state* menjadi `true` (tampilkan saran).
    3. **Event onBlur:** Saat pengguna mengklik area di luar kolom input, ubah *state* menjadi `false` (sembunyikan saran). *Catatan penting: Berikan sedikit jeda (setTimeout sekitar 150ms) pada onBlur agar pengguna memiliki waktu untuk mengklik item di dalam dropdown sebelum elemen tersebut menghilang.*
    4. **Event onChange (Mengetik):** Filter daftar saran berdasarkan teks yang diketik. Jika hasil filter kosong, otomatis sembunyikan *dropdown*.

### B. Bugfix Mutlak: Sinkronisasi Stok Lintas Menu (Backend/Caching)
*   **Target File:** *Endpoint* API untuk mengambil daftar produk (misal: `app/api/products/route.ts`) DAN/ATAU Server Component yang melakukan *fetch* data di halaman Kasir.
*   **Instruksi Logika Cache Invalidation:**
    1. Next.js App Router secara *default* akan melakukan *cache* agresif pada pemanggilan data. Anda harus mematikan *cache* statis ini khusus untuk kueri Produk karena stok adalah entitas data yang sangat dinamis (wajib *real-time*).
    2. Jika menggunakan Fetch API bawaan, pastikan opsi `cache: 'no-store'` disematkan pada fungsi *fetch* di halaman Kasir.
    3. Jika mengambil data langsung via Prisma di dalam Server Component, deklarasikan rute tersebut sebagai rute dinamis dengan mengekspor konfigurasi `revalidate = 0` atau `dynamic = 'force-dynamic'` di bagian paling atas file halaman Kasir.

### C. Validasi QA (Quality Assurance) Akhir
*   **Validasi UI:** Buka pop-up "Tambah Produk". Kolom kategori harus bersih. Saat diklik, baru riwayat lama muncul.
*   **Validasi Data:** Edit stok produk "kapal api" di menu Produk menjadi angka acak (misal: 150). Pindah ke menu Kasir POS. Halaman Kasir wajib menampilkan angka 150 tanpa pengguna perlu melakukan *refresh* paksa di peramban.
# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.62 (CRITICAL SYSTEM OVERRIDE)
**Fokus:** REVISI MUTLAK - Penolakan Klaim Palsu AI & Paksaan Arsitektur Dynamic

> [!CAUTION] 
> **META INSTRUCTION UNTUK AI AGENT:** 
> BACA INSTRUKSI INI DENGAN SEKSAMA! Laporan eksekusi Anda sebelumnya GAGAL dalam Quality Assurance. Solusi `cache: 'no-store'` Anda TIDAK BERFUNGSI untuk pemanggilan Prisma langsung. Anda juga MENGABAIKAN instruksi dinamisasi filter kategori di halaman Kasir. Terapkan 3 poin di bawah ini TANPA ALASAN.

## 1. FIX MUTLAK 1: Force Dynamic untuk Prisma (Bug Stok)
*   **Fakta Kesalahan:** Pemanggilan data di Next.js menggunakan *instance* Prisma (`prisma.product.findMany`) TIDAK BISA di-*bypass cache*-nya menggunakan opsi `cache: 'no-store'`. Itu hanya berlaku untuk fungsi `fetch`.
*   **Target File:** `app/page.tsx` (Kasir) & `app/admin/products/page.tsx`.
*   **Instruksi Eksekusi:**
    1. Pergi ke baris paling atas dari KEDUA file tersebut (di bawah deklarasi *import*).
    2. WAJIB tambahkan baris sintaks ekspor konfigurasi rute ini:
       `export const dynamic = 'force-dynamic';`
    3. Ini akan memaksa Next.js merender halaman secara SSR di setiap *request*, menjamin stok `97` di Dasbor akan langsung terbaca `97` di Kasir tanpa jeda!

## 2. FIX MUTLAK 2: Matikan Native Autocomplete Browser (Bug UI Kategori)
*   **Fakta Kesalahan:** Teks yang bertumpuk dan muncul garis bawah merah di dalam kolom Kategori adalah UI bawaan Google Chrome/Safari yang menabrak UI *dropdown custom* buatan Anda.
*   **Target File:** Komponen Form Input Kategori.
*   **Instruksi Eksekusi:**
    1. Cari elemen HTML `<input>` yang digunakan untuk mengetik Kategori.
    2. Tambahkan atribut HTML standar ini secara eksplisit ke dalam elemen tersebut: `autoComplete="off"`.
    3. Ini memastikan *browser* dilarang keras memunculkan *pop-up* saran miliknya sendiri, sehingga hanya menu "mode siluman" buatan kita yang bekerja.

## 3. FIX MUTLAK 3: Hapus Hardcode Filter Kategori (Kasir POS)
*   **Fakta Kesalahan:** Kapsul/tombol filter di halaman Kasir POS (Semua, Makanan, Minuman, Cemilan) masih diketik manual (*hardcoded*).
*   **Target File:** Komponen Navigasi Kategori di halaman Kasir POS.
*   **Instruksi Eksekusi:**
    1. HAPUS *array* statis `['Makanan', 'Minuman', 'Cemilan', ...]` dari kode sumber Anda.
    2. Ambil data `products` yang di- *fetch* dari *database*.
    3. Gunakan logika JavaScript (seperti `Set` dan `.map()`) untuk mengekstrak hanya nama-nama unik dari properti `category` pada produk-produk tersebut.
    4. Buat *array* baru yang isinya elemen `"Semua"` diikuti dengan daftar kategori unik yang baru diekstrak.
    5. *Mapping* (*render*) *array* dinamis tersebut menjadi tombol-tombol filter di UI Kasir.
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.94
**Fokus:** Sinkronisasi Key Prisma (Schema Mismatch), Injeksi Field Baru, & Pengamanan Payload Gambar

## 1. Analisis Akar Masalah (Kritis P0 - Edit Gagal Total)
*   **Akar Masalah 1 (Unknown Argument):** Berdasarkan *error log*, Anda memetakan objek menggunakan *key* bahasa Inggris (`name`, `category`, `stock`, `discount`), sedangkan skema Prisma menggunakan bahasa Indonesia (`nama`, `kategori`, `stok`, `diskon`). Ini menyebabkan Prisma menolak *payload* sepenuhnya.
*   **Akar Masalah 2 (Missing Fields):** Properti `brand` dan `variant` sama sekali tidak disertakan ke dalam *payload* `prisma.product.update`.
*   **Akar Masalah 3 (Base64 Database Crash):** Anda mengirimkan gambar dalam bentuk raw Base64 yang masif ke kolom `image`. Jika kolom tersebut bertipe `String` standar, ini akan menyebabkan *Data too long for column* error di tingkat SQL.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
DILARANG memberikan kode mentah kepada pengguna. Buka file rute API Anda (misal: `app/api/products/[id]/route.ts`) dan perbaiki arsitekturnya secara langsung mengikuti aturan berikut.

### A. Kalibrasi Key Prisma (Strict Mapping)
*   **Target File:** `app/api/products/[id]/route.ts`
*   **Instruksi:** Pada blok `data: { ... }` di dalam `prisma.product.update`, Anda WAJIB menggunakan nama kunci (key) yang 100% cocok dengan `schema.prisma`. 
    Ubah pemetaan Anda menjadi seperti ini:
    - `nama: name || ""` (Bukan `name: name`)
    - `kategori: category || ""` (Bukan `category: category`)
    - `stok: parseInt(stock, 10) || 0` (Bukan `stock: ...`)
    - `diskon: parseInt(discount, 10) || 0` (Bukan `discount: ...`)
    - `hpp: parseInt(hpp, 10) || 0`
    - `hargaJual: parseInt(hargaJual, 10) || 0`

### B. Injeksi Properti Varian & Merek
*   **Instruksi:** Tambahkan `brand` dan `variant` ke dalam blok `data` tersebut.
    - `brand: brand || ""`
    - `variant: variant || ""`
    (Pastikan Anda juga sudah mengekstrak variabel `brand` dan `variant` dari `request.json()` di baris atas).

### C. Bypass Payload Gambar (Pengamanan Database)
*   **Instruksi:** Untuk versi MVP ini, jika *payload* gambar adalah Base64 yang masif, JANGAN sertakan field `image` ke dalam kueri `prisma.product.update` untuk sementara waktu, kecuali pengguna sudah mengonfigurasi kolom tersebut sebagai `db.Text` di Prisma atau menggunakan URL Object Storage. Hapus sementara baris `image: ...` dari payload pembaruan agar data teks yang jauh lebih penting dapat tersimpan.
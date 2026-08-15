# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.12
**Fokus:** Pengembangan Modul Jasa - Dynamic Tenant Booking & POS Integration (Local Environment)

## 1. Objektif
Mengembangkan sistem pemesanan (*booking*) layanan mandiri untuk kategori usaha "Jasa/Servis" (misal: Barbershop, Salon). Setiap entitas/pemilik toko akan memiliki tautan unik (*slug*) yang dapat dibagikan kepada pelanggan. Pelanggan dapat membuat jadwal, dan pesanan tersebut akan masuk secara terisolasi ke *dashboard* masing-masing pemilik toko untuk diproses menjadi transaksi kasir.

## 2. Arsitektur Database (Prisma Schema Update)
AI Agent diinstruksikan untuk memodifikasi file `prisma/schema.prisma`.
*   **Update Model Tenant/Store (Toko):** Tambahkan kolom `slug` (Tipe: `String @unique`). Field ini akan digunakan sebagai URL unik toko (contoh: `barbershop-udin`).
*   **Create Model `Booking`:** Buat tabel baru untuk menampung data reservasi pelanggan dengan *field*:
    *   `id` (String, UUID)
    *   `customerName` (String)
    *   `customerPhone` (String)
    *   `bookingDate` (DateTime)
    *   `notes` (String, opsional)
    *   `status` (Enum: `PENDING`, `COMPLETED`, `CANCELLED`) - Default: `PENDING`
    *   Relasi ke `Product` atau layanan yang dibooking.
    *   Relasi ke `Tenant` (wajib, untuk memastikan *Multi-Tenant Isolation* menggunakan `tenantId` atau `userId`).
*   **Instruksi Terminal:** Setelah skema diubah, jalankan `npx prisma db push` (untuk sinkronisasi di local) dan `npx prisma generate`.

## 3. Dynamic Routing & UI Frontend (Pelanggan)
*   **Target File:** Buat *dynamic route* baru di `app/book/[slug]/page.tsx`.
*   **Logika Sistem:**
    1. Ambil parameter `slug` dari URL.
    2. *Query* ke database untuk mencari identitas toko dan daftar layanan (jasa) yang tersedia berdasarkan `slug` tersebut.
    3. Jika `slug` tidak ditemukan, tampilkan halaman 404 (Not Found).
*   **UI/UX Pelanggan:** Tampilkan halaman pemesanan yang bersih dan responsif. Sediakan *form* untuk memilih layanan, tanggal, jam, nama pelanggan, dan tombol "Buat Jadwal". Gunakan *state* `isSubmitting` untuk mencegah *spam* klik.

## 4. API & Backend (Pengolahan Data Booking)
*   **Target File:** Buat API route di `app/api/booking/route.ts`.
*   **Logika Sistem:** Menerima data *POST* dari *form* pelanggan, melakukan validasi ketersediaan jam/layanan, dan menyimpan data ke tabel `Booking`. **WAJIB** menyertakan ID pemilik toko (`tenantId`/`userId`) yang valid dari relasi *slug* agar pesanan tidak nyasar ke toko lain.

## 5. Dashboard Owner & Integrasi Kasir
*   **Target File:** Buat halaman manajemen jadwal di `app/admin/booking/page.tsx`.
*   **Isolasi Multi-Tenant (CRITICAL):** *Query* data `Booking` dari database **HANYA** yang cocok dengan `userId` dari sesi otentikasi (Clerk) yang sedang *login*. Jangan sampai pemilik salon melihat jadwal tukang cukur.
*   **Interaksi UI:** Sediakan tabel atau daftar *card* berisi nama pelanggan, jam *booking*, dan layanan. Berikan tombol aksi "Proses ke Kasir" yang akan mengubah status *booking* menjadi `COMPLETED` dan membawa detail harga layanan tersebut ke *state* Keranjang Kasir untuk dicetak struknya.

Silakan eksekusi langkah 2 hingga 5 secara berurutan dan pastikan tidak ada *error* TypeScript selama proses pengembangan di localhost!
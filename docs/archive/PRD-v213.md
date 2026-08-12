# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.13
**Fokus:** Perbaikan Bug UI Pricing & Pengembangan Modul Jasa (Dynamic Tenant Booking)

## 1. Objektif
Melakukan perbaikan cepat (*hotfix*) pada *copywriting* dan kalkulasi harga di komponen *Pricing*, dilanjutkan dengan implementasi sistem pemesanan (*booking*) mandiri untuk kategori usaha "Jasa/Servis" dengan isolasi *Multi-Tenant* yang ketat (berbasis `userId` dan `slug`).

## 2. Hotfix: Komponen Pricing
**Target File:** Komponen yang menangani UI Pricing (misal: `components/Pricing.tsx`, `app/(marketing)/pricing/page.tsx`, atau file konstan `constants/pricing.ts`).
**Instruksi:**
1. Cari teks `"Semua Fitur Pro 6 Bulan"` pada paket Tahunan dan ubah menjadi `"Semua fitur di paket Dasar/Pro"`.
2. Perbaiki logika harga paket Tahunan: Jika ada *badge* `"Hemat 2 Bulan"`, maka harga harus diubah dari `Rp 1.188k` menjadi `Rp 990k` (atau 990.000). Pastikan perbaikan ini tercermin secara visual di UI.

## 3. Pengecekan Skema & Update Database (Prisma)
**Target File:** `prisma/schema.prisma`
**Instruksi:**
1. **Validasi Awal:** Pastikan model `Tenant` (atau model *user* yang menampung profil toko) sudah memiliki kolom penanda kategori usaha (misalnya `kategoriUsaha`, `category`, atau `businessType`).
2. **Update Model Tenant:** Tambahkan kolom `slug` (Tipe: `String? @unique`). Slug ini akan digunakan sebagai URL publik toko (contoh: `barbershop-udin`).
3. **Create Model `Booking`:** Buat tabel baru dengan kolom:
    *   `id` (String, UUID, sebagai Primary Key)
    *   `customerName` (String)
    *   `customerPhone` (String)
    *   `bookingDate` (DateTime)
    *   `notes` (String, opsional)
    *   `status` (Enum `BookingStatus`: `PENDING`, `COMPLETED`, `CANCELLED` - default `PENDING`)
    *   Relasi ke model `Product` (opsional, untuk jasa yang dipilih).
    *   Relasi ke `Tenant`/`User` (Wajib, gunakan `userId` atau `tenantId` untuk *Multi-Tenant Isolation*).
4. **Eksekusi:** Jalankan `npx prisma db push` dan `npx prisma generate` di terminal.

## 4. UI/UX Pelanggan: Halaman Booking Publik
**Target File:** Buat `app/book/[slug]/page.tsx` (Server Component) dan `BookingForm.tsx` (Client Component).
**Instruksi:**
1. Tangkap parameter `slug` dari URL.
2. Lakukan *query* ke database. Jika `slug` tidak ditemukan, tampilkan `notFound()`.
3. Render *form* pemesanan modern yang berisi input: Layanan, Tanggal, Jam (Hardcoded 08:00 - 21:00, interval 30 menit), Nama, dan Nomor HP.
4. Gunakan state `isSubmitting` pada tombol *submit* dan kirim data via metode POST ke endpoint `/api/booking`.

## 5. API Backend: Pengolahan Booking
**Target File:** Buat `app/api/booking/route.ts`
**Instruksi POST:**
1. Terima *payload* dari `BookingForm`.
2. Validasi kelengkapan data.
3. Cari `userId` berdasarkan `slug` yang dikirim, lalu simpan pesanan ke tabel `Booking` dengan mengaitkan `userId` tersebut (Sangat krusial untuk mencegah kebocoran data antar toko).

## 6. Dashboard Owner: Manajemen Jadwal & Sidebar
**Target File 1:** Sidebar Client Component (misal: `components/SidebarClient.tsx`)
*   Tambahkan menu **"Jadwal Booking"** di bawah grup Manajemen Bisnis.
*   **Logika Kondisional:** Menu ini HANYA boleh dirender jika variabel kategori usaha (misal `tenant.kategoriUsaha`) bernilai `"Jasa / Servis"`.

**Target File 2:** Halaman Jadwal (`app/admin/booking/page.tsx`)
*   Pastikan rute ini dilindungi oleh otentikasi (Clerk).
*   *Query* data `Booking` dari database dengan klausa `where: { userId: session.userId }`.
*   Tampilkan data dalam bentuk *card* atau tabel dengan *polling* *auto-refresh* setiap 30 detik (gunakan SWR atau React Query).
*   Sediakan tombol aksi **"Proses ke Kasir"** yang akan mengubah status pesanan menjadi `COMPLETED` dan mengarahkan *user* ke halaman kasir (`/admin/kasir`) membawa data parameter pemesanan.

Silakan baca dan eksekusi langkah 2 hingga 6 secara berurutan. Pastikan tidak ada *error* TypeScript selama proses penulisan kode!
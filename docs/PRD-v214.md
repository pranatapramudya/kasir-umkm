# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.14
**Fokus:** Mobile Menu Isolation, Dynamic Service Selection, & Anti-Double Booking

## 1. Objektif
Memperbaiki kebocoran menu pada antarmuka *Mobile* agar sesuai dengan kategori bisnis (*Multi-Tenant Isolation*), mengintegrasikan pilihan produk "Layanan" ke dalam form *booking*, dan mencegah pelanggan memilih jadwal yang sudah terisi (*Anti-Double Booking*).

## 2. Bugfix: Isolasi Menu Mobile (Bottom Nav & Menu Lainnya)
**Target File:** Komponen navigasi *mobile* (misal: `components/MobileNav.tsx`, `components/BottomNav.tsx`, atau komponen modal "Menu Lainnya" seperti pada tangkapan layar).
**Instruksi:**
1. Terapkan logika kondisional berdasarkan `tenant.kategoriUsaha` persis seperti yang sudah dilakukan di `SidebarClient.tsx` versi *desktop*.
2. **Kategori Jasa/Servis:** 
   - Sembunyikan menu "Produk" (Retail/F&B) dan ganti menjadi "Layanan".
   - Pastikan menu **"Jadwal Booking"** muncul di dalam daftar "Menu Lainnya" atau *Bottom Nav* agar *owner* bisa memantau jadwal lewat HP.
   - Sembunyikan menu yang tidak relevan (seperti Manajemen Meja jika ada).

## 3. Fitur: Integrasi Pilihan Layanan di Form Booking
**Target File 1:** `app/book/[slug]/page.tsx` (Server Component)
*   Modifikasi *query* database untuk juga mengambil daftar layanan aktif milik *owner* tersebut: `products: { where: { userId: tenant.userId, isService: true, isActive: true } }` (sesuaikan dengan skema produk lu).
*   Kirim data `products` ini sebagai *props* ke `BookingForm`.

**Target File 2:** `BookingForm.tsx` (Client Component)
*   Tambahkan *dropdown* atau *radio button* "Pilih Layanan" di atas input Tanggal.
*   *Form* wajib divalidasi: Pelanggan tidak bisa *submit* jika belum memilih layanan.

## 4. Fitur: Anti-Double Booking (Validasi Waktu)
**Target File 1:** Buat endpoint API baru `app/api/booking/check-slots/route.ts` (GET)
*   Menerima parameter `date` dan `slug`.
*   Cari `userId` dari `slug`.
*   Lakukan *query* ke tabel `Booking` untuk mengambil semua pesanan pada tanggal tersebut dengan status `PENDING` atau `COMPLETED` milik `userId` terkait.
*   Kembalikan *array* berisi jam-jam yang sudah terisi (misal: `["09:00", "10:30"]`).

**Target File 2:** Modifikasi `BookingForm.tsx`
*   Saat pelanggan memilih tanggal (Date Picker), lakukan *fetch* ke API `/api/booking/check-slots` di latar belakang.
*   Tampilkan status *loading* kecil saat sistem mengecek ketersediaan jam.
*   Saat merender daftar tombol jam (08:00 - 21:00), periksa apakah jam tersebut ada di dalam *array* jam yang sudah terisi.
*   Jika sudah terisi, ubah tombol jam tersebut menjadi `disabled`, beri warna abu-abu, dan (opsional) beri teks "Penuh".

## 5. Validasi Keamanan Lanjutan
Pada endpoint utama `POST /api/booking`, tambahkan pengecekan ganda (*backend validation*): Sebelum menyimpan data menggunakan Prisma, pastikan tidak ada `Booking` lain dengan `userId`, `bookingDate` (tanggal), dan jam yang persis sama dengan status `PENDING` atau `COMPLETED`. Jika ada, tolak pesanan dengan status 400 "Jadwal sudah tidak tersedia".

Silakan eksekusi perbaikan ini secara berurutan dan pastikan UI/UX di *mobile* tetap responsif dan bersih!
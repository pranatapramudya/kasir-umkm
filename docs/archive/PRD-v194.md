# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.94
**Fokus:** Bypass Routing & Otorisasi Khusus untuk Role SUPERADMIN

## 1. Deskripsi Bug
Akun `SUPERADMIN` (pemilik platform PJTECH) terjebak dan ikut ter-redirect ke halaman `/admin` (dashboard klien/pebisnis UMKM) setelah login atau saat mengklik logo tersembunyi. Sistem gagal mengarahkan SUPERADMIN ke rute khusus manajemen platform (misal: `/superadmin`).

## 2. Akar Masalah
Standarisasi pendaratan pasca-login sebelumnya memukul rata semua pengguna terautentikasi ke `/admin`. Tidak ada pengecualian (bypass) di dalam `middleware.ts` atau *layout* utama yang memeriksa apakah `role` pengguna adalah `SUPERADMIN`. Akibatnya, `SUPERADMIN` terkena aturan *redirect* klien standar dan gagal mengakses pintu belakangnya.

## 3. Instruksi Eksekusi Mutlak untuk Agent
Agen WAJIB memperbaiki alur *routing* ini dengan menambahkan pengecualian khusus untuk tingkat *top-level authorization*:

1. **Modifikasi Middleware (`middleware.ts`):**
   * Ambil *role* dari token pengguna (`auth().sessionClaims`).
   * Buat aturan *intercept*: Jika `role === 'SUPERADMIN'` dan pengguna sedang berada di *root* (`/`) atau mencoba masuk ke `/admin`, **arahkan (redirect) mereka langsung ke rute `/superadmin`** (atau rute rahasia yang sudah disiapkan).
   * Pastikan rute `/superadmin` TIDAK memantulkan pengguna kembali ke `/admin`.

2. **Validasi Komponen Trigger (Logo Tersembunyi):**
   * Cari komponen UI yang memuat logo PJTECH (biasanya di *Sidebar*, *Navbar*, atau halaman *Login*).
   * Pastikan komponen tersebut menggunakan tag `<Link href="/superadmin">` atau fungsi `router.push('/superadmin')`.
   * Jika logo ini dapat di-klik oleh klien biasa, pastikan hanya *route handler* di Next.js atau `middleware.ts` yang memblokir mereka, tapi meloloskan `SUPERADMIN`.

## 4. Output yang Diharapkan
Identifikasi file yang mengatur *redirect loop* tersebut (`middleware.ts` atau file *layout* root). Terapkan logika pengecualian *role* ini secara mandiri tanpa merusak alur untuk Owner UMKM dan Cashier. Berikan konfirmasi singkat nama file yang diubah.
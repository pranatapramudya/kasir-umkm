# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.09
**Fokus:** Sinkronisasi Penghapusan Akun (Clerk Webhooks - user.deleted)

## 1. Deskripsi Masalah
Terdapat celah desinkronisasi data antara Clerk (Sistem Autentikasi) dan Neon PostgreSQL (Database Utama). Jika pengguna menghapus akunnya melalui antarmuka profil Clerk, data Tenant/Toko pengguna tersebut masih berstatus `ACTIVE` atau `TRIAL` di *database* utama dan tetap muncul sebagai pengguna aktif di *dashboard* Superadmin.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Persiapan Library
Pastikan modul `svix` sudah terinstal di proyek (`npm install svix` atau `pnpm add svix`). Library ini mutlak diperlukan untuk memverifikasi keamanan *signature* Webhook dari Clerk agar *endpoint* tidak dibobol oleh pihak luar.

### B. Pembuatan Route Webhook Clerk
1. Buat *endpoint* baru khusus untuk mendengarkan notifikasi Clerk, misalnya di `app/api/webhooks/clerk/route.ts`.
2. Tulis fungsi `POST` yang menerima *request* dari Clerk.
3. **Verifikasi Keamanan:** Terapkan verifikasi *header* `svix-id`, `svix-timestamp`, dan `svix-signature` menggunakan *Secret Key* Webhook Clerk (simpan di `.env` dengan nama `CLERK_WEBHOOK_SECRET`).
4. **Logika Penghapusan (`user.deleted`):**
   * Tangkap tipe *event* (`evt.type`) dari *payload*.
   * Buat blok pengecekan: `if (evt.type === 'user.deleted')`.
   * Eksekusi kueri Prisma untuk memperbarui status Tenant terkait:
     `prisma.tenant.update({ where: { userId: evt.data.id }, data: { subscriptionStatus: 'DELETED_BY_USER' } })`.
   * *(Catatan: Kita menggunakan pendekatan Soft Delete/Flagging pada `subscriptionStatus` agar riwayat tenant tetap ada di Superadmin untuk audit, namun statusnya jelas bahwa akun telah dihapus secara permanen dari Clerk).*

### C. Penyesuaian UI Superadmin
1. Buka `app/superadmin/page.tsx` (atau komponen Master Data Tenant).
2. Tambahkan *styling* khusus (misalnya warna merah atau teks coret) pada baris tabel untuk *tenant* yang memiliki status `DELETED_BY_USER`.

## 3. Output yang Diharapkan
Terapkan *endpoint* Webhook yang aman dari `svix`. Berikan instruksi singkat kepada *developer* (Owner) tentang cara menambahkan URL *Endpoint* ini di *Dashboard* eksternal Clerk (menu Webhooks) setelah aplikasi berhasil di- *deploy* ke Vercel nanti.
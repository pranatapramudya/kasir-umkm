# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.72
**Fokus:** HOTFIX - Prisma Unique Constraint Failed (Idempotent Server Action)

## 1. Analisis Bug Database (P0 Blocker)
*   **Gejala:** Muncul *error* 500 dengan pesan `Unique constraint failed on the fields: ("userId")` pada UI form Onboarding saat pengguna mencoba menyimpan ulang data.
*   **Akar Masalah:** Tindakan pengguna sebelumnya telah berhasil menyimpan baris baru di tabel `Tenant`. Ketika terjadi kegagalan navigasi di sisi klien dan pengguna menekan tombol *submit* kembali, fungsi `prisma.tenant.create()` dijalankan ulang. Karena `userId` bersifat unik, operasi penyisipan ganda ini secara brutal ditolak oleh PostgreSQL.
*   **Tujuan:** Mengubah logika *Server Action* menjadi *Idempotent*. Sistem harus cerdas: Jika `userId` belum ada, buat baru. Jika sudah ada, cukup perbarui datanya agar tidak *crash*.

## 2. Instruksi Eksekusi Backend untuk AI Agent
Tugas Anda adalah merombak interaksi Prisma Client di dalam Server Action.

### A. Konversi Logika Create Menjadi Upsert
*   **Target File:** `app/onboarding/actions.ts`
*   **Instruksi Logika Prisma:**
    1.  Cari baris eksekusi `prisma.tenant.create({ ... })`.
    2.  GANTI fungsi `.create` tersebut dengan fungsi `.upsert`.
    3.  Fungsi `.upsert` memerlukan tiga argumen objek wajib: `where`, `update`, dan `create`.
    4.  **Logika `where`:** Tentukan kondisi pencarian berdasarkan `userId` (contoh: `where: { userId: userId }`).
    5.  **Logika `create`:** Masukkan struktur data yang sama persis dengan yang Anda gunakan sebelumnya di fungsi `.create` (memuat `userId`, `name`, dan `category`).
    6.  **Logika `update`:** Masukkan struktur data pembaharuan jika toko sudah ada (hanya perbarui `name` dan `category` dengan inputan terbaru dari *form*).

### B. Validasi Alur (Quality Assurance)
*   Dengan mengimplementasikan metode `upsert`, eksekusi tombol "Simpan & Mulai Jualan" menjadi kebal terhadap *error klik ganda* (double-submit) atau kegagalan navigasi.
*   Jika aksi sebelumnya terputus di tengah jalan, klik kedua kalinya hanya akan melakukan pembaruan (update) tanpa melanggar konstrain unik basis data, kemudian melanjutkan pembaruan metadata Clerk dan membalas status sukses ke sisi klien.
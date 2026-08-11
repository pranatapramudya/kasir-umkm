# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.04
**Fokus:** Resolusi TypeScript & Linter Error Pasca-Implementasi "Manual ACC"

## 1. Deskripsi Masalah
Setelah implementasi fitur Manual ACC dan Halaman Tunggu, VS Code mendeteksi adanya *TypeScript errors* atau masalah linting yang merambat pada struktur direktori berikut:
- `app/admin/...`
- `app/api/superadmin/...`
- `app/pending-approval/...`
- `app/superadmin/...`

Hal ini kemungkinan besar disebabkan oleh ketidakcocokan tipe data Prisma (*type mismatch*), kegagalan mengimpor modul, atau komponen yang kehilangan tipe deklarasinya setelah skema *database* diperbarui.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Audit & Resolusi Tipe Data Prisma
1. Pastikan perintah `npx prisma generate` telah dieksekusi secara otomatis di latar belakang untuk memperbarui `PrismaClient`.
2. Periksa file API di `app/api/superadmin/acc-tenant/route.ts` dan `app/api/subscription/pending/route.ts`. Pastikan nilai status (seperti `'PENDING'` atau `'ACTIVE'`) dikirim dalam format *String* yang valid sesuai dengan definisi di `schema.prisma`. 

### B. Audit Komponen UI (Type Checking)
1. Buka halaman `app/pending-approval/page.tsx`. Pastikan tidak ada *props* yang hilang, *hooks* sisi klien yang digunakan tanpa `'use client'`, atau impor modul yang salah alamat.
2. Buka `app/superadmin/page.tsx`. Periksa logika *rendering* tabel dan kolom ACC. Pastikan saat melakukan pemetaan (*mapping*) data *tenant*, properti `subscriptionStatus` tidak memicu pesan *error* "Property does not exist on type". Jika perlu, perbarui tipe antarmuka (Interface/Type) yang digunakan untuk *fetching* data.

### C. Audit Layout & Middleware Guard
1. Periksa `app/admin/layout.tsx`. Pastikan logika *Route Guard* saat memeriksa status `PENDING` menggunakan operator perbandingan yang aman (*optional chaining* seperti `if (user?.subscriptionStatus === 'PENDING')`). 
2. Tangani potensi nilai *null* atau *undefined* agar TypeScript tidak melemparkan pesan *error*.

## 3. Output yang Diharapkan
Tinjau kembali file-file yang baru saja Anda buat/modifikasi pada sesi sebelumnya. Selesaikan semua peringatan TypeScript (garis bawah merah). Berikan laporan singkat (maksimal 3 kalimat) mengenai letak kesalahan tipe data/impor yang menjadi pemicu *error* di *code editor*.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.54
**Fokus:** Perbaikan Relasi & Isolasi Tenant pada Modul Manajemen Meja (Sinkronisasi Owner-Karyawan)

## 1. Analisis Masalah
Terjadi kebocoran logika multitenant pada modul Manajemen Meja. Saat akun Karyawan menambahkan data Meja, data tersebut tidak muncul di dashboard Owner, dan sebaliknya. 
Penyebabnya: Endpoint API untuk CRUD Meja (Create, Read, Update, Delete) kemungkinan besar mengikat data Meja ke `userId` (ID pengguna yang sedang login) alih-alih mengikatnya ke `storeId` atau `tenantId` (ID Toko/Entitas Induk). 

## 2. Instruksi Eksekusi (Backend Logic Fix)
**Target File:** API Endpoint untuk Manajemen Meja (misal: `app/api/tables/route.ts`).

1. **Standarisasi Pengambilan Tenant ID (Global Rule):**
   - Di SETIAP operasi (GET, POST, PUT, DELETE) pada modul Meja, perbaiki logika identifikasi *user*.
   - **Gunakan logika ini:**
     - JIKA yang login adalah Karyawan, `targetStoreId` = ID Toko tempat ia bekerja (ambil dari *database* tabel Employee, atau gunakan `sessionClaims.metadata.tenantId` dari Clerk jika sudah sinkron).
     - JIKA yang login adalah Owner, `targetStoreId` = `userId` miliknya (atau ID Toko miliknya).

2. **Perbaikan Query Prisma (CRUD):**
   - **POST (Create):** Saat `prisma.table.create`, pastikan relasi `storeId` (atau field sejenis di schema Anda) diisi dengan `targetStoreId` yang didapat dari langkah 1. JANGAN gunakan `userId` mentah Karyawan.
   - **GET (Read):** Saat `prisma.table.findMany`, pastikan klausa `where` memfilter berdasarkan `storeId: targetStoreId`.
   - **PUT/DELETE:** Pastikan operasi update/hapus juga memvalidasi kepemilikan berdasarkan `targetStoreId`.

Silakan perbaiki logika *tenant isolation* pada API Manajemen Meja ini. Owner dan Karyawan dari toko yang sama WAJIB melihat dan memanipulasi *database* Meja yang persis sama. Lapor jika sudah selesai!
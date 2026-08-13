# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.29
**Fokus:** Bugfix Prisma Invalid Invocation pada Onboarding Layout

## 1. Objektif
Memperbaiki error `PrismaClientKnownRequestError` (`Invalid prisma.tenant.findUnique() invocation`) yang terjadi di `app/onboarding/layout.tsx` saat user (Owner) baru berhasil login dan diarahkan ke halaman onboarding.

## 2. Analisis Masalah
Error ini terjadi karena dua kemungkinan:
1. Variabel `userId` (dari session Clerk) bernilai `undefined` atau `null` pada saat Server Component merender, sehingga Prisma menolak parameter `where`.
2. Field `userId` pada model `Tenant` mungkin tidak menggunakan atribut `@unique` di `schema.prisma`. Method `findUnique` HANYA bisa mengeksekusi query pada field yang berstatus `@id` atau `@unique`.

## 3. Perbaikan Server Component
**Target File:** `app/onboarding/layout.tsx`
**Instruksi Eksekusi:**
1. Tambahkan pengecekan null/undefined (Null-Check) untuk `userId`. 
   - Gunakan `auth()` dari Clerk untuk mengambil `userId`.
   - JIKA `!userId`, jalankan `redirect('/sign-in')` (import dari `next/navigation`).
2. Ubah metode query dari `findUnique` menjadi `findFirst`. Ini adalah solusi paling aman dan *bulletproof* untuk menghindari error skema tanpa harus melakukan migrasi ulang database.
   - Ubah baris kode: 
     `const existingTenant = await prisma.tenant.findUnique({ where: { userId } });`
   - Menjadi: 
     `const existingTenant = await prisma.tenant.findFirst({ where: { userId } });`
3. Periksa juga file `app/onboarding/page.tsx`. Jika ada eksekusi query yang mirip di sana, lakukan penyesuaian yang sama (`findFirst` dan *null-check*).

Terapkan perubahan ini sekarang agar alur pendaftaran toko baru bisa berjalan normal kembali.
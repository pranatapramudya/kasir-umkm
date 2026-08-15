# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.52
**Fokus:** Perbaikan Relasi Tenant/Store ID pada Endpoint Transaksi (Khusus Role Karyawan)

## 1. Analisis Masalah
Saat melakukan checkout menggunakan akun Karyawan, muncul error pangkalan data (500 / Prisma Constraint Failed). Hal ini kemungkinan besar disebabkan oleh endpoint API yang berasumsi bahwa `auth().userId` selalu sama dengan `tenantId` atau `storeId`. Saat karyawan melakukan transaksi, API gagal menemukan toko dengan ID karyawan tersebut, sehingga operasi insert transaksi dan pemotongan stok ditolak oleh database.

## 2. Instruksi Eksekusi (Backend API Logic)
**Target File:** API Endpoint untuk Checkout/Transaksi (misal: `app/api/transactions/route.ts` atau `app/api/checkout/route.ts`).

1. **Resolusi Identitas Tenant (Tenant Identification):**
   - Perbaiki logika pengambilan identitas pembuat transaksi. 
   - JIKA user yang *login* adalah Karyawan (bisa dicek melalui Clerk metadata atau tabel Employee di database), ambil `tenantId` / `storeId` dari entitas induk tempat karyawan tersebut bekerja.
   - JIKA user adalah Owner, gunakan `userId` miliknya sebagai `tenantId` (atau sesuaikan dengan arsitektur saat ini).
   - Pastikan transaksi dan pemotongan stok di- *query* menggunakan `tenantId` yang sudah dikoreksi tersebut.

2. **Validasi Payload Tambahan (F&B / Notes):**
   - Pastikan variabel `tableNumber`, `customerName`, dan `note` (dari inputan kasir) dipetakan dengan benar sesuai kolom yang ada di Prisma Schema. Jangan mengirim *key* yang tidak terdaftar di schema ke `prisma.transaction.create`.

3. **Injeksi Log Debugging (Server-Side):**
   - Di dalam blok `catch (error)` pada endpoint transaksi, pastikan Anda menambahkan `console.error("[TRANSACTION_ERROR]: ", error)` sebelum error dilempar ke *client*. Ini agar error Prisma asli tetap bisa dibaca oleh tim *developer* di log terminal/Vercel, meskipun di sisi *client* sudah ditutup oleh Error Mapper.

Silakan perbaiki logika resolusi Tenant/Store ID ini agar karyawan dapat memproses pembayaran (Tunai/QRIS) tanpa memicu penolakan *database*. Lapor jika sudah selesai!
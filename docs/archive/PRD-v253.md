# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.53
**Fokus:** Investigasi Ekstrem & Perbaikan Foreign Key Constraint pada Checkout

## 1. Analisis Masalah Lanjutan
Error pangkalan data (500) masih berlanjut saat Karyawan melakukan checkout. Karena identitas Tenant/Store sudah diatasi via Metadata pada iterasi sebelumnya, kemungkinan besar akar masalah ada pada kegagalan Constraint Prisma di tabel relasi lainnya, spesifiknya pada relasi `Table` (Meja) atau relasi `Employee` (Kasir). Metadata JWT dari Clerk juga terkadang mengalami *delay* (stale data) pada sesi baru.

## 2. Instruksi Eksekusi (Backend Debugging & Logic Fix)
**Target File:** `app/api/transactions/route.ts` (atau file handler checkout sejenis).

**A. Analisis Log Secara Mandiri:**
1. Sebelum mengubah kode, periksa log terminal/konsol Vercel tempat `[TRANSACTION_ERROR]` dicetak. Cari tahu *Foreign Key* mana yang ditolak oleh Prisma (Apakah `tableId`, `employeeId`, atau `storeId`?).

**B. Perbaikan Relasi & Payload (Tindakan Wajib):**
1. **Fallback Database untuk Tenant ID:** 
   Jangan HANYA mengandalkan `sessionClaims.metadata.tenantId` dari Clerk karena bisa saja JWT *token* belum tersinkronisasi saat Karyawan baru dibuat. 
   **Wajib:** Lakukan *query* langsung ke database `prisma.employee.findUnique` menggunakan `auth().userId` untuk mendapatkan `storeId` atau `tenantId` yang paling akurat dari database sebelum memproses transaksi.
2. **Validasi Relasi Kasir (Cashier ID):**
   Pastikan ID yang dimasukkan ke dalam field `cashierId` atau `employeeId` pada saat pembuatan transaksi (`prisma.transaction.create`) benar-benar ID yang valid dan ada di tabel Employee, BUKAN sekadar melemparkan ID Clerk mentah jika skema Anda menggunakan relasi ID internal.
3. **Validasi Relasi Meja (Table ID) - Fokus F&B:**
   Cek *payload* dari Frontend. Jika Frontend mengirimkan string nama meja (misal: "Meja 1"), namun Prisma Schema Anda mengharapkan koneksi relasi ke tabel Meja menggunakan UUID/CUID, ubah *payload* di Frontend agar mengirimkan ID Meja (value dari dropdown/pilihan), BUKAN *label* teksnya.

Silakan bedah 3 titik kritis relasi ini (Store, Employee, dan Table). Pastikan seluruh parameter yang disisipkan ke dalam operasi Prisma valid secara referensial. Lapor kembali jika bug constraint ini sudah ditumpas tuntas!
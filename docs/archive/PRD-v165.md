# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.65
**Fokus:** Ultimate Architecture Overhaul (Security, Concurrency, Relational Integrity)

## 1. Analisis Objektif
Berdasarkan Laporan Audit Sistem (Vektor A, B, C, dan D), ditemukan kelemahan fundamental pada integritas relasional, keamanan kasir, dan penanganan konkurensi. Eksekusi ini akan merombak skema `prisma/schema.prisma` dan menyuntikkan logika transaksional (*Atomic*) pada API untuk menambal seluruh celah kebocoran finansial dan data.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan dalam 3 Fase berurutan. DILARANG memberikan *output* kode mentah. Lakukan secara mandiri dan laporkan jika sudah berhasil di-*push* ke database.

### FASE 1: Perombakan Skema Database (Prisma)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi:**
    1.  **Vektor C (Audit Trail):** Buat model baru `AuditLog` dengan field: `id`, `tenantId`, `userId` (pelaku), `action` (String, misal: 'REFUND', 'DISCOUNT_OVERRIDE'), `details` (Json), dan `createdAt`.
    2.  **Vektor C (Cashier Tracking):** Pada model `Transaction`, tambahkan relasi opsional `cashierId String?` yang merujuk ke model `User`/`Employee`.
    3.  **Vektor B (F&B Relational State):** Pada model `Transaction`, ubah `tableNumber` menjadi relasi FK opsional `tableId String?` yang merujuk ke model `DiningTable(id)`.
    4.  **Vektor D (Jasa Worker Relational):** Pada model `TransactionItem`, ganti `workerName` menjadi relasi FK opsional `workerId String?` yang merujuk ke model `User`/`Employee`. Tambahkan field `serviceDuration Int? @default(0)` (dalam menit).
    5.  Jalankan `npx prisma db push` secara senyap untuk mensinkronkan perubahan ini ke PostgreSQL.

### FASE 2: Injeksi Keamanan & Concurrency pada API
*   **Target File:** `app/api/transactions/route.ts` (Atau fungsi mutasi Checkout)
*   **Instruksi:**
    1.  **Vektor A (Atomic Decrement & Rollback):** Bungkus seluruh logika pembuatan `Transaction` dan `TransactionItem` menggunakan `prisma.$transaction`. 
    2.  Ubah logika pengurangan stok dari manipulasi statis menjadi mutasi atomik: `update: { stock: { decrement: qty } }`.
    3.  Tambahkan validasi *post-decrement*: Jika setelah transaksi ada item dengan `stock < 0`, segera lemparkan *Error* dan biarkan `$transaction` melakukan *Rollback* otomatis.
    4.  **Vektor C (Discount RBAC):** Tambahkan validasi: Jika *payload* memuat `discount` > 10% dari total harga, DAN *user* yang melakukan *request* memiliki peran `CASHIER`, tolak transaksi tersebut dengan status 403 Forbidden.
    5.  **Vektor C (Audit Logging):** Jika ada transaksi yang dibatalkan/di-refund, atau ada diskon besar yang disetujui (oleh Admin), sisipkan `prisma.auditLog.create` ke dalam blok transaksi.

### FASE 3: Penyesuaian Frontend UI / State
*   **Target File:** `app/page-client.tsx` (Komponen Kasir) & Keranjang.
*   **Instruksi:**
    1.  Ubah *state* pekerja di Keranjang Jasa agar menyimpan `workerId` (bukan sekadar `workerName` teks bebas) dari *dropdown* pilihan pekerja.
    2.  Pastikan payload JSON yang dikirim saat *Checkout* menyertakan `cashierId` (diambil dari sesi Clerk kasir yang sedang *login*).

Silakan jalankan perombakan masif ini dari *Database* hingga *Frontend* secara hati-hati dan komprehensif!
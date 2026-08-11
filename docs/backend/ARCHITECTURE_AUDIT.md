# Arsitektur & Keamanan Backend (Serverless)

Dokumen ini berisi standar rekayasa backend (API) untuk platform SaaS PJTECH KASIR. Fokus utama arsitektur ini adalah menangani konkurensi ekstrem dan mengunci keamanan isolasi data antar penyewa (*Multi-Tenant Isolation*) di lingkungan *Serverless* (Next.js/Vercel) + Prisma.

## 1. Isolasi Multi-Tenant Mutlak (Pencegahan Data Bleed)
Dalam lingkungan SaaS multitenant, keamanan tingkat API (*Data Bleed*) adalah prioritas tertinggi. 

**Masalah Umum (TOCTOU):**
Memverifikasi kepemilikan data di memori aplikasi (contoh: `if (item.userId !== userId) throw Error`) sebelum melakukan operasi `update` atau `delete` sangat rentan terhadap serangan *Time-Of-Check to Time-Of-Use* (TOCTOU) serta potensi *human error*.

**Solusi Arsitektur PJTECH:**
Kami mendelegasikan isolasi langsung ke mesin SQL secara atomik menggunakan fungsi `updateMany` dan `deleteMany` milik Prisma. 
Seluruh kueri mutasi diwajibkan menyuntikkan ID target (`id`) dan ID penyewa (`userId`) secara bersamaan di blok `where`.

```typescript
// CONTOH STANDAR (Produk, Meja, dll)
const result = await prisma.product.deleteMany({
  where: { id: productId, userId: currentUserId }
});

if (result.count === 0) {
  return NextResponse.json({ error: "Akses Ditolak" }, { status: 404 });
}
```

## 2. Resolusi Concurrency & Prisma N+1 Query Problem
Platform kasir memiliki karakteristik penulisan data yang sangat tinggi (ratusan *checkout* serentak). 

**Masalah N+1:**
Melakukan `findUnique` dan `update` di dalam sebuah *looping* untuk memotong stok setiap *item* dalam keranjang belanja akan membunuh *connection pool* (misal: 20 item = 40 kueri sekuensial).

**Solusi Arsitektur PJTECH:**
Proses *checkout* dimodifikasi agar bebas hambatan (*bottleneck-free*):
1. **Pre-fetching:** Menarik semua entitas produk yang relevan dalam 1 kueri agregat (`findMany { where: { id: { in: itemIds } } }`) di luar transaksi.
2. **Concurrent Mutation:** Eksekusi pemotongan stok dilakukan secara serentak tanpa *looping await*. Kami memetakan seluruh mutasi ke dalam array *Promise* dan mengeksekusinya menggunakan `Promise.all` di dalam blok `prisma.$transaction`.

## 3. Optimasi Limit Payload Vercel Serverless
Lingkungan Vercel memiliki batasan komputasi ketat (RAM 50MB - 1GB, timeout 10s).

**Masalah Payload Raksasa:**
Menarik *raw data* berukuran besar (`findMany` dengan ratusan ribu transaksi) ke dalam memori Node.js hanya untuk dijumlahkan secara manual (`.reduce()`) akan memicu kegagalan *Out-of-Memory* (OOM).

**Solusi Arsitektur PJTECH:**
Kami menerapkan pola **Database-Level Aggregation**. API Analitik menggunakan Prisma Aggregate seperti `groupBy` dan `_sum` untuk meminta PostgreSQL melakukan kalkulasi berat. Vercel Node.js hanya bertugas menerima 1 baris hasil kalkulasi akhir.
Untuk data tren penjualan, transaksi ditarik menggunakan filter `select` yang sangat ringan (hanya mengambil properti `total` dan `createdAt`), menghilangkan ketergantungan pada relasi `items` yang berat.

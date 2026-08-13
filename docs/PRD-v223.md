# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.23
**Fokus:** Bugfix Foreign Key Constraint (Transaction_cashierId_fkey) pada Checkout POS Retail

## 1. Objektif
Menyelesaikan *bug* fatal pada saat melakukan proses *checkout* (pembayaran) di halaman POS yang menghasilkan pesan *error* Prisma: `Foreign key constraint violated on the constraint: 'Transaction_cashierId_fkey'`. Perbaikan ini harus memastikan bahwa ID pembuat transaksi terekam dengan benar tanpa melanggar relasi *database*.

## 2. Analisis & Perbaikan Backend (API Transaksi)
**Target File:** `app/api/transactions/route.ts` (atau rute endpoint yang memproses pembuatan transaksi).
**Instruksi:**
1. Periksa bagaimana payload `cashierId` diekstrak dari *request body*.
2. Pastikan `cashierId` yang digunakan benar-benar ada di dalam tabel referensinya (misalnya tabel `User` atau `Staff`). 
3. Seringkali, *owner* (pemilik tenant) bertindak sebagai kasir. Jika relasi `cashierId` mengarah ke tabel `Staff`, pastikan *owner* juga memiliki entri di tabel `Staff`, ATAU ubah relasi `cashierId` agar mengarah ke tabel `User` utama (Clerk Auth ID).
4. Tambahkan *error handling* (`try/catch`) yang lebih mendetail sebelum mengeksekusi `prisma.transaction.create()` untuk memvalidasi keberadaan `cashierId` di *database*.

## 3. Penyesuaian Skema Prisma (Jika Diperlukan)
**Target File:** `prisma/schema.prisma`
**Instruksi:**
1. Cek relasi `cashierId` pada model `Transaction`.
2. Jika sistem mengizinkan transaksi dibuat oleh sistem secara otomatis atau jika logika `cashierId` masih sering bermasalah karena asinkronisasi data Clerk, pertimbangkan untuk mengubah tipe datanya menjadi *opsional* sementara waktu: `cashierId String?`.
3. Jika ada perubahan pada skema, wajib jalankan `npx prisma generate` dan `npx prisma db push`.

## 4. Perbaikan Payload Frontend
**Target File:** Komponen kasir POS (misal: `app/page-client.tsx` atau file serupa tempat `handleCheckout` berada).
**Instruksi:**
1. Pastikan variabel `userId` dari Clerk (menggunakan `useAuth` atau `useUser`) telah terambil dengan sempurna sebelum fungsi *checkout* dipanggil.
2. Pastikan payload yang dikirim ke `POST /api/transactions` memuat properti `cashierId` yang valid (tidak *undefined* atau *null* jika skema mengharuskan wajib isi).

Silakan eksekusi perbaikan di atas, lakukan pengujian simulasi transaksi, dan pastikan proses *checkout* berhasil mengeluarkan kembalian tanpa *error* merah dari Prisma.
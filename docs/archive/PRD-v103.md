# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.03 (Planning Mode)
**Fokus:** Sinkronisasi Stok Kasir (Bypass Cache) & Paginasi Produk Berskala (Server-Side)

## 1. Tujuan Akhir (Goal)
*   **Sinkronisasi Real-time:** Memastikan sisa stok yang tampil di halaman Kasir POS selalu akurat dan sinkron dengan pembaruan terakhir di halaman Manajemen Produk atau setelah transaksi terjadi.
*   **Skalabilitas Inventaris (Paginasi):** Mengimplementasikan sistem paginasi (batasan 10 produk per halaman) dengan navigasi angka numerik (1, 2, 3, dst., Next/Prev) pada halaman Manajemen Produk dan halaman Kasir POS untuk menangani ribuan data barang retail tanpa membebani performa memori.

## 2. Batasan Arsitektur (Constraints)
*   **Bypass Cache Next.js:** Untuk halaman Kasir (`app/page.tsx` atau `page-client.tsx`), pastikan pengambilan data produk tidak di-*cache* secara statis. Gunakan direktif `export const dynamic = 'force-dynamic'` atau `revalidate: 0` pada fungsi `fetch`/Prisma agar stok selalu mutakhir.
*   **Server-Side Pagination (Best Practice):** DILARANG menarik seluruh data produk dari Prisma lalu memotongnya di sisi Klien (Client-side slicing). Paginasi harus terjadi di tingkat *database* menggunakan parameter `skip` dan `take` di Prisma berdasarkan parameter URL (misal: `?page=2`).
*   **Konsistensi UI Paginasi:** Komponen kontrol paginasi harus diletakkan di bagian bawah *grid* produk. Desainnya harus bersih (menggunakan angka halaman dan tombol arah) yang selaras dengan tema Tailwind SaaS ini.
*   **State Keranjang (POS):** Saat kasir berpindah halaman di Kasir POS (dari Page 1 ke Page 2), *state* Keranjang (Cart) yang sudah berisi barang DILARANG hilang atau ter-*reset*.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda merombak kode, berikan rancangan Anda dengan menjawab poin-poin berikut:
1.  **Strategi Sinkronisasi:** Jelaskan bagaimana Anda akan memastikan data produk di halaman Kasir POS selalu segar (tidak terpengaruh *stale cache* Next.js).
2.  **Arsitektur Paginasi Prisma:** Tuliskan draf kueri Prisma Anda yang memanfaatkan argumen `skip` dan `take`, serta bagaimana Anda menghitung `totalPages` (total halaman).
3.  **Manajemen Parameter URL:** Jelaskan bagaimana Anda akan membaca dan memperbarui parameter `?page=` menggunakan fitur Next.js App Router (`useSearchParams`, `useRouter`, atau *Server Component Props*).
4.  **Desain Komponen:** Usulkan pembuatan komponen `<Pagination />` yang dapat digunakan ulang (reusable) baik di Admin maupun di POS.

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengeksekusi penulisan kode!**
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.24
**Fokus:** Bugfix Data Produk Menghilang (Flickering) pada Akun Karyawan/Kasir

## 1. Objektif
Menyelesaikan *bug* di halaman Kasir POS (Client) di mana daftar produk/layanan sempat muncul sesaat lalu menghilang (menjadi kosong) ketika diakses menggunakan akun dengan *role* Karyawan (Employee). 

## 2. Analisis Masalah
Terjadi *mismatch* identitas pada saat *client-side data fetching* (kemungkinan menggunakan SWR, React Query, atau useEffect fetch). 
- Endpoint API produk (misal: `GET /api/products`) kemungkinan besar melakukan filter strict menggunakan `userId` dari sesi Clerk yang sedang aktif. 
- Jika yang login adalah Owner, produk muncul karena `userId` cocok dengan pembuat produk. 
- Jika yang login adalah Karyawan, API merespons dengan array kosong `[]` karena Karyawan bukan entitas pembuat produk. Hal ini menimpa state awal sehingga UI terlihat "berkedip" lalu hilang.

## 3. Perbaikan Backend (API Route)
**Target File:** `app/api/products/route.ts` (atau endpoint API terkait yang melayani GET produk).
**Instruksi:**
1. Modifikasi logika pengambilan sesi (auth) pada *method* GET.
2. Cek identitas *user* yang sedang login. Query ke database: Apakah `userId` ini terdaftar di tabel `Employee`?
3. Logika Filter Produk:
   - JIKA user adalah Karyawan: Ambil `tenantId` atau `ownerId` tempat Karyawan tersebut bekerja. Tarik data produk berdasarkan `ownerId` tersebut.
   - JIKA user adalah Owner: Tarik data produk berdasarkan `userId` miliknya sendiri (seperti logika semula).
4. Pastikan response mengembalikan data produk yang sah milik toko (Tenant), bukan array kosong.

## 4. Perbaikan Frontend (Client Component)
**Target File:** `app/page-client.tsx` (atau komponen yang me-render daftar produk di Kasir).
**Instruksi:**
1. Periksa implementasi pengambilan data (SWR/fetch).
2. Pastikan komponen tidak me-reset state produk menjadi kosong `[]` secara tidak sengaja sebelum data dari API selesai dimuat (perhatikan variabel `isLoading` atau pola state data).
3. Jika URL SWR bergantung pada parameter `userId`, pastikan parameter tersebut merepresentasikan `tenantId` yang benar.

Silakan analisis dan terapkan perbaikan ini. Pastikan produk tidak lagi menghilang saat kasir (karyawan) mengakses halaman POS untuk semua kategori bisnis (F&B, Retail, Jasa, Rental).
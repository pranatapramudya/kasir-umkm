# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.24
**Fokus:** Bugfix Data Dasbor Analitik Kosong (Sinkronisasi API & Frontend)

## 1. Analisis Masalah
*   **Gejala:** Transaksi berhasil dieksekusi (terbukti dari stok produk yang berkurang secara akurat di *database*), namun metrik pada halaman Dasbor (`/admin`) seperti Total Pendapatan, Laba Bersih, dan Total Transaksi masih merender angka statis `0`.
*   **Titik Kegagalan (Point of Failure):** Masalah terletak pada alur komunikasi data (API Fetching) antara rute Dasbor dan endpoint `/api/analytics`, bukan pada proses transaksi kasir itu sendiri.
*   **Potensi Akar Masalah:**
    1.  **Format Respons JSON Meleset:** Terdapat ketidakcocokan antara struktur *key* JSON yang dikirimkan oleh `/api/analytics/route.ts` dengan variabel yang dipanggil oleh hook `useSWR` di `app/admin/page.tsx` (contoh: *backend* mengirim `{ data: { totalRevenue } }`, namun *frontend* mencoba mengakses `data.totalRevenue` secara langsung).
    2.  **Kesalahan Parameter Filter Waktu:** Parameter filter dari *dropdown* kalender ("Bulan Ini") mungkin tidak terkirim dengan benar ke *backend*, atau query Prisma pada *backend* gagal memetakan rentang tanggal karena masalah sinkronisasi *timezone* lokal.
    3.  **Kesalahan Logika Agregasi:** Kueri agregasi di Prisma mengembalikan nilai *null* atau *undefined* yang kemudian dibaca sebagai `0` di *frontend*.

## 2. Instruksi Pemeriksaan & Perbaikan untuk AI Agent
Sebagai agen mandiri, jalankan audit dan sinkronisasi pada file terkait dengan langkah-langkah eksplisit berikut:

### A. Audit Endpoint API Analitik (`app/api/analytics/route.ts`)
*   Periksa fungsi GET. Lakukan pencetakan *console.log* di sisi *server* untuk melihat hasil agregasi mentah dari Prisma.
*   Pastikan logika filter tanggal (*date range*) dikalkulasi dengan benar (awal bulan hingga akhir bulan) dan dikonversi ke format `Date` yang dapat dibaca oleh Prisma.
*   Pastikan API mengembalikan struktur JSON yang pipih/langsung (*flat structure*) agar mudah dikonsumsi, contoh: `return NextResponse.json({ totalRevenue: 100000, netProfit: 20000, totalTransactions: 5 })`.

### B. Audit Frontend Fetching & SWR (`app/admin/page.tsx`)
*   Periksa implementasi `useSWR` dan *fetcher function*.
*   Pastikan *URL endpoint* yang dipanggil oleh `useSWR` sudah menyertakan paramater URL (*query strings*) jika filter kalender berubah (misal: `/api/analytics?filter=this_month`).
*   Cocokkan penamaan properti (*object keys*) dari data yang diambil (`data`) dengan yang dirender pada komponen UI (*Card* Dasbor). Jika API mengembalikan `totalRevenue`, pastikan UI tidak memanggil `data.totalPendapatan`.
*   Terapkan *fallback* yang aman, contoh: `data?.totalRevenue || 0`, dan pastikan komponen menampilkan status *loading* jika `isLoading` bernilai *true* dari *hook* SWR.
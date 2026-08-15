# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.59
**Fokus:** Pembersihan Stale Cache (Mengatasi "Ghost Data" pada CRUD Operations)

## 1. Analisis Masalah
Ditemukan *bug caching* pada aplikasi. Saat pengguna menghapus sebuah produk (misal: "Nasi Goreng"), data memang terhapus dari database. Namun, ketika halaman di- *refresh/reload*, produk tersebut muncul kembali selama beberapa detik sebelum akhirnya menghilang. 
Penyebab: Next.js Cache (Full Route Cache / Router Cache) belum diinvalidasi secara paksa setelah mutasi data (DELETE, POST, PUT) berhasil dilakukan, sehingga Next.js menyajikan HTML/Payload basi (*stale cache*) saat halaman di-*refresh*.

## 2. Instruksi Eksekusi (Next.js Cache Invalidation)
**Target File:** Semua file API Routes (khususnya DELETE/POST/PUT) atau Server Actions yang menangani mutasi data, serta logika Client-side (SWR/React Query/Router) yang menangani respons mutasi tersebut.

**Tugas Anda (TANPA PERLU MENAMPILKAN KODE KEPADA SAYA, LANGSUNG KERJAKAN SAJA):**
1. **Invalidasi Server-Side (Wajib):**
   - Di setiap rute API atau Server Action yang mengubah pangkalan data (Hapus Produk, Tambah Produk, Edit Produk, Manajemen Meja, dll), pastikan Anda memanggil fungsi invalidasi cache bawaan Next.js secara *real-time*.
   - Gunakan `revalidatePath('/path-terkait')` atau `revalidateTag('nama-tag')` TEPAT SETELAH operasi Prisma berhasil, dan SEBELUM API mengembalikan *response*.

2. **Invalidasi Client-Side (Jika Relevan):**
   - Jika *frontend* menggunakan `useRouter` dari `next/navigation`, pastikan setelah operasi DELETE sukses, jalankan `router.refresh()` secara benar agar *client* meminta *payload* RSC terbaru ke *server* tanpa sisa *cache* lama.
   - Jika menggunakan data *fetcher* seperti SWR atau React Query, pastikan memanggil `mutate` atau `invalidateQueries` secara sinkron.

3. **Penerapan Global:**
   - Jangan hanya perbaiki di fitur Hapus Produk. Terapkan standar invalidasi *cache* ini ke **seluruh operasi mutasi** di aplikasi (Manajemen Meja, Karyawan, Pengeluaran, dll) untuk semua jenis bisnis, agar fenomena "Ghost Data" ini hilang selamanya.

Silakan bedah sistem *caching* aplikasi ini secara menyeluruh dan *push* perbaikannya. Lapor jika sudah dipastikan UI langsung ter- *update* instan saat di-*refresh* tanpa ada data "hantu" yang lewat!
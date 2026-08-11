# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.11
**Fokus:** Revert Top Loader & Implementasi Native Skeleton UI (Next.js Suspense)

## 1. Deskripsi Masalah
Penggunaan `nextjs-toploader` memunculkan *progress bar* di setiap navigasi, yang secara UX memberikan kesan psikologis bahwa aplikasi "lambat" pada setiap klik. Klien menginginkan indikator *loading* hanya terlihat ketika koneksi benar-benar lambat, bukan sebagai animasi wajib pada setiap perpindahan *route*.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Cabut Library Top Loader
1. Buka `app/layout.tsx`.
2. Hapus komponen `<NextTopLoader />` beserta seluruh *import*-nya.
3. Hapus *library* dari *package.json* (opsional, `npm uninstall nextjs-toploader`).

### B. Implementasi Next.js Native `loading.tsx` (Skeleton)
Untuk mengatasi jeda render pada *Server Components* tanpa memunculkan *loading spinner* yang mengganggu, gunakan fitur bawaan Next.js App Router (`loading.tsx`).
1. Buat file `loading.tsx` di dalam folder utama pengguna (misal: `app/admin/loading.tsx` atau `app/(dashboard)/loading.tsx`).
2. Desain *Skeleton UI* menggunakan *Tailwind CSS*. 
   * Jangan gunakan *spinner* bulat!
   * Gunakan elemen blok abu-abu berkedip halus (`animate-pulse bg-gray-200 rounded`) yang meniru tata letak tabel atau kartu metrik halaman.
3. *Cara Kerja Bawaan Next.js:* Jika perpindahan halaman berlangsung sangat cepat (karena *cache* atau koneksi cepat), *file* `loading.tsx` ini hampir tidak akan terlihat oleh mata. Namun, jika *server* mengalami *cold start* atau koneksi klien lambat, *Skeleton* ini akan muncul dan memberikan impresi bahwa kerangka halaman sudah siap seketika.

### C. Pertahankan Active Touch State (UX Mobile)
Pastikan kelas Tailwind untuk responsivitas sentuhan jari (`active:scale-95`, `active:bg-gray-50`, dan `touch-manipulation`) yang dibuat pada PRD-v210 **TETAP DIPERTAHANKAN** di komponen navigasi *sidebar* dan *bottom bar*. Hanya hapus indikator *loading* atasnya saja.

## 3. Output yang Diharapkan
Cabut *loading bar* bagian atas. Terapkan `loading.tsx` dengan kerangka *Skeleton UI*. Konfirmasikan kepada *developer* bahwa dengan pendekatan ini, klik pada navigasi tidak akan selalu memicu animasi *loading* yang mengganggu, melainkan hanya akan menampilkan *Skeleton* ketika pengambilan data di *server* memakan waktu ekstra.
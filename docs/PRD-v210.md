# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.10
**Fokus:** Optimasi UX Navigasi Super Responsif (Zero-Delay Feel) di Mobile/Desktop

## 1. Deskripsi Masalah
Pengguna (terutama di perangkat Mobile/Tablet) merasakan adanya jeda (*delay*) atau layar terasa "beku" sepersekian detik saat berpindah halaman antar menu (misal: dari Dashboard ke Karyawan). Hal ini disebabkan oleh *fetching Server Components* Next.js App Router yang tidak memberikan *visual feedback* instan kepada pengguna saat tautan diklik.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Implementasi Visual Feedback Instan (Top Loader)
1. Instal *library* pihak ketiga untuk *progress bar* navigasi, sangat direkomendasikan menggunakan `nextjs-toploader` (sangat ringan dan kompatibel dengan App Router).
   *Perintah: `npm install nextjs-toploader` atau `pnpm add nextjs-toploader`*
2. Buka file `app/layout.tsx`.
3. Impor dan letakkan komponen `<NextTopLoader />` tepat di bawah tag `<body>`.
4. Kustomisasi warnanya agar sesuai dengan tema *brand* (misal: warna biru utama aplikasi), atur ketebalan menjadi `3px` atau `4px`, dan pastikan `showSpinner={false}` agar terlihat seperti aplikasi *native* modern (mirip navigasi GitHub/YouTube).

### B. Optimasi Sentuhan Mobile (Active States & Touch Action)
1. Buka komponen navigasi utama (Sidebar untuk Desktop, Bottom Navigation & Bottom Sheet Drawer untuk Mobile).
2. Tambahkan kelas utilitas Tailwind untuk *feedback* sentuhan instan pada setiap elemen `<Link>` atau tombol menu:
   * Tambahkan `active:scale-95` atau `active:bg-blue-50` agar elemen bereaksi (mengecil/berubah warna) dalam hitungan milidetik saat disentuh oleh jempol pengguna.
   * Tambahkan `touch-action: manipulation;` (atau *class* `touch-manipulation`) untuk menonaktifkan *delay* klik 300ms bawaan *browser* ponsel lama.

### C. Optimasi Perilaku Drawer / Bottom Sheet
1. Buka komponen yang me-render *Drawer* "Menu Lainnya" (yang muncul dari bawah).
2. Jika pengguna mengklik salah satu rute dari dalam *Drawer* (misalnya menu "Laporan"), **tutup Drawer tersebut secara instan menggunakan `setState(false)` tepat sebelum navigasi rute dieksekusi.** 
3. Jangan biarkan *Drawer* tetap terbuka menunggu halaman baru selesai di- *load*. Menutup *Drawer* secara instan akan memberikan ilusi bahwa aplikasi merespons sentuhan pengguna tanpa jeda.

### D. Pemanfaatan Next.js Prefetching
1. Pastikan semua menu navigasi statis menggunakan komponen bawaan `<Link href="...">` dari `next/link`.
2. Pastikan komponen `<Link>` tidak dinonaktifkan fitur *prefetch*-nya (biarkan nilai *default* `prefetch={true}` untuk tautan yang terlihat di layar/ *viewport*).

## 3. Output yang Diharapkan
Terapkan *Top Loader* dan perbaikan kelas UX pada komponen navigasi. Berikan konfirmasi bahwa saat *developer* menyentuh tombol menu di antarmuka perangkat seluler, tombol merespons seketika secara visual dan *progress bar* di bagian atas layar langsung berjalan meskipun halaman tujuan sedang dimuat di latar belakang.
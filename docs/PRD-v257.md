# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.57
**Fokus:** Optimasi Navigasi SPA (Menghapus Kedip/Flickering Antar Halaman Global)

## 1. Analisis Masalah
Saat pengguna (Owner maupun Karyawan) berpindah menu melalui Sidebar atau Navbar, terjadi efek "kedip" (flickering/delay) yang sangat mengganggu *User Experience* (UX). Aplikasi terasa berat dan melakukan pemuatan ulang (*hard reload*) seperti website konvensional, padahal seharusnya transisi berjalan instan (*Client-Side Navigation*).

## 2. Instruksi Eksekusi (Frontend & Next.js Navigation)
**Target File:** Komponen Sidebar/Navbar global (misal: `components/Sidebar.tsx` atau Layout utama) dan sistem *Routing* (termasuk evaluasi `loading.tsx`).

**A. Refactoring Komponen Navigasi:**
1. **Wajib Gunakan `<Link>` Next.js:** Cari semua tag `<a>` HTML biasa (`<a href="...">`) atau fungsi `window.location.href` yang digunakan untuk navigasi antar menu di dalam aplikasi.
2. Ganti SEMUA tag tersebut menggunakan komponen `<Link href="...">` dari `next/link`. Hal ini akan mengaktifkan *Client-side routing* dan *Prefetching* otomatis dari Next.js (halaman tujuan sudah diunduh di *background* sebelum user sempat mengkliknya).

**B. Evaluasi Suspense / `loading.tsx`:**
1. Periksa apakah Anda memiliki file `app/loading.tsx` atau `app/(dashboard)/loading.tsx` yang menampilkan *spinner* atau layar kosong.
2. Saat menggunakan App Router, transisi halaman sering kali memicu layar *loading* ini dan menyebabkan efek kedip putih. 
3. **Solusi:** Hapus `loading.tsx` yang memblokir layar secara global JIKA halaman tersebut sudah memuat data dengan cepat, ATAU ganti dengan *Skeleton UI* statis yang struktur visualnya sama persis dengan *layout* asli, sehingga saat diklik, halaman tidak berkedip melainkan langsung menimpa data.

**C. Evaluasi `useRouter`:**
1. Jika ada navigasi menggunakan `router.push()` (dari `next/navigation`), pastikan Anda TIDAK memanggil `router.refresh()` secara sembarangan tepat setelahnya, karena itu akan memaksa server me-*render* ulang seluruh struktur dan memicu kedipan.

Silakan perbaiki sistem navigasi ini secara global (berlaku untuk seluruh *role* dan modul bisnis: Retail, F&B, Jasa, Rental). Buat perpindahan halamannya terasa "sat set" tanpa kedip sama sekali!
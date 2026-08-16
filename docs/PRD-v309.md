# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.09
**Fokus:** Bug Fix - Mobile Bottom Navigation Leak on Public Route

## 1. Analisis Masalah
Terdapat "kebocoran" UI pada halaman Katalog/Booking publik (`/book/[slug]`) saat diakses melalui perangkat *mobile*. Komponen *Bottom Navigation* (yang berisi menu admin seperti Dashboard, Kasir Rental, dll) ikut ter-render di halaman publik pelanggan. Hal ini terjadi karena komponen navigasi mobile tidak memiliki proteksi pengecekan rute (*route checking*) atau berada di struktur *layout* yang salah.

## 2. Instruksi Eksekusi (Conditional Rendering / Layout Segregation)
**Target File:** Komponen Navigasi Mobile (misal: `BottomNav.tsx`, `MobileNav.tsx`, atau di dalam `app/layout.tsx` / `app/(admin)/layout.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Proteksi Komponen Navigasi Mobile (Route Guard):**
1. Buka komponen yang merender *Bottom Navigation* untuk tampilan *mobile*.
2. Gunakan *hook* `usePathname` dari `next/navigation`.
3. Buat logika kondisional (*early return*) di bagian atas komponen:
   - Cek apakah *pathname* saat ini merupakan rute publik (contoh: `pathname.startsWith('/book')` atau `pathname.startsWith('/toko')`).
   - Jika `true`, maka langsung `return null;` agar seluruh elemen *Bottom Navigation* tidak di-render sama sekali di halaman tersebut.

**B. (Opsional/Alternatif) Perbaikan Struktur Route Group Layout:**
1. Jika aplikasi ini menggunakan *App Router*, pastikan folder `/book` atau `/toko` berada di luar *Route Group* yang membungkus layout admin (misal di luar folder `(dashboard)` atau `(admin)`).
2. Pastikan `layout.tsx` utama (root) hanya merender children, sedangkan elemen navigasi (Sidebar, Navbar, BottomNav) dipindahkan secara eksklusif ke dalam `layout.tsx` milik grup admin.

Silakan tutup kebocoran UI ini sekarang juga menggunakan proteksi *pathname*! Pastikan halaman publik di perangkat *mobile* 100% bersih dari panel admin! Lapor jika perbaikan sudah di-push!
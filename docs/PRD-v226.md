# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.26
**Fokus:** Bugfix Prevent Scroll to Top pada Filter Kategori (Superadmin)

## 1. Objektif
Menghilangkan efek layar melompat ke atas (*scroll to top*) saat Superadmin mengklik tab/menu filter kategori bisnis (misal: F&B, Retail, Jasa, Rental) pada halaman dashboard Superadmin. Layar harus tetap stabil di posisi tabel saat filter diubah.

## 2. Analisis Masalah
Bug ini disebabkan oleh perilaku default navigasi Next.js (App Router). Saat URL atau Search Parameters diubah (misalnya menggunakan `<Link href="?category=Rental">` atau `router.push('?category=Rental')`), Next.js secara otomatis akan mengembalikan posisi scroll viewport ke posisi paling atas (Y: 0).

## 3. Perbaikan Frontend (Komponen Filter)
**Target File:** `app/superadmin/CategoryFilter.tsx` (atau komponen klien tempat tombol filter kategori Superadmin berada, bisa juga di dalam `app/superadmin/page.tsx` atau `page-client.tsx`).
**Instruksi Eksekusi:**
1. Cari elemen tombol atau link yang bertugas mengubah kategori aktif.
2. JIKA menggunakan komponen `<Link>` dari `next/link`:
   - Tambahkan properti `scroll={false}`.
   - Contoh: `<Link href={`?category=${item.slug}`} scroll={false}>`
3. JIKA menggunakan hooks `useRouter` (`router.push` atau `router.replace`):
   - Tambahkan opsi `{ scroll: false }` pada argumen kedua.
   - Contoh: `router.push(`?category=${selected}`, { scroll: false })`
4. Pastikan pembaruan URL/state tetap berjalan lancar dan data tabel berubah sesuai kategori yang dipilih tanpa menggeser posisi *scroll* pengguna.

Silakan analisis file yang relevan dan terapkan parameter `scroll={false}` ini.
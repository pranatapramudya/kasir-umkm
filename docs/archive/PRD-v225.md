# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.25
**Fokus:** Optimasi Kecepatan Navigasi (Instant Routing & Prefetching)

## 1. Objektif
Menghilangkan delay/jeda saat user (Kasir/Owner) berpindah antar menu di Sidebar maupun Bottom Navigation. Perpindahan route harus terasa instan (milidetik) layaknya Single Page Application (SPA) modern kelas Enterprise.

## 2. Refaktor Komponen Navigasi (Prefetching)
**Target File:** `components/SidebarClient.tsx` dan `components/BottomNavClient.tsx` (serta komponen navigasi utama lainnya).
**Instruksi:**
1. Pastikan semua tombol navigasi antar halaman HANYA menggunakan komponen `<Link>` dari `next/link`, BUKAN tag `<a>` standar HTML atau eksekusi `router.push()` murni pada `onClick`.
2. Jika ada elemen menu yang menggunakan `router.push()`, refaktor menjadi `<Link href="...">` agar Next.js dapat melakukan background prefetching secara otomatis saat link masuk ke viewport.
3. Untuk rute-rute krusial (seperti Dashboard dan Kasir POS), tambahkan properti `prefetch={true}` pada komponen `<Link>` agar datanya ditarik di latar belakang sebelum user mengkliknya.

## 3. Implementasi Instant Loading States (Skeleton UI)
**Target File:** Direktori utama `app/admin/` dan `app/page-client.tsx` (atau layout yang membungkus dashboard kasir).
**Instruksi:**
1. Buat file `loading.tsx` di dalam root direktori yang memiliki proses *data fetching* berat (misal: di `app/admin/loading.tsx` atau `app/loading.tsx`).
2. Isi `loading.tsx` dengan komponen Skeleton UI (animasi pulse/shimmer) yang estetik menggunakan Tailwind CSS. 
3. *Tujuan:* Saat user mengklik menu, Next.js akan langsung (tanpa delay) merender file `loading.tsx` ini sementara server memproses data Prisma di belakang layar. Hal ini mengeliminasi kesan aplikasi "nge-hang" atau tidak responsif.

## 4. Analisis Suspense Boundaries
**Target File:** Halaman yang memuat tabel atau grafik berat (misal: Analitik, Laporan, atau Jadwal Booking).
**Instruksi:**
1. Gunakan komponen `<Suspense fallback={<Skeleton />}>` dari React untuk membungkus komponen Server yang berat.
2. Hal ini memastikan "cangkang" halaman (Sidebar, Header, Layout) langsung ter-render dalam hitungan milidetik, sementara hanya bagian datanya saja yang menunggu.

Silakan eksekusi optimasi Next.js ini secara komprehensif. Pastikan setelah perbaikan, transisi menu di versi mobile maupun desktop terasa sangat cepat dan smooth.
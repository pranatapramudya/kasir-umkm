# Changelog — PJTECH KASIR UMKM

Semua perubahan signifikan pada proyek ini didokumentasikan di sini.  
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### 🌐 UX & Copywriting: Universalisasi Modul Rental (Properti & Kendaraan)
- **Netralisasi Status & Filter:** Mengubah status `COMPLETED` dari "Siap Berangkat" menjadi "Sedang Disewa" dan `IN_PROGRESS` dari "Sedang Jalan" menjadi "Berjalan" pada Kalender Sewa, Booking Dashboard, dan Inbox Pesanan.
- **Action Buttons & Copywriting:** Mengubah tombol "Mulai Perjalanan / Start" menjadi "🚀 Mulai / Start" dan "Tiba di Pool / Finish" menjadi "✅ Selesai / Finish", serta mengganti rujukan "Info Armada" / "Armada/Layanan" menjadi "Info Unit" / "Unit/Layanan".
- **Dynamic Iconography (Ikon Unit):** Menambahkan logika deteksi tipe unit `detectRentalItemType` pada `lib/business-category.ts`. Menampilkan ikon 🛏️ Kasur (`Bed`) untuk properti/kamar/kos, 🚗 Mobil (`CarFront`/`Car`) untuk kendaraan, dan 🔑 Kunci (`Key`) untuk fallback.
- **Form Tambah / Edit Layanan Rental:** Mengubah label & placeholder input form pada `admin/products` menjadi universal untuk properti & kendaraan (Tipe Unit, Nama Unit/Nomor Kamar/Plat, Komisi Petugas/Driver, Fasilitas/Catatan Tambahan).

### 📝 Dokumentasi & Konfigurasi Dynamic URL, Category ID, & Mayar
- **Environment Variable `NEXT_PUBLIC_APP_URL`:** Mendokumentasikan variabel URL terpusat (`http://localhost:3000` untuk dev, `https://www.pjtechumkm.com` untuk production).
- **Standar Identifier Kategori Bisnis:** Menetapkan dan mendokumentasikan spesifikasi ID baku format UPPERCASE (`RENTAL`, `JASA`, `FNB`, `RETAIL`).
- **Integrasi Mayar.id:** Mendokumentasikan helper `getAppUrl()` di [`lib/url.ts`](file:///d:/Coding/kasir-umkm/lib/url.ts), rute Webhook `/api/webhooks/mayar`, serta rute Callback Redirect `/auth-callback`.

### 🐛 Bugfix: Next.js Router Cache & Clerk Metadata Sync (Onboarding & Subscription)
- **Penanganan Router Cache & State:** Memperbaiki bug di mana UI dasbor kasir sempat menampilkan layout kategori lama (Retail) setelah mendaftarkan toko baru dengan kategori lain (FNB/JASA/RENTAL) pada fase Onboarding.
- **Implementasi Revalidation & Reload:** 
  - Injeksi `revalidatePath('/', 'layout')` dan `revalidatePath('/admin', 'layout')` pada Server Actions `completeOnboarding`, `selectSubscriptionPackage` ([`app/(protected)/onboarding/actions.ts`](file:///d:/Coding/kasir-umkm/app/%28protected%29/onboarding/actions.ts)), dan API Route [`app/api/subscription/extend/route.ts`](file:///d:/Coding/kasir-umkm/app/api/subscription/extend/route.ts).
  - Mengombinasikan `await user.reload()` dan `router.refresh()` pada sisi Klien ([`app/(protected)/onboarding/page.tsx`](file:///d:/Coding/kasir-umkm/app/%28protected%29/onboarding/page.tsx), [`components/PricingSection.tsx`](file:///d:/Coding/kasir-umkm/components/PricingSection.tsx), dan [`components/PaywallModal.tsx`](file:///d:/Coding/kasir-umkm/components/PaywallModal.tsx)) untuk secara instan menghapus cache client router dan memuat data RSC (*React Server Components*) terbaru dari database.

### ✨ Fitur Baru & Perbaikan: Integrasi Webhook Mayar
- Menambahkan route handler `app/api/webhooks/mayar/route.ts` untuk menangani webhook pembayaran otomatis dari Mayar (`payment.success` dan `payment.received`).
- Fitur ini mendeteksi jumlah pembayaran (`amount`) dan memperbarui paket berlangganan (`subscriptionPlan`) secara dinamis menjadi `PRO_1M`, `PRO_6M`, atau `PRO_1Y`.
- Melakukan perhitungan otomatis untuk memperpanjang `subscriptionEndsAt` pada tabel `Tenant` sesuai dengan durasi langganan (1, 6, atau 12 bulan).
- **Hotfix:** Menambahkan penanganan event `testing` dari dashboard Mayar agar merespon `200 OK` secara langsung tanpa memicu pemanggilan query database.
- **Hotfix:** Implementasi *graceful degradation* saat user (email) dari webhook tidak ditemukan pada database dengan merespon HTTP `200` agar menghindari *infinite retry* dan mencegah penumpukan antrean (*webhook stuck*) dari pihak Mayar.
- **Hotfix:** Memperbaiki build error (TypeScript type mismatch) pada `app/api/reports/shift/route.ts` ketika melakukan push `mappedBookings` ke array `transactions` dengan menambahkan type casting `as any[]`.

### ⚡ Performa & UX: Speed Insights & Caching SWR
- Mengintegrasikan `@vercel/speed-insights` pada root layout untuk tracking Core Web Vitals.
- Optimalisasi caching global SWR dengan menonaktifkan `revalidateOnFocus` dan `revalidateIfStale`, serta mengatur `dedupingInterval: 60000` untuk mengurangi jumlah *network request* berlebihan, sehingga aplikasi terasa lebih ringan.
- **LCP Optimization (Hydration Fix):** Memindahkan pengambilan data analitik dari *Client Component* ke *Server Component* pada rute `/admin`, serta memisahkan utilitas `getAnalyticsData` ke dalam `lib/analytics-service.ts` dengan penanganan serialisasi waktu (`Date` ke `toISOString`) untuk mengatasi `Hydration Error`.
- **TTFB & FCP Optimization (ISR):** Mengubah strategi *caching* pada rute publik `/book/[slug]` dari `force-dynamic` (Real-Time) menjadi *Incremental Static Regeneration* (ISR) dengan `revalidate = 60` untuk mempercepat pemuatan halaman melalui CDN cache.

---

## [0.3.63] — 2026-08-19

### ⚡ Vercel CPU Optimization & Error Handling (PRD v0.3.63)

> Fokus: Memindahkan beban komputasi dari **Vercel CPU → Database Engine (PostgreSQL/Neon)** berdasarkan data Vercel Observability.

#### `/api/analytics` — Refactor Agregasi ke Database
- **Hapus** `findMany` + kalkulasi manual `.forEach` / `.reduce` di JavaScript untuk `totalRevenue`, `totalTransactions`, dan `totalExpense`.
- **Ganti** dengan `prisma.transaction.aggregate({ _sum: { total }, _count: { id } })` dan `prisma.expense.aggregate({ _sum: { amount } })` — seluruh SUM & COUNT kini dilakukan oleh PostgreSQL.
- **Paralelkan** seluruh query dengan `Promise.all` (6 query concurrent) untuk meminimalkan total round-trip latency.
- `salesTrend` tetap menggunakan `findMany` minimal (select 2 kolom) karena membutuhkan grouping per tanggal WIB yang tidak dapat dilakukan murni di sisi DB via Prisma ORM.
- **Estimasi dampak:** Active CPU `2.4s → <0.5s`.

#### `/api/reports/shift` — Eliminasi Double Query & Perbaikan Error Rate 31.3%
- **Hapus** query `allTransactions` yang menarik seluruh data hari (beserta nested `items`) ke RAM Node.js — penyebab utama OOM / Connection Timeout.
- **Ganti** kalkulasi metrics (`totalGross`, `totalCash`, `totalQRIS`) dengan `prisma.transaction.groupBy({ by: ['method'], _sum: { total } })` — agregasi di Database.
- **Ganti** iterasi nested `items` di JS untuk `soldSummary` dengan `prisma.transactionItem.groupBy({ by: ['productId'], _sum: { qty } })` — kalkulasi di Database.
- **Pisahkan** `partial` transactions (subset kecil) sebagai query sendiri untuk penanganan `downPayment` sebagai `effectiveTotal`.
- **Eliminasi double query**: transaksi kini hanya di-query sekali untuk kebutuhan tabel paginasi.
- **Perbaiki error handling**: `catch (error: unknown)` dengan ekstraksi `message` + `stack`, response JSON lebih informatif (field `detail`) untuk memudahkan debugging di Vercel Logs.

#### `prisma/schema.prisma` — Index Baru
- Tambah `@@index([userId, createdAt, cashierId])` pada model `Transaction` untuk mendukung query laporan shift per kasir dengan *single index scan* (menggantikan sequential scan).
- `npx prisma db push` berhasil — index aktif di Neon PostgreSQL (`ap-southeast-1`).

#### `/api/booking/pending-count` — Tidak Diubah
- Audit menunjukkan route ini **sudah optimal** (`prisma.booking.count()` sudah digunakan). Active CPU 4.13s kemungkinan disebabkan cold-start Vercel, bukan inefisiensi query.

---

## [0.3.33 – 0.3.48] — 2026-08-18

### 🚀 Optimasi & Bug Fixes (Hotfixes)
- **Pembaruan SOP Rental (Buku Panduan):** Menyisipkan instruksi wajib "Atur Rekening Pembayaran (DP 50%)" pada komponen *BukuPanduanModal* khusus untuk pengguna Rental/Travel, guna mencegah transaksi *online booking* terputus akibat ketiadaan informasi rekening/e-wallet untuk pembayaran awal. Alur SOP Rental kini berjumlah 7 langkah.
- **Strict Component Unmounting (Informasi Pembayaran):** Menghapus total (unmount) *Card* "Informasi Pembayaran" pada halaman Pengaturan Toko untuk entitas bisnis Jasa (selain F&B dan Retail). Form pengaturan rekening kini diisolasi ekstrem secara eksklusif HANYA untuk pemilik bisnis Rental & Travel.
- **Isolasi Logika DP & Copywriting Dinamis:** Menyembunyikan form Informasi Pembayaran untuk bisnis F&B/Retail, serta melimitasi logika *Down Payment (DP)* 50% di halaman *Booking* publik murni hanya untuk kategori *Rental*. Label rekening kini otomatis menjadi E-Wallet untuk Rental.
- **Fitur Unduh Tiket (Canvas) & Data Isolation Naming:** Memperbaiki *bug crash* pada `html2canvas` dengan suntikan parameter *allowTaint* dan *useCORS*, mereset *state loading*, serta mengamankan identitas file unduhan secara dinamis (`Tiket_[Toko]_[Pelanggan]_[ID].png`).
- **Absolute URL pada Salin Link Booking:** Memperbaiki *relative path* di halaman Jadwal Booking dan Informasi Toko menggunakan `window.location.origin` (aman dari *hydration mismatch*) agar *link* yang disalin langsung berformat absolut (https://...) yang siap pakai.
- **Strict Canvas Thermal Print:** Melakukan injeksi CSS `@page` khusus 80mm dan mengunci limit *wrapper width* maksimum ke `80mm` pada cetakan Thermal guna mengatasi *bug rendering* ukuran kertas A4 pada *print dialog* Desktop.
- **System-Wide Cache Isolation:** Penerapan `[url, tenantId]` pada SWR *cache keys* dan mekanisme *Wipe-on-Login/Logout* untuk mencegah *stale data* dan *FOUC* antar tenant.
- **Realtime Hook Fix:** Penanganan *payload* dari Supabase Realtime dengan SWR `mutate` *background fetch* untuk mencegah *Client-side Exception* akibat *missing relation data*.
- **Smart Print Logic (CSS Media):** Pemisahan *print format*. Otomatisasi kertas Thermal (80mm) untuk kasir F&B/Retail/Jasa, dan kertas A4 khusus untuk dokumen Surat Jalan bisnis Rental/Travel. Termasuk sinkronisasi dinamis "Nama Kasir" dan perbaikan ID karyawan.
- **Dynamic Onboarding SOP:** Perbaikan antarmuka *Stepper* pada Modal Buku Panduan (pemisahan warna per bisnis dan *horizontal divider*), serta pemisahan redaksi SOP yang ketat antara Rental, Jasa, F&B, dan Retail (termasuk penghapusan referensi *barcode* pada Retail).

---

## [0.3.0 – 0.3.32] — 2026-08-17

### 🚀 Fitur Baru & Arsitektur Utama
- **Arsitektur Isolasi Tenant (Anti-Leakage):** Pencatatan mekanisme pembersihan *cache* (SWR & `localStorage`) pada level sesi pengguna dan proteksi `<LoadingSkeleton>` untuk mencegah kebocoran data antar pengguna.
- **Integrasi Supabase Real-time:** Peralihan dari metode *fast polling* menjadi *Postgres Changes Listener* yang diisolasi menggunakan filter `tenantId`, dipadukan dengan SWR `mutate` untuk pembaruan UI instan yang hemat *resource*.
- **Sistem Kalender Anti Double-Booking:** Penambahan kapabilitas pengecekan ketersediaan jadwal via `/api/booking/availability`, serta integrasi `react-day-picker` berbalut *Popover Modal* dengan pengamanan sinkronisasi zona waktu lokal (WIB/Lokal) vs UTC.
- **Dynamic Multi-Tenant UX & Export:** Implementasi utilitas terminologi teks yang menyesuaikan bahasa UI berdasarkan model bisnis (Rental vs Jasa vs Retail/F&B), termasuk adaptasi format kolom pada *export* Excel.
- **Modul Onboarding (Buku Panduan):** Penambahan fitur dokumentasi interaktif (SOP) internal pada *Sidebar* untuk memandu alur kerja pengguna berdasarkan entitas bisnis masing-masing.

---

## [0.2.21 – 0.2.32] — 2026-08-13

### 🚀 Fitur Baru
- **Implementasi Ekosistem "Rental & Travel":** Dukungan rentang tanggal (Date Range booking), form input armada (nama supir & plat nomor) di POS Kasir, dan integrasi cetak struk via Bluetooth khusus untuk Rental.
- **Pemisahan UI Dual-Role Login:** Akses masuk ke sistem kini terpisah secara visual antara Pemilik Bisnis (Owner) dan Karyawan pada komponen Landing Page.
- **Lokalisasi Bahasa Indonesia (Clerk Auth):** Seluruh antarmuka autentikasi Clerk (Sign In, Sign Up, User Profile, validasi form) menggunakan dialek ID (id-ID).
- **Ekspor Excel Dinamis:** Kolom laporan Excel kini beradaptasi secara otomatis dengan kategori bisnis (*Dynamic Excel Export*).

### ⚡ Optimasi & Pembaruan
- **Navigasi Instan:** Implementasi *Prefetching* pada navigasi dan penambahan *Skeleton Loading* untuk meminimalisasi jeda pergantian rute.

### 🐛 Perbaikan Bug (Bugfixes)
- **Foreign Key Constraint:** Mencegah terjadinya error foreign key saat melakukan *checkout* (menyimpan transaksi) oleh Kasir.
- **Server Components Render Error:** Perbaikan masalah *serialize data* (throw err object) saat penambahan data karyawan/kasir baru.
- **Flickering Data Karyawan:** Menanggulangi hilangnya daftar produk yang kadang terjadi saat kasir/karyawan me-refresh halaman POS.
- **Filter Kategori (Superadmin):** Mencegah efek layar terlempar ke atas (*scroll-to-top*) saat melakukan filter tabel data tenant.
- **Invalid Prisma Invocation:** Mengubah eksekusi `findUnique` menjadi `findFirst` guna mencegah crash saat pendaftaran toko/tenant (Onboarding).

---

## [0.2.13 – 0.2.20] — 2026-08-12

### 🚀 Fitur Baru

- **Dynamic Multi-Tenant Booking System (Modul Jasa)**
  - Halaman booking publik per-tenant (`/book/[slug]`) dengan form pemilihan layanan, tanggal, dan jam.
  - Anti-double-booking guard di backend (backend race-condition safe).
  - Kalender interaktif untuk owner (berbasis `react-big-calendar`) di dashboard `/admin/booking`.
  - API slot-checking (`/api/booking/check-slots`) untuk validasi ketersediaan jadwal secara real-time.

- **Progressive Web App (PWA) Full-Screen**
  - `app/manifest.ts` — Web App Manifest dengan `display: "standalone"` dan `orientation: "portrait"`.
  - Service Worker (`app/sw.ts`) via `@serwist/next` dengan caching strategy (CacheFirst / NetworkFirst).
  - Meta tags `appleWebApp` di root layout untuk pengalaman PWA di perangkat iOS.

- **Web Push Notifications (Real-Time)**
  - Model database `PushSubscription` (Prisma) untuk menyimpan subscription per-user.
  - API `POST/DELETE /api/push/subscribe` — upsert/hapus subscription browser ke DB.
  - Utility backend `lib/webpush.ts` dengan VAPID keys via library `web-push`.
  - Notifikasi otomatis dikirim ke Owner toko & Super Admin setiap ada booking baru masuk.
  - Client Component `PushNotificationManager.tsx` — toast izin notifikasi (via Sonner), auto-subscribe jika sudah granted.

- **Web Bluetooth ESC/POS Thermal Printing**
  - Cetak struk thermal nirkabel langsung dari browser via Web Bluetooth API.
  - Kompatibel dengan printer ESC/POS standar tanpa driver atau aplikasi pihak ketiga.

---

### 🐛 Perbaikan (Bugfix & UI/UX)

- **Redirect expired trial** — Perbaikan logika redirect saat sesi trial habis agar tidak terjadi infinite loop atau redirect yang salah.
- **Kalkulasi harga di komponen Pricing** — Koreksi formula perhitungan harga/diskon di halaman Pricing agar akurat.
- **Isolasi menu mobile (Multi-Tenant)** — Perbaikan race-condition UI saat perpindahan tenant di perangkat mobile.
- **Header responsif Super Admin (v0.2.19)**
  - Hapus tombol Logout redundan (digantikan oleh `UserButton` Clerk bawaan).
  - Tipografi responsif: `text-base md:text-xl leading-tight`.
  - Teks "Command Center" disembunyikan di layar HP kecil (`hidden sm:inline`).
- **Refaktor UI Filter Kategori Super Admin (v0.2.20)**
  - Tab/pill group horizontal diganti dengan `<CategoryFilter />` dropdown (`<select>` native).
  - Responsif: `w-full md:w-64`, ikon Filter (corong) di dalam select.
  - Logika URL param & pagination tetap berfungsi penuh.

---

### 🔧 Perubahan Teknis (Chores)

- Install dependencies: `@serwist/next`, `serwist`, `web-push`, `@types/web-push`.
- Tambah `"webworker"` ke `lib` di `tsconfig.json` untuk type-checking Service Worker.
- Script `build` diubah ke `next build --webpack` agar kompatibel dengan `@serwist/next`.
- Script `build:prod` ditambahkan sebagai alias eksplisit.
- `turbopack: {}` ditambahkan ke `next.config.ts` untuk silence peringatan Turbopack saat `next dev`.
- VAPID env vars ditambahkan: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
- `SUPER_ADMIN_USER_IDS` env var untuk mendefinisikan penerima notifikasi Super Admin.

---

## [0.2.0 – 0.2.12] — Sebelumnya

Lihat [`docs/RELEASE-NOTES-v0.2.md`](./RELEASE-NOTES-v0.2.md) untuk detail versi sebelumnya.

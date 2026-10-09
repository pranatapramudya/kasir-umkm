# PJTECH KASIR UMKM - SaaS Enterprise Platform

PJTECH KASIR UMKM adalah Sistem Manajemen Kasir UMKM Premium untuk kendali penuh atas operasional bisnis. Platform Point of Sales (POS) komprehensif berbasis SaaS (Software as a Service) 100% universal yang dirancang khusus untuk memenuhi kebutuhan berbagai jenis bisnis: **F&B (Restoran/Kafe/Foodtruck), Retail (Toko/Minimarket), Jasa/Servis (Bengkel/Barbershop/Salon/Laundry), dan Rental & Properti (Mobil/Motor/Properti/Kos/Kamera/Alat)**. 
Dibangun dengan fokus pada kecepatan, keamanan multi-tenant tingkat enterprise, dan antarmuka *Mobile-First*, platform ini siap digunakan sebagai fondasi operasional bisnis skala UMKM hingga Enterprise.

## 🚀 Tech Stack Utama

Proyek ini dikembangkan menggunakan teknologi modern terkini:

- **Framework:** [Next.js 16+ (App Router)](https://nextjs.org/) dengan Turbopack
- **Database ORM:** [Prisma Client](https://www.prisma.io/)
- **Database Engine:** [PostgreSQL (Neon Serverless)](https://neon.tech/)
- **Authentication & Authorization:** [Clerk](https://clerk.com/) (Multi-tenant B2B/B2C, RBAC)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State/Data Fetching:** [SWR](https://swr.vercel.app/)
- **Icons:** [Lucide React](https://lucide.dev/)

## ✨ Fitur & Arsitektur Utama

- **Alur Sewa & Pelunasan DP End-to-End Multi-Niche (Kendaraan, Properti, & Alat):**
  - Pengelolaan transaksi uang muka (DP) dan sisa pelunasan terpadu di Kalender Sewa dan Laporan Kasir.
  - Preview & cetak dokumen/surat jalan instan (A4/A5) berlabel adaptif (*Surat Jalan & Tanda Terima DP* vs *Invoice Resmi Lunas*).
  - Dialog SOP serah terima jaminan modern (KTP/SIM/Paspor) sebelum pelunasan di Laporan Kasir bebas dialog browser kaku.
- **Production-Ready Enterprise Architecture:** Siap menangani skalabilitas dengan mitigasi *database connection pooling*, perlindungan *webhook* autentikasi Clerk (sinkronisasi penghapusan akun otomatis ke DB), dan arsitektur *multi-tenant* yang ketat.
- **Sistem Pembayaran & Subscription Dinamis:** Terintegrasi dengan payment gateway (Mayar) via webhook untuk aktivasi otomatis paket langganan (Pro 1 Bulan, 6 Bulan, 1 Tahun) secara real-time, beserta alur pendaftaran *Manual ACC* yang dikelola via Dasbor Superadmin.
- **Optimasi SEO & UI Enterprise:** Injeksi SEO pada *Landing Page* untuk pencarian organik maksimal, dipadukan dengan desain *glassmorphism* modern, profesional, dan responsif.
- **Komponen Pemilih Jam Modern (Modern Time Picker Suite) & Estimator BBM:**
  - Pemilih jam 24 jam WIB adaptif untuk POS kasir dan formulir reservasi online publik (`/book/[slug]`), dilengkapi filter waktu cepat (*Pagi, Siang, Sore, Malam, Subuh*), render portal bebas overflow, dan perlindungan bentrok jadwal sewa unit/armada.
  - Estimator BBM & Jarak Tempuh Rute cerdas dengan pemilih jenis bahan bakar modern (Diesel & Bensin) berdesain popover elegan.
- **Ekspor Laporan Pajak Standar Akuntansi Indonesia (Tax Export Suite):**
  - Ekspor laporan pajak berformat CSV UTF-8 BOM yang kompatibel langsung dengan Mekari Jurnal & Accurate Online, dilengkapi modul unduh template sampel dan panduan pelaporan SPT UMKM.
- **Dukungan Multi-Bisnis 100% Universal:** Logika dinamis adaptif untuk:
  - **Retail:** Manajemen SKU/Barcode, HPP, stok otomatis, dan POS kasir cepat langsung transaksi.
  - **F&B (Kuliner):** Label sidebar adaptif *"Daftar Menu"*, denah meja & status *Takeaway/Bungkus*, serta cetak tiket dapur terpisah.
  - **Jasa & Servis:** Label sidebar adaptif *"Layanan"*, pemilihan staf/teknisi dengan *smart fallback* (*"Dikerjakan oleh Admin/Pemilik"* untuk solo operator/toko baru), validasi picker jadwal real-time, dan kalkulasi komisi staf.
  - **Rental & Travel/Properti:** Label sidebar adaptif *"Unit / Properti / Armada"*, indikator Biaya Operasional (B. Ops), kalender sewa anti double-booking, serta cetak surat jalan / bukti sewa.
- **Pengaturan Toko Adaptif & Universal:** Akses menu "Informasi Toko / Pengaturan" dibuka untuk seluruh kategori bisnis dengan sistem *conditional rendering* cerdas (modul rekening bank & DP 50% hanya aktif untuk Jasa & Rental, sedangkan Retail & F&B tetap ramping dan bersih).
- **Role-Based Access Control (RBAC):** Pemisahan hak akses ketat antara *Owner/Superadmin* dan *Karyawan/Kasir* menggunakan proteksi route tingkat server (Middleware & API), termasuk halaman panduan khusus karyawan.
- **Manajemen Karyawan & Sistem Komisi:** Pelacakan performa staf dan kalkulasi komisi otomatis berdasarkan transaksi yang diselesaikan (sangat cocok untuk bisnis Jasa/Salon/Bengkel).
- **Manajemen Meja & Takeaway Resto:** Visualisasi ketersediaan status meja real-time serta opsi khusus *Takeaway / Bungkus / Konter* tanpa meja fisik untuk bisnis F&B.
- **Keamanan Transaksi & Data (Soft Delete):** Menggunakan flag `isActive` pada produk untuk menjaga integritas data historis transaksi (mencegah isu *Time-of-Check to Time-of-Use / TOCTOU*).
- **Point of Sales (POS) & Manajemen Produk Responsif Berbasis Layar:**
  - **Desktop (≥ 1024px):** Batas maksimal 12 item per halaman, mengisi penuh grid 4-kolom POS dan 3-kolom Produk Admin secara presisi tanpa slot gantung.
  - **Mobile (< 1024px):** Batas maksimal 10 item per halaman dengan navigasi touch swipe lancar.
  - **Zero-Delay Pagination:** Dilengkapi preloading data halaman berdekatan secara proaktif untuk responsivitas perpindahan halaman 0ms.
- **Point of Sales (POS) Responsif & Cepat:** Antarmuka Kasir *Mobile-First* yang lancar digunakan pada tablet atau *smartphone*, dilengkapi fitur keranjang dan kalkulasi diskon otomatis.
- **Integrasi Hardware Barcode Scanner & Audio Feedback (Retail & F&B):**
  - **Global Hardware Scanner Listener:** Mendeteksi otomatis pemindaian barcode USB/Bluetooth HID melalui perhitungan interval keystroke cepat (< 70ms), langsung memasukkan item ke keranjang dan menambah kuantitas tanpa perlu klik tombol.
  - **Fallback Pencarian API Cerdas:** Jika barcode tidak berada di 10 item pada halaman aktif, sistem otomatis mencari ke seluruh database via `/api/products?search=${code}` agar seluruh katalog dapat dipindai.
  - **Tactile Audio Feedback (Web Audio API):** Nada bip frekuensi tinggi (1200Hz) saat produk berhasil dipindai dan nada peringatan (280Hz) saat SKU tidak ditemukan atau stok habis.
  - **UI Manual SKU Input:** Kolom input khusus di header POS dengan ikon barcode, tombol `Enter ↵`, dan pembersihan otomatis setelah item ditambahkan.
- **Import & Ekspor Data Excel Dinamis (Dynamic Multi-Category Excel Suite):**
  - **Template Impor `.xlsx` Asli:** Unduhan template impor massal berformat Excel (`.xlsx`) asli dengan kolom dan data contoh yang disesuaikan secara dinamis per kategori bisnis (Retail, F&B, Jasa, Rental/Properti), mencegah baris berantakan pada regional setting Indonesia.
  - **Parser Massal Cerdas:** Mendukung unggah file `.xlsx`, `.xls`, maupun `.csv`, dilengkapi pemetaan deskripsi/fasilitas, toleransi alias header (`bOps`/`biayaOperasional` $\rightarrow$ HPP, `komisi` $\rightarrow$ komisi staf), dan pembersihan teks mata uang.
  - **Ekspor Katalog Produk Instan:** Tombol "Export Data" langsung mengunduh seluruh daftar produk/layanan/unit tenant (`GET /api/products/export`) ke file `Katalog_Produk_[NamaToko].xlsx`.
  - **Penyelarasan Header Laporan Universal:** Header laporan penjualan diselaraskan secara profesional (*"Unit / Properti / Armada"* dan *"Staf / Teknisi / Petugas"*).
- **Real-Time Mobile Order Badge, Haptic Vibration & Web Audio Chime Suite:**
  - **SWR Polling & Red Badge di Mobile Bottom Nav:** Polling latar belakang reaktif (`/api/booking/pending-count`) setiap 10 detik dengan badge merah berdesain *Zero Layout Shift* (`absolute` di dalam kontainer ikon), disembunyikan jika kosong dan menampilkan hingga `"99+"`. Mendukung navigasi 2 tingkat (tab utama dan tombol "Lainnya" + drawer).
  - **Dual-Tone Web Audio Chime Bell:** Synthesizer Web Audio API murni (A5 880Hz ke D6 1174.66Hz) dengan *decay* lembut tanpa dependensi file mp3 eksternal, dilengkapi proteksi browser autoplay dan *debounce anti-echo* 2 detik untuk mencegah suara ganda pada perangkat kasir.
  - **Haptic Tactile Feedback:** Umpan balik getaran taktil via `navigator.vibrate([120, 80, 120])` pada perangkat seluler kasir saat ada pesanan baru tiba.
  - **Sinkronisasi Desktop & Mobile:** Logika alert dienkapsulasi ke dalam custom hook `usePendingBookingCount` yang dipakai bersama oleh Desktop Sidebar dan Mobile Bottom Navigation.
- **Progressive Web App (PWA) Ready:** *Installable on mobile devices with standalone full-screen experience.* Dapat diinstal di homescreen perangkat Android & iOS, berjalan layaknya aplikasi native.
- **Real-Time Web Push Notifications:** *Instant alerts for new bookings without native app overhead.* Owner & Super Admin mendapat notifikasi push saat ada booking baru, bahkan saat browser ditutup.
- **Universal Web Bluetooth Printing:** *Direct ESC/POS thermal receipt printing from the browser.* Cetak struk nirkabel secara langsung via Bluetooth tanpa driver atau aplikasi tambahan.
- **Dynamic Multi-Tenant Booking & Unduh Tiket HD:** *Self-service appointment & date-range scheduling dengan Anti-Double Booking guard.* Setiap tenant memiliki halaman booking publik (`/book/[slug]`) dengan validasi slot kalender interaktif secara real-time, perlindungan *browser autofill duplicate*, dan generator tiket digital beresolusi tinggi menggunakan `html2canvas-pro` (dukungan penuh Tailwind CSS v4 `oklch`).
- **Pusat Bantuan & Hotline WhatsApp Otomatis (Support Hotline):** Tombol bantuan langsung di modal panduan SOP dengan format pesan terstruktur otomatis yang memuat Nama Usaha, Kategori, dan Email Akun mitra UMKM ke nomor WhatsApp tim Support.
- **Pengaturan Jam Kunjungan & Sesi Booking Khusus Jasa / Servis:** Owner bisnis Jasa/Servis (Bengkel, Barbershop, Salon, Spa, Klinik) dapat secara fleksibel mengatur jam buka (slot pertama), jam tutup (slot terakhir), serta durasi jeda waktu per sesi (15m, 30m, 45m, 60m/1 jam, 90m, 120m/2 jam) di menu Informasi Toko, yang langsung beradaptasi secara dinamis ke halaman booking publik konsumen (`/book/[slug]`).
- **Sinkronisasi Real-Time Profil Toko & Dokumen Cetak (Zero-Stale Cache):**
  - Pembaruan nama toko, nomor telepon, dan informasi rekening pembayaran langsung tersinkronisasi seketika ke halaman publik `/book/[slug]` (`export const dynamic = 'force-dynamic'`), dasbor admin, cetak Struk Thermal Kasir, dan Dokumen Invoice A4/A5 resmi tanpa delay cache.
  - Revalidasi server Next.js otomatis untuk memastikan integritas data multi-tenant antar pengguna.


## 🛠️ Cara Menjalankan Lokal (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan *boilerplate* ini di mesin lokal Anda.

### 1. Instalasi Dependensi
Pastikan Anda menggunakan Node.js versi 18 ke atas.
```bash
npm install
```

### 2. Pengaturan Environment Variables
Buat file `.env.local` di root direktori proyek, lalu lengkapi variabel berikut:
```env
# App URL (Domain Utama Aplikasi)
# Dev: http://localhost:3000 | Production: https://www.pjtechumkm.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication Keys (Dapatkan dari dashboard Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Fallback Routing Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Neon Database URL
DATABASE_URL="postgresql://user:***@endpoint.neon.tech/dbname?sslmode=require"

# Mayar Webhook Secret (Dapatkan dari dashboard Mayar - Developer > Webhooks)
MAYAR_WEBHOOK_SECRET=your_mayar_webhook_secret_here

# Redis (untuk cache tag-based invalidation)
REDIS_URL="redis://localhost:6379"

# WebSocket Server (KDS Real-time)
WS_PORT=3001
```

### 🏷️ Standar Identifier Kategori Bisnis

Seluruh *payload* API, skema validasi, dan kolom database `category` menggunakan **Identifier Baku UPPERCASE**:

- `RENTAL` : Bisnis Persewaan & Rental (properti, alat, kendaraan, unit).
- `JASA` : Bisnis Jasa, Layanan, & Servis (salon, barbershop, bengkel, spa, konsultasi).
- `FNB` : Bisnis Makanan & Minuman (kafe, restoran, warung makan, bakery).
- `RETAIL` : Bisnis Penjualan Produk Fisik & Kelontong (toko, distro, minimarket).

### 💳 Konfigurasi Payment Gateway (Mayar.id)

Platform ini mengintegrasikan layanan **Mayar.id** untuk transaksi pembayaran online dan perpanjangan paket langganan (subscription) secara otomatis:

- **Helper Domain Dinamis (`getAppUrl()`):**
  Didefinisikan pada [`lib/url.ts`](file:///d:/Coding/kasir-umkm/lib/url.ts) untuk resolusi domain terpusat melalui variabel `NEXT_PUBLIC_APP_URL`. Helper ini secara otomatis mendeteksi apakah aplikasi berjalan di environment lokal (`http://localhost:3000`) atau production (`https://www.pjtechumkm.com`).
- **Endpoint Webhook (Mayar Webhook Route):**
  `/api/webhooks/mayar`  
  Menangani event `payment.success`, `payment.received`, serta event handshake `testing` dari dashboard Mayar.
- **Redirect URL (Callback Landing Page):**
  `/auth-callback`  
  Halaman callback pasca checkout/perpanjangan paket untuk memverifikasi metadata akun dan mengarahkan kembali pengguna secara mulus ke dasbor admin.

### 3. Migrasi Database
Dorong skema database ke server Neon PostgreSQL.
```bash
npx prisma db push
npx prisma generate
```

### 4. Jalankan Development Server
```bash
# Opsi 1: Via Orchestrator (auto-start Next.js + WebSocket + Redis)
node scripts/orchestrator.js

# Opsi 2: Manual terpisah
npm run dev              # Next.js di port 3000
npx tsx scripts/websocket-server.ts  # WebSocket KDS di port 3001
redis-server             # Redis cache
```

Buka [http://localhost:3000](http://localhost:3000) di *browser* Anda untuk melihat hasilnya. Rute utama *landing page* dan kasir berada di `/`, dan rute manajemen admin (terproteksi) berada di `/admin`.

---

## 📋 Changelog Terbaru (September 2026)

### v2.0.0 - Four Vertical Complete + Platform Optimization
**Retail (Offline-First):**
- IndexedDB queue + Service Worker + auto-sync on reconnect
- Bluetooth thermal printer auto-detect (ESC/POS)
- CSV/Jurnal tax export

**F&B (KDS Real-time):**
- Table grid (Meja 1-10), Split Bill, Takeaway/Dine-In
- KDS mobile accordion (light theme)
- Kitchen/Bar ticket routing via WebSocket (<1s)

**Jasa/Servis (Booking + Commission + Template Fixes):**
- Public booking → Dashboard → POS → Commission flow
- Cross-product double-booking guard (slot-level)
- Worker assignment + serviceDuration input
- Commission snapshot + rekap-komisi report
- **Template Excel 2 sheet: "Jasa" (unlimited stock, biayaModal) + "Sparepart" (stock, HPP)**
- **Import bulk: auto-detect Jasa murni → hpp=0, biayaModal, stock=999999**
- **UI: hide stock badge for Jasa murni, separate Biaya Modal field**
- **Onboarding: hapus step "Toko" redundant (sudah di signup), 2 step Printer → Produk/Import**

**Rental/Travel/Properti:**
- Property & Vehicle modes, hourly (jam) & daily rental
- Province/Regency/District cascading dropdowns
- Rental calendar dashboard (month nav, filter tabs)
- Date-range overlap guard

**Platform Optimizations:**
- WebSocket server (port 3001) + orchestrator auto-start
- Redis cache with tag-based invalidation (5min TTL products)
- Bundle analysis: xlsx 139KB, recharts 109KB gzip → lazy load targets

**QA & Testing:**
- Playwright E2E: jasa-servis-qa (21 tests), rental-travel-properti-qa (23 tests)
- 17/23 rental pass (6 auth-only), 15/21 jasa pass

**Infra:**
- scripts/orchestrator.js auto-starts Next.js + WS + Redis
- OfflineProvider + IndexedDB + SW auto-sync
- Multi-tenant isolation via Clerk session (userId/tenantId)

---

### v2.6.0 - Rental Calendar UI Overhaul, Dynamic Pagination & Cross-Vertical Isolation (Okt 9, 2026)
- **Kalender Sewa UI/UX Overhaul & Dual Responsive Pagination:**
  - **Limit Dinamis Perangkat:** Pembagian kuota kartu adaptif: maksimal **4 orderan** di perangkat mobile (< 1024px) untuk mencegah scrolling panjang melelahkan (~4.000px scroll), dan maksimal **6 orderan** di desktop (≥ 1024px) agar simetris dengan grid kalender bulanan.
  - **Dual Pagination Bar (Atas & Bawah):** Dilengkapi quick bar di atas dan bar navigasi penuh di bawah kartu dengan smooth scroll otomatis ke posisi teratas agenda saat berpindah halaman.
  - **Peningkatan Tombol Edit:** Ikon `Pencil` diperbesar ke ukuran nyaman sentuh (`w-5 h-5`) dengan label teks `Edit` tebal di bawahnya dalam kotak tombol interaktif berstandar antarmuka modern.
- **Cross-Vertical Isolation & Emoticon Sanitization:**
  - **Sanitasi Kasir POS (`QueueModal` Tarik Antrean Online):** Menghapus hardcode emot mobil `🚗` dan label *"Armada"*. Kini terisolasi dinamis per vertikal:
    - ✂️ **Jasa / Servis:** Menampilkan `📋 {nama_layanan}` & teks *"Layanan Custom"* (judul: *"📋 Tarik Antrean Layanan Online"*).
    - 🏨 **Rental Properti:** Menampilkan `🏨 {nama_kamar}` & teks *"Unit Kamar / Properti"* (judul: *"🏨 Tarik Reservasi Properti / Kamar"*).
    - 📦 **Rental Alat & Barang:** Menampilkan `📦 {nama_alat}` & teks *"Unit Alat / Barang"* (judul: *"📦 Tarik Pesanan Sewa Alat & Barang"*).
    - 🚗 **Rental Kendaraan:** Menampilkan `🚗 {nama_kendaraan}` & teks *"Armada Kendaraan"* (judul: *"🚗 Tarik Pesanan Sewa Kendaraan / Travel"*).
  - **Pesan Keranjang Kosong Khusus Niche:** Keranjang kosong POS kini adaptif menyebut *"kamar"*, *"alat"*, atau *"armada"* sesuai jenis unit tenant.
  - **Pembersihan Dashboard Jadwal Booking (`/admin/booking`):** Menghapus seluruh ikon rental (`<Car />`, `<Bed />`, `<Key />`) dan istilah sewa pada halaman booking Jasa/Servis, digantikan ikon `<Sparkles />` dan alur status murni jasa (*"Mulai Pengerjaan"*, *"Sedang Dikerjakan"*, *"Siap Diambil / Bayar"*).
  - **Proteksi Rute Antar-Halaman:** Pengalihan URL otomatis (*mutual redirect*) di mana tenant rental yang mengakses `/admin/booking` langsung diarahkan ke `/admin/rental-calendar`, dan tenant jasa yang mengakses `/admin/rental-calendar` langsung diarahkan ke `/admin/booking`.
  - **Normalisasi Deteksi Kategori:** Fungsi `isServiceBusinessCategory` dan `isPureServiceCategory` kini dinormalisasi case-insensitive (`toLowerCase().trim()`) untuk mencegah salah klasifikasi kategori usaha.
- **Keamanan & Secrets Hygiene:**
  - Pembersihan hardcoded VAPID keys pada `lib/webpush.ts`, kini terisolasi sepenuhnya ke environment variables (`NEXT_PUBLIC_VAPID_PUBLIC_KEY` & `VAPID_PRIVATE_KEY`).
- **Penyelarasan Skema Prisma & POS Checkout:**
  - Sinkronisasi field `rentalPaymentType` pada model `Transaction` di `prisma/schema.prisma` dan perbaikan alur checkout sewa/rental di POS kasir.

---

### v2.5.0 - Multi-Vertical Rental, Booking Redesign & Enterprise Light Auth Overhaul (Okt 8, 2026)
- **Multi-Photo Unit Showcase (Neon DB Free Tier Optimized):**
  - Mendukung upload hingga 5 foto per unit untuk kategori Rental Kendaraan, Properti & Kamar, dan Alat/Barang.
  - Kompresi canvas client-side otomatis ke dimensi 640px @ 0.65 quality (~25-35KB/foto) guna melindungi kuota penyimpanan 512MB Neon DB serverless.
  - Pembatasan 1 foto per produk untuk kategori Jasa/Servis dan Retail/F&B.
  - Interactive Photo Showcase di formulir booking publik (`/book/[slug]`) dengan navigasi thumbnail dan carousel.
- **Custom Responsive Selector Dropdown (`/book/[slug]`):**
  - Menggantikan elemen native HTML `<select>` dengan Custom React Dropdown Selector yang terkunci presisi 100% pada kontainer kartu (`w-full max-w-full`).
  - Mengeliminasi bug OS popup browser di mana nama armada yang panjang membentang melebar keluar batas kartu di mobile dan desktop.
  - Teks nama unit kini membungkus rapi (`break-words line-clamp-2`) dilengkapi thumbnail foto unit dan harga terformat.
- **Resilient Auth & Logout Lifecycle:**
  - Mengeliminasi error runtime `useUser can only be used within the <ClerkProvider />` saat proses sign-out dengan meneruskan parameter `tenantId` langsung ke `usePendingBookingCount`.
  - Penanganan graceful fallback pada `BottomNav` dan `Sidebar` yang aman dari unmounting session Clerk.
- **Enterprise Light Theme Auth Overhaul (`/sign-in` & `/sign-up`):**
  - Mengubah halaman otentikasi menjadi **Modern Executive Light SaaS Theme** berstandar Stripe & Shopify POS.
  - **Header 3D Modern & Ringan (Mobile):** Menggunakan Pure CSS layered elevation (`rounded-3xl`, drop shadow, dan emblem logo 3D resmi) tanpa dependensi library eksternal.
  - **All-in-One 5 Sektor Usaha (Mobile):** Grid 5 kolom presisi (`grid-cols-5`) menampilkan seluruh 5 pilar usaha (**Rental**, **Properti**, **Alat**, **F&B**, **Retail**) serentak tanpa perlu digeser.
  - **Presisi Form di Tengah Layar:** Formulir login/daftar Clerk berposisi dead-center (`my-auto`) di perangkat mobile.
  - **Distraction-Free Dedicated Auth:** Menghapus tombol keluar "← Beranda" sesuai kaidah UX aplikasi POS/ERP enterprise untuk mencegah kebingungan staf kasir.
- **Multi-Tenant Isolation Verification:**
  - Seluruh query database di API, POS, Kalender, Produk, dan Reservasi terisolasi 100% berdasarkan `tenant.userId` & `employee.tenantId`, menjamin data tidak bocor antar tenant.

---
### v2.0.1 - Jasa/Servis Template & UX Fixes (Sep 19, 2026)
- **Template Excel**: 2 sheet terpisah "Jasa" + "Sparepart" (download & export)
- **biayaModal field**: Jasa murni pakai biaya modal/bahan (opsional), Sparepart pakai HPP
- **Stok unlimited**: Jasa murni stock=999999, sembunyikan badge stok di UI
- **Onboarding simplified**: Hapus step "Info Toko" (redundan dengan signup), tinggal Printer → Produk/Import
- **Vertical isolation**: `isPureJasa` guard di API & UI, no cross-contamination

---
*Dibangun dengan ❤️ oleh Tim PJTECH.*


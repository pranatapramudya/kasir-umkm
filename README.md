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

- **Production-Ready Enterprise Architecture:** Siap menangani skalabilitas dengan mitigasi *database connection pooling*, perlindungan *webhook* autentikasi Clerk (sinkronisasi penghapusan akun otomatis ke DB), dan arsitektur *multi-tenant* yang ketat.
- **Sistem Pembayaran & Subscription Dinamis:** Terintegrasi dengan payment gateway (Mayar) via webhook untuk aktivasi otomatis paket langganan (Pro 1 Bulan, 6 Bulan, 1 Tahun) secara real-time, beserta alur pendaftaran *Manual ACC* yang dikelola via Dasbor Superadmin.
- **Optimasi SEO & UI Enterprise:** Injeksi SEO pada *Landing Page* untuk pencarian organik maksimal, dipadukan dengan desain *glassmorphism* modern, profesional, dan responsif.
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
- **Progressive Web App (PWA) Ready:** *Installable on mobile devices with standalone full-screen experience.* Dapat diinstal di homescreen perangkat Android & iOS, berjalan layaknya aplikasi native.
- **Real-Time Web Push Notifications:** *Instant alerts for new bookings without native app overhead.* Owner & Super Admin mendapat notifikasi push saat ada booking baru, bahkan saat browser ditutup.
- **Universal Web Bluetooth Printing:** *Direct ESC/POS thermal receipt printing from the browser.* Cetak struk nirkabel secara langsung via Bluetooth tanpa driver atau aplikasi tambahan.
- **Dynamic Multi-Tenant Booking & Unduh Tiket HD:** *Self-service appointment & date-range scheduling dengan Anti-Double Booking guard.* Setiap tenant memiliki halaman booking publik (`/book/[slug]`) dengan validasi slot kalender interaktif secara real-time, perlindungan *browser autofill duplicate*, dan generator tiket digital beresolusi tinggi menggunakan `html2canvas-pro` (dukungan penuh Tailwind CSS v4 `oklch`).

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
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Mayar Webhook Secret (Dapatkan dari dashboard Mayar - Developer > Webhooks)
MAYAR_WEBHOOK_SECRET=your_mayar_webhook_secret_here
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
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di *browser* Anda untuk melihat hasilnya. Rute utama *landing page* dan kasir berada di `/`, dan rute manajemen admin (terproteksi) berada di `/admin`.

---
*Dibangun dengan ❤️ oleh Tim PJTECH.*


# PJTECH KASIR UMKM - SaaS Boilerplate

PJTECH KASIR UMKM adalah sistem Point of Sales (POS) komprehensif berbasis SaaS (Software as a Service) yang dirancang khusus untuk memenuhi kebutuhan berbagai jenis bisnis: **F&B (Restoran/Kafe), Retail, Jasa/Servis, dan Rental & Travel**. 
Dibangun dengan fokus pada kecepatan, keamanan multi-tenant tingkat enterprise, dan antarmuka *Mobile-First*, boilerplate ini siap digunakan sebagai fondasi proyek SaaS skala besar.

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

- **Production-Ready Architecture:** Siap menangani skalabilitas dengan mitigasi *database connection pooling*, perlindungan *webhook* autentikasi Clerk (sinkronisasi penghapusan akun otomatis ke DB), dan arsitektur *multi-tenant* yang ketat.
- **Sistem Pembayaran & Subscription Dinamis:** Terintegrasi dengan payment gateway (Mayar) via webhook untuk aktivasi otomatis paket langganan (Pro 1 Bulan, 6 Bulan, 1 Tahun) secara real-time, beserta alur pendaftaran *Manual ACC* yang dikelola via Dasbor Superadmin.
- **Optimasi SEO & UI Nasional:** Injeksi SEO pada *Landing Page* untuk pencarian organik maksimal, dipadukan dengan desain *glassmorphism* modern dan responsif.
- **Dukungan Multi-Bisnis:** Logika dinamis untuk bisnis Retail (barang fisik), F&B (manajemen meja & pesanan), hingga Jasa/Servis (tanpa batas stok).
- **Role-Based Access Control (RBAC):** Pemisahan hak akses ketat antara *Owner/Superadmin* dan *Karyawan/Kasir* menggunakan proteksi route tingkat server (Middleware & API), termasuk halaman panduan khusus karyawan.
- **Manajemen Karyawan & Sistem Komisi:** Pelacakan performa staf dan kalkulasi komisi otomatis berdasarkan transaksi yang diselesaikan (sangat cocok untuk bisnis Jasa/Salon/Bengkel).
- **Manajemen Meja (Dining Table):** Visualisasi ketersediaan dan status meja secara real-time untuk bisnis F&B.
- **Keamanan Transaksi & Data (Soft Delete):** Menggunakan flag `isActive` pada produk untuk menjaga integritas data historis transaksi (mencegah isu *Time-of-Check to Time-of-Use / TOCTOU*).
- **Point of Sales (POS) Responsif:** Antarmuka Kasir *Mobile-First* yang lancar digunakan pada tablet atau *smartphone*, dilengkapi fitur keranjang dan kalkulasi diskon otomatis.
- **Dasbor Analitik Dinamis:** Perhitungan *real-time* untuk Laba Bersih, Pendapatan, dan Riwayat Transaksi berdasarkan HPP (Harga Pokok Penjualan).
- **Ekspor Data Excel Dinamis (Dynamic Excel Export):** Laporan otomatis menyesuaikan kolom dengan jenis kategori bisnis (F&B, Retail, Jasa, Rental) sehingga riwayat penjualan rapi tanpa kebocoran data.
- **Progressive Web App (PWA) Ready:** *Installable on mobile devices with standalone full-screen experience.* Dapat diinstal di homescreen perangkat Android & iOS, berjalan layaknya aplikasi native.
- **Real-Time Web Push Notifications:** *Instant alerts for new bookings without native app overhead.* Owner & Super Admin mendapat notifikasi push saat ada booking baru, bahkan saat browser ditutup.
- **Universal Web Bluetooth Printing:** *Direct ESC/POS thermal receipt printing from the browser.* Cetak struk nirkabel secara langsung via Bluetooth tanpa driver atau aplikasi tambahan.
- **Dynamic Multi-Tenant Booking (Rental & Travel/Jasa):** *Self-service appointment & date-range scheduling dengan Anti-Double Booking guard.* Setiap tenant memiliki halaman booking publik (`/book/[slug]`) dengan validasi slot kalender interaktif secara real-time.

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

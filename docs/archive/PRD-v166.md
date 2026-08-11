# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.66
**Fokus:** Silicon Valley UI/UX Revamp & 100% Production-Ready Audit

## 1. Objektif
Bertindaklah sebagai **Staff Engineer & Lead UI/UX Designer di Silicon Valley**. Anda ditugaskan untuk menyempurnakan Landing Page agar terlihat seperti SaaS berkelas internasional (selevel Vercel/Stripe) DAN melakukan audit infrastruktur mutlak sebelum aplikasi ini di-*deploy* ke Production.

## 2. Instruksi Eksekusi: Fase 1 - Silicon Valley UI/UX Revamp
Tampilan *Landing Page* saat ini terlalu kaku dan kosong. Lakukan perombakan visual pada `app/page.tsx` (atau file Landing Page utama). DILARANG memberikan output kode mentah panjang, berikan poin perubahannya terlebih dahulu.
*   **Injeksi Product Showcase:** Tambahkan gambar *mockup* dashboard atau antarmuka mesin kasir yang melayang (*floating/isometric*) di latar belakang atau di sebelah kiri. Jika tidak ada aset gambar, gunakan komponen UI tiruan (seperti *card* analitik kecil) yang disusun secara *bento-grid* sebagai pemanis visual.
*   **Efek Glassmorphism & Depth:** Ubah *Login Card* (kartu Selamat Datang) menjadi elemen *glassmorphism* (latar belakang semi-transparan, `backdrop-blur-md`, dengan *border* sangat tipis `border-white/20`) dipadukan dengan *drop shadow* yang lembut dan luas.
*   **Tipografi Premium:** Pastikan judul utama menggunakan *tracking* (spasi huruf) yang lebih rapat (`tracking-tight`) dan gunakan font modern (misal: Inter atau Geist jika tersedia). Buat warna teks gradasi (*text-transparent bg-clip-text bg-gradient-to-r*) pada kata "PJTECH KASIR" agar menonjol.

## 3. Instruksi Eksekusi: Fase 2 - Hardcore Deployment Audit (Kritis!)
Lakukan inspeksi mental dan periksa arsitektur sistem saat ini. Jawab dan berikan solusi jika ada satu saja dari poin di bawah ini yang belum siap untuk *Production deployment* (seperti Vercel):
*   **Vektor A: Serverless Database Connection Exhaustion (Prisma + Neon):** Di *serverless environment*, setiap *request* memicu koneksi baru. Apakah `DATABASE_URL` di konfigurasi Prisma sudah menggunakan mekanisme *Connection Pooling* (seperti menambahkan `?pgbouncer=true` atau menggunakan koneksi *pooler* khusus dari Neon)? Jika tidak, aplikasi akan langsung *Crash* saat *traffic* naik.
*   **Vektor B: TypeScript & Build Errors:** Lakukan *dry-run* secara mental. Apakah ada tipe data `any` yang terlewat atau variabel tidak terdefinisi di komponen Kasir/Dashboard yang akan membuat proses `npm run build` GAGAL? (Next.js sangat ketat saat proses *build* production).
*   **Vektor C: Environment Variables (Keys):** Apakah sistem sudah memisahkan penanganan *Publishable Key* dan *Secret Key* dari Clerk dan *Database*? Apakah ada potensi kunci rahasia bocor ke *client-side* (tidak menggunakan *prefix* `NEXT_PUBLIC_`)?
*   **Vektor D: Middleware Edge Limits:** Apakah `middleware.ts` melakukan kueri berat yang tidak diizinkan di Edge Runtime Next.js? (Prisma ORM biasa tidak bisa berjalan di Edge Runtime, harus menggunakan konfigurasi khusus atau *fetch* standar).

## 4. Format Laporan yang Diharapkan
1.  **Rencana Rombak Visual:** Jelaskan kelas Tailwind apa saja yang akan disuntikkan untuk mengubah tampilan menjadi *Silicon Valley standard*.
2.  **Laporan Audit Deployment (Go/No-Go):** Nyatakan status kesiapan sistem (LULUS/GAGAL) pada setiap vektor infrastruktur di atas, dan berikan kode/konfigurasi perbaikannya.
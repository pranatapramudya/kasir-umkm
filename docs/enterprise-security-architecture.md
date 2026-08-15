# Enterprise Security Architecture: PJTECH KASIR UMKM

Dokumen ini merangkum lapisan-lapisan keamanan tingkat tinggi (*enterprise-grade*) yang telah diimplementasikan dalam arsitektur aplikasi PJTECH KASIR UMKM. Aplikasi SaaS ini didesain agar tahan terhadap berbagai bentuk serangan, baik dari sisi kebocoran data (*data leakage*), penyalahgunaan sesi (*session hijacking*), maupun serangan infrastruktur (DDoS & Brute Force).

## 1. Multi-Tenant Data Isolation (Logika API)
Aplikasi melayani empat pilar bisnis yang berbeda (Retail, F&B, Jasa, dan Rental) dalam satu ekosistem SaaS. Keamanan data mutlak dijamin dengan isolasi *multi-tenant* yang ketat pada setiap lapis *backend*.

- **Penyaringan Berbasis Kepemilikan (`tenantId`/`userId`)**: Seluruh *endpoint* API (termasuk Transaksi, Booking, Layanan, Karyawan, Armada, Tenant Slug, hingga Analitik Laporan) HARUS melalui proses verifikasi sesi melalui Clerk (`useAuth()`).
- **Validasi Karyawan ke Pemilik Toko**: Jika sesi berasal dari seorang karyawan/kasir, API akan secara otomatis mengarahkan koneksi dan *query database* menuju identitas pemilik (`tenantId` dari entitas *Employee*) dan HANYA mengambil data yang direlasikan dengan `tenantId` tersebut. 
- **Kebocoran Nol Persen**: Tidak ada satu pun rute API Prisma `findMany`, `create`, `update`, atau `delete` yang tereksekusi tanpa klausul `where: { userId: activeTenantId }`. Hal ini mengamankan dari potensi ID-enumeration dan data silang antar-toko.

## 2. Database Hardening (Supabase RLS)
Meskipun aplikasi menggunakan Prisma yang beroperasi menggunakan koneksi super-klien (*postgres pooler*), kita wajib mengantisipasi kebocoran kunci akses yang dapat membuka akses *direct query* via REST/GraphQL API publik bawaan Supabase.

- **Aktivasi Row Level Security (RLS)**: RLS telah diaktifkan di seluruh 10 tabel inti aplikasi (`Tenant`, `Employee`, `Transaction`, `Booking`, `product`, dll).
- **Zero-Trust Public Policy**: Terdapat skrip `supabase-rls.sql` dengan kebijakan yang menyatakan: `CREATE POLICY "Deny All" ON "TableName" FOR ALL USING (false);`.
- **Hasil**: Akses publik yang menggunakan *anon key* akan menemui jalan buntu. Satu-satunya entitas yang diizinkan mengakses dan memodifikasi *database* hanyalah *server* internal Next.js (Prisma API) kita.

## 3. Anti-DDoS & Brute Force (Vercel Edge Middleware)
Untuk menangkal serangan bot spam, *brute force* API, maupun hantaman DDoS yang dapat meningkatkan tagihan *server*, sistem ini menerapkan pertahanan di garis terdepan komputasi: Edge Network.

- **In-Memory Rate Limiting**: Algoritma Token Bucket diimplementasikan secara natif tanpa Redis melalui `middleware.ts`.
- **Aturan Pembatasan**: Semua *request* menuju rute `/api/*` dipantau per-*Isolate*. Jika sebuah alamat IP (yang dilacak dari *header* `x-forwarded-for` atau `x-real-ip`) melakukan *request* lebih dari **60 kali dalam 1 menit**, Middleware akan memutuskan koneksi di Edge dan mengembalikan status **HTTP 429 (Too Many Requests)** sebelum beban sempat mencapai komputasi utama (API/Serverless).

## 4. Session Management (Keamanan Berlapis di Klien)
Sistem manajemen sesi dirancang agar kokoh menghadapi *malware*, *phishing*, dan kecerobohan perangkat pengguna.

- **HttpOnly Secure Cookies (Via Clerk)**: Token otentikasi JWT dikelola penuh oleh infrastruktur Clerk. Token ini bersifat absolut: `HttpOnly: true` (memblokir pencurian oleh JavaScript perusak) dan ditransmisikan hanya via HTTPS (`Secure`). Selain itu, pengaturan *SameSite: Lax/Strict* mengamankan aplikasi dari Cross-Site Request Forgery (CSRF).
- **Multi-Factor Authentication (MFA)**: Komponen `<UserProfile />` diintegrasikan dalam UI pengaturan (`/admin/settings/security`), memungkinkan pemilik bisnis (*Owner*) mengamankan dompet penghasilannya dari pembobolan (*Phishing*) dengan Autentikator 2-Langkah.
- **Custom Client-Side Inactivity Guard**: Untuk mem-bypass layanan Pro dari Clerk, aplikasi memasang komponen cerdik (`SessionTimeoutGuard`) di akar aplikasi (`app/layout.tsx`). Komponen memantau pergerakan fisik secara hemat memori (maks 1 rekaman per menit) ke `localStorage`. Jika perangkat kasir mati/tertinggal lebih dari 24 Jam, *background job* otomatis akan menghancurkan sesi (`signOut`) secara mandiri, melindunginya dari *unauthorized physical access*.

---
*Dokumen ini merupakan referensi resmi untuk Audit Keamanan PJTECH KASIR UMKM. (Update: Agustus 2026).*

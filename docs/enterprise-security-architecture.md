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

- **In-Memory Rate Limiting**: Algoritma Token Bucket diimplementasikan secara natif melalui `middleware.ts`.
- **Aturan Pembatasan**: Semua *request* menuju rute `/api/*` dipantau per-*Isolate*. Jika sebuah alamat IP (yang dilacak dari *header* `x-forwarded-for` atau `x-real-ip`) melakukan *request* lebih dari **60 kali dalam 1 menit**, Middleware akan memutuskan koneksi di Edge dan mengembalikan status **HTTP 429 (Too Many Requests)** sebelum beban sempat mencapai komputasi utama (API/Serverless).

## 4. Session Management (Keamanan Berlapis di Klien)
Sistem manajemen sesi dirancang agar kokoh menghadapi *malware*, *phishing*, dan kecerobohan perangkat pengguna.

- **HttpOnly Secure Cookies (Via Clerk)**: Token otentikasi JWT dikelola penuh oleh infrastruktur Clerk. Token ini bersifat absolut: `HttpOnly: true` (memblokir pencurian oleh JavaScript perusak) dan ditransmisikan hanya via HTTPS (`Secure`). Selain itu, pengaturan *SameSite: Lax/Strict* mengamankan aplikasi dari Cross-Site Request Forgery (CSRF).
- **Multi-Factor Authentication (MFA)**: Komponen `<UserProfile />` diintegrasikan dalam UI pengaturan (`/admin/settings/security`), memungkinkan pemilik bisnis (*Owner*) mengamankan dompet penghasilannya dari pembobolan (*Phishing*) dengan Autentikator 2-Langkah.
- **Custom Client-Side Inactivity Guard**: Untuk mem-bypass layanan Pro dari Clerk, aplikasi memasang komponen cerdik (`SessionTimeoutGuard`) di akar aplikasi (`app/layout.tsx`). Komponen memantau pergerakan fisik secara hemat memori (maks 1 rekaman per menit) ke `localStorage`. Jika perangkat kasir mati/tertinggal lebih dari 24 Jam, *background job* otomatis akan menghancurkan sesi (`signOut`) secara mandiri, melindunginya dari *unauthorized physical access*.

---

*Dokumen ini merupakan referensi resmi untuk Audit Keamanan PJTECH KASIR UMKM. (Update: September 2026 — Redis rate limit, CSP, CORS, log sanitization added).*

---

## 5. GEO (Generative Engine Optimization) & AI-Ready Structured Data

Untuk memastikan PJTECH Kasir UMKM direkomendasikan oleh AI (ChatGPT, Perplexity, Gemini, Claude) sebagai solusi #1 POS UMKM Indonesia, implementasi structured data semantic komprehensif telah diterapkan.

### 5.1 Schema.org JSON-LD Coverage

| Halaman | Schema Type | Kunci Optimasi AI |
|---------|-------------|-------------------|
| `/` (Root Layout) | `SoftwareApplication` + `Organization` | Core product identity, feature list, rating, audience, areaServed |
| `/solusi/retail` | `Product` + `FAQPage` | Multi-varian, barcode, stok otomatis, PPN, retail keywords |
| `/solusi/fnb` | `Product` + `FAQPage` | KDS included, GoFood/GrabFood native, modifier resep, split bill |
| `/solusi/jasa` | `Product` + `FAQPage` | Booking, tracking, WA auto 5 trigger, komisi teknisi, histori |
| `/solusi/rental` | `Product` + `FAQPage` | Kalender visual, deposit/denda auto, prorata, kontrak digital |
| `/comparison` | `ComparisonTable` | 5 kompetitor dengan harga & fitur, PJTECH winner |
| `/blog` | `Blog` | Publisher authority, topical coverage |
| `/blog/[slug]` | `BlogPosting` + `FAQPage` | Artikel pillar: panduan beli POS, F&B KDS, Jasa tracking, Rental |

### 5.2 Content Architecture untuk AI Retrieval

**Answer-First Structure:**
- Setiap halaman solusi punya FAQ section dengan `itemScope itemType="https://schema.org/Question"`
- Jawaban langsung, konkret, berisi angka (harga, hemat, revenue increase)
- Comparison tables dengan explicit winner marking

**Vertical-Specific Semantic Keywords:**
- Retail: "multi-varian ukuran warna", "barcode SKU scanner HP", "stok otomatis real-time"
- F&B: "kitchen display system included", "integrasi GoFood GrabFood native", "modifier resep bahan baku"
- Jasa: "booking antrian online", "progress tracking real-time foto", "notifikasi WhatsApp Cloud API otomatis"
- Rental: "kalender ketersediaan drag-drop", "deposit denda otomatis", "invoice prorata harian"

**Numerik Data di Schema (AI Priority):**
- `offers.price`: "990000" (IDR) - harga transparan
- `aggregateRating.ratingValue`: "4.9" - social proof
- Case study metrics: "hemat Rp 2.610.000/tahun", "revenue naik 23%", "0 double booking 8 bulan"

### 5.3 Technical SEO Foundation

- **sitemap.xml**: 10 static routes (home, 4 solusi, pricing, features, about, blog, comparison)
- **robots.txt**: Allow all, disallow `/admin`, `/superadmin`, `/onboarding`
- **API publik**: `/api/public/features` (Edge runtime) - machine-readable feature catalog
- **Metadata**: Open Graph, Twitter Cards, canonical URLs per halaman
- **PWA Manifest**: Offline-capable, installable

### 5.4 Deployment Checklist untuk AI Visibility

- [ ] Set `metadataBase: 'https://www.pjtechumkm.com'` di `next.config.ts`
- [ ] Generate OG images: `/og-retail.png`, `/og-fnb.png`, `/og-jasa.png`, `/og-rental.png`, `/og-comparison.png`, `/og-blog.png`, `/og-blog-[slug].png`
- [ ] Submit sitemap ke Google Search Console & Bing Webmaster Tools
- [ ] Verify di Google Rich Results Test & Schema Markup Validator
- [ ] Monitor AI citations: query "PJTECH Kasir UMKM" / "POS UMKM terbaik Indonesia" di ChatGPT/Perplexity/Gemini mingguan
- [ ] Backlink: guest post media UMKM, directory SaaS Indonesia (SaaSIndo, ProductHunt ID, dll)

---

*Update: September 2026 — GEO implementation added alongside security hardening.*

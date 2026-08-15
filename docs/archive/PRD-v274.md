# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.74
**Fokus:** Enterprise Security Hardening (Supabase RLS, Rate Limiting, & Env Audit)

## 1. Analisis Masalah (Security Vulnerability)
Meskipun filter *tenantId* telah diterapkan di level aplikasi (Next.js API), arsitektur *database* masih memiliki celah. Terdapat peringatan keamanan mengenai **Publicly Accessible Tables** di *dashboard* Supabase (seperti pada *instance* `pranajayatech`). Ini berarti *hacker* dapat membypass aplikasi dan melakukan *query* langsung ke *database*. Selain itu, API saat ini rentan terhadap serangan *Brute Force* dan DDoS karena tidak ada pembatasan jumlah *request*.

## 2. Instruksi Eksekusi (Database Security & Edge Middleware)
**Target File:** Skrip Migrasi SQL (Supabase RLS), `middleware.ts` (Next.js), dan Audit `.env`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kunci Database via Row Level Security (RLS) Supabase:**
1. Buat skrip SQL atau perbarui konfigurasi *schema* Prisma/Supabase Anda untuk **MENGAKTIFKAN RLS (Enable RLS)** pada seluruh tabel utama (Transaksi, Produk, Layanan, Armada, Karyawan, Toko).
2. Buat *Security Policies* (Kebijakan Keamanan) yang ketat untuk operasi SELECT, INSERT, UPDATE, dan DELETE. 
3. *Aturan Policy:* Setiap akses data HARUS divalidasi bahwa `auth.uid()` (atau mekanisme otentikasi kustom Anda) cocok dengan *tenant/owner* dari baris data tersebut. Tidak ada lagi tabel yang bersifat *Publicly Accessible* tanpa otentikasi token yang valid.

**B. Pasang Tameng Rate Limiting (Anti-DDoS):**
1. Buka atau buat file `middleware.ts` di dalam proyek Next.js Anda (Edge Middleware).
2. Terapkan logika **Rate Limiting** berdasarkan IP Address untuk melindungi seluruh jalur `/api/*`.
3. Anda dapat menggunakan `Upstash Redis` (rekomendasi standar Vercel) atau mekanisme *rate-limiting* berbasis memori/algoritma *token bucket* yang ringan.
4. *Batas Aman:* Set maksimal 60 *request* per menit untuk setiap IP. Kembalikan status HTTP `429 Too Many Requests` jika melampaui batas.

**C. Audit Environment Variables (Anti-Kebocoran Kunci Rahasia):**
1. Lakukan pemindaian otomatis di seluruh kode klien (`/app` client components).
2. Pastikan **TIDAK ADA** *credential* rahasia (seperti `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, atau token API eksternal) yang menggunakan prefix `NEXT_PUBLIC_`. 
3. Kunci rahasia hanya boleh dipanggil di rute API (Backend/Server components).

Silakan eksekusi ketiga lapis pertahanan ini sekarang! Lapor jika RLS sudah aktif dan Middleware sudah menahan trafik berlebih!
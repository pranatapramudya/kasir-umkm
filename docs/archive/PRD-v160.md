# Product Requirements Document: PJTECH KASIR POS (LumeStack SaaS)
**Versi:** 0.1.60
**Fokus:** Pembuatan "Command Center" Super Admin (MVP) Sekaligus Jadi

## 1. Analisis Kebutuhan Super Admin
Sebagai sebuah *SaaS boilerplate*, sistem membutuhkan *dashboard* induk (Super Admin) untuk memantau metrik global (lintas *tenant*). Untuk menjaga prinsip MVP yang *user-friendly* dan minim risiko, *dashboard* ini akan difokuskan pada agregasi data (Read-Only) dan diamankan dengan proteksi *route* tingkat tinggi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Bangun ekosistem Super Admin secara *end-to-end* (Route, UI, dan Security) dalam satu kali eksekusi. DILARANG memberikan *output* kode mentah.

### A. Proteksi Keamanan Akses (Route Guard)
*   **Target File:** *Middleware* utama (jika menggunakan Clerk: `middleware.ts`) ATAU pada *layout/page* Super Admin.
*   **Instruksi:**
    1. Buat *route* baru: `app/superadmin/page.tsx` beserta *layout*-nya (agar tidak tercampur dengan *sidebar* klien).
    2. Lindungi *route* `/superadmin` secara mutlak. 
    3. Buat pengecekan: Hanya pengguna dengan alamat email spesifik (atau Role "SUPERADMIN" dari *metadata* Clerk/DB) yang diizinkan masuk. Jika *user* biasa (Admin Toko/Kasir) mencoba mengakses URL ini, langsung *redirect* (lempar) mereka kembali ke `/dashboard` atau halaman 403 Forbidden.

### B. UI / UX Dashboard Super Admin (User-Friendly)
*   **Target File:** `app/superadmin/page-client.tsx` (atau *Server Component* jika langsung *fetch* DB).
*   **Instruksi Layout (Gunakan Tailwind & Shadcn/UI jika ada):**
    1. **Header/Navigasi:** Tampilkan judul "LumeStack Command Center" dengan tampilan bersih.
    2. **KPI Cards (Top Level):** Buat 3 Kartu Ringkasan di bagian atas:
       - **Total Tenant/Toko:** (Hitung jumlah baris di tabel `Tenant` atau `User`).
       - **Total Pengguna Terdaftar:** (Hitung jumlah seluruh *user* termasuk karyawan).
       - **Kategori Terpopuler:** (Hitung kategori bisnis apa yang paling banyak didaftarkan, misal: Jasa / Retail / F&B).
    3. **Tabel Induk (Master Data Tenant):** Buat tabel informatif di bawah kartu KPI dengan kolom berikut:
       - `Nama Toko / Usaha`
       - `Kategori`
       - `Nomor Telepon`
       - `Tanggal Mendaftar` (Tampilkan format waktu yang rapi).
       - `Status Langganan` (Misal: "Trial", "Pro 6 Bulan", "Pro Tahunan").

### C. Logika Backend (Prisma Data Aggregation)
*   **Target File:** Fungsi *fetch* di dalam halaman Super Admin atau via API Route internal.
*   **Instruksi Kueri:**
    1. Lakukan kueri Prisma (misal: `prisma.tenant.findMany()`) TANPA filter `userId`, karena Super Admin berhak melihat **SEMUA** data dari semua *tenant*.
    2. Lakukan kueri *count* agregasi untuk mengisi angka pada KPI Cards.
    3. Pastikan pengembalian data sangat cepat dan tidak memuat relasi yang tidak perlu (seperti data transaksi harian tiap toko, cukup profil tokonya saja).

Silakan eksekusi seluruh instruksi ini sekaligus. Bangun halaman Super Admin yang bersih, elegan, dan terproteksi maksimal!
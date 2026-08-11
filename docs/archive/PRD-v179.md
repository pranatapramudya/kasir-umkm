# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.79
**Fokus:** Generasi Dokumentasi Sistem & Arsitektur (Documentation Engineering)

## 1. Objektif
Sebagai aplikasi SaaS *boilerplate* premium, PJTECH KASIR membutuhkan rekam jejak arsitektur dan panduan sistem yang terstruktur untuk calon pengembang/pembeli *source code*. 

**PENTING:** DILARANG KERAS memindahkan, memecah, atau merestrukturisasi folder kode sumber utama (`app`, `components`, `lib`, dll). Pemisahan *frontend/backend* HANYA berlaku untuk pembuatan struktur file *Markdown* di dalam folder `docs/`.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Buat file dokumentasi teknis komprehensif berdasarkan hasil audit skalabilitas dan perombakan UI sebelumnya.

### A. Setup Struktur Folder Docs
*   Buat sub-folder di dalam direktori `docs/` (jika belum ada):
    *   `docs/frontend/`
    *   `docs/backend/`

### B. Generate Dokumen Backend (Arsitektur & Keamanan)
*   **Target File:** Buat file `docs/backend/ARCHITECTURE_AUDIT.md`
*   **Isi Dokumen:** Rangkum seluruh penambalan arsitektur yang telah dilakukan:
    1.  **Multi-Tenant Isolation:** Penjelasan penggunaan `userId` pada mutasi Prisma untuk mencegah *Data Bleed* (TOCTOU Patch).
    2.  **Concurrency & N+1 Query:** Penjelasan bagaimana transaksi dieksekusi menggunakan `Promise.all` di luar *looping*.
    3.  **Serverless Vercel Limits:** Strategi penggunaan Prisma Aggregate `groupBy` dan `_sum` untuk menghindari *Out-Of-Memory* (OOM) pada API Analytics.

### C. Generate Dokumen Frontend (UI/UX & Logika Client)
*   **Target File:** Buat file `docs/frontend/UI_UX_GUIDE.md`
*   **Isi Dokumen:** Rangkum pendekatan antarmuka sistem:
    1.  **Landing Page:** Penjelasan desain *Split Screen*, efek *Glassmorphism*, *Mesh Gradient*, dan tautan *stealth backdoor* Superadmin.
    2.  **Superadmin Dashboard:** Standar *Data-dense UI* (UI padat/compact), penggunaan filter pencarian, *pagination*, dan metrik Omset Bulan Berjalan.
    3.  **Idempotency (Anti-Spam):** Penjelasan implementasi *state* `isSubmitting` / *Debouncing* pada tombol Checkout Kasir untuk mencegah duplikasi *order*.

Silakan hasilkan kedua file Markdown tersebut dengan format yang sangat rapi, profesional, dan layak jual!
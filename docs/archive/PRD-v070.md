# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.70
**Fokus:** HOTFIX - Prisma Client Undefined Method ('create') pada Server Action

## 1. Analisis Bug Kritis (P0 Blocker)
*   **Gejala:** Terjadi *Runtime Error* dengan pesan `Cannot read properties of undefined (reading 'create')` pada file `app/onboarding/actions.ts`.
*   **Akar Masalah:** Aplikasi gagal menemukan metode `.create()`. Dalam konteks penyimpanan *database*, ini membuktikan bahwa pemanggilan objek Prisma (misalnya `prisma.tenant` atau `prisma.store`) mengembalikan nilai `undefined`. Hal ini disebabkan oleh *import* Prisma yang salah, kesalahan penulisan nama model (Casing), atau *instance* Prisma tidak diekspor dengan benar.
*   **Konteks Aplikasi:** Ingat, ini adalah pengembangan PJTECH KASIR POS, sebuah sistem SaaS *Multi-tenant* riil, BUKAN sekadar LumeStack standar. Logika *database* harus mutlak presisi.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
Sebagai agen pengembang, jangan membuat alasan. Perbaiki sintaks di `app/onboarding/actions.ts` secara mutlak dengan mengikuti panduan arsitektur berikut.

### A. Koreksi Import Prisma Client
*   **Target File:** `app/onboarding/actions.ts`
*   **Instruksi Eksekusi:**
    1. Periksa bagian paling atas file tersebut.
    2. Pastikan Anda melakukan *import instance* Prisma menggunakan *Named Import* yang merujuk pada *singleton* lokal kita (seperti perbaikan di PRD sebelumnya), BUKAN dari `@prisma/client` langsung.
    3. Sintaks yang benar: `import { prisma } from "@/lib/prisma";` (Sesuaikan *path* jika `lib/prisma` berada di direktori lain, yang pasti HARUS *named import* `{ prisma }`).

### B. Koreksi Casing Model Prisma
*   **Instruksi Eksekusi:**
    1. Periksa baris kode tempat Anda memanggil fungsi *create*.
    2. Jika Anda membuat model dengan nama `Tenant` di `schema.prisma`, maka pemanggilannya di JavaScript/TypeScript WAJIB menggunakan huruf kecil semua di awal: `prisma.tenant.create(...)`.
    3. DILARANG KERAS menulis `prisma.Tenant.create(...)` atau salah memanggil model yang belum ada seperti `prisma.store.create(...)`. Perbaiki *casing*-nya sekarang juga.

### C. Instruksi Khusus untuk Pengguna (User Action Required)
*   *Pesan ini ditujukan untuk AI Agent agar mengingatkan pengguna:*
    Setelah Anda (AI) memperbaiki kode di `actions.ts`, Anda WAJIB memberikan instruksi kepada pengguna untuk melakukan sinkronisasi Prisma Client di terminal lokal mereka dengan langkah berikut:
    1. Hentikan server Next.js (Ctrl+C).
    2. Jalankan perintah: `npx prisma db push` (untuk memastikan skema sinkron ke Neon DB).
    3. Jalankan perintah: `npx prisma generate` (untuk memperbarui Prisma Client).
    4. Jalankan kembali: `npm run dev`.
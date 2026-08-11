# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.42
**Fokus:** HOTFIX - Koreksi Paksa Sintaks Import Prisma (Terminal Error)

## 1. Analisis Masalah Kritis (P0 Blocker)
*   **Status:** GAGAL BUILD (Next.js Turbopack).
*   **Penyebab:** AI Agent **TIDAK** menerapkan perbaikan dari instruksi sebelumnya. File `app/api/export/route.ts` di baris ke-3 masih menggunakan *Default Import* (`import prisma from "@/lib/prisma";`), sementara file konfigurasi ekspornya menggunakan *Named Export*. Hal ini menyebabkan *fatal error*: `Export default doesn't exist in target module`.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
**JANGAN membuat asumsi baru. JANGAN merombak logika ekspor excel. HANYA eksekusi instruksi perbaikan sintaks ini secara presisi:**

### A. Koreksi Baris Kode Mutlak (Line-by-Line Fix)
1. Buka file `app/api/export/route.ts`.
2. Arahkan tepat ke **baris ke-3** yang saat ini tertulis:
   `import prisma from "@/lib/prisma";`
3. HAPUS baris tersebut sepenuhnya.
4. GANTI persis menjadi:
   `import { prisma } from "@/lib/prisma";`
   *(Perhatikan penambahan kurung kurawal `{ }` yang mengapit variabel prisma).*

### B. Validasi Terminal (Sanity Check)
*   Simpan file tersebut.
*   Tunggu dan perhatikan log terminal Next.js yang berjalan. 
*   *Error* `Export default doesn't exist` HARUS musnah dari terminal dan status aplikasi wajib kembali menjadi *compiled successfully*.
*   Berikan konfirmasi kepada *User* HANYA JIKA *build error* di terminal sudah benar-benar hilang.
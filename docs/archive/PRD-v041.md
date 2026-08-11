# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.41
**Fokus:** Bugfix Prisma Import Error & Kompatibilitas Unduhan Lintas Perangkat (Mobile & Desktop)

## 1. Analisis Masalah
*   **Build Error (Backend):** Terjadi kesalahan fatal `Export default doesn't exist in target module` pada file `app/api/export/route.ts` di baris ke-3. Hal ini disebabkan oleh ketidakcocokan sintaks *import* ES6 antara *route* dan konfigurasi *singleton* Prisma.
*   **Kebutuhan UX (Frontend):** Fitur pengunduhan file (Excel) harus berfungsi secara universal. Mengandalkan `window.open` atau rute navigasi langsung untuk file biner sering kali gagal di peramban *Mobile* (iOS/Android).

## 2. Instruksi Eksekusi untuk AI Agent
Fokus perbaiki *error import* dan sempurnakan logika penanganan file (*file handling*) di sisi klien (klien-browser).

### A. Perbaikan Sintaks Import Prisma (Backend)
*   **Target File:** `app/api/export/route.ts`
*   **Instruksi:** 
    1. Cari baris: `import prisma from "@/lib/prisma";`
    2. Ubah menjadi *Named Import*: `import { prisma } from "@/lib/prisma";` (Perhatikan kurung kurawalnya).
    3. Jika file konfigurasi Prisma di proyek ini bernama lain atau menggunakan *default export*, periksa file `lib/prisma.ts` terlebih dahulu dan sesuaikan *import*-nya secara akurat agar *build* Next.js (Turbopack) berhasil.

### B. Implementasi Blob Download Otomatis (Frontend)
*   **Target File:** Komponen UI yang memiliki tombol "Unduh Laporan (Excel)" (misal: `app/admin/analytics/page.tsx`).
*   **Instruksi:** Rombak fungsi `onClick` atau *handler fetch* pada tombol unduh. Jangan gunakan navigasi langsung. Terapkan logika penanganan **Blob** dengan standar berikut agar kompatibel dengan peramban Desktop dan Mobile:
    1. Lakukan `fetch` ke *endpoint* API (misal: `/api/export?period=...`).
    2. Konversi respons yang didapat menjadi objek Blob: `const blob = await response.blob();`
    3. Buat URL objek sementara: `const url = window.URL.createObjectURL(blob);`
    4. Buat elemen *anchor* (`<a>`) fiktif di dalam *memory*.
    5. Set `href` elemen *anchor* tersebut dengan URL objek yang dibuat, dan set atribut `download` dengan nama file yang rapi (contoh: `Laporan-PJTECH-${period}.xlsx`).
    6. Eksekusi klik otomatis pada elemen *anchor* tersebut (`a.click()`) untuk memicu dialog penyimpanan file di *device* pengguna.
    7. Bersihkan URL objek dari memori (`window.URL.revokeObjectURL(url)`) setelah pengunduhan selesai.

### C. Validasi Akhir
*   Pastikan terminal Next.js sudah bersih dari *Build Error*.
*   Simulasikan klik tombol Unduh. Aplikasi harus merespons dengan menampilkan *file manager* (di Desktop) atau *prompt download* (di Mobile) yang menyimpan file `.xlsx` secara utuh.
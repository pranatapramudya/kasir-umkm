# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.51
**Fokus:** HOTFIX - ReferenceError isModalOpen is not defined

## 1. Analisis Masalah (P0 Blocker)
*   **Gejala:** Aplikasi mengalami *Runtime ReferenceError* dengan pesan `isModalOpen is not defined` pada file `app/page.tsx` di baris 563.
*   **Penyebab:** Terdapat blok kode JSX untuk "MODAL SUKSES CHECKOUT" yang menggunakan *conditional rendering* `{isModalOpen && (...) }`. Namun, variabel *state* `isModalOpen` belum dideklarasikan di dalam tubuh komponen `POSApp`. AI Agent membuat UI-nya namun lupa membuat *state controller*-nya.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
Fokus perbaiki *ReferenceError* ini dengan menambahkan deklarasi *state* React yang hilang. JANGAN merombak kode lain.

### A. Deklarasi React State yang Hilang
*   **Target File:** `app/page.tsx`
*   **Instruksi Eksekusi:**
    1. Periksa bagian atas file. Pastikan *hook* `useState` sudah di-*import* dari React:
       `import { useState } from 'react';`
    2. Cari deklarasi komponen utama (kemungkinan bernama `export default function POSApp() { ... }`).
    3. Tepat di bagian atas dalam fungsi komponen tersebut (di area tempat *state* lain dideklarasikan, sebelum blok `return`), tambahkan baris wajib ini:
       `const [isModalOpen, setIsModalOpen] = useState(false);`

### B. Validasi Terminal
*   Simpan file tersebut. Periksa log terminal Turbopack/Next.js. 
*   Pesan *error* `isModalOpen is not defined` HUKUMNYA WAJIB hilang dan layar peramban harus kembali memuat halaman Kasir POS secara normal.
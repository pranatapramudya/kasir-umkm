# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.25
**Fokus:** Audit Menyeluruh, Pembaruan UI Header, & Dokumentasi Proyek (README.md)

## 1. Tujuan Siklus (Sprint Goal)
Fase iterasi pengembangan aktif dihentikan sementara. Fokus pada siklus ini adalah melakukan *code-review* mandiri, membersihkan antarmuka dari elemen visual yang tidak perlu, dan menyusun dokumentasi proyek yang komprehensif sebagai *Premium SaaS Boilerplate*.

## 2. Instruksi Eksekusi untuk AI Agent
Jalankan ketiga tugas utama ini secara berurutan dan beritahu pengguna jika sudah selesai seluruhnya.

### A. Penyesuaian UI Header Admin (`app/admin/layout.tsx`)
*   **Hapus Teks Sapaan:** Cari elemen teks "Halo, Admin" di bagian *header* atas dan hapus elemen tersebut sepenuhnya untuk membuat ruang yang lebih bersih.
*   **Modifikasi Tombol "Lihat Kasir":** Ubah pewarnaan (*styling*) pada tombol ini menjadi dominan biru agar lebih menonjol sebagai *Call to Action* utama. Gunakan kelas Tailwind seperti `bg-blue-600 text-white hover:bg-blue-700` atau *outline* biru tebal, sesuai dengan bahasa desain (*design language*) keseluruhan proyek.

### B. Audit Codebase Menyeluruh (Sanity Check)
*   Lakukan pemindaian pada seluruh komponen halaman, *API routes*, dan konfigurasi otentikasi.
*   Bersihkan sisa-sisa *console.log* (kecuali untuk penanganan *error*), hapus komentar kode yang tidak terpakai (dead code), dan pastikan tidak ada *Warning* TypeScript atau linting yang terabaikan.
*   Pastikan struktur Prisma schema sudah rapi dan tersinkronisasi.

### C. Penyusunan `README.md`
*   Hapus isi `README.md` bawaan Next.js dan tulis ulang dari awal.
*   Tulis dengan gaya profesional untuk sebuah produk *Premium SaaS Boilerplate*.
*   **Struktur Wajib README:**
    1.  **Nama Proyek & Deskripsi Singkat:** Penjelasan bahwa ini adalah Boilerplate SaaS Kasir POS UMKM.
    2.  **Tech Stack Utama:** Cantumkan Next.js (App Router), Prisma, PostgreSQL, Clerk (Auth), Tailwind CSS, SWR, dll.
    3.  **Fitur Utama:** Manajemen Produk, Kompresi Gambar Otomatis, Dasbor Analitik Dinamis, Sistem Paywall (Free Trial 14 Hari), Point of Sales responsif (Mobile-first).
    4.  **Cara Menjalankan Lokal (Getting Started):** Instruksi `npm install`, pengaturan `.env.local` (Clerk Keys, Database URL), menjalankan `npx prisma db push`, dan `npm run dev`.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.89
**Fokus:** Favicon Cleanup (Vercel Override) & Modern PWA Install Prompt

## 1. Analisis Masalah
1. **Favicon Bentrok:** Tab browser masih menampilkan logo *default* Vercel (segitiga hitam). Hal ini biasanya disebabkan oleh keberadaan file `favicon.ico` bawaan template di dalam folder `app/` atau `public/` yang belum dihapus.
2. **UX Akuisisi Pengguna:** Klien membutuhkan sebuah *Pop-up/Banner Notifikasi* modern yang muncul secara otomatis untuk mengajak pengguna menginstal aplikasi (PWA) ke perangkat mereka, menggantikan cara manual via menu browser.

## 2. Instruksi Eksekusi (Next.js Metadata & Browser API)
**Target File:** Folder `app/`, folder `public/`, `app/layout.tsx`, dan pembuatan komponen baru (misal: `components/PwaInstallPrompt.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Sapu Bersih Favicon Vercel:**
1. Cari dan **HAPUS** file `favicon.ico` atau `favicon.svg` bawaan Vercel yang berada di folder root, `app/`, maupun `public/`.
2. Gunakan logo 3D terbaru yang diberikan klien. Ganti namanya menjadi `icon.png` dan letakkan di dalam folder `app/` (Next.js App Router akan otomatis menjadikannya favicon global) atau pastikan metadata di `layout.tsx` menunjuk ke file yang benar secara absolut.

**B. Pembuatan Komponen PWA Install Prompt:**
1. Buat sebuah *Client Component* baru yang mendengarkan (*listen*) *event window* bernama `beforeinstallprompt`.
2. Saat *event* tersebut terpicu, tahan *event* bawaannya (`e.preventDefault()`), simpan *state*-nya, dan munculkan UI *Pop-up/Banner* kustom.
3. **Desain UI Pop-up (Tailwind CSS):**
   - Buat desain melayang (bisa *fixed bottom* atau modal di tengah layar) bergaya modern/kaca (*glassmorphism*).
   - Tampilkan Logo 3D PJTECH yang baru, Judul: "Install PJTECH KASIR", dan Deskripsi: "Akses aplikasi lebih cepat tanpa browser."
   - Sediakan 2 tombol: "Nanti Saja" (Tutup notif) dan "Install Sekarang" (tombol utama warna biru/oranye).
4. Jika tombol "Install Sekarang" diklik, eksekusi metode `.prompt()` dari *state* yang disimpan tadi agar dialog instalasi sistem operasi muncul.

**C. Integrasi Global:**
1. Render komponen `PwaInstallPrompt` ini di dalam `app/layout.tsx` agar fitur ini mengawasi pengguna di seluruh halaman aplikasi.

Silakan hapus sisa-sisa Vercel tersebut dan rakit fitur *Install Pop-up* modern ini! Lapor jika semuanya sudah di-*push*.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.67
**Fokus:** Koreksi Rute UI/UX (Pindah Desain ke Root Page)

## 1. Analisis Kesalahan Eksekusi (Bug UI)
*   **Masalah:** Desain "Silicon Valley Revamp" (Split screen, Mesh Gradient, Bento-Grid Showcase) yang Anda buat sebelumnya dieksekusi pada *route* yang salah, yaitu `app/sign-in/[[...sign-in]]/page.tsx`.
*   **Dampak:** Halaman *Landing Page* utama di *root* (`app/page.tsx`) masih menggunakan desain *legacy* (lama) yang terlihat kaku, sehingga pengguna tidak melihat perubahan UI yang dijanjikan saat pertama kali membuka aplikasi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Pindahkan dan terapkan seluruh desain premium tersebut ke *Root Page*. DILARANG memberikan *output* kode mentah panjang, langsung eksekusi ke *codebase*.

### A. Override `app/page.tsx` (Root Landing Page)
*   **Target File:** `app/page.tsx`
*   **Instruksi:**
    1. Ganti total desain `app/page.tsx` yang lama dengan tata letak *Split Screen* yang sudah Anda rancang.
    2. **Bagian Kiri:** Terapkan *Mesh Gradient* radial, tipografi *tracking-tight* dengan `bg-clip-text` pada judul utama, dan *Bento-Grid Showcase* (UI *dummy* kasir/analitik) dengan efek *3D Isometric* (`rotate-y-12 rotate-x-12`).
    3. **Bagian Kanan:** Buat area *Glassmorphism* (`backdrop-blur-2xl bg-white/40`).
    4. **Integrasi Login/Tombol:** Di dalam area *Glassmorphism* tersebut, letakkan tombol pengalihan (misal: "Masuk ke Dashboard") atau panggil komponen `<SignInButton />` dari Clerk agar pengguna bisa langsung masuk dari halaman depan ini.

### B. Pembersihan & Sinkronisasi
*   Pastikan tidak ada konflik logika *redirect* di `app/page.tsx`. Sesuai kesepakatan sebelumnya, halaman ini HARUS bisa diakses oleh pengguna yang belum *login* sebagai etalase produk.
*   Jika *user* sudah *login* dan memiliki *Tenant*, Anda bisa meletakkan tombol "Buka Kasir" besar di halaman ini, atau langsung memuat UI Kasir POS di atas desain ini (sesuaikan dengan logika *routing* terbaik untuk pengalaman SaaS).

Silakan eksekusi pemindahan desain ini ke `app/page.tsx` sekarang juga agar *Landing Page* terlihat premium di halaman utama!
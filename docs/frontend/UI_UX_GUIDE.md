# Panduan UI/UX & Logika Antarmuka (Client-Side)

Dokumen ini menjelaskan fondasi rekayasa antarmuka (UI/UX) dan sistem logika interaksi (Client-State) pada platform SaaS PJTECH KASIR. Kami berfokus pada desain kelas premium (*Enterprise SaaS*) dengan optimasi interaksi tanpa gesekan (*frictionless*).

## 1. Landing Page (Portal Etalase)
Halaman depan (`app/page.tsx`) bertindak sebagai pusat masuk aplikasi dengan mengutamakan performa dan nilai estetika tinggi.

**Pendekatan Desain:**
- **Split Screen Layout:** Membagi layar secara horizontal pada desktop (Proporsi informasi bisnis di sisi kiri, formulir akses sistem (*Auth Card*) di sisi kanan).
- **Glassmorphism & Bento-grids:** Penggunaan latar belakang translusen (seperti `bg-white/70 backdrop-blur-xl`) berpadu dengan struktur kontainer *Bento-grid* yang memancarkan estetika SaaS modern.
- **Mesh Gradients & Ambient Effects:** Pembuatan dimensi kedalaman menggunakan gradien *mesh* warna *indigo/blue* (`bg-blue-400/20 blur-3xl`) yang menyala lembut secara asinkron.
- **Stealth Backdoor:** Tidak ada lagi *clutter* navigasi admin publik. Akses panel *Superadmin* disematkan secara sembunyi-sembunyi pada tipografi judul utama (logo) demi memberikan rasa eksklusivitas operasional.

## 2. Superadmin Dashboard (Data-Dense UI)
Dasbor pengelola utama (*Superadmin*) dirancang dengan mematuhi prinsip **Compact Data-Driven Interface**, mengoptimalkan kemampuan pemindaian visual data pada monitor pengguna *desktop*.

**Pendekatan Desain & Fungsionalitas:**
- **Compact & Dense Tables:** Tabel tidak lagi memiliki ruang putih berlebih. Kami menerapkan *padding* sempit (`py-2 px-3`) dan ukuran teks kecil yang tajam (`text-[10px]` hingga `text-xs`) untuk memaksimalkan jumlah baris yang tampil tanpa *scrolling*.
- **Pagination Berbasis Server:** Transisi navigasi menggunakan URL Parameter (Search Params) alih-alih status *React*. Penomoran halaman terhubung penuh (*Continuous Indexing*) melintasi halaman yang berbeda.
- **Kecerdasan Metrik Otomatis:** Sistem tak hanya menampilkan data *raw*, tetapi memberikan wawasan instan seperti metrik *Current Month GMV* ("Omset Bulan Ini") yang terhitung dari siklus waktu aktif, memperlihatkan tingkat keaktifan (*stickiness*) bulanan seorang *Tenant*.

## 3. Checkout Idempotency & Debouncing (Anti-Spam UI)
Sistem kasir rentan terhadap anomali di tingkat jaringan dan gempuran perangkat lunak otomatis atau interaksi kikuk manusia (*spamming* klik pada tombol bayar).

**Masalah UI Klasik:**
Ketukan beruntun (klik *double* / ketukan panik saat jaringan lambat) pada tombol `Checkout` sering memicu eksekusi ganda, meneruskan cacat mutasi ke database.

**Solusi Logika Idempotency (Anti-Spam):**
- **State Pelindung Ganda:** Kami menyuntikkan asinkronus state pelindung visual (`isCheckoutLoading`) sekaligus sinkronus state absolut memanfaatkan `useRef` React (`isSubmittingRef`).
- **Eksekusi Debouncing:** 
  ```tsx
  // Contoh Logika Anti-Spam
  if (isSubmittingRef.current || isCheckoutLoading) return;
  isSubmittingRef.current = true;
  setIsCheckoutLoading(true);
  ```
- **Visual Feedback:** Tombol otomatis masuk mode non-interaktif (*disabled*) selama sepersekian detik dan meluncurkan indikator *loading*, memangkas tuntas kecemasan kasir sambil menjaga integritas database P2002 Prisma.

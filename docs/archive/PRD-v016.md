# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.16
**Fokus:** Resolusi Z-Index Modal, Standarisasi UI Navigasi Header, & Bugfix Blank Screen Autentikasi (Clerk)

## 1. Analisis Masalah (UI/UX & Routing Bug)
* **Z-Index Conflict (Modal vs Bottom Nav):** Pada perangkat *mobile*, elemen tombol aksi di dalam Modal ("Simpan" dan "Batal") bertumpuk atau tumpang tindih dengan *Bottom Navigation*. Hal ini terjadi karena hierarki sumbu-Z (*z-index*) Modal kalah atau setara dengan navigasi bawah.
* **Inkonsistensi Teks & Desain Header:** Teks tombol "Lihat Kasir" terpotong menjadi "Kasir" saja saat dibuka di *mobile*. Selain itu, gaya visual tombol dengan latar belakang biru muda terlihat kurang premium/pro untuk sebuah SaaS berbayar.
* **Blank Screen (Routing Clerk):** Saat pengguna dinavigasikan kembali ke Dasbor (`/admin`), layar menjadi putih kosong dengan indikasi URL beralih ke `/sign-in?redirect_url=...`. Ini adalah tanda bahwa rute otentikasi kustom untuk Clerk belum dikonfigurasi dengan benar di dalam Next.js App Router, sehingga aplikasi tidak tahu komponen apa yang harus dirender saat sesi tidak valid atau membutuhkan sinkronisasi ulang.

## 2. Solusi Teknis & Instruksi Implementasi

### A. Resolusi Stacking Context Modal (Z-Index)
* **Target:** Komponen Modal di `app/admin/products/page.tsx`.
* **Solusi:** Tingkatkan level `z-index` pada pembungkus (overlay) layar penuh Modal.
* **Implementasi:** Pada elemen `<div>` paling luar dari Modal yang memiliki class `fixed inset-0`, tambahkan *utility class* `z-[100]`. Pastikan *Bottom Navigation Bar* di `app/admin/layout.tsx` menggunakan `z-50`. Ini menjamin Modal selalu merender di atas elemen UI apa pun.

### B. Standarisasi Tombol Header "Lihat Kasir"
* **Target:** Komponen Header di `app/admin/layout.tsx`.
* **Solusi:** Hapus penyembunyian teks responsif dan perbarui *styling* agar terlihat eksklusif.
* **Implementasi:** 
  1. Hapus class seperti `hidden sm:inline` atau `md:hidden` yang memotong kata "Lihat". Pastikan teks utuh "Lihat Kasir".
  2. Ubah desain tombol menjadi gaya *solid premium*. Gunakan kombinasi kelas berikut: `flex items-center gap-2 bg-slate-900 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-slate-800 transition-all shadow-sm`.

### C. Resolusi Bug Blank Screen (Clerk Auth Setup)
* **Target:** Struktur *Routing* Aplikasi & File Konfigurasi.
* **Solusi:** Menyediakan halaman *Sign-In* kustom yang diwajibkan oleh Clerk.
* **Implementasi:**
  1. Buat hierarki folder dan file baru secara spesifik: `app/sign-in/[[...sign-in]]/page.tsx`.
  2. Di dalam file tersebut, *render* komponen bawaan Clerk:
     ```tsx
     import { SignIn } from '@clerk/nextjs';
     export default function Page() {
       return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
           <SignIn />
         </div>
       );
     }
     ```
  3. Pastikan file `.env.local` memiliki dua baris variabel mutlak berikut agar *middleware* mengenali rute tersebut:
     `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
     `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
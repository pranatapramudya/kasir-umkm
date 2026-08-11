# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.68
**Fokus:** Koreksi Kontras Tema (Light Mode) & Restorasi Alur Registrasi

## 1. Analisis Bug UI/UX
Berdasarkan hasil eksekusi sebelumnya, terdapat dua *critical flaw* pada halaman *Landing Page* (`app/page.tsx`):
*   **Aksesibilitas Visual (Sakit Mata):** Latar belakang menjadi hitam pekat/gelap, menyebabkan teks utama (yang juga berwarna gelap) tidak terbaca. Desain harus dikembalikan ke *Light Theme* yang bersih dan premium.
*   **Alur Bisnis Terputus:** Tautan "Belum punya akun? Daftar di sini" hilang dari kartu *Login*, sehingga pengguna baru (*owner* UMKM) tidak memiliki pintu masuk untuk mendaftar.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki tata letak warna dan kembalikan elemen registrasi. DILARANG memberikan *output* kode mentah panjang.

### A. Paksa Tema Terang (Force Light Mode)
*   **Target File:** `app/page.tsx` (atau komponen *Landing Page* utama).
*   **Instruksi Tailwind:**
    1. Hapus semua *class* yang mengandung `bg-black`, `bg-gray-900`, atau elemen *dark mode* lainnya di *container* paling luar.
    2. Ubah *background container* utama menjadi gradasi terang yang bersih: `bg-gradient-to-br from-slate-50 via-white to-blue-50`.
    3. Pastikan teks judul dan paragraf di sebelah kiri memiliki kontras tinggi: Gunakan `text-slate-900` untuk judul (selain teks gradient PJTECH) dan `text-slate-600` untuk paragraf deskripsi.

### B. Restorasi Tautan "Daftar di Sini"
*   **Target File:** `app/page.tsx` (di dalam elemen *Glassmorphism* Card).
*   **Instruksi:**
    1. Tepat di bawah tombol "Mulai Sekarang" (atau `<SignInButton />`), tambahkan kembali teks keterangan pendaftaran.
    2. **Format UI:** Buat teks berukuran kecil di tengah (`text-center text-sm text-slate-600 mt-4`).
    3. **Teks & Tautan:** "Belum punya akun? [Daftar di sini]". 
    4. Bungkus teks "Daftar di sini" dengan tautan (`<Link href="/onboarding">` atau rute Sign-Up Clerk Anda) menggunakan *style* `text-blue-600 font-semibold hover:underline`.

Silakan eksekusi perbaikan kontras dan registrasi ini sekarang! Tampilan harus terlihat seperti *SaaS* premium yang bersih dan terang.
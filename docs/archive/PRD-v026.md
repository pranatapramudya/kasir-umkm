# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.26
**Fokus:** Optimasi Alur Redirect Otentikasi (Clerk Fallback URL)

## 1. Analisis Masalah (Log Behavior)
*   **Observasi:** Pengguna telah berhasil melakukan *login*, namun terminal Next.js mencatat aktivitas GET request ke `/sign-in/SignIn_clerk_catchall_check...` dan `/sign-in?redirect_url=...` dengan status 200.
*   **Diagnosis:** Log `catchall_check` adalah mekanisme verifikasi internal standar dari SDK `@clerk/nextjs` dan bukan merupakan sebuah *error*. Namun, proses perpindahan (*redirect*) setelah *login* bisa dioptimalkan agar lebih eksplisit (tegas) dan tidak memicu penundaan (*delay*) rute ganda.

## 2. Instruksi Pemeriksaan & Perbaikan untuk AI Agent
Tugas Anda adalah mempertegas arah *redirect* setelah proses otentikasi selesai menggunakan parameter bawaan dari komponen Clerk terbaru (V5).

### A. Update Komponen Sign-In (`app/sign-in/[[...sign-in]]/page.tsx`)
*   Buka file tersebut.
*   Tambahkan *props* pengarah eksplisit pada komponen `<SignIn />`. Gunakan *props* `fallbackRedirectUrl="/admin"` agar setelah pengguna berhasil memasukkan kredensial, Clerk langsung melempar sesi secara paksa ke Dasbor Admin tanpa menunggu penyelesaian URL asal yang mungkin tertinggal di memori peramban.

### B. Update Komponen Sign-Up (`app/sign-up/[[...sign-up]]/page.tsx`)
*   Lakukan hal yang sama pada komponen `<SignUp />`.
*   Tambahkan *props* `fallbackRedirectUrl="/admin"`.

### C. Validasi (Sanity Check)
*   Pastikan tidak ada logika *useRouter* atau *redirect* manual tambahan di dalam halaman *login/register* tersebut, biarkan komponen Clerk yang menangani perpindahan rutenya secara penuh.
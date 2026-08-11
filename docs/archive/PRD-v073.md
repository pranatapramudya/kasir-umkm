# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.73
**Fokus:** HOTFIX - Infinite Loading State & Hard Redirect (Client-Side)

## 1. Analisis Bug UI/UX (P0 Blocker)
*   **Gejala:** Setelah pengguna menekan tombol *submit*, tombol berubah menjadi status "Menyimpan..." (Disabled/Loading) secara permanen. Aplikasi tidak berpindah ke `/admin` dan tidak menampilkan *error*.
*   **Akar Masalah (Frontend):** 
    1. Kegagalan me-reset *state loading* (misal `setIsLoading(false)`) ketika terjadi *error* atau setelah proses selesai.
    2. Penggunaan `router.push('/admin')` dari `next/navigation` sering mengalami konflik *Client-side Cache* pada Next.js saat terjadi mutasi token autentikasi yang sangat cepat.
*   **Tujuan:** Memperbaiki blok `try-catch-finally` pada *event handler* form, dan mengubah metode navigasi menjadi *Hard Navigation* untuk menjamin penyegaran token absolut.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Fokus perbaikan HANYA pada file komponen halaman Onboarding.

### A. Perbaikan State Loading (Try-Catch-Finally)
*   **Target File:** `app/onboarding/page.tsx` (Pastikan ini `"use client"`).
*   **Instruksi Logika Event Handler:**
    1. Cari fungsi yang menangani aksi *submit* form (misalnya `onSubmit` atau aksi dari tombol).
    2. Pastikan Anda mengatur *state* pemuatan di awal: `setIsLoading(true)`.
    3. Bungkus pemanggilan *Server Action* (`completeOnboarding`) di dalam blok `try`.
    4. Jika ada *error*, tangkap di blok `catch` dan berikan notifikasi ke pengguna (misalnya menggunakan `toast` atau *alert* sederhana).
    5. **MUTLAK WAJIB:** Tambahkan blok `finally { setIsLoading(false); }` di akhir *statement*. Ini menjamin tombol "Menyimpan..." akan kembali normal apa pun hasil dari *Server Action* tersebut.

### B. Implementasi Hard Redirect (Bypass Next.js Cache)
*   **Target File:** `app/onboarding/page.tsx`
*   **Instruksi Navigasi:**
    1. Di dalam blok `try`, SETELAH pemanggilan `completeOnboarding` membalas dengan status sukses, dan SETELAH Anda memanggil `await user?.reload()`.
    2. HAPUS pemanggilan `router.push('/admin')` atau `router.replace('/admin')`.
    3. GANTIKAN dengan pemanggilan API peramban asli: `window.location.href = '/admin';`.
    4. *Penjelasan Arsitektur:* Penggunaan `window.location.href` akan memaksa peramban untuk melakukan permintaan (*request*) dokumen penuh ke *Server*. Hal ini secara otomatis akan membersihkan *Client-side Cache* Next.js dan memastikan Middleware mengevaluasi Token JWT Clerk yang baru saja diperbarui tanpa risiko *race condition*.
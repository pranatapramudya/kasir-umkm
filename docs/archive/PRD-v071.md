# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.71
**Fokus:** HOTFIX - Clerk Token Race Condition & Pemulusan Alur Onboarding

## 1. Analisis Bug Arsitektur (Token Caching)
*   **Gejala:** Saat pengguna men-submit form Onboarding, terminal mencatat `POST /onboarding 303`, dan URL berubah menjadi `/admin`, TETAPI layar tetap menampilkan komponen form Onboarding.
*   **Akar Masalah:** *Race condition* pada token JWT sesi Clerk. *Server Action* berhasil memperbarui `publicMetadata` (onboardingComplete) di *backend* Clerk dan melakukan `redirect('/admin')`. Namun, Middleware langsung mengintersepsi permintaan ini menggunakan token *client-side* lama yang belum diperbarui, sehingga Middleware mengira pengguna belum melakukan *onboarding* dan merender ulang komponen Onboarding.
*   **Tujuan:** Memisahkan proses penyimpanan data dan navigasi. Lakukan penyimpanan di *Server Action*, lalu paksa penyegaran token (`reload`) di *Client Component* sebelum mengeksekusi navigasi ke `/admin`.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
Sebagai agen pengembang, jangan membantah logika ini. DILARANG menggunakan `redirect()` di dalam *Server Action* untuk kasus mutasi metadata Clerk ini.

### A. Rombak Server Action (`actions.ts`)
*   **Target File:** `app/onboarding/actions.ts`
*   **Instruksi Logika:**
    1.  Hapus pemanggilan fungsi `redirect('/admin')` dari dalam *Server Action*.
    2.  Sebagai gantinya, pastikan fungsi `completeOnboarding` ini me- *return* objek status kesuksesan.
    3.  Contoh kembalian yang benar: `return { success: true };` pada akhir blok *try*.

### B. Implementasi Token Refresh di Client (`page.tsx`)
*   **Target File:** Komponen UI `app/onboarding/page.tsx` (Pastikan ini adalah `"use client"` component).
*   **Instruksi Interaktivitas & Routing:**
    1.  *Import* `useUser` dari `@clerk/nextjs` dan `useRouter` dari `next/navigation`.
    2.  Di dalam fungsi komponen, panggil *hook* tersebut: 
        `const { user } = useUser();`
        `const router = useRouter();`
    3.  Pada fungsi *handler* tombol Simpan (atau di dalam blok `.then()` dari pemanggilan Server Action), cek jika balasan dari action adalah `{ success: true }`.
    4.  **Logika Inti Mutlak:** JIKA sukses, Anda WAJIB memanggil `await user?.reload();` terlebih dahulu. Ini akan memaksa browser mengunduh token JWT baru yang sudah berisi metadata `OWNER` dan status *onboarding* komplit.
    5.  HANYA SETELAH fungsi `reload()` selesai dieksekusi, panggil navigasi sisi klien: `router.push('/admin');`.

### C. Validasi Alur Skenario
*   Dengan arsitektur ini, saat pengguna menekan tombol "Simpan & Mulai Jualan":
    1. Form mengirim data ke *Server*.
    2. *Server* menyimpan ke Neon DB dan meng-*update* Clerk, lalu membalas "Sukses".
    3. Klien menerima "Sukses", lalu mengambil token baru dari Clerk secara instan.
    4. Klien pindah ke `/admin`. Middleware mengecek token baru -> Sah! -> Pengguna lolos ke Dasbor.
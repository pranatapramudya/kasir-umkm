# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.69
**Fokus:** Koreksi Alur Onboarding (Auth-First) & Debugging Server Action Error

## 1. Analisis Kebutuhan Alur (SaaS Authentication Flow)
*   **Koreksi Logika Bisnis:** Pengguna TIDAK BOLEH mengisi form Onboarding sebelum memiliki akun. Alur yang sah dan mutlak adalah: **Landing Page -> Sign Up/Sign In (Clerk) -> Middleware Intercept -> Halaman Onboarding -> Simpan ke Database -> Redirect Dasbor**.
*   **Analisis Error (Runtime Server Error):** Terjadi kegagalan pada file `app/onboarding/actions.ts` di baris 42. Blok `catch` melemparkan *error* generik `"Gagal menyimpan data toko"`, yang menutupi jejak *error* sebenarnya (kemungkinan besar masalah konstrain Prisma `userId` atau kegagalan `clerkClient`).

## 2. Instruksi Eksekusi Backend untuk AI Agent
Sebagai agen pengembang, jangan mengubah UI Halaman Onboarding yang sudah bagus. Fokus perbaiki keamanan, validasi, dan penanganan *error* pada `Server Action`.

### A. Evaluasi Ulang Logika Server Action (`actions.ts`)
*   **Target File:** `app/onboarding/actions.ts`
*   **Instruksi Perbaikan Logika:**
    1.  **Validasi Sesi Mutlak:** Di baris paling pertama dalam fungsi action, pastikan Anda memanggil `const { userId } = auth();`. Jika `userId` kosong/null, langsung lemparkan *error* *Unauthorized*.
    2.  **Transparansi Error:** Hapus pesan *error* generik (`throw new Error("Gagal menyimpan...")`). Ganti dengan melempar *error message* asli dari *catch block* agar pengembang bisa melihat apakah yang gagal adalah Prisma atau Clerk API.
    3.  **Injeksi Foreign Key:** Saat memanggil `prisma.tenant.create()`, PASTIKAN kolom `userId` diisi dengan `userId` yang didapat dari Clerk `auth()` pada langkah 1.
    4.  **Update Metadata Clerk:** Pastikan Anda menggunakan `clerkClient.users.updateUserMetadata` dengan benar. (*Peringatan: Fungsi ini membutuhkan `CLERK_SECRET_KEY` yang valid di file `.env` lingkungan lokal*).

### B. Penguatan Middleware (Routing Logic)
*   **Target File:** `middleware.ts`
*   **Instruksi Validasi:**
    1. Pastikan logika *redirect* tidak mengalami *infinite loop*.
    2. Pengguna yang HANYA memiliki sesi aktif (`userId` ada) TETAPI `metadata.onboardingComplete` bernilai *falsy*, HANYA BOLEH mengakses rute `/onboarding`.
    3. Jika mereka mencoba kembali ke `/` atau `/admin`, paksa kembali ke `/onboarding`.

### C. Validasi QA (Quality Assurance) Terminal
*   Sebagai agen, setelah Anda memperbaiki *Server Action*, instruksikan pengguna (Owner) untuk memeriksa terminal Next.js lokal mereka. Jika *error* masih terjadi saat tombol "Simpan & Mulai Jualan" diklik, terminal akan menampilkan *error log* asli (seperti `PrismaClientKnownRequestError` atau `ClerkAPIResponseError`) berkat perbaikan di poin A.2.
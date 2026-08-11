# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.61
**Fokus:** Bugfix Redirect Loop (Onboarding Guard & Root Routing)

## 1. Analisis Bug Routing
*   **Masalah:** Pengguna yang sudah memiliki *Tenant* atau pengguna dengan peran `SUPERADMIN` malah diarahkan kembali ke halaman `/onboarding` saat mengakses halaman utama (`/`). Hal ini menciptakan *loop* atau pengalaman UX yang membingungkan.
*   **Solusi:** Diperlukan penyesuaian pada `middleware.ts` dan/atau pengecekan status *Tenant* pada *route handler* halaman *root* dan *onboarding*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki logika *routing* dan *redirect* secara komprehensif. DILARANG memberikan *output* kode mentah.

### A. Routing Halaman Utama (Root `/`)
*   **Target File:** `app/page.tsx` (Halaman pendaratan setelah login) atau `middleware.ts`.
*   **Instruksi Logika Redirect:**
    1. Periksa `session` atau *metadata* pengguna saat ini.
    2. **Jika `role === 'SUPERADMIN'`:** Arahkan (*redirect*) langsung ke `/superadmin`.
    3. **Jika bukan Superadmin:** Lakukan kueri ke *database* untuk mengecek apakah `userId` tersebut sudah memiliki `Tenant`.
    4. Jika *Tenant* ADA -> Arahkan ke `/admin` (atau `/dashboard`).
    5. Jika *Tenant* TIDAK ADA -> Arahkan ke `/onboarding`.

### B. Proteksi Halaman Onboarding (Onboarding Guard)
*   **Target File:** `app/(onboarding)/onboarding/page.tsx` (atau lokasi form onboarding).
*   **Instruksi:**
    1. Tambahkan *Server-side check* sebelum form dirender.
    2. Cek ke *database*: `const existingTenant = await prisma.tenant.findUnique({ where: { userId } })`.
    3. Jika `existingTenant` sudah ada, PENGGUNA DILARANG MELIHAT FORM INI. Langsung *redirect* mereka ke `/admin`. Ini untuk mencegah pembuatan toko ganda (*duplicate tenant*) oleh pengguna yang sama.

### C. Proteksi Tombol "Kembali ke Admin" di Superadmin
*   **Target File:** `app/superadmin/page-client.tsx` (atau komponen *header* yang memuat tombol "Kembali ke Admin").
*   **Instruksi:**
    1. Pastikan tombol "Kembali ke Admin" mengarah ke rute `/admin`.
    2. Jika Superadmin mengklik tombol ini, sistem harus mengizinkannya masuk ke `/admin` asalkan akun Superadmin tersebut juga memiliki *Tenant* yang terdaftar atas namanya (sebagai tempat *testing*). 

Silakan eksekusi perbaikan logika *routing* ini agar alur navigasi dari *Login* -> *Sistem* berjalan tanpa cacat!
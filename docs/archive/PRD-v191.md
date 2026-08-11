# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.91
**Fokus:** Resolusi Bug Layar Hitam (Hanging) Pasca Verifikasi OTP Clerk

## 1. Deskripsi Bug
Setelah pengguna baru (Owner) memasukkan kode OTP pada saat proses *Sign-Up*, antarmuka mengalami *hang* dengan layar hitam (hanya terdapat indikator "Rendering..." di pojok). Transisi ke halaman Onboarding gagal dieksekusi secara otomatis. Namun, jika pengguna melakukan *refresh* (F5) secara manual, halaman Onboarding (`/onboarding` atau `/`) berhasil dimuat. 

Ini mengindikasikan bahwa sesi (session) berhasil dibuat oleh Clerk, namun terjadi kegagalan pada proses *client-side routing handoff* di Next.js App Router.

## 2. Hipotesis & Area Investigasi untuk Agent
Agen harus menginvestigasi tiga area utama penyebab kegagalan transisi ini:
1.  **Penggunaan Props Redirect Clerk yang Usang:** Komponen `<SignUp />` atau `<SignIn />` mungkin masih menggunakan *props* lama atau tidak secara eksplisit mendefinisikan rute jatuhan (*fallback*).
2.  **Missing Suspense Boundary di Halaman Target:** Halaman tujuan setelah login (Beranda atau Onboarding) mungkin menggunakan *hooks* sisi klien seperti `useSearchParams()` tanpa dibungkus `<Suspense>`. Di Next.js App Router, hal ini akan memblokir *rendering* saat transisi *client-side*.
3.  **Race Condition di Middleware:** *Middleware* mungkin mencegat transisi sebelum *cookie* token dari Clerk benar-benar tersinkronisasi di *browser*.

## 3. Instruksi Eksekusi Mutlak
Lakukan perbaikan secara komprehensif tanpa merusak logika Multi-Tenant yang sudah ada:

*   **Langkah 1 (Audit Komponen Auth):** Buka file yang memuat komponen Clerk (contoh: `app/(auth)/sign-up/[[...sign-up]]/page.tsx`). Pastikan menggunakan *props* yang mendukung App Router terbaru, seperti `fallbackRedirectUrl="/"` atau `forceRedirectUrl="/"`. Pastikan `routing="path"` telah diatur.
*   **Langkah 2 (Audit Suspense):** Buka halaman Onboarding dan halaman *Root* (`app/page.tsx`). Jika terdapat komponen klien (`'use client'`) yang membaca parameter URL atau melakukan *fetching* berat saat *mount*, pastikan komponen tersebut dibungkus dengan `<Suspense fallback={<Loading />}>`.
*   **Langkah 3 (Sinkronisasi Middleware):** Periksa kembali `middleware.ts`. Pastikan tidak ada *redirect loop* yang tertahan (*pending*) saat status autentikasi sedang dalam masa transisi (*handshake*).

## 4. Output yang Diharapkan
Terapkan perbaikan pada *codebase* secara langsung. Berikan laporan singkat (maksimal 3 kalimat) mengenai file mana yang menyebabkan *router* Next.js *hang* dan bagaimana Anda menyelesaikannya. Dilarang mengubah aturan otorisasi/RBAC yang sudah final.
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.18
**Fokus:** Bugfix TypeError Middleware (auth.protect is not a function)

## 1. Analisis Masalah (Runtime Error)
Terdapat *TypeError: auth(...).protect is not a function* di dalam file `middleware.ts`. Hal ini terjadi akibat ketidakcocokan versi paket `@clerk/nextjs` yang terpasang di *node_modules* dengan sintaks `.protect()` terbaru. Beberapa versi Clerk membutuhkan pemanggilan manual untuk memvalidasi sesi dan melakukan *redirect* jika pengguna tidak terautentikasi.

## 2. Solusi Teknis & Instruksi Implementasi

### A. Refaktor Middleware Clerk (Fallback Syntax)
*   **Target File:** `middleware.ts` (berada di *root* direktori atau di dalam folder `src`).
*   **Solusi:** Hapus pemanggilan `auth().protect()`. Ganti dengan logika destrukturisasi objek `auth()` yang mengecek `userId` secara eksplisit, lalu kembalikan fungsi `redirectToSignIn()` jika `userId` tidak ditemukan (pengguna belum login). Pendekatan ini 100% aman (*backward-compatible*) di seluruh versi Clerk V5.

### B. Kode Pengganti (Wajib Diterapkan Utuh)
Ganti seluruh isi file `middleware.ts` dengan kode blok di bawah ini:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Lindungi rute admin
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    // Gunakan pengecekan sesi manual yang lebih aman (bulletproof)
    const session = auth();
    
    // Jika tidak ada userId (belum login), arahkan paksa ke halaman Sign-In
    if (!session.userId) {
      return session.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Abaikan file statis Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Eksekusi middleware selalu di rute API
    '/(api|trpc)(.*)',
  ],
};
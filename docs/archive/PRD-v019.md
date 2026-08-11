# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.19
**Fokus:** Resolusi Final Middleware Clerk (TypeError)

## 1. Analisis Masalah (Runtime Error)
Terdapat *bug* fatal pada file `middleware.ts` dengan pesan error: `session.redirectToSignIn is not a function`. Hal ini terjadi karena instruksi sebelumnya memaksakan metode yang sudah usang (*deprecated*) atau tidak kompatibel dengan versi `@clerk/nextjs` yang saat ini terpasang di proyek. 

## 2. Instruksi Perbaikan untuk AI Agent
Sebagai AI Agent yang memiliki akses langsung ke *codebase* pengguna, tugasmu adalah:
1. **Periksa Versi:** Cek versi `@clerk/nextjs` dan `next` di dalam `package.json`.
2. **Gunakan Dokumentasi Resmi:** Tulis ulang file `middleware.ts` menggunakan standar resmi dari dokumentasi Clerk versi terbaru yang sesuai dengan proyek ini. 
3. **Logika Proteksi:** 
   - Rute `/admin(.*)` wajib diproteksi.
   - Jika pengguna mencoba mengakses rute terproteksi tanpa otentikasi, lakukan *redirect* ke rute Sign-In dengan cara yang **direkomendasikan oleh versi Clerk tersebut** (misalnya menggunakan kombinasi `auth().protect()` yang benar, atau menggunakan standar `NextResponse.redirect(new URL('/sign-in', req.url))` dari Next.js).
   - Pastikan rute publik seperti `/sign-in` dan rute statis Next.js TIDAK terkunci oleh middleware untuk mencegah *infinite redirect loop*.
4. **Validasi:** Pastikan tidak ada *TypeError* dan alur *login* / *redirect* berjalan mulus tanpa layar *blank*. Silakan langsung berikan perbaikan kodenya!
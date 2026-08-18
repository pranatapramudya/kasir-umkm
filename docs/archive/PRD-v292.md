# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.92
**Fokus:** Force Absolute Routing (/admin) & PWA Event Listener Audit

## 1. Analisis Masalah
1. **Routing Ngeyel:** Setelah pengguna berhasil *Login* atau *Sign Up*, sistem malah melempar (*redirect*) ke halaman *root* `/` (yang berisi Kasir POS), bukan ke `/admin` (Dashboard). Ini mengindikasikan konfigurasi Clerk/Auth Provider belum meng- *override* rute *default* secara absolut, atau *middleware* masih meloloskan *redirect* ke `/`.
2. **PWA Pop-up Tidak Memicu:** Klien melaporkan pop-up instalasi tidak muncul. Selain faktor *localStorage* atau PWA yang sudah terinstal, seringkali *event* `beforeinstallprompt` terlewat karena komponen React terlambat melakukan *mount* dan menempelkan *Event Listener*.

## 2. Instruksi Eksekusi (Auth Middleware & React Lifecycle)
**Target File:** `.env`, file `middleware.ts`, konfigurasi `<ClerkProvider>` / `<SignIn>`, dan `PwaInstallPrompt.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Kunci Mati Rute Pendaratan (Absolute Force Routing):**
1. **Pembaruan Env Vars:** Jika menggunakan Clerk, pastikan file *environment* memiliki variabel pendaratan yang absolut: `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/admin` dan `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/admin`.
2. **Pembaruan Props Komponen:** Cari komponen `<SignIn />` dan `<SignUp />`. Gunakan atribut pemaksaan rute versi terbaru (misal: `forceRedirectUrl="/admin"` atau `fallbackRedirectUrl="/admin"`) alih-alih atribut *deprecated* lama.
3. **Middleware Intercept:** Pada file `middleware.ts`, tambahkan logika proteksi ekstra. Jika pengguna sudah terautentikasi (`auth().userId`) dan mencoba mengakses *root URL* (`/`), paksa *redirect* (`NextResponse.redirect`) ke `/admin`.

**B. Audit Lifecycle Pop-up PWA (`beforeinstallprompt`):**
1. Buka komponen `PwaInstallPrompt.tsx`.
2. Pastikan penambahan *Event Listener* `window.addEventListener('beforeinstallprompt', ...)` dieksekusi sedini mungkin di dalam `useEffect`. 
3. Periksa apakah logika *anti-spam* (`localStorage.getItem('pwa_prompt_dismissed')`) menghalangi inisialisasi terlalu awal. Jangan hentikan *listener*-nya, cukup sembunyikan UI-nya jika *localStorage* bernilai `true`.
4. Berikan sedikit jeda (*timeout* misal 1-2 detik) sebelum UI pop-up benar-benar muncul setelah *event* tertangkap, agar transisi terasa natural (tidak mengagetkan pengguna yang baru saja mendarat di `/admin`).

Silakan kunci rute `/admin` ini dari segala sisi (Env, Props, Middleware) agar tidak ada pengguna yang mendarat di `/` lagi! Lapor jika sudah dieksekusi dengan solid.
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.2.1 (Hotfix)
**Fokus:** Resolusi Error Turbopack & Refaktor Conditional Rendering Clerk

## 1. Analisis Masalah (Bug Report)
Penggunaan komponen pembungkus `<SignedIn>` dan `<SignedOut>` memicu `Build Error: Export SignedIn doesn't exist in target module` akibat kegagalan resolusi modul oleh Turbopack pada Next.js. 

## 2. Solusi Teknis (Hook-based Rendering)
Kita akan meninggalkan penggunaan komponen pembungkus tersebut dan beralih menggunakan pendekatan kondisional berbasis *state* dari ekosistem Clerk, yaitu *hook* `useAuth()`.

### A. Refaktor Import
* Hapus `SignedIn` dan `SignedOut` dari daftar *import* `@clerk/nextjs`.
* Pertahankan `SignInButton` dan `UserButton`.
* Tambahkan impor *hook* `useAuth`.

### B. Implementasi Logika Rendering
Gunakan destrukturisasi dari `useAuth()` untuk mendapatkan status pengguna:
`const { isLoaded, userId } = useAuth();`

Buat 3 kondisi *return* secara berurutan di dalam komponen Storefront:
1. **Loading State:** `if (!isLoaded) return <div>Memuat...</div>;` (Mencegah kedipan UI sebelum status sesi diketahui).
2. **Signed-Out State:** `if (!userId) return <LandingPageSambutan />;` (Menampilkan UI sambutan PJTECH KASIR POS dan `<SignInButton>`).
3. **Signed-In State:** `return <POSApp />;` (Jika lolos dari dua kondisi di atas, artinya pengguna sudah login. Render UI utama kasir dan berikan akses untuk memanggil `/api/products`).
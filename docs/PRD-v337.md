# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.37
**Fokus:** Eradikasi Data Leak (Stale Cache) pada Transisi Menu & Logout

## 1. Analisis Masalah
Meskipun pembersihan cache SWR dan `localStorage` sudah dilakukan, data tenant sebelumnya masih muncul sekian milidetik (FOUC / Stale State) saat tenant baru login dan melakukan navigasi antar menu di Sidebar. 
Akar masalah: 
1. **Next.js Client Router Cache:** Menyimpan *payload* RSC secara agresif di memori browser.
2. **Global State / SWR Memory:** Belum ter- *purge* sepenuhnya sebelum *render cycle* berikutnya berjalan.
3. **Pengecekan Kurang Dalam:** Validasi `tenantId` sebelumnya kemungkinan hanya dilakukan di level halaman (`page.tsx`), bukan di level pelindung tertinggi (`layout.tsx`).

## 2. Instruksi Eksekusi (The Nuclear Option)
**Target File:** Komponen tombol Logout, Pelindung Auth (`SessionTimeoutGuard.tsx`), dan Root Admin Layout (`app/admin/layout.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Implementasi "Hard Reload" pada Proses Logout:**
1. Buka fungsi/tombol yang menangani proses **Logout** / Sign Out.
2. Setelah fungsi `signOut()` dari Clerk (atau *auth provider* Anda) dieksekusi, **JANGAN** menggunakan `router.push('/')` (Soft Navigation bawaan Next.js).
3. Gunakan Opsi Nuklir: `window.location.href = '/'` atau `window.location.reload()`. Ini akan memaksa browser untuk membuang seluruh *Javascript memory*, *Router Cache* Next.js, dan status SWR/Zustand yang tersisa dari pengguna sebelumnya.

**B. Strict Tenant Block di Level Layout (Root Guard):**
1. Buka `app/admin/layout.tsx` (File Layout utama yang membungkus *Sidebar* dan seluruh halaman admin).
2. Terapkan logika pemblokiran di level ini: Ambil `storeId` atau `businessId` dari *state/session* pengguna yang sedang login.
3. Bandingkan dengan `storeId` dari data profil/toko yang sedang di-*fetch* oleh Layout.
4. Jika ID tidak cocok (sedang dalam masa transisi/hydration) ATAU jika data sedang di- *loading*, **JANGAN ME-RENDER** `{children}` maupun *Sidebar*. Render sebuah komponen *Loading Screen* penuh (misal: layar putih dengan *spinner* atau logo) sampai data benar-benar dipastikan milik pengguna yang login.

**C. Global Cache Purge on Mount:**
1. Pastikan saat halaman Login atau halaman *landing page* publik dimuat (`/`), tambahkan `useEffect` yang secara paksa menjalankan `localStorage.clear()` dan `sessionStorage.clear()` (kecuali *key* esensial untuk autentikasi jika diperlukan). Ini memastikan tidak ada sisa "sampah" sebelum sesi baru dimulai.

Silakan eksekusi sistem keamanan super ketat ini! Lapor kembali jika pergantian antar-akun kini 100% bersih tanpa ada kilatan data dari akun sebelumnya saat bernavigasi!
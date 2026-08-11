# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.86
**Fokus:** Investigasi & Perbaikan Infinite Redirect Loop (Layar Kedap-Kedip) pada Autentikasi Owner

## 1. Deskripsi Bug
Pengguna yang bertindak sebagai Pemilik Bisnis UMKM (akun pertama yang mendaftar, bukan SUPERADMIN dan bukan CASHIER) mengalami *flickering* (layar kedap-kedip) dan gagal memuat halaman setelah *login*. Ini mengindikasikan adanya *Infinite Redirect Loop* antara `middleware.ts`, `app/layout.tsx`, `app/page.tsx`, atau halaman *Onboarding*.

## 2. Arsitektur yang Diharapkan (Aturan Main)
*   **SUPERADMIN:** Bebas akses ke mana saja, termasuk rute `/superadmin`.
*   **OWNER (Pemilik Bisnis UMKM):** Jika belum punya data toko di *database*, arahkan ke `/onboarding`. Jika sudah punya, arahkan ke *dashboard* utamanya. **TIDAK BOLEH** ditendang ke `/sign-in` jika sudah *login*, dan **TIDAK BOLEH** ditendang ke rute yang memantulkannya kembali.
*   **CASHIER (Karyawan):** Hanya boleh mengakses rute spesifik kasir (misal: `/kasir`), tidak boleh masuk ke rute analitik atau manajemen karyawan.

## 3. Instruksi Investigasi Mutlak untuk Agent
1.  **Lacak Rantai Redirect:** Periksa kombinasi dari file `middleware.ts`, `app/page.tsx` (Beranda), dan file Layout utama (`app/(dashboard)/layout.tsx` atau sejenisnya).
2.  **Cari Konflik Logika:** 
    *   Apakah `middleware.ts` menendang pengguna ke `/` sementara di `/` pengguna ditendang lagi ke tempat lain?
    *   Apakah ada validasi `role` yang salah menangani nilai `undefined` (karena Owner UMKM standar mungkin tidak memiliki klaim role eksplisit)?
3.  **Perbaiki Arus Navigasi:** Hapus atau perbaiki perintah `redirect()` atau `NextResponse.redirect()` yang saling tumpang tindih. Pastikan halaman tujuan *redirect* (misalnya `/onboarding`) dikecualikan (*whitelisted*) dari pengecekan *middleware* agar tidak memantulkan pengguna kembali.

## 4. Output yang Diharapkan
Identifikasi 2 (dua) file yang saling memantulkan *redirect* tersebut, lalu terapkan perbaikan kodenya agar Owner bisa masuk ke *dashboard* dengan tenang. Jelaskan secara singkat di mana letak bentroknya.
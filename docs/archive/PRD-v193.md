# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.93
**Fokus:** Resolusi Kritis *Hanging* (Blank Hitam) Pasca-Verifikasi OTP Pendaftaran (Sign-Up)

## 1. Deskripsi Bug
Setelah pengguna mendaftar sebagai Owner (di semua kategori bisnis) dan memasukkan kode OTP, layar tertahan pada status *blank* hitam (hanya menampilkan indikator *rendering* bawaan *browser*/*framework*). Pengguna tidak diarahkan secara otomatis ke halaman target (Onboarding atau `/admin`), namun sesi sebenarnya sudah berhasil dibuat (terbukti dengan me-*refresh* halaman secara manual, pengguna berhasil masuk).

## 2. Akar Masalah (Analisis untuk Agent)
Ini adalah masalah *Client-Side Navigation Race Condition* khas integrasi Clerk dan Next.js App Router pada fase *Sign-Up*. Setelah OTP divalidasi, sesi *cookie* sudah diset oleh Clerk, tetapi *router* Next.js gagal mendeteksi perubahan *state* tersebut secara reaktif, sehingga komponen gagal melakukan *mount* pada rute tujuan.

## 3. Instruksi Eksekusi Mutlak untuk Agent
Agen WAJIB memperbaiki transisi OTP ini pada rute pendaftaran. Lakukan investigasi dan eksekusi berdasarkan arsitektur UI yang digunakan:

**SKENARIO A (Jika Menggunakan Komponen Bawaan `<SignUp />` Clerk):**
1. Buka file yang me-render pendaftaran (contoh: `app/(auth)/sign-up/[[...sign-up]]/page.tsx`).
2. Pastikan *props* berikut tertulis secara eksplisit untuk memaksa *router* memuat ulang sesi:
   `routing="path"`
   `path="/sign-up"`
   `forceRedirectUrl="/admin"` (atau URL Onboarding, sesuaikan dengan alur yang benar)
   `fallbackRedirectUrl="/admin"`

**SKENARIO B (Jika Menggunakan Custom UI dengan Hook `useSignUp`):**
1. Cari fungsi yang menangani submit verifikasi OTP (biasanya fungsi yang memanggil `signUp.attemptEmailAddressVerification`).
2. Setelah status `completeSignUp.status === 'complete'`, biasanya terdapat perintah `await setActive({ session: completeSignUp.createdSessionId })`.
3. **KUNCI PERBAIKAN:** Segera setelah `setActive` selesai dieksekusi, JANGAN HANYA menggunakan `router.push('/admin')` karena *middleware* sering kali belum mendeteksi *cookie* baru. 
4. Gunakan kombinasi `router.push('/admin')` dan diikuti dengan `router.refresh()` secara berurutan, ATAU gunakan `window.location.href = '/admin'` untuk memaksa *hard-navigation* agar *middleware* Next.js membaca *cookie* sesi yang baru lahir.

## 4. Output yang Diharapkan
Identifikasi apakah sistem menggunakan Skenario A (Komponen Bawaan) atau Skenario B (Custom UI) untuk OTP pendaftaran. Terapkan perbaikan *routing* pasca-OTP tersebut langsung ke *codebase*. Berikan laporan singkat (maksimal 2 kalimat) mengenai metode eksekusi yang dipilih.
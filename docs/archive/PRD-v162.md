# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.62
**Fokus:** Fix Infinite Redirect Loop & Implementasi "Secret Backdoor" Super Admin

## 1. Analisis Bug Kritis
*   **Insiden:** Terjadi *infinite redirect loop* (layar hitam, spam jaringan GET `/onboarding`). Hal ini terjadi karena konflik logika pengalihan antara `middleware.ts`, `app/page.tsx`, dan `app/onboarding/layout.tsx`.
*   **Perubahan Logika Bisnis:** Super Admin TIDAK BOLEH dialihkan secara paksa ke `/superadmin` saat membuka *root* (`/`). Super Admin harus diperlakukan seperti pengguna normal di halaman utama (harus melalui *onboarding* jika belum punya toko *testing*, dan tetap di `/` untuk menggunakan mesin POS). Akses ke *Command Center* akan disembunyikan melalui tautan rahasia (*Easter Egg*).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Bersihkan seluruh kode pengalihan yang bertabrakan dan buat pintu masuk rahasia. DILARANG memberikan *output* kode mentah.

### A. Pembersihan Logika Redirect (Hentikan Loop!)
*   **Target File 1:** `app/page.tsx`
    *   **Instruksi:** Hapus logika `if (role === 'SUPERADMIN') redirect('/superadmin')`. 
    *   Aturan satu-satunya di halaman ini: Cek ke database, apakah `userId` memiliki `Tenant`? Jika **TIDAK**, lempar ke `/onboarding`. Jika **ADA**, render aplikasi Kasir.
*   **Target File 2:** `app/onboarding/layout.tsx` (atau `page.tsx`)
    *   **Instruksi:** Pastikan halaman ini hanya me-lempar (*redirect*) ke `/` jika `userId` SUDAH memiliki `Tenant`. Jangan ada validasi *role* apa pun di sini.
*   **Target File 3:** `middleware.ts`
    *   **Instruksi:** Hapus pengalihan paksa untuk Super Admin di level *middleware*. Pastikan *middleware* hanya menjaga agar `/superadmin` tidak bisa dibuka oleh kasir/pengguna biasa.

### B. Implementasi Secret Backdoor (Pintu Rahasia)
*   **Target File:** Komponen *Sidebar* Utama atau *Footer* (tempat teks `est 2026 PJTECH` atau logo aplikasi berada).
*   **Instruksi:**
    1. Cari teks `est 2026 PJTECH` (atau teks/logo PJTECH sejenis di pojok aplikasi).
    2. Periksa *session/claims* atau *database*. Jika `role === 'SUPERADMIN'`, bungkus teks tersebut menggunakan komponen `<Link href="/superadmin">`.
    3. Jika `role !== 'SUPERADMIN'`, biarkan teks tersebut menjadi teks statis biasa (tanpa tautan).
    4. Pastikan teks rahasia ini tidak memiliki gaya visual seperti tombol/tautan (jangan ada garis bawah atau warna biru). Tampilannya harus membaur (*stealth*) seolah-olah hanya tulisan *copyright* biasa.

Silakan eksekusi pembersihan *loop* ini dan aktifkan pintu rahasia tersebut!
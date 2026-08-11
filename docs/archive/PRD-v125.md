# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.25
**Fokus:** Hotfix Auto-Redirect Bug (Race Condition) pada Alur Onboarding

## 1. Analisis Bug Kritis (P0)
*   **Gejala:** Setelah pengguna mensubmit form "Nama Toko & Kategori" (Step 1), komponen Pilihan Paket (Step 2) muncul hanya dalam hitungan milidetik, lalu halaman tiba-tiba melakukan *auto-redirect* paksa ke `/admin`.
*   **Akar Masalah (Root Cause):** Terdapat sisa kode `router.push('/admin')` atau fungsi `redirect()` yang tidak sengaja tereksekusi. Ini biasanya tertinggal di dalam fungsi *submit handler* Step 1, atau di dalam `useEffect` yang mendeteksi perubahan state/database (misal: `if (tenantCreated) router.push('/admin')`).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit dan perbaikan langsung pada *codebase* Onboarding. DILARANG memberikan *output* kode mentah.

### A. Audit Fungsi Submit Step 1
*   **Target File:** `app/onboarding/page.tsx` (atau *Client Component* form onboarding).
*   **Instruksi:** 
    1. Periksa fungsi `onSubmit` atau aksi yang dipanggil saat tombol form Nama Toko ditekan.
    2. **HAPUS SEMUA** pemanggilan `router.push('/admin')` atau `window.location.href` di dalam fungsi tersebut.
    3. Pastikan fungsi submit tersebut **HANYA** bertugas menyimpan data ke *database* dan menjalankan fungsi `setStep(2)` untuk memunculkan UI `<PricingSection />`.

### B. Audit Server Action & Hooks
*   **Target File:** `app/onboarding/actions.ts` (jika ada) dan `useEffect` pada Onboarding.
*   **Instruksi:**
    1. Pastikan *Server Action* yang memproses form toko **TIDAK** memanggil `redirect('/admin')` dari `next/navigation`. Cukup kembalikan objek status sukses (contoh: `{ success: true }`).
    2. Periksa apakah ada `useEffect` di halaman Onboarding yang memicu *redirect* otomatis saat mendeteksi *store name* sudah terisi. Jika ada, hapus atau ubah logikanya agar tidak menendang *user* ke `/admin` sebelum mereka selesai memilih paket di Step 2.

### C. Konfirmasi Tanggung Jawab Redirect
*   **Instruksi Logic:** Ingat kembali instruksi PRD-v124: Satu-satunya pihak yang boleh melakukan `router.push('/admin')` pada fase ini HANYALAH komponen `<PricingSection />` (yaitu ketika *user* mengklik "Free Trial" atau telah menyelesaikan pembayaran via modal).

Silakan temukan kode *redirect* hantu tersebut dan hapus sekarang juga. Pastikan UI Pilihan Paket (Step 2) diam di tempat dan menunggu interaksi pengguna!
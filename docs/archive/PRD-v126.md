# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.26
**Fokus:** STRICT HOTFIX - Mencegah Server-Side Auto-Redirect di app/onboarding/actions.ts

## 1. Analisis Bug (Berdasarkan Implementation Plan Anda Sebelumnya)
*   **Masalah:** Komponen Step 2 (Pilihan Paket) hanya muncul sekilas, lalu aplikasi memaksa *redirect* ke `/admin`.
*   **Akar Masalah (Root Cause):** Sesuai dengan rencana Anda pada file `app/onboarding/actions.ts` (fungsi `completeOnboarding`), saat pembuatan Tenant (Nama Toko) berhasil di Step 1, server langsung mengeksekusi `redirect('/admin')` atau memicu *revalidatePath* yang membuat *Middleware/Layout* menganggap *onboarding* sudah selesai sepenuhnya.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Ikuti aturan arsitektur yang sudah Anda buat sendiri. Lakukan perombakan pada sisi Server Action dan Client. DILARANG memberikan *output* kode mentah.

### A. Rombak Server Action (Step 1)
*   **Target File:** `app/onboarding/actions.ts` (Fungsi yang menyimpan Nama Toko).
*   **Instruksi SANGAT KRUSIAL:**
    1. Cari baris kode `redirect('/admin')` (berasal dari `next/navigation`) di bagian akhir fungsi pembuatan toko, lalu **HAPUS TOTAL**.
    2. Fungsi ini HANYA BOLEH menyimpan nama toko ke database dan mengembalikan respons JSON/objek: `return { success: true, message: "Toko berhasil dibuat" }`.
    3. Hapus injeksi masa aktif 14 hari dari fungsi ini. Biarkan masa aktif diurus oleh Step 2 (PricingSection) sesuai rencana Anda.

### B. Tangani State di Client Component
*   **Target File:** `app/onboarding/page.tsx` (atau komponen *form client* Anda).
*   **Instruksi:**
    1. Saat memanggil Server Action di atas, tangkap responsnya.
    2. JIKA `response.success` adalah `true`, MAKA jalankan `setStep(2)`.
    3. Karena server tidak lagi melakukan *redirect* paksa, komponen akan dengan tenang merender Step 2 (Pricing Section) di layar tanpa *jumpscare redirect*.

### C. Bypass Middleware / Layout Guard
*   **Target File:** `middleware.ts` ATAU `app/admin/layout.tsx` (jika ada pengecekan Onboarding).
*   **Instruksi:** Pastikan sistem pengecekan rute (Route Guard) tidak menendang pengguna keluar dari halaman `/onboarding` hanya karena `tenantId` sudah dibuat. Pengecekan *onboarding* selesai harus bergantung pada keberhasilan pemilihan paket, BUKAN hanya pembuatan nama toko.

Silakan perbaiki file `actions.ts` tersebut sekarang juga sesuai dengan pedoman yang Anda tulis sebelumnya! Hentikan semua *redirect* prematur!
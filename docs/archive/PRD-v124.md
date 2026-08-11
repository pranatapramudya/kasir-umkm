# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.24
**Fokus:** Multi-Step Onboarding Tunnel & Ekstraksi Komponen Pricing

## 1. Analisis Bug Flow (Post-Registration)
*   **Masalah UX:** Pengguna baru yang selesai memasukkan "Nama Toko" langsung dilempar ke halaman `/admin/subscription` (yang memiliki *sidebar* dan navigasi penuh). Ini merusak pengalaman *Onboarding Tunnel*.
*   **Solusi yang Diharapkan:** Pemilihan paket langganan harus menjadi **Langkah ke-2** dari proses *Onboarding* (di luar area `/admin`). Setelah pengguna memilih paket di langkah tersebut, barulah mereka diizinkan masuk (di-redirect) ke halaman Dashboard (`/admin`).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan arsitektur *Onboarding*. DILARANG memberikan *output* kode mentah.

### A. Component Extraction (Prinsip DRY)
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx`
*   **Instruksi:** 
    1. Ekstrak bagian **Grid 3 Kartu Paket (Katalog)** dan **Checkout Modal** ke dalam satu komponen terpisah yang dapat digunakan ulang (Re-usable Component), misalnya `components/PricingSection.tsx`.
    2. Berikan *props* pada komponen ini, misalnya `onSuccessRedirect?: string` agar fleksibel. Jika *props* ini diisi `"/admin"`, maka setelah pengguna mengklik "Mulai Usaha (Free Trial)" atau selesai berinteraksi dengan modal pembayaran, sistem akan me-*redirect* mereka ke Dashboard.

### B. Refaktor Halaman Onboarding (Multi-Step)
*   **Target File:** `app/onboarding/page.tsx` (atau rute *onboarding* utama).
*   **Instruksi Logic & UI:**
    1. Ubah halaman ini menjadi alur multi-step menggunakan React State (misal: `const [step, setStep] = useState(1)`).
    2. **Step 1 (Form Toko):** Tampilkan form "Nama Toko & Kategori". Saat tombol di-submit, simpan ke database (API/Server Action), lalu ubah ke `setStep(2)`. JANGAN lakukan `router.push` di sini.
    3. **Step 2 (Pilih Paket):** Render komponen `<PricingSection onSuccessRedirect="/admin" />` yang sudah diekstrak pada poin A. Pastikan halaman ini bersih tanpa komponen *Sidebar* (gunakan *layout* kosong yang memusatkan konten di tengah layar).

### C. Penyesuaian Fungsi Tombol "Free Trial" di Onboarding
*   **Instruksi:** Pada komponen `PricingSection`, pastikan ada logika:
    - Jika pengguna mengklik paket Rp 0 (Free Trial) saat mereka di *Onboarding*, sistem wajib menginjeksi masa aktif 14 hari ke *database*, lalu langsung mengeksekusi `router.push('/admin')`.

### D. Perapian Menu Cek Langganan
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx`
*   **Instruksi:** Import dan gunakan kembali `<PricingSection />` di halaman ini agar UI/UX tetap konsisten dengan langkah pendaftaran.

Silakan eksekusi pembuatan alur *Multi-Step Onboarding* ini sekarang. Pastikan pengguna tidak akan melihat *Sidebar* sebelum mereka menyelesaikan pemilihan paket!
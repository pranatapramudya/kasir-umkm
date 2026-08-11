# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.23
**Fokus:** End-to-End Onboarding Flow, Tenant Initialization, & Post-Registration Routing

## 1. Analisis Bug Flow Pendaftaran & Onboarding
*   **Front-door UX:** Landing page kekurangan Call-to-Action (CTA) untuk pendaftaran akun baru.
*   **OTP Loading & Redirect:** Terdapat *delay* atau kebingungan rute pasca-verifikasi OTP Clerk.
*   **Tenant Identity:** Nama Toko yang diinput saat *onboarding* tidak muncul di UI manapun, memutus *sense of ownership* pengguna.
*   **Instant Expired Bug:** Setelah mensubmit form Nama Toko, pengguna langsung diarahkan ke Dashboard dengan status "Kedaluwarsa". Hal ini terjadi karena inisialisasi *Tenant* tidak secara otomatis menyuntikkan masa percobaan (Trial 14 Hari), dan halaman diarahkan ke rute yang salah.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan arsitektur *Onboarding* secara menyeluruh. DILARANG memberikan *output* kode mentah.

### A. Landing Page & Clerk Auth Flow
*   **Instruksi:** 
    1. Pada Landing Page (`app/page.tsx`), tambahkan teks atau tombol sekunder: **"Belum punya akun? Daftar di sini"** yang mengarah ke rute pendaftaran Clerk (`/sign-up`).
    2. Pastikan properti Clerk pada `layout.tsx` atau `middleware.ts` memiliki *redirect* yang tepat pasca-pendaftaran (misal: `afterSignUpUrl="/onboarding"`).

### B. Perbaikan Logic Onboarding (Backend)
*   **Target File:** Fungsi *Server Action* atau API yang memproses form `Nama Toko / Usaha` (misal: `app/onboarding/route.ts` atau *actions*).
*   **Instruksi (SANGAT KRUSIAL):** 
    1. Saat menyimpan nama toko baru ke database (tabel `Tenant` atau `Store`), Anda **WAJIB** menetapkan nilai default `subscriptionEndsAt` ke 14 hari dari sekarang. 
       *(Contoh logika: `const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate() + 14);`)*
    2. Simpan nilai string `storeName` ke dalam skema database.

### C. Redirect Pasca-Onboarding (Re-use UI)
*   **Instruksi:** 
    1. Setelah form Nama Toko berhasil disubmit dan *database* di-*update*, **JANGAN** arahkan pengguna ke `/admin` (Dashboard).
    2. Arahkan pengguna menggunakan `router.push('/admin/subscription')`. 
    3. Tujuannya agar pengguna baru langsung melihat layar "Cek Langganan" (yang memuat paket Trial 14 hari mereka yang baru aktif beserta katalog upgrade), tanpa perlu membuat UI *Pricing Page* yang baru.

### D. Injeksi Nama Toko pada Halaman Langganan
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx` (dan *Server Component* pembungkusnya).
*   **Instruksi:**
    1. *Fetch* nama toko pengguna dari *database*.
    2. Pada Kartu Status di sebelah kiri (yang berwarna gelap/putih), ubah label "STATUS AKUN" menjadi dinamis: **"STATUS AKUN - {NAMA TOKO}"** (Contoh: "STATUS AKUN - TOKO MAJU JAYA").
    3. Ini akan mempertegas bahwa status Trial/Pro tersebut mengikat pada toko yang baru saja mereka daftarkan.

Silakan eksekusi perbaikan alur *Onboarding* ini sekarang juga agar *user journey* menjadi masuk akal, lancar, dan profesional!
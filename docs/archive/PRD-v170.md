# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.70
**Fokus:** UI Spacing Polish & Superadmin Secret Backdoor Integration

## 1. Analisis Bug Visual & UX
*   **Visual Bug:** Logo "PJTECH KASIR" di pojok kiri atas menempel terlalu ketat dengan batas atas layar (tidak memiliki ruang napas/padding).
*   **UX Missing Feature:** Sejak perombakan UI, *Secret Backdoor* untuk akses Superadmin hilang dari halaman utama. Kita perlu mengintegrasikannya kembali secara elegan tanpa merusak estetika desain premium.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan *spacing* dan implementasikan pintu rahasia pada elemen logo. DILARANG memberikan *output* kode mentah panjang.

### A. Kalibrasi Spacing Logo (Kiri Atas)
*   **Target File:** `app/page.tsx`
*   **Instruksi Tailwind:**
    1. Cari elemen pembungkus (biasanya `div` atau `header`) dari logo "PJTECH KASIR" yang berada di kiri atas layar.
    2. Tambahkan kelas *padding* agar proporsional. Gunakan `p-8` atau kombinasi `pt-8 pl-8` (atau sesuaikan dengan ukuran *container*) agar logo tersebut sejajar dengan elemen di bawahnya dan tidak menabrak ujung atas peramban (*browser*).

### B. Integrasi "Stealth Backdoor" Superadmin
*   **Target File:** `app/page.tsx` (Elemen Logo PJTECH KASIR)
*   **Instruksi Logika:**
    1. Jadikan logo/teks "PJTECH KASIR" tersebut sebagai pintu rahasia untuk menuju `/superadmin`.
    2. Jika menggunakan Server Component: Gunakan fungsi `auth()` dari Clerk untuk mengecek `sessionClaims.metadata.role`.
    3. Jika menggunakan Client Component: Gunakan *hook* `useUser()` dari Clerk.
    4. **Aturan Render:** Jika pengguna yang *login* memiliki *role* `SUPERADMIN`, bungkus teks/logo tersebut dengan `<Link href="/superadmin">` (pastikan kelas CSS-nya tidak berubah menjadi biru seperti *link* biasa, pertahankan gradasi warna aslinya agar tetap tersamar). 
    5. Jika pengguna tidak *login* atau bukan Superadmin, render logo sebagai `div` atau `span` biasa tanpa tautan.

Silakan eksekusi perbaikan *layout* ini dan aktifkan kembali jalur VIP Superadmin!
# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.55
**Fokus:** BUGFIX - Stacking Context Trap pada Modal Paywall (Integrasi Clerk)

## 1. Analisis Bug Arsitektur (DOM Tree)
*   **Pemicu Bug:** Pengguna mengklik opsi kustom "Upgrade ke Pro" dari dalam komponen Clerk `<UserButton />` yang berada di *Header*.
*   **Gejala Visual:** Teks berukuran besar dari halaman utama ("Analitik & Laporan Premium") menembus (*bleed-through*) ke depan modal Paywall, menyebabkan teks saling bertumpuk dan tidak bisa dibaca.
*   **Akar Masalah (Root Cause):** Komponen Modal di- *render* sebagai anak (*child*) dari komponen *Header*. Karena *Header* memiliki *stacking context* yang berbeda (dan mungkin lebih rendah) dari kontainer utama halaman (*Main Content*), z-index tinggi pada modal tidak berlaku global. Modal terjebak di dalam batas lapisan *Header*.

## 2. Instruksi Eksekusi Arsitektur untuk AI Agent
Tugas Anda adalah merombak cara komponen Modal Paywall di- *render* ke layar tanpa memutus logika *state* `isOpen` yang dipicu dari tombol Clerk. Terapkan pola **React Portal**.

### A. Implementasi React Portal pada Modal
*   **Target File:** Komponen UI Modal Paywall (misalnya `PaywallModal.tsx` atau komponen serupa).
*   **Instruksi Logika React:**
    1. Import fungsi `createPortal` dari `react-dom`.
    2. Modifikasi blok `return` dari komponen modal tersebut. Alih-alih mengembalikan elemen JSX secara langsung, bungkus elemen JSX pembungkus terluar (yang memiliki *backdrop* hitam transparan) dengan `createPortal`.
    3. Arahkan target portal ke `document.body`. (Pastikan Anda menambahkan pengecekan *client-side* `typeof document !== 'undefined'` atau `useEffect` *mounted state* untuk menghindari *error hydration* di Next.js).
    4. *Dampak Arsitektur:* Dengan portal, meskipun secara logika React modal ini dipanggil dari dalam *Header*, secara fisik DOM HTML, elemen ini akan disuntikkan langsung tepat di bawah tag `<body>`. Ini membebaskan modal dari segala jebakan Z-Index kontainer induknya.

### B. Penguatan Soliditas Latar Belakang (Failsafe)
*   **Target:** Elemen kontainer putih utama di dalam Modal.
*   **Instruksi Styling (Tailwind):**
    1. Pastikan kontainer utama modal (yang membungkus ketiga kartu paket) memiliki utilitas warna solid murni tanpa opasitas bawaan.
    2. Pastikan kelas `bg-white` diterapkan dengan benar, dan hapus kelas opasitas atau *blend mode* apa pun yang mungkin tidak sengaja terbawa pada kontainer putih tersebut.

### C. Validasi QA
*   Klik kembali opsi "Upgrade ke Pro" dari profil Clerk Anda.
*   Modal harus muncul penuh di tengah layar, dan teks "Analitik & Laporan Premium" yang besar dari halaman belakang harus tertutup sempurna oleh efek transparan gelap, BUKAN menembus ke depan modal.
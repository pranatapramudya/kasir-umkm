# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.51
**Fokus:** Revisi UI Branding Onboarding & Halaman Langganan

## 1. Analisis Revisi UI
Berdasarkan tinjauan visual:
*   Pada form pendaftaran toko (`image_611e53.png`), *badge* biru "by PJTECH" bersifat *redundant* karena judul utama sudah memuat nama aplikasi. Ini harus dihapus.
*   Pada halaman pemilihan paket (`image_60cc19.png`), *badge* "BY PJTECH" berada di sebelah kanan judul utama, yang secara visual kurang seimbang. Posisi ini harus dipindahkan ke sudut kiri atas.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan modifikasi pada elemen *badge* di kedua komponen tersebut. DILARANG memberikan *output* kode mentah.

### A. Penghapusan Badge Redundan (Halaman Setup Toko)
*   **Target File:** Komponen form pengisian Nama Toko (misal: `app/(onboarding)/setup/page.tsx` atau komponen serupa).
*   **Instruksi:**
    1. Cari elemen HTML/JSX yang me-render judul `Selamat Datang di PJTECH`.
    2. Tepat di bawah elemen tersebut, cari komponen *badge* (biasanya dibungkus dengan `<span>` atau `<div>` berwarna biru) yang bertuliskan `by PJTECH`.
    3. **Hapus seluruh elemen badge tersebut** beserta jarak (margin/padding) yang mengelilinginya agar tampilan kembali bersih.

### B. Relokasi Badge PJTECH (Halaman Pilih Paket)
*   **Target File:** Komponen Pemilihan Paket Langganan (misal: `app/(onboarding)/subscription/page.tsx`).
*   **Instruksi:**
    1. Cari elemen *badge* bertuliskan `BY PJTECH` yang saat ini berada di sebelah kanan teks `Pilih Paket Langganan`.
    2. Pindahkan elemen tersebut agar berada di **sudut kiri atas** layar (atau sudut kiri atas dalam *container/card* utama).
    3. **Rekomendasi Tailwind:** Gunakan *absolute positioning* (misal: bungkus *container* utama dengan `relative`, lalu beri *class* `absolute top-6 left-6` atau `top-8 left-8` pada *badge*) ATAU letakkan *badge* tersebut di bagian atas tata letak (*layout*) dengan perataan kiri (`flex justify-start mb-4`).
    4. Pastikan posisi barunya terlihat proporsional dan tidak menabrak elemen lain.

Silakan eksekusi revisi visual ini agar *branding* PJTECH terlihat lebih profesional dan *clean*!
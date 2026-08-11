# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.69
**Fokus:** UI Scaling & Viewport Overflow Fix (No-Scroll Layout)

## 1. Analisis Bug UI
*   **Masalah:** Komponen *Bento-Grid Showcase* 3D di sebelah kiri memiliki dimensi atau skala yang terlalu besar, sehingga mendorong batas *container* utama ke bawah dan menyebabkan layar dapat di-*scroll* sedikit secara vertikal (*viewport overflow*).
*   **Target UX:** Halaman pendaratan (*Landing Page*) di *desktop/tablet* harus berukuran persis satu layar penuh (`100vh`) dan terkunci rapat tanpa adanya *scrollbar* vertikal.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan kalibrasi ukuran dan penyesuaian kelas Tailwind untuk mengunci tata letak. DILARANG memberikan *output* kode mentah panjang.

### A. Kalibrasi Skala Bento-Grid (Kiri)
*   **Target File:** `app/page.tsx`
*   **Instruksi Tailwind:**
    1. Cari elemen pembungkus (*wrapper*) dari *Bento-Grid 3D Showcase* tersebut.
    2. Kurangi ukuran transformasinya. Jika menggunakan `scale-110` atau `scale-125`, turunkan menjadi `scale-90` atau `scale-95`.
    3. Kurangi jarak atasnya. Jika ada `mt-12` atau `mt-20` (margin-top) yang memisahkan teks judul dengan elemen 3D ini, kurangi menjadi `mt-6` atau `mt-8` agar elemen 3D naik ke atas dan tidak menabrak batas bawah layar.
    4. Kurangi sedikit *padding* internal di dalam *grid dummy* jika masih memakan terlalu banyak ruang vertikal.

### B. Penguncian Viewport Container Utama
*   **Target File:** `app/page.tsx`
*   **Instruksi Tailwind:**
    1. Pastikan *container* paling luar (yang memiliki *mesh gradient*) menggunakan `h-screen` atau `min-h-screen` dipadukan dengan `overflow-hidden`.
    2. Penggunaan `overflow-hidden` pada elemen *root* halaman ini akan memotong secara elegan sisa bayangan atau ujung elemen 3D yang mencoba keluar dari layar, sehingga *scrollbar* vertikal akan lenyap.

Silakan eksekusi penyesuaian CSS ini agar halaman *Landing Page* terlihat padat, pas, dan presisi di layar desktop/tablet!
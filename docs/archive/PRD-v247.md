# Product Requirements Document: PJTECH KASIR UMKM (LumeStack)
**Versi:** 0.2.47
**Fokus:** Optimasi Ekstrim Lighthouse Mobile (Target 90+ Score)

## 1. Objektif
Menyelesaikan masalah "Minimize main-thread work" dan "Reduce unused JavaScript" pada Lighthouse Mobile. Mengoptimalkan pengiriman bundel JavaScript agar tidak memblokir render pertama (First Contentful Paint & Largest Contentful Paint).

## 2. Analisis Masalah
Berdasarkan metrik Lighthouse Mobile, ada sekitar 353 KiB JavaScript yang tidak terpakai saat *load* awal, dan *main-thread* terblokir selama hampir 4 detik. Hal ini biasanya disebabkan oleh:
1. Komponen berat (Chart, Modal, DatePicker, Icon Library) dimuat secara sinkron di halaman utama.
2. Library pihak ketiga (seperti PapaParse untuk CSV) ikut ter-bundle padahal hanya diakses saat tombol diklik.
3. Terhalangnya Back/Forward Cache (bfcache).

## 3. Eksekusi Optimasi (Next.js Performance Tuning)

**A. Implementasi `next/dynamic` (Lazy Loading Komponen)**
*   **Target File:** Halaman yang memuat komponen berat (misal: `Dashboard.tsx`, `Cart.tsx`, `Products.tsx`).
*   **Instruksi:**
    1. Identifikasi komponen yang **tidak langsung terlihat** di layar atas (Below the Fold) atau yang berada di dalam Modal/Popup.
    2. Ubah import statis komponen tersebut menjadi *dynamic import*.
       *Contoh:* 
       `const LaporanChart = dynamic(() => import('@/components/LaporanChart'), { ssr: false })`
    3. Terapkan lazy loading ini khusus pada:
       - Komponen Grafik / Chart (Recharts/Chart.js).
       - Modal Panduan Printer, Modal Modifier F&B, dan Modal Import CSV yang baru saja dibuat.
       - Library eksternal berat yang hanya bereaksi pada event (misal: jalankan fungsi import PapaParse HANYA di dalam blok fungsi `handleFileUpload`).

**B. Optimasi Import Ikon (Tree Shaking)**
*   **Target:** Seluruh file yang menggunakan Lucide React / Heroicons.
*   **Instruksi:** Pastikan Anda mengimpor ikon secara spesifik jika *bundler* tidak melakukan *tree-shaking* dengan baik, atau pastikan konfigurasi bundel Next.js sudah mengoptimalkan modul ikon agar tidak mengunduh seluruh kamus ikon.

**C. Perbaikan bfcache (Back/Forward Cache)**
*   **Target:** Konfigurasi global atau event listener.
*   **Instruksi:** Lighthouse melaporkan *"Page prevented back/forward cache restoration"*. Cari di dalam *codebase* apakah ada penggunaan `window.addEventListener('unload', ...)` yang tidak disengaja, dan ubah menjadi event `pagehide` atau `visibilitychange` agar browser mobile bisa menyimpan halaman di dalam memori saat user melakukan *swipe-back*.

Silakan audit komponen di Client-Side dan jalankan pemecahan bundel (Code Splitting) menggunakan `next/dynamic` sekarang juga.
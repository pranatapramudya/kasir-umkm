# Changelog Weekend Sprint
**Tanggal:** 16 Agustus 2026

## Fitur & Pembaruan Selesai:
1. **Dynamic Mobile Navigation:** Refaktor `BottomNav` menjadi komponen server global dengan *rendering* kondisional berdasarkan tipe bisnis (Retail vs Jasa) dan penyesuaian *routing redirect* pasca-login.
2. **UI/UX Flexbox Fix:** Perbaikan *horizontal overflow* pada kartu Manajemen Layanan menggunakan `flex-1`, `min-w-0`, dan `truncate` agar antarmuka tidak terpotong pada layar kecil.
3. **Rental Calendar Module:** Pembuatan Kalender Sewa Harian (*Split View*) yang terintegrasi langsung dengan database Prisma, dilengkapi pengambilan data dinamis dengan filter isolasi Multi-Tenant untuk manajemen penyewaan/travel.
4. **PWA Cache Busting:** Pembaruan konfigurasi `manifest.ts` (penambahan parameter `?v=2` pada source image) dan metadata global `app/layout.tsx` (tag `apple-touch-icon`) untuk sinkronisasi paksa pembaruan logo saat diinstal di perangkat seluler.

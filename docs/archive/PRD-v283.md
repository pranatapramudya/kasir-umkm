# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.83
**Fokus:** PWA Cache Busting & Sinkronisasi App Icon (Manifest & Metadata)

## 1. Analisis Masalah (Aggressive PWA Caching)
File ikon PWA yang baru (`icon-192x192.png` dan `icon-512x512.png`) sudah berada di folder `public`. Namun, saat diinstal ke perangkat seluler, logo lama dan *splash screen* lama masih muncul. Ini terjadi karena *browser cache* tidak ter-invaliasi (nama file tidak berubah) dan kemungkinan kurangnya tag `apple-touch-icon` pada metadata Next.js.

## 2. Instruksi Eksekusi (Next.js Metadata & Manifest)
**Target File:** `public/manifest.json` (atau file generator `manifest.ts`), dan `app/layout.tsx` (bagian `metadata`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Invalidate Cache di manifest.json:**
1. Buka konfigurasi manifest PWA Anda.
2. Pada *array* `icons`, tambahkan *query parameter* versi pada *path source* gambarnya untuk memaksa browser memuat ulang gambar. 
   - Ubah `"src": "/icon-192x192.png"` menjadi `"src": "/icon-192x192.png?v=2"`
   - Ubah `"src": "/icon-512x512.png"` menjadi `"src": "/icon-512x512.png?v=2"`
3. Pastikan `background_color` dan `theme_color` disesuaikan dengan warna dominan logo baru agar *splash screen* bawaan Android terlihat menyatu.

**B. Update Metadata Global (app/layout.tsx):**
1. Pastikan objek `metadata` di *root layout* memiliki konfigurasi *icons* yang terarah ke gambar baru dengan *query parameter* yang sama.
2. Tambahkan spesifikasi khusus untuk iOS (Apple) agar logo muncul presisi di iPhone:
   - Definisikan `apple: '/icon-192x192.png?v=2'` di dalam objek `icons`.
   - Opsional: Tambahkan properti `appleWebApp: { capable: true, statusBarStyle: 'default', title: 'PJTECH KASIR' }` pada objek metadata.

Silakan sinkronisasi urusan *manifest* dan *metadata* ini. Lapor jika *cache busting* dan tag *apple-touch-icon* sudah aktif!
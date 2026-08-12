# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.17
**Fokus:** Bugfix Redirect Langganan, Update QRIS, & Copywriting Paket Hardware

## 1. Bugfix: Hentikan Redirect Agresif di Halaman Subscription
**Konteks Masalah:** Pengguna yang sedang berada di halaman pemilihan paket (Pricing/Subscription) tiba-tiba ter-redirect ke dashboard utama dengan status "Kadaluarsa" setelah beberapa detik/menit.
**Target File:** `middleware.ts`, atau *layout/page* yang membungkus halaman Subscription (misal `app/admin/subscription/page.tsx`), atau *hooks* otentikasi/langganan (misal `useSubscription`).
**Instruksi:**
- Cek logika *redirect* kadaluarsa (*expired check*). 
- **Pengecualian Rute (Bypass):** Jika URL saat ini sudah berada di halaman pemilihan paket/langganan (misal `/admin/subscription` atau `/pricing`), sistem **DILARANG KERAS** melakukan *redirect* paksa. Biarkan pengguna membaca halaman tersebut selama apa pun.
- Hapus timer atau *polling* interval yang me-refresh halaman secara otomatis jika posisi *user* sedang berada di halaman pembayaran/pemilihan paket.

## 2. Update Metode Pembayaran: QRIS Dinamis
**Target File:** Komponen Checkout/Pembayaran (misal `CheckoutModal.tsx` atau `PaymentPage.tsx`).
**Instruksi:**
- Ubah seluruh *source image* (src) untuk metode pembayaran QRIS menjadi `/qris.jpeg` (file berada di folder `public`).
- Pastikan gambar `/qris.jpeg` ini yang dirender saat pengguna memilih pembayaran untuk:
  - Paket Pro 6 Bulan.
  - Paket Pro 1 Tahun (Software Saja).
  - Paket Pro 1 Tahun (+ Hardware).

## 3. Update Copywriting: Benefit & Syarat Ketentuan
**Target File:** Komponen Pricing Card (misal `components/Pricing.tsx` atau konstan `pricing.ts`).
**Instruksi:**
1. **Paket Pro 6 Bulan:** 
   - Pada bagian "Lihat Syarat & Ketentuan" (atau modal yang terbuka saat diklik), perjelas teks: **"Paket ini hanya mencakup Lisensi Software PJTECH Kasir. Tidak termasuk peminjaman perangkat keras (Tablet/Printer)."**
2. **Paket Pro Tahunan (Tab: + Hardware):**
   - Tambahkan *list* benefit (dengan ikon centang hijau) yang sangat menonjol di bagian bawah fitur.
   - Teks Benefit 1: **"Gratis Peminjaman 1 Set Kasir (Tablet & Printer Bluetooth)."**
   - Teks Benefit 2: **"Perangkat menjadi HAK MILIK Anda sepenuhnya pada perpanjangan tahun berikutnya."**

Silakan eksekusi ketiga poin ini dengan hati-hati. Pastikan halaman langganan stabil dan tidak menendang user keluar secara tiba-tiba!
# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.31
**Fokus:** Tenant Isolation (Anti-Leak), Real-time Sync, Dynamic Excel, & UI UX Enhancements

## 1. Analisis Masalah
Sistem saat ini mengalami 5 isu krusial:
1. **Data Leakage (Stale Cache):** Saat pergantian sesi login antar tenant, data tenant lama muncul sekilas (FOUC / Stale State) karena *cache browser* atau *state management* tidak dibersihkan dengan benar.
2. **Real-time & Tenant Isolation:** Order masuk belum terdeteksi secara instan (real-time) dan berisiko menyeberang ke "kamar" (tenant) lain jika *listener* tidak diisolasi.
3. **UX Kalender:** Semua kartu pesanan berwarna sama (kuning), menyulitkan pemantauan visual.
4. **Excel Export:** Format laporan unduhan masih absolut/statis, tidak beradaptasi dengan model bisnis.
5. **Onboarding:** Tidak ada dokumentasi/panduan alur kerja (*SOP*) yang spesifik untuk masing-masing model bisnis di dalam aplikasi.

## 2. Instruksi Eksekusi (Full Stack Re-architecture)

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Security Fix: Tenant Isolation & Cache Wiping (Krusial!)**
1. **On-Logout / On-Login Wipe:** Pastikan fungsi *logout* dan proses *login* memicu pembersihan *cache* secara total. Bersihkan `localStorage`, `sessionStorage`, reset *global state* (Zustand/Redux), dan lakukan `queryClient.clear()` (jika memakai React Query) atau `router.refresh()` (Next.js).
2. **Strict Render Block:** Saat halaman *Dashboard* dimuat, cek apakah `storeId` dari sesi *User* cocok dengan `storeId` dari data yang di-*fetch*. Jika sedang transisi, tampilkan komponen `<LoadingSkeleton />` berwarna abu-abu. **JANGAN PERNAH** merender UI tabel/kalender jika data yang di-cache tidak cocok dengan ID pengguna saat ini!

**B. Real-time Order Sync dengan Channel Isolation:**
1. Integrasikan *Real-time Listener* (misal: Supabase Realtime, Pusher, atau SWR Fast Polling).
2. **Wajib:** Isolasi *channel subscription* menggunakan `storeId` atau `tenantId`. (Contoh: subscribe ke channel `orders_store_123`).
3. Saat *event payload* baru masuk, langsung *inject* data tersebut ke *state* tabel Inbox atau Kalender tanpa perlu me-*refresh* halaman.

**C. Visual & UX Fix: Warna Kalender Berdasarkan Status:**
1. Buka komponen kalender (yang me-render `image_24921e.png`).
2. Terapkan pewarnaan kondisional (*background color* / *border*) pada *event block*:
   - `PENDING` (Menunggu): Kuning/Amber.
   - `COMPLETED` (Siap Berangkat): Biru/Indigo.
   - `IN_PROGRESS` (Sedang Jalan): Hijau Terang / Emerald.
   - `FINISHED` (Selesai): Abu-abu atau Hijau Tua.

**D. Dynamic Excel Export:**
1. Buka fungsi *export to Excel* (misal menggunakan library `xlsx`).
2. Gunakan *switch/case* berdasarkan `businessType` untuk membentuk susunan kolom *header*:
   - **Rental/Travel:** Tanggal, Pelanggan, Armada, Mulai Sewa, Selesai Sewa, Tujuan, Total.
   - **Jasa/Servis:** Tanggal, Pelanggan, Layanan, Waktu Booking, Terapis/Kapster, Total.
   - **Retail & F&B:** Tanggal, Item, Qty, Harga Satuan, Kasir, Total.

**E. Fitur "Buku Panduan" (Interactive Docs):**
1. Buat satu komponen UI baru berupa Modal atau Halaman `Panduan Penggunaan` (diakses dari Sidebar bawah atau ikon Bantuan).
2. Render isi konten secara dinamis (If/Else) sesuai tipe bisnis:
   - **Alur F&B/Retail:** Jelaskan cara tambah menu/produk -> buka kasir -> cetak struk -> tutup shift.
   - **Alur Jasa:** Jelaskan cara buat layanan -> atur link booking -> terima antrean -> proses di kasir.
   - **Alur Rental:** Jelaskan cara tambah armada -> atur harga -> terima pesanan -> klik start di kalender -> lunas.
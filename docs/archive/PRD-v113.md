# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.13
**Fokus:** Menghapus Redudansi Widget Sidebar & Cleanup UI Langganan

## 1. Analisis Perubahan UI/UX (Clean Sidebar)
*   **Masalah Redudansi:** Kotak hitam status trial (yang menampilkan sisa hari, tanggal kedaluwarsa, dan tombol "Perpanjangan Berbayar") di bagian bawah *Sidebar* saat ini tumpang tindih fungsinya dengan halaman khusus `/admin/subscription` (Paket & Tagihan) yang sudah jauh lebih informatif.
*   **Solusi:** 
    1. **Hapus Total Widget Kotak Hitam** dari bagian bawah komponen `SidebarClient.tsx`. Biarkan bagian bawah sidebar bersih.
    2. Menu navigasi "Langganan" pada grup *Sistem & Laporan* di sidebar sudah sangat cukup sebagai satu-satunya pintu masuk bagi Owner untuk mengecek masa aktif dan memperpanjang paket.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbersihan kode secara langsung pada *codebase*. DILARANG memberikan *output* kode mentah.

### A. Membersihkan Widget Sidebar
*   **Target File:** `components/SidebarClient.tsx`
*   **Instruksi:**
    1. Temukan blok kode JSX/Tailwind yang merender kotak hitam/gelap berisi status *Trial/Active* dan tombol *Perpanjangan Berbayar* di bagian dasar komponen.
    2. **Hapus blok tersebut sepenuhnya** dari *layout* Sidebar.
    3. Pastikan penutupan kontainer tag HTML (`div`, `nav`, dsb.) tetap rapi dan tidak merusak fungsi *Sidebar Drawer* pada perangkat *Mobile/Tablet*.

### B. Optimalisasi Tampilan Halaman Paket & Tagihan
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx`
*   **Instruksi:** Pastikan halaman utama "Paket & Tagihan" yang sudah jadi pada *screenshot* sebelumnya tetap dipertahankan karena desain kartu status dan katalog harganya sudah sangat rapi dan intuitif.

Silakan eksekusi penghapusan widget redundan di sidebar tersebut sekarang, sehingga tampilan aplikasi LumeStack semakin bersih dan profesional!
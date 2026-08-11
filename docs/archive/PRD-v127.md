# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.27
**Fokus:** Double-Click Resolution & Global Metadata Title Branding

## 1. Analisis Bug & Perbaikan Terakhir
*   **Double-Click Latency:** Pengguna harus menekan tombol pilihan paket sebanyak 2 kali saat *onboarding* agar proses eksekusi berjalan. Ini menunjukkan adanya *delay state update* atau penanganan *async click handler* yang kurang responsif.
*   **Hardcoded Tab Title:** Judul jendela/tab *browser* masih menampilkan teks spesifik "Warung Kopi Prana - Kasir Digital". Sebagai template SaaS komersial, judul global ini harus diubah secara permanen menjadi format *branding* resmi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan langsung pada *codebase*. DILARANG memberikan *output* kode mentah.

### A. Fix Double-Click (Responsivitas Tombol Paket)
*   **Target File:** Komponen `<PricingSection />` (`components/PricingSection.tsx`).
*   **Instruksi:** 
    1. Periksa fungsi *event handler* pada tombol "Gunakan Akses Trial" atau paket berbayar. 
    2. Pastikan tidak ada *state race condition* atau *debounce* berlebih yang menahan klik pertama. 
    3. Tambahkan indikator *loading* instan (misal mengubah teks tombol menjadi "Memproses..." saat diklik pertama kali) untuk memastikan pengguna tahu bahwa klik mereka langsung diterima tanpa harus menekan tombol dua kali.

### B. Global Metadata & Browser Title Update
*   **Target File:** Root Layout (`app/layout.tsx`).
*   **Instruksi:**
    1. Cari objek `metadata` di bagian atas file `layout.tsx`.
    2. Ubah properti `title` secara permanen menjadi:
       `title: "PJTECH-KASIR POS UMKM"`
    3. Ubah properti `description` agar relevan dengan platform SaaS kasir digital (Contoh: `"Sistem Manajemen Kasir & POS UMKM Berbasis Cloud"`).

Silakan eksekusi dua perbaikan akhir ini sekarang juga. Pastikan tombol sekali klik langsung responsif dan judul tab *browser* berubah total menjadi PJTECH!
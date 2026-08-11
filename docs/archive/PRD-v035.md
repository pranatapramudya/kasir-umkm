# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.35
**Fokus:** Polesan UI Logo Branding & Pembaruan Copywriting Paket Pro Tahunan

## 1. Analisis Kebutuhan
*   **Kekurangan UI:** Teks "dev by PJTECH" di sudut kiri atas masih terlihat kaku dan menggunakan gaya *font* standar, sehingga gagal memberikan kesan *brand* premium.
*   **Kekurangan UX (Pricing Strategy):** Fitur antara Paket Bulanan dan Tahunan terasa identik. Diperlukan penambahan *copywriting* pada daftar fitur Paket Tahunan yang menonjolkan fitur tingkat *Enterprise/Owner-centric* untuk membenarkan (*justify*) harga berlangganan yang lebih tinggi.

## 2. Instruksi Eksekusi untuk AI Agent
Terapkan dua perbaikan visual dan teks berikut secara presisi.

### A. Polesan UI Branding (Logo PJTECH)
*   **Target File:** Komponen UI Modal Paywall/Pricing.
*   **Instruksi Styling Teks Logo:**
    *   Ubah bagian tulisan "dev by" menjadi lebih elegan: Gunakan kelas `text-[8px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest mr-1`.
    *   Ubah tulisan "PJTECH" menjadi logo bergaya modern dengan efek gradasi: Gunakan kelas `text-xs md:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter`.
    *   Pastikan *container* logo sejajar tengah secara vertikal (`flex items-center`).

### B. Pembaruan Copywriting (Daftar Fitur Paket)
*   **Target File:** Data *array* atau komponen UI yang menyimpan teks daftar fitur pada **Paket Pro Tahunan**.
*   **Instruksi:** Hapus daftar fitur lama pada Paket Tahunan dan ganti dengan *copywriting* yang lebih bernilai jual tinggi (*high-value*) berikut ini:
    *   Semua Fitur Pro Bulanan
    *   **Analisis Jam Sibuk:** Pantau waktu teramai toko Anda.
    *   **Peringatan Stok Cerdas:** Notifikasi otomatis saat stok menipis.
    *   **Laporan Multi-Kasir:** Lacak performa penjualan tiap pegawai.
    *   **Analitik Produk (ABC):** Deteksi produk terlaris & *dead stock*.
    *   **Database Pelanggan:** Kenali dan catat pembeli paling loyal.
*   **Catatan Mikro-UI Mobile:** Jika teks di atas terlalu panjang dan membuat layout *mobile* berantakan, singkat teksnya khusus di *mobile* (contoh: "Analitik Produk (ABC)" menjadi "Analitik Produk").
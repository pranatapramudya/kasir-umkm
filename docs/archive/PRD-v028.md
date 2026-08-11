# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.28
**Fokus:** Desain UI/UX Paywall Subscription (3 Tiers) & Penjabaran Fitur

## 1. Analisis Kebutuhan
*   **Kondisi Saat Ini:** Tombol "Lihat Analitik" memicu *paywall* generik, namun belum menampilkan opsi paket berlangganan yang jelas bagi pengguna.
*   **Tujuan:** Merombak Modal Paywall menjadi halaman/tampilan *Pricing Tiers* yang profesional, menampilkan 3 pilihan paket langganan secara berdampingan (Free Trial, Bulanan, dan Tahunan) beserta perbandingan fiturnya.

## 2. Spesifikasi Paket (Pricing & Features)
Instruksikan komponen UI untuk merender data paket berikut ke dalam bentuk *Pricing Cards*:

### A. Paket "Mulai Usaha" (Free Trial 14 Hari)
*   **Harga:** Rp 0 (Gratis 14 Hari Pertama)
*   **Target:** Pengguna baru yang ragu dan ingin mencoba.
*   **Fitur yang Ditampilkan:**
    *   Akses Kasir (Point of Sales) Penuh
    *   Manajemen Produk Dasar
    *   Buka Kunci Dasbor Analitik (Terbatas selama masa percobaan)

### B. Paket "Pro Bulanan"
*   **Harga:** Rp 99.000 / bulan
*   **Target:** UMKM yang butuh fleksibilitas *cashflow*.
*   **Fitur yang Ditampilkan:**
    *   Semua fitur Kasir & Produk
    *   Laporan Pendapatan & Laba Bersih
    *   Manajemen Stok Otomatis
    *   Ekspor Data Laporan (Excel/CSV)

### C. Paket "Pro Tahunan" (Best Value)
*   **Harga:** Rp 1.188.000 / tahun (Hemat 2 Bulan)
*   **Target:** Pemilik bisnis serius yang butuh data mendalam.
*   **Fitur yang Ditampilkan (Highlight/Berikan tanda khusus):**
    *   *Mencakup Semua Fitur Pro Bulanan*
    *   **Analitik Lanjutan:** Grafik Tren Penjualan & Jam Sibuk
    *   **Laporan Performa:** Analisis Produk Terlaris & *Dead Stock*
    *   **Kustomisasi Ekstra:** Logo & Nama Toko di Struk Digital
    *   *Priority Support* (Layanan Bantuan Cepat)

## 3. Instruksi Eksekusi UI/UX untuk AI Agent
*   **Target File:** Komponen Paywall/Modal Subscription yang dipicu oleh tombol "Lihat Analitik 👑".
*   **Struktur Visual:**
    *   Gunakan *layout* CSS Grid (`grid-cols-1 md:grid-cols-3`) agar ketiga kartu paket tampil vertikal di *mobile* dan horizontal berdampingan di *desktop*.
    *   Berikan efek visual khusus (misal: *border* emas, *badge* "Paling Populer", atau *shadow* lebih tebal) pada **Paket Pro Tahunan** untuk memancing mata pengguna (strategi *Decoy Effect*).
    *   Gunakan ikon *Checklist* hijau untuk setiap poin fitur agar terlihat rapi.
    *   Tiap kartu harus memiliki tombol *Call to Action* (CTA) di bagian bawah (contoh: "Mulai Trial", "Pilih Bulanan", "Pilih Tahunan").
*   **Fungsi Tombol (Sementara):** Untuk versi saat ini, arahkan tombol pemilihan paket ke sebuah *state loading* atau tampilkan notifikasi *toast* "Integrasi pembayaran segera hadir!".
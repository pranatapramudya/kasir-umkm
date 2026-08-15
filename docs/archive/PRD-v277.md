# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.77
**Fokus:** Sinkronisasi End-to-End Pricing (Decoy), Pembaruan T&C, & Modul Hardware Affiliate

## 1. Analisis Masalah (Business Model Pivot)
Kita melakukan *pivot* pada strategi monetisasi. Penjualan *bundling hardware* fisik ditiadakan untuk menghindari risiko logistik dan klaim garansi. Sebagai gantinya, aplikasi hanya fokus menjual Lisensi Software (SaaS), dan menyediakan *Affiliate Hub* untuk rekomendasi perangkat keras.
Selain itu, strategi *Decoy Pricing* diterapkan dengan menambahkan paket bulanan. Perubahan ini menuntut sinkronisasi data dari hulu (Onboarding/Registrasi) hingga ke hilir (Dashboard Langganan & Syarat Ketentuan).

## 2. Instruksi Eksekusi (Full-Stack Sync & UI)
**Target File:** Komponen Onboarding, Halaman `/admin/langganan`, Halaman T&C, dan Menu Baru `/admin/hardware`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Sinkronisasi Data Paket (Hulu ke Hilir):**
1. Buat/Update variabel *pricing* global. Paket baru yang tersedia:
   - **Paket 1 Bulan (Decoy):** Rp 129.000
   - **Paket 6 Bulan:** Rp 594.000
   - **Paket 12 Bulan (Best Value):** Rp 990.000 (Berikan label/badge visual yang paling mencolok seperti "Paling Hemat!").
2. **Onboarding Update:** Perbarui UI formulir pemilihan paket saat *user* baru pertama kali mendaftar. Pastikan ketiga opsi ini muncul dengan paket 12 bulan sebagai *default/highlight*.
3. **Billing Dashboard Update:** Sinkronkan menu "Langganan" di dalam aplikasi agar menampilkan ketiga paket ini saat *user* ingin memperpanjang/upgrade lisensi.

**B. Pembaruan Syarat & Ketentuan (T&C Legal Protection):**
1. Perbarui teks pada halaman Syarat & Ketentuan (T&C).
2. Tambahkan klausa tegas yang menyatakan: *"PJTECH KASIR UMKM hanya menyediakan layanan perangkat lunak (Software). Seluruh perangkat keras (Hardware) yang dibeli melalui tautan rekomendasi pihak ketiga (Affiliate) adalah tanggung jawab penuh dari penjual/marketplace terkait. Kami tidak menerima klaim garansi, retur, atau dukungan teknis atas kerusakan perangkat keras."*

**C. Pembuatan Modul "Rekomendasi Alat Kasir" (Affiliate Hub):**
1. Tambahkan satu menu baru di Sidebar Navigation (misal di bawah menu "Langganan") dengan nama **"Alat Kasir"** atau **"Rekomendasi Hardware"**.
2. Buat UI *Grid/Card* sederhana yang menampilkan gambar perangkat (Tablet Android, Printer Thermal 58mm, Stand Holder).
3. Berikan tombol seperti "Beli di Tokopedia" atau "Beli di Shopee" yang nantinya akan disematkan *link affiliate* (buatkan *placeholder link*-nya sementara).

Silakan eksekusi perombakan bisnis *end-to-end* ini secara presisi! Pastikan tidak ada harga lama yang tertinggal di halaman manapun!
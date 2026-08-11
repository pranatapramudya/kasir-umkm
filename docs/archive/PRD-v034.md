# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.34
**Fokus:** Penambahan Elemen Branding (Logo PJTECH) pada Modal Paywall

## 1. Analisis Kebutuhan
*   **Kondisi Saat Ini:** Tampilan Modal Paywall (3 Paket) sudah berfungsi dengan baik dan responsif (*ultra-compact* di *mobile*). Namun, ruang kosong di sudut kiri atas modal terasa sepi dan kurang merepresentasikan identitas kreator.
*   **Tujuan:** Menambahkan elemen *branding* atau *watermark* berupa logo/teks "dev by PJTECH" di pojok kiri atas *container* modal, baik pada tampilan *mobile* maupun *desktop*. Ini penting untuk memperkuat nilai merek (*brand value*) dari produk SaaS Boilerplate ini.

## 2. Instruksi Eksekusi UI/UX untuk AI Agent
Tambahkan elemen *branding* ke dalam struktur komponen Modal Paywall tanpa merusak *layout grid* yang sudah ada.

### A. Penambahan Elemen Logo/Branding
*   **Target File:** Komponen UI Modal Paywall/Pricing.
*   **Lokasi Penyisipan:** Di dalam *container* utama modal (biasanya elemen `div` berwarna putih yang membungkus seluruh konten), posisikan di bagian paling atas sebelum teks judul "Pilih Paket Langganan".
*   **Instruksi Styling (Tailwind):**
    1.  Buat elemen pembungkus teks dengan posisi absolut atau sejajar dengan tombol *close* (silang) di sudut berlawanan. Contoh: `<div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center">...</div>`.
    2.  Tambahkan teks "dev by" dengan ukuran kecil dan warna pudar (contoh: `text-[10px] md:text-xs text-gray-400 mr-1`).
    3.  Tambahkan nama *brand* "PJTECH" dengan ukuran yang sedikit lebih besar dan warna yang mencolok atau tebal (contoh: `text-xs md:text-sm font-black tracking-tighter text-blue-600`).
    4.  *(Opsional)* Jika sebelumnya sudah ada aset gambar logo statis (misalnya `logo.png` atau `logo.svg` di folder `public`), Anda dapat menggunakan tag `<Image>` dari `next/image` berdampingan dengan teks tersebut. Pastikan ukurannya dibatasi (contoh: `w-6 h-6 md:w-8 md:h-8`).

### B. Validasi Responsivitas
*   Pastikan penambahan logo/teks di sudut kiri atas ini tidak bertumpuk (*overlap*) dengan judul modal ("Pilih Paket Langganan") atau deskripsi di bawahnya, baik pada layar *mobile* maupun *desktop*. Berikan *margin* atau atur posisi absolutnya dengan presisi.
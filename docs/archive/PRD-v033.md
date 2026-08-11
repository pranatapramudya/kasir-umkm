# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.33
**Fokus:** Ultra-Compact Mobile Paywall (Fit 3 Columns in 1 Viewport)

## 1. Analisis Masalah (Responsive Layout)
*   **Gejala:** Pada implementasi sebelumnya, kartu harga masih terlalu besar di layar *mobile* sehingga menutupi layar dan mengharuskan pengguna melakukan *scrolling*. 
*   **Tujuan Eksak:** Pengguna (Owner) menginstruksikan agar **ketiga paket (Mulai Usaha, Pro Bulanan, Pro Tahunan) HANYA memakan 1 layar penuh mobile secara bersamaan** tanpa perlu digeser (no horizontal/vertical scrolling). 
*   **Solusi:** Memaksakan *layout* 3 kolom (`grid-cols-3`) di semua perangkat, dengan mengorbankan ukuran teks (*micro-typography*), menyembunyikan deskripsi panjang di versi *mobile*, dan merapatkan *padding*.

## 2. Instruksi Eksekusi UI/UX Ekstrim untuk AI Agent
Rombak total kelas Tailwind pada komponen Pricing Modal/Paywall. Terapkan instruksi ini secara presisi:

### A. Paksa Layout 3 Kolom (Force 3-Columns Grid)
*   **Target:** Container utama pembungkus ketiga kartu.
*   **Instruksi:** Hapus kelas `flex`, `overflow-x-auto`, atau `flex-col`. Ganti HANYA dengan kelas ini: `grid grid-cols-3 gap-1 md:gap-4 w-full`. (Ini akan memaksa 3 kartu berjejer berdampingan di ukuran layar apa pun).

### B. Micro-Typography & Pengurangan Elemen (Mobile-First)
Karena masing-masing kartu sekarang hanya memiliki lebar sepertiga dari layar *mobile*, setiap elemen di dalamnya harus dikompresi secara drastis.
*   **Padding Kartu:** Ubah menjadi `p-2 md:p-6`.
*   **Sembunyikan Deskripsi:** Sembunyikan teks deskripsi abu-abu (contoh: "Pengguna baru yang ragu...") HANYA di versi *mobile* agar tidak memakan ruang tinggi. Gunakan kelas `hidden md:block`.
*   **Judul Paket:** Ubah ukuran font menjadi `text-[10px] sm:text-xs md:text-xl font-bold leading-tight`.
*   **Harga Paket:** Ubah ukuran font harga menjadi `text-sm sm:text-base md:text-3xl font-extrabold`.
*   **List Fitur (Checklist):** 
    *   Ubah ikon centang menjadi lebih kecil (`size-3` atau `size-4`).
    *   Ubah teks fitur menjadi `text-[8px] sm:text-[10px] md:text-sm leading-tight`. (Teks harus sangat kecil agar muat dalam kolom sempit).
*   **Badge "Paling Populer":** Perkecil ukuran *badge* di paket tahunan menjadi `text-[8px] px-1 py-0.5 md:text-xs`.

### C. Kompresi Tombol CTA
*   **Target:** Tombol aksi di bagian bawah setiap kartu.
*   **Instruksi:** Ubah kelas padding dan font tombol menjadi `py-1 px-1 text-[8px] sm:text-[10px] md:text-base md:py-2`.

### D. Validasi Hasil
*   Simulasikan di *Mobile Viewport* (contoh: iPhone 12/13 di Inspect Element). Pastikan ketiga kartu berdiri berdampingan secara proporsional dan teksnya tidak luber/keluar dari kotak (*overflow*). Seluruh opsi harus terlihat langsung saat modal terbuka.
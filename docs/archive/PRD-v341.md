# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.41
**Fokus:** Bug Fix - Rendering Ganda SOP & Peningkatan UI/UX Timeline Panduan

## 1. Analisis Masalah
1. **Critical Logic Bug (Double Rendering):** Pada komponen `BukuPanduanModal.tsx`, terjadi kebocoran logika *conditional rendering*. Alur kerja (SOP) untuk entitas "Jasa" dan "Rental" muncul secara bersamaan bertumpuk di layar pengguna meskipun pengguna tersebut bertipe bisnis "Rental".
2. **UI/UX Timeline Flaws:** Desain *stepper* (penomoran) saat ini terlalu monoton (satu warna biru gelap) dan garis vertikalnya menyambung tanpa henti. Hal ini menurunkan tingkat keterbacaan (readability) instruksi. Diperlukan variasi warna *badge* angka dan pemisah horizontal (Divider).

## 2. Instruksi Eksekusi (Strict Conditional Logic & UI Styling)
**Target File:** Komponen `BukuPanduanModal.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaiki Kebocoran Conditional Rendering (Krusial):**
1. Audit ulang logika yang menampilkan daftar langkah (Steps) di dalam Modal ini.
2. Gunakan `switch(businessType)` atau struktur `if/else if` yang sangat ketat. 
3. Pastikan:
   - Jika `businessType === 'RENTAL'`, **HANYA** render langkah-langkah Rental (Tambah Armada -> ... -> Finish & Lunas).
   - Jika `businessType === 'JASA'`, **HANYA** render langkah-langkah Jasa (Buat Layanan -> ... -> Proses di Kasir).
   - Terapkan eksklusivitas yang sama untuk `FNB` dan `RETAIL`. Jangan ada array/list yang tergabung secara tidak sengaja.

**B. Peningkatan UI Stepper (Warna & Separator):**
1. Ubah desain *badge* (lingkaran angka) yang saat ini berwarna *solid dark blue*. Buat warnanya lebih dinamis dan selaras dengan *branding* model bisnisnya, contoh:
   - **Rental/Travel:** Gunakan gradasi/aksen warna Biru (Blue/Indigo).
   - **Jasa/Servis:** Gunakan gradasi/aksen warna Hijau (Emerald/Teal).
   - **F&B/Retail:** Gunakan gradasi/aksen warna Oranye/Merah (Orange/Rose).
2. **Horizontal Divider:** Jika di masa depan diperlukan pemisahan kategori di dalam satu SOP (misalnya: Bagian 1 "Persiapan", Bagian 2 "Operasional"), tambahkan elemen `<hr>` atau *border-top* yang rapi sebelum angka penomoran kembali ke "1", agar garis vertikal penghubungnya tidak menyambung ke bagian yang berbeda.
3. Pastikan *font-weight* pada judul setiap langkah (contoh: "Buat Layanan", "Bagikan Link Katalog") cukup menonjol agar mudah di- *scan* oleh mata.

Silakan perbaiki logika *rendering* bocor ini dan percantik UI-nya! Lapor kembali jika SOP sudah 100% eksklusif (tidak saling tumpuk) dan warna nomornya sudah bervariasi sesuai jenis bisnis!
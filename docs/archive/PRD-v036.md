# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.36
**Fokus:** Simetri Layout Kartu & Pencegahan Overflow Teks (Mobile)

## 1. Analisis Masalah (CSS Layout Flaw)
*   **Gejala:** Penambahan fitur yang tidak seimbang (3 fitur di paket Gratis vs 6 fitur di paket Tahunan) menyebabkan tinggi kartu (*card height*) menjadi tidak simetris. Selain itu, ada kemungkinan teks panjang merusak struktur kolom pada tampilan *mobile*.
*   **Tujuan:** Memaksa ketiga kartu memiliki tinggi yang persis sama, menyelaraskan posisi tombol CTA agar selalu berada di dasar kartu (rata bawah), dan memotong paksa teks (*truncate*) yang terlalu panjang pada *mobile*.

## 2. Instruksi Eksekusi UI/UX untuk AI Agent
Terapkan perbaikan Tailwind CSS ini secara ketat tanpa mengubah logika sistem.

### A. Simetri Tinggi Kartu & Posisi Tombol
*   **Target File:** Komponen Pricing/Paywall Cards.
*   **Instruksi:**
    1. Pastikan setiap elemen kartu memiliki kelas `flex flex-col h-full` agar tingginya mengikuti kontainer *grid* utama.
    2. Pada bagian kontainer yang membungkus daftar fitur (Checklists), tambahkan kelas `flex-1`. Ini akan mendorong (*push*) tombol CTA ke bagian paling bawah secara otomatis.
    3. Pada elemen bungkus tombol CTA, tambahkan kelas `mt-auto` untuk menguncinya di dasar kartu, sehingga ketiga tombol akan sejajar rata bawah meskipun jumlah fiturnya berbeda.

### B. Proteksi Teks Luber (Truncate)
*   **Instruksi:**
    1. Pada setiap teks (span/p) di dalam daftar fitur, tambahkan kelas `truncate` atau `line-clamp-1`. 
    2. Ini WAJIB dilakukan agar teks fitur (misal: "Peringatan Stok Cerdas") tidak turun ke baris kedua (*wrap*) jika lebar kolom *mobile* terlalu sempit, melainkan akan dipotong dengan elipsis ("...").

### C. Evaluasi Posisi Logo Absolut
*   **Instruksi:** Pastikan elemen teks logo "dev by PJTECH" benar-benar memiliki kelas `absolute` dan *z-index* yang cukup (misal: `z-10`), sehingga posisinya mengambang di atas elemen lain dan tidak ikut terdorong atau merusak struktur *grid* judul modal.
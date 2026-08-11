# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.32
**Fokus:** Kompresi UI Mobile Paywall (Compact Pricing Cards)

## 1. Analisis Masalah (UI/UX Scaling)
*   **Gejala:** Berdasarkan pengujian di layar *mobile*, kartu langganan (*Pricing Cards*) dirender dengan dimensi yang terlalu besar (*oversized*). Lebar kartu memakan hampir seluruh *viewport* perangkat, sehingga pengguna tidak dapat melihat semua pilihan paket secara sekilas.
*   **Solusi yang Diharapkan:** Memperkecil dimensi kartu (lebar, tinggi, *padding*, dan ukuran *font*) secara signifikan pada tampilan *mobile* agar antarmuka menjadi "Compact". Tujuannya agar opsi paket lebih terlihat dalam satu layar tanpa harus melakukan *scrolling* yang melelahkan.

## 2. Instruksi Eksekusi UI/UX untuk AI Agent
Lakukan kompresi (*scaling down*) pada elemen UI khusus untuk *breakpoint* `mobile` (di bawah `md:`). Biarkan tampilan `md:` (desktop) tetap besar seperti sedia kala.

### A. Resizing Dimensi Kartu & Container
*   **Target File:** Komponen UI Modal Paywall/Pricing.
*   **Instruksi:**
    1.  Jika menggunakan *horizontal scroll (flex-row)*, perkecil lebar spesifik kartu pada *mobile* menjadi sangat kompak, misalnya `w-[220px]` atau `w-[240px]`. Jangan gunakan `w-[85%]` atau `w-full`. Ini memastikan setidaknya 1,5 hingga 2 kartu terlihat langsung di layar.
    2.  Jika kembali menggunakan *vertical stack (flex-col)*, pastikan kartu dirender sekecil mungkin agar ketiga kartu muat di- *scroll* dengan cepat.
    3.  Kurangi jarak antar-kartu (gap) pada *container* menjadi lebih rapat (misal: `gap-2` atau `gap-3`).

### B. Kompresi Padding & Tipografi (Mobile-First)
Untuk setiap elemen di dalam kartu, terapkan pengecilan ukuran khusus *mobile*:
*   **Padding Kartu:** Kurangi ruang kosong. Gunakan `p-3` atau `p-4` pada *mobile*, lalu kembalikan ke `md:p-6` atau `md:p-8` pada desktop.
*   **Teks Judul Paket:** Kecilkan ukuran huruf. Gunakan `text-base font-bold` pada *mobile*, dan `md:text-xl` pada desktop.
*   **Teks Harga:** Gunakan `text-2xl` atau `text-3xl` pada *mobile* (jangan terlalu raksasa), dan `md:text-4xl` pada desktop.
*   **Daftar Fitur (Checklists):** Gunakan ukuran `text-xs` atau `text-sm` untuk teks deskripsi dan fitur pada *mobile* agar tidak memakan banyak baris.
*   **Tombol CTA:** Kurangi tinggi dan *padding* tombol menjadi lebih pipih pada *mobile* (misal: `py-1.5 text-sm`).

### C. Validasi UX
*   Pastikan hasil akhirnya menyerupai tabel harga yang ringkas (*compact*). Pengguna yang membuka aplikasi dari *smartphone* harus bisa melihat perbandingan ketiga paket ini dengan nyaman tanpa merasa elemen UI terlalu "zoom-in" atau raksasa.
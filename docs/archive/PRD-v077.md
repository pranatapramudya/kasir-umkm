# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.77
**Fokus:** UI/UX Polish - Visibilitas & Kontras Form Input Modal

## 1. Analisis Kebutuhan UI/UX (Accessibility)
*   **Masalah Visual:** Pada Modal "Tambah Kasir Baru", kolom input (Nama, Email, Password) memiliki kontras yang sangat buruk. Warna latar belakang input menyatu dengan warna latar belakang modal (putih pada putih), dan garis tepinya (*border*) terlalu pudar. Akibatnya, pengguna kesulitan melihat di mana mereka harus mengetik.
*   **Tujuan Desain:** Meningkatkan visibilitas kolom *input* dengan memberikan *background* abu-abu sangat muda dan *border* yang lebih tegas saat dalam kondisi *default* (belum diklik), sambil mempertahankan efek cincin biru saat sedang fokus (*active/focus state*).

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Fokuskan perbaikan HANYA pada elemen `<input>` di dalam form Modal Tambah Kasir. Jangan merombak logika fungsi *submit*.

### A. Perbaikan Kelas Tailwind pada Elemen Input
*   **Target File:** Komponen form di dalam Modal Tambah Karyawan (misal di `app/admin/karyawan/page.tsx` atau komponen terpisahnya).
*   **Instruksi Styling (Tailwind):**
    1.  Cari semua tag `<input>` (untuk Nama Lengkap, Email/Username, dan Password).
    2.  Ubah/tambahkan kelas warna latar belakang menjadi abu-abu terang: **`bg-gray-50`** (atau `bg-slate-50`). Ini akan membuat input sedikit lebih gelap dari modal yang berwarna putih.
    3.  Tegaskan warna garis tepinya: Ubah menjadi **`border-gray-300`**.
    4.  Pastikan warna teks pengguna cukup gelap dan jelas: **`text-gray-900`**.
    5.  Tambahkan sedikit bayangan dalam agar terlihat seperti kolom yang bisa diisi: **`shadow-sm`**.
    6.  **Pertahankan Focus State:** Pastikan saat input diklik, ia tetap memiliki indikator fokus yang jelas (contoh: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white`).
    
    *Contoh gabungan kelas yang benar:* 
    `className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"`
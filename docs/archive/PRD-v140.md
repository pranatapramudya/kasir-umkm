# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.40
**Fokus:** Perbaikan UI/UX Kontras Form Input (Modal Manajemen Meja)

## 1. Analisis Bug UI
Berdasarkan pengujian visual pada modal "Tambah Meja" dan "Edit Meja", warna *background* form input menyatu (*blend*) dengan *background* utama modal. Hal ini mengurangi *affordance* visual sehingga pengguna kesulitan melihat batas area input teks dan membaca *placeholder*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki *styling* Tailwind CSS pada elemen `<input>` di dalam komponen Modal. DILARANG memberikan *output* kode mentah. Lakukan perubahan langsung pada file.

### A. Peningkatan Kontras Input Field
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx` (atau lokasi komponen Modal terkait).
*   **Instruksi Perubahan Class Tailwind:**
    1. Temukan seluruh elemen `<input>` pada form Tambah/Edit Meja (untuk field "No. Meja / Nama Meja" dan "Kapasitas").
    2. Hapus *class* `bg-white` (jika ada pada input tersebut).
    3. Terapkan/tambahkan kombinasi *class* berikut agar input field memiliki *background* yang sedikit lebih gelap dari modal, batas yang tegas, dan fokus yang interaktif:
       `bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`
    4. Pastikan teks *placeholder* kini terbaca dengan jelas (tidak terlalu pudar).

Silakan eksekusi perbaikan CSS ini agar form input terlihat profesional dan ramah pengguna!
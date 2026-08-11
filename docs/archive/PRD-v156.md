# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.56
**Fokus:** Netralisasi Placeholder Kategori Layanan (SaaS Standardization)

## 1. Analisis Bug UX (Cognitive Bias)
*   **Masalah:** Pada form "Tambah Layanan Baru", teks bayangan (*placeholder*) pada input Kategori saat ini berbunyi: `Contoh: Pangkas Rambut, Cuci...`. 
*   **Dampak:** Hal ini menciptakan bias visual yang membuat aplikasi terasa seolah-olah eksklusif hanya untuk *Barbershop* atau Bengkel. Sebagai *SaaS boilerplate*, elemen UI harus bersifat universal (*agnostic*) agar pemilik bisnis jasa lain (Laundry, Salon, Klinik, Servis Elektronik) merasa relevan.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Ubah teks *placeholder* agar bersifat generik dan profesional. DILARANG memberikan *output* kode mentah.

### A. Revisi Placeholder Input Kategori
*   **Target File:** `app/admin/products/page-client.tsx` (Komponen Modal Form Tambah/Edit).
*   **Instruksi:**
    1. Cari elemen `<input>` untuk field `Kategori`.
    2. Ubah atribut `placeholder` menjadi kalimat yang netral dan luas.
    3. **Gunakan teks ini:** `Masukkan nama kategori...` (Atau jika ingin menggunakan contoh, gunakan yang sangat luas seperti: `Contoh: Perawatan, Perbaikan, dll.`)
    4. Pastikan teks *placeholder* pada field lain (seperti Nama Layanan atau Biaya Bahan) juga tidak mengandung bias jenis bisnis tertentu.

Silakan eksekusi perubahan teks kecil namun krusial ini untuk menjaga kesan *Premium SaaS* yang universal!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.17
**Fokus:** Extreme UI Downscaling & Perubahan Model Bisnis (6-Month Upfront Billing)

## 1. Analisis UX & Business Logic
*   **Masalah UI (Oversized):** Kartu paket di halaman `SubscriptionClient.tsx` masih terlalu besar dan memakan ruang berlebih. Skala keseluruhan (*container*, *padding*, tipografi) harus diturunkan secara drastis agar terlihat padat (Compact/High-Density).
*   **Perubahan Bisnis (Tier Menengah):** Model paket "Pro Bulanan" diubah menjadi komitmen 6 bulan di awal. Harga *marketing* tetap "Rp 99rb / bulan", tetapi wajib ditambahkan syarat dan ketentuan pembayaran di awal yang sangat jelas (Total: Rp 594.000 per 6 bulan) agar tidak menipu pembeli.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada kode Klien. DILARANG memberikan *output* kode mentah.

### A. Extreme UI Downscaling (Pengecilan Agresif)
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx`
*   **Instruksi Tailwind (Wajib Diikuti Presisi):**
    1. **Wrapper:** Kecilkan lebar maksimal kontainer utama Grid menjadi `max-w-4xl` atau `max-w-3xl` (sebelumnya mungkin 5xl/6xl).
    2. **Padding Kartu:** Kurangi padding internal seluruh kartu menjadi `p-5` atau maksimal `p-6`.
    3. **Tipografi Harga:** Kecilkan teks nominal harga (Rp 0, Rp 99rb, Rp 1.188k) menjadi `text-2xl font-bold` atau maksimal `text-3xl`.
    4. **Daftar Fitur:** Ubah seluruh ukuran teks pada daftar *checklist* fitur menjadi sangat ringkas: `text-xs` atau `text-[13px]`. Jarak antar list (`space-y`) dikecilkan menjadi `space-y-2`.
    5. **Tombol:** Gunakan padding tombol yang lebih tipis, misal `py-2 text-sm`.

### B. Update Business Logic Paket Menengah
*   **Instruksi Copywriting (Tier Tengah):**
    1. Ubah nama paket menjadi **"Pro 6 Bulan"** (atau pertahankan nama jika dirasa lebih baik, tapi wajib ubah *copywriting* di bawahnya).
    2. Di bawah harga "Rp 99rb / bulan", tambahkan teks syarat dan ketentuan yang menonjol (gunakan kelas `text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1`).
    3. Isi teks syarat tersebut: **"Wajib dibayar di awal: Rp 594.000 / 6 bulan"**.
    4. Ubah teks pada tombol aksi dari "Pilih Bulanan" menjadi **"Pilih 6 Bulan"**.

Silakan eksekusi pengecilan UI ekstrem dan pembaruan *copywriting* bisnis ini sekarang agar antarmuka terlihat jauh lebih profesional dan syarat pembayaran transparan bagi calon pelanggan SaaS!
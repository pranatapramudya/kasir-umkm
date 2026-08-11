# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.32
**Fokus:** Cleanup Feature Toggling, Dynamic Copywriting, 404 Hotfix, & Routing Cache

## 1. Analisis Bug (P1 - P2)
*   **Legacy Account Fallback:** Akun lama yang tidak memiliki `kategoriUsaha` terjebak di tampilan F&B. Fallback default harus diarahkan ke Retail.
*   **404 Not Found (Manajemen Meja):** Menu "Manajemen Meja" di Sidebar mengarah ke rute yang halamannya belum dibuat.
*   **Static Copywriting (Jasa/Servis):** Pengguna Jasa melihat menu Sidebar "Layanan", namun isi halamannya masih bertuliskan "Manajemen Produk", "Tambah Barang", dan "Cari produk...".
*   **Routing Cache (Onboarding):** Setelah pengguna menekan tombol pilihan paket di halaman Onboarding, terjadi *delay* dan halaman Dasbor kosong/membutuhkan *refresh* manual agar state terbaru termuat.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan 4 perbaikan presisi di bawah ini. DILARANG memberikan *output* kode mentah.

### A. Fallback Kategori & Dynamic Copywriting (Produk/Layanan)
*   **Target File:** `components/SidebarClient.tsx` & `app/admin/products/page.tsx` (serta Client Component-nya).
*   **Instruksi:**
    1. Pastikan jika `kategoriUsaha` bernilai `null` atau `undefined`, set *fallback* ke `'Retail'`.
    2. Oper data `kategoriUsaha` ke dalam komponen halaman Produk.
    3. Buat *Dynamic Copywriting* pada halaman Produk:
       - **Jika Kategori == 'Jasa / Servis':** Ubah judul menjadi `"Manajemen Layanan"`, placeholder pencarian menjadi `"Cari layanan..."`, dan tombol menjadi `"Tambah Layanan"`.
       - **Selain itu:** Gunakan `"Manajemen Produk"`, `"Cari produk..."`, `"Tambah Barang"`.

### B. Hotfix 404 Manajemen Meja
*   **Target File:** Buat file baru di `app/admin/manajemen-meja/page.tsx`.
*   **Instruksi:** Buat halaman *placeholder* dasar (kosong/Coming Soon) yang memuat layout standar dengan judul "Manajemen Meja". Pastikan URL di `SidebarClient.tsx` cocok dengan nama folder rute ini agar *error 404* hilang.

### C. Hard Reload (Clear Cache) pada Pemilihan Paket
*   **Target File:** `components/PricingSection.tsx`
*   **Instruksi:** Pada fungsi sukses pemilihan paket (setelah API `/api/subscription/extend` atau injeksi 14 hari berhasil dipanggil), **JANGAN** gunakan `router.push('/admin')`. 
*   **Ganti dengan:** `window.location.href = '/admin';`. Ini akan memaksa *browser* melakukan *hard reload*, menghapus *cache* Next.js, dan memastikan data *Tenant* termuat dengan sempurna tanpa perlu di-*refresh* manual oleh pengguna.

Silakan eksekusi keempat perbaikan ini sekarang. Pastikan tidak ada lagi 404 dan tulisan "Produk" pada akun kategori Jasa!
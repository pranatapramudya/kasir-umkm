# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.34
**Fokus:** Bugfix Hardcode Kategori Produk & Dinamisasi Filter per Tenant

## 1. Objektif
Menghapus data kategori palsu/hardcode (seperti "Makanan", "Minuman", "Cemilan") dari dropdown filter produk. Memastikan dropdown kategori terisi murni secara dinamis berdasarkan data kategori produk yang benar-benar diinputkan oleh Tenant (Owner) di database, sehingga cocok untuk semua jenis bisnis (Retail, F&B, Jasa, Rental).

## 2. Analisis Masalah
Pada komponen filter produk (di Kasir POS maupun halaman CRUD Produk), terdapat array statis yang mendefinisikan list kategori. Karena aplikasi ini multi-tenant dan multi-kategori-bisnis, penggunaan array statis F&B sangat menyesatkan bagi pengguna Retail atau Jasa.

## 3. Eksekusi Perbaikan (Frontend & Logika Data)
**Target File:** `app/page-client.tsx` (Kasir POS), halaman CRUD Produk (misal `app/admin/products/page.tsx`), dan komponen filter terkait.
**Instruksi Eksekusi:**

1. **Hapus Array Statis:**
   - Cari deklarasi array seperti `const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', ...]` atau sejenisnya.
   - Hapus string kategori F&B bawaan tersebut.

2. **Dinamisasi dari Database (Ekstraksi Kategori):**
   - Manfaatkan state `products` (data produk asli yang sudah di-fetch dari database berdasarkan tenantId).
   - Buat variabel turunan untuk mengekstrak kategori unik dari produk yang ada.
   - Contoh logika TypeScript: 
     `const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));`
   - Gabungkan pilihan default: 
     `const dynamicCategories = ['Semua', ...uniqueCategories];`

3. **Terapkan ke UI Dropdown:**
   - Gunakan `dynamicCategories` ini untuk me-render elemen `<select>` atau komponen Dropdown menu.
   - Pastikan jika tenant belum memiliki produk sama sekali, dropdown hanya menampilkan opsi "Semua".

4. **Validasi Form CRUD (Tambah Produk):**
   - Pastikan input kategori pada form Tambah/Edit Produk (`image_7c6a40.png`) tetap berupa *free-text* (input text biasa) atau *creatable select*, sehingga user bisa bebas mengetik nama kategori baru (misal: "Oli Motor", "Sparepart", "Cukur Rambut", dll) sesuai bisnis mereka.

Silakan eksekusi pembersihan hardcode ini sekarang juga. Pastikan tidak ada kebocoran kategori antar tenant (filter murni dari state `products` milik tenant yang sedang login).
Kerja bagus untuk API-nya! Sekarang kita kembali ke eksekusi `PRD-v001.md` tahap Rebranding dan penyesuaian Frontend, sekaligus memperbaiki sebuah error.

Saat ini kita mengalami error `Runtime TypeError: products.filter is not a function` di `app/page.tsx`. Ini terjadi karena frontend belum diadaptasi untuk menerima format data baru dari API SaaS kita, dan frontend masih menggunakan properti `price` yang sudah dihapus.

Tolong buka file `app/page.tsx` (Storefront) dan `app/admin/products/page.tsx` (jika ada), lalu eksekusi hal berikut:

1. **Rebranding (Sesuai PRD-v001.md):**
   Ganti semua teks hardcoded "WARUNG UMKM" di antarmuka menjadi "PJTECH KASIR POS".

2. **Perbaikan State & Fetching (Anti-Crash):**
   - Saat melakukan `fetch('/api/products')`, pastikan untuk mengecek `res.ok`. 
   - Pastikan data yang di-set ke state `products` BENAR-BENAR sebuah array: `if (Array.isArray(data)) setProducts(data); else setProducts([]);`
   - Berikan penanganan UI sederhana jika user belum login (misal: tampilkan pesan "Silakan login untuk mengakses kasir").

3. **Adaptasi Skema Baru:**
   - Ubah semua pemanggilan `product.price` di frontend (saat render harga maupun saat dimasukkan ke dalam `cart`) menjadi `product.hargaJual`.

Tolong berikan kode pembaruan untuk `app/page.tsx` (atau instruksi perubahannya jika terlalu panjang) dengan komentar Bahasa Indonesia.
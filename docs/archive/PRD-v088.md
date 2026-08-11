# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.88
**Fokus:** Pembersihan Total Placeholder UI Form & Debugging Mendalam Rute API Edit Produk

## 1. Analisis Kebutuhan Antarmuka & Bug Backend
*   **Kebutuhan UI (Ultra-Minimalist Form):** Pengguna (Owner) mengeluhkan form masih terlihat berantakan karena adanya teks bayangan (*placeholder*) di dalam kotak input. Desain yang diinginkan adalah form yang benar-benar bersih/kosong di bagian dalam, hanya mengandalkan label teks di atas kotak input.
*   **Bug Backend (Edit Tetap Gagal):** Setelah pembaruan sebelumnya, proses Edit/Update produk masih mengembalikan `Server Error Response: {}`. Ini mengindikasikan bahwa AI Agent sebelumnya gagal memperbaiki rute API `PUT`/`PATCH` secara komprehensif. Kesalahan kemungkinan terletak pada kegagalan menangkap `id` produk, atau adanya ketidakcocokan tipe data (misal: *string* vs *integer* pada harga/stok) saat dikirim ke Prisma.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Sebagai agen pengembang, Anda dilarang memberikan kode mentah kepada pengguna. Anda harus secara mandiri menganalisis, menemukan letak kesalahan, dan memperbaiki file di lingkungan lokal pengguna sesuai dengan panduan arsitektur berikut.

### A. Eksekusi UI: Pembersihan Total Placeholder
*   **Target File:** Komponen form Modal "Tambah/Edit Produk Baru".
*   **Instruksi Tindakan:**
    1. Temukan seluruh elemen input pada form tersebut (SKU, Nama Produk, Kategori, Merek, Varian, Stok, HPP, Harga Jual, Diskon).
    2. **HAPUS** seluruh atribut `placeholder` dari semua elemen input tersebut tanpa terkecuali. 
    3. Pastikan bagian dalam kotak input benar-benar kosong dan bersih saat form pertama kali dimuat. Pengguna hanya akan melihat label judul di atas masing-masing kotak input.

### B. Eksekusi Backend: Debugging & Perbaikan Rute API Edit
*   **Target File:** Rute API yang menangani Edit Produk (biasanya berada di `app/api/products/[id]/route.ts` atau penanganan `PUT` di `app/api/products/route.ts`).
*   **Instruksi Investigasi & Perbaikan:**
    1. Periksa bagaimana Anda menerima *payload* dari sisi *Client* (`request.json()`). Pastikan semua data terekstrak dengan benar, termasuk `brand` dan `variant`.
    2. **Validasi ID:** Pastikan kueri `prisma.product.update` memiliki parameter `where: { id: ... }` yang valid. Jika ID `undefined` atau hilang dari URL/Payload, Prisma akan menolak operasi tersebut.
    3. **Validasi Tipe Data (Type Casting):** Kesalahan 500 sering terjadi jika Anda mencoba memasukkan *string* ke kolom basis data yang bertipe *Int* atau *Float*. Pastikan data angka (Stok, HPP, Harga Jual, Diskon) sudah di-*parsing* secara eksplisit menjadi angka (contoh menggunakan `Number()` atau `parseInt()`) sebelum dimasukkan ke dalam objek `data` Prisma.
    4. Tangkap *error* menggunakan blok `try-catch` yang spesifik, dan kembalikan pesan *error* yang jelas ke *console* server Anda sendiri agar Anda (AI Agent) dapat mengetahui sumber pasti kegagalan jika pembaruan ini masih tidak berhasil.
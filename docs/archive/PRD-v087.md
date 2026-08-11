# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.87
**Fokus:** UI/UX Form Cleanup & Hotfix Backend API (Edit Product Schema Mismatch)

## 1. Analisis Bug Kritis & Kebutuhan UI
*   **Bug Backend (P0 - Edit Failed):** Terjadi kegagalan saat memperbarui data produk (`Server Error Response: {}`). Ini diakibatkan oleh *Schema Mismatch*. Rute API yang menangani fungsi Edit (`PUT`/`PATCH`) belum diperbarui untuk menerima parameter baru `brand` dan `variant` yang sebelumnya ditambahkan ke Prisma. Akibatnya, server menolak *payload* atau Prisma gagal melakukan kueri `update`.
*   **Kebutuhan UI (Form Decluttering):** Elemen unggah gambar atau kotak *input* di dalam Modal "Tambah/Edit Produk" memiliki *background* atau garis tepi (dashed/solid) yang terlalu tebal atau berantakan, membuat form terasa penuh dan memusingkan pengguna. Harus dibuat sebersih mungkin (*minimalist white*).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pembersihan UI pada form dan perbarui logika `update` pada API Endpoint Produk. DILARANG MERUSAK fungsi yang sudah berjalan.

### A. Hotfix API Endpoint (Fungsi Edit Produk)
*   **Target File:** `app/api/products/route.ts` atau `app/api/products/[id]/route.ts` (Tergantung arsitektur Anda untuk metode `PUT` / `PATCH`).
*   **Instruksi Logika Backend:**
    1. Cari fungsi yang menangani pembaruan data produk (`prisma.product.update`).
    2. Ekstrak properti `brand` dan `variant` dari `request.json()` bersamaan dengan data lainnya (nama, kategori, stok, hpp, harga, dll).
    3. Masukkan `brand` dan `variant` ke dalam objek `data: { ... }` pada fungsi `prisma.product.update`.
    4. Pastikan Anda tidak memaksa tipe data (*strict validation*) yang membuat rute ini *crash* jika `brand` atau `variant` dikirim dalam keadaan kosong/null (karena sifatnya opsional).

### B. Validasi Payload di Client (handleSubmit)
*   **Target File:** `app/admin/products/page.tsx` (di dalam fungsi `handleSubmit`).
*   **Instruksi Logika Client:**
    1. Cari blok kode `fetch` yang berjalan ketika mode edit aktif (`if (editingProduct)`).
    2. Pastikan di dalam `body: JSON.stringify({ ... })`, Anda sudah menyertakan *state* `brand` dan `variant` terbaru untuk dikirim ke *backend*.

### C. UI/UX Form Cleanup (Minimalist Design)
*   **Target File:** Komponen form Modal Produk.
*   **Instruksi Styling Tailwind:**
    1. Cari elemen pembungkus unggah foto atau *input* yang memiliki kelas *background* gelap/abu-abu (misal `bg-gray-50`, `bg-gray-100`) atau garis tepi putus-putus tebal (`border-dashed border-2`).
    2. Hapus *background* tersebut dan ubah menjadi murni putih (`bg-white`) dengan garis tepi abu-abu sangat tipis/halus (`border-gray-200 border`).
    3. Hapus *padding* atau *margin* berlebih yang membuat form terlihat terlalu "gemuk" dan memakan layar. Fokus pada desain form yang datar (*flat*), bersih, dan profesional ala SaaS modern.
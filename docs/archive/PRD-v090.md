# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.90
**Fokus:** Perbaikan Total Rute API Update Produk (Full Field Mapping & Error Serialization)

## 1. Analisis Akar Masalah (Root Cause Analysis)
*   **Masalah 1 (Incomplete Payload Mapping):** Pengguna mengeluhkan tidak bisa mengedit keseluruhan isi form. Ini mengindikasikan bahwa fungsi `PUT` atau `PATCH` di rute API tidak menangkap dan memetakan *seluruh* field yang dikirim dari klien ke dalam metode `prisma.product.update`.
*   **Masalah 2 (Empty Error Response):** Klien masih menerima `Server Error Response: {}`. Ini terjadi karena *error object* bawaan JavaScript tidak bisa langsung di- *stringify* oleh `NextResponse.json()` di Next.js App Router.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Sebagai agen pengembang, Anda DILARANG keras memberikan *output* kode mentah kepada pengguna. Anda harus memperbaiki rute API Edit secara langsung dan menyeluruh.

### A. Refaktor Total Rute API Edit (Full Field Mapping)
*   **Target File:** `app/api/products/[id]/route.ts` (Atau rute yang menangani `PUT`/`PATCH` produk).
*   **Instruksi Logika:**
    1. Pastikan Anda mengekstrak SEMUA properti dari `await request.json()`. Daftarnya harus mencakup: `kodeBarang`, `nama`, `kategori`, `brand`, `variant`, `stok`, `hpp`, `hargaJual`, dan `diskon`.
    2. Di dalam fungsi `prisma.product.update`, pastikan objek `data: { ... }` memuat SEMUA properti tersebut. Jangan ada satu pun *field* dari form yang ditinggalkan.
    3. **Wajib Type Casting:** Pastikan properti numerik di-*parsing* dengan aman sebelum masuk ke Prisma:
       - `stok: Number(stok)`
       - `hpp: Number(hpp)`
       - `harga: Number(hargaJual)`
       - `diskon: Number(diskon)`

### B. Perbaikan Serialisasi Error Response (Next.js)
*   **Target File:** `app/api/products/[id]/route.ts` (Pada blok `catch`).
*   **Instruksi Logika:**
    1. Cari blok `catch (error) { ... }`.
    2. DILARANG menggunakan `return NextResponse.json(error, { status: 500 })`. Ini akan menghasilkan objek kosong `{}` di sisi klien.
    3. UBAH menjadi: `return NextResponse.json({ error: "Gagal mengupdate produk", details: error instanceof Error ? error.message : String(error) }, { status: 500 });`.
    4. Dengan cara ini, jika Prisma kembali menolak *payload*, pesan penolakan aslinya (misal: *type mismatch* atau *missing argument*) akan terbaca di konsol klien pengguna.

### C. Validasi Client-Side
*   **Target File:** `app/admin/products/page.tsx` (Fungsi `handleSubmit`).
*   **Instruksi Logika:**
    1. Pastikan URL `fetch` saat mode edit menggunakan ID yang benar, contoh: `/api/products/${editingProduct.id}`.
    2. Pastikan `body: JSON.stringify({ ... })` memuat semua *state* form secara lengkap agar tidak ada nilai `undefined` yang terkirim ke server.
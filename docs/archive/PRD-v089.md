# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.89
**Fokus:** Hotfix Prisma Invalid Invocation (Type Casting pada Kolom Numerik)

## 1. Analisis Akar Masalah (Root Cause Analysis)
*   **Gejala:** Terjadi `Server Error Response: {}` di klien, dan `Invalid prisma.product.update() invocation` di terminal server Next.js saat pengguna mengedit data stok produk.
*   **Akar Masalah (Type Mismatch):** Skema Prisma membutuhkan tipe data Integer (`Int`) untuk field numerik seperti `stok`, `hpp`, `harga`, dan `diskon`. Namun, *payload* yang dikirim dari form (atau yang diekstrak di rute API) masih berwujud *String* (contoh: `"150"`). Ketidakcocokan tipe data ini menyebabkan Prisma menolak eksekusi `update`.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit dan perbaikan konversi tipe data (*Type Casting*) di dua sisi: Client Payload dan Server API Route. DILARANG memberikan *output* kode mentah kepada pengguna, perbaiki langsung di dalam *file*.

### A. Perbaikan Server-Side (API Route)
*   **Target File:** `app/api/products/[id]/route.ts` (Pada blok fungsi `PUT` / `PATCH`).
*   **Instruksi Debugging:**
    1. Temukan variabel `updatedProduct = await prisma.product.update({ ... })`.
    2. Periksa objek `data: { ... }` di dalamnya.
    3. Anda WAJIB melakukan konversi eksplisit pada seluruh nilai numerik sebelum dimasukkan ke Prisma.
    4. Pastikan `stok` dikonversi dengan `parseInt(stok, 10)` atau `Number(stok)`.
    5. Lakukan hal yang sama untuk `hpp`, `hargaJual`, dan `diskon` (terutama jika skema Prisma Anda menggunakan `Int` atau `Float`).
    6. Tangani potensi nilai `null` atau `undefined` atau *empty string* saat melakukan parsing agar tidak menghasilkan `NaN` yang juga akan ditolak oleh Prisma.

### B. Perbaikan Client-Side (Form Submit)
*   **Target File:** `app/admin/products/page.tsx` (Pada fungsi `handleSubmit`).
*   **Instruksi Debugging:**
    1. Periksa bagian di mana *payload* dikirim melalui fungsi `fetch` (pada parameter `body: JSON.stringify({ ... })`).
    2. Pastikan nilai dari *state* React untuk `stok`, `hpp`, `harga`, dan `diskon` di- *parsing* menjadi *number* sebelum dikirim ke API. 
    3. Ini akan mengurangi beban server dan memastikan API menerima JSON dengan tipe data yang benar secara fundamental.

### C. Error Handling API
*   **Instruksi Tambahan:** Perbaiki blok `catch (error)` di dalam rute API tersebut. Jangan hanya melakukan `console.log(error)`. Kembalikan JSON spesifik `return NextResponse.json({ error: "Pesan error spesifik", details: error.message }, { status: 500 })` agar di masa depan *developer* bisa membaca *error* apa yang terjadi langsung dari *browser console*, bukan hanya sekadar objek kosong `{}`.
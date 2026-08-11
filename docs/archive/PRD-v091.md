# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.91
**Fokus:** Defensive Programming API Update, Validasi Payload Absolut, & Transparansi Error

## 1. Analisis Akar Masalah (Kritis P0)
*   **Gejala:** Proses Edit Produk (Update) selalu gagal dengan `Server Error Response: {}`.
*   **Diagnosa Kebutaan Klien:** Aplikasi *frontend* tidak menerima detail *error* sama sekali karena rute API *backend* gagal mem- *parsing* atau me- *return* objek `Error` Prisma dengan benar ke dalam bentuk JSON. Selain itu, ada kemungkinan besar ID produk tidak terbaca oleh parameter rute API, atau *payload* yang dikirim dari klien berstatus `undefined` pada kolom-kolom krusial.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
DILARANG memberikan kode mentah kepada pengguna. Anda harus secara otomatis menerapkan perbaikan fundamental ini pada lingkungan lokal pengguna. 

### A. Injeksi Logging di Server Terminal
*   **Target File:** `app/api/products/[id]/route.ts` (Atau file handler `PUT`/`PATCH`).
*   **Instruksi:** 
    1. Tepat di baris pertama setelah mengekstrak `await request.json()`, tambahkan: `console.log("PAYLOAD DITERIMA:", dataPayloadYangDiekstrak)`.
    2. Tambahkan juga: `console.log("ID PRODUK:", params.id)` (atau dari mana pun Anda mengambil ID).
    3. Ini sangat krusial agar *developer* bisa melihat langsung di terminal VS Code/Command Prompt mereka apa yang sebenarnya dikirim oleh klien sebelum server meledak.

### B. Validasi ID Ekstrim (Defensive Check)
*   **Target File:** `app/api/products/[id]/route.ts`
*   **Instruksi:**
    1. Sebelum memanggil `prisma.product.update`, buat pengecekan absolut:
       `if (!productId) { return NextResponse.json({ error: "ID Produk tidak ditemukan di rute API" }, { status: 400 }); }`
    2. Pastikan Anda mengambil ID dari tempat yang benar (biasanya dari parameter fungsi `export async function PUT(request, { params })`).

### C. Bulletproof Type Casting (Penanganan Angka)
*   **Target File:** `app/api/products/[id]/route.ts`
*   **Instruksi:**
    1. Saat memetakan data `stok`, `hpp`, `harga`, dan `diskon` ke Prisma, gunakan sintaks yang menjamin hasil berupa angka dan menghindari `NaN`:
       - `stok: Number(stok) || 0`
       - `hargaJual: Number(hargaJual) || 0`
    2. Pastikan `brand` dan `variant` dikirim apa adanya (biarkan `null` atau `""` jika memang kosong).

### D. Perombakan Total Catch Block (Error Visibility)
*   **Target File:** `app/api/products/[id]/route.ts`
*   **Instruksi:**
    1. Ganti blok `catch` lama Anda sepenuhnya dengan logika yang menjamin JSON valid.
    2. Ekstrak pesan secara paksa: `const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan sistem Prisma";`
    3. Tambahkan `console.error("PRISMA ERROR:", error)` di dalam *catch* agar terekam di terminal server.
    4. Kembalikan respons ini: `return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });`
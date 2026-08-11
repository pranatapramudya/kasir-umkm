# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.92
**Fokus:** Pemberantasan "Smart Code" (Null Mismatch) & Simplifikasi Prisma Update

## 1. Analisis Akar Masalah (Code Review Failure)
*   **Klaim Anda SALAH:** Pembaruan sebelumnya gagal. Bukti *stack trace* di server menunjukkan `Invalid prisma.product.update() invocation` yang bersumber dari logika *ternary operator* Anda pada baris pemetaan data.
*   **Penyebab Utama (Prisma Null Rejection):** Anda mencoba memaksa nilai *empty string* (`""`) menjadi `null` (contoh: `kodeBarang === "" ? null : kodeBarang`). Dalam skema Prisma yang bersifat non-nullable (`String`), injeksi `null` adalah PELANGGARAN FATAL yang menyebabkan *crash* seketika.
*   **Penyebab Klien Menerima `{}`:** Anda gagal menstrukturisasi JSON *error response* dengan benar, sehingga Next.js tidak dapat me- *serialize* objek *error* dan hanya mengirimkan objek kosong ke klien.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent (DILARANG BERDEBAT)
Perbaiki file `app/api/products/[id]/route.ts` dengan mematuhi arsitektur yang sangat sederhana ini. Hapus semua gaya penulisan kode *ternary* bersarang yang Anda buat sebelumnya.

### A. Simplifikasi Mapping Prisma (Anti-Null Policy)
*   **Target Tugas:** Bersihkan blok `data: { ... }` pada fungsi `prisma.product.update`.
*   **Aturan Logika (Wajib):**
    1. **Teks (String):** Jangan pernah mengonversi `""` (string kosong) menjadi `null`. Jika properti teks dari *payload* bernilai *falsy*, gunakan *fallback empty string*. (Contoh logika yang benar: `kodeBarang: kodeBarang || ""`). Lakukan ini untuk `nama`, `kategori`, `brand`, dan `variant`.
    2. **Angka (Numerik):** Gunakan *parsing* numerik langsung dengan *fallback* 0. (Contoh logika yang benar: `stok: parseInt(stok, 10) || 0`). Lakukan ini untuk `hpp`, `hargaJual`, dan `diskon`.
    3. Hapus logika `existingProduct.kodeBarang` jika itu membutuhkan kueri tambahan yang tidak perlu; timpa saja dengan data baru dari form secara absolut.

### B. Perombakan Total Response Error
*   **Target Tugas:** Blok `catch (error) { ... }`
*   **Aturan Logika (Wajib):**
    1. Pastikan Anda hanya menggunakan metode ekstraksi pesan primitif.
    2. Format kembalian HARUS secara eksplisit mendefinisikan *key* `error` sebagai string.
    3. *Blueprint* Logika: 
       `const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";`
       `return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });`

### C. Hapus Semua Teks Placeholder di Frontend (Reminder)
*   **Target Tugas:** Komponen Modal Produk (`app/admin/products/page.tsx`).
*   **Aturan Logika:** Pastikan Anda benar-benar menghapus atribut `placeholder="..."` dari seluruh elemen `<input>` agar UI terlihat bersih (hanya menyisakan label di atasnya).
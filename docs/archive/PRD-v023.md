# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.23
**Fokus:** Resolusi API Checkout Transaksi & Peningkatan Error Handling

## 1. Analisis Masalah
*   **Gejala (Symptom):** Terjadi *Runtime Error* pada file `app/page.tsx` di dalam fungsi `handleCheckout`. Baris kode `if (!res.ok) throw new Error("Gagal menyimpan transaksi");` tereksekusi, menandakan *backend* API menolak *payload* yang dikirim (mengembalikan status 4xx atau 5xx).
*   **Blind Spot Debugging:** Frontend saat ini membuang informasi *error* asli dari respon API dan hanya menampilkan pesan generik, sehingga menyulitkan pelacakan *bug*.
*   **Potensi Akar Masalah (Root Causes):**
    1.  **Data Type Mismatch:** Payload JSON (seperti total harga, PPN, atau array *items*) mungkin masih mengandung *string* atau format yang tidak sesuai dengan skema Prisma (yang mewajibkan `Int` atau `Float`).
    2.  **Missing Tenant Context:** API transaksi (backend) mungkin gagal mengekstrak `userId` dari sesi Clerk, sehingga Prisma menolak penyimpanan karena kolom `userId` kosong.
    3.  **Relational Constraint:** ID Produk yang dikirimkan di dalam *array* keranjang mungkin tidak valid atau logika pengurangan stok di Prisma gagal dieksekusi.

## 2. Instruksi Pemeriksaan & Perbaikan untuk AI Agent
Tugas Anda adalah mengaudit alur *checkout* dari ujung ke ujung (Frontend ke Backend) tanpa mengorbankan stabilitas sistem. Lakukan langkah-langkah eksak berikut:

### A. Perbaiki Error Logging di Frontend (`app/page.tsx`)
*   Cari fungsi `handleCheckout`.
*   Modifikasi blok pengecekan `!res.ok`. Alih-alih langsung melempar *Error* statis, instruksikan fungsi untuk melakukan `await res.json()` (atau `await res.text()`) terlebih dahulu, kemudian tampilkan pesan *error* asli dari *backend* menggunakan `console.error()` atau langsung lemparkan pesan tersebut ke dalam notifikasi *toast*.

### B. Audit Sanitasi Payload sebelum Fetch
*   Pastikan sebelum data keranjang dikirim via `fetch` POST, semua nilai numerik (total belanja, subtotal, kuantitas) sudah dikonversi secara ketat menjadi `Number` atau `Integer`.

### C. Audit Backend API Route (Transaksi)
*   Periksa file *route handler* yang menangani POST transaksi (misalnya `app/api/transactions/route.ts`).
*   Pastikan *route* tersebut menggunakan `auth()` dari Clerk untuk mendapatkan `userId` dan menyisipkannya ke dalam *payload* pembuatan data Prisma.
*   Pastikan struktur operasi `prisma.transaction.create` sudah benar, terutama pada saat melakukan *nested write* (menyimpan data transaksi sekaligus menyisipkan data ke tabel `TransactionItem`).
*   Pastikan API mengembalikan respons JSON yang detail jika terjadi kegagalan (misalnya `return NextResponse.json({ error: error.message }, { status: 500 })`) agar frontend dapat membacanya.
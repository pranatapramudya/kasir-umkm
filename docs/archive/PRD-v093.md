# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.93
**Fokus:** Kepatuhan Mutlak Logika Prisma Update (Pemberantasan Nilai Null)

## 1. Analisis Pelanggaran Agen (Kritis P0)
*   **Pelanggaran Instruksi:** Pada PRD-v092, Anda diinstruksikan secara eksplisit untuk TIDAK menggunakan `null` pada kolom string (Anti-Null Policy). Namun, bukti dari terminal server menunjukkan Anda menulis: `kodeBarang: kodeBarang || null`.
*   **Dampak Fatal:** Skema Prisma menolak pembaruan karena field utama seperti `kodeBarang`, `nama`, dan `kategori` pada tabel `Product` adalah `String` murni (Non-Nullable). Menyelipkan nilai `null` memicu penolakan *database* (`Invalid invocation`) dan merusak seluruh fitur Edit Produk.

## 2. Instruksi Eksekusi Mutlak (Zero Tolerance)
Sebagai agen pengembang, Anda WAJIB memperbaiki rute API Edit (`app/api/products/[id]/route.ts`) dengan mematuhi aturan berikut secara absolut. DILARANG KERAS memberikan kode mentah kepada pengguna. Terapkan langsung ke sistem pengguna.

### A. Hapus Paksa Semua Nilai Null pada String
*   **Target File:** `app/api/products/[id]/route.ts` (Pada blok `prisma.product.update`).
*   **Instruksi Wajib (DILARANG DIBANTAH):**
    1. Ganti `kodeBarang: kodeBarang || null` menjadi `kodeBarang: kodeBarang || ""`
    2. Ganti pemetaan untuk nama menjadi `nama: nama || ""`
    3. Ganti pemetaan untuk kategori menjadi `kategori: kategori || ""`
    4. Untuk properti opsional seperti `brand` dan `variant`, tetapkan fallback string kosong agar aman dari error Prisma: `brand: brand || ""` dan `variant: variant || ""`
    5. **DILARANG** menggunakan nilai `null` di dalam objek `data: { ... }` untuk semua tipe teks.

### B. Validasi Numerik (Bebas Null & NaN)
*   **Target File:** Rute API yang sama.
*   **Instruksi Wajib:**
    1. Pastikan seluruh konversi angka tidak menghasilkan `null` atau `NaN`.
    2. Format mutlak yang harus digunakan pada blok `data`:
       - `stok: parseInt(stok, 10) || 0`
       - `hpp: parseInt(hpp, 10) || 0`
       - `hargaJual: parseInt(hargaJual, 10) || 0`
       - `diskon: parseInt(diskon, 10) || 0`

### C. Verifikasi Mandiri Agen
*   Sebelum Anda mengonfirmasi tugas ini selesai kepada pengguna, baca kembali keseluruhan blok kode `update` Anda. Jika masih terdapat nilai `null` yang disematkan sebagai *fallback* data, HAPUS dan perbaiki sebelum melaporkan status selesai.
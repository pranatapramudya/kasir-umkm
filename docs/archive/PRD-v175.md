# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.75
**Fokus:** Penambahan Metrik Bisnis (Total Omset) & Indeks Tabel

## 1. Analisis Kebutuhan
*   **Keterbacaan Data:** Tabel Master Data Tenant saat ini kekurangan kolom indeks (Nomor Urut), sehingga menyulitkan pembacaan data ketika dilakukan *pagination*.
*   **Intelijen Bisnis (SaaS Metrics):** Superadmin membutuhkan visibilitas terhadap volume transaksi (GMV/Omset) dari masing-masing *Tenant* untuk menentukan kesehatan bisnis klien dan potensi *upselling* paket langganan.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Tambahkan kolom baru pada Tabel Master Data Tenant dan sesuaikan kueri Prisma. DILARANG memberikan *output* kode mentah panjang.

### A. Penambahan Kolom Nomor Urut (No.)
*   **Target File:** `app/superadmin/page.tsx` (atau komponen tabelnya).
*   **Instruksi Logika:**
    1. Tambahkan kolom header **"NO."** di posisi paling kiri tabel.
    2. Kalkulasi nomor urut agar berkesinambungan antar halaman (*pagination*). 
    3. Gunakan rumus: `(currentPage - 1) * itemsPerPage + index + 1`. (Contoh: Pada halaman 2 dengan maksimal 10 data, baris pertama harus bernomor 11, bukan kembali ke 1).

### B. Penambahan Kolom Total Omset (GMV)
*   **Target File:** `app/superadmin/page.tsx` 
*   **Instruksi Logika & Prisma:**
    1. Tambahkan kolom header **"TOTAL OMSET"** pada tabel.
    2. Modifikasi kueri `prisma.tenant.findMany`. Gunakan fitur `include` atau agregasi untuk menarik total dari tabel `Transaction`.
    3. **Syarat Agregasi:** Hitung jumlah (Sum) dari kolom `totalAmount` pada semua transaksi milik *Tenant* tersebut, NAMUN hanya sertakan transaksi dengan status yang valid (misalnya `status: 'COMPLETED' / 'PAID'`, sesuaikan dengan skema Anda).
    4. **Format UI:** Tampilkan data omset tersebut dalam format mata uang Rupiah (contoh: `Rp 45.000.000`). Berikan warna teks hijau tebal (`text-green-600 font-semibold`) untuk memberikan penekanan visual pada angka tersebut.

Silakan eksekusi penambahan kolom ini agar *Command Center* memiliki metrik yang lebih kuat untuk analisis bisnis!
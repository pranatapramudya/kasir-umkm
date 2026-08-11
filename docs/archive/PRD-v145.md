# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.45
**Fokus:** Sinkronisasi Semi-Otomatis Status Meja (F&B)

## 1. Analisis Logika Bisnis
*   Pada sistem F&B tipe *Pay-First*, sistem kesulitan mengetahui kapan pelanggan meninggalkan meja. 
*   **Solusi:** Ketika transaksi berhasil (Checkout), sistem harus secara otomatis mengubah status meja terkait menjadi "Terisi". Untuk mengosongkannya kembali, pengguna cukup mengklik *badge* status di halaman Manajemen Meja (Quick Toggle).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Implementasikan logika sinkronisasi antara Transaksi Kasir dan Status Meja. DILARANG memberikan *output* kode mentah.

### A. Otomatisasi Status pada API Checkout
*   **Target File:** *Route handler* untuk *Checkout* / Pembuatan Transaksi Kasir (misal: `app/api/transactions/route.ts`).
*   **Instruksi:**
    1. Di dalam blok logika yang memproses transaksi baru, ambil nilai input teks `tableNumber` (Nomor Meja) dari *payload* kasir.
    2. Lakukan pencarian ke tabel `DiningTable` (atau `Table`) berdasarkan `name` yang cocok secara *case-insensitive* (misal menggunakan `mode: 'insensitive'` di Prisma) dengan nilai `tableNumber` tersebut, DAN berstatus milik `tenantId` yang sedang aktif.
    3. Jika meja tersebut ditemukan, eksekusi kueri `UPDATE` untuk mengubah `status` meja tersebut menjadi `"Terisi"` (atau `"OCCUPIED"`).
    4. Proses ini harus berjalan di latar belakang (tanpa memblokir kecepatan *response* sukses transaksi).

### B. Validasi UX Quick-Toggle Status Meja
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx`
*   **Instruksi:**
    1. Pastikan *badge* status ("Tersedia" / "Terisi") di dalam tabel sudah berfungsi sebagai **tombol interaktif (Quick Toggle)**.
    2. Saat *badge* "Terisi" diklik, sistem harus langsung memanggil API `PUT /api/tables/[id]` untuk mengubah statusnya menjadi "Tersedia", begitupun sebaliknya.
    3. Berikan efek *hover* (kursor *pointer*) pada *badge* tersebut agar pengguna (kasir/pelayan) menyadari bahwa status tersebut bisa diklik secara manual saat tamu pulang dan meja sudah dibersihkan.

Silakan eksekusi logika sinkronisasi ini agar status Manajemen Meja selalu relevan dengan kondisi fisik di lapangan!
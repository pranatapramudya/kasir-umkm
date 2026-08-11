# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.79
**Fokus:** UI/UX Polish - Penghapusan PPN Statis & Modernisasi Delete Modal

## 1. Analisis Kebutuhan UI/UX
*   **Masalah Checkout (SaaS Logic):** Menampilkan PPN 11% secara *hardcode* di keranjang POS UMKM adalah sebuah kesalahan logika bisnis, karena sebagian besar *tenant* UMKM bukan Pengusaha Kena Pajak (PKP). Ini akan merusak kalkulasi total belanja.
*   **Masalah Estetika (Popup Hapus):** Penggunaan `window.confirm` bawaan peramban terlihat kaku, tidak profesional, dan keluar dari sistem desain Tailwind aplikasi. Dibutuhkan *Custom Modal* berbasis *React State* untuk konfirmasi penghapusan.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Lakukan pembersihan UI di keranjang belanja dan bangun komponen Modal baru untuk aksi hapus.

### A. Penghapusan Logika PPN di Keranjang (Kasir POS)
*   **Target File:** Komponen Keranjang/Cart (`app/page.tsx` atau komponen terkait di sisi kanan layar POS).
*   **Instruksi Refaktor:**
    1.  Cari bagian rincian pembayaran di bagian bawah keranjang (di atas tombol "BAYAR SEKARANG").
    2.  HAPUS baris UI yang menampilkan teks "PPN (11%)" beserta nominalnya.
    3.  Ubah logika kalkulasi **Total Belanja**. Pastikan rumusnya sekarang murni hanya `Total Belanja = Subtotal` (tanpa tambahan pajak apa pun).

### B. Implementasi Modern Delete Modal (Manajemen Karyawan)
*   **Target File:** `app/admin/karyawan/PegawaiClient.tsx` (atau file yang merender tabel Karyawan).
*   **Instruksi State & UI:**
    1.  Buat dua *React State* baru: 
        *   `isDeleteModalOpen` (boolean, *default* `false`).
        *   `selectedEmployee` (menyimpan ID dan Nama karyawan yang akan dihapus).
    2.  Ubah fungsi tombol "Trash/Hapus" di tabel. Jangan lagi memanggil `window.confirm`. Sebaliknya, saat diklik, ubah `selectedEmployee` ke data baris tersebut dan set `isDeleteModalOpen` ke `true`.
    3.  **Bangun UI Modal Hapus:**
        *   Gunakan struktur *backdrop* yang sama seperti modal Tambah Kasir (`bg-black/50 backdrop-blur-sm fixed inset-0 z-50`).
        *   Desain kotak dialog kecil (putih, *rounded*, *shadow-xl*) di tengah layar.
        *   Berikan ikon Peringatan (Segitiga/Alert) berwarna merah.
        *   Teks Konfirmasi: "Hapus Karyawan? Apakah Anda yakin ingin menghapus [Nama Karyawan]? Akun ini tidak akan dapat mengakses sistem lagi."
        *   Sediakan dua tombol sejajar: **"Batal"** (abu-abu ringan, menutup modal) dan **"Ya, Hapus"** (merah, memicu *Server Action* `deleteEmployee` yang sudah Anda buat sebelumnya).
    4.  Pastikan saat proses penghapusan berjalan, tombol "Ya, Hapus" berubah menjadi "Menghapus..." (*disabled*) agar terhindar dari klik ganda.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.58
**Fokus:** Audit & Implementasi Menyeluruh "Silent Refresh" pada Modul Rental

## 1. Analisis Masalah
Implementasi *Silent Refresh* (Stale-While-Revalidate) menggunakan `keepPreviousData` dan perbaikan logika *Loading* (`!data && !error`) telah berhasil diterapkan pada komponen mayor.
Namun, perlu dipastikan bahwa komponen eksklusif milik entitas `RENTAL` tidak terlewat dari pembaruan standar UX ini. Jika terlewat, tabel pada menu spesifik Rental akan tetap mengalami *screen flicker* saat terjadi pembaruan data atau *realtime mutation*.

## 2. Instruksi Eksekusi (Rental Module Sweep)
**Target File:** Seluruh komponen *Client-side* yang melakukan *data fetching* khusus untuk tipe bisnis Rental.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Audit Modul Armada / Unit:**
1. Buka komponen yang me- *render* daftar kendaraan/alat sewa (contoh: `ArmadaClient.tsx` atau `UnitList.tsx`).
2. Pastikan *hook* SWR sudah menggunakan `{ keepPreviousData: true }`.
3. Pastikan *Loading Spinner* penuh hanya muncul jika `!data && !error`.

**B. Audit Modul Transaksi Sewa:**
1. Buka komponen yang menangani daftar pesanan/reservasi masuk (contoh: `TransaksiSewaClient.tsx` atau tabel pesanan di Dashboard Rental).
2. Terapkan logika yang sama persis. Hal ini sangat krusial karena status pesanan (Menunggu -> Jalan -> Selesai) sering diubah, dan tabel tidak boleh menghilang saat status tersebut di- *update*.

**C. Verifikasi Ekstra (Buku Panduan / Modal):**
1. Pastikan proses pemuatan data di dalam *Modal* (seperti saat membuka Detail Transaksi Sewa) juga tidak menyebabkan isi modal berkedip jika terjadi *background refresh*.

Silakan sapu bersih sisa komponen Rental ini! Lapor kembali jika seluruh tabel di menu Armada dan Transaksi Sewa sudah berjalan sama mulusnya dengan Laporan Shift!
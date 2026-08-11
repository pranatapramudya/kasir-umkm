# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.64
**Fokus:** Autonomous Silicon Valley-Grade System Audit (Retail, F&B, Jasa)

## 1. Objektif Audit
Bertindaklah sebagai **Principal Software Engineer (Silicon Valley Level)**. Tugas Anda BUKAN menulis kode perbaikan secara langsung, melainkan melakukan *Deep Logic Audit* (Audit Logika Mendalam) terhadap arsitektur bisnis PJTECH KASIR UMKM yang mencakup 3 vertikal: Retail, F&B, dan Jasa. 

Fokuskan pencarian pada *Edge Cases*, *Race Conditions* (Kondisi Balapan), *Data Leaks* (Kebocoran Data Antar Tenant), dan *Revenue Leaks* (Celah Kehilangan Pendapatan).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Jalankan simulasi mental pada arsitektur kode saat ini (Database Schema, API Routes, State Management Frontend). Berikan laporan analitik tingkat tinggi mengenai kelemahan sistem berdasarkan vektor berikut:

### A. Vektor 1: Concurrency & Inventory (Retail & F&B)
*   **Skenario Race Condition:** Sisa stok "Kopi Susu" tinggal 1. Ada 2 kasir (di perangkat berbeda) memasukkan item tersebut ke keranjang dan menekan tombol "Bayar" di milidetik yang sama persis.
*   **Tugas Audit:** Apakah skema Prisma dan API transaksi saat ini memiliki mekanisme *Locking* atau validasi *Atomic* untuk mencegah stok menjadi minus (`-1`)? Bagaimana penanganan sistem terhadap *Double Spend* stok ini?

### B. Vektor 2: Lifecycle & State Mutation (F&B Eksklusif)
*   **Skenario Manajemen Meja:** Pelanggan di Meja 01 pindah ke Meja 02, namun Meja 02 tiba-tiba diisi oleh orang lain sebelum sistem diperbarui. Atau skenario *Split Bill* (Satu meja bayar terpisah).
*   **Tugas Audit:** Apakah struktur status meja (`available`, `occupied`) cukup kuat untuk menangani perubahan status yang asinkron tanpa menyebabkan *bug* meja terkunci (*ghost table*)?

### C. Vektor 3: Keamanan Operasional & Kasir (Global)
*   **Skenario Kasir Nakal (Revenue Leak):** Kasir memberikan *Diskon* manual sebesar 100% kepada temannya, atau melakukan *Refund* (Retur) tanpa persetujuan *Owner*, lalu mengambil uang tunai dari laci.
*   **Tugas Audit:** Apakah sistem saat ini memiliki pembatasan *Role-Based Access Control* (RBAC) pada level API? Apakah ada batasan maksimal diskon? Bagaimana *Shift Report* (Laporan Shift) mencatat anomali ini agar *Owner* tahu?

### D. Vektor 4: Benturan Waktu Karyawan (Jasa Eksklusif)
*   **Skenario Booking/Komisi:** Pelanggan A dan Pelanggan B dilayani oleh Pekerja yang sama (Misal: Kapster Budi) di waktu yang identik pada struk yang berbeda. 
*   **Tugas Audit:** Apakah sistem mengizinkan satu pekerja "mengerjakan" dua layanan dalam satu waktu yang sama (yang secara logika fisik mustahil)? Apakah perlu ada validasi *Worker Availability* di masa depan?

## 3. Format Laporan yang Diharapkan
1.  **Identifikasi Celah Kritis:** Sebutkan kelemahan sistem dari keempat vektor di atas.
2.  **Tingkat Keparahan (Severity):** Tentukan apakah itu *Blocker*, *High*, atau *Low Priority*.
3.  **Proposal Arsitektur:** Berikan solusi konseptual (contoh: implementasi *Prisma Transaction*, pembuatan tabel *Audit Log*, dll) sebelum kita mengeksekusi kodenya.

Silakan lakukan audit komprehensif sekarang!
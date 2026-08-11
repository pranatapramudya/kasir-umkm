# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.06 (Planning Mode)
**Fokus:** Hotfix SWR Initial Load Delay & Pengembangan Fitur Rekonsiliasi Kasir (Shift Report)

## 1. Tujuan Akhir (Goal)
1.  **Zero-Delay POS:** Memperbaiki isu *delay* pemuatan produk di halaman Kasir POS di mana pengguna harus melakukan *refresh* manual. Data harus tampil seketika (responsif) meskipun menangani ribuan produk.
2.  **Laporan Kasir (Rekonsiliasi Shift):** Menambahkan satu menu khusus untuk *Role* `CASHIER` agar mereka dapat memantau pendapatan harian shift mereka (Tunai vs. QRIS) untuk mencegah selisih kas, tanpa mengekspos metrik Laba Bersih/Pengeluaran milik *Owner*.

## 2. Batasan Arsitektur & Desain (Constraints)
*   **Hotfix Delay (SWR Optimization):** 
    *   Pastikan `useSWR` pada komponen klien Kasir memiliki konfigurasi yang tepat. Jika perlu, berikan `fallbackData` (data awal yang diambil dari Server Component) agar halaman Kasir tidak pernah memiliki status kosong pada saat render pertama (*First Contentful Paint*).
    *   Pastikan parameter SWR *key* tidak tertahan oleh nilai *state* yang *undefined* pada render awal.
*   **Menu Baru & Role Handling:**
    *   Tambahkan menu baru bernama "Laporan Kasir" (atau "Riwayat Shift") pada `SidebarClient.tsx`.
    *   Menu ini harus berada di bawah grup "MENU UTAMA" dan HANYA bisa diakses oleh `CASHIER` (atau `OWNER` yang ingin melihat riwayat).
*   **UI/UX Dasbor Kasir (Rekonsiliasi):**
    *   Halaman ini wajib memiliki **Filter Kalender** (Date Picker) agar kasir bisa menarik data penjualan berdasarkan tanggal tertentu.
    *   Harus menampilkan 3 Kartu Metrik Utama: **Total Pendapatan (Gross)**, **Total Tunai (Cash di Laci)**, dan **Total QRIS (Mutasi Digital)**.
    *   Menampilkan tabel riwayat transaksi (Faktur) pada hari tersebut.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda menulis atau mengubah baris kode, berikan rancangan Anda dengan menjawab poin berikut:
1.  **Diagnosa Delay SWR:** Jelaskan secara teknis mengapa produk mengalami *delay* saat akun Karyawan dibuka, dan apa solusi Anda (apakah menggunakan *fallbackData* SSR atau mengubah parameter `useSWR`).
2.  **Arsitektur Route Laporan Kasir:** Sebutkan struktur folder dan file rute baru untuk halaman Laporan Kasir (misal: `app/laporan-kasir/page.tsx`).
3.  **Draf Kueri Prisma:** Tuliskan draf kueri Prisma untuk mengambil data rekapitulasi (Tunai vs QRIS) berdasarkan filter kalender (`createdAt`) dan ID Kasir yang sedang *login*.

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengubah kode!**
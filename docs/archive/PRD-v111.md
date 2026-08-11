# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.11 (Planning Mode)
**Fokus:** Penambahan Rincian Item Terjual (Itemized Details & Product Summary) pada Laporan Shift

## 1. Tujuan Akhir (Goal)
Melengkapi halaman "Laporan Shift" dengan transparansi produk. Kasir dan Owner tidak hanya bisa melihat uang masuk (Tunai vs QRIS), tetapi juga **apa saja barang yang dibeli beserta kuantitasnya** pada setiap transaksi maupun secara akumulatif dalam satu hari tersebut.

## 2. Batasan Arsitektur & Relasi Database (Constraints)
*   **Relasi Prisma:** Pastikan kueri Prisma untuk mengambil riwayat transaksi menyertakan relasi ke tabel *item* transaksi (misal: `include: { items: { include: { product: true } } }` atau nama relasi yang sesuai di skema Prisma Anda).
*   **UI/UX Detail Transaksi:** 
    *   Pada tabel "Riwayat Transaksi Harian", berikan tombol aksi (misal: ikon panah, teks "Lihat Detail", atau membuat baris tabel bisa diklik) untuk membuka modal (*popup*) atau *accordion* yang menampilkan daftar barang, jumlah (`qty`), dan harga satuan dari transaksi tersebut.
*   **Ringkasan Produk Terjual (Opsional/Bonus Rangkuman):** Sediakan juga tabel kecil atau daftar ringkasan akumulasi produk yang keluar pada tanggal yang dipilih (Contoh: *Nike (Size 40): Terjual 2 pcs*), sehingga kasir lebih gampang mencocokkan sisa fisik barang di rak.

## 3. Instruksi Perencanaan (Planning Mandate)
**TOLONG BUATKAN IMPLEMENTATION PLAN TERLEBIH DAHULU.**
Sebelum Anda menulis atau mengubah baris kode apa pun, berikan rancangan Anda:
1.  **Audit Skema Prisma:** Periksa bagaimana tabel `Transaction` berelasi dengan tabel *item* produk di `schema.prisma`. Sebutkan nama model relasinya (misal: `TransactionItem` atau `OrderItem`).
2.  **Strategi UI Modal/Dropdown:** Jelaskan bagaimana Anda akan menampilkan rincian barang pada tabel tanpa membuat antarmuka menjadi sumpek atau merusak tata letak tabel yang sudah rapi (*compact*).
3.  **Draf Kueri API:** Tuliskan draf pembaruan kueri Prisma pada rute Laporan Shift agar sukses menarik data produk di dalam transaksi.

**Tunggu instruksi `APPROVED` dari saya sebelum Anda mulai mengubah kode!**
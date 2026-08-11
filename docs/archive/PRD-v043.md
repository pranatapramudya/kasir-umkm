# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.43
**Fokus:** Integrasi Data Real & Charting Library untuk Dasbor Analitik

## 1. Analisis Kebutuhan
*   **Kondisi Saat Ini:** Halaman `/admin/analytics` sudah terbuka dan UI sudah rapi, namun data yang ditampilkan pada 4 kartu fitur utama masih berupa elemen HTML/CSS statis (*dummy placeholder*).
*   **Tujuan Eksak:** Menghidupkan keempat kartu metrik tersebut menggunakan data transaksi nyata dari basis data Prisma dan merendernya ke dalam bentuk grafik/visual yang interaktif.

## 2. Instruksi Eksekusi Backend & Frontend untuk AI Agent
Sebagai agen pengembang, tugas Anda adalah mengganti UI *dummy* dengan komponen grafik nyata.

### A. Instalasi Dependensi (Charting)
*   Jalankan perintah instalasi untuk library visualisasi data React standar. Direkomendasikan menggunakan `recharts` karena sangat kompatibel dengan Next.js:
    `npm install recharts` (atau menggunakan manajer paket lain yang sesuai).

### B. Pembuatan API / Server Actions untuk Agregasi Data
Buat *endpoint* atau fungsi pengambil data dari Prisma yang melakukan agregasi agregasi berikut:
1.  **Data Jam Sibuk:** 
    *   Ambil semua transaksi (atau filter berdasarkan bulan ini).
    *   Kelompokkan data berdasarkan Jam (`hour` diekstrak dari `createdAt`).
    *   Hitung jumlah transaksi (`count`) di setiap jam tersebut.
2.  **Data Analitik Produk (Top & Bottom):**
    *   Lakukan kueri pada `TransactionItem`, kelompokkan berdasarkan `productId`.
    *   Agregasi total kuantitas (`quantity`) yang terjual.
    *   Kembalikan 5 produk dengan penjualan tertinggi (Laris) dan 5 terendah (Dead Stock).
3.  **Data Stok Menipis:**
    *   Lakukan kueri pada tabel `Product`.
    *   Ambil produk di mana `stock <= 10` (atau batas ambang wajar lainnya).
4.  **Data Performa Kasir:**
    *   Lakukan kueri agregasi pada `Transaction`.
    *   Kelompokkan berdasarkan `userId` (atau relasi ke tabel User/Kasir jika ada).
    *   Hitung total (`sum`) dari pendapatan (total/subtotal) yang dihasilkan masing-masing kasir.

### C. Penggantian UI Frontend (Integrasi Recharts)
*   **Target File:** `app/admin/analytics/page.tsx` (dan komponen-komponen kartunya).
*   **Instruksi:**
    1.  Tarik data dari fungsi Backend yang baru dibuat di atas menggunakan *Server Components* (jika memungkinkan) atau melalui *fetch* klien.
    2.  Hapus semua elemen div abu-abu (*dummy bars*).
    3.  **Kartu Jam Sibuk:** Render menggunakan `<BarChart>` atau `<AreaChart>` dari Recharts.
    4.  **Kartu Analitik Produk:** Render menggunakan daftar UI (List) atau `<BarChart>` horizontal (Bar) yang membedakan warna untuk produk laris (misal: Hijau) dan *dead stock* (misal: Merah).
    5.  **Kartu Peringatan Stok:** Render sebagai daftar UI berperingatan kuning/merah, menampilkan nama produk dan sisa stok aktualnya.
    6.  **Kartu Performa Kasir:** Render menggunakan `<PieChart>` atau daftar *leaderboard* sederhana.
*   **Catatan Fallback:** Jika data di *database* masih kosong, pastikan komponen grafik tidak mengalami *crash*, melainkan menampilkan teks "Belum ada data transaksi yang memadai".
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.48
**Fokus:** F&B Module System Audit & Production-Readiness Check

## 1. Tujuan Audit
Melakukan inspeksi kode menyeluruh (Code Review) dan simulasi logika operasional pada ekosistem F&B. Tujuannya adalah untuk memastikan modul ini 100% siap produksi (*Production-Ready*), aman (Multi-tenant terisolasi), dan terbebas dari kebocoran UI/UX lintas kategori sebelum beralih ke pengembangan modul Jasa.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pemeriksaan mendalam pada *codebase* berdasarkan parameter di bawah ini. JANGAN langsung mengubah kode. **Keluarkan output berupa "Laporan Hasil Audit" (Pass / Fail)** pada setiap poin, beserta temuan *bug* jika ada. Jika ada *bug* kritikal, perbaiki secara otomatis.

### Parameter Audit 1: Multi-Tenant & Security Isolation (Kritikal)
*   **Pengecekan:** Periksa semua API routes (GET, POST, PUT, DELETE) di `/api/products`, `/api/tables`, `/api/transactions`, dan `/api/analytics`.
*   **Syarat Lulus:** Setiap kueri Prisma (terutama kueri `findMany`, `update`, `delete`) WAJIB menyertakan klausul `where: { tenantId: session.userId }` atau `userId`. DILARANG KERAS ada API yang bisa menampilkan atau mengedit data meja/transaksi milik toko lain.

### Parameter Audit 2: End-to-End F&B Transaction Flow
*   **Pengecekan:** Telusuri alur komponen Kasir Resto (`app/admin/kasir-resto`).
*   **Syarat Lulus:** 
    1. Input pesanan dengan `catatan khusus` berhasil masuk ke keranjang dan tersimpan ke *database*.
    2. Meja yang diketik di *checkout* berhasil diubah statusnya menjadi "Terisi" di tabel `DiningTable` tanpa memblokir proses pembayaran.
    3. Struk Pelanggan mencetak nomor telepon dinamis dan footer "Powered by PJTECH".
    4. Tiket Dapur sukses merender layout cetak besar dengan "Catatan Khusus" (tanpa harga).

### Parameter Audit 3: Role-Based Access Control (RBAC)
*   **Pengecekan:** Evaluasi visibilitas Sidebar dan antarmuka Manajemen Meja.
*   **Syarat Lulus:** Jika `role === 'employee'` & `kategoriUsaha === 'F&B'`, mereka HANYA bisa melihat Dashboard (Opsional/Sembunyi), Kasir Resto, Laporan Shift, dan Manajemen Meja. Pada halaman Manajemen Meja, karyawan hanya bisa mengubah status (Quick Toggle) dan TIDAK BISA mengakses tombol Tambah/Edit/Hapus.

### Parameter Audit 4: State Management & UI Leaks
*   **Pengecekan:** Form Manajemen Produk.
*   **Syarat Lulus:** Jika `kategoriUsaha === 'F&B'`, field SKU, Merek, dan Varian harus tersembunyi. Foto menu harus bisa dirender. Semua form input angka (Stok/Kapasitas) harus memiliki *initial state* kosong (`""`), bukan `100` atau `4`.

Silakan jalankan audit ini dan berikan laporan detailnya. Jika 4 parameter ini berstatus "PASS", sistem F&B dinyatakan Layak Produksi!
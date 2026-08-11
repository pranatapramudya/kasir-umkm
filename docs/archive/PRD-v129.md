# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.29
**Fokus:** Global UI Gradient, Multi-Tenant Dashboard Trend, & Vertical Business Audit

## 1. Instruksi UI/UX (Global Button Gradient)
*   **Masalah:** Warna tombol biru solid saat ini terlalu mencolok dan menyebabkan mata cepat lelah jika dipandang dalam waktu lama (*visual fatigue*).
*   **Instruksi Tailwind:** 
    1. Cari semua implementasi tombol aksi utama (Primary Buttons) di seluruh aplikasi (atau ubah di komponen `<Button />` global jika Anda menggunakan Shadcn UI/komponen modular).
    2. Ganti kelas `bg-blue-600 hover:bg-blue-700` menjadi gradasi modern yang bersih dan *soft*:
       `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0`
    3. Terapkan juga efek transisi agar perpindahan warna saat di-*hover* terasa mulus: `transition-all duration-200 ease-in-out`.

## 2. Aktivasi Tren Penjualan Dashboard (Strict Multi-Tenancy)
*   **Masalah:** Grafik/Metrik Tren Penjualan di menu Dashboard saat ini belum aktif (kemungkinan masih menggunakan data *dummy* statis) dan belum diuji isolasi datanya antar akun.
*   **Instruksi Logic & Data Fetching:**
    1. **Target File:** `app/admin/dashboard/page.tsx` atau aksi *backend* `getDashboardData`.
    2. Tarik data `Transaction` dari database (Prisma) dan kelompokkan berdasarkan tanggal untuk membentuk tren penjualan (misal: 7 hari terakhir).
    3. **ATURAN MULTI-TENANT KRUSIAL:** Anda WAJIB memastikan bahwa setiap *query* Prisma menyertakan filter `tenantId` (atau `storeId`) dari akun pengguna yang sedang *login* (didapat dari sesi Clerk). 
       *(Contoh: `where: { tenantId: currentUser.tenantId, createdAt: { gte: sevenDaysAgo } }`)*.
    4. Hubungkan data dinamis tersebut ke dalam komponen grafik (seperti Recharts) di `DashboardClient.tsx`.

## 3. Tugas Audit Sistem (BACA DAN JAWAB DALAM OUTPUT ANDA)
Sebagai AI Agent yang mengembangkan aplikasi ini, saya meminta Anda melakukan **Architectural Audit** terhadap *database schema* (Prisma) dan fitur saat ini. 
Jawablah pertanyaan berikut di dalam laporan implementasi Anda:
**"Apakah sistem Kasir POS PJTECH saat ini sudah sepenuhnya siap mengakomodasi 3 jenis bisnis berikut, atau ada field/fitur yang kurang?"**
*   **Retail/Toko Kelontong:** (Apakah mendukung SKU, Barcode scanner, peringatan stok minimum?)
*   **F&B / Kuliner:** (Apakah mendukung Varian Produk, nomor meja, cetak struk ke dapur/kitchen printer?)
*   **Jasa / Servis:** (Apakah mendukung produk tanpa stok fisik/inventory, atau pencatatan durasi layanan?)

Silakan eksekusi perbaikan UI dan aktivasi fitur Dashboard tersebut. Setelah selesai, berikan jawaban Audit Sistem Anda secara ringkas!
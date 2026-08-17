# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.18
**Fokus:** Bug Fix - API Date Range Filtering untuk Tarik Antrean Rental

## 1. Analisis Masalah
Fitur "Tarik Antrean" pada Kasir Rental gagal memuat data pesanan online. Hal ini disebabkan oleh logika *query filter* tanggal di Backend (API) yang hanya mencocokkan parameter tanggal dengan `startDate`. Pada bisnis Rental, satu pesanan membentang selama beberapa hari (`startDate` hingga `endDate`). Jika kasir mencari antrean pada hari kedua penyewaan, sistem mengembalikan hasil kosong karena `startDate` ada di hari pertama.

## 2. Instruksi Eksekusi (Backend Prisma Query)
**Target File:** API Endpoint Tarik Antrean (contoh: `app/api/booking/today/route.ts`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Modifikasi Query Tanggal Khusus Bisnis Rental:**
1. Di dalam logika API, periksa apakah tipe bisnis (tenant) adalah **Rental/Travel**.
2. Jika Rental, ubah kondisi `where` untuk *filtering* tanggal menjadi pencarian rentang waktu (*Date Overlap/Between*), BUKAN kecocokan hari pada `startDate` saja.
3. Logika Prisma yang benar untuk parameter `date` (yang dikirim dari Date Picker modal):
   - Waktu yang dicari (`targetDate`) harus memotong masa sewa.
   - Gunakan logika: `startDate <= akhirHari(targetDate)` DAN `endDate >= awalHari(targetDate)`.
   - Atau dalam syntax Prisma: 
     `startDate: { lte: endOfDay }` AND `endDate: { gte: startOfDay }`.

**B. Verifikasi Parameter Status Rental:**
1. Pastikan *query* Rental TETAP hanya memanggil pesanan yang berstatus **`COMPLETED`** (Siap Berangkat) ATAU **`IN_PROGRESS`** (Sedang Jalan).
2. Jangan ubah *query* milik bisnis Jasa (Jasa tetap menggunakan pencarian `startDate` pada hari H dan menarik status `PENDING` atau `COMPLETED`).

**C. Pastikan UI Date Picker Tersedia di Modal Rental:**
1. Pastikan Modal "Tarik Antrean" di halaman Kasir Rental (`app/admin/rental-pos/page-client.tsx`) sudah memiliki `<input type="date">` yang berfungsi menembak parameter `?date=YYYY-MM-DD` ke API (sama persis dengan yang sudah dikerjakan di Kasir Jasa).

Silakan sempurnakan logika *Date Range* ini! Lapor jika pesanan Rental yang membentang selama beberapa hari sudah bisa terdeteksi dan ditarik pada hari apa pun di dalam rentang waktu sewanya!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.82
**Fokus:** Backend Integration - Menghubungkan UI Kalender Sewa dengan Database Prisma

## 1. Analisis Masalah (Penggantian Mock Data)
Antarmuka pengguna (UI) Kalender Sewa Harian (Split View) telah selesai dan berjalan sempurna di lingkungan seluler. Namun, data yang ditampilkan masih berupa *mock data* (statis). Data ini harus dihapus dan digantikan dengan integrasi pemanggilan data (Data Fetching) langsung dari *database* menggunakan Prisma, dengan tetap menjaga keamanan isolasi data antar toko (Multi-Tenant).

## 2. Instruksi Eksekusi (Full-Stack Data Fetching)
**Target File:** `app/admin/rental-calendar/page.tsx` (atau komponen *Client/Server* terkait di dalamnya) dan *Route API/Server Actions* untuk pengambilan data.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pengambilan Data Dinamis (Prisma Query):**
1. Hapus seluruh variabel data *dummy* statis yang disuntikkan sebelumnya.
2. Buat fungsi pemanggilan data (bisa menggunakan *Server Component async/await* atau *SWR/React Query* jika di sisi *Client*) untuk mengambil daftar transaksi penyewaan dari *database* menggunakan Prisma.
3. **Krusial (Keamanan Multi-Tenant):** Pastikan *query* Prisma memfilter data berdasarkan `storeId` atau `tenantId` dari sesi pengguna (*auth*) yang sedang aktif, agar pengguna tidak bisa melihat data sewa dari toko lain!
4. Filter data transaksi yang hanya berstatus terkait sewa (misal: "Booking", "Aktif", "Overdue", "Selesai").

**B. Pemetaan Data ke UI Kalender (Mapping):**
1. Konversi data tanggal dari PostgreSQL ke format yang dikenali oleh `date-fns`.
2. Petakan (*map*) data tersebut agar titik indikator (*dot*) di kalender bulanan hanya muncul pada tanggal di mana ada transaksi yang valid.
3. Saat pengguna mengklik suatu tanggal, filter *array* hasil *query* Prisma untuk hanya merender kartu *Agenda/Booking* yang tanggal Ambil/Kembalinya beririsan dengan tanggal yang dipilih.

**C. Penanganan State (Loading & Empty):**
1. Tambahkan *loading state* (misal: animasi *skeleton* atau *spinner* sederhana) saat data sedang diambil dari *database*.
2. Jika pada tanggal yang dipilih tidak ada penyewaan, tampilkan pesan kosong yang elegan (misal: teks *"Tidak ada jadwal sewa untuk tanggal ini."* yang berada di tengah layar).

Silakan sambungkan pembuluh darah *backend* ini ke UI kalender! Pastikan aplikasi tidak *crash* saat data dari *database* kosong. Lapor jika kalender sudah sepenuhnya hidup dengan data asli!
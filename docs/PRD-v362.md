# Product Requirements Document: PJTECH KASIR UMKM 
**Versi:** 0.3.62
**Fokus:** Bug Fix - Sinkronisasi Payload Data & Akses Tombol Unduh Excel di Dashboard

## 1. Analisis Masalah
Berdasarkan klarifikasi alur bisnis, fitur **"Unduh Laporan (Excel)"** secara eksklusif hanya berada di halaman `Dashboard` dan `Analitik`, yang mana halaman ini hanya dapat diakses oleh peran `OWNER`. Halaman `Laporan Shift` (yang dapat diakses oleh `CASHIER`) tidak memiliki fitur unduhan dokumen.

Kegagalan penerapan *Dynamic Header* pada file Excel (seperti dilaporkan sebelumnya) disebabkan karena fungsi *export handler* di halaman Dashboard tidak menerima *payload* atau argumen `businessType` yang benar, atau API route yang menangani unduhan Dashboard masih menggunakan logika statis yang terisolasi dari *state* Tenant.

## 2. Instruksi Eksekusi (Dashboard Export Calibration & Role Validation)
**Target File:** Komponen `DashboardClient.tsx` (atau file yang memiliki tombol "Unduh Laporan") dan fungsi *handler* pembuat Excel yang terhubung ke tombol tersebut.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Injeksi Parameter Tenant ke Fungsi Export:**
1. Buka komponen Dashboard yang me- *render* tombol unduh Excel.
2. Saat tombol tersebut diklik (misal pada fungsi `onClick={handleDownloadExcel}`), Anda **WAJIB** mengirimkan *value* dari `tenant.category` atau `businessType` milik pengguna yang sedang *login* (sebagai *argument* fungsi atau *query parameter*).
3. Jika menggunakan *client-side generation* (seperti library `xlsx`), pastikan variabel penentu (contoh: `const isRental = businessType.includes("RENTAL")`) dievaluasi tepat sebelum data di- *map* menjadi *header* baris pertama.

**B. Penguncian Akses Role (Security Check):**
1. Lakukan validasi ganda (Double Check) di dalam *handler* pembuat Excel: Pastikan bahwa *role* dari pengguna yang mengeksekusi fungsi ini adalah mutlak `OWNER`.
2. Jika ada upaya eksekusi dari klien dengan *role* `CASHIER` (misalnya mem-*bypass* UI dengan injeksi *script*), fungsi tersebut harus langsung me- *return error/unauthorized* dan tidak mengembalikan sebaris data pun.

Silakan sinkronkan tombol di Dashboard ini! Lapor kembali ketika eksekusi *export* dari Dashboard sudah dijamin menggunakan parameter `businessType` yang akurat dan *role* yang terkunci!
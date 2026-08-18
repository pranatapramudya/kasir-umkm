# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.19
**Fokus:** Real-time Dispatch Timer (Overwrite startDate pada saat Start Perjalanan)

## 1. Analisis Masalah
Berdasarkan masukan dari praktisi lapangan, pencatatan waktu mulai sewa (`startDate`) pada aplikasi Kasir Rental saat ini tidak akurat. Saat pelanggan memesan via form publik, sistem mengunci waktu pada `00:00` (awal hari). Akibatnya, argometer sewa terhitung sejak tengah malam, bukan sejak kendaraan benar-benar diberangkatkan. Sistem harus menimpa (overwrite) `startDate` dengan waktu aktual (waktu server saat itu juga) ketika admin menekan tombol "Mulai Perjalanan".

## 2. Instruksi Eksekusi (Backend Action & Database Update)
**Target File:** Server Actions atau API Endpoint yang menangani event klik "Mulai Perjalanan / Start" (kemungkinan `app/admin/orders/actions.ts` atau endpoint PUT `/api/booking`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Overwrite `startDate` saat Event "Start":**
1. Buka fungsi/handler yang bertugas mengubah status Booking menjadi `IN_PROGRESS`.
2. Saat fungsi ini dieksekusi, perbarui (*update*) tidak hanya field `status`, tetapi juga field `startDate`.
3. Set `startDate = new Date()` (waktu server/sekarang dengan tingkat presisi jam dan menit).
4. *(Catatan: Di PRD-v305 kita pernah membuat field `actualStartedAt`. Jika field itu ada, Anda boleh menggunakan field tersebut sebagai acuan waktu mulai yang baru. Namun, yang terpenting adalah argometer sistem sekarang harus menghitung dari jam klik Start, bukan jam 00:00).*

**B. Sinkronisasi UI Kalender Sewa:**
1. Pastikan UI di halaman "Kalender Sewa" merender waktu `startDate` yang sudah di-update ini. 
2. Jika admin menekan tombol "Start" pada pukul 08:30 pagi, maka di Kalender Sewa (seperti pada *image_338755.png*) harus tertulis: `Mulai: 20 Agt, 08:30`.

Silakan rombak logika *dispatch* ini! Lapor jika tombol Start sudah berfungsi layaknya *stopwatch* yang mencatat waktu keberangkatan supir secara *real-time*!
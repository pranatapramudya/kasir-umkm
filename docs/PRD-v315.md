# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.15
**Fokus:** Bug Fix - API Date Filtering & UI Date Picker pada Modal Tarik Antrean

## 1. Analisis Masalah
Modal "Tarik Antrean Online" saat ini mengembalikan hasil kosong (Empty State) meskipun ada pesanan `PENDING` atau `COMPLETED`. Hal ini terjadi karena API mengunci *query* secara *hardcode* hanya untuk tanggal hari ini (*server time*), sementara pesanan bisa jadi dijadwalkan untuk besok atau terjadi *timezone mismatch* (UTC vs Local). Kasir membutuhkan fleksibilitas untuk melihat antrean berdasarkan tanggal yang dipilih.

## 2. Instruksi Eksekusi (API Query Params & Frontend UI)
**Target File:** Endpoint API Tarik Antrean (contoh: `app/api/booking/today/route.ts`) dan Komponen Modal Tarik Antrean di Kasir (`app/page-client.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Modifikasi API Endpoint (Terima Parameter Tanggal):**
1. Buka API endpoint yang melayani penarikan antrean POS.
2. Tangkap parameter URL `?date=` (misal: `YYYY-MM-DD`).
3. Jika parameter `date` ada, gunakan tanggal tersebut untuk memfilter `startDate` / `waktu layanan` di database menggunakan batasan awal hari (00:00:00) hingga akhir hari (23:59:59) pada zona waktu lokal.
4. Jika parameter kosong, gunakan *fallback* `new Date()` (hari ini).

**B. Modifikasi UI Modal Tarik Antrean:**
1. Di dalam Modal "Antrean Online", tambahkan elemen `<input type="date" />` di bagian atas (di bawah header modal).
2. Set nilai *default* input tersebut ke hari ini.
3. Hubungkan input tersebut dengan *state* (misal `selectedQueueDate`).
4. Saat input tanggal diubah oleh kasir, jalankan ulang *fetch* API dengan mengirimkan parameter tanggal tersebut (contoh: `/api/booking/today?date=${selectedQueueDate}`).

**C. Hapus Teks Statis "Hari Ini":**
1. Ubah teks pesan kosong dari: *"Belum ada antrean yang disetujui untuk hari ini."* menjadi *"Belum ada antrean untuk tanggal yang dipilih."*
2. Ubah judul Modal dari *"Antrean Online Hari Ini"* menjadi *"Tarik Antrean Online"*.

Silakan mutasikan fitur ini! Lapor jika kasir sudah bisa memilih tanggal di dalam modal dan menarik pesanan untuk tanggal 17 Agustus atau tanggal lainnya!
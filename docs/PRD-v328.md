# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.28
**Fokus:** Unified Workspace - Integrasi Action Button ke Kalender Sewa & Depresiasi Inbox

## 1. Analisis Masalah
Saat ini terjadi redundansi alur kerja (UX Flaw) pada operasional Rental. Admin harus melihat jam aktual di menu "Kalender Sewa", namun harus berpindah ke menu "Inbox Pesanan Online" untuk melakukan aksi (*Start/Finish*). Untuk menyederhanakan *workspace*, seluruh alur hidup pesanan (*lifecycle*) beserta tombol aksinya harus disatukan ke dalam satu halaman saja (Kalender Sewa), sehingga menu Inbox tidak lagi dibutuhkan sebagai halaman terpisah untuk operasional inti.

## 2. Instruksi Eksekusi (Frontend Re-layouting & Component Migration)
**Target File:** Komponen Halaman `Kalender Sewa` (atau `Agenda Sewa`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pindahkan Tombol Aksi ke Kartu Kalender:**
1. Buka komponen yang me-render kartu pesanan di "Kalender Sewa" (seperti yang terlihat pada referensi UI, di mana terdapat detail Mobil, Nama Pelanggan, Mulai, Selesai, dan Tujuan).
2. Pindahkan komponen Tombol Aksi (*Action Buttons*) yang sebelumnya berada di Inbox ke dalam kartu Kalender ini.
3. Render tombol berdasarkan status secara *real-time*:
   - Jika `PENDING`: Munculkan tombol **"Setujui Pesanan"**.
   - Jika `COMPLETED`: Munculkan tombol **"🚀 Mulai Perjalanan / Start"**.
   - Jika `IN_PROGRESS`: Munculkan tombol **"✅ Tiba di Pool / Finish"**.

**B. Pastikan Visibilitas Semua Status (Tabs/Filter):**
1. Karena Kalender Sewa sekarang menjadi pusat operasional, pastikan *query fetch* API untuk halaman ini menarik SEMUA status (`PENDING`, `COMPLETED`, `IN_PROGRESS`, `FINISHED`).
2. Sediakan Tab Filter di bagian atas Kalender (Menunggu, Siap Berangkat, Sedang Jalan, Selesai) agar admin tidak kewalahan melihat semua kartu menumpuk.

**C. Depresiasi / Redirect Halaman Inbox:**
1. Untuk menghindari kebingungan pengguna bisnis, sembunyikan menu "Pesanan Online (Inbox)" dari *Sidebar/Bottom Nav* KHUSUS untuk tenant bisnis **Rental/Travel**.
2. (Alternatif) Jika menu Inbox tetap ingin dipertahankan di *Sidebar*, buat halamannya me- *redirect* otomatis ke halaman Kalender Sewa.

Silakan mutasikan *workflow* ini! Lapor jika admin sudah bisa melakukan *Approve*, *Start*, dan *Finish* langsung dari dalam kartu di halaman Kalender Sewa!
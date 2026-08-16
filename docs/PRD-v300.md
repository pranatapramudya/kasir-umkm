# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.00 (REVISI FINAL)
**Fokus:** Fleet Lifecycle (Checkout Overtime Modal), Geolocation Slug, & Rental Base Logic

## 1. Analisis Masalah
1. **Titik Penjemputan:** Butuh input lokasi otomatis berbasis GPS.
2. **Copywriting Rental:** Penyesuaian teks "Harga Jual".
3. **Logika Overtime (Kelebihan Jam) di Lapangan:** Sistem tidak boleh memberikan denda otomatis yang kaku karena kondisi lapangan (seperti macet) tidak bisa diprediksi. Klien membutuhkan fleksibilitas bagi admin/kasir untuk memasukkan "Biaya Tambahan/Overtime" secara manual saat armada dikembalikan ke *pool*.
4. **Kalkulasi Dasar (Multi-Hari):** Durasi di bawah 24 jam tetap terhitung sebagai 1 hari penuh.

## 2. Instruksi Eksekusi (Frontend & State Logic)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Fitur Titik Penjemputan Otomatis (Halaman Slug):**
1. Pada form Booking di Katalog Slug, tambahkan input "Lokasi Penjemputan" dan tombol "📍 Gunakan Lokasi Saat Ini".
2. Gunakan `navigator.geolocation.getCurrentPosition`. Jika diizinkan, isi input dengan URL: `https://maps.google.com/?q=[latitude],[longitude]`.

**B. Update Copywriting Data Armada:**
1. Ubah label "Harga Jual" pada tabel Manajemen Layanan/Armada menjadi **"Harga Sewa (Per Hari)"**.

**C. Pembuatan Siklus "Finish" dengan Modal Overtime Fleksibel:**
1. Di halaman Detail Pesanan (Kasir/Inbox), pada pesanan berstatus "Sedang Jalan / Diterima", buat tombol **"✅ Tiba di Pool / Finish"**.
2. **Krusial:** Saat tombol "Finish" diklik, JANGAN langsung menutup pesanan. Tampilkan **Modal Konfirmasi "Penyelesaian Sewa"**.
3. Isi Modal tersebut:
   - Ringkasan: Nama Penyewa, Armada, dan Total Tagihan Awal.
   - **Input Field Baru:** "Biaya Tambahan / Denda Overtime (Opsional)". (Default: Rp 0).
   - Teks Bantuan: *"Isi jika penyewa melebihi batas waktu (overtime) atau ada biaya kerusakan. Kosongkan jika tidak ada."*
4. Saat admin menekan "Konfirmasi Selesai" di dalam modal tersebut, tambahkan *Biaya Tambahan* tersebut ke *Total Tagihan*, ubah status menjadi "Selesai", dan bebaskan status armada di database.

**D. Logika Kalkulasi Sewa Dasar (Minimum 1 Hari):**
1. Saat form pemesanan awal dibuat, gunakan selisih hari (`differenceInDays` atau `Math.ceil`). 
2. Tetapkan aturan bawaan: Nilai minimum "Total Hari" adalah 1. (Pengembalian di hari yang sama atau di bawah 24 jam tetap dikalkulasi 1 x Harga Sewa Harian).

Silakan bangun alur operasional rental yang realistis dan fleksibel ini! Lapor jika sistem "Modal Overtime" saat *Finish* sudah berjalan sempurna.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.27
**Fokus:** 24-Hour Time Loop Fix & Cascading Region Dropdown (Provinsi -> Kota -> Kecamatan)

## 1. Analisis Masalah
1. **Time Loop Terbatas:** *Dropdown* "Jam Penjemputan" saat ini hanya memuat waktu mulai pukul 06:00. Ini tidak mendukung operasional 24 jam (seperti antar-jemput bandara dini hari).
2. **Kebutuhan Granularitas Lokasi:** Input Provinsi saja tidak cukup untuk menentukan estimasi tarif rental. Diperlukan input bertingkat (Kota/Kabupaten dan Kecamatan). Menyimpan 7000+ data kecamatan secara statis di frontend akan merusak performa (bundle bloat), sehingga diperlukan integrasi *Free Open API* untuk data wilayah.

## 2. Instruksi Eksekusi (Frontend React/Next.js)
**Target File:** Komponen `BookingForm.tsx` (Form publik Katalog Slug).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan Looping 24 Jam (Time Picker):**
1. Buka fungsi *generator option* waktu untuk *dropdown* "Jam Penjemputan".
2. Ubah *looping* awal (inisialisasi `i`) agar dimulai dari `0` hingga `23` (bukan dari 6).
3. Pastikan format opsi menghasilkan string dari `"00:00"`, `"00:30"`, `"01:00"`, hingga `"23:30"`.

**B. Implementasi Cascading Dropdown Wilayah (API Eksternal Bebas Biaya):**
1. Hapus JSON statis Provinsi dari PRD sebelumnya.
2. Gunakan Endpoint Open API Wilayah Indonesia yang terpercaya (Misalnya: API dari repositori GitHub `emsifa/api-wilayah-indonesia`).
3. Buat 3 *State* bersarang:
   - `selectedProvinsi`
   - `selectedKabupaten`
   - `selectedKecamatan`
4. **Alur UI (Cascading):**
   - **Dropdown 1 (Provinsi):** *Fetch* saat komponen di-*mount*.
   - **Dropdown 2 (Kota/Kabupaten):** *Disabled* jika Provinsi belum dipilih. Jika Provinsi diubah, *fetch* daftar Kabupaten berdasarkan ID Provinsi tersebut.
   - **Dropdown 3 (Kecamatan):** *Disabled* jika Kota/Kabupaten belum dipilih. Jika Kabupaten diubah, *fetch* daftar Kecamatan berdasarkan ID Kabupaten tersebut.

**C. Penggabungan Payload Tujuan Akhir:**
1. Pada fungsi `handleSubmit`, gabungkan seluruh state wilayah dengan state Alamat Detail.
2. Format: `const finalDropoff = "[" + namaProvinsi + " - " + namaKabupaten + " - " + namaKecamatan + "] " + detailAddress;`
3. Kirimkan string agregasi ini ke parameter `dropoffLocation` ke database.

Silakan bangun logika *Cascading Region* dan perbaiki jam operasional ini! Lapor jika dropdown sudah saling terhubung dari level Provinsi hingga Kecamatan tanpa membebani ukuran bundle aplikasi!
# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.49
**Fokus:** Bug Fix CSS Visibilitas Kalender & Penambahan UX Helper Text Pelanggan Rental

## 1. Analisis Masalah
1. **Low Contrast/Visibility Issue:** Pada komponen Kalender Sewa (UI Pemilihan Jadwal), teks untuk Bulan/Tahun (Caption) dan nama Hari (Weekday Headers) berwarna sangat pudar (abu-abu terang/putih) sehingga tidak terbaca pada *background* putih. Ini terjadi karena *class* CSS bawaan ter- *reset* oleh Tailwind.
2. **Missing Customer UX Guide:** Pengguna awam (pelanggan publik) rentan mengalami kebingungan saat berinteraksi dengan Kalender *Range Picker*. Diperlukan teks panduan singkat yang intuitif di atas atau di dalam form kalender khusus untuk halaman pemesanan Rental/Travel.

## 2. Instruksi Eksekusi (Tailwind Overrides & Helper Component)
**Target File:** Komponen `RentalDatePicker.tsx` (atau komponen kalender terkait) dan Halaman Form Booking Publik.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaiki Visibilitas Teks Kalender (Tailwind `classNames`):**
1. Buka komponen yang merender kalender (`react-day-picker`).
2. Pada *props* `classNames`, tambahkan/paksa aturan warna *text* yang gelap menggunakan *utility class* Tailwind.
3. Targetkan secara spesifik:
   - Elemen Judul Bulan (`caption_label` atau sejenisnya): Berikan kelas `text-gray-900 font-bold`.
   - Elemen Header Hari (`head_cell` atau sejenisnya): Berikan kelas `text-gray-700 font-medium`.
   - Elemen Navigasi (Icon Next/Prev bulan): Pastikan *icon* tersebut juga menggunakan teks warna solid (contoh: `text-gray-800`).

**B. Tambahkan Panduan Pemesanan untuk Pelanggan (Consumer Guide):**
1. Buka komponen `BookingForm` yang dilihat oleh pelanggan publik.
2. Tepat di atas *input* kalender atau di dalam *Modal* kalender, tambahkan elemen *Callout* atau *Helper Text* berdesain halus (misal: kotak dengan *background* biru/kuning sangat muda dan ikon info kecil).
3. **Isi Redaksi Panduan:** *"Cara Memilih Jadwal: Klik pada tanggal MULAI sewa, kemudian klik pada tanggal SELESAI sewa. Tanggal yang dicoret berarti armada sudah tidak tersedia."*
4. Pastikan teks ini hanya muncul di form pemesanan pelanggan, bukan di *Dashboard* internal admin.

Silakan suntikkan CSS dan tambahkan panduan UX ini! Lapor kembali jika bulan dan hari di kalender sudah terbaca tajam, serta pelanggan sudah mendapatkan instruksi cara mengeklik tanggal dengan benar!
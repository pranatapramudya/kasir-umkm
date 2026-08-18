# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.45
**Fokus:** Bug Fix - Fitur Unduh Tiket (Canvas Generation) & Data Isolation Naming

## 1. Analisis Masalah
Pada halaman sukses reservasi (Booking Berhasil), fitur "Unduh Tiket/Bukti Reservasi" mengalami *crash*. Tombol *stuck* pada *state* "Menyiapkan Gambar..." dan memunculkan *alert* "Gagal mengunduh tiket".
Akar masalah biasanya terletak pada:
1. Kegagalan *library generator* (seperti `html2canvas`) merender elemen karena isu CORS (gambar eksternal) atau referensi DOM yang belum siap.
2. *Error handling* yang buruk: *State loading* tidak di- *reset* saat proses gagal.
3. **Data Isolation Security:** Nama file unduhan harus mencerminkan identitas tenant dan transaksi yang spesifik agar pelanggan yang memegang file tersebut tidak kebingungan atau mengalami *overwrite* file di perangkat mereka.

## 2. Instruksi Eksekusi (Canvas Fix & Dynamic File Naming)
**Target File:** Komponen Halaman Tiket/Sukses Booking (yang berisi fungsi *download image*).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan Image Generator (html2canvas / sejenisnya):**
1. Buka fungsi yang menangani konversi elemen HTML menjadi gambar.
2. Jika menggunakan `html2canvas`, pastikan Anda menambahkan konfigurasi objek `{ useCORS: true, allowTaint: true }` pada parameternya. Ini krusial jika di dalam tiket terdapat logo toko atau elemen dari URL eksternal.
3. Pastikan elemen DOM yang di- *target* (melalui `ref` atau ID) benar-benar membungkus kartu tiket saja, bukan seluruh halaman.

**B. Perbaikan Error Handling & Loading State:**
1. Gunakan blok `try...catch...finally` pada fungsi unduhan.
2. Jika masuk ke blok `catch`, tampilkan pesan *error*, tetapi **WAJIB** mereset *state* `isDownloading` menjadi `false` di dalam blok `finally`. Hal ini agar tombol kembali ke kondisi semula dan tidak *stuck* di "Menyiapkan Gambar...".

**C. Isolasi Penamaan File (Dynamic Naming):**
1. Ubah logika penamaan file hasil unduhan. Jangan gunakan nama generik statis.
2. Rangkai nama file secara dinamis menggunakan variabel data reservasi tersebut.
   *Contoh Format Wajib:* `Tiket_[Nama_Toko]_[Nama_Pelanggan]_[ID_Transaksi].png`
   *(Misal: Tiket_TOKO_JASA2_Budi_#8510.png)*
3. Hapus spasi pada nama file jika perlu (ganti dengan *underscore*) agar formatnya rapi saat diunduh.

Silakan perbaiki generator gambar ini! Lapor kembali jika pelanggan sudah bisa mengunduh tiketnya, *state* tombol tidak *stuck*, dan nama file yang terunduh sudah terisolasi sesuai nama toko & pelanggan masing-masing!
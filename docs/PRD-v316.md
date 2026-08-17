# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.16
**Fokus:** Bug Fix - State Mapping DateTime & Mobile Responsiveness Tombol Tarik Antrean

## 1. Analisis Masalah
1. **Data State Gagal Me-render ke Input DateTime:** Saat tombol "Proses" pada Modal Tarik Antrean diklik, data Nama Pelanggan dan Layanan berhasil masuk ke keranjang, namun form "Waktu Layanan" tetap kosong. Ini terjadi karena format *Date object* atau *ISO String* dari database tidak di-format (parse) dengan benar menjadi string `YYYY-MM-DDThh:mm` yang diwajibkan oleh `<input type="datetime-local">`.
2. **Mobile Un-clickable / Hidden UI:** Fitur Tarik Antrean Online tidak dapat diakses atau di-klik ketika halaman Kasir Jasa dibuka melalui perangkat *mobile* (layar kecil). Ini diakibatkan oleh *styling* CSS responsif yang salah atau elemen yang tertumpuk (*z-index* / *layouting* keranjang pada versi mobile).

## 2. Instruksi Eksekusi (Frontend State Formatting & Tailwind Responsive Fix)
**Target File:** Komponen Halaman Kasir Jasa (`app/page-client.tsx` atau komponen *Cart/Detail Layanan* Anda).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Format Ulang Value Date untuk State "Waktu Layanan":**
1. Temukan fungsi *handler* yang tereksekusi saat tombol **"Proses"** di dalam Modal Tarik Antrean diklik (contoh: `handleTarikAntrean(booking)`).
2. Ambil nilai tanggal/waktu layanan dari objek `booking` tersebut.
3. Konversi nilai tersebut ke format string `YYYY-MM-DDThh:mm`. (Anda bisa menggunakan *library* date-fns seperti `format(date, "yyyy-MM-dd'T'HH:mm")` atau metode *Vanilla JS* `.toISOString().slice(0, 16)` dengan penyesuaian zona waktu lokal).
4. Masukkan string yang sudah di-format tersebut ke dalam *state* yang mengontrol input "Waktu Layanan".

**B. Perbaiki Aksesibilitas Tombol di Layar Mobile:**
1. Periksa elemen UI pembungkus tombol **"📋 Tarik Antrean Online"** di dalam panel "Detail Layanan".
2. Pastikan tidak ada *class* Tailwind seperti `hidden`, `sm:hidden`, atau `max-md:hidden` yang membuat tombol ini lenyap di layar HP.
3. Jika pada versi mobile keranjang/detail layanan disembunyikan di dalam *Drawer* atau Modal (seperti *Bottom Sheet*), pastikan tombol "Tarik Antrean Online" tetap diposisikan di area yang terlihat (*visible*) dan dapat di-klik (*clickable*) tanpa terhalang elemen lain.
4. Uji interaksi tombol: Pastikan *onClick* event me-memicu Modal secara normal saat diakses via dimensi layar di bawah 768px.

Silakan perbaiki *formatting date string* dan *layout mobile* ini! Lapor jika Waktu Layanan sudah terisi otomatis dan tombol sudah bisa di-klik via HP!
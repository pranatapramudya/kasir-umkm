# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.11
**Fokus:** Interaktivitas Dashboard (Month Picker) & Bugfix CRUD Produk

## 1. Analisis Masalah

### A. Kebutuhan Interaksi Filter (Dashboard)
Saat ini, teks "Bulan Ini" pada Ringkasan Bisnis di `app/admin/page.tsx` bersifat statis. Pengguna membutuhkan komponen kalender (Month Picker) untuk memfilter data metrik berdasarkan bulan tertentu (misal: "Agustus 2026").

### B. Bug: "Gagal menyimpan produk"
Terdapat kegagalan saat *submit* data pada form Modal Tambah Produk. Analisis potensi penyebab:
1. **Sanitasi Data Harga:** *State* yang menyimpan nilai uang mungkin masih mengandung titik (contoh: `"500.000"`) karena proses *auto-formatting* IDR. Saat dikirim ke API, Prisma menolak karena kolom `hpp` dan `hargaJual` bertipe `Int`.
2. **Payload Image Base64:** Ukuran foto *Base64* mungkin melampaui batas *default payload limit* Next.js, atau Prisma menolak string yang terlalu panjang untuk tipe kolom `String` standar jika tidak disesuaikan.

## 2. Solusi Teknis

### A. Implementasi Month Picker (Dashboard)
* Gunakan elemen `<input type="month">` HTML standar atau komponen dari library seperti `lucide-react` yang dipadukan dengan *dropdown* sederhana pada `app/admin/page.tsx`.
* Tautkan *input* tersebut dengan *state* React (misal: `const [selectedMonth, setSelectedMonth] = useState('2026-08')`) agar nantinya metrik analitik bisa bereaksi secara dinamis.

### B. Resolusi Bug Simpan Produk (`app/admin/products/page.tsx`)
* **Sanitasi Payload Uang:** Sebelum mengirim *body* ke `/api/products`, pastikan variabel harga dibersihkan dari semua karakter non-angka.
  Contoh logika: `const sanitizedHpp = parseInt(hppState.replace(/\D/g, ''), 10) || 0;` Terapkan ini untuk `hpp`, `hargaJual`, dan `diskon`.
* **Cek Payload Gambar:** Pastikan ukuran gambar sudah dikompresi di sisi *client* sebelum diubah menjadi *Base64*, atau minimal tangani *error* API di sisi klien agar memberikan pesan yang spesifik (bukan sekadar "Gagal menyimpan produk"), misalnya `console.error(err)` lalu tampilkan *toast* error dari *response object*.
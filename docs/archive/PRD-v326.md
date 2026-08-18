# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.26
**Fokus:** Dropdown Provinsi Tujuan (Free Data) & Penggabungan String Lokasi

## 1. Analisis Masalah
Input "Lokasi Tujuan / Titik Akhir" saat ini murni berupa *free text*. Hal ini membuat data tidak terstandardisasi dan menyulitkan admin untuk memfilter rute pesanan lintas wilayah. Diperlukan penambahan *dropdown* (opsi pilihan) level Provinsi untuk mempertegas area tujuan, tanpa perlu bergantung pada API Maps berbayar (Google Maps) demi menjaga efisiensi biaya operasional (Zero-Cost API).

## 2. Instruksi Eksekusi (Frontend Select UI & Static Data)
**Target File:** Komponen `BookingForm.tsx` (Form publik Katalog Slug).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Sediakan Data Statis Provinsi Indonesia:**
1. Buat sebuah *array of strings* atau JSON statis sederhana di dalam file komponen (atau di folder utils/constants) yang berisi daftar 38 Provinsi di Indonesia secara alfabetis (misal: "Aceh", "Bali", "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Papua", dst).
2. Data statis ini menggantikan kebutuhan API eksternal agar form memuat secara instan tanpa kendala batas *request* (API rate limit).

**B. Render Dropdown UI:**
1. Buka elemen input **"LOKASI TUJUAN / TITIK AKHIR"**.
2. Tepat di atas input teks *free text* tersebut, tambahkan elemen `<select>` baru.
3. Label: **"PROVINSI TUJUAN *"** (Wajib).
4. Buat opsi *default* (disabled) dengan teks: *"Pilih Provinsi Tujuan"*.
5. *Map* data array provinsi di atas menjadi opsi-opsi `<option>` di dalam dropdown ini.
6. Simpan pilihan pelanggan ke dalam sebuah *state*, misalnya `selectedProvince`.

**C. Ubah Label Input Detail & Gabungkan Payload:**
1. Ubah label input teks asli yang berada di bawahnya menjadi: **"ALAMAT DETAIL TUJUAN (opsional)"**.
2. Saat fungsi `handleSubmit` dijalankan (sebelum Payload dikirim ke API), gabungkan nilai dari Dropdown Provinsi dan Input Teks Detail.
3. Contoh pembentukan string: `const finalDropoff = "[" + selectedProvince + "] " + detailAddress;` (Hasil: "[Bali] Hotel Aston Denpasar").
4. Kirimkan `finalDropoff` ini ke parameter `dropoffLocation` di *database*. (Ini mencegah perlunya migrasi skema database baru).

Silakan integrasikan fitur agregasi wilayah ini! Lapor jika pelanggan sudah wajib memilih provinsi sebelum mengisi detail tujuannya!
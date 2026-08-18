# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.90
**Fokus:** Minor UI Bug Fixes (Mobile Responsiveness & Broken Image Link)

## 1. Analisis Masalah
Terdapat 3 *bug* visual minor pada tampilan seluler (*mobile*):
1. **Rekap Komisi:** Tombol unduh laporan terpotong (keluar layar) karena kontainer memaksakan *layout baris* (flex-row) pada layar sempit.
2. **Modal Syarat & Ketentuan:** Tombol tutup (X) pada pojok kanan atas terpotong batas layar seluler.
3. **PWA Install Prompt:** Gambar logo rusak (*broken image link*), padahal aset sudah ada di URL *root* Vercel.

**PERINGATAN KERAS:** JANGAN mengubah logika komponen secara keseluruhan. Lakukan injeksi CSS/path sekecil dan sepresisi mungkin hanya pada elemen yang bermasalah!

## 2. Instruksi Eksekusi (Tailwind CSS & Next.js Image)
**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Fix Layout Rekap Komisi:**
1. Buka halaman/komponen Rekap Komisi.
2. Cari pembungkus (*wrapper/container*) yang menggabungkan *Date Picker* dan Tombol Unduh.
3. Ubah *class* flexbox-nya agar membungkus ke bawah pada layar kecil. Gunakan kombinasi seperti: `flex flex-col sm:flex-row gap-2 w-full`.
4. Pastikan tombol unduh mengambil lebar penuh (`w-full`) pada versi seluler agar rapi ditekan.

**B. Fix Tombol Close Modal T&C:**
1. Buka komponen Modal "Syarat & Ketentuan Layanan".
2. Jangan gunakan `absolute -right-4` yang bisa menyebabkan elemen terpotong. 
3. Sebaiknya ubah area Header Modal menggunakan `flex justify-between items-start` agar teks judul dan tombol (X) memiliki ruang masing-masing.
4. Atau, jika tetap menggunakan `absolute`, pastikan nilai *right* dan *top* masuk akal (misal: `right-4 top-4`) dan pastikan kontainer utama modal tidak melebihi lebar layar (gunakan `max-w-[90vw]`).

**C. Fix Broken Image di PWA Install Prompt:**
1. Buka komponen `PwaInstallPrompt` (pop-up instalasi yang baru dibuat).
2. Perbaiki atribut `src` pada tag `<img />` (atau komponen Next.js `<Image />`).
3. Gunakan *absolute path* yang merujuk ke direktori public dengan menambahkan *slash* di depan. Contoh: `src="/icon-192x192.png"` atau `src="/icon-512x512.png"`. (Jangan hanya `src="icon.png"`).

Silakan lakukan "bedah minor" ini dan *push* segera ke Vercel! Lapor jika ketiga elemen ini sudah presisi.
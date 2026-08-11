# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.7
**Fokus:** Penambahan Brand Identity (PJTECH KASIR UMKM) pada Mobile View

## 1. Analisis Masalah (Brand Visibility)
Setelah menerapkan *Mobile Minimalism* di Fase 0.0.6, seluruh elemen teks di luar kartu disembunyikan pada layar *mobile*. Hal ini menyebabkan hilangnya identitas *brand* utama di layar pengguna ponsel. Aplikasi terlihat terlalu generik karena tidak ada keterangan nama produk sama sekali.

## 2. Solusi Teknis (In-Card Branding)
Kita perlu memasukkan *branding* "PJTECH KASIR UMKM" secara elegan ke dalam komponen yang tetap terlihat di *mobile*, yaitu Kartu Autentikasi (Glassmorphism Card).

### A. Penyesuaian UI di Dalam Kartu Login
Buka kembali file `app/page.tsx` pada bagian yang me-render kartu login (`bg-white/70 backdrop-blur-lg...`), lalu lakukan perubahan berikut:
1. **Modifikasi Header Kartu:** 
   * Tepat di bawah ikon toko (berwarna biru) dan di atas teks "Selamat Datang", tambahkan sebuah elemen *badge* atau teks *branding*.
   * Contoh implementasi teks: Tambahkan `<h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-1">PJTECH KASIR UMKM</h2>`.
2. **Penyesuaian Teks Sambutan (Alternatif):**
   * Jika tidak menggunakan *badge*, ubah teks `<h1>` yang sebelumnya hanya berbunyi "Selamat Datang" menjadi "Selamat Datang di PJTECH KASIR UMKM".
   * Pastikan menggunakan ukuran *font* yang responsif (misalnya `text-xl lg:text-2xl font-bold text-slate-900`) agar teks tidak *wrapping* (patah) terlalu berantakan di layar HP yang kecil.

### B. Ekspektasi Hasil Akhir
Saat dibuka di *mobile*, pengguna akan melihat ikon toko biru, diikuti teks "PJTECH KASIR UMKM" yang tegas, lalu sub-teks instruksi, dan tombol "Mulai Sekarang". *Branding* tetap kuat tanpa mengorbankan desain yang minimalis dan *to-the-point*.
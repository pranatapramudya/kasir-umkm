# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.6
**Fokus:** Minimalisme UI Mobile (Menghilangkan Clutter Deskripsi)

## 1. Analisis Masalah (UX Review)
Pada tampilan perangkat *mobile*, meskipun urutan *card* otentikasi sudah berada di atas, teks deskripsi pemasaran dan *bullet points* di bawahnya membuat halaman terasa penuh (*cluttered*). Pengguna *mobile* menyukai desain yang bersih dan langsung pada tujuannya (*to the point*), yaitu melakukan login atau registrasi.

## 2. Solusi Teknis (Tailwind Display Utilities)
Kita akan menerapkan prinsip *Mobile Minimalism*. Elemen pemasaran (Hero Text, paragraf, dan *bullet points*) akan disembunyikan sepenuhnya di layar *mobile*. Layar *mobile* hanya akan berfokus 100% pada Kartu Autentikasi (Glassmorphism Card).

### A. Menyembunyikan Kolom Teks (Mobile Hidden)
* Identifikasi `<div>` utama yang membungkus area teks (Judul besar "Kelola Usaha Lebih Cerdas...", paragraf penjelasan, dan daftar *checklist*).
* Tambahkan *utility class* `hidden lg:block` (atau `hidden lg:flex`, sesuaikan dengan *display* bawaannya) pada `<div>` tersebut. 
* Hasilnya: Elemen pemasaran ini akan lenyap di layar perangkat kecil (di bawah ukuran `lg`), namun tetap tampil proporsional di layar Desktop/Laptop.

### B. Penyesuaian Layout Container Mobile (Centering)
* Karena kolom teks disembunyikan di *mobile*, pastikan Kartu Autentikasi berada tepat di tengah layar secara vertikal dan horizontal.
* Pastikan *wrapper* utama (pembungkus paling luar) menggunakan kombinasi *class* seperti `flex items-center justify-center min-h-screen` atau penyesuaian pada *grid* agar kartu *login* menjadi satu-satunya fokus (*centerpiece*) di layar *mobile*.
Dokumen: PRD-v045.md
Status: In Progress
Fokus: UI/UX Mobile View, Header Clean-up, Bottom Navigation Bar.

1. Latar Belakang & Masalah
Berdasarkan tinjauan interface saat ini (image_5583d4.png dan image_558357.png), terdapat penempatan tombol aksi utama (Call to Action) yang kurang ergonomis pada tampilan mobile:

Pada halaman Sistem Manajemen, tombol "Lihat Kasir" berada di header, memaksa user meregangkan jari ke area atas layar.

Pada halaman Kasir POS, tombol "Lihat Analitik" berada di header, membuat area atas terlihat sesak dan tidak rapi.

Belum ada hierarki visual yang menegaskan bahwa fitur "Kasir" adalah fitur terpenting dari aplikasi ini.

2. Solusi yang Diusulkan (Opsi A)
Membersihkan area header secara global dari tombol navigasi lintas-modul dan memusatkan seluruh perpindahan halaman melalui Bottom Navigation Bar dengan fitur Kasir sebagai Floating Action Button (FAB) di posisi tengah.

3. Spesifikasi Kebutuhan (Requirements)
3.1. Pembersihan Header (Global)
Halaman Dashboard/Manajemen: Hapus komponen <button>Lihat Kasir</button> (warna biru) dari header. Header hanya boleh menampilkan teks "Sistem Manajemen" dan Avatar Profil User.

Halaman POS/Kasir: Hapus komponen <button>Lihat Analitik</button> (warna kuning) dari header. Header hanya boleh menampilkan teks "PJTECH KASIR POS" dan Avatar Profil User.

3.2. Implementasi Bottom Navigation Bar Baru
Buat atau refactor komponen BottomNav yang sudah ada agar memiliki struktur 5-kolom dengan susunan (kiri ke kanan) sebagai berikut:

Dashboard (Ikon: Grid/Home)

Produk (Ikon: Box/Package)

[ KASIR ] (Berupa FAB - Floating Action Button)

Analitik (Ikon: Chart/Graph)

Pengaturan (Ikon: Gear/Settings)

3.3. Spesifikasi UI/UX Floating Action Button (FAB) "Kasir"
Posisi: Absolut di tengah Bottom Navigation Bar.

Elevasi: Dibuat sedikit menonjol ke atas (melewati batas atas bar navigasi) untuk memecah garis horizontal.

Styling (Pendekatan CSS/Tailwind):

Warna Background: Menggunakan warna biru utama aplikasi (bg-blue-600 atau setara dengan tombol Kasir lama).

Bentuk: Lingkaran penuh (rounded-full).

Ikon: Ikon toko/kasir berwarna putih agar kontras.

Bayangan (Shadow): Wajib menggunakan efek bayangan yang tegas (drop-shadow-lg atau shadow-blue-500/50) agar tombol terlihat "mengambang" dan clickable.

4. Acceptance Criteria (Kriteria Selesai)
[ ] Header di halaman Manajemen sudah bersih dari tombol "Lihat Kasir".

[ ] Header di halaman Kasir POS sudah bersih dari tombol "Lihat Analitik".

[ ] Bottom Navigation menampilkan 5 menu dengan urutan yang benar (Dashboard, Produk, Kasir, Analitik, Pengaturan).

[ ] Tombol Kasir di Bottom Navigation menonjol secara visual (berbentuk FAB bundar dengan background biru dan shadow).

[ ] Navigasi antar halaman berjalan lancar saat menu-menu di Bottom Navigation (termasuk tombol tengah) diklik.

[ ] State aktif (warna highlight) pada ikon menu bekerja dengan benar sesuai halaman yang sedang dibuka.
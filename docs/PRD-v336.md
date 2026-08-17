# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.36 (Revisi)
**Fokus:** Reposisi Navigasi Bantuan & Integrasi SOP Link Booking di Buku Panduan

## 1. Analisis Masalah
1. **Hidden Onboarding (Bantuan):** Tombol "Bantuan & Panduan" diletakkan di bagian paling bawah *Sidebar* (Desktop & Mobile). Hal ini menyebabkan *blind spot* bagi pengguna baru yang membutuhkan panduan alur kerja (*SOP*) saat pertama kali login.
2. **Missing Context pada SOP Booking:** Untuk model bisnis **Rental/Travel** dan **Jasa**, nyawa bisnis mereka adalah membagikan URL Katalog/Booking (Slug) ke pelanggan. Konten SOP di dalam Buku Panduan belum mengarahkan pengguna bahwa *link* tersebut bisa diambil di menu "Informasi Toko". Selain itu, UI untuk menyalin *link* tersebut memang harus dipastikan tersedia di halaman Informasi Toko.

## 2. Instruksi Eksekusi (Frontend Layouting & Modal Copywriting)
**Target File:** Komponen `SidebarClient.tsx` (dan navigasi Mobile), Komponen `BukuPanduanModal.tsx`, dan Halaman `Informasi Toko`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Reposisi Tombol Bantuan & Panduan (Desktop & Mobile):**
1. Buka komponen *Sidebar* dan Navigasi *Mobile*.
2. Cabut tombol "Bantuan & Panduan" dari posisi paling bawah (footer sidebar).
3. Pindahkan posisinya ke **Bagian Paling Atas**, tepat di bawah Logo Aplikasi dan di atas label "MENU UTAMA".
4. **Styling (Rapih & Menonjol):** Jangan gunakan *styling* menu standar. Buat desainnya sedikit berbeda (misalnya bentuk *badge* atau *card* kecil dengan *background* aksen yang lembut) agar terlihat jelas sebagai "Pusat Bantuan" tanpa merusak hierarki menu utama.

**B. Perbarui Konten SOP di Buku Panduan (Modal):**
1. Buka `BukuPanduanModal.tsx`.
2. Pada *conditional rendering* khusus bisnis **RENTAL** dan **JASA**, tambahkan satu instruksi langkah (Step) yang sangat jelas mengenai Link Booking.
3. Contoh redaksi untuk Jasa & Rental: *"Bagikan Link Katalog: Buka menu **Informasi Toko**, salin Link Booking Publik Anda, dan bagikan ke WhatsApp atau bio Instagram pelanggan agar mereka bisa melakukan reservasi mandiri."*

**C. Pastikan Fitur Salin Link Tersedia di Informasi Toko:**
1. Buka halaman pengaturan **Informasi Toko**.
2. Jika belum ada, buat *section* khusus (hanya muncul jika bisnis = Rental/Jasa) yang menampilkan URL *Slug* publik milik tenant tersebut.
3. Sediakan tombol **"Salin Link"** di sebelahnya menggunakan fungsi *clipboard* bawaan browser agar panduan di poin B dapat dipraktikkan langsung oleh pengguna.

Silakan timpa dan eksekusi perbaikan alur *onboarding* ini! Lapor kembali jika tombol bantuan sudah rapi di atas dan SOP di dalamnya sudah mengarahkan pengguna ke menu Informasi Toko!
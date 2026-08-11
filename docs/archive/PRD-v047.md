# PRD-v046: Relokasi Fitur "Upgrade Pro" & Implementasi Paywall Analitik (Freemium Model)

## 1. Konteks & Tujuan (Instruksi untuk AI Agent)
Sebagai Senior Full-Stack Developer (Next.js, TypeScript, Tailwind CSS), tugas kamu adalah mengeksekusi PRD ini. 
Sebelumnya, tombol "Upgrade Pro" dan "Lihat Analitik" berada di Header, yang menyebabkan UI berantakan. Header sekarang sudah dibersihkan (PRD-v045). Tujuan dari tugas ini adalah membangun ulang jalur konversi monetisasi (Upgrade Pro) dengan menempatkannya di area yang lebih strategis menggunakan teknik "Paywall" tanpa merusak desain yang sudah bersih.

## 2. Kebutuhan Fitur Utama (Requirements)

### 2.1. Implementasi Paywall pada Halaman Analitik
Halaman Analitik sekarang akan menjadi "Gerbang Monetisasi".
- **Kondisi (State):** Buat sebuah *mock state* atau baca dari *user session* (misal: `isProUser = false`).
- **Jika `isProUser === true`:** Tampilkan halaman grafik analitik dan laporan penjualan secara normal.
- **Jika `isProUser === false`:**
  - Tampilkan halaman analitik dengan efek *blur* di latar belakang (`backdrop-blur-sm` atau *image placeholder* grafik yang diblur).
  - Di tengah layar, tampilkan sebuah Card/Modal *Call-to-Action* (CTA).
  - **Konten Card CTA:**
    - Ikon Mahkota Emas (👑).
    - Judul: "Buka Potensi Penuh Bisnis Anda!" (Gunakan teks tebal/bold).
    - Deskripsi: "Upgrade ke Paket Pro untuk melihat produk terlaris, laporan laba rugi detail, dan tren penjualan."
    - Tombol Utama: `<button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold ...">Upgrade Pro Sekarang 👑</button>`.
    - Tombol Sekunder: "Kembali ke Dashboard" (teks biasa).

### 2.2. Penambahan Banner "Upgrade" di Menu Profil
Tambahkan akses sekunder untuk *Upgrade Pro* di dalam menu Dropdown/BottomSheet Avatar Profil.
- Ketika *user* mengklik avatar profil di sudut kanan atas Header:
  - Tampilkan menu *dropdown*.
  - **Item Pertama di Dropdown:** Sebuah *banner* kecil atau *card* dengan *background* kuning pastel/emas yang berisi teks "Status: Paket Basic" dan tombol "Upgrade ke Pro 👑".
  - **Item Selanjutnya:** Menu standar seperti "Pengaturan Akun", "Bantuan", dan "Keluar (Logout)".

## 3. Spesifikasi Teknis & UI/UX (Tailwind CSS)
- Gunakan skema warna yang memberikan kesan premium untuk tombol Pro (kombinasi warna emas/kuning, misalnya `text-yellow-500` atau `bg-yellow-500`).
- Pastikan Card CTA di halaman Analitik bersifat responsif (*mobile-first*) dan berada tepat di tengah layar menggunakan Flexbox atau CSS Grid (`flex items-center justify-center`).
- Gunakan ikon dari pustaka yang sudah ada di *project* (misalnya Lucide React atau Heroicons) untuk Ikon Mahkota/Crown.

## 4. Acceptance Criteria
- [ ] User dengan status non-Pro tidak bisa melihat data asli di halaman Analitik.
- [ ] Efek *blur* dan Card CTA Paywall muncul dengan rapi di tengah halaman Analitik untuk user gratis.
- [ ] Menu *dropdown* pada Avatar Profil berhasil dirender dan menampilkan opsi "Upgrade Pro" di urutan teratas.
- [ ] Seluruh desain responsif dan mengikuti standar estetika UI/UX *mobile* yang bersih.

## Tindakan yang Diharapkan dari AI:
Silakan *generate* kode untuk halaman `Analytics.tsx` (termasuk logika *paywall*) dan modifikasi komponen `Header.tsx` (untuk penambahan *dropdown* profil) menggunakan Next.js dan Tailwind CSS berdasarkan spesifikasi di atas.
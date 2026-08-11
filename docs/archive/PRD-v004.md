# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.4
**Fokus:** Redesain UI/UX Landing Page & Autentikasi (Premium SaaS Standard)

## 1. Tujuan (Objective)
Meningkatkan kualitas antarmuka halaman awal (Landing Page / Kondisi belum login) dari yang sebelumnya berupa kartu statis biasa menjadi desain *Premium SaaS* yang responsif (Mobile & Desktop). Desain harus menanamkan kepercayaan (*trust*) kepada calon *tenant* (pemilik usaha) sejak detik pertama.

## 2. Spesifikasi Desain (UI/UX)

### A. Tema Visual & Background
* Tinggalkan latar belakang abu-abu polos. Gunakan *background* dengan pola modern, seperti gradasi halus (*subtle gradient*) perpaduan warna biru/indigo khas teknologi, atau pola grid (titik-titik/garis halus) yang mencerminkan sistem kasir digital yang presisi.

### B. Layout Desktop (Lebar layar `lg` ke atas)
* Gunakan gaya **Split-Screen Layout** (2 Kolom):
  - **Sisi Kiri (Value Proposition):** Menampilkan tipografi tebal (Hero Text) yang menarik, misalnya: "Kelola Usaha Lebih Cerdas dengan PJTECH." Berikan *bullet points* keunggulan sistem (contoh: Multi-tenant, Laporan Real-time, Manajemen Stok).
  - **Sisi Kanan (Action Area):** Menampilkan kartu otentikasi (Card) yang menggunakan efek **Glassmorphism** (latar belakang putih semi-transparan dengan efek *blur* dan *border* halus). Di dalam kartu ini terdapat logo, pesan sambutan, dan tombol Clerk `<SignInButton>`.

### C. Layout Mobile (Lebar layar di bawah `lg`)
* Tata letak diubah menjadi **Stacked (Vertikal)**. 
* Elemen teks (Hero Text) tetap berada di atas, namun ukurannya disesuaikan (*scaled down*) agar rapi.
* Kartu otentikasi berada di bawahnya, memanfaatkan lebar layar (*full width* dengan *padding* atau *margin* yang proporsional).

### D. Interaksi Tombol (Call to Action)
* Tombol `<SignInButton>` harus di-*styling* agar tidak terlihat standar. Gunakan warna *primary blue*, efek *hover* yang lembut (mengubah warna atau memberikan bayangan/glow), dan sudut yang membulat (*rounded-xl* atau *rounded-full*).
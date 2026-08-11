# PRD-v049: Perbaikan UI Bottom Navigation & Penambahan CTA Pro di Sidebar Desktop

## 1. Konteks & Tujuan (Instruksi untuk AI Agent)
Sebagai Senior Full-Stack Developer, tugas kamu adalah melakukan *finishing* pada navigasi *hybrid* yang sudah dibuat sebelumnya. 
Ada dua perbaikan minor namun krusial secara UX:
1. Memperbaiki *Floating Action Button* (FAB) di tampilan *mobile* agar memiliki label teks yang jelas.
2. Memasukkan kembali elemen monetisasi (tombol "Upgrade Pro") khusus untuk tampilan Desktop dengan memanfaatkan area kosong di *Left Sidebar*.

## 2. Kebutuhan Fitur & Spesifikasi UI/UX (Tailwind CSS)

### 2.1. Perbaikan Mobile View (Bottom Navigation)
- **Target Komponen:** `BottomNav` (terlihat pada layar `< md`).
- **Masalah Saat Ini:** Tombol tengah (FAB) hanya menampilkan ikon *Home* di dalam lingkaran biru, tanpa ada teks di bawahnya, sehingga tidak konsisten dengan menu lainnya.
- **Solusi/Tugas:**
  - Ganti ikon *Home* di tombol tengah menjadi ikon Toko/Keranjang Belanja (*Storefront/ShoppingCart*) yang lebih merepresentasikan "Kasir".
  - Tambahkan elemen teks `<span>Kasir</span>` persis di bawah lingkaran biru FAB tersebut.
  - Atur *positioning* menggunakan Flexbox (`flex-col items-center`) agar teks "Kasir" sejajar dengan teks menu lainnya (Dashboard, Produk, Analitik, Pengaturan), dengan ukuran *font* yang sama kecilnya (`text-xs`).
  - Pastikan lingkaran biru FAB tetap menonjol ke atas (menggunakan `-mt-6` atau translasi negatif) tetapi teks "Kasir"-nya tetap berada di dalam *bar* putih.

### 2.2. Penambahan CTA "Upgrade Pro" di Desktop View (Left Sidebar)
- **Target Komponen:** `Sidebar` (terlihat pada layar `>= md`).
- **Masalah Saat Ini:** Tidak ada akses cepat untuk *Upgrade Pro* di layar desktop setelah *header* dibersihkan.
- **Solusi/Tugas:**
  - Di dalam *container Left Sidebar*, buat struktur *layout* menggunakan `flex-col` dan `justify-between` agar daftar menu navigasi berada di atas, dan area bawah *sidebar* terdorong ke paling bawah.
  - Di area paling bawah *sidebar* (di bawah menu "Pengaturan"), tambahkan sebuah *Card/Banner* kecil.
  - **Spesifikasi Desain Card Pro (Tailwind):**
    - *Background*: Gradasi halus (misal `bg-gradient-to-tr from-yellow-50 to-yellow-100`) dengan *border* kuning tipis.
    - Beri *padding* yang cukup (`p-4`) dan ujung membulat (`rounded-xl`).
    - *Konten*: Tambahkan ikon Mahkota (👑), teks judul tebal "Paket Basic", teks deskripsi kecil "Upgrade ke Pro untuk analitik lengkap.", dan tombol "Upgrade Sekarang" (`bg-yellow-500 text-white w-full`).

## 3. Acceptance Criteria
- [ ] Di tampilan *mobile*, tombol tengah navigasi bawah sudah memiliki label teks "Kasir" di bawah lingkaran birunya.
- [ ] Di tampilan *mobile*, ikon tombol tengah menggunakan ikon yang relevan dengan Kasir (bukan lagi ikon Home).
- [ ] Di tampilan *desktop*, terdapat *Card banner* "Upgrade Pro" yang menempel rapi di bagian paling bawah *Left Sidebar*.
- [ ] Penambahan *Card* Pro di *sidebar* tidak merusak *layout* atau membuat daftar menu terpotong.

## 4. Tindakan yang Diharapkan dari AI:
Silakan eksekusi modifikasi pada komponen `BottomNav` (atau sejenisnya) dan `Sidebar`. Fokus pada penggunaan *utility classes* Tailwind CSS untuk menyesuaikan *margin*, *padding*, dan *flexbox* agar hasilnya *pixel-perfect*.
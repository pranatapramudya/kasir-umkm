# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.19
**Fokus:** Perbaikan UI/UX Header Super Admin di Mobile & Penghapusan Redudansi

## 1. Objektif
Membersihkan *header* pada halaman Super Admin dari elemen yang berulang (tombol Logout) dan memperbaiki tata letak (tipografi & *spacing*) agar judul "Command Center" terlihat rapi dan tidak tumpang tindih saat diakses melalui perangkat *mobile* (layar kecil).

## 2. Penghapusan Tombol Logout Redundan
**Target File:** Komponen *header* atau *layout* untuk Super Admin (misal: `app/super-admin/layout.tsx`, `app/admin/super/layout.tsx`, atau komponen `SuperAdminHeader.tsx`).
**Instruksi:**
1. Cari elemen tombol atau teks **"Logout"** (beserta ikon *door-arrow* jika ada) yang berdekatan dengan komponen `<UserButton />` dari Clerk.
2. **Hapus elemen tombol Logout tersebut sepenuhnya.**
3. Pastikan komponen `<UserButton />` milik Clerk tetap ada di posisinya (biasanya di sisi paling kanan).

## 3. Perbaikan Tata Letak (Responsivitas Tailwind)
**Target File:** File yang sama dengan poin 2.
**Instruksi:**
1. **Gunakan Flexbox yang Tepat:** Pastikan kontainer utama *header* menggunakan class Tailwind `flex items-center justify-between w-full` agar area logo/judul di kiri dan area *profile* di kanan saling mendorong ke ujung.
2. **Penyesuaian Tipografi (Responsive Text):** 
   - Ubah ukuran font judul "PJTECH SUPER ADMIN Command Center" agar dinamis. 
   - Contoh implementasi: Gunakan `text-base` atau `text-lg` untuk *mobile*, dan `md:text-2xl` untuk *desktop*.
   - Ubah `leading` (jarak antar baris) menjadi `leading-tight` atau `leading-snug` agar teks yang turun ke bawah (multibaris) di *mobile* tidak terlihat terlalu renggang.
3. **Penyederhanaan Teks di Mobile (Opsional/Direkomendasikan):** 
   - Jika teks masih terlalu panjang untuk layar *mobile* terkecil (misal iPhone SE), sembunyikan sebagian teks pembantu. 
   - Contoh: Teks "Command Center" dibungkus dengan `span` berkelas `hidden sm:inline`. Sehingga di HP hanya terbaca "PJTECH SUPER ADMIN", namun di layar tablet/PC tetap terbaca penuh.

Silakan eksekusi perbaikan UI menggunakan Tailwind CSS ini agar tampilan dashboard Super Admin kembali rapi!
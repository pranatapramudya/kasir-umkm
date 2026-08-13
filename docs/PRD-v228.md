# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.28
**Fokus:** Refaktor UI Halaman Login (Dual Role Entry)

## 1. Objektif
Mengubah antarmuka halaman selamat datang / landing page agar lebih intuitif bagi dua jenis pengguna utama: Business Owner dan Karyawan (Kasir). Mengganti tombol tunggal menjadi dua tombol dengan hierarki visual yang jelas.

## 2. Refaktor Komponen Landing Page
**Target File:** Komponen landing page utama (kemungkinan di `app/page.tsx` atau file layout auth seperti yang terlihat pada gambar UI "Selamat Datang").
**Instruksi Eksekusi:**
1. Temukan tombol utama yang saat ini bertuliskan "Mulai Sekarang".
2. Ubah teks tombol tersebut menjadi: "Masuk (Owner)". Tetap pertahankan desain tombol utama (Primary Button dengan warna solid biru/ungu).
3. Tambahkan satu tombol baru tepat di bawah tombol "Masuk (Owner)". 
4. Desain tombol kedua ini sebagai *Secondary Button* (contoh: style outline, border transparan, atau warna teks saja agar tidak menyaingi tombol utama). 
5. Beri teks tombol kedua: "Login sebagai Karyawan".
6. Fungsionalitas: Kedua tombol ini secara fungsional BISA diarahkan ke halaman/komponen autentikasi Clerk yang sama (misal: mengarah ke `/sign-in` atau membungkusnya dengan `<SignInButton>`). Pemisahan ini bertujuan murni untuk psikologi UX, karena logika routing sesungguhnya (Owner vs Employee) sudah ditangani oleh Middleware paska-login.
7. Sesuaikan margin dan padding antar tombol agar terlihat proporsional dan profesional di layar mobile maupun desktop.

Silakan update komponen UI tersebut sekarang juga.
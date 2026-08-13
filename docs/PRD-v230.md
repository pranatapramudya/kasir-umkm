# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.30
**Fokus:** Optimasi UX Writing (Microcopy) Landing Page

## 1. Objektif
Menghindari kebingungan pengguna (terutama karyawan) saat berada di halaman Login/Landing Page. Mempertegas alur bahwa hanya Pemilik Bisnis (Owner) yang boleh mendaftar, sedangkan Karyawan hanya boleh login menggunakan kredensial yang diberikan oleh Owner.

## 2. Refaktor Teks & Komponen (UI/UX)
**Target File:** Komponen landing page utama (kemungkinan di `app/page.tsx` atau file layout auth).
**Instruksi Eksekusi:**

1. **Pertegas Link Registrasi (Owner Only):**
   - Cari baris teks: `Belum punya akun? Daftar di sini`
   - Ubah teks tersebut menjadi lebih spesifik: `Pemilik Bisnis Baru? Daftar Toko di sini` (Buat kata "Daftar Toko di sini" menjadi link/teks interaktif seperti sebelumnya).

2. **Tambahkan Petunjuk (Helper Text) untuk Karyawan:**
   - Tepat di bawah tombol "Login sebagai Karyawan" (atau di dalam tombol jika menggunakan sub-label), tambahkan teks bantuan berukuran kecil (text-xs atau text-sm) dengan warna abu-abu (text-gray-500).
   - Isi teks bantuan: `*Gunakan email & password yang diberikan oleh atasan Anda.`
   - Pastikan margin dan *spacing* tetap terlihat rapi dan tidak terlalu padat.

Silakan update teks pada antarmuka tersebut sekarang juga agar pengguna langsung paham alur penggunaan aplikasi tanpa perlu panduan tambahan.
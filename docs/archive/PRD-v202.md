# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.02
**Fokus:** Penambahan UI Panduan (Info Box) di Halaman Manajemen Karyawan

## 1. Objektif
Menambahkan komponen Panduan Penggunaan yang mudah dimengerti oleh pengguna awam (Owner UMKM) di halaman **Manajemen Karyawan**. Panduan ini harus menjelaskan tata cara pembuatan akun kasir menggunakan dua metode email (Email Karyawan vs Email Alias Owner) dan cara kasir melakukan login. Panduan ini berlaku global untuk semua kategori bisnis (F&B, Retail, Jasa).

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Penambahan Komponen Info Box (UI)
1. Buka halaman utama Manajemen Karyawan (contoh: `app/admin/employees/page.tsx` atau sejenisnya).
2. Tepat di bawah *header* "Manajemen Karyawan" dan di atas kartu "Daftar Karyawan (Kasir)", tambahkan sebuah kotak informasi (*Alert* atau *Card* dengan warna latar biru muda/abu-abu terang dan ikon lampu/info `💡`).

### B. Injeksi Copywriting Panduan (Bahasa Awam)
Masukkan teks berikut ke dalam kotak informasi tersebut. Gunakan format *bullet points* agar rapi dan mudah di- *scan* oleh mata:

**Judul:** 💡 Panduan Membuat Akun Kasir
**Isi Teks:**
Untuk menambahkan kasir baru, silakan klik tombol **+ Tambah Kasir**. Anda memiliki dua pilihan untuk pendaftaran email:
*   **Gunakan Email Karyawan:** Masukkan email asli karyawan Anda. Jika sistem meminta kode OTP, kode tersebut akan masuk ke email mereka.
*   **Gunakan Email Anda (Trik +Kasir):** Jika karyawan tidak memiliki email, Anda bisa menggunakan email utama Anda dengan menambahkan tanda `+kasir1`. 
    *(Contoh: Jika email Anda `budi@gmail.com`, ketikkan `budi+kasir1@gmail.com`). Semua kode OTP dan notifikasi akan tetap masuk ke email utama Anda.*
*   **Cara Login:** Setelah akun dibuat, arahkan karyawan Anda untuk *Login* di halaman depan website menggunakan email yang didaftarkan beserta Password Sementara yang Anda buat di bawah ini. Karyawan dapat mengubah passwordnya nanti.

### C. Konsistensi Antarkategori
Pastikan komponen ini diletakkan pada *layout* atau komponen klien yang di- *share* (dibagikan) ke seluruh tipe *tenant* (Retail, F&B, Jasa), karena logika pembuatan akun Clerk dan aturan email alias ini berlaku universal.

## 3. Output yang Diharapkan
Terapkan kotak panduan ini di antarmuka Manajemen Karyawan. Berikan konfirmasi singkat bahwa panduan sudah tayang dan teksnya sesuai dengan instruksi di atas tanpa merusak fungsi tabel atau modal *Tambah Kasir*.
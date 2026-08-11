# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.13
**Fokus:** Logika Free Trial 14 Hari (Paywall) & Bugfix Sanitasi Data Payload CRUD

## 1. Analisis Masalah
* **Cacat Logika Paywall (UX Blocker):** Pemblokiran akses menuju `/admin` bagi pengguna gratisan (Non-Pro) mengakibatkan pengguna baru tidak bisa melakukan *setup* toko (menambahkan produk). Diperlukan sistem "Free Trial 14 Hari" agar pengguna bisa mencoba seluruh fitur secara gratis sebelum paywall aktif.
* **Bug "Gagal menyimpan produk" (Data Type Error):** Terdapat kemungkinan besar *payload* JSON yang dikirimkan ke `/api/products` masih dalam format *string* yang salah (misalnya masih mengandung titik pemisah ribuan) atau bernilai `NaN`, sehingga ditolak oleh skema Prisma yang mewajibkan tipe `Int`.

## 2. Solusi Teknis & Instruksi Implementasi

### A. Implementasi Logika Free Trial 14 Hari
* Gunakan properti `createdAt` bawaan dari *object* user Clerk untuk menghitung usia akun.
* **Formula Logika:**
  - Ambil waktu saat ini: `const now = new Date();`
  - Ambil waktu pembuatan akun: `const accountCreated = new Date(user.createdAt);`
  - Hitung batas akhir trial: `const trialEndDate = new Date(accountCreated.getTime() + 14 * 24 * 60 * 60 * 1000);`
  - Status Trial: `const isTrialActive = now < trialEndDate;`
* **Penerapan Akses:** 
  Gabungkan logika ini dengan status Pro. Pengguna diizinkan mengakses Analitik dan halaman Admin JIKA `isTrialActive === true` ATAU `user.publicMetadata.plan === 'pro'`. Jika keduanya *false*, barulah munculkan *Modal Paywall* untuk berlangganan. Terapkan logika ini di tombol Storefront dan di *layout/page* Admin jika perlu.

### B. Bugfix Sanitasi Data Form (Payload Cleansing)
* Buka fungsi `handleSubmit` di `app/admin/products/page.tsx`.
* Pastikan variabel nilai uang (HPP, Harga Jual, Diskon, Stok) benar-benar dikonversi menjadi *Integer* murni sebelum dimasukkan ke `JSON.stringify()`.
* **Contoh Sanitasi Wajib:** 
  `const parsedHargaJual = parseInt(hargaJual.toString().replace(/[^0-9]/g, ''), 10) || 0;`
  Gunakan logika `replace` di atas untuk membuang semua karakter selain angka (seperti titik atau spasi) agar Prisma tidak menolak *payload* tersebut.
* **Error Handling:** Modifikasi bagian `throw new Error(...)` agar mencetak *response error* asli dari *backend* ke *console* (`console.error(result)`), sehingga jika gagal lagi, pesan error spesifik dari Prisma dapat langsung terlihat, bukan sekadar pesan generik.
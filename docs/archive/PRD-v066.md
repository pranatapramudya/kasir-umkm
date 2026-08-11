# Product Requirements Document: PJTECH KASIR POS (LumeStack)
**Versi:** 0.0.66
**Fokus:** MVP Launch Blockers - Role-Based Access Control (RBAC) & Fitur Resi (Thermal Print + WhatsApp)

## 1. Analisis Kebutuhan Arsitektur
*   **Masalah Keamanan (RBAC):** Saat ini semua pengguna yang *login* dianggap memiliki akses penuh (*Owner*). Dibutuhkan pemisahan *role* agar akun "Kasir" hanya bisa melakukan transaksi penjualan, tanpa bisa melihat HPP, Laba Bersih, atau mengakses Dasbor Admin.
*   **Masalah Operasional (Resi):** Transaksi UMKM membutuhkan bukti fisik atau digital. Sistem harus bisa mencetak struk via printer thermal Bluetooth atau mengirimkan ringkasan transaksi langsung ke WhatsApp pelanggan.

## 2. Instruksi Eksekusi Logika: RBAC & Middleware
Sebagai agen pengembang, fokuslah pada pemanfaatan ekosistem Clerk yang sudah ada. DILARANG membuat sistem autentikasi kustom dari awal.

### A. Integrasi Clerk Public Metadata
*   **Target Logika:** Alur pendaftaran (*sign-up*) atau manajemen pengguna.
*   **Instruksi:** Manfaatkan fitur `publicMetadata` dari Clerk untuk menyimpan *role* pengguna. 
*   Tetapkan dua nilai *role* absolut: `OWNER` dan `CASHIER`.
*   *(Catatan untuk Agent: Pada fase MVP ini, asumsikan akun pertama yang mendaftar adalah OWNER, atau siapkan sebuah endpoint API khusus untuk OWNER membuat akun CASHIER baru).*

### B. Proteksi Rute (Next.js Middleware)
*   **Target File:** `middleware.ts` (berada di *root* direktori Next.js).
*   **Instruksi Keamanan Akses:**
    1. Intersepsi setiap permintaan (*request*) yang masuk menggunakan `auth().sessionClaims`.
    2. Ekstrak nilai *role* dari metadata pengguna.
    3. **Logika Pemblokiran:** JIKA pengguna mencoba mengakses rute yang berawalan `/admin` (Dasbor, Analitik, Produk, Pengeluaran) NAMUN *role*-nya adalah `CASHIER`, MAKA tolak akses tersebut dan *redirect* secara paksa ke rute `/` (Halaman Kasir POS).
    4. Pengguna dengan *role* `CASHIER` HANYA diizinkan mengakses rute transaksi utama dan rute *logout*.

### C. Penyesuaian UI Berdasarkan Role
*   **Target File:** Komponen *Sidebar* / *Bottom Navigation*.
*   **Instruksi:** Baca `role` pengguna di sisi *Client* atau *Server Component*. Sembunyikan (*hide*) menu-menu admin (Dashboard, Produk, Analitik, Pengaturan) sepenuhnya dari layar jika pengguna yang *login* adalah seorang kasir.

## 3. Instruksi Eksekusi Logika: Cetak Struk & WhatsApp Receipt
Jangan gunakan *library* PDF yang berat. Gunakan API standar web dan skema URL.

### A. Format Resi WhatsApp (Tanpa Biaya Server)
*   **Target File:** Komponen "Modal Sukses Checkout".
*   **Instruksi Pembuatan Teks:**
    1. Buat fungsi yang merangkum data keranjang (nama toko, nomor struk, daftar item dibeli, total belanja, uang tunai, kembalian) menjadi satu variabel teks *string* murni.
    2. Gunakan `encodeURIComponent()` pada *string* tersebut agar aman digunakan di URL.
    3. Buat tombol "Kirim Struk via WA". Saat diklik, arahkan pengguna (`window.open`) ke format URL standar: `https://wa.me/?text=[TEKS_YANG_SUDAH_DIENCODE]`. 
    4. Ini akan membuka aplikasi WhatsApp pengguna dan otomatis mengisi kolom pesan dengan format struk belanja yang rapi.

### B. Cetak Thermal (Browser Print API)
*   **Target File:** Halaman tersembunyi atau komponen khusus cetak struk (`/print-receipt`).
*   **Instruksi Arsitektur Cetak:**
    1. Buat sebuah komponen UI berukuran sangat sempit (lebar sekitar 58mm atau `w-64` di Tailwind) menyerupai struk kertas kasir (huruf *monospace*, teks di tengah untuk *header*, daftar item rata kiri-kanan).
    2. Komponen ini harus disembunyikan (*hidden*) dari pandangan utama layar menggunakan kelas `@media print`.
    3. Buat tombol "Cetak Struk Thermal". Saat diklik, panggil fungsi bawaan `window.print()`. 
    4. CSS *Print* harus dikonfigurasi agar hanya merender bagian kotak struk tersebut, mematikan elemen navigasi lain, dan menyesuaikan margin ke nol agar pas dengan printer kasir thermal yang terhubung via Bluetooth/USB ke perangkat.
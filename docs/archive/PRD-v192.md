# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.92
**Fokus:** Standarisasi Rute Pendaratan (Post-Login/Signup Redirect) ke `/admin`

## 1. Objektif Utama
Memastikan **semua** pengguna yang berhasil terautentikasi (baik Owner maupun Cashier, dari seluruh kategori bisnis: F&B, Retail, maupun Jasa) selalu diarahkan dan mendarat sempurna secara *default* di URL `http://localhost:3000/admin`. 

## 2. Deskripsi Masalah Saat Ini
Sistem *routing* pasca-login saat ini masih terpecah atau mengarah ke rute *root* (`/`) yang kemudian memicu logika *redirect* berlapis. Hal ini rawan menyebabkan *delay* (layar hitam) atau *Infinite Loop* saat transisi autentikasi. Kita membutuhkan satu rute *dashboard* sentral mutlak di `/admin`.

## 3. Instruksi Eksekusi Mutlak untuk Agent (PENTING: Terapkan tanpa merusak RBAC yang sudah ada)

### A. Audit & Modifikasi Komponen Autentikasi Clerk
Temukan seluruh file yang me-render komponen `<SignIn />` dan `<SignUp />`. Ubah *props* URL target pendaratannya (*fallback redirect* atau *force redirect*) agar secara eksplisit menunjuk ke `/admin`. 

### B. Audit URL Konfigurasi Clerk (Environment Variables)
Periksa file `.env` atau `.env.local`. Pastikan variabel *environment* bawaan Clerk untuk rute pasca-sign-in dan pasca-sign-up (seperti `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`) menunjuk secara statis ke `/admin`.

### C. Audit File Root & Middleware
1. **Root Page (`app/page.tsx`):** Jika rute `/` saat ini bertindak sebagai jembatan *redirect*, pastikan jika pengguna memiliki sesi aktif (`userId` ada), mereka langsung di-*redirect* ke `/admin`.
2. **Middleware (`middleware.ts`):** Pastikan tidak ada aturan yang memblokir akses awal ke `/admin` bagi pengguna yang sudah login. Rute `/admin` harus menjadi rute aman (*whitelisted* dari tendangan keluar) untuk semua pengguna terautentikasi sebelum komponen di dalamnya melakukan *rendering* UI berdasarkan *role*.

## 4. Output yang Diharapkan
Lakukan modifikasi pada file-file *routing* dan konfigurasi tersebut. Berikan laporan singkat mengenai file apa saja yang diubah untuk menyatukan rute pendaratan ini ke `/admin`. Dilarang mengubah logika pembatasan akses UI (*Sidebar/Menu*) yang sudah berjalan sempurna.
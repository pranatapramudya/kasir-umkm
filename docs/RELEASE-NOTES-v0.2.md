# Release Notes - Versi 0.2 (Road to Production)

Rilis v0.2 merupakan pembaruan masif yang berfokus pada kesiapan aplikasi untuk diluncurkan ke pasar (*Production-Ready*). Berbagai peningkatan telah dilakukan mulai dari pengoptimalan SEO, pemolesan UI/UX, stabilitas operasional melalui *dashboard* admin, hingga penambalan celah desinkronisasi arsitektur *backend*.

## Fitur Baru & Peningkatan Utama

### 1. Injeksi SEO Nasional & Optimasi UI Landing Page
- Pembaruan *meta tags*, *title*, dan deskripsi SEO agar lebih ramah terhadap pencarian organik Google.
- Antarmuka *Landing Page* dipoles menggunakan estetika desain modern (glassmorphism, transisi halus, tata letak dinamis) untuk meningkatkan rasio konversi.

### 2. Alur Pembayaran & Halaman Tunggu (Pending Approval)
- Diperkenalkannya sistem alur **Manual ACC**. Saat pengguna mendaftar ke paket Pro/Berbayar, mereka akan diarahkan untuk membayar via WhatsApp.
- Status *tenant* akan berubah menjadi `PENDING` dan pengguna akan dikunci di *Wait Page* (`/pending-approval`) yang aman dari interupsi hingga admin menyetujui transaksi.

### 3. Dinamisasi Pembayaran (QRIS DANA Bisnis)
- Halaman harga (*Pricing Section*) kini menampilkan instruksi transfer dan QRIS statis yang akan berganti secara dinamis menyesuaikan paket langganan dan *bundle hardware* yang dipilih pengguna.

### 4. Dasbor Superadmin (Master Data Tenant)
- **SearchBar**: Penambahan fitur pencarian *real-time* (dengan mitigasi *debounce*) untuk mencari UMKM berdasarkan nama toko atau nomor telepon.
- **Manual Override**: Tombol tindakan baru untuk admin mengubah tipe paket dan status (*ACTIVE*, *TRIAL*, *EXPIRED*, *PENDING*) secara bebas untuk keperluan dukungan pelanggan.
- Modifikasi tata letak (Command Center) agar navigasi admin lebih lega dan efisien.

### 5. Halaman Panduan Karyawan Khusus
- Pemisahan antarmuka panduan; karyawan kini tidak bisa mengakses halaman langganan yang dikhususkan bagi sang Pemilik/Owner. Karyawan disuguhkan UI panduan fungsional tersendiri untuk membantu pekerjaan *shift* mereka.

### 6. Sinkronisasi Penghapusan Akun (Clerk Webhooks)
- Mengintegrasikan modul `svix` untuk membuat *endpoint* penerimaan notifikasi Webhook resmi dari Clerk.
- Celah desinkronisasi telah ditambal. Kini saat *user* menghapus akunnya melalui antarmuka keamanan Clerk, *event* `user.deleted` akan merambat masuk ke *database* Neon dan otomatis mengubah status *tenant* tersebut menjadi `DELETED_BY_USER`, sekaligus memberikan markah (coret/strikethrough) di antarmuka Superadmin.

### 7. Resolusi Bug Kosmetik (UI/UX Fixes)
- Peningkatan kontras teks pada kolom masukan dan opsi menu *dropdown*.
- *Banner* berlangganan (*Subscription Banner*) kini secara cerdas menyesuaikan judul dari basis data dan bukan di-*hardcode* sebagai "Free Trial".
- Tombol kartu pada paket berlangganan kini dinonaktifkan dengan tulisan "Paket Anda Saat Ini" untuk mencegah duplikasi pesanan.

---
**Status Kesiapan:** Kesiapan arsitektural telah dievaluasi melalui Audit Skalabilitas. Infrastruktur ini siap untuk dipasarkan (MVP), dan akan dimutakhirkan ke solusi API Payment Gateway sepenuhnya untuk pembaruan berikutnya saat *user-base* mulai meningkat tajam.

# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.03
**Fokus:** Implementasi Alur Persetujuan Manual (Manual ACC) & Halaman Tunggu Pembayaran

## 1. Objektif Fitur
Mengubah alur pendaftaran paket berbayar (6 Bulan, Pro Tahunan, Bundling) menjadi sistem *Manual Approval*. Pengguna yang memilih paket berbayar akan diarahkan ke "Halaman Tunggu", sementara status akun mereka ditahan (Pending) hingga `SUPERADMIN` melakukan verifikasi manual (ACC) melalui *Command Center*.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Modifikasi Skema Database (Prisma)
1. Buka `prisma/schema.prisma`.
2. Pastikan tabel `Subscription` (atau tabel yang mencatat paket pengguna) memiliki kolom `status`. 
3. Tambahkan enumerasi atau nilai *string* baru: `PENDING`. (Nilai yang ada saat ini mungkin `TRIAL`, `ACTIVE`, `EXPIRED`).

### B. Pembuatan UI Halaman Tunggu (Waiting Page)
1. Buat rute baru, misalnya `app/pending-approval/page.tsx`.
2. Rancang UI sederhana dan elegan yang berisi:
   * Ikon jam pasir / *loading spinner*.
   * Teks Utama: "Menunggu Konfirmasi Pembayaran"
   * Teks Deskripsi: "Mohon tunggu 5-10 menit. Tim kami sedang memverifikasi pembayaran Anda. Halaman ini akan otomatis memuat ulang setelah pembayaran disetujui."
   * Tombol sekunder: "Hubungi Bantuan (WhatsApp)" jika mereka belum mengirimkan bukti transfer.
3. Tambahkan logika *Auto-Refresh* atau *Polling* ringan (misal menggunakan `useEffect` dengan `setInterval` setiap 10 detik, atau *Server Action* dengan `router.refresh()`) untuk mengecek apakah `status` di *database* sudah berubah menjadi `ACTIVE`. Jika sudah, otomatis *redirect* ke `/admin`.

### C. Modifikasi Alur Checkout (Frontend & Backend)
1. Saat pengguna mengklik tombol "Kirim Bukti via WhatsApp" di modal pembayaran, lakukan *fetch* ke API.
2. API tersebut harus membuat/memperbarui *record* langganan pengguna tersebut menjadi `status: "PENDING"`.
3. Setelah API merespons sukses, lakukan dua hal secara bersamaan:
   * Buka *link* WhatsApp di *tab* baru (`window.open(waLink, '_blank')`).
   * Arahkan *tab* utama aplikasi ke `/pending-approval` (`router.push('/pending-approval')`).

### D. Penyekatan Rute (Middleware / Layout)
Pastikan pengguna yang berstatus `PENDING` tidak bisa membobol masuk ke `/admin`.
1. Di `middleware.ts` atau `app/admin/layout.tsx`, tambahkan pengecekan status langganan.
2. Jika pengguna sudah *login* namun statusnya `PENDING`, paksa *redirect* mereka kembali ke `/pending-approval`.

### E. Tombol "ACC" di Dashboard Superadmin
1. Buka halaman *Command Center Superadmin*.
2. Pada tabel Master Data Tenant, tambahkan kolom/tombol aksi (Action).
3. Jika *tenant* berstatus `PENDING`, tampilkan tombol **"ACC / Aktifkan"**.
4. Saat diklik, panggil API untuk mengubah status *tenant* tersebut di *database* dari `PENDING` menjadi `ACTIVE` (serta mengatur tanggal mulai dan kedaluwarsa langganan).

## 3. Output yang Diharapkan
Terapkan seluruh logika *Manual Approval* ini dari ujung ke ujung (*End-to-End*). Konfirmasikan kepada *developer* bahwa status "Pending" sudah aktif, halaman tunggu sudah diimplementasikan, dan Superadmin dapat melakukan verifikasi manual dari *dashboard*.
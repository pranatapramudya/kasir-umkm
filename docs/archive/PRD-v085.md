# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.85
**Fokus:** Penghapusan Teks Statis & Implementasi Live Countdown Timer Langganan

## 1. Analisis Kebutuhan Arsitektur & Bisnis
*   **Masalah Utama:** Pada komponen Sidebar, kartu informasi langganan masih menampilkan teks *hardcoded* "Paket Gratis Selamanya". 
*   **Logika Bisnis yang Benar:** Aplikasi ini TIDAK memiliki paket gratis selamanya. Pengguna hanya bisa memilih 3 opsi saat *onboarding*:
    1. Trial (Masa percobaan 14 Hari)
    2. Pro Bulanan (Aktif 30 Hari)
    3. Pro Tahunan (Aktif 365 Hari)
*   **Tujuan:** Ketiga paket tersebut memberikan akses penuh, namun dibatasi oleh waktu. Sidebar harus secara dinamis menampilkan NAMA PAKET yang sedang aktif dan sebuah *LIVE COUNTDOWN TIMER* (waktu mundur) yang menunjukkan sisa hari, jam, dan menit menuju kedaluwarsa.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Patuhi instruksi di bawah ini tanpa kecuali. DILARANG menggunakan teks statis untuk informasi paket.

### A. Kalibrasi Server Action (Pemilihan Paket)
*   **Target File:** Server action yang menangani *submit* dari halaman Onboarding Step 2.
*   **Tugas Anda:** 
    1. Pastikan logika penyimpanan paket menerima parameter spesifik (contoh: `TRIAL`, `MONTHLY`, `YEARLY`).
    2. Hitung variabel `endsAt` secara presisi menggunakan fungsi manipulasi waktu bawaan JavaScript:
       - `TRIAL` = Waktu saat ini + 14 Hari.
       - `MONTHLY` = Waktu saat ini + 30 Hari.
       - `YEARLY` = Waktu saat ini + 365 Hari.
    3. Simpan nama paket dan `endsAt` tersebut ke tabel Prisma `Tenant` DAN injeksikan ke dalam `publicMetadata` Clerk milik pengguna.

### B. Pembuatan Komponen Client (Live Timer)
*   **Target File:** Buat komponen baru (misalnya `components/SubscriptionTimer.tsx`) dengan direktif `"use client"`.
*   **Tugas Anda:**
    1. Komponen ini harus menerima data tanggal kedaluwarsa (`endsAt`) dari *props*.
    2. Gunakan *React Hooks* untuk membuat interval yang menghitung mundur setiap 1 detik.
    3. Konversikan selisih waktu antara sekarang dan `endsAt` menjadi format string yang mudah dibaca (Contoh: "13 Hari : 23 Jam : 59 Menit").
    4. Tangani kondisi ketika waktu sudah habis (selisih <= 0) dengan menampilkan teks peringatan berwarna merah: "Paket Kedaluwarsa".

### C. Refaktor UI Sidebar
*   **Target File:** `components/Sidebar.tsx`
*   **Tugas Anda:**
    1. Hapus teks *hardcoded* "Paket Gratis Selamanya".
    2. Ambil data nama paket pengguna dari sesi/metadata saat ini dan tampilkan sebagai judul kartu (Misal: "Paket: Pro Bulanan").
    3. *Render* komponen *Client Live Timer* yang baru saja Anda buat di bawah judul tersebut.
    4. Pertahankan tombol "Perpanjangan Berbayar" di bawah *timer* agar pengguna dapat memperbarui langganan mereka jika waktu sudah menipis atau habis.
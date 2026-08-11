# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.84
**Fokus:** Sinkronisasi Skema Paket (Trial/Bulanan/Tahunan) & Countdown Timer Sidebar

## 1. Analisis Bug & Kebutuhan Fitur
*   **Masalah Integrasi:** Pengguna telah mengubah UI daftar paket menjadi 3 opsi baru: Trial 14 Hari, Pro Bulanan, dan Pro Tahunan. Namun, saat paket dipilih, sistem *Sidebar* masih membaca status sebagai "Paket Gratis Selamanya". 
*   **Kebutuhan Frontend:** Dibutuhkan komponen `CountdownTimer` di sisi *Client* agar sisa waktu (Hari & Jam) bisa ter- *update* secara presisi di *Sidebar* tanpa perlu memuat ulang halaman (*refresh*).

## 2. Instruksi Eksekusi untuk AI Agent
Perbarui logika kalkulasi tanggal kedaluwarsa pada *Server Action*, lalu buat komponen penghitung mundur untuk *Sidebar*.

### A. Sinkronisasi Logika Server Action (Pilihan Paket)
*   **Target File:** `app/onboarding/actions.ts` (atau *Server Action* terkait pemilihan paket).
*   **Instruksi Kalkulasi Waktu:**
    1.  Ubah fungsi agar menerima parameter paket yang baru (misal: `TRIAL`, `PRO_MONTHLY`, `PRO_YEARLY`).
    2.  Terapkan logika penambahan waktu (*Date calculation*) berdasarkan parameter:
        *   Jika `TRIAL`: `endsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)` (14 Hari).
        *   Jika `PRO_MONTHLY`: `endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)` (30 Hari).
        *   Jika `PRO_YEARLY`: `endsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)` (365 Hari).
    3.  Simpan nilai `plan` dan `endsAt` ini ke dalam tabel Prisma `Tenant`.
    4.  **Sangat Penting:** Simpan juga ke Clerk `publicMetadata` agar bisa langsung dibaca oleh *Middleware* dan *Sidebar*. Simpan `endsAt` dalam format *ISO String* (`endsAt.toISOString()`).

### B. Pembuatan Client Component (Countdown Timer)
*   **Target File Baru:** `components/CountdownTimer.tsx`
*   **Instruksi React Hook:**
    1.  Buat file baru ini dan tandai dengan `"use client";`.
    2.  Komponen ini menerima *props*: `{ endsAt: string | null, plan: string }`.
    3.  Jika `endsAt` kosong, kembalikan UI *default*: `<p>Belum ada paket aktif</p>`.
    4.  Gunakan `useEffect` dan `setInterval` (berjalan setiap 1000ms/1 detik) untuk menghitung selisih waktu antara `new Date(endsAt)` dan `new Date()`.
    5.  Kalkulasi sisa waktu ke dalam format **Hari, Jam, dan Menit**.
    6.  Jika waktu sudah habis (selisih < 0), tampilkan teks merah: **"Paket Kedaluwarsa"**.

### C. Injeksi Timer ke Sidebar
*   **Target File:** `components/Sidebar.tsx`
*   **Instruksi Rendering:**
    1.  Karena `Sidebar.tsx` adalah *Server Component*, ambil data paket dari sesi Clerk:
        `const plan = auth().sessionClaims?.metadata?.subscriptionPlan;`
        `const endsAt = auth().sessionClaims?.metadata?.subscriptionEndsAt;`
    2.  Di dalam kartu "Perpanjangan Berbayar" di bagian bawah *Sidebar*, *import* dan panggil komponen klien tadi:
        `<CountdownTimer plan={plan as string} endsAt={endsAt as string} />`
    3.  Rapikan UI kartu tersebut agar tetap estetik (gunakan lencana/badge warna kuning/emas untuk nama paket).
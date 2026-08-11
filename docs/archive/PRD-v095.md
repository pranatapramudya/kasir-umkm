# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.95
**Fokus:** Sinkronisasi Universal Live Timer (Trial, 6 Bulan, 1 Tahun) & Kalender Kedaluwarsa

## 1. Analisis Bug Kritis pada Sidebar
*   **Gejala:** Pada Sidebar, komponen menampilkan lencana "Paket: Trial", namun teks di bawahnya menampilkan "Belum ada paket aktif".
*   **Akar Masalah:** 
    1. Kegagalan passing data kalender (`subscriptionEndsAt`) dari Clerk `sessionClaims` / Prisma ke komponen Client `CountdownTimer`.
    2. Komponen timer tidak memiliki logika yang tepat untuk membedakan status kalender (Aktif vs Tidak Aktif).
*   **Kebutuhan Bisnis:** Sistem tidak memiliki paket "Gratis Selamanya". Semua paket berbasis kalender (Trial = 14 Hari, Pro = 6 Bulan, Premium = 1 Tahun). Komponen harus menghitung mundur waktu secara *real-time* untuk semua jenis paket tersebut.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Sebagai agen pengembang, jangan berikan kodingan mentah. Langsung perbaiki komponen *Frontend* dan *Backend* di sistem pengguna dengan mematuhi arsitektur berikut.

### A. Kalibrasi Tanggal di Server Action (Onboarding)
*   **Target File:** Server Action yang menyimpan pilihan paket pengguna.
*   **Instruksi:** Pastikan perhitungan `endsAt` menggunakan penambahan kalender yang akurat berdasarkan paket yang dipilih:
    - Paket Trial: `new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)`
    - Paket 6 Bulan: `new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)`
    - Paket 1 Tahun: `new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)`
    Simpan nilai ini dalam format *ISO String* ke `publicMetadata` Clerk dan *database* Prisma.

### B. Refaktor Komponen Client (CountdownTimer)
*   **Target File:** Komponen yang merender teks waktu mundur di Sidebar (misal: `components/CountdownTimer.tsx`).
*   **Instruksi Logika Timer:**
    1. Komponen wajib menerima `endsAt` (string ISO tanggal) sebagai *props*.
    2. Jika `endsAt` valid, gunakan `setInterval` untuk menghitung selisih waktu antara `new Date(endsAt)` dan kalender saat ini `new Date()` setiap 1 detik.
    3. **Indikator Status Aktif:** 
       - Jika selisih waktu > 0 (Masih hidup): Tampilkan teks hijau "Status: Aktif" dan di bawahnya tampilkan format waktu sisa yang dinamis (Misal: "Sisa: 13 Hari 23 Jam 59 Menit").
       - Jika selisih waktu <= 0 (Habis): Tampilkan teks merah tebal "Status: Kedaluwarsa" dan sembunyikan hitungan waktunya.
    4. Pastikan UI Timer ini responsif, ukuran teks dapat terbaca dengan jelas, dan tidak merusak *layout* Sidebar.

### C. Injeksi Data EndsAt dari Layout/Sidebar Server
*   **Target File:** `components/Sidebar.tsx` (Server Component).
*   **Instruksi:**
    1. Pastikan Anda mengekstrak variabel kedaluwarsa dari sesi pengguna: 
       `const endsAt = auth().sessionClaims?.metadata?.subscriptionEndsAt;`
    2. Berikan *props* tersebut ke dalam pemanggilan komponen Client: 
       `<CountdownTimer plan={plan} endsAt={endsAt} />`
    3. *Console.log* nilai `endsAt` ini di terminal server Anda untuk memastikan datanya tidak *undefined* atau *null*.
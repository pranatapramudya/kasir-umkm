# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.97
**Fokus:** Investigasi Pipeline Data Kalender (endsAt) & Aktivasi Live Timer

## 1. Analisis Akar Masalah (Data Flow Failure)
*   **Apresiasi:** Perbaikan *Client-Server Boundary* pada PRD sebelumnya telah berhasil mencegah *crash* aplikasi.
*   **Bug Bisnis (P0):** Komponen Sidebar berhasil mendeteksi nama paket ("Paket: Trial"), namun gagal menampilkan hitungan mundur waktu. Teks yang muncul adalah "Belum ada paket aktif".
*   **Diagnosa:** Hal ini terjadi karena komponen `CountdownTimer` menerima nilai `endsAt` yang kosong (`null`/`undefined`) atau format tanggal yang tidak valid. Terjadi kebocoran aliran data (*data flow*) antara *Server Action* (Onboarding), Clerk `publicMetadata`, dan `Sidebar.tsx`.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pelacakan (*tracing*) pada aliran data `subscriptionEndsAt` dari awal hingga akhir. DILARANG KERAS memberikan *output* kode mentah. Terapkan logika arsitektur ini langsung di sistem pengguna.

### A. Verifikasi Hulu (Server Action Onboarding)
*   **Target File:** File yang memproses pemilihan paket langganan (misal: `app/onboarding/actions.ts`).
*   **Instruksi:** 
    1. Pastikan logika kalkulasi tanggal kedaluwarsa (`endsAt`) benar-benar dieksekusi saat pengguna memilih paket Trial, 6 Bulan, atau 1 Tahun.
    2. WAJIB pastikan nilai tanggal tersebut diubah menjadi *string* standar (`endsAt.toISOString()`) SEBELUM disimpan ke dalam `publicMetadata` Clerk dan Prisma. Clerk tidak dapat menyimpan objek *Date* mentah.

### B. Verifikasi Tengah (Ekstraksi di Sidebar)
*   **Target File:** `components/Sidebar.tsx`
*   **Instruksi:**
    1. Pastikan pemanggilan data dari sesi akurat: 
       `const endsAt = auth().sessionClaims?.metadata?.subscriptionEndsAt;`
    2. Lakukan injeksi log ke terminal (`console.log("DATA ENDSAT DI SIDEBAR:", endsAt)`) agar Anda dapat memverifikasi apakah data tersebut benar-benar sampai ke Server Component ini sebelum dioper ke *Client Component*.

### C. Verifikasi Hilir (Kalkulasi CountdownTimer)
*   **Target File:** `components/SubscriptionTimer.tsx` atau `CountdownTimer.tsx`.
*   **Instruksi Logika Timer:**
    1. Komponen ini harus menerima *props* `endsAt` (bertipe *string* atau *null*).
    2. Jika `endsAt` bernilai *truthy*, *parsing* kembali *string* tersebut menjadi objek Date: `const targetDate = new Date(endsAt)`.
    3. Gunakan *React Hook* (`useEffect` & `setInterval`) untuk membandingkan `targetDate` dengan `new Date()` setiap 1000ms.
    4. Hitung sisa Hari, Jam, Menit, dan Detik menggunakan rumus selisih *milisecond* yang standar.
    5. Jika sisa waktu > 0, tampilkan hasil kalkulasi (Misal: "Sisa: 14 Hari 0 Jam").
    6. **Penting:** Pastikan state awal *timer* dirender dengan aman untuk menghindari peringatan *Hydration Mismatch* di Next.js (gunakan teknik `isMounted` atau inisialisasi state setelah *render* pertama).
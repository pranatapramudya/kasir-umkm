# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.98
**Fokus:** UI/UX Rendering Check & Clerk Session Synchronization

## 1. Analisis Situasi & Kebutuhan Klien
*   **Status Klien:** Klien masih melihat teks "Belum ada paket aktif" pada Sidebar. Hal ini sangat mungkin disebabkan oleh data `endsAt` pada sesi saat ini yang masih kosong (karena pengguna memilih paket sebelum *pipeline* data diperbaiki).
*   **Fokus Audit:** Kita harus memastikan tidak ada kesalahan logika rendering pada `SubscriptionTimer.tsx`, dan memastikan token sesi Clerk diperbarui setelah pengguna memilih paket baru.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit visual dan sinkronisasi sesi. DILARANG memberikan *output* kode mentah.

### A. Audit Strict Rendering (CountdownTimer)
*   **Target File:** `components/SubscriptionTimer.tsx` (atau `CountdownTimer.tsx`).
*   **Instruksi Logika Wajib:**
    1. Pastikan validasi awal sangat ketat: 
       `if (!endsAt || endsAt === "null" || endsAt === "undefined") { return <p>Belum ada paket aktif</p>; }`
    2. Pastikan perhitungan waktu aman dari `NaN`. Gunakan `const targetTime = new Date(endsAt).getTime();` dan `const currentTime = new Date().getTime();`.
    3. Jika `targetTime - currentTime > 0`, WAJIB me- *return* elemen UI yang memuat teks "Sisa: X Hari X Jam X Menit X Detik". 
    4. JANGAN sampai ada kondisi di mana waktu masih ada, tetapi komponen malah me- *return* elemen *null* atau teks *fallback*.

### B. Sinkronisasi Sesi Clerk (Server Action)
*   **Target File:** `app/onboarding/actions.ts` (Atau *Server Action* yang memproses pemilihan paket).
*   **Instruksi:**
    1. Ketika pengguna berhasil memilih paket baru dan Anda menyimpan `endsAt` ke Clerk `publicMetadata`, *session token* pengguna saat ini mungkin tidak langsung terbarui di sisi klien.
    2. Jika Anda menggunakan Clerk, pertimbangkan untuk menambahkan respons atau instruksi *redirect* yang memicu pemuatan ulang halaman secara penuh (misal: `revalidatePath('/admin', 'layout')` atau `redirect('/admin')`) agar Sidebar menarik *token/claims* sesi terbaru dari Clerk yang sudah berisi tanggal `endsAt` yang baru.
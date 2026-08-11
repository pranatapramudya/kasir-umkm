# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.96
**Fokus:** Resolusi Build Error (Client-Server Boundary) pada Modul Clerk

## 1. Analisis Akar Masalah (Build Error Kritis)
*   **Gejala:** Aplikasi *crash* dengan pesan `Invalid import 'server-only' cannot be imported from a Client Component module`. Kesalahan berasal dari pemanggilan modul `@clerk/nextjs/dist/esm/app-router/server`.
*   **Akar Masalah (Boundary Violation):** Terdapat pelanggaran arsitektur Next.js App Router. Anda (AI Agent) secara keliru mengimpor modul server-side milik Clerk (`@clerk/nextjs/server`) ke dalam file yang memiliki direktif `"use client"`, ATAU Anda memberikan direktif `"use client"` pada komponen yang seharusnya bertindak sebagai Server Component (seperti `Sidebar.tsx`).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan audit dan perbaikan pembatasan komponen (*Component Boundary*) secara ketat. DILARANG memberikan kode mentah kepada pengguna.

### A. Audit Komponen Klien (CountdownTimer.tsx)
*   **Target File:** Komponen yang menangani logika *timer* mundur (misal: `components/CountdownTimer.tsx`).
*   **Instruksi:**
    1. Pastikan baris paling atas memiliki direktif `"use client";`.
    2. **HAPUS SEMUA** impor yang berasal dari `@clerk/nextjs/server` atau yang memanggil fungsi server (seperti `auth()` atau `currentUser()`).
    3. Komponen ini murni hanya boleh menggunakan *React Hooks* (`useState`, `useEffect`) dan menerima data `endsAt` murni melalui *props* dari *parent component*.

### B. Audit Komponen Server (Sidebar.tsx)
*   **Target File:** `components/Sidebar.tsx` (Komponen yang memanggil dan me-*render* CountdownTimer).
*   **Instruksi:**
    1. **PASTIKAN** file ini TIDAK memiliki direktif `"use client";` di bagian atas. File ini wajib menjadi Server Component.
    2. File inilah yang bertugas mengimpor `auth()` dari `@clerk/nextjs/server`.
    3. Ekstrak `subscriptionEndsAt` dari `sessionClaims` di dalam fungsi server ini.
    4. Oper (pass) nilai tanggal tersebut sebagai *props* ke `<CountdownTimer endsAt={...} />`.

### C. Verifikasi Alur Data (Data Flow)
*   Arsitektur yang benar adalah: Server (`Sidebar.tsx`) mengambil data autentikasi dan tanggal kedaluwarsa secara aman di sisi server $\rightarrow$ Server mengoper data tersebut sebagai string/objek biasa ke Klien $\rightarrow$ Klien (`CountdownTimer.tsx`) merender kalkulasi waktu mundur tanpa menyentuh modul autentikasi server. Terapkan secara presisi!
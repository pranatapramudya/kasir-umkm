# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.31
**Fokus:** Lokalisasi Bahasa Indonesia untuk Clerk Auth

## 1. Objektif
Mengubah seluruh bahasa antarmuka pada komponen Clerk (Sign In, Sign Up, User Profile, dan validasi/error message seperti syarat password ketat) dari bahasa Inggris (default) menjadi Bahasa Indonesia. Ini penting agar UMKM dan karyawan lokal dapat memahami instruksi keamanan tanpa hambatan bahasa.

## 2. Instalasi Paket Lokalisasi
**Instruksi:**
Pastikan package `@clerk/localizations` sudah terinstal di proyek. Jika belum, jalankan perintah ini di background terminal:
`npm install @clerk/localizations`

## 3. Refaktor Provider Utama (ClerkProvider)
**Target File:** `app/layout.tsx` (Atau file Root Layout tempat komponen `<ClerkProvider>` berada).
**Instruksi Eksekusi:**
1. Import modul bahasa Indonesia dari package Clerk Localizations di bagian atas file:
   `import { idID } from '@clerk/localizations';`
2. Temukan komponen `<ClerkProvider>`.
3. Tambahkan properti `localization` dengan value `idID` ke dalam provider tersebut.
   Contoh penulisan:
   `<ClerkProvider localization={idID}>`
   `  {/* children / isi layout lainnya */}`
   `</ClerkProvider>`

Silakan eksekusi perubahan ini. Pastikan tidak ada TypeScript error dan pastikan semua komponen bawaan Clerk di halaman depan sudah otomatis menggunakan Bahasa Indonesia (misal: "Alamat Email", "Kata Sandi", dll).
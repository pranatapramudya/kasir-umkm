# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.44
**Fokus:** Penyesuaian Sempurna (Override) Lokalisasi Bahasa Indonesia pada Password Clerk

## 1. Objektif
Menghilangkan sisa-sisa teks bahasa Inggris pada komponen autentikasi Clerk, secara spesifik pada bagian saran pengisian password (password hints), validasi keamanan, dan pesan error, agar 100% menggunakan Bahasa Indonesia.

## 2. Analisis Masalah
Meskipun komponen `<ClerkProvider>` sudah menggunakan paket `@clerk/localizations` dengan `id-ID`, beberapa *string* dinamis terkait kebijakan password (seperti panjang karakter, kebutuhan angka/huruf besar) sering kali tidak ter-cover oleh terjemahan bawaan dan tetap muncul dalam bahasa Inggris.

## 3. Eksekusi Perbaikan (Konfigurasi ClerkProvider)
**Target File:** File yang membungkus aplikasi dengan `<ClerkProvider>` (biasanya `app/layout.tsx` atau `app/providers.tsx`).
**Instruksi Eksekusi (TIDAK PERLU MERUBAH STRUKTUR UI):**

1. **Custom Localization Override:**
   - Anda harus memodifikasi *prop* `localization` pada `<ClerkProvider>`.
   - Jangan hanya memanggil `idID` secara mentah. Buatlah sebuah objek *custom* yang menggabungkan (merge/spread) `idID` bawaan dengan nilai *override* spesifik.

2. **Identifikasi & Terjemahkan Key Password:**
   - Cari dan tindih (override) key lokalisasi Clerk yang berkaitan dengan password. Anda (sebagai AI) harus mengetahui struktur key Clerk, biasanya berada di dalam objek `signUp`, `formFieldHintText`, atau `formFieldError`.
   - Terjemahkan kalimat peringatan standar seperti:
     - "Must contain 8 or more characters" ➔ "Harus terdiri dari 8 karakter atau lebih."
     - "Must contain at least 1 number" ➔ "Harus mengandung minimal 1 angka."
     - "Must contain at least 1 special character" ➔ "Harus mengandung minimal 1 karakter khusus."
   - Pastikan juga bagian "Password strength" jika ada diubah menjadi "Kekuatan password".

3. **Injeksi ke Provider:**
   - Masukkan objek *custom localization* tersebut secara aman ke dalam properti `<ClerkProvider localization={customIdID}>`.

Silakan cari key yang tepat pada dokumentasi internal Anda terkait Clerk Localization, terapkan override bahasanya, dan pastikan tidak ada lagi satu pun kata bahasa Inggris yang muncul saat user mengetikkan password.
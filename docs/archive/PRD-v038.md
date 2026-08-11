# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.38
**Fokus:** Dinamisasi UI Terkunci (Unlock Features untuk Trial/Pro)

## 1. Analisis Kebutuhan
*   **Masalah Saat Ini:** Halaman `/admin/analytics` saat ini menampilkan antarmuka yang di-*hardcode* dengan *state* terkunci (efek *blur/opacity* dan *badge* "Data sedang dikumpulkan..."). Hal ini menghalangi proses pengembangan (*development*) dan menyalahi konsep *Free Trial* di mana pengguna seharusnya dapat mengakses fitur tersebut.
*   **Tujuan:** Mengimplementasikan *conditional rendering* (render bersyarat). UI hanya boleh terkunci jika masa *Free Trial* 14 hari sudah habis DAN pengguna belum meng-*upgrade* ke paket Pro. Selama masa *trial* atau jika pengguna sudah Pro, fitur harus terbuka penuh.

## 2. Instruksi Eksekusi untuk AI Agent
Rombak halaman `app/admin/analytics/page.tsx` dengan menambahkan logika otorisasi UI tingkat komponen.

### A. Implementasi Logika Status Langganan (Conditional Logic)
*   Buat atau panggil variabel simulasi/aktual yang mengecek status pengguna. 
    *   *Catatan Dev:* Jika sistem validasi *database* langganan belum siap, buat variabel statis sementara: `const isTrialActive = true;` atau `const isPro = false; const hasAccess = isTrialActive || isPro;`
*   Gunakan variabel `hasAccess` tersebut untuk mengontrol tampilan UI.

### B. Unlocking Antarmuka (Buka Gembok UI)
Berdasarkan kondisi `hasAccess === true`, lakukan perubahan dinamis pada kartu fitur:
1.  **Hapus Efek Terkunci:** Hilangkan kelas CSS yang membuat efek buram/transparan (seperti `opacity-50`, `blur-sm`, atau `pointer-events-none`) pada kartu-kartu metrik (Jam Sibuk, Analitik Produk, dll).
2.  **Sembunyikan Badge Gembok:** Sembunyikan elemen *badge* hitam "🔒 Data sedang dikumpulkan..." agar kartu terlihat bersih dan siap menampilkan grafik/data.
3.  **Tampilkan Data Mockup:** Render tata letak data *dummy* yang bersih di dalam kartu tersebut (misalnya, teks angka acak, struktur baris/kolom, atau ikon) sebagai *placeholder* sebelum integrasi grafik sesungguhnya.

### C. Penyesuaian CTA "Buka Semua Wawasan"
*   Kartu biru besar yang berisi promosi "Upgrade ke Pro Tahunan" harus diatur visibilitasnya.
*   Jika `hasAccess === true` HANYA karena *Free Trial* (bukan Pro), ubah teks kartu biru tersebut menjadi peringatan halus: **"Masa Trial Berakhir dalam X Hari"** dan tombolnya menjadi **"Amankan Akses Pro"**.
*   Jika belum memungkinkan, cukup sembunyikan (`hidden`) kartu biru raksasa tersebut saat *user* memiliki akses.
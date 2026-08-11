# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.71
**Fokus:** Relokasi Logo & Pembersihan Layout Tumpang Tindih (Overlap Fix)

## 1. Analisis Bug Visual & UX
*   **Visual Bug Kritis:** Logo "PJTECH KASIR" di sebelah kiri menabrak dan menumpuk pada teks judul H1 ("Sistem Point of Sale Era Modern"). Ini merusak hierarki visual dan keterbacaan secara fatal.
*   **Solusi UX:** Logo harus dipindahkan sepenuhnya dari sisi kiri. Tempat yang paling ideal untuk identitas merek pada arsitektur *Split Screen* adalah di dalam komponen *Auth/Login Card* (di atas teks ucapan selamat datang).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Bersihkan kekacauan tata letak di sebelah kiri dan pindahkan logo beserta logika pintu rahasianya ke sebelah kanan. DILARANG memberikan *output* kode mentah panjang.

### A. Hapus Logo dari Sisi Kiri
*   **Target File:** `app/page.tsx`
*   **Instruksi:** 
    1. Hapus elemen Logo/Teks "PJTECH KASIR" yang saat ini menumpuk di atas judul "Sistem Point of Sale Era Modern".
    2. Pastikan susunan sisi kiri (*Left Column*) kini dimulai langsung dari teks H1 tersebut dengan posisi vertikal yang rapi (menggunakan Flexbox/Grid alignment tengah).

### B. Relokasi Logo ke Area Glassmorphism (Kanan)
*   **Target File:** `app/page.tsx`
*   **Instruksi Layout:**
    1. Di dalam wadah *Glassmorphism* sebelah kanan, sisipkan elemen Logo/Teks merek (sebaiknya: Ikon Toko + "PJTECH KASIR UMKM") tepat di atas elemen judul "Selamat Datang".
    2. Gunakan Flexbox (`flex flex-col items-center`, `text-center`, `mb-6`) agar logo berada simetris di tengah dan memberikan jarak yang estetis sebelum teks "Selamat Datang".

### C. Bawa Logika Secret Backdoor (Superadmin)
*   **Instruksi Logika:**
    1. Pastikan logika pintu rahasia yang diinstruksikan pada PRD-v170 TETAP MELEKAT pada logo yang baru dipindah ini.
    2. Cek peran pengguna: Jika `role === 'SUPERADMIN'`, bungkus logo di atas form login ini dengan `<Link href="/superadmin">`. Jika bukan, biarkan menjadi elemen statis.

Silakan eksekusi relokasi ini untuk memastikan tampilan *Landing Page* 100% rapi dan profesional!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.02
**Fokus:** Hotfix UI Dashboard Grid Overflow & Typography Wrapping (MacBook/Tablet Landscape)

## 1. Analisis Bug Visual (UI/UX Kritis)
*   **Gejala:** Pada resolusi layar sekelas MacBook atau Tablet *Landscape* (sekitar 1024px - 1280px), empat kartu metrik "Ringkasan Bisnis" saling tergencet karena dipaksa berada dalam 1 baris (4 kolom).
*   **Dampak Fatal:** Teks angka nominal yang panjang (terutama pada kartu "Laba Bersih" yang memiliki nilai minus) terpotong ke bawah (*line break*), menumpuk (*overlapping*), dan merusak estetika antarmuka.
*   **Penyebab:** Penggunaan utilitas `grid-cols-4` (atau `lg:grid-cols-4`) yang terlalu dini pada *breakpoint* yang layarnya belum cukup lebar untuk menampung Sidebar + 4 Kartu sekaligus.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki tata letak *Grid* dan *Typography* pada halaman Dashboard. DILARANG memberikan *output* kode mentah, langsung perbaiki pada *codebase* pengguna.

### A. Refaktor Grid Kartu Ringkasan Bisnis
*   **Target File:** Komponen yang me-*render* keempat kartu dasbor (misal: `app/admin/page.tsx` atau `app/admin/AdminLayoutClient.tsx`).
*   **Instruksi Tailwind Grid:**
    1. Cari kontainer pembungkus (elemen `<div>` dengan kelas `grid`) dari keempat kartu tersebut.
    2. Ubah struktur kolomnya menjadi sangat responsif (bertahap): 
       `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`
    3. **Penjelasan Logika:** 
       - `grid-cols-1`: (Mobile) Kartu berjejer ke bawah.
       - `sm:grid-cols-2`: (Tablet Portrait/Landscape & Layar Laptop Standar seperti MacBook) Kartu menjadi 2 baris x 2 kolom sehingga memiliki ruang bernapas yang luas.
       - `xl:grid-cols-4`: (Hanya pada layar lebar / eksternal monitor > 1280px) Keempat kartu baru akan berjejer menyamping.

### B. Proteksi Teks (Anti-Overlapping)
*   **Target File:** Komponen Kartu Ringkasan Bisnis.
*   **Instruksi Tailwind Typography:**
    1. Temukan elemen HTML yang menampilkan teks nominal angka besar (seperti `Rp 158.880` atau `-Rp 1.951.120`).
    2. Tambahkan kelas `truncate` atau `whitespace-nowrap` pada elemen tersebut.
    3. Ini memastikan jika angka terlalu panjang, sistem tidak akan pernah mematahkannya ke baris baru yang menyebabkan *overlap*. Jika ada spasi di antara tanda minus dan angka, hapus spasi tersebut saat *rendering* (contoh format ideal: `-Rp1.951.120`).

Silakan eksekusi penyesuaian kelas Tailwind ini agar antarmuka terlihat mahal dan *flawless* saat didemonstrasikan di perangkat Tablet/Laptop klien!
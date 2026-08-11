# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.21
**Fokus:** Modal UI Compacting (Grid Layout) & Full-Scale QRIS Image

## 1. Analisis Bug UX & Tata Letak
*   **Oversized Modal Height:** Modal konfirmasi pembayaran terlalu panjang secara vertikal (*elongated*). Penumpukan elemen Info Bank dan QRIS secara vertikal membuang banyak ruang dan tidak mencerminkan desain *Pro SaaS*.
*   **Constrained QRIS Image:** Gambar QRIS tidak tampil penuh (*full*) karena terjebak dalam kontainer *fixed size* dengan bingkai putus-putus yang tidak perlu.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada komponen `CheckoutModal`. DILARANG memberikan *output* kode mentah.

### A. Kompaksi Layout Modal (2-Column Grid)
*   **Target File:** Komponen `CheckoutModal` (di dalam `SubscriptionClient.tsx`).
*   **Instruksi Tailwind:**
    1. Kurangi *padding* vertikal pada bagian atas (Rincian Tagihan). Ubah dari *padding* besar menjadi lebih ringkas (misal: `py-3` atau `py-4`).
    2. **Ubah struktur "Instruksi Pembayaran Manual":** Bungkus bagian Detail Rekening (Seabank) dan bagian QRIS ke dalam satu *Grid Container* 2 kolom agar saling bersebelahan:
       `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">`
       - *Kolom Kiri:* Kotak detail Rekening Seabank.
       - *Kolom Kanan:* Kotak QRIS.
    3. Hilangkan garis putus-putus (*dashed border*) pada kontainer QRIS agar terlihat lebih bersih.

### B. Full-Scale QRIS Image
*   **Instruksi Rendering Gambar QRIS:**
    1. Hapus kelas `w-48 h-48` pada tag `<img>` QRIS.
    2. Ganti dengan kelas yang membuatnya mengisi kontainer secara penuh namun tetap proporsional: `w-full h-auto max-w-[220px] mx-auto object-contain rounded-md shadow-sm`.
    3. Pastikan gambar QRIS menempel penuh ke batas kotaknya tanpa *padding* internal yang berlebihan.

### C. Refinement Tombol
*   **Instruksi:** Pastikan tombol "Kirim Bukti via WhatsApp" tidak terlalu jauh jaraknya dari konten di atasnya (`mt-4` atau `mt-6` sudah cukup).

Silakan eksekusi perombakan layout Modal ini sekarang. Pastikan modal tidak lagi memanjang ke bawah, melainkan padat, proporsional, dan QRIS terlihat jelas (Full Size)!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.71
**Fokus:** Optimasi Kontras Warna Badge Indikator Keranjang (UI/UX)

## 1. Analisis Masalah
Berdasarkan tinjauan visual, *badge* indikator kuantitas di sebelah teks judul keranjang saat ini menggunakan warna biru yang terlalu senada/membaur (*blend in*) dengan warna *branding* utama dan elemen teks lainnya. Hal ini membuat *badge* kurang mendapatkan sorotan mata (*attention*). Diperlukan warna kontras tinggi (seperti standar notifikasi iOS/Android) agar kasir menyadarinya dalam hitungan milidetik.

## 2. Instruksi Eksekusi (Frontend Styling Fix)
**Target File:** Komponen *Header Sidebar* Keranjang (Global).

**Tugas Anda (KERJAKAN TANPA MEMBERIKAN KODE KEPADA SAYA):**

1. **Ubah Class Tailwind pada Badge:**
   - Hapus *class background* biru lama (misal: `bg-blue-500` atau `bg-primary`).
   - Ganti menggunakan warna *Solid High-Contrast*. Rekomendasi wajib: Merah Terang (`bg-red-500` / `bg-rose-500`) ATAU Oranye Terang (`bg-orange-500`).
   - Pastikan teks di dalamnya menggunakan warna putih solid (`text-white`) dan ditebalkan (`font-bold`).
   - Jika *badge* belum bulat sempurna, tambahkan `rounded-full` dan *padding* yang pas agar angkanya berada di tengah presisi (misal: `px-2 py-0.5 text-xs`).

2. **Validasi Estetika:**
   - Pastikan warna baru ini membuat angka keranjang "melompat" keluar secara visual dibandingkan teks abu-abu/hitam di sekitarnya.

Silakan ganti warna *badge* ini ke warna merah/oranye notifikasi standar sekarang juga!
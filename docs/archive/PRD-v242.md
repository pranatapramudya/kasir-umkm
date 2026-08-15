# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.42
**Fokus:** Hard-Lock (Disable) Dropdown Filter Waktu Khusus Karyawan

## 1. Objektif
Menutup celah kebocoran data (Data Leakage) di mana Karyawan masih bisa mengubah filter waktu di Dashboard (mengakses data "Bulan Ini" atau "Tahun Ini"). Filter waktu harus di-disable/di-lock sepenuhnya saat diakses oleh role Karyawan.

## 2. Eksekusi Perbaikan (UI/UX Security)
**Target File:** Komponen Dashboard Analitik (seperti `app/admin/dashboard/page.tsx` atau komponen filter `DateRangePicker` yang bersangkutan).
**Instruksi Eksekusi:**

1. **Injeksi Properti Disable:**
   - Cari elemen UI yang me-render tombol dropdown tanggal (komponen `<Select>`, `<Dropdown>`, atau `<button>` yang memicu menu seperti di gambar `image_7af63f.png`).
   - Tambahkan properti/atribut `disabled={!isOwner}` (atau berdasarkan state validasi role Karyawan yang Anda miliki, misalnya `disabled={role === 'CASHIER'}`).

2. **Visual Feedback (Opsional tapi penting):**
   - JIKA elemen tersebut di-disable (karena user adalah Karyawan), pastikan class Tailwind-nya diubah agar terlihat tidak bisa diklik (misalnya menambahkan `opacity-50 cursor-not-allowed bg-gray-100`).
   - Ini memberikan tanda visual yang jelas bagi Karyawan bahwa mereka tidak diizinkan mengubah filter tersebut.

3. **Konsistensi Global:**
   - Pastikan penguncian ini berlaku untuk Dashboard Karyawan di **SEMUA 4 kategori bisnis** (F&B, Retail, Jasa, Rental).
   - Pastikan juga Owner TETAP BISA mengklik dan mengubah dropdown tersebut seperti biasa.

Silakan eksekusi hard-lock ini sekarang juga. Pastikan Karyawan 100% terjebak di tampilan "Hari Ini".
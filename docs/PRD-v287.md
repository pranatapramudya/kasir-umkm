# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.87
**Fokus:** UI Cleanup - Penghapusan Placeholder Form Data Sewa

## 1. Analisis Masalah (Clean UI)
Pada modal "Lengkapi Data Sewa" (Modul Kasir Rental), input form saat ini memiliki teks *placeholder* yang terlalu panjang (misal: "contoh: Budi Santoso", "contoh: Bandara, Bali..."). Hal ini membuat *User Interface* terlihat padat dan kurang elegan. Klien menginginkan desain yang lebih bersih (*clean/minimalist*) dengan mengosongkan area dalam form.

## 2. Instruksi Eksekusi (Frontend Form Component)
**Target File:** Komponen form / modal "Lengkapi Data Sewa" (biasanya berada di dalam `app/admin/rental-pos/page.tsx` atau file komponen modal terkait).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Hapus Atribut Placeholder:**
1. Temukan elemen `<input>` untuk kolom-kolom berikut:
   - Nama Supir
   - Plat Nomor
   - Tujuan (opsional)
   - Jaminan Diserahkan
2. Hapus seluruh isi dari atribut `placeholder` pada masing-masing input tersebut (ubah menjadi string kosong `placeholder=""` atau hapus atributnya sama sekali).

**B. Pertahankan Panduan Footer:**
1. Jangan hapus teks panduan berukuran kecil yang berada di bagian paling bawah form ("* Jaminan wajib diisi. Contoh: KTP, KK, atau kendaraan milik penyewa."). Teks ini sudah lebih dari cukup sebagai panduan pengguna tanpa harus mengotori area dalam kotak input.

Silakan bersihkan *placeholder* form ini sekarang juga dan langsung *push* perbaikannya! Lapor jika form sudah tampil polos dan elegan.
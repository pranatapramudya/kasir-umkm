# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.55
**Fokus:** Pencegahan Double-Booking (Filter Status Meja di Dropdown Kasir)

## 1. Analisis Masalah
Ditemukan *bug* UX/logika pada dropdown pemilihan "Nomor Meja" di halaman POS Kasir. Meja yang berstatus "Terisi" di Manajemen Meja masih dapat dipilih secara bebas oleh kasir untuk transaksi baru. Hal ini berpotensi memicu *double-booking* dan pencampuran tagihan antar pelanggan yang berbeda.

## 2. Instruksi Eksekusi (Frontend & Cart Logic Fix)
**Target File:** Komponen form keranjang / *checkout* di halaman POS Kasir (misal: `app/page-client.tsx`).

1. **Modifikasi Rendering Dropdown Meja:**
   - Evaluasi array data meja sebelum di- *render* ke dalam elemen `<select>` (atau UI Dropdown kustom Anda).
   - JIKA status meja adalah `Terisi` (sesuaikan dengan nilai *enum* atau *string* di database, misalnya `'OCCUPIED'` atau `'TERISI'`):
     - Tambahkan atribut `disabled` pada elemen `<option>` tersebut.
     - Ubah teks labelnya agar kasir tahu alasannya. *Contoh Output:* `Meja 1 (Kapasitas: 5) - TERISI`.
   - JIKA status meja adalah `Tersedia`:
     - Render `<option>` secara normal dan dapat dipilih.

2. **Perilaku Reset & Validasi:**
   - Pastikan saat komponen POS Kasir di- *mount* atau di- *refresh*, *state* dropdown tidak secara *default* memilih meja indeks pertama jika meja tersebut kebetulan sedang "Terisi". Paksa dropdown menampilkan *placeholder* (misal: "Pilih Meja...") jika belum ada yang dipilih.

Silakan perbaiki logika *rendering* opsi meja ini sekarang juga untuk mengamankan operasional restoran dari salah tagih!
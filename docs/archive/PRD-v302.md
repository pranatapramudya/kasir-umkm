# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.02
**Fokus:** Bug Fix - Sticky Header Kalender Mengambang (Layout Isolation)

## 1. Analisis Masalah
Klien melaporkan bahwa baris *header* nama hari (Sen, Sel, Rab...) pada Kalender Sewa masih "mengambang" secara tidak wajar saat di-*scroll*. Ini terjadi karena konflik properti `sticky top-0` dengan *layout global* (seperti *global navbar* yang tumpang tindih) atau tidak adanya batas *scroll container* yang jelas pada komponen pembungkus kalender.

## 2. Instruksi Eksekusi (Isolasi Scroll Container & CSS Sticky)
**Target File:** Komponen Grid Kalender di `app/admin/rental-calendar/page.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Buat Inner Scroll Container (Isolasi Kalender):**
1. Cari kontainer utama yang membungkus KEDUA elemen ini: *Header* Nama Hari & Grid Tanggal Kalender.
2. JANGAN biarkan kalender mengandalkan *scroll* halaman utama. Berikan kontainer tersebut properti *scroll* internal dengan membatas tingginya.
3. Tambahkan *class* ini pada kontainer tersebut: `max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg` (Anda bisa menyesuaikan `60vh` atau menggunakan `calc(100vh - 350px)` agar proporsional dengan sisa layar dan area Agenda di bawahnya).

**B. Kunci Mutlak Sticky Header:**
1. Pada elemen *row* (baris) yang merender Nama Hari, pastikan *class* ini terpasang tanpa terganggu: `sticky top-0 z-30 bg-white shadow-sm`.
2. Hapus *margin* atas (`mt-X`) pada grid tanggal di bawahnya jika hal itu menyebabkan jarak bolong/ngambang antara nama hari dan tanggal saat di-*scroll*.

**C. Verifikasi Z-Index & Background:**
- Pastikan background pada *header* hari benar-benar solid (`bg-white` atau warna yang sesuai) agar angka tanggal tidak tembus pandang (*overlapping*) saat menggulung ke atas melewati *header*.

Silakan rombak kontainer kalender ini menjadi komponen *scroll* mandiri! Lapor jika header hari sudah menempel sempurna tanpa bocor!
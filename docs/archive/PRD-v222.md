# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.22
**Fokus:** Bugfix Mobile Overflow pada Modal Pembayaran/Checkout

## 1. Objektif
Memperbaiki tata letak (*layout*) pada antarmuka pop-up/modal pembayaran agar dapat digulir (*scrollable*) di perangkat seluler. Hal ini untuk mencegah terpotongnya informasi QRIS dan tombol aksi di bagian bawah layar.

## 2. Bugfix: Scrollable Modal/Sheet Content
**Target File:** Komponen yang merender UI Pembayaran (misal: `components/CheckoutModal.tsx`, `PaymentDialog.tsx`, atau file serupa yang menampilkan instruksi Seabank & QRIS).
**Instruksi:**
1. **Cari Container Utama:** Temukan elemen `<div>` utama yang membungkus seluruh konten di dalam Modal/Dialog tersebut.
2. **Injeksi Class Tailwind:** Tambahkan *class* berikut pada *container* tersebut:
   - `max-h-[85vh]` (atau `max-h-[90dvh]`) agar tinggi maksimal modal tidak melebihi layar HP.
   - `overflow-y-auto` agar konten yang melebihi batas dapat di-*scroll* secara vertikal.
   - `overscroll-contain` (opsional) untuk mencegah halaman di belakang modal ikut ter-*scroll*.
3. **Bottom Padding (Ruang Napas):** Tambahkan `pb-24` atau `pb-safe` di akhir *container* konten agar pengguna bisa men-*scroll* hingga benar-benar mentok ke bawah, memastikan tombol "Konfirmasi / Kirim Bukti" tidak tertutup oleh tombol navigasi HP bawaan.
4. **Optimasi Gambar QRIS:** Pastikan elemen `<img src="/qris.jpeg" />` memiliki *class* seperti `max-h-80 object-contain mx-auto` agar gambar tidak merender terlalu raksasa secara bawaan di layar HP kecil.

Silakan eksekusi perbaikan UI Tailwind ini. Pastikan tidak ada elemen vital yang tersembunyi tanpa bisa di-scroll pada viewport mobile (lebar < 768px)!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.69
**Fokus:** Optimasi UX Keranjang: Sticky Checkout Form & Scrollable Cart List (Global Fix)

## 1. Analisis Masalah (Human Error Prevention)
Saat kasir memasukkan banyak item ke dalam keranjang, *list* item tersebut mendesak form pembayaran (Nama Pelanggan, Metode Pembayaran, Uang Diterima, Tombol Bayar) hingga keluar dari batas pandang layar bawah. Kasir harus melakukan *scrolling* naik-turun yang berpotensi tinggi memicu *human error* saat memasukkan nominal pembayaran. Hal ini melanggar standar UX aplikasi Point of Sale (POS).

## 2. Instruksi Eksekusi (Frontend Layouting & UX)
**Target File:** Komponen Sidebar Keranjang Kanan di SEMUA Halaman Kasir (Retail, F&B, Jasa, Rental).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN KODE KEPADA SAYA):**

**A. Pemisahan Area (Scrollable vs Sticky):**
1. Ubah *wrapper* utama dari Sidebar Keranjang Kanan menjadi *flexbox* vertikal tinggi penuh (`flex flex-col h-full` atau setara tinggi layar `h-[calc(100vh-rm)]`).
2. **Area Atas (Daftar Item Keranjang):** 
   - Bungkus *list* item yang di-*map* dari keranjang ke dalam satu div terpisah.
   - Berikan class `flex-1 overflow-y-auto`. Ini akan membuat area daftar barang menyerap sisa ruang atas dan *HANYA* area ini yang akan memiliki *scrollbar* vertikal jika item terlalu banyak.
3. **Area Bawah (Form Pembayaran & Action):**
   - Bungkus form *checkout* (Waktu Layanan, Nama, Metode, Input Uang, Subtotal, Kembalian, dan Tombol BAYAR) ke dalam satu *div* di bagian paling bawah.
   - Berikan class `shrink-0 p-4 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]` (atau gaya serupa) agar area ini mengunci/menempel di bawah layar dan secara visual terpisah dari daftar barang yang di-*scroll*.

**B. Validasi Keselamatan (Tombol Bayar):**
- Untuk mencegah salah pencet, pastikan tombol "BAYAR SEKARANG" dalam keadaan `disabled` (tidak bisa diklik dan berwarna pudar) JIKA:
  1. Keranjang masih kosong.
  2. ATAU Uang Diterima < Total Belanja (khusus untuk metode Tunai).
  3. ATAU (Khusus Jasa) Karyawan belum dipilih pada *dropdown* item.

Silakan refaktor struktur keranjang ini secara global. Pastikan form pembayaran mengunci dengan solid di bawah, sementara *list* belanjaan bisa di-*scroll* dengan mulus di atasnya! Lapor jika sudah di-*push*!
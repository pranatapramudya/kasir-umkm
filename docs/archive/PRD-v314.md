# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.14
**Fokus:** Bug Fix API Tarik Antrean & Penyederhanaan Workflow (Shortcut) Kasir Jasa

## 1. Analisis Masalah
1. **Bug API Kosong:** Fitur "Tarik Antrean Online" di Kasir Jasa gagal memuat data jadwal yang sudah berstatus `COMPLETED` (Antrean Aktif). Ini disebabkan *query* API masih mencari status `IN_PROGRESS` yang mana status tersebut sudah dihapus/tidak berlaku untuk bisnis Jasa.
2. **Workflow Terlalu Panjang:** Siklus 3 tahap (Approve di Inbox -> Cek Jadwal -> Tarik di Kasir) terlalu panjang untuk operasional bisnis Jasa yang cepat (seperti Barbershop). Diperlukan *shortcut* di mana Kasir bisa langsung menarik pesanan yang baru masuk tanpa harus di-*approve* melalui Inbox terlebih dahulu.

## 2. Instruksi Eksekusi (API Query & POS Checkout Logic)
**Target File:** Endpoint API untuk Tarik Antrean (kemungkinan `app/api/booking/today/route.ts`) dan logika Checkout di komponen Kasir Jasa (`app/page-client.tsx` atau `actions.ts`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan API Fetch "Tarik Antrean" (Bypass Inbox):**
1. Buka API endpoint yang bertugas mem-fetch data untuk modal "Tarik Antrean Online".
2. Ubah filter kondisional prisma pada `where` clause:
   - Jika *request* datang dari **Kasir Jasa**: Fetch data *Booking* untuk hari ini yang berstatus **`PENDING`** ATAU **`COMPLETED`**.
   - (Sebagai catatan: Jika request dari Kasir Rental, fetch `COMPLETED` atau `IN_PROGRESS`).
3. Dengan begini, pesanan publik yang baru masuk (`PENDING`) akan langsung muncul di meja Kasir Jasa tanpa perlu di-approve admin dari menu Pesanan Online.

**B. Logika Checkout "Sapu Bersih" (Auto-Finish):**
1. Saat admin Kasir Jasa menarik data (`PENDING` maupun `COMPLETED`) ke keranjang dan menekan **"Bayar Sekarang"** (Checkout).
2. Pastikan `prisma.$transaction` memperbarui status *Booking* tersebut langsung menjadi **`FINISHED`** (Selesai).
3. Ini menciptakan alur potong kompas (Shortcut): Pesanan masuk -> Tarik ke Kasir -> Bayar -> Status otomatis Selesai di semua tabel (Transaksi & Booking).

Silakan perbaiki *query filter* pada API dan bangun alur potong kompas ini! Lapor jika pesanan "Menunggu" sudah bisa ditarik dan dibayar langsung dari Kasir Jasa!
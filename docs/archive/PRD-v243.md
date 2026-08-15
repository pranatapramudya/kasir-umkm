# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.43
**Fokus:** Penyesuaian Alur UX (Real-World) Khusus Kasir Kategori Jasa & Rental

## 1. Objektif
Merombak antarmuka dan alur (flow) transaksi pada halaman Kasir POS agar selaras dengan skenario dunia nyata untuk Tenant kategori `Jasa & Servis` dan `Rental & Travel`. Mengurangi kebingungan pengguna awam dengan menyesuaikan terminologi dan menambahkan form esensial (Waktu & DP).

## 2. Analisis Kebutuhan Lapangan (UX Gap)
Saat ini, flow kasir kemungkinan masih mengadopsi gaya Retail (Pilih Produk ➔ Keranjang ➔ Bayar Lunas). 
- **Bisnis Jasa:** Butuh mencatat jam reservasi/layanan dan nama staf (opsional). Istilah "Produk" harus diganti "Layanan".
- **Bisnis Rental:** Butuh mencatat Tanggal Mulai - Selesai, durasi sewa, Uang Muka (DP), dan Catatan Jaminan (KTP/STNK). Istilah "Produk" harus diganti "Armada/Unit".

## 3. Eksekusi Perbaikan (Frontend & Terminologi)
**Target File:** Komponen Kasir POS (`app/admin/pos/page.tsx` atau komponen keranjang belanja `Cart.tsx`).
**Instruksi Eksekusi:**

1. **Dinamisasi Terminologi UI (Microcopy):**
   - JIKA `tenantCategory === 'JASA'`: 
     - Ubah judul daftar barang dari "Produk" menjadi "Daftar Layanan".
     - Ubah judul "Keranjang" menjadi "Detail Layanan".
   - JIKA `tenantCategory === 'RENTAL'`:
     - Ubah judul "Produk" menjadi "Daftar Armada / Unit".
     - Ubah judul "Keranjang" menjadi "Detail Sewa".

2. **Injeksi Form Waktu & Keterangan (Sebelum Checkout):**
   - Di dalam komponen Keranjang/Detail Transaksi, tambahkan form input kondisional (hanya muncul jika Jasa/Rental):
     - **Untuk Jasa:** Tambahkan input `<input type="datetime-local">` berlabel "Waktu Layanan".
     - **Untuk Rental:** Tambahkan input `<DateRangePicker>` berlabel "Tanggal Sewa & Kembali", dan `<input type="text">` berlabel "Jaminan Diserahkan (Misal: KTP)".

3. **Sistem Pembayaran DP (Down Payment):**
   - Di bagian total pembayaran, tambahkan toggle/checkbox "Bayar Uang Muka (DP)".
   - Jika dicentang, berikan kolom input nominal DP yang dibayarkan saat ini. Sistem harus otomatis menghitung dan mencatat "Sisa Tagihan" (Kekurangan).

4. **Penyesuaian Struk / Nota:**
   - Pastikan variabel Waktu, Jaminan, dan Sisa Tagihan (jika ada DP) ikut tercetak pada nota agar bukti transaksi sah di mata pelanggan.

Silakan eksekusi penyesuaian alur ini agar aplikasi Kasir UMKM dapat langsung dipahami dan digunakan oleh pelaku usaha Rental dan Jasa di lapangan tanpa perlu panduan tambahan.
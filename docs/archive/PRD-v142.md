# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.42
**Fokus:** F&B Final Polish (Catatan Pesanan per Item & Tiket Dapur)

## 1. Analisis Kebutuhan Operasional F&B
Berdasarkan audit operasional standar F&B, aplikasi belum mendukung pencatatan kustomisasi pesanan ("Less Sugar", "Pedas") dan pemisahan informasi untuk pihak Dapur/Bar. Ini sangat krusial untuk mencegah kesalahan penyajian.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pembaruan pada halaman Kasir Resto dan komponen Struk. Pastikan perubahan ini HANYA aktif jika `kategoriUsaha === 'F&B'`.

### A. Implementasi "Catatan Pesanan" pada Keranjang (Cart)
*   **Target File:** `app/admin/kasir-resto/page-client.tsx` (atau komponen Keranjang/Cart).
*   **Instruksi:**
    1. Pada setiap *item* (baris menu) yang sudah masuk ke dalam daftar Keranjang, tambahkan satu tombol kecil berkode *icon* pensil atau teks "+ Catatan".
    2. Saat diklik, munculkan *input text* kecil (atau modal mini) di bawah item tersebut yang memungkinkan kasir mengetik catatan khusus (Contoh: "Tanpa sayur, pedas").
    3. Simpan data catatan ini di dalam *state* array keranjang (misal: `cartItem.note`).
    4. Pastikan payload POST transaksi ke database ikut menyertakan `note` ini ke dalam tabel detail transaksi (sesuaikan skema Prisma jika perlu).

### B. Pembuatan Layout "Tiket Dapur" (Kitchen Ticket)
*   **Target File:** Komponen Cetak Struk / Modal Pembayaran Sukses.
*   **Instruksi:**
    1. Pada modal "Transaksi Berhasil", selain tombol "Cetak Struk (Customer)", tambahkan satu tombol baru: **"Cetak Tiket Dapur"**.
    2. Buat komponen *print layout* khusus untuk Tiket Dapur dengan aturan:
       - **TIDAK MENCETAK HARGA (Total, Subtotal, dll).**
       - Ukuran teks (Font) untuk Nama Menu, **Nomor Meja**, dan **Catatan Pesanan (Note)** diperbesar agar mudah dibaca koki.
       - Header bukan nama toko, melainkan tulisan tebal: **"PESANAN DAPUR - MEJA [X]"**.

Silakan eksekusi fitur Catatan Item dan Tiket Dapur ini untuk menyempurnakan alur F&B!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.18
**Fokus:** Checkout Modal UI & Manual Payment Gateway Flow

## 1. Analisis Bug Flow Pembayaran
*   **Masalah Fatal:** Saat ini, menekan tombol pada kartu langganan langsung memicu API perpanjangan secara instan tanpa konfirmasi dan tanpa proses pembayaran (Bypass Payment).
*   **Kebutuhan Bisnis:** Diperlukan sebuah "gerbang" berupa *Pop-up Modal* modern yang menahan proses tersebut, menampilkan instruksi pembayaran manual (Bank Transfer/QRIS), dan mencegah akun aktif sebelum ada konfirmasi pembayaran.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada komponen klien. DILARANG memberikan *output* kode mentah.

### A. Hentikan Auto-Trigger API
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx`
*   **Instruksi:** Hapus pemanggilan langsung ke rute `/api/subscription/extend` dari tombol kartu paket. Tombol pada kartu sekarang HANYA berfungsi untuk membuka stat `isCheckoutModalOpen` dan menyimpan data `selectedPackage` (harga dan durasi).

### B. Pembuatan Komponen Checkout Modal
*   **Target File:** `SubscriptionClient.tsx` (atau buat sub-komponen baru `CheckoutModal.tsx`).
*   **Instruksi UI/UX & Data:**
    1. Buat modal dialog modern (dengan latar belakang transparan/blur dan tombol 'X' untuk menutup).
    2. **Header Modal:** "Konfirmasi Pembayaran".
    3. **Rincian Tagihan:** Tampilkan nama paket yang dipilih dan Total Tagihan (misal: Rp 594.000).
    4. **Instruksi Pembayaran Manual:** Tampilkan kotak informasi rekening dengan teks yang bisa di-*copy*:
       - **Bank:** Seabank
       - **No. Rekening:** 901331745328
       - **Atas Nama:** Pranata Pramudya
       - *(Sediakan juga placeholder teks/ikon untuk QRIS DANA Bisnis).*
    5. **Call to Action (Tombol Bawah):** 
       Buat dua tombol:
       - Tombol Utama (Warna menonjol): **"Kirim Bukti via WhatsApp"**. (Buat logika *href* ke `wa.me/NOMOR_ANDA` yang berisi pesan pre-filled *URL encoded* "Halo admin, saya ingin konfirmasi pembayaran LumeStack...").
       - Tombol Sekunder/Dev (Hanya untuk keperluan *Testing* saat ini): **"Simulasikan Pembayaran Berhasil"** (Tombol inilah yang sementara akan memanggil API `/api/subscription/extend` agar admin bisa melihat efek transisi UI).

Silakan eksekusi pembuatan Checkout Modal ini sekarang. Pastikan tidak ada lagi paket yang aktif otomatis hanya dengan satu kali klik dari katalog!
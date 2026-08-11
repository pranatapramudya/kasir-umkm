# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.19
**Fokus:** Logika Tanggal Berlangganan, Conditional UI (Free vs Paid), WA Integration, & Penambahan Logo

## 1. Analisis Bug & Kebutuhan
*   **Logic Error (Perhitungan Tanggal):** Saat perpanjangan, sistem tidak boleh sekadar menambahkan hari ke sisa waktu yang ada jika pengguna mengganti paket. Logika yang benar: **Masa aktif baru dihitung mutlak mulai dari Hari Ini (Current Date) + Durasi Paket Baru**.
*   **UI Error (Paket Gratis):** Modal pembayaran menampilkan instruksi transfer dan QRIS untuk paket dengan harga Rp 0.
*   **Keamanan & Integrasi:** Tombol "Simulasikan Pembayaran Berhasil" harus dihapus permanen. Pengguna murni diarahkan ke WhatsApp Bisnis dengan nomor yang sudah ditentukan.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada kode. DILARANG memberikan *output* kode mentah.

### A. Perbaikan Logika API (Backend)
*   **Target File:** `app/api/subscription/extend/route.ts` (atau fungsi *backend* yang menangani ekstensi).
*   **Instruksi:** Ubah logika kalkulasi `subscriptionEndsAt`. Jangan gunakan `existingDate + days`. Gunakan logika: `const newEndDate = new Date(); newEndDate.setDate(newEndDate.getDate() + durasiHariPaket);`. Jadi perhitungan selalu di- *reset* mulai dari hari H transaksi divalidasi.

### B. Conditional Rendering UI Modal
*   **Target File:** Komponen `CheckoutModal` (atau bagian di dalam `SubscriptionClient.tsx`).
*   **Instruksi:** 
    1. Berikan pengecekan harga (`if price === 0`).
    2. **Jika Rp 0 (Free):** SEMBUNYIKAN kotak "Instruksi Pembayaran Manual" (Bank dan QRIS). Ubah teks tombol menjadi `"Klaim Paket Gratis"`.
    3. **Jika Berbayar (Pro):** Tampilkan kotak Seabank dan QRIS.

### C. Integrasi WhatsApp & Penghapusan Tombol Bypass
*   **Instruksi:**
    1. **HAPUS** tombol "Simulasikan Pembayaran Berhasil" beserta fungsi `onClick`-nya.
    2. Ubah *link* tujuan pada tombol "Kirim Bukti via WhatsApp" menjadi: 
       `https://wa.me/6285723256427?text=Halo%20Admin%20PJTECH%2C%20saya%20ingin%20konfirmasi%20pembayaran%20paket%20...` (Sisipkan variabel nama paket yang dipilih ke dalam teks *URL encoded*).

### D. Penambahan Aset Logo (Seabank & QRIS)
*   **Instruksi UI:**
    1. Pada kotak informasi Seabank, tambahkan tag `<img src="/seabank-logo.png" alt="Seabank" />` (buat desain ukurannya kecil dan rapi di sebelah teks "Bank").
    2. Pada kotak QRIS, ganti *placeholder* `[ QRIS ]` dengan `<img src="/qris-dana.png" alt="QRIS DANA" className="w-48 h-48 mx-auto" />`. 
    3. *(Catatan untuk User: Anda harus meletakkan gambar logo asli dengan nama `seabank-logo.png` dan `qris-dana.png` ke dalam folder `/public` di root project Anda agar gambar dapat dirender oleh kode ini).*

Silakan eksekusi seluruh perbaikan ini sekarang. Pastikan modal menjadi cerdas dalam membedakan paket gratis dan berbayar!
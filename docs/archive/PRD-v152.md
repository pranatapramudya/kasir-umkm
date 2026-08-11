# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.52
**Fokus:** Penyesuaian Dinamis Sidebar Khusus Kategori "Jasa / Servis"

## 1. Analisis Kebutuhan Operasional Jasa
Bisnis Jasa (Barbershop, Salon, Cuci Mobil) tidak mengandalkan inventaris stok atau manajemen meja, melainkan pada **Layanan** dan **Kinerja Karyawan (Sistem Komisi)**. Sidebar harus merefleksikan identitas operasional ini agar relevan bagi pengguna (Owner/Admin).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan modifikasi pada komponen Sidebar menggunakan *conditional rendering* berdasarkan `kategoriUsaha === 'Jasa'`. DILARANG memberikan *output* kode mentah.

### A. Penyesuaian Nama Menu Kasir
*   **Target File:** Komponen Sidebar Utama (`components/Sidebar.tsx` atau sejenisnya).
*   **Instruksi:** 
    1. Cari item menu "Kasir POS" di bawah sub-kategori `MENU UTAMA`.
    2. Buat kondisi: Jika `kategoriUsaha === 'Jasa'`, ubah label teks menu tersebut menjadi **"Kasir Jasa"**.
    3. (Untuk referensi silang: pastikan URL tujuannya, misalnya `/admin/kasir-jasa`, disiapkan untuk membedakan komponen kasir Retail dan Jasa).

### B. Injeksi Menu "Rekap Komisi"
*   **Target File:** Komponen Sidebar Utama.
*   **Instruksi:**
    1. Pergi ke bagian sub-kategori `SISTEM & LAPORAN` (tempat menu Analitik, Cek Langganan, dll berada).
    2. Tambahkan satu item menu baru bernama **"Rekap Komisi"**.
    3. Gunakan ikon yang relevan (misal: ikon dompet/wallet, *percent*, atau *badge* dari Lucide Icons).
    4. Menu **"Rekap Komisi"** ini HANYA BOLEH MUNCUL jika pengguna sedang menggunakan profil/paket dengan `kategoriUsaha === 'Jasa'`. Sembunyikan dari model Retail dan F&B.

### C. Validasi Visibilitas
*   Pastikan menu `Manajemen Meja` tetap TERSEMBUNYI secara global saat mode Jasa aktif (karena ini eksklusif milik F&B).
*   Pastikan label `Layanan` sudah menggantikan `Produk` secara konsisten.

Silakan eksekusi penyesuaian sidebar ini sebagai pondasi awal fitur Jasa!
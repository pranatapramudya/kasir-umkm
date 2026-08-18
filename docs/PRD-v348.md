# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.48
**Fokus:** Copywriting Update - Penambahan SOP "Atur Informasi Pembayaran (DP)" Khusus Rental

## 1. Analisis Masalah
Berdasarkan tinjauan pada UI `BukuPanduanModal.tsx` khusus untuk entitas bisnis **Rental & Travel**, terdapat langkah krusial yang terlewat. Karena bisnis Rental mewajibkan pelanggan mentransfer DP 50% untuk mengunci jadwal, pemilik toko (Tenant) harus terlebih dahulu mengatur nomor rekening/e-wallet mereka. 
Jika SOP mengarahkan mereka untuk langsung membagikan *link booking* tanpa mengatur informasi pembayaran, alur transaksi akan terputus di sisi pelanggan.

## 2. Instruksi Eksekusi (Pembaruan Array SOP Rental)
**Target File:** Komponen `BukuPanduanModal.tsx` (Pada blok *conditional rendering* khusus RENTAL).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Sisipkan Langkah Baru (Langkah 3):**
1. Buka *array* atau blok kode yang me- *render* daftar langkah (Steps) untuk `businessType === 'RENTAL'`.
2. Tepat setelah Langkah 2 ("Atur Harga Sewa"), sisipkan langkah baru sebagai **Langkah 3**.
3. **Judul Langkah 3:** **Atur Rekening Pembayaran (DP 50%)**
4. **Deskripsi Langkah 3:** Buka menu **Informasi Toko**, lalu lengkapi data rekening Bank / E-Wallet Anda. Ini wajib diisi agar pelanggan tahu ke mana harus mentransfer DP 50% saat melakukan reservasi online.

**B. Perbarui Redaksi "Bagikan Link Katalog" (Menjadi Langkah 4):**
1. Geser langkah "Bagikan Link Katalog" menjadi **Langkah 4**.
2. Sesuaikan deskripsinya sedikit agar terasa menyambung dengan langkah sebelumnya: "Di menu yang sama (**Informasi Toko**), salin Link Booking Publik Anda, dan bagikan ke WhatsApp atau bio Instagram pelanggan agar mereka bisa memesan mandiri."

**C. Penyesuaian Urutan:**
1. Pastikan langkah-langkah di bawahnya ikut bergeser urutannya secara otomatis (Tarik Pesanan menjadi langkah 5, Klik Start menjadi langkah 6, dan Finish & Lunas menjadi langkah 7).
2. Pastikan perubahan ini **HANYA** terjadi pada SOP Rental, dan tidak membocorkan instruksi DP 50% ini ke entitas Jasa, FNB, atau Retail.

Silakan perbarui teks panduan ini! Lapor kembali jika SOP Rental kini sudah memiliki 7 langkah dan secara eksplisit menyuruh pengguna mengisi rekening untuk keperluan DP!
# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.57
**Fokus:** UI/UX Improvement - Silent Refresh & Background Revalidation (Menghilangkan Screen Flicker)

## 1. Analisis Masalah
Berdasarkan tinjauan UI pada halaman `Laporan Shift` (dan halaman riwayat/tabel lainnya), saat terjadi *re-fetch* data (akibat Supabase Realtime *mutate*, pergantian *tab*, atau *revalidation* SWR), antarmuka tabel menghilang dan digantikan sepenuhnya oleh *Loading Spinner* besar.
Hal ini menyebabkan *Layout Shift* dan layar berkedip (*flicker*) yang sangat mengganggu UX. Sistem harus menerapkan prinsip *Silent Background Refresh*, di mana data lama tetap ditampilkan saat sistem sedang mengambil data baru di latar belakang.

## 2. Instruksi Eksekusi (Stale-While-Revalidate & Rendering Logic)
**Target File:** Komponen Halaman `Laporan Shift`, `Dashboard`, `Pesanan Online`, dan seluruh komponen yang me- *render* tabel data dengan `SWR` atau *fetching library* lainnya.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ubah Logika Conditional Loading:**
1. Buka komponen yang me- *render* tabel/riwayat transaksi.
2. Periksa logika *conditional rendering* untuk komponen *Loading* Anda. 
3. Jangan gunakan kondisi seperti `if (isLoading || isValidating)` untuk me- *return* komponen *Loading* layar penuh.
4. Tampilkan komponen *Loading* penuh **HANYA** pada kondisi *Initial Load* (yaitu ketika `data` benar-benar `undefined` dan `error` adalah `undefined`).

**B. Pertahankan UI Saat Revalidasi (Silent Refresh):**
1. Jika `data` sudah tersedia di dalam *cache*, pastikan komponen tabel (dan metrik Laporan Shift) **tetap di-render utuh**.
2. Saat aplikasi melakukan *background fetch* atau menerima sinyal *mutate* dari Supabase Realtime, data di layar harus diperbarui secara instan/diam-diam tanpa melakukan *unmount* pada tabel.

**C. Indikator Loading Halus (Opsional/Bila Diperlukan):**
1. Jika Anda ingin memberikan indikasi visual bahwa pembaruan sedang terjadi di latar belakang, gunakan elemen UI yang tidak merusak tata letak.
2. Contoh: Tambahkan *spinner* kecil (*inline*) di samping tombol "Refresh" / "Terapkan", atau turunkan sedikit *opacity* tabel saat status *revalidating* aktif. Jangan mengganti tabel dengan *spinner*.

Silakan perbaiki UX *loading* ini! Lapor kembali jika proses *refresh* data di Laporan Shift (dan seluruh bisnis) sudah berjalan mulus di belakang layar tanpa membuat tabel berkedip-kedip!
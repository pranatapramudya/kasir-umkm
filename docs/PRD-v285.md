# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.85
**Fokus:** Dynamic Affiliate Hardware (Rekomendasi Printer Dinamis)

## 1. Analisis Masalah (Relevansi Produk Affiliate)
Sejalan dengan pembaruan sistem cetak Surat Jalan A4 untuk modul Rental/Travel, halaman "Rekomendasi Hardware" saat ini menampilkan "Printer Thermal Bluetooth 58mm" yang tidak relevan bagi pengusaha rental. Agar tingkat konversi *link affiliate* maksimal dan UX terasa personal, item rekomendasi keras harus dirender secara dinamis menyesuaikan tipe bisnis toko yang sedang aktif.

## 2. Instruksi Eksekusi (Conditional Rendering UI)
**Target File:** `app/admin/hardware/page.tsx` (Komponen halaman Rekomendasi Alat Kasir).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Logika Rekomendasi Dinamis (Conditional Rendering):**
1. Ambil data tipe bisnis pengguna saat ini (`store.category` atau `tenant type`).
2. Modifikasi struktur *Grid Card* agar kartu di posisi tengah (bagian Printer) berubah sesuai tipe bisnis.

**B. Konten Khusus Modul Rental/Travel:**
1. Jika tipe bisnis = `Rental` atau `Travel`, **gantikan** kartu "Printer Thermal 58mm" menjadi printer A4.
2. **Detail Teks Kartu Baru (Printer A4):**
   - **Judul:** Printer Tinta/Dokumen A4
   - **Deskripsi:** "Printer handal untuk mencetak Invoice, Surat Jalan, dan Perjanjian Sewa format A4 secara profesional."
   - **Estimasi Harga:** "Mulai dari Rp 950.000"
   - **Ikon/Gambar:** Gunakan ikon dokumen/printer standar desktop.
   - **Tombol Action:** Beli di Tokopedia & Beli di Shopee (placeholder).

**C. Konten Khusus F&B/Retail/Jasa:**
1. Jika tipe bisnis = `F&B`, `Retail`, atau `Jasa`, biarkan kartu "Printer Thermal Bluetooth 58mm" tampil seperti biasa di layar (seperti pada versi sebelumnya).

Silakan eksekusi halaman *Affiliate* ini agar 100% relevan dengan ekosistem masing-masing pengguna! Lapor jika logika dinamis ini sudah diimplementasikan.
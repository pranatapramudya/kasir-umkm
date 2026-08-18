# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.99
**Fokus:** Dynamic Contextual Copywriting (Form Tambah Layanan Khusus Rental/Travel)

## 1. Analisis Masalah
Formulir "Tambah Layanan Baru" saat ini menggunakan label statis (seperti "Nama Layanan", "Kategori", "Biaya Bahan", dan "Komisi Pekerja"). Istilah-istilah ini sangat generik dan tidak relevan untuk pengguna dengan tipe bisnis Rental atau Travel. Agar *User Experience* (UX) terasa personal dan premium (SaaS Multi-Tenant sejati), label dan *placeholder* pada form harus dirender secara dinamis menyesuaikan tipe bisnis yang sedang aktif.

## 2. Instruksi Eksekusi (Frontend Conditional Rendering)
**Target File:** Komponen Form/Modal untuk Tambah dan Edit Layanan (misalnya `AddServiceModal.tsx`, `ServiceForm.tsx`, atau di dalam `app/admin/services/`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Deteksi Tipe Bisnis:**
1. Ambil state/konteks dari tipe bisnis pengguna saat ini (`store.category` atau `tenant.type`).

**B. Logika Conditional Copywriting (Ternary Operator):**
Gunakan operator kondisional pada label dan placeholder form. Jika tipe bisnis adalah `Rental` atau `Travel`, terapkan perubahan teks berikut:

1. **Input "Nama Layanan":**
   - Label berubah menjadi: **"Nomor Polisi / Nama Armada"**
   - Placeholder: (Kosongkan atau beri contoh "misal: B 1234 ABC - Avanza")

2. **Input "Kategori":**
   - Label berubah menjadi: **"Unit Kendaraan"**
   - Placeholder berubah menjadi: **"contoh: Mini Bus, Big Bus, dll..."**

3. **Input "Biaya Bahan":**
   - Label berubah menjadi: **"Biaya Operasional (Opsional)"**

4. **Input "Komisi Pekerja":**
   - Label berubah menjadi: **"Komisi Driver (Rp)"**
   - Teks panduan di bawah input (*helper text*) diubah menjadi: *"Nominal bagi hasil untuk driver per transaksi."*

**C. Fallback Default:**
- Jika tipe bisnis adalah `F&B`, `Retail`, atau `Jasa`, pastikan label-label tersebut tetap menggunakan teks bawaan yang lama (Nama Layanan, Kategori, Biaya Bahan, Komisi Pekerja).

Silakan implementasikan *Contextual UX* ini menggunakan *ternary operator* murni di sisi *client* tanpa merusak skema validasi *database*! Lapor jika form sudah berhasil "berubah wujud" sesuai tipe bisnis!
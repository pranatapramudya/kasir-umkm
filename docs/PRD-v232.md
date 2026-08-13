# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.32
**Fokus:** Pembaruan Dokumentasi (README.md & folder docs)

## 1. Objektif
Merangkum seluruh pembaruan fitur mayor, perbaikan bug (bugfixes), dan optimasi performa yang telah dilakukan ke dalam dokumentasi proyek. Ini penting untuk menjaga standar kualitas repositori sebagai SaaS premium boilerplate.

## 2. Pembaruan Changelog / Docs
**Target File:** Folder `docs/` (buat file `CHANGELOG.md` jika belum ada, atau update file tracker PRD yang sudah ada).
**Instruksi Eksekusi:**
Catat riwayat penyelesaian berikut pada pembaruan terbaru:
- **Feature:** Implementasi ekosistem "Rental & Travel" (Date Range booking, form armada di POS, dan integrasi cetak struk Bluetooth).
- **Feature:** Pemisahan UI Dual-Role Login (Owner vs Karyawan) pada Landing Page.
- **Feature:** Lokalisasi Bahasa Indonesia (id-ID) untuk seluruh antarmuka Clerk Auth.
- **Feature:** Dinamisasi kolom Laporan Excel berdasarkan kategori bisnis.
- **Optimasi:** Implementasi navigasi instan (Prefetching & Skeleton Loading).
- **Bugfix:** Mengatasi *Foreign Key Constraint* pada *checkout* kasir.
- **Bugfix:** Memperbaiki *Server Components render error* saat penambahan kasir baru.
- **Bugfix:** Memperbaiki *flickering* (data hilang) pada daftar produk Karyawan.
- **Bugfix:** Mencegah *scroll-to-top* pada filter kategori di dashboard Superadmin.
- **Bugfix:** Memperbaiki *invalid Prisma invocation* (findUnique ke findFirst) pada alur Onboarding.

## 3. Pembaruan README.md
**Target File:** `README.md` di root directory.
**Instruksi Eksekusi:**
1. Pastikan deskripsi proyek mencerminkan kemampuan multi-tenant dan multi-kategori bisnis (F&B, Retail, Jasa/Servis, Rental & Travel).
2. Perbarui bagian "Features" untuk menonjolkan fitur-fitur premium terbaru (Dynamic Excel Export, Bluetooth Thermal Printing, Role-based Access, dll).

Silakan tulis dan perbarui file-file dokumentasi tersebut dengan format Markdown yang rapi dan profesional.
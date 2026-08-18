# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.93
**Fokus:** Bug Fix - Dead Navigation Link (Sidebar Menu "Kasir Rental")

## 1. Analisis Masalah
Klien melaporkan bahwa menu "Kasir Rental" pada panel navigasi samping (*Sidebar*) tidak merespons ketika diklik (*unclickable/dead link*). Masalah ini kemungkinan terjadi karena hilangnya atribut `href`, salah penulisan *path routing* (typo), atau adanya *event handler* (seperti `e.preventDefault()`) yang menghalangi eksekusi `next/link` setelah perombakan logika *absolute routing* sebelumnya.

## 2. Instruksi Eksekusi (Sidebar Navigation & Routing)
**Target File:** Komponen navigasi Sidebar (misalnya `Sidebar.tsx`, `SideNav.tsx`, atau konfigurasi menu di `lib/navigation.ts`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Audit Atribut Link Sidebar:**
1. Temukan *array* atau komponen yang me-render daftar menu Sidebar, khususnya untuk *item* "Kasir Rental".
2. Pastikan komponen tersebut menggunakan tag `<Link>` dari `next/link` secara benar.
3. **Krusial:** Periksa atribut `href`. Pastikan nilainya mengarah tepat ke `/admin/rental-pos` (sesuai dengan nama rute yang kita buat untuk Modul Kasir Rental di PRD sebelumnya). 

**B. Hapus Blocker Navigasi (Jika Ada):**
1. Jika ada atribut `onClick` yang menahan navigasi default atau state kondisional yang membuat item tersebut berstatus *disabled* secara tidak sengaja, hapus atau perbaiki logika tersebut.
2. Pastikan tidak ada *typo* pada URL *path* yang menyebabkan 404 atau memicu pengembalian paksa dari *middleware*.

Silakan audit dan perbaiki *link* navigasi Sidebar ini sekarang juga agar modul Kasir Rental bisa diakses kembali! Lapor jika perbaikan *routing* ini sudah di-*push*!
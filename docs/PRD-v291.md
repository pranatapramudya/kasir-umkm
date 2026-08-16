# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.91
**Fokus:** UX Fix - Pembatasan Pop-up PWA Install (Anti-Spam)

## 1. Analisis Masalah
Fitur *PWA Install Prompt* saat ini muncul setiap kali pengguna melakukan navigasi (berpindah menu). Hal ini terjadi karena komponen tidak memiliki *state persistence* (ingatan) ketika pengguna menolak atau menutup pop-up tersebut. Akibatnya, UX menjadi sangat terganggu (*spamming*).

## 2. Instruksi Eksekusi (Frontend State Management & LocalStorage)
**Target File:** Komponen `PwaInstallPrompt` (atau file serupa yang menangani pop-up instalasi).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Implementasi Logika `localStorage` pada Tombol "Nanti Saja":**
1. Modifikasi fungsi yang berjalan ketika pengguna mengklik tombol "Nanti Saja" (atau tombol tutup).
2. Selain menyembunyikan pop-up dari layar, perintahkan sistem untuk menyimpan penanda (*flag*) ke dalam *browser* menggunakan `localStorage`.
3. Contoh format penyimpanan: Set item dengan kunci `pwa_prompt_dismissed` dan nilai `true` (Anda juga bisa menyimpan *timestamp* jika ingin memunculkannya lagi setelah beberapa hari, namun untuk sekarang cukup gunakan *boolean*).

**B. Modifikasi Siklus Hidup Komponen (Component Mount/Effect):**
1. Pada efek *mount* utama (`useEffect` jika menggunakan React), sebelum menjalankan logika kemunculan pop-up atau menangkap event `beforeinstallprompt`, lakukan pengecekan ke `localStorage`.
2. Jika kunci `pwa_prompt_dismissed` bernilai `true` ditemukan, **hentikan (return/abort)** seluruh proses pemunculan pop-up. Komponen harus merender hasil kosong (`null`).

**C. Eksekusi Halus (Smooth UX):**
1. Pastikan pengecekan ini berjalan hanya di sisi *Client* agar tidak menyebabkan *hydration error* di Next.js.
2. Jangan sentuh logika tombol "Install Sekarang", biarkan berfungsi normal untuk memicu dialog instalasi sistem.

Silakan integrasikan logika memori lokal ini agar pop-up hanya muncul satu kali saja jika pengguna sudah menolaknya! Lapor jika perbaikan UX ini sudah di-*push* ke Vercel!
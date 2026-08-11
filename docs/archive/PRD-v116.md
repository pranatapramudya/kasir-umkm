# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.16
**Fokus:** Clerk Menu Cleanup & Downscaling Pricing Cards UI

## 1. Analisis Bug UX & Tata Letak
*   **Redundansi Navigasi (Clerk):** Terdapat menu kustom "Perpanjangan Berbayar" di dalam komponen profil Clerk `<UserButton>`. Ini menyebabkan kebingungan *user path* karena menu utama sudah tersedia di Sidebar.
*   **Oversized UI (Katalog Paket):** Kartu pilihan paket (Mulai Usaha, Pro Bulanan, Pro Tahunan) terlalu besar dan memakan ruang berlebihan di layar. Ukurannya harus diperkecil secara signifikan agar terlihat lebih padat, rapi, dan berstandar *Enterprise*.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada kode *frontend*. DILARANG memberikan *output* kode mentah.

### A. Cleanup Profil Clerk
*   **Target File:** Komponen *Header* atau *Navbar* yang memuat komponen `<UserButton>` dari Clerk.
*   **Instruksi:** 
    1. Hapus tag `<UserButton.MenuItems>` atau elemen kustom apa pun di dalam `<UserButton>` yang menambahkan tautan "Perpanjangan Berbayar". 
    2. Biarkan `<UserButton />` kembali ke wujud *default*-nya yang bersih (hanya berisi *Manage Account* dan *Sign Out*).

### B. Downscaling (Pengecilan) Kartu Paket Langganan
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx` (Bagian Katalog Paket)
*   **Instruksi Tailwind (Wajib diikuti):**
    1. **Kontainer Utama Grid:** Batasi lebar maksimal area kartu paket agar tidak melebar memenuhi layar. Gunakan kelas `max-w-4xl` atau `max-w-5xl` pada kontainer yang membungkus *Grid* (contoh: `grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto`).
    2. **Pengecilan *Padding* Kartu:** Ubah *padding* internal setiap kartu paket dari yang sebelumnya besar (misal `p-8` atau `p-10`) menjadi lebih kecil (misal `p-5` atau `p-6`).
    3. **Pengecilan Tipografi:** 
       - Ubah ukuran *font* harga (contoh: Rp 99rb) dari yang sangat besar (misal `text-4xl` atau `text-5xl`) menjadi `text-2xl` atau maksimal `text-3xl font-bold`.
       - Ubah ukuran teks deskripsi dan daftar fitur (fitur *checklist*) menjadi `text-sm` atau `text-[13px]`.
    4. **Tombol Aksi:** Kurangi *padding* vertikal tombol (misal `py-3` menjadi `py-2`) dan kecilkan teksnya menjadi `text-sm`.

Silakan eksekusi pembersihan Clerk dan pengecilan skala kartu ini sekarang, agar antarmuka terlihat jauh lebih premium, padat, dan tidak terlihat seperti *template* pemula.
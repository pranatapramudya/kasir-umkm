# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.35
**Fokus:** Sinkronisasi Naming Menu & Re-theme Halaman Booking Publik (Clean White)

## 1. Objektif
1. Menyelaraskan nama menu pada sidebar untuk kategori bisnis Jasa/Servis agar identik dengan Rental/Travel (mengubah label "Pengaturan" menjadi "Informasi Toko").
2. Merombak UI/UX pada halaman publik Booking Link (`/book/[slug]`) dari tema gelap (Dark Mode/Hitam) menjadi tema terang (Clean White) dengan warna teks hitam yang kontras dan profesional.

## 2. Sinkronisasi Menu Sidebar
**Target File:** `components/SidebarClient.tsx` (dan komponen navigasi terkait jika ada).
**Instruksi Eksekusi:**
1. Cari logika yang merender daftar menu (khususnya menu yang mengarah ke `/admin/settings` atau sejenisnya).
2. Jika ada perkondisian label untuk menu pengaturan, pastikan untuk kategori bisnis `Jasa & Servis`, labelnya diubah dari "Pengaturan" menjadi "Informasi Toko", persis seperti yang diterapkan pada kategori `Rental & Travel`. (Atau jika lebih efisien, ubah saja label defaultnya menjadi "Informasi Toko" untuk semua kategori bisnis agar konsisten).

## 3. Re-theme Halaman Booking (Clean White)
**Target File:** `app/book/[slug]/page.tsx` dan `app/book/[slug]/BookingForm.tsx` (serta komponen *child* lain di dalam rute publik tersebut).
**Instruksi Eksekusi:**
1. **Background Halaman:** Ubah *class* Tailwind pada *container* paling luar (pembungkus utama halaman) dari yang bernuansa gelap (seperti `bg-slate-900`, `bg-gray-900`, `bg-black`, atau `dark:bg-...`) menjadi `bg-white` atau `bg-gray-50`.
2. **Warna Teks Utama:** Ubah semua *class* teks terang (seperti `text-white`, `text-gray-100`, `text-slate-200`) menjadi warna gelap, yaitu `text-gray-900`, `text-gray-800`, atau `text-black` agar kontras dengan background putih.
3. **Card & Form Input:** 
   - Jika ada elemen *Card* atau *Container* form di tengah halaman, pastikan memiliki *background* putih (`bg-white`) dengan bayangan halus (`shadow-md` atau `shadow-sm`), dan *border* tipis (`border-gray-200`) agar terlihat rapi.
   - Pastikan label inputan, *placeholder* text, dan ikon-ikon di dalam form booking juga menggunakan palet warna gelap/hitam yang mudah dibaca.
4. Pastikan logo, nama toko, dan deskripsi toko yang dirender dari database terlihat jelas dan profesional di atas latar belakang putih.

Silakan sapu bersih sisa-sisa tema gelap di halaman booking publik tersebut dan pastikan kompilasi TypeScript tetap aman.
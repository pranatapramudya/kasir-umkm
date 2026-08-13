# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.39
**Fokus:** Injeksi Dinamis Menu "Jadwal Booking/Sewa" Khusus Karyawan Jasa & Rental

## 1. Objektif
Memberikan akses menu ke-4 (Jadwal Booking / Kalender Sewa) bagi Karyawan (Kasir) secara dinamis HANYA jika Tenant beroperasi di kategori bisnis "Jasa & Servis" atau "Rental & Travel". Untuk kategori Retail dan F&B, menu Karyawan tetap dibatasi pada 3 menu utama.

## 2. Analisis Masalah
Saat ini, array navigasi Karyawan (`cashierNavItems` atau array yang dirender saat `!isOwner`) di-hardcode hanya memiliki 3 menu (Dashboard, Kasir, Laporan). Akibatnya, kasir di bisnis Jasa dan Rental tidak bisa melihat daftar reservasi/booking dari pelanggan.

## 3. Eksekusi Perbaikan (Frontend Component)
**Target File:** `components/SidebarClient.tsx` dan `components/BottomNavClient.tsx`.
**Instruksi Eksekusi:**

1. **Modifikasi Array Menu Karyawan (Dynamic Array):**
   - Deklarasikan array menu dasar untuk Karyawan: 
     `[ { label: 'Dashboard', url: '/admin' }, { label: dynamicKasirName, url: '/admin/pos' }, { label: 'Laporan Shift', url: '/admin/laporan-shift' } ]`.
   - Lakukan pengecekan `tenantCategory` menggunakan helper/kondisi yang sudah ada.
   
2. **Injeksi Menu Kondisional:**
   - JIKA kategori bisnis adalah **Jasa & Servis**:
     `push` menu baru ke dalam array Karyawan dengan label `"Jadwal Booking"` dan URL mengarah ke rute kalender booking (misal: `/admin/booking` atau `/admin/jadwal`).
   - JIKA kategori bisnis adalah **Rental & Travel**:
     `push` menu baru ke dalam array Karyawan dengan label `"Data Armada & Sewa"` (atau `"Jadwal Sewa"`) dan URL mengarah ke rute manajemen sewa/armada.
   - JIKA kategori bisnis adalah Retail / F&B: 
     Biarkan array tetap berisi 3 menu standar.

3. **Sinkronisasi Mobile & PC:**
   - Pastikan logika penambahan menu ke-4 ini diaplikasikan HINGGA ke `BottomNavClient.tsx`. Desain Bottom Nav bawaan Tailwind biasanya masih sanggup menampung hingga 4 tombol dengan sangat rapi (Grid cols-4).

Silakan update logika penyusunan menu ini sekarang juga agar kasir Barbershop maupun Rental mobil Anda bisa beroperasi melayani pelanggan booking.
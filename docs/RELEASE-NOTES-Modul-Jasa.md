# Release Notes: Modul Jasa & Peningkatan Sistem
**Versi:** 0.2.12 - 0.2.16
**Tanggal Rilis:** Agustus 2026

## Ringkasan Fitur Baru
Pembaruan ini berfokus pada penambahan Modul Bisnis Jasa / Servis dan penyempurnaan sistem POS secara keseluruhan, dengan isolasi multi-tenant yang lebih baik.

### 1. Modul Bisnis Jasa & Booking System
- **Dynamic Tenant Booking (PRD v2.12 - v2.13):** Model `Booking` ditambahkan pada database untuk menyimpan data reservasi. Pembuatan halaman publik (`/book/[slug]`) untuk pelanggan melakukan reservasi jasa.
- **Slug Tenant Custom (PRD v2.13):** Penambahan fitur pembuatan Slug / URL khusus untuk setiap toko (contoh: `book/barbershop-budi`) pada menu Settings.
- **Anti-Double Booking & Isolation (PRD v2.14):** Pencegahan bentrok jadwal untuk tenant yang sama dan memastikan kerahasiaan data (hanya owner/kasir dari tenant tersebut yang bisa melihat).
- **Customer Booking Receipt (PRD v2.15):** Tiket tanda bukti booking digital (gambar PNG menggunakan `html2canvas`) yang dapat diunduh pelanggan atau dibagikan ke WhatsApp setelah sukses booking.
- **Calendar View Dashboard (PRD v2.16):** Penambahan visualisasi jadwal booking dengan `react-big-calendar` di dashboard owner (`/admin/booking`) untuk manajemen jadwal yang lebih interaktif.

### 2. Universal Web Bluetooth Printer
- **ESC/POS Web Bluetooth (PRD v2.16):** Integrasi cetak struk nirkabel langsung dari browser menggunakan Web Bluetooth API (`navigator.bluetooth`). Tidak butuh aplikasi tambahan. Struk diformat secara otomatis dengan tata letak standar kasir.

### 3. Peningkatan Isolasi UI & Keamanan
- Penyesuaian `SidebarClient.tsx` untuk memastikan menu "Manajemen Meja" hanya muncul di bisnis F&B, dan menu "Jadwal Booking" hanya muncul di bisnis Jasa.
- Pencegahan kebocoran data antar model bisnis secara ketat di Backend API (`app/api/booking`, `app/api/tenant`).
- Integrasi middleware dan Prisma agar _query_ selalu dibatasi berdasarkan `userId` (tenant ID).

## Kesimpulan
Sistem PJTECH Kasir UMKM kini mendukung 3 model bisnis dengan batasan yang sangat jelas:
1. **Retail:** Manajemen inventaris standar.
2. **F&B:** Manajemen meja (Dine-in).
3. **Jasa/Booking:** Manajemen jadwal kalender tanpa manajemen stok barang berlebih.

Seluruh model bisnis terisolasi sempurna pada tingkat UI (Sidebar adaptif) maupun pada tingkat Database (Foreign Key & Query Filtering).

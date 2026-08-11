# Product Requirements Document: Halaman Khusus "Paket & Tagihan" (Billing Page)
**Versi:** 0.1.12
**Fokus:** Pembuatan Halaman Dedicated Manajemen Langganan & Perpanjangan Paket (Owner Exclusive)

## 1. Tujuan Akhir (Goal)
Membuat halaman khusus ber-rute `/admin/subscription` (atau `/admin/paket`) yang berfungsi sebagai pusat informasi masa berlaku paket, status akun (Free/Trial/Paid), serta menyediakan tombol aksi untuk melakukan perpanjangan paket langganan secara mandiri oleh Owner.

## 2. Batasan Arsitektur & Desain (Constraints)
*   **Aksesibilitas (Role Scoping):** Halaman ini hanya boleh diakses oleh akun dengan *role* `OWNER`. Tambahkan juga menu item baru bernama **"Langganan"** (berikon mahkota/kartu kredit) di dalam *Sidebar*, ditempatkan pada grup **SISTEM & LAPORAN**.
*   **Sinkronisasi dengan `lib/subscription.ts`:** Halaman ini harus menarik data langsung dari *database* Prisma menggunakan *helper* pusat yang sama agar sisa waktu (*countdown timer*) akurat dan sinkron dengan widget di *sidebar*.
*   **UI/UX Premium SaaS:** Gunakan tata letak kartu (*Card-based layout*) yang bersih:
    - *Card 1: Status Akun & Sisa Waktu* (Menampilkan badge status aktif dan hitung mundur digital).
    - *Card 2: Katalog Paket Perpanjangan* (Menampilkan pilihan durasi paket dan tombol pembayaran).

## 3. Instruksi Eksekusi untuk AI Agent
1. **Buat File Rute Baru:** Buat komponen halaman di `app/admin/subscription/page.tsx` (Server Component untuk data fetching) dan `app/admin/subscription/SubscriptionClient.tsx` (Client Component untuk interaksi tombol & timer).
2. **Update Sidebar:** Tambahkan tautan menu "Langganan" pada `SidebarClient.tsx` dengan ikon yang sesuai.
3. **Aksi Perpanjangan:** Sediakan fungsi *mock action* atau integrasi *endpoint* di tombol perpanjangan yang jika diklik akan memperbarui tanggal `subscriptionEndsAt` di basis data (atau mengarah ke halaman *checkout* pembayaran).
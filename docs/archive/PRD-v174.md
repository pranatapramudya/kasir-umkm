# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.74
**Fokus:** Superadmin Dashboard Polish (Pagination, Filtering, Compact UI, & Logout)

## 1. Analisis Kebutuhan UI/UX Superadmin
*   **Navigasi:** Teks "Kembali ke Admin" di header membingungkan. Harus diubah menjadi tombol "Logout" yang mengarah kembali ke *Root Landing Page*.
*   **Data Skala Besar:** Mempersiapkan masuknya banyak *Tenant*, tabel membutuhkan *Pagination* (maksimal 10 baris per halaman) dan Filter Kategori (Semua, F&B, Retail, Jasa).
*   **Densitas UI (Compactness):** Elemen UI (Kartu dan Tabel) terlalu besar/lebar (*bulky*). Diperlukan pengurangan *padding* dan ukuran *font* agar lebih padat dan profesional (*Enterprise data-dense UI*).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Implementasikan perubahan berikut pada antarmuka dan kueri Superadmin. DILARANG memberikan *output* kode mentah panjang.

### A. Perbaikan Header & Logout
*   **Target File:** `app/superadmin/layout.tsx` (atau komponen Header Superadmin)
*   **Instruksi:** 
    1. Ganti teks `<Link>Kembali ke Admin</Link>` menjadi tombol **Logout**.
    2. Gunakan komponen `<SignOutButton>` dari Clerk dan atur agar setelah *logout*, pengguna otomatis diarahkan kembali ke *Root Landing Page* (`/`). Desain tombolnya cukup teks simpel atau ikon *logout*.

### B. Filter Kategori Bisnis
*   **Target File:** `app/superadmin/page.tsx` (dan `page-client.tsx` jika dipisah)
*   **Instruksi:**
    1. Tepat di atas Tabel "Master Data Tenant", tambahkan deretan Tab atau *Pills Button* untuk filter: **"Semua", "F&B", "Retail", "Jasa/Servis"**.
    2. Jika menggunakan Server Component, gunakan URL Search Params (contoh: `?kategori=fnb`) untuk memicu kueri ulang Prisma berdasarkan filter kategori tersebut.

### C. Pagination (Maksimal 10 Baris)
*   **Instruksi Logika:**
    1. Modifikasi kueri Prisma `findMany` pada Master Data Tenant agar menggunakan `take: 10` dan `skip` berdasarkan *Search Params* `?page=1`.
    2. Tambahkan komponen navigasi *Pagination* sederhana di bawah tabel (Contoh: `< Prev | Page 1 of X | Next >`).

### D. Compact UI Scaling (Mengecilkan Ukuran)
*   **Instruksi Tailwind:**
    1. Kurangi *padding* pada sel tabel (`<td>` dan `<th>`). Ubah dari misalnya `p-4` atau `py-4` menjadi `py-2 px-3`.
    2. Turunkan ukuran teks pada tabel menjadi `text-sm` (atau `text-xs` untuk label kolom).
    3. Kecilkan *padding* pada kartu *Overview/KPI* di bagian atas (misal dari `p-6` menjadi `p-4`), dan perkecil ukuran *font* angkanya agar antarmuka secara keseluruhan terasa lebih padat (*dense*), rapi, dan tidak memakan terlalu banyak ruang di layar.

Silakan eksekusi pembaruan skala dan fitur ini agar *Command Center* siap menampung ribuan *Tenant*!
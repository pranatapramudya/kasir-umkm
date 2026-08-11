# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.47
**Fokus:** Dynamic Sidebar & Role-Based Access Control (RBAC) Karyawan F&B

## 1. Analisis Logika Akses (RBAC)
*   Pada bisnis Retail, Karyawan hanya membutuhkan `Menu Utama`.
*   Pada bisnis F&B, Karyawan membutuhkan `Menu Utama` DAN akses ke `Manajemen Meja` untuk mengontrol sirkulasi tamu (mengubah status Terisi/Tersedia).
*   Namun, Karyawan tidak diberikan wewenang untuk menambah, mengubah nama, atau menghapus data meja dasar (wewenang ini mutlak milik Admin/Owner).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Implementasikan penyembunyian elemen UI (Conditional Rendering) berdasarkan kombinasi `role` (Admin/Employee) dan `kategoriUsaha`. DILARANG memberikan *output* kode mentah.

### A. Dynamic Sidebar Visibility
*   **Target File:** Komponen Sidebar (misal: `components/Sidebar.tsx` atau *layout* utama).
*   **Instruksi:**
    1. Evaluasi *array/list* menu Sidebar.
    2. Jika `user.role === 'employee'` DAN `kategoriUsaha === 'F&B'`, **TAMPILKAN** item menu `Manajemen Meja` di Sidebar.
    3. Jika `user.role === 'employee'` DAN `kategoriUsaha !== 'F&B'` (misal Retail/Jasa), **SEMBUNYIKAN** item menu `Manajemen Meja`.
    4. Seluruh menu di bawah Manajemen Bisnis (Produk, Karyawan, Pengeluaran) dan Sistem & Laporan (Analitik, Cek Langganan, Pengaturan) harus tetap **TERSEMBUNYI** dari semua karyawan (berlaku global).

### B. Read-Only Mode untuk Karyawan di Manajemen Meja
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx`
*   **Instruksi:**
    1. Ambil data `role` pengguna yang sedang mengakses halaman ini.
    2. **Sembunyikan Tombol Aksi Kritis:** Jika `role === 'employee'`, Sembunyikan tombol utama `+ Tambah Meja` di sudut kanan atas.
    3. **Sembunyikan Aksi Baris Tabel:** Sembunyikan ikon *Edit* (Pensil) dan *Delete* (Tong Sampah) di setiap baris tabel.
    4. **Biarkan Toggle Status Aktif:** Karyawan TETAP DIIZINKAN untuk mengklik *badge* Status ("Tersedia 🔄" / "Terisi 🔄") agar dapat merespons pergerakan pelanggan secara *real-time*.

Silakan eksekusi logika RBAC ini agar antarmuka karyawan F&B menjadi aman, relevan, dan efisien!
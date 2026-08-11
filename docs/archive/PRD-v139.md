# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.39
**Fokus:** Full CRUD Implementation Modul Manajemen Meja (API & Client State)

## 1. Analisis Kebutuhan
Berdasarkan antarmuka statis di `app/admin/manajemen-meja/page-client.tsx`, sistem membutuhkan fungsionalitas CRUD (Create, Read, Update, Delete) yang sepenuhnya terhubung dengan database. Data harus terisolasi berdasarkan `tenantId` pengguna yang sedang login.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan implementasi dari level Skema Database, API Route, hingga Frontend State Management. DILARANG memberikan *output* kode mentah.

### A. Persiapan Prisma Schema (Jika Belum Ada)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi:** Pastikan terdapat model `Table` (atau `DiningTable`) dengan struktur dasar:
    - `id` (UUID)
    - `name` (String, cth: "Meja 1")
    - `capacity` (Int, default: 4)
    - `status` (String, default: "AVAILABLE" atau "Tersedia")
    - `tenantId` (Relasi ke tabel Tenant)
    - *Jalankan `npx prisma db push` secara senyap jika ada perubahan skema.*

### B. Pembuatan API Routes (Backend)
*   **Instruksi:** Buat file *route handlers* berikut dengan proteksi *middleware/session* untuk memastikan hanya data milik `tenantId` terkait yang diproses:
    1. **`app/api/tables/route.ts`:**
       - **GET:** Mengambil seluruh data meja milik tenant terkait.
       - **POST:** Menambahkan meja baru (menerima payload `name` dan `capacity`).
    2. **`app/api/tables/[id]/route.ts`:**
       - **PUT:** Memperbarui data meja (`name`, `capacity`, atau mengubah `status` menjadi Terisi/Tersedia).
       - **DELETE:** Menghapus data meja berdasarkan ID.

### C. Implementasi Logika Frontend (Client)
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx`
*   **Instruksi:**
    1. **State Management:** Gunakan `useEffect` (atau SWR) untuk melakukan `fetch` data meja dari `/api/tables` saat halaman dimuat. Ganti data *dummy* di tabel dengan data asli.
    2. **Fungsi Tambah:** Hubungkan modal/form "Tambah Meja" dengan *request* `POST`. Setelah sukses, perbarui *state* tabel tanpa *reload* halaman dan munculkan `toast.success`.
    3. **Fungsi Edit:** Buat tombol *icon pencil* membuka modal form yang berisi data meja saat ini. Hubungkan dengan *request* `PUT` untuk menyimpan perubahan.
    4. **Fungsi Hapus:** Buat tombol *icon trash* memunculkan konfirmasi (menggunakan `window.confirm` atau alert UI) sebelum mengirim *request* `DELETE`.
    5. **Quick Status Toggle (Opsional tapi disarankan):** Buat *badge* status ("Tersedia" / "Terisi") dapat diklik untuk langsung men- *trigger* API `PUT` pengubahan status secara instan (UX yang baik untuk kasir/pelayan).

Eksekusi seluruh alur CRUD ini sekarang agar modul Manajemen Meja dapat beroperasi penuh!
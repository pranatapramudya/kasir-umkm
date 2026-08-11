# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.78
**Fokus:** Aksi Tabel (Hapus Karyawan), Toggle Password, & UX Form Pembersihan Placeholder

## 1. Analisis Kebutuhan Fitur & UI/UX
*   **Masalah Kuota & Salah Input:** Pengguna (Owner) dapat melakukan kesalahan saat mendaftarkan email kasir. Mengingat ada batas kuota (2 kasir), harus ada mekanisme untuk menghapus akun kasir yang salah buat agar kuota kembali tersedia.
*   **Masalah Visibilitas Password:** Saat Owner membuat *password* sementara untuk kasir, tidak ada ikon "Mata" (Toggle Show/Hide) untuk memastikan tidak ada salah ketik (*typo*).
*   **Masalah UX Placeholder:** Teks *placeholder* contoh (seperti `kasir1@tokoanda.com`) memicu miskonsepsi visual; pengguna mengira form tersebut sudah terisi secara otomatis (*pre-filled*). 

## 2. Instruksi Eksekusi Frontend & Backend untuk AI Agent
Lakukan perbaikan pada komponen Modal dan tambahkan fitur penghapusan pada tabel.

### A. Fitur Hapus Karyawan (Tabel & Server Action)
*   **Target File UI:** `app/admin/karyawan/page.tsx` (di bagian Tabel).
*   **Target File Backend:** `app/admin/karyawan/actions.ts`.
*   **Instruksi Eksekusi:**
    1.  Di kolom "STATUS" atau buat kolom baru "AKSI" pada tabel, tambahkan sebuah tombol/ikon "Hapus" (Gunakan ikon *Trash* dari Lucide React dengan warna merah/`text-red-500`).
    2.  Buat *Server Action* baru bernama `deleteEmployee(employeeId: string, clerkUserId: string)`.
    3.  **Logika Backend Mutlak:** Di dalam *action* tersebut, Anda WAJIB menghapus data di dua tempat secara berurutan:
        *   Hapus dari sistem Clerk: `await clerkClient().users.deleteUser(clerkUserId);`
        *   Hapus dari basis data lokal: `await prisma.employee.delete({ where: { id: employeeId } });`
    4.  Berikan konfirmasi *alert/dialog* sebelum penghapusan di sisi *Client* agar tidak terhapus secara tidak sengaja.

### B. Toggle Visibilitas Password (Show/Hide)
*   **Target File:** Komponen form Modal Tambah Kasir.
*   **Instruksi UI/React State:**
    1.  Gunakan *React State* untuk mengelola visibilitas: `const [showPassword, setShowPassword] = useState(false);`.
    2.  Bungkus elemen `<input>` *password* dengan `div` relatif (`relative`).
    3.  Ubah properti tipe input secara dinamis: `type={showPassword ? "text" : "password"}`.
    4.  Tambahkan tombol absolut di sisi kanan dalam input tersebut yang memicu `setShowPassword(!showPassword)`. Gunakan ikon `Eye` dan `EyeOff` dari Lucide React sebagai indikator visualnya.

### C. Pembersihan Placeholder Gaib
*   **Target File:** Komponen form Modal Tambah Kasir.
*   **Instruksi UX:**
    1.  Cari properti `placeholder="..."` pada input Nama Lengkap, Email/Username, dan Password.
    2.  Hapus nilai *placeholder* contoh (misal: "Misal: Budi Santoso").
    3.  Ganti dengan instruksi aksi yang jelas dan tidak terlihat seperti data, contoh: `placeholder="Ketik nama lengkap..."` dan `placeholder="Ketik email aktif..."`.
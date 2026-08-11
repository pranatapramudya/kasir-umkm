# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.82
**Fokus:** Refaktor UI Produk, Revisi Copywriting Berbayar, & Redesain Alur Onboarding (Paywall)

## 1. Analisis Kebutuhan Fitur
*   **UX Manajemen Produk:** Halaman `/admin/produk` saat ini kesulitan menangani data dalam jumlah besar karena ketiadaan fitur pencarian dan filter. Solusi terefisien adalah menduplikasi komponen *Search Bar* dan *Category Filter* yang sudah ada di halaman Kasir POS.
*   **Revisi Copywriting:** Terminologi "Akses Pro" dan "Upgrade ke Pro" dirasa kurang tepat untuk model bisnis ini. Harus diubah menjadi "Perpanjangan Berbayar".
*   **Onboarding Paywall (SaaS Flow):** Tiga opsi paket langganan tidak boleh disembunyikan di dalam *Sidebar* setelah masuk. Pengguna baru harus memilih paket tersebut TEPAT SETELAH mereka menyimpan form nama toko & kategori, sebelum mereka diizinkan masuk ke Dasbor (`/admin`).

## 2. Instruksi Eksekusi Frontend & Backend untuk AI Agent
Lakukan perombakan pada 3 sektor secara berurutan sesuai instruksi di bawah.

### A. Duplikasi Fitur Cari & Filter (Manajemen Produk)
*   **Target File:** `app/admin/produk/page.tsx` (atau komponen *Client* yang merender daftar produk).
*   **Instruksi UI & Logika:**
    1.  Buka file komponen Kasir POS yang memuat *Search Input* ("Cari produk...") dan tombol *Filter Kategori*. Salin elemen UI tersebut.
    2.  Tempelkan elemen UI tersebut di bagian atas daftar produk pada file `app/admin/produk/page.tsx`.
    3.  Implementasikan *React State* yang sama: `const [searchQuery, setSearchQuery] = useState('')` dan `const [selectedCategory, setSelectedCategory] = useState('Semua')`.
    4.  Terapkan logika *filtering* pada fungsi `.map()` daftar produk: Tampilkan produk hanya jika namanya mengandung `searchQuery` DAN kategorinya sesuai dengan `selectedCategory`.

### B. Revisi Copywriting (Perpanjangan Berbayar)
*   **Target File 1:** `components/Sidebar.tsx` (Card langganan di bagian bawah).
*   **Target File 2:** Komponen `<UserButton />` (Menu profil Clerk).
*   **Instruksi:**
    1.  Ubah semua teks judul "Akses Pro" di Sidebar menjadi **"Perpanjangan Berbayar"**.
    2.  Ubah label `UserButton.Action` dari "Upgrade ke Pro" menjadi **"Perpanjangan Berbayar"**.

### C. Redesain Alur Onboarding (Injeksi Paywall)
*   **Target File:** `app/onboarding/page.tsx`
*   **Instruksi Alur State (Multi-step Form):**
    1.  Ubah halaman *Onboarding* menjadi mode *multi-step*. Buat state `const [step, setStep] = useState(1)`.
    2.  **Step 1:** Menampilkan form nama toko dan kategori (UI saat ini).
    3.  Saat form Step 1 di-*submit* dan berhasil menyimpan data *Tenant* via Prisma + Clerk (Idempotent), JANGAN panggil `window.location.href = '/admin'`. Sebaliknya, panggil `setStep(2)`.
    4.  **Step 2 (Baru):** Jika `step === 2`, sembunyikan form toko dan tampilkan UI 3 Kartu Paket Langganan (Free/Basic/Premium) dengan fitur-fiturnya.
    5.  Berikan tombol aksi pada masing-masing kartu paket tersebut (Misal: "Pilih Paket Ini").
    6.  Saat pengguna memilih salah satu paket, barulah Anda mengeksekusi *Hard Redirect* `window.location.href = '/admin'` untuk membuka akses ke sistem utama. 
    7.  *(Catatan untuk Agent: Pastikan desain 3 kartu paket langganan responsif dan menggunakan estetika Tailwind yang selaras dengan keseluruhan aplikasi).*
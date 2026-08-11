# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.44
**Fokus:** Sinkronisasi Nomor Telepon Bisnis (Onboarding hingga Cetak Struk)

## 1. Analisis Kebutuhan & Bug
*   **Missing Data Pipeline:** Saat ini, form pendaftaran/onboarding akun baru hanya meminta "Nama Usaha" dan "Kategori". Akibatnya, data nomor telepon bisnis kosong dan komponen Struk mencetak teks *hardcoded* `Telp: -`.
*   **Solusi:** Diperlukan penambahan kolom input "Nomor Telepon Bisnis" pada tahap pendaftaran awal, pembaruan skema database untuk menyimpannya, dan pengikatan (*data binding*) nilai tersebut ke komponen Struk untuk semua kategori bisnis (Retail, F&B, Jasa).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pembaruan secara menyeluruh dari level Skema Database, API, Form UI, hingga Komponen Cetak. DILARANG memberikan *output* kode mentah.

### A. Pembaruan Skema Database (Prisma)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi:** 
    1. Pastikan model `Tenant` (atau model yang menyimpan profil toko/usaha pengguna) memiliki *field* `phone` (Tipe data: `String`, berikan nilai *default* `""` atau buat opsional sementara agar data lama tidak *crash*).
    2. Jalankan sinkronisasi database (`npx prisma db push`) secara senyap jika ada perubahan skema.

### B. Pembaruan Form Pendaftaran (Onboarding UI)
*   **Target File:** Komponen pendaftaran/onboarding (tempat pengguna memasukkan nama toko dan memilih kategori).
*   **Instruksi:**
    1. Tambahkan satu *input field* baru di antara "Nama Usaha/Toko" dan "Kategori Bisnis".
    2. Beri label: `Nomor Telepon Bisnis (WhatsApp)`.
    3. Jadikan *field* ini wajib diisi (`required`).
    4. Pastikan *state* form menangkap nilai input ini.

### C. Pembaruan API Route Pembuatan Tenant
*   **Target File:** *Route handler* untuk form onboarding (misal: `app/api/tenant/route.ts` atau fungsi *Server Action* terkait).
*   **Instruksi:**
    1. Perbarui validasi *payload* masuk untuk menerima parameter `phone`.
    2. Masukkan nilai `phone` tersebut ke dalam kueri `prisma.tenant.create` atau `prisma.tenant.update`.

### D. Pengikatan Data Dinamis pada Struk (Semua Kategori)
*   **Target File:** Komponen Struk Pelanggan (Receipt Component).
*   **Instruksi:**
    1. Ambil data `phone` dari *context* pengguna atau hasil *fetch* profil *tenant* yang sedang *login*.
    2. Cari bagian teks `Telp: -` pada layout struk.
    3. Ganti dengan data dinamis. Contoh logika rendering: `Telp: ${tenant.phone || '-'}`.
    4. Pastikan perubahan ini berlaku secara global saat mencetak transaksi dari kasir Retail, F&B, maupun Jasa.

Silakan eksekusi pipeline data nomor telepon ini secara berurutan agar struk tercetak dengan data bisnis yang lengkap!
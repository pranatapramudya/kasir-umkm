# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.46
**Fokus:** Peningkatan UX (Affordance) pada Quick-Toggle Status Meja

## 1. Analisis Bug UX
*   Fitur "Quick Toggle" untuk mengubah status meja sudah berfungsi di *backend* dan *state*, namun secara visual (*frontend*), komponen *badge* status terlihat seperti label teks statis.
*   Pengguna awam ("gaptek") dan pengguna perangkat layar sentuh (Tablet) tidak menyadari bahwa *badge* tersebut dapat diklik. Diperlukan penanda visual eksplisit (*affordance*) bahwa elemen tersebut interaktif.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Tingkatkan kejelasan antarmuka pada tabel Manajemen Meja. DILARANG memberikan *output* kode mentah.

### A. Penambahan Instruksi Eksplisit pada Header Tabel
*   **Target File:** `app/admin/manajemen-meja/page-client.tsx` (atau komponen Tabel terkait).
*   **Instruksi:**
    1. Cari bagian *header* tabel untuk kolom `STATUS`.
    2. Ubah teksnya menjadi: `STATUS (KLIK UNTUK UBAH)`.
    3. Buat teks tambahan "(KLIK UNTUK UBAH)" menggunakan ukuran *font* yang lebih kecil (misal: `text-xs`) dan warna yang sedikit lebih pudar agar tidak terlalu mendominasi, namun tetap terbaca jelas.

### B. Redesain Badge Status Menjadi "Tactile Button"
*   **Target File:** Komponen Badge "Tersedia" dan "Terisi" di dalam iterasi baris tabel Manajemen Meja.
*   **Instruksi (Tailwind CSS):**
    1. Tambahkan ikon *Swap* / *Refresh* / *Sync* (berukuran kecil) di sebelah kanan teks status (misal: "Tersedia 🔄"). Gunakan library ikon yang sudah ada di proyek (seperti `lucide-react`).
    2. Pastikan elemen pembungkus *badge* memiliki *class* interaktif untuk layar sentuh dan mouse: `cursor-pointer active:scale-95 transition-transform duration-150`.
    3. Tambahkan sedikit bayangan (`shadow-sm`) dan border tipis agar *badge* tersebut lebih menyerupai tombol tiga dimensi (*tactile*), bukan sekadar stiker datar.

Silakan eksekusi perbaikan UX ini agar kasir dan pelayan restoran dapat langsung memahami cara mengosongkan atau mengisi meja tanpa perlu *training*!
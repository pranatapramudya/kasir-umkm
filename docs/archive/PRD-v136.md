# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.36
**Fokus:** Perbaikan UX Transisi Onboarding & Penambahan Paket Hardware Bundling

## 1. Analisis Bug UX & Kebutuhan Fitur
*   **UX Glitch (Onboarding Flicker):** Setelah pengguna menekan tombol pemilihan paket, terjadi *delay* (jeda) sepersekian detik di mana komponen form sebelumnya (Nama Usaha/Kategori) terlihat kembali sebelum akhirnya browser berpindah ke rute `/admin`. Hal ini mengurangi kesan profesional.
*   **Opsi Paket Bundling & S&K:** Pemilik bisnis membutuhkan opsi langganan 1 Tahun yang di-*bundle* dengan Hardware (Tablet + Printer). Selain itu, diperlukan tombol atau tautan "Syarat & Ketentuan" (Rules) yang menjelaskan hak milik alat setelah 1 tahun.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan pada komponen Onboarding dan Pricing. DILARANG memberikan *output* kode mentah.

### A. UX Fix: Full-Screen Loading State
*   **Target File:** `components/PricingSection.tsx` (atau komponen *parent* dari Onboarding).
*   **Instruksi:**
    1. Tambahkan *state* baru: `const [isRedirecting, setIsRedirecting] = useState(false);`.
    2. Saat fungsi pemilihan paket berhasil dipanggil, set `setIsRedirecting(true)` tepat sebelum mengeksekusi `window.location.href = '/admin'`.
    3. Pada fungsi `render()`, buat kondisi pembungkus: Jika `isRedirecting === true`, sembunyikan SELURUH komponen kartu harga atau form sebelumnya. Gantikan dengan tampilan *Full-Screen Overlay* yang bersih berisi Spinner animasi dan teks: `"Menyiapkan Dashboard Anda..."`.

### B. Opsi Bundling Hardware & S&K (Syarat & Ketentuan)
*   **Target File:** `components/PricingSection.tsx`.
*   **Instruksi:**
    1. Pada kartu **Pro 6 Bulan**, tambahkan label teks kecil di bawah harga: *(Hanya Software)*, dan tambahkan tautan modal/teks info "Lihat Syarat & Ketentuan".
    2. Pada kartu **Pro Tahunan**, rombak strukturnya agar memiliki *Toggle* atau 2 Opsi Tombol:
       - **Opsi 1: Software Saja** (Harga: Rp 1.188k / tahun)
       - **Opsi 2: Software + Hardware** (Harga: Rp 2.988k / tahun). Tambahkan deskripsi *bullet point*: `Termasuk Tablet Kasir & Printer Thermal (Hak milik setelah 1 tahun)`.
    3. Buat *Dialog/Modal* sederhana ketika teks "Syarat & Ketentuan" diklik, berisi teks *dummy* sementara (contoh: "1. Hardware sepenuhnya menjadi hak milik pengguna setelah berlangganan 1 tahun penuh. 2. Kerusakan fisik menjadi tanggung jawab pengguna...").

Silakan eksekusi perbaikan transisi *loading* ini agar pendaftaran terasa 100% mulus tanpa *flicker*, dan tambahkan opsi harga Bundling secara dinamis di kartu Tahunan!
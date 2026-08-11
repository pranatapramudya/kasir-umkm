# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.83
**Fokus:** Fix Visibilitas Input UI & Sistem Timer Langganan SaaS (Countdown)

## 1. Analisis Kebutuhan Fitur
*   **UI Bug (Produk):** Kolom input pencarian di halaman Manajemen Produk mengalami isu kontras yang sangat rendah (teks/placeholder putih di atas latar yang terang).
*   **Business Logic (SaaS Timer):** Setelah pengguna memilih paket langganan pada saat *Onboarding*, sistem harus mencatat kapan paket tersebut berakhir. Di dalam Dasbor (terutama di komponen *Sidebar* pada kartu "Perpanjangan Berbayar"), sistem harus menampilkan waktu mundur (contoh: "Sisa Waktu: 29 Hari 10 Jam") untuk menciptakan urgensi.

## 2. Instruksi Eksekusi untuk AI Agent
Eksekusi perbaikan antarmuka dan tambahkan arsitektur waktu langganan secara berurutan.

### A. Perbaikan Kontras Search Input (Manajemen Produk)
*   **Target File:** `app/admin/produk/page.tsx`
*   **Instruksi Styling (Tailwind):**
    1.  Cari elemen `<input>` untuk pencarian produk.
    2.  Hapus kelas yang membuat latar/teks menjadi transparan atau putih pudar.
    3.  Terapkan kelas Tailwind yang tegas: `bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:ring-blue-500`.

### B. Pembaruan Skema Database (Prisma)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi:**
    1.  Pada model `Tenant` (atau model utama yang menyimpan data toko/owner), tambahkan 2 kolom baru:
        *   `subscriptionPlan String @default("FREE")`
        *   `subscriptionEndsAt DateTime?`
    2.  *(Jangan lupa instruksikan Owner untuk menjalankan `npx prisma db push` setelah ini).*

### C. Injeksi Waktu Aktif di Onboarding
*   **Target File:** `app/onboarding/page.tsx` (atau file *Server Action* yang menangani pemilihan paket).
*   **Instruksi Logika:**
    1.  Saat pengguna mengklik tombol "Pilih Paket" di Step 2 (Paywall), kirim data paket yang dipilih ke *Server Action*.
    2.  Jika paket yang dipilih adalah "BASIC" atau "PREMIUM", kalkulasi waktu kedaluwarsa: 30 hari dari sekarang (`new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)`).
    3.  Simpan `subscriptionPlan` dan `subscriptionEndsAt` tersebut ke dalam tabel `Tenant` milik *user* tersebut. 
    4.  Simpan juga status ini ke dalam `publicMetadata` Clerk agar mudah diakses secara global.

### D. Komponen Countdown Timer di Sidebar
*   **Target File:** `components/Sidebar.tsx` (Pada bagian kartu "Perpanjangan Berbayar").
*   **Instruksi UI & Logika:**
    1.  Ambil data `subscriptionEndsAt` pengguna yang sedang *login* (bisa dari Clerk Metadata atau kueri Prisma).
    2.  Buat *React State* atau *Client Component* kecil khusus untuk menghitung mundur waktu secara *real-time* atau setidaknya kalkulasi sisa hari: `Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24))`.
    3.  Tampilkan informasi ini di dalam kartu di Sidebar. 
    4.  *Contoh UI Output:* Jika paket Premium, tampilkan lencana "👑 Paket Premium". Di bawahnya tampilkan teks tebal "Sisa Waktu: 29 Hari lagi". Jika paket Free, cukup tulis "Paket Gratis Selamanya".
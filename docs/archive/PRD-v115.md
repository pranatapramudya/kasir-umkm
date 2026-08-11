# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.15
**Fokus:** UI Cleanup (Grid, Rename, & Disabled Active Plan State)

## 1. Analisis Bug UX & Layout
*   **Copywriting:** Teks menu di sidebar kurang komunikatif.
*   **Oversized Cards:** Kartu paket langganan terlalu besar dan memakan banyak spasi di layar lebar, serta belum dikonfigurasi ke dalam struktur grid yang pakem.
*   **Redundant Action:** Pengguna masih bisa menekan tombol pembelian pada paket yang saat ini sedang mereka gunakan (contoh: "Gunakan Akses Trial" masih menyala padahal status akun di atasnya sudah "Free Trial").

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada kode Klien. DILARANG memberikan output kode mentah.

### A. Rename Sidebar Menu
*   **Target File:** `components/SidebarClient.tsx`
*   **Instruksi:** Ubah label teks menu dari `"Langganan"` menjadi `"Cek Langganan"`.

### B. Optimalisasi Grid Kartu Paket (3-Column Layout)
*   **Target File:** `app/admin/subscription/SubscriptionClient.tsx` (Bagian Katalog Paket)
*   **Instruksi Tailwind:** 
    1. Bungkus ketiga kartu paket tersebut ke dalam kontainer Grid yang ketat.
    2. Gunakan kelas responsif: `grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto`. Ini memastikan kartu akan menyusun ke bawah di Mobile, namun berjajar 3 kolom dengan rapi dan ukuran proporsional di Tablet/Desktop.

### C. Logic "Disabled" untuk Paket Aktif (Termasuk Clerk)
*   **Target File:** `SubscriptionClient.tsx` & Komponen Header yang memuat `UserButton` Clerk.
*   **Instruksi Logic & UI:**
    1. Baca status aktif pengguna saat ini (misal variabel `currentPlan` yang bernilai 'TRIAL', 'PRO_MONTHLY', dsb).
    2. Pada tombol di dalam kartu paket, berikan pengecekan kondisi. JIKA ID/Tipe kartu sama dengan paket yang aktif, ubah atribut tombol menjadi:
       - `disabled={true}`
       - Tambahkan kelas Tailwind: `bg-gray-300 text-gray-500 cursor-not-allowed border-none shadow-none`
       - Ubah teks tombol menjadi: `"Paket Saat Ini"` atau `"Aktif"`.
    3. **Integrasi Clerk:** Jika Anda menggunakan custom `<UserButton.MenuItems>` di Clerk yang mengarahkan ke perpanjangan paket, pastikan UI tersebut juga mendeteksi status ini agar tidak redundan menawarkan paket yang sudah aktif.

Silakan eksekusi perbaikan UX ini sekarang agar halaman Cek Langganan berfungsi layaknya platform SaaS Enterprise sungguhan!
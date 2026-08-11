# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.52
**Fokus:** BUGFIX - Z-Index Conflict, Layout Overlay, & Scroll Lock pada Modal Paywall

## 1. Analisis Bug (Visual/CSS)
*   **Bug Desktop (Partial Overlay):** Overlay hitam transparan pada Modal Paywall gagal menutupi seluruh layar. Area *sidebar* kanan ("Keranjang") tetap berada di atas overlay. Ini mengindikasikan komponen Modal dirender terlalu dalam pada DOM tree atau kekurangan nilai `z-index` yang mampu mengalahkan *sidebar*.
*   **Bug Mobile (Z-Index Bleed-through):** Saat modal terbuka dan layar di-*scroll*, elemen teks "Tren Penjualan" dari halaman belakang menembus (*bleed-through*) ke atas latar belakang putih Modal. Ini adalah konflik *stacking context* murni.
*   **Tujuan:** Memaksa Modal Paywall untuk selalu berada di lapisan visual paling absolut (mengalahkan semua komponen lain) dan mencegah latar belakang ikut ter-*scroll* saat modal terbuka.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
Fokus perbaiki *styling* CSS (Tailwind) pada komponen pembungkus Modal Paywall. JANGAN mengubah logika/isi teks paket di dalamnya.

### A. Perbaikan Z-Index & Overlay Absolut
*   **Target File:** Komponen tempat Modal Paywall dirender (contoh: `app/page.tsx` atau `components/PaywallModal.tsx`).
*   **Instruksi Styling (Tailwind):**
    1.  Cari elemen `div` pembungkus paling luar dari modal (yang memiliki efek gelap).
    2.  Pastikan kelasnya diubah menjadi eksak seperti ini: 
        `className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"`
    3.  *(Penjelasan: Nilai `z-[9999]` wajib ditambahkan agar modal menang mutlak melawan sidebar Keranjang dan grafik Tren Penjualan).*
    4.  Cari elemen `div` kontainer putih (isi modal) di dalamnya, dan pastikan memiliki kelas `relative z-[10000] bg-white` untuk menjamin tidak ada elemen dari bawah yang bisa menembusnya.

### B. Mencegah Scroll Background (Body Lock)
Agar pengguna di *mobile* tidak mengalami pergeseran layar saat berinteraksi dengan modal, kita perlu mengunci `body` saat *state* modal aktif.
*   **Instruksi Logika React (useEffect):**
    1.  Di dalam komponen yang memanggil modal (atau di dalam komponen modal itu sendiri jika terpisah), tambahkan `useEffect` dari React.
    2.  Tulis logika untuk menambahkan/menghapus kelas `overflow-hidden` pada elemen `body`:
        ```javascript
        useEffect(() => {
          if (showPaywall) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = 'unset';
          }
          return () => { document.body.style.overflow = 'unset'; };
        }, [showPaywall]);
        ```
    3.  *(Ganti `showPaywall` dengan nama state yang Anda gunakan, misalnya `isModalOpen`).*

### C. Validasi UX Akhir
*   **Desktop:** Buka modal. Pastikan seluruh layar (termasuk *sidebar* kiri dan Keranjang di kanan) tertutup penuh oleh efek gelap (*backdrop-blur*).
*   **Mobile:** Buka modal dan coba *scroll* layar (geser ke atas/bawah). Layar latar belakang TIDAK BOLEH ikut bergeser, dan tidak boleh ada elemen abu-abu/teks yang menembus kotak putih modal.
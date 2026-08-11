# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.31
**Fokus:** Optimasi UI/UX Mobile Paywall (Swipeable Pricing Cards)

## 1. Analisis Masalah (Responsive Design Flaw)
*   **Gejala:** Pada *viewport* Desktop, tata letak 3 paket (*Pricing Tiers*) sudah sempurna dengan `grid-cols-3`. Namun pada perangkat *Mobile*, kartu merender terlalu besar secara vertikal (*full-screen blocking*), sehingga pengguna kesulitan membandingkan antar-paket karena harus melakukan *scrolling* panjang ke bawah.
*   **Solusi yang Diharapkan:** Mengubah *layout container* di tampilan *mobile* menjadi *horizontal scroll/carousel* (bisa digeser ke samping), namun mempertahankan tata letak *grid* statis saat diakses melalui *desktop*.

## 2. Instruksi Eksekusi UI/UX untuk AI Agent
Tugas Anda adalah merombak *styling* CSS (Tailwind) pada *container* pembungkus ketiga kartu paket tersebut tanpa mengubah isi konten/logikanya.

### A. Implementasi Horizontal Scroll (Mobile-First)
*   **Target File:** Komponen UI Modal Paywall/Pricing.
*   **Instruksi Container Utama:**
    *   Ubah pembungkus ketiga kartu dari *grid/flex-col* statis menjadi *horizontal scrolling container* menggunakan utilitas Tailwind berikut: `flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-4 w-full`.
    *   Sembunyikan *scrollbar* default peramban agar tampilan tetap elegan (gunakan utilitas penyembunyi *scrollbar* jika ada, atau biarkan bawaan Tailwind).
*   **Instruksi untuk Item Kartu (Pricing Card):**
    *   Pastikan setiap kartu memiliki *class* `shrink-0 snap-center` agar tidak menyusut saat di-geser dan selalu "terkunci" (*snap*) di tengah layar *mobile*.
    *   Tetapkan lebar spesifik pada *mobile* (contoh: `w-[85%]`, `w-[280px]`, atau `w-80`) agar sebagian dari kartu sebelahnya sedikit terlihat di tepi layar. Ini akan memberikan *visual hint* (petunjuk visual) kepada pengguna bahwa ada opsi lain yang bisa mereka lihat dengan cara menggeser (swipe).

### B. Kembalikan State Grid untuk Desktop
*   **Instruksi *Breakpoint* (Medium ke atas):**
    *   Pada *breakpoint* `md:` (desktop/tablet landscape), kembalikan gaya ke *grid layout* dengan menghapus sifat *horizontal scroll*.
    *   Gunakan kombinasi kelas Tailwind: `md:grid md:grid-cols-3 md:overflow-visible md:w-auto md:gap-6`.
    *   Pastikan lebar kartu di desktop menyesuaikan secara proporsional (`md:w-full`).

### C. Validasi
*   Simulasikan tampilan pada mode *Responsive/Mobile* di *Developer Tools*. Pastikan pengguna dapat menggeser layar ke kiri dan ke kanan untuk melihat "Mulai Usaha", "Pro Bulanan", dan "Pro Tahunan" tanpa layar terputus secara vertikal.
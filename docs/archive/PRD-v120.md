# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.20
**Fokus:** Dynamic QRIS Rendering & Pro UI/UX Asset Polish

## 1. Analisis Bug UX (Broken Assets)
*   **Broken Image Paths:** Tag `<img>` pada Checkout Modal saat ini mengalami *broken link* karena path dan nama file tidak sesuai dengan yang ada di folder `/public`.
*   **Static vs Dynamic QRIS:** Klien memiliki 2 barcode QRIS yang berbeda berdasarkan durasi langganan (6 Bulan dan 1 Tahun). Merender satu gambar statis adalah sebuah kesalahan logika bisnis.
*   **UI Alignment:** Tata letak logo Seabank dengan teks Bank masih berantakan dan belum menggunakan prinsip *Flexbox* yang sejajar (*vertically aligned*).

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada komponen `CheckoutModal`. DILARANG memberikan *output* kode mentah.

### A. Dynamic QRIS Image Logic
*   **Target File:** Komponen `CheckoutModal` (di dalam `SubscriptionClient.tsx`).
*   **Instruksi Logic:**
    1. Buat variabel untuk menentukan *path* QRIS berdasarkan paket yang dipilih (`selectedPackage`).
    2. Jika paket yang dipilih adalah "Pro 6 Bulan", set *image source* menjadi `/qris-6bulan.jpeg`.
    3. Jika paket yang dipilih adalah "Pro Tahunan", set *image source* menjadi `/qris-1tahun.jpeg`.
    4. Berikan kelas Tailwind pada tag `<img>` QRIS agar tampil elegan: `w-48 h-48 mx-auto object-contain rounded-lg border border-gray-200 p-2 shadow-sm`.

### B. Polish Logo Seabank
*   **Instruksi UI (Flexbox):**
    1. Pastikan *source* logo Seabank diarahkan ke `/seabank.png`.
    2. Bungkus logo Seabank dan teks "Seabank" menggunakan `flex items-center gap-2`.
    3. Atur ukuran logo Seabank menggunakan kelas Tailwind yang presisi (contoh: `h-6 w-auto object-contain`). Jangan sampai logo terlihat terdistorsi (*stretched*).

### C. UX Refinement Modal
*   **Instruksi:** Pastikan ukuran modal tidak terlalu besar di layar Desktop. Gunakan `max-w-md` atau `max-w-lg` pada kontainer modal utama, dan berikan `backdrop-blur-sm bg-black/40` pada *overlay* latar belakang agar terkesan seperti aplikasi SaaS premium.

Silakan eksekusi perbaikan path aset statis dan perapian UI ini sekarang. Pastikan saat paket berbeda diklik, gambar QRIS yang muncul juga ikut berubah secara dinamis!
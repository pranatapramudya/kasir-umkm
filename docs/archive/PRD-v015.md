# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.15
**Fokus:** Optimasi UX Modal, Modernisasi Dialog Penghapusan, Redesain Header, dan Paginasi Produk

## 1. Analisis Masalah (UX & UI Review)
Mengingat platform ini akan beroperasi sebagai SaaS Kasir UMKM premium di bawah domain `pranajayatech.online`, standar antarmuka harus sempurna dan terpoles dengan baik. Terdapat empat isu krusial pada antarmuka saat ini:
*   **Modal Form Terpotong (Overflow):** Pada perangkat *mobile*, tinggi form "Tambah/Edit Produk" melebihi tinggi layar (*viewport*), sehingga tombol "Simpan/Batal" tertutup dan tidak bisa diakses.
*   **Alert Hapus Jadul:** Konfirmasi penghapusan produk masih menggunakan `window.confirm()` bawaan *browser* yang terlihat kaku dan tidak profesional.
*   **Tombol Header Kasir Tidak Proporsional:** Tombol navigasi kembali ke halaman Kasir di area *Header Admin* tampak kurang menyatu dengan desain premium secara keseluruhan.
*   **Ketiadaan Paginasi:** Menampilkan seluruh produk dalam satu halaman secara memanjang akan membebani kinerja DOM peramban dan menyulitkan navigasi (*infinite scroll fatigue*). 

## 2. Solusi Teknis & Spesifikasi UI

### A. Fix Modal Overflow (Scrollable Content)
*   **Target:** Komponen Modal Tambah/Edit Produk (`app/admin/products/page.tsx`).
*   **Solusi:** Batasi tinggi maksimal modal dan jadikan area kontennya bisa di-*scroll*.
*   **Tailwind Classes:** Tambahkan `max-h-[90vh]` pada *container* utama modal, dan bungkus area *input form* dengan `overflow-y-auto p-4` agar tombol aksi (Simpan/Batal) tetap melayang (*sticky* atau statis di bawah) sementara form di atasnya bisa digeser.

### B. Modernisasi Delete Confirmation (Custom Dialog)
*   **Target:** Fungsi `handleDelete` (`app/admin/products/page.tsx`).
*   **Solusi:** Hapus penggunaan `window.confirm()`. 
*   **Implementasi:** Buat *state* baru (misal: `const [productToDelete, setProductToDelete] = useState(null)`). Ketika tombol tong sampah diklik, tampilkan *Custom Modal Dialog* bergaya Tailwind (dengan latar belakang *overlay* gelap `bg-black/50` dan kotak putih di tengah). Berikan ikon peringatan merah, teks konfirmasi yang tegas, serta tombol "Batal" (abu-abu) dan "Hapus" (merah/danger).

### C. Redesain Tombol Header "Lihat Kasir"
*   **Target:** Komponen Header Admin (`app/admin/layout.tsx`).
*   **Solusi:** Ubah *styling* tombol agar terlihat seperti tombol navigasi SaaS premium.
*   **Implementasi:** Gunakan gaya *Outline* atau *Subtle*. Contoh kelas Tailwind: `flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors`. Pastikan posisi tombol rata tengah (*align-center*) secara vertikal terhadap elemen "Halo, Admin".

### D. Paginasi Produk (Client-Side Pagination)
*   **Target:** Daftar grid produk (`app/admin/products/page.tsx`).
*   **Solusi:** Terapkan pembatasan item per halaman.
*   **Implementasi Logika:**
    *   Buat *state* `currentPage` (default: 1).
    *   Tentukan `itemsPerPage` (Atur menjadi 5 khusus untuk tampilan *mobile*, atau fleksibel misal 5-10 item).
    *   Gunakan metode `.slice()` pada array produk untuk merender data: `products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`.
*   **UI Paginasi:** Di bagian bawah daftar grid produk, tambahkan kontrol paginasi. Tampilkan tombol "Sebelumnya" (`<`), deretan angka halaman (1, 2, 3...), dan tombol "Selanjutnya" (`>`). Berikan *highlight* warna pada angka halaman yang sedang aktif.
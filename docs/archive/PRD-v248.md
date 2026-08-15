# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.48
**Fokus:** Perbaikan Kosmetik UI (Kontras F&B Modal) & Peningkatan UX Input Kategori (Autocomplete)

## 1. Objektif
Menyelesaikan temuan bug visual dari hasil pengujian QA manual. Fokus pada perbaikan visibilitas *placeholder* pada modal modifikasi F&B, serta mengubah input Kategori statis menjadi input dinamis bergaya *Combobox/Autocomplete*.

## 2. Instruksi Eksekusi UI/UX (Frontend)

**A. Perbaikan Kontras Input Modal F&B (Target: `FnbModifierModal.tsx`)**
*   **Masalah:** Input teks "Catatan Tambahan" memiliki warna *placeholder* yang terlalu pudar/transparan sehingga tidak terbaca pada *background* putih.
*   **Instruksi:** 
    1. Pastikan elemen `<input>` atau `<textarea>` memiliki kelas Tailwind untuk mengatur kontras dengan tegas.
    2. Tambahkan kelas `text-gray-900` untuk teks yang diketik, dan `placeholder:text-gray-400` atau `placeholder:text-gray-500` agar teks contoh (*Less Sugar, Extra Shot, dll*) terlihat jelas namun tetap beda dari teks ketikan *user*.
    3. Pastikan *background* form memiliki warna yang solid, misalnya `bg-white` dengan *border* `border-gray-300` agar input field tampak nyata.

**B. Peningkatan UX Form Kategori (Target: Form Tambah/Edit Produk)**
*   **Masalah:** Input field "Kategori" saat ini murni text-input biasa, menyulitkan pengguna memanggil kembali nama kategori yang sudah pernah dibuat sebelumnya, berpotensi memicu duplikasi data karena salah ketik (*typo*).
*   **Instruksi:**
    1. Ubah komponen input Kategori menjadi tipe *Combobox* atau menggunakan elemen *native* `<datalist>`.
    2. **Logika State:** Ambil (*fetch* atau *derive*) daftar Kategori unik dari data produk yang sudah ada di *database* atau *state* produk saat ini. (Misal: ekstrak array string unik dari `products.map(p => p.category)`).
    3. **Perilaku UI:** Saat pengguna mengklik atau mulai mengetik di kolom "Kategori", munculkan rekomendasi (*dropdown list*) berisi kategori yang sudah pernah dibuat sebelumnya.
    4. Pengguna HARUS TETAP BISA mengetik teks kategori baru secara manual jika kategori yang diinginkan belum ada di dalam daftar rekomendasi tersebut (Sifatnya *Autocomplete* fleksibel, bukan *Dropdown/Select* kaku).

Silakan periksa *styling* Tailwind pada modal F&B dan terapkan logika perombakan komponen Kategori ini sekarang. Berikan laporan jika eksekusi sudah selesai!
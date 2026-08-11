# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.08
**Fokus:** UI Compacting (High Information Density) & Server-Side Pagination Tabel Transaksi

## 1. Analisis Kebutuhan Klien
*   **Masalah UI (Spasi Berlebih):** Elemen visual (Kartu Metrik dan Tabel) pada halaman "Laporan Shift" memiliki *padding* dan ukuran *font* yang terlalu besar, sehingga memakan terlalu banyak ruang (*screen real estate*) di layar monitor/laptop.
*   **Masalah Skalabilitas:** Tabel Riwayat Transaksi saat ini merender seluruh data dalam satu halaman. Ini sangat berbahaya untuk performa jika kasir memiliki ratusan transaksi per shift.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan visual dan penyisipan logika paginasi secara langsung pada *codebase*. DILARANG memberikan *output* kode mentah.

### A. UI Compacting (Pengecilan Elemen)
*   **Target File:** `app/laporan-kasir/LaporanKasirClient.tsx` (dan komponen Kartu terkait).
*   **Instruksi Tailwind:**
    1. **Kartu Metrik:** Kurangi *padding* internal (misal dari `p-6` menjadi `p-4`). Kecilkan ukuran *font* nominal uang (misal dari `text-3xl` menjadi `text-2xl` atau `text-xl`). 
    2. **Header & Tabel:** Kecilkan jarak margin antara elemen (kurangi nilai `mt-` atau `gap-`). Pada baris tabel (`<tr>` atau `<td>`), kurangi *padding* vertikal (misal dari `py-4` menjadi `py-2` atau `py-3`) agar baris tabel lebih rapat namun tetap nyaman dibaca. Ubah ukuran teks tabel menjadi `text-sm`.

### B. Implementasi Paginasi Transaksi (Server-Side)
*   **Target File:** Rute API Laporan (`api/reports/shift/route.ts`) dan Klien (`LaporanKasirClient.tsx`).
*   **Instruksi Logika:**
    1. **Re-use Komponen:** Anda WAJIB menggunakan kembali komponen `components/Pagination.tsx` yang sudah kita buat sebelumnya. Letakkan di bagian bawah Tabel Riwayat Transaksi.
    2. **API Route:** Modifikasi kueri Prisma `transaction.findMany` dengan menambahkan batas `take: 10` dan kalkulasi `skip` berdasarkan parameter `page` dari URL/Request. Kembalikan respons dalam format `{ transactions, totalPages }`.
    3. **Client State:** Buat *state* lokal `currentPage` di dalam klien. Gunakan *state* ini sebagai bagian dari kunci (key) SWR saat melakukan *fetch* (contoh: `/api/reports/shift?date=...&page=${currentPage}`).
    4. Pastikan saat pengguna mengklik halaman 2, tabel langsung memperbarui datanya dengan halus tanpa *full page reload*.

Silakan eksekusi pengecilan UI dan pemasangan paginasi ini sekarang. Beri tahu saya jika tabel riwayat shift sudah siap menampung ribuan transaksi dengan rapi!
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.20
**Fokus:** Refaktor UI Filter Kategori (Mobile Responsive) di Super Admin

## 1. Objektif
Mengubah antarmuka filter kategori dari model *Tab/Pill Group* horizontal menjadi komponen *Dropdown/Select* agar lebih responsif, hemat ruang, dan rapi saat diakses melalui perangkat *mobile*.

## 2. Refaktor UI Filter Kategori
**Target File:** Komponen tabel/daftar Tenant atau Filter di halaman Super Admin (misal: `app/admin/super/page.tsx`, `components/TenantList.tsx`, atau `CategoryFilter.tsx`).
**Instruksi:**
1. **Hapus UI Lama:** Cari blok kode yang merender tombol-tombol kategori secara berdampingan ("Semua", "F&B", "Retail", "Jasa/Servis").
2. **Ganti dengan Dropdown:** Implementasikan elemen `<select>` HTML modern atau gunakan komponen `<Select>` bawaan *library* UI lu (misalnya shadcn/ui jika terpasang).
3. **Menu Opsi (Options):** Masukkan daftar kategori ke dalam opsi *dropdown* (value `all` untuk "Semua", lalu "F&B", "Retail", dan "Jasa / Servis").
4. **Pertahankan Logika State:** Pastikan event `onChange` atau `onValueChange` dari Dropdown ini tetap mengubah *state* kategori yang sudah ada sebelumnya, sehingga filter tabel/data di bawahnya tetap berfungsi 100% tanpa ada yang rusak.
5. **Styling Tailwind:** Buat tampilannya profesional. 
   - Tambahkan ikon *Filter* (corong) di sebelah atau di dalam Dropdown.
   - Gunakan *class* responsif, contoh: `w-full md:w-64` agar *dropdown* melebar penuh di HP, tapi tetap ringkas di layar laptop.

Silakan eksekusi perubahan antarmuka ini secara hati-hati pada komponen *Client* terkait!
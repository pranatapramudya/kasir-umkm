# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.06
**Fokus:** UI/UX Polish (Perbaikan Kontras Warna Teks & Reposisi Layout Superadmin)

## 1. Objektif
Memperbaiki masalah visibilitas teks (kontras rendah/abu-abu pudar) pada *input* pencarian dan *dropdown* menu Aksi/Override. Selain itu, melakukan reposisi *Search Bar* agar tidak bertumpuk di tengah *header*, melainkan ditempatkan secara proporsional tepat di atas kolom tabel.

## 2. Instruksi Eksekusi Mutlak untuk Agent (Murni UI/CSS)

### A. Perbaikan Kontras Warna Teks (Tailwind Classes)
1. **Komponen SearchBar:** 
   * Buka file `SearchBar.tsx` (atau komponen *input* pencarian).
   * Cari tag `<input>`. Pastikan *class* untuk teks utama (value) menggunakan warna gelap yang jelas, misalnya `text-gray-900` atau `text-slate-900`. 
   * Pastikan warna abu-abu (misal `text-gray-400`) **hanya** digunakan untuk atribut `placeholder-gray-400`.
2. **Komponen ManualOverride / Modal:**
   * Buka file `ManualOverrideButton.tsx` (atau komponen *Modal*).
   * Cari tag `<select>` atau *dropdown item* pada pemilihan "Paket Langganan" dan "Status".
   * Ubah *class* teks opsinya menjadi `text-gray-900`. Hapus *class* seperti `text-gray-300` atau `text-slate-400` yang menempel pada `<option>` atau elemen *dropdown*, karena membuat teks terlihat seolah dinonaktifkan (*disabled*).

### B. Reposisi Layout (Tata Letak) Command Center
1. Buka file `app/superadmin/page.tsx`.
2. Cari elemen *wrapper* (pembungkus) yang saat ini menampung judul "Master Data Tenant" dan *SearchBar*.
3. **Pisahkan Layout:**
   * Biarkan bagian *Header* hanya berisi Judul ("Master Data Tenant") dan deskripsinya di sebelah kiri.
   * Buat **satu baris baru (*Toolbar Row*)** tepat di bawah *Header* dan di atas tag `<table>`.
   * Pindahkan komponen `<SearchBar />`, tombol `<Tarik Data (Excel) />`, dan `<Filter Kategori (Semua, F&B, dll)>` ke dalam baris *Toolbar* baru ini.
   * Gunakan *class Flexbox* agar rapi: `flex flex-col md:flex-row justify-between items-center gap-4 mb-4`.
   * Susun urutannya: *Search Bar* di kiri/tengah, dan *Filter* + Tombol Tarik Data di kanan agar terlihat lega dan profesional.

## 3. Output yang Diharapkan
Terapkan perubahan kelas *Tailwind* untuk memperbaiki kontras teks. Reposisi elemen UI sehingga letak kotak pencarian lebih logis dan tidak bertabrakan dengan judul. Berikan konfirmasi bahwa antarmuka *Superadmin* sudah rapi dan teks sudah dapat dibaca dengan jelas.
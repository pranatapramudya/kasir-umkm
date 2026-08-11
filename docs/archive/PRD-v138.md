# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.38
**Fokus:** Dinamisasi UI/UX Kamar F&B (Kasir Resto, Manajemen Menu, & Struk)

## 1. Analisis Kebutuhan Modul F&B
Berdasarkan arsitektur *Multi-Vertical*, UI harus beradaptasi ketika *tenant* yang login memiliki `kategoriUsaha === 'F&B'`. 
*   **Kasir Resto:** Membutuhkan input Nomor Meja sebelum *checkout*, dan teks "Pelanggan" harus diubah/ditambah opsi "Nomor Meja".
*   **Manajemen Produk (Menu):** Istilah "Produk" dan "Barang" tidak lazim di F&B. Harus diubah menjadi "Menu". Kolom "Merek", "Varian/Ukuran", dan "Batas Stok Menipis" seringkali tidak relevan untuk restoran saji saji dan harus dihilangkan/disembunyikan khusus untuk kategori F&B.
*   **Struk Transaksi (Receipt):** Header struk tidak boleh menampilkan "PJTECH KASIR POS", melainkan harus mencetak nama usaha *tenant* (pemilik toko) secara dinamis.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan implementasi **Conditional Rendering** berdasarkan data `kategoriUsaha` dari *session/context* pengguna. DILARANG merusak atau mengubah *default state* untuk kategori 'Retail'.

### A. Adaptasi Form "Tambah/Edit Produk" (Khusus F&B)
*   **Target File:** `app/admin/products/page-client.tsx` (atau komponen form modal produk).
*   **Instruksi:**
    1. Deteksi *kategori usaha* tenant saat ini.
    2. **Jika F&B:** 
       - Ubah *title* modal menjadi: `"Tambah Menu Baru"` / `"Edit Menu"`.
       - Ubah label `"Nama Produk"` menjadi `"Nama Menu"`.
       - **SEMBUNYIKAN** (*hide*) field input berikut: `Kode Barang (SKU)`, `Merek`, `Varian / Ukuran`, dan `Batas Stok Menipis`.
       - *Default* field `Stok Awal` tetap ada, namun buat opsional atau default angka tinggi jika F&B tidak melacak bahan baku per porsi (sesuaikan dengan skema Prisma saat ini).
    3. **Jika Retail:** Pastikan semua form tetap utuh seperti semula (seperti pada *image_6e6e81.png*).

### B. Modifikasi Layout "Kasir Resto"
*   **Target File:** `app/admin/kasir-resto/page-client.tsx` (atau komponen keranjang).
*   **Instruksi:**
    1. Pada area Keranjang (sebelah kanan), tambahkan field *Dropdown* (Select) wajib isi bernama **"Nomor Meja"** tepat di atas/bawah "Nama Pelanggan".
    2. *Dropdown* ini harus mengambil data dari tabel `Table` (Manajemen Meja) yang memiliki status `Tersedia`. Jika API belum siap, gunakan *dummy data* statis `['Meja 1', 'Meja 2', 'Meja 3']` sementara.
    3. Blokir tombol `BAYAR SEKARANG` jika field "Nomor Meja" belum dipilih (khusus untuk mode F&B).

### C. Dinamisasi Header Struk Transaksi (Receipt)
*   **Target File:** Komponen Cetak Struk (biasanya dipicu setelah *checkout* sukses).
*   **Instruksi:**
    1. Ganti teks *hardcoded* `PJTECH KASIR POS` di bagian atas (kop) struk menjadi nilai dinamis dari `tenant.name` (Nama Usaha yang didaftarkan *user*).
    2. Tambahkan sub-header berupa alamat atau kategori bisnis di bawah nama toko jika tersedia di database.
    3. Khusus untuk transaksi dari Kasir Resto, pastikan `Nomor Meja` tercetak jelas di bawah Nama Pelanggan pada struk.

Eksekusi ketiga poin ini dengan prinsip *Feature Toggling*. Pastikan fungsionalitas Retail tidak terganggu sama sekali!
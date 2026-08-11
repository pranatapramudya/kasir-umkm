# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.05
**Fokus:** Fitur Pencarian Tenant (Search Bar) & Manual Override Subscription (Aksi Superadmin)

## 1. Objektif Fitur
Menyempurnakan *Command Center Superadmin* dengan dua fitur krusial:
1. **Fitur Pencarian (Search):** Memungkinkan Superadmin mencari *tenant* secara instan berdasarkan Nama Toko atau Nomor Telepon.
2. **Manual Override (Tombol Edit):** Menyediakan tombol aksi permanen di setiap baris *tenant* untuk mengubah status dan paket langganan secara paksa/manual, mengakomodasi skenario pembayaran di luar sistem (misal: transfer langsung saat masa TRIAL).

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Implementasi Search Bar (Frontend & Backend)
1. Buka halaman `app/superadmin/page.tsx` (atau komponen tabel terkait).
2. Tambahkan komponen *Input Search* (Kotak Pencarian) di sebelah kiri tombol filter kategori atau tombol "Tarik Data (Excel)". Berikan ikon kaca pembesar (Search).
3. Buat *state* lokal atau *URL Query Params* (misal `?search=namaToko`) yang terikat dengan kotak pencarian tersebut.
4. **Logika Filter:** Jika menggunakan *Client-Side Filtering*, saring *array* data *tenant* berdasarkan `storeName` atau `phone` yang di- *include* (mengandung kata kunci pencarian, *case-insensitive*). Jika *Server-Side*, sesuaikan fungsi Prisma dengan `where: { OR: [ { name: { contains: search } }, { phone: { contains: search } } ] }`.

### B. Penyempurnaan Kolom "Aksi" & Modal Edit Manual
1. Pada tabel Master Data, pastikan kolom "AKSI" memiliki sebuah tombol *Dropdown* atau tombol Edit (ikon pensil/gir) untuk **SEMUA** *tenant*, apa pun statusnya.
2. **Tombol "ACC" Cepat:** Pertahankan tombol "ACC" berwarna hijau menyolok khusus untuk *tenant* yang berstatus `PENDING`.
3. **Modal Edit Paket:** Saat tombol Edit ditekan pada *tenant* mana pun, buka sebuah *Modal* kecil yang menampilkan informasi *tenant* tersebut.
4. Di dalam *Modal* tersebut, sediakan form *Dropdown* untuk memaksa perubahan (Manual Override):
   * **Pilih Paket:** (Free / Pro 6 Bulan / Pro 1 Tahun)
   * **Status:** (TRIAL / ACTIVE / EXPIRED / PENDING)
5. Saat tombol "Simpan Perubahan" di *Modal* ditekan, lakukan *fetch* ke *endpoint* API (misal `app/api/superadmin/update-tenant/route.ts`).

### C. Pembuatan API Manual Override
1. Buat/sesuaikan rute API untuk menangani *update* manual dari Superadmin.
2. API ini harus mampu melakukan *upsert* atau *update* ke tabel `Subscription` milik *tenant* tersebut.
3. **Penting:** Pastikan perhitungan tanggal berlaku (*expiry date*) di- *reset* atau dikalkulasi ulang secara otomatis di *backend* jika Superadmin mengubah paket menjadi "Pro 6 Bulan" atau "Pro 1 Tahun" dan statusnya "ACTIVE".

## 3. Output yang Diharapkan
Terapkan kotak pencarian yang berfungsi *real-time* dan lengkapi kolom AKSI dengan fitur Edit Manual. Berikan laporan konfirmasi bahwa fungsi pencarian sudah responsif dan fitur *Manual Override* siap digunakan oleh Superadmin.
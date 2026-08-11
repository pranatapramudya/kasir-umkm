# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.95
**Fokus:** Integrasi & Sinkronisasi Filter Kategori pada Dashboard Superadmin

## 1. Deskripsi Bug
Pada halaman *Command Center Superadmin*, fitur *tab/button filter* untuk Master Data Tenant (Semua, F&B, Retail, Jasa/Servis) tidak berfungsi dengan baik. Saat kategori spesifik diklik, data tabel menjadi kosong atau tidak memuat data yang sesuai. 

## 2. Akar Masalah (Analisis untuk Agent)
Terdapat tiga kemungkinan kegagalan sinkronisasi yang harus segera diinvestigasi dan diperbaiki:
1. **Missing State/Query Params:** Komponen *tab* UI belum dihubungkan dengan *state* lokal (React `useState`) atau parameter URL (`?category=...`) untuk memicu *re-fetch* data.
2. **Backend Query Kurang Kondisi `where`:** Fungsi API atau *Server Action* yang mengambil data tenant (`prisma.store.findMany`) belum memasukkan klausa penyaringan berdasarkan *value* kategori.
3. **String Value Mismatch:** Terdapat ketidakcocokan *string* antara nilai yang dikirim oleh tombol *filter* (misal: "Retail") dengan nilai asli yang tersimpan di kolom *database* (misal: "Retail / Toko Kelontong").

## 3. Instruksi Eksekusi Mutlak untuk Agent
Lakukan perbaikan terintegrasi dari *Frontend* hingga *Backend*:

### A. Perbaikan Frontend (Tabel & Filter UI)
1. Buka komponen yang me-render tabel Master Data Tenant di halaman `/superadmin`.
2. Pastikan setiap tombol *filter* (Semua, F&B, Retail, Jasa) mengubah *state* aktif (misal: `const [filter, setFilter] = useState('Semua')`).
3. Jika menggunakan *Client Component*, pastikan tabel melakukan *filtering* dinamis terhadap *array* data yang diterima dari server, **ATAU** jika menggunakan *Server Component*, pastikan tombol filter melakukan *push router* dengan parameter kueri (contoh: `?category=fnb`).

### B. Pemetaan String yang Akurat (Mapping)
Buat fungsi pemetaan (*mapping*) atau gunakan metode pencarian `contains` (mengandung kata) agar filter tidak gagal hanya karena perbedaan format.
*   Tombol **"F&B"** harus mencocokkan nilai *database* `"F&B / Kuliner"`.
*   Tombol **"Retail"** harus mencocokkan nilai *database* `"Retail / Toko Kelontong"`.
*   Tombol **"Jasa/Servis"** harus mencocokkan nilai *database* `"Jasa / Servis"`.

### C. Perbaikan Backend (Prisma Query)
Ubah kueri Prisma pada *endpoint* atau fungsi pengambil data tenant tersebut. Tambahkan kondisi `where` yang dinamis:
*   Jika filter adalah "Semua" (atau kosong), ambil seluruh data.
*   Jika filter spesifik dipilih, terapkan penyaringan: `where: { category: { contains: valueFilter } }` atau pencocokan *exact match* sesuai dengan struktur *schema* Prisma.

## 4. Output yang Diharapkan
Terapkan logika *filtering* ini secara utuh. Berikan konfirmasi kepada *developer* bahwa *tab* filter di *Command Center* sekarang sudah hidup dan berhasil memisahkan *tenant* berdasarkan kategorinya tanpa menampilkan tabel kosong.
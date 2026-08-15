# Product Requirements Document: PJTECH KASIR UMKM (LumeStack Engine)
**Versi:** 0.2.72
**Fokus:** Multi-Tenant Security (Anti-Bocor), Dinamisasi Nama Kasir di Struk, & SEO Metadata (4 Pilar Bisnis)

## 1. Analisis Masalah (Kritikal & Marketing)
1. **Risiko Keamanan (Tenant Data Leakage):** Terdapat celah arsitektural di mana data transaksi/karyawan dari suatu toko berisiko bocor atau dapat diakses oleh toko lain jika *query database* tidak diisolasi secara ketat (*Multi-Tenant Security*).
2. **UX Struk Pembayaran:** Nama kasir pada struk cetak masih bersifat statis (belum mengikuti nama *user* yang sedang *login* untuk mengoperasikan kasir).
3. **Kekurangan SEO:** Metadata aplikasi belum mengindeks kapabilitas sistem untuk operasional penyewaan (Rental/Travel) sebagai pelengkap 4 pilar utama, serta belum mengoptimalkan kata kunci sebagai produk *premium SaaS boilerplate*.

## 2. Instruksi Eksekusi (Backend, Auth Session, & Metadata API)
**Target File:** Komponen Cetak Struk (Receipt), API Routes (Prisma Queries), dan file *Root* Metadata (`app/layout.tsx` atau `app/page.tsx`).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Penguncian Isolasi Data (Anti-Bocor Mutlak):**
1. Audit SEMUA *query* Prisma (`findMany`, `findFirst`, `update`, `delete`) untuk entitas Karyawan, Transaksi, Produk, Layanan, dan Armada.
2. **WAJIB:** Setiap operasi *database* HARUS menyertakan filter identitas penyewa, misalnya `where: { storeId: currentUser.storeId }` (atau atribut relasi *tenant/owner* terkait dari *session*).
3. Pastikan tidak ada satupun data yang ter-*query* secara publik tanpa memfilter pemilik aslinya. Data antar-toko (kamar) tidak boleh saling tumpang tindih atau bocor sama sekali.

**B. Dinamisasi Nama Kasir di Struk (Global):**
1. Tarik properti `name` dari *session* pengguna yang sedang aktif (via `next-auth` atau mekanisme token Anda).
2. Injeksi variabel nama tersebut ke dalam komponen desain Struk Pembayaran untuk SEMUA kategori bisnis (Retail, F&B, Jasa, Rental/Travel). Hapus teks *hardcoded* statis pada bagian nama Kasir.

**C. Optimasi SEO & Metadata (Next.js):**
1. Temukan objek `export const metadata: Metadata` pada file *layout* utama.
2. Perbarui properti `title` dan `description` agar merepresentasikan 4 pilar aplikasi. 
   - *Contoh Deskripsi:* "Premium SaaS Boilerplate & Aplikasi Kasir POS UMKM modern. Mendukung penuh operasional bisnis Retail, F&B, Jasa (Salon/Klinik), dan kalender jadwal Booking untuk Rental/Travel."
3. Tambahkan properti `keywords`: "Aplikasi kasir rental mobil, Sistem POS travel, Aplikasi kasir jasa, SaaS premium boilerplate, Kasir Retail UMKM, Software booking operasional".
4. Perbarui `OpenGraph` (OG) dan `Twitter` meta tags agar pratinjau tautan (*link preview*) menampilkan deskripsi komprehensif tersebut.

Silakan eksekusi seluruh perbaikan arsitektur keamanan, UX struk, dan SEO ini secara serentak dan pastikan *build* berhasil tanpa *error*!
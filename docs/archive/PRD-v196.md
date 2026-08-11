# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.96
**Fokus:** Implementasi Fitur Ekspor Data Tenant (Tarik Data CSV) & Indikator Status ON/OFF

## 1. Objektif Fitur
Menambahkan kemampuan bagi `SUPERADMIN` untuk menarik (mengunduh) keseluruhan Master Data Tenant dalam format CSV/Excel. Data yang diekspor harus mencakup rincian dasar toko beserta penanda status "ON" (Aktif/Trial/Pro) atau "OFF" (Kedaluwarsa/Tidak Aktif) secara mutlak.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Penambahan UI (Frontend)
1. Buka file halaman *Command Center Superadmin* (contoh: `app/superadmin/page.tsx` atau komponen tabel terkait).
2. Tambahkan sebuah tombol **"Tarik Data (CSV)"** atau ikon *Download*. Letakkan di area yang strategis (misalnya di sebelah kanan teks "Master Data Tenant" atau sejajar dengan *tab filter* kategori).
3. Buat fungsi `handleExport` yang akan melakukan *fetch* ke *endpoint* API khusus ekspor dan memicu unduhan *file* `.csv` di *browser* pengguna. Tambahkan *state loading* (`isExporting`) pada tombol tersebut untuk mencegah klik ganda.

### B. Pembuatan API Route Ekspor (Backend)
1. Buat atau modifikasi *endpoint* khusus (contoh: `app/api/superadmin/export-tenants/route.ts`).
2. **Validasi Otorisasi Mutlak:** Pastikan rute ini dilindungi. Hanya pengguna dengan *role* `SUPERADMIN` yang diizinkan mengaksesnya (kembalikan status 403 jika diakses oleh Owner/Cashier).
3. **Pengambilan Data (Prisma):** Lakukan *query* ke tabel `Store`/`Tenant`, lalu *include* (sertakan) relasi ke tabel `Subscription` untuk mengecek masa aktif paket.
4. **Logika Kalkulasi Status (ON/OFF):** 
   * Petakan (*map*) setiap data hasil *query*.
   * Tentukan variabel `statusOnOff`.
   * **ON:** Jika langganan berstatus `TRIAL` yang belum *expired*, atau paket `PRO` (berbayar) yang masa aktifnya (`endDate`) masih berlaku.
   * **OFF:** Jika tidak ada data langganan sama sekali, atau `endDate` sudah terlewati (Expired).
5. **Format Respons (CSV):** Susun data tersebut menjadi *string* berformat CSV dengan *header* kolom standar (No, Nama Toko, Kategori, Telepon, Tanggal Daftar, Status Paket, Status Sistem [ON/OFF], Omset).
6. Kembalikan *response* dengan *header* HTTP yang tepat agar dikenali *browser* sebagai unduhan *file* lampiran (`Content-Disposition: attachment; filename="Data_Tenant_PJTECH.csv"`, `Content-Type: text/csv`).

## 3. Output yang Diharapkan
Terapkan penambahan tombol di antarmuka Superadmin dan buatkan *route handler* API-nya. Berikan konfirmasi singkat bahwa fitur "Tarik Data" sudah aktif dan siap digunakan untuk mengekspor status ON/OFF tenant.
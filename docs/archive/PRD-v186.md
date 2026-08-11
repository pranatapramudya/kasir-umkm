# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.85 (Revisi Otorisasi Tenant)
**Fokus:** Perbaikan Bug Validasi Akses Pembuatan Akun Kasir untuk Owner/Tenant Bisnis

## 1. Deskripsi Bug
Saat pengguna asli (Owner/Tenant bisnis) mencoba membuat akun kasir baru melalui modal form, *request* ditolak dengan pesan *error*: **"Akses ditolak: Hanya Owner yang dapat membuat akun kasir."**

## 2. Akar Masalah
Sistem API saat ini menggunakan pengecekan *role* secara kaku (*hardcoded whitelist*). Pada sistem *multi-tenant*, akun pemilik bisnis yang baru mendaftar umumnya tidak memiliki klaim *role* eksplisit bernama "OWNER" (nilainya sering kali `undefined`, karena mereka dikenali dari `userId` atau struktur *tenant* Clerk). Validasi kaku ini menyebabkan sistem gagal mengenali pemilik toko asli dan malah memblokir mereka.

## 3. Instruksi Eksekusi Mutlak untuk Agent
1. Lakukan pencarian global untuk teks error: `"Akses ditolak: Hanya Owner yang dapat membuat akun kasir."` untuk menemukan *endpoint* API atau *Server Action* yang bermasalah.
2. Rombak logika validasi otorisasinya. **Hentikan** penggunaan logika *Whitelist* kaku yang mencari teks spesifik "OWNER".
3. Terapkan logika *Blacklist* yang aman (seperti pada *middleware*): Tolak akses **HANYA** jika *role* pengguna tersebut terdeteksi secara eksplisit sebagai `"CASHIER"`. Jika *role* kosong/`undefined`, asumsikan dia adalah pemilik *tenant* yang sah.
4. Terapkan perbaikan kode tersebut langsung ke dalam *codebase* dan konfirmasi nama file yang telah diubah.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.87
**Fokus:** Perbaikan Logika Redirect Root (Beranda) untuk Karyawan vs Owner

## 1. Deskripsi Bug Kritis
Saat akun Karyawan/Kasir berhasil login di pintu utama, sistem malah mengarahkannya ke halaman Onboarding (Pembuatan Toko Baru). Seharusnya, Karyawan langsung diarahkan ke halaman Kasir/POS dari toko tempat ia dipekerjakan.

## 2. Akar Masalah
File yang mengatur *redirect* awal setelah login (biasanya di `app/page.tsx` pada rute root, atau di dalam `layout.tsx` utama) hanya melakukan pengecekan `db.store.findFirst({ where: { userId } })`. 
Karena Karyawan bukan pemilik toko (userId mereka tidak ada sebagai pembuat toko), sistem menganggap mereka adalah pengguna baru dan melemparnya ke `/onboarding`.

## 3. Instruksi Eksekusi Mutlak untuk Agent
1. **Temukan File Pengatur Redirect:** Cari file yang bertanggung jawab menendang pengguna ke `/onboarding` saat `store` tidak ditemukan (biasanya `app/page.tsx` di *root*).
2. **Rombak Logika Pengecekan Database (Prisma):**
   * **Langkah 1:** Cek apakah pengguna adalah *Owner* (cari toko berdasarkan `userId`). Jika ya, arahkan ke *Dashboard* utamanya (`/${store.id}` atau rute dashboard yang sesuai).
   * **Langkah 2 (YANG HILANG):** Jika BUKAN *Owner*, lakukan *query* ke Prisma untuk mengecek apakah `userId` tersebut terdaftar sebagai Karyawan/Kasir di tabel yang sesuai (misalnya tabel `Employee`, `Staff`, atau relasi *Store*).
   * **Langkah 3:** Jika pengguna terdeteksi sebagai Karyawan, dapatkan `storeId` tempat ia bekerja, lalu **Arahkan langsung ke halaman Kasir** (misal: `/kasir` atau `/${storeId}/kasir`).
   * **Langkah 4:** Jika pengguna BUKAN Owner dan BUKAN Karyawan (benar-benar akun baru murni), barulah arahkan ke `/onboarding`.

## 4. Output
Terapkan perbaikan pada file root *redirect* tersebut. Berikan konfirmasi nama file yang diubah dan pastikan Karyawan tidak akan pernah melihat halaman Onboarding lagi.
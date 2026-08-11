# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.08
**Fokus:** Sinkronisasi Kosmetik Status Langganan (UI Banner) & State Pricing Card

## 1. Deskripsi Bug
Terdapat ketidaksesuaian antarmuka (UX mismatch) setelah pengguna di-ACC untuk paket berbayar (contoh: Pro Tahunan + Hardware). 
1. *Banner* status di bagian atas masih menampilkan teks "Free Trial", meskipun tanggal kedaluwarsa sudah berhasil bertambah 1 tahun (364 hari).
2. *Toggle* pada kartu harga tidak mengingat paket pengguna dan selalu kembali (default) ke "Software Saja".
3. Tombol pada kartu harga yang sudah dibeli masih bisa diklik (menyarankan untuk beli lagi).

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Perbaikan Banner Status Langganan
1. Buka komponen yang me-render kotak status akun (contoh: `SubscriptionBanner.tsx` atau bagian atas `Cek Langganan`).
2. Buat fungsi pemetaan (*mapping*) dinamis berdasarkan kolom `subscriptionPlan` dari *database* (bukan di- *hardcode*).
   * Jika `FREE` / `TRIAL` -> Tampilkan **"Free Trial"**
   * Jika `PRO_SEMI_ANNUAL` -> Tampilkan **"Pro 6 Bulan"**
   * Jika `PRO_YEARLY` -> Tampilkan **"Pro 1 Tahun"**
   * Jika `PRO_YEARLY_BUNDLE` -> Tampilkan **"Pro 1 Tahun + Hardware"**
3. Tampilkan hasil pemetaan tersebut sebagai judul utama menggantikan teks statis "Free Trial".

### B. Perbaikan Logika Tombol & Toggle di Pricing Card
1. Buka komponen `PricingSection.tsx`.
2. Pastikan komponen ini menerima *props* `currentPlan` pengguna yang sedang *login* (didapat dari *database*).
3. **Default Toggle:** Pada *state* *toggle* Hardware (`const [isBundle, setIsBundle] = useState(...)`), ubah inisialisasi awalnya agar mendeteksi *currentPlan*: 
   `useState(currentPlan === 'PRO_YEARLY_BUNDLE')`.
4. **Tombol "Paket Aktif":** Buat logika *conditional rendering* pada tombol "Pilih 6 Bulan", "Pilih Tahunan", dan "Pilih Bundling".
   * Jika paket di kartu tersebut **SAMA DENGAN** `currentPlan` milik *user*, ubah teks tombol menjadi **"Paket Anda Saat Ini"** dan buat tombol tersebut menjadi *disabled* (berwarna abu-abu, tidak bisa diklik).

### C. Audit API ACC Superadmin
1. Buka API `app/api/superadmin/acc-tenant/route.ts` dan `app/api/superadmin/update-tenant/route.ts`.
2. Pastikan saat melakukan `prisma.tenant.update(...)`, kolom `subscriptionPlan` benar-benar diisi dengan nilai tipe paket yang diorder (*string* paket yang baru), BUKAN hanya mengubah `subscriptionStatus` menjadi `ACTIVE` dan `subscriptionEndsAt`.

## 3. Output yang Diharapkan
Konfirmasikan bahwa nama paket pada *banner* atas sudah sesuai dengan *database*. Pastikan *toggle* pada paket tahunan bergeser otomatis ke "Hardware" jika pengguna sedang dalam paket Bundle, dan tombol paket yang aktif tidak dapat dibeli ulang.
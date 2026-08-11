# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.83
**Fokus:** Perbaikan Bug Redirect Ilegal pada Rute Karyawan

## 1. Deskripsi Bug
Terdapat *bug* kritis pada navigasi *dashboard*. Ketika pengguna mengklik menu/tombol "Karyawan", halaman tidak terbuka, melainkan pengguna terus-menerus dipaksa kembali (*redirect/mental*) ke halaman "Kasir". 

## 2. Hipotesis & Area Investigasi
Kendala ini murni masalah *routing* atau otorisasi level halaman. Agen harus menginvestigasi tiga area berikut untuk menemukan akar masalah:
1.  **Komponen UI Navigasi (Sidebar/Menu):** Kesalahan penulisan `href` pada komponen `Link`.
2.  **Server Component / Page Level (`app/.../karyawan/page.tsx`):** Terdapat fungsi `redirect()` yang tidak ditangani dengan benar jika data *tenant* atau *role* kosong.
3.  **Middleware (`middleware.ts`):** Rute `/karyawan` secara tidak sengaja masuk ke dalam logika *redirect* yang memantulkan pengguna.

## 3. Instruksi Eksekusi Mutlak (Langkah Demi Langkah)

**LANGKAH 1: Audit Komponen Sidebar/Menu**
*   Cari file komponen yang menampung tombol "Karyawan" (biasanya di `components/Sidebar.tsx`, `components/Navigation.tsx`, atau sejenisnya).
*   Pastikan properti `href` pada tombol Karyawan mengarah ke *path* yang benar secara absolut (contoh: `href="/karyawan"` atau `href={`/${storeId}/karyawan`}`). Perbaiki jika salah.

**LANGKAH 2: Audit Halaman Karyawan (`page.tsx`)**
*   Buka file rute halaman karyawan (contoh: `app/(dashboard)/[storeId]/karyawan/page.tsx` atau `app/karyawan/page.tsx`).
*   Periksa apakah ada logika otorisasi seperti pengecekan `userId`, `storeId`, atau `role`. 
*   Jika terdapat kode seperti `if (!store) redirect('/kasir')` atau logika serupa, pastikan logika tersebut dievaluasi dengan benar. Jika pengecekan terlalu agresif atau datanya gagal di-*fetch*, perbaiki logika *query* Prisma-nya agar tidak langsung melempar pengguna.

**LANGKAH 3: Audit `middleware.ts`**
*   Buka kembali `middleware.ts`.
*   Pastikan rute Karyawan tidak terblokir oleh aturan yang salah. Pastikan rute yang diakses sudah sesuai dengan arsitektur *tenant* (jika menggunakan ID toko di URL).

**OUTPUT YANG DIHARAPKAN DARI AGEN:**
1.  Sebutkan file mana yang menyebabkan *redirect* ilegal tersebut.
2.  Berikan kode perbaikan untuk file tersebut.
3.  Jelaskan secara singkat (maksimal 2 kalimat) mengapa kode sebelumnya memicu tendangan balik (*bounce*) ke halaman Kasir.
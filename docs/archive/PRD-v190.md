# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.90 (Revisi Akurat)
**Fokus:** Perbaikan Bug 403 Forbidden pada API Langganan (Subscription) untuk Pengguna Baru

## 1. Deskripsi Bug
Saat pengguna baru (Owner) mencoba memilih paket langganan/trial, *endpoint* `POST /api/subscription/extend` merespons dengan status `403 Forbidden`. Hal ini menyebabkan pengguna gagal memulai langganan.

## 2. Akar Masalah
*Endpoint* `api/subscription/extend` kemungkinan masih menggunakan logika *Whitelist* kaku untuk otorisasi (misalnya `if (role !== 'OWNER' && role !== 'SUPERADMIN') return 403;`). 
Pengguna yang baru mendaftar belum memiliki klaim `role` di token Clerk mereka (nilainya `undefined`). Memblokir nilai `undefined` di rute ini menyebabkan *deadlock*: mereka tidak bisa berlangganan karena bukan OWNER, dan mereka tidak bisa menjadi OWNER karena gagal berlangganan.

## 3. Instruksi Eksekusi Mutlak untuk Agent
1. Buka file API yang menangani pemrosesan paket (misalnya `app/api/subscription/extend/route.ts` atau file sejenis berdasarkan log terminal).
2. **Rombak Logika Otorisasinya:**
   * Hapus pengecekan yang mewajibkan `role === 'OWNER'`.
   * Ganti menjadi logika *Blacklist*: **Tolak permintaan (403) HANYA jika `role === 'CASHIER'`**. 
   * Jika `role` adalah `undefined` atau kosong, **IZINKAN** permintaan tersebut untuk lanjut ke proses *database*, karena ini adalah pendaftar *tenant* baru yang sah.
   * *Contoh kode perbaikan:* `if (role === 'CASHIER') { return new NextResponse("Unauthorized", { status: 403 }); }`
3. Pastikan API tersebut berjalan lancar dan mengembalikan status 200 setelah berhasil memperbarui (upsert) data *Subscription* di Prisma.

## 4. Output yang Diharapkan
Terapkan perbaikan kode ini langsung pada *endpoint* tersebut dan berikan konfirmasi singkat.
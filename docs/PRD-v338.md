# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.38
**Fokus:** Total Eradication of FOUC / Stale SWR Cache (Strict Cache Key Isolation)

## 1. Analisis Masalah
Terjadi kebocoran visual (FOUC / Stale Data) selama beberapa milidetik saat pengguna bernavigasi antar menu (misalnya dari Dashboard ke Transaksi Sewa). Data/foto dari tenant atau sesi sebelumnya muncul sekejap sebelum menghilang. 
**Akar masalah:** Mekanisme *caching* di *client-side* (seperti SWR atau React Query) hanya menggunakan endpoint URL API (misal: `/api/products`) sebagai *Cache Key*. Akibatnya, memori cache membagikan data lama yang *stale* secara instan saat komponen di-*mount*, sebelum proses revalidasi di *background* selesai.

## 2. Instruksi Eksekusi (System-Wide Cache Isolation)
**Target File:** Seluruh komponen *Client* yang melakukan *data fetching* (Dashboard, Kasir, Kalender, dll), khususnya *Custom Hooks* atau instansi `useSWR` / `useQuery`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Audit & Refactor Semua Cache Key SWR/React Query:**
1. Lakukan audit menyeluruh pada seluruh *codebase* untuk mencari setiap pemanggilan `useSWR` (atau *library fetching* sejenis).
2. Ubah struktur argumen *Cache Key* yang awalnya hanya berupa String URL (contoh: `useSWR('/api/products', ...)`).
3. Ubah menjadi **Array/Tuple** yang secara ketat menyertakan identitas *tenant* saat ini (misal `storeId` atau `tenantId` dari sesi/konteks). 
   - Contoh representasi logika: `useSWR(['/api/products', aktifStoreId], ...)`
4. **Alasan Arsitektural:** Dengan menyematkan `storeId` ke dalam *Key*, sistem *cache* akan menganggap perpindahan toko/sesi sebagai *query* yang benar-benar baru, sehingga secara otomatis me- *render* state `isLoading` dan **mustahil** menampilkan data lama dari toko lain.

**B. Strict Wipe-on-Login (Pencegahan Ganda):**
1. Buka fungsi yang menangani navigasi *redirect* tepat setelah pengguna berhasil *Login* atau memicu perubahan profil toko.
2. Eksekusi pembersihan cache global (misal `mutate( () => true, undefined, { revalidate: false } )` untuk SWR) untuk memastikan memori benar-benar dikosongkan sebelum *routing* ke halaman Dashboard.

**C. Skeleton Screen Enforcement:**
1. Pastikan setiap komponen yang di- *refactor* di Poin A memunculkan komponen `<LoadingSkeleton>` atau status `isLoading` saat SWR sedang mengambil *query* dengan *Key* yang baru. Jangan biarkan UI merender kontainer kosong yang tiba-tiba "melompat" saat data masuk.

Silakan lakukan perombakan fundamental pada arsitektur *fetching* ini! Lapor kembali setelah seluruh *Cache Key* di aplikasi ini diisolasi menggunakan ID Tenant!
# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.44
**Fokus:** Bug Fix - Absolute URL pada Fitur Salin Link Booking (Jadwal Booking / Informasi Toko)

## 1. Analisis Masalah
Terdapat *bug* UX pada fitur penyebaran *link* publik (seperti terlihat pada menu "Jadwal Booking" atau "Informasi Toko"). Saat ini, input *readonly* dan tombol "Salin" hanya menghasilkan *Relative Path* (contoh: `/book/salon-cantik`). 
Karena *link* ini ditujukan untuk dibagikan ke platform eksternal (WhatsApp, Instagram), *link* wajib berformat *Absolute URL* (mencakup protokol dan domain, contoh: `https://www.pjtechumkm.com/book/salon-cantik`).

## 2. Instruksi Eksekusi (Dynamic Origin & Clipboard Mapping)
**Target File:** Komponen UI yang menampilkan *Link Booking Publik* (contoh: `JadwalBookingClient.tsx`, `InformasiTokoClient.tsx`, atau *header* jadwal).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Ambil Base URL secara Dinamis (Client-Side):**
1. Buka komponen yang me- *render* kolom "LINK BOOKING PUBLIK ANDA".
2. Jangan *hardcode* nama domain Vercel. Gunakan `window.location.origin` untuk mendapatkan *base URL* secara dinamis (sehingga aman digunakan di *localhost* maupun saat rilis di domain kustom).
3. **Peringatan Hydration:** Karena `window` hanya tersedia di *Client*, pastikan pengambilan asal (*origin*) ini dilakukan dengan aman (misal: disimpan dalam *state* yang di- *set* di dalam `useEffect`, atau langsung dipanggil di dalam fungsi *onClick* tombol Salin).

**B. Gabungkan Absolute URL:**
1. Rangkai *Full URL* dengan menggabungkan *Origin* dan *Slug* spesifik milik tenant saat ini.
   *(Format bayangan: `[origin]/book/[tenantSlug]`)*
2. **Strict Isolation:** Pastikan variabel *slug* yang digabungkan adalah benar-benar `slug` milik entitas toko/tenant yang sedang *login* saat ini (ditarik dari data SWR/Zustand tenant tersebut), agar tidak tertukar dengan URL toko lain.

**C. Terapkan pada UI & Fungsi Clipboard:**
1. Ubah teks yang ditampilkan di dalam kotak *input readonly* agar menampilkan *Absolute URL* secara utuh (memiliki `https://...`).
2. Ubah *payload* di dalam fungsi `navigator.clipboard.writeText()` agar menyalin *Absolute URL* tersebut, bukan lagi *relative path*.

Silakan perbaiki *bug* kecil namun krusial ini! Lapor kembali jika kolom teks dan tombol Salin sudah memproduksi *link* penuh yang siap disebar ke WhatsApp pelanggan!
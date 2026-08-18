# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.33
**Fokus:** Critical Bug Fixes (Client-side Exception, Calendar UI, & Modal Sizing)

## 1. Analisis Masalah (Bug Report)
Terdapat 3 isu kritis (*blocking bugs*) yang ditemukan pasca-rilis v0.3.32:
1. **Application Error (Client-side Exception):** Terjadi di halaman "Kalender Sewa". Kemungkinan besar disebabkan oleh *Hydration Mismatch* (manipulasi `Date` yang tidak konsisten antara SSR dan Client) atau ada *state realtime* Supabase yang me- *return* `undefined`.
2. **Calendar UI Terbaca Samar (Invisible Text):** Pada `RentalDatePicker.tsx`, angka tanggal kalender berwarna sangat pudar/putih di atas *background* putih. Selain itu, form "Mulai Sewa" dan "Selesai Sewa" tidak terasa menyatu.
3. **Buku Panduan Layout (Sempit):** Komponen `BukuPanduanModal.tsx` dirender di dalam kontainer Sidebar sehingga terjepit. Komponen ini harusnya berupa *Centered Overlay Modal* (Dialog).

## 2. Instruksi Eksekusi (Bug Bash)

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Fix Client-Side Exception (Kalender Sewa):**
1. Periksa komponen `app/admin/rental-calendar/RentalCalendarClient.tsx`.
2. **Hydration Fix:** Pastikan *rendering* tanggal/waktu (misalnya saat memformat `startDate`) dilakukan SETELAH komponen di- *mount* di *client* (gunakan `useEffect` atau ubah komponen agar murni merender data server tanpa mutasi Date lokal di awal render).
3. **Safety Check:** Tambahkan pengecekan *null/undefined* yang ketat (opsional chaining `?.`) saat melakukan *mapping* pada data *event* kalender dari API atau Supabase.

**B. Perbaikan UI Calendar (Tailwind & React-Day-Picker):**
1. Buka `RentalDatePicker.tsx`.
2. Hapus *styling* CSS yang membuat warna teks kalender pudar. Paksa penataan warna teks menggunakan *prop* `classNames` pada `DayPicker`:
   - `day: "text-gray-900"`
   - `day_selected: "bg-blue-600 text-white"`
   - `day_disabled: "text-gray-300 line-through bg-gray-50"`
3. **UX Improvement:** Daripada menggunakan dua Kalender terpisah (Mulai & Selesai), gabungkan menjadi satu komponen **Range Picker** (fitur bawaan `react-day-picker` dengan mode `"range"`). Pengguna cukup mengklik tanggal mulai lalu tanggal selesai dalam satu kalender yang sama.

**C. Perbaikan Modal Buku Panduan (Centering & Responsiveness):**
1. Buka komponen `BukuPanduanModal.tsx`.
2. Cabut elemen ini dari struktur *DOM* Sidebar. Gunakan mekanisme *Portal* atau *Fixed Overlay*.
3. Bungkus konten panduan dengan div pelindung:
   `className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"`
4. Buat kotak konten (Modal) di tengah:
   `className="w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto p-6"`
5. Pastikan tombol silang (`X`) untuk menutup berfungsi dengan baik.

Silakan lakukan perbaikan darurat (*hotfix*) ini! Lapor kembali jika error kalender sudah hilang, angka kalender terlihat jelas dengan mode *Range*, dan Buku Panduan muncul secara proporsional di tengah layar (baik di Desktop maupun Mobile)!
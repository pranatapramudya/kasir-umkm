# Product Requirements Document: PJTECH KASIR UMKM (LumeStack SaaS)
**Versi:** 0.3.32
**Fokus:** Double-Booking Prevention (Cinema-style Availability Blocking)

## 1. Analisis Masalah
Pada form booking publik (khusus tenant Rental/Travel), pengguna saat ini dapat memilih rentang tanggal yang berpotensi tumpang tindih (*overlap*) dengan pesanan orang lain pada armada yang sama. Menggunakan native `<input type="date">` tidak memungkinkan untuk menonaktifkan (*disable*) tanggal-tanggal spesifik yang sudah terisi. Diperlukan implementasi UI Kalender khusus (seperti pemesanan tiket bioskop) dan validasi di sisi backend (Prisma) untuk mencegah *race condition* (Siapa Cepat Dia Dapat).

## 2. Instruksi Eksekusi (Full Stack Availability Logic)
**Target File:** Endpoint API `/api/booking/availability` (Buat Baru), Endpoint `/api/booking` (Submit), dan Komponen Publik `BookingForm.tsx`.

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. API Ketersediaan Tanggal (Backend):**
1. Buat endpoint GET `/api/booking/availability?serviceId=XXX`.
2. Lakukan *query* menggunakan Prisma untuk mencari semua pesanan pada `serviceId` tersebut yang berstatus `PENDING`, `COMPLETED`, atau `IN_PROGRESS`.
3. Kembalikan *response* berupa *array* dari rentang tanggal yang sudah ter- *booking* (kumpulan `startDate` dan `endDate`).

**B. Ganti Native Date Input dengan React Calendar (Frontend):**
1. Di komponen `BookingForm.tsx`, hapus elemen bawaan `<input type="date">` untuk Mulai Sewa dan Selesai Sewa.
2. Ganti dengan komponen Kalender dari ekosistem Next.js/React yang Anda gunakan (contoh: *Calendar* dari Shadcn UI / `react-day-picker`).
3. Lakukan *fetch* ke endpoint `/api/booking/availability` saat komponen dimuat (berdasarkan armada yang dipilih).
4. Gunakan prop `disabled` pada komponen Kalender tersebut untuk me-nonaktifkan semua tanggal yang berada dalam rentang *array* pesanan yang sudah ada. Tanggal yang sudah dibooking harus terlihat abu-abu dan tidak dapat di-klik.

**C. Validasi Overlap "Siapa Cepat Dia Dapat" (Backend Submit):**
1. Buka fungsi POST yang menangani *submit* formulir di `/api/booking`.
2. Sebelum mengeksekusi `prisma.booking.create`, lakukan validasi *overlap* secara ketat.
3. Gunakan logika *Prisma query* berikut untuk mencari irisan jadwal:
   Cari pesanan dengan `serviceId` yang sama dan status aktif, di mana:
   `startDate <= jadwalSelesaiYangDirequest` AND `endDate >= jadwalMulaiYangDirequest`.
4. Jika hasil *query* menemukan data (artinya jadwal bentrok), tolak pesanan dengan mengembalikan *HTTP Status 400 Bad Request* dan pesan JSON: `"Maaf, armada sudah disewa pada tanggal tersebut. Silakan pilih jadwal lain."`

Silakan implementasikan lapisan keamanan jadwal ini! Lapor jika kalender di form publik sudah berhasil memblokir tanggal yang sudah terisi dan backend berhasil menolak *request* yang bentrok!
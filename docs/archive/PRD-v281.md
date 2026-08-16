# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.81
**Fokus:** UI/UX Development - Kalender Sewa Harian (Rental/Travel Module)

## 1. Konsep Fitur & Analisis UI/UX
Halaman "Kalender Sewa" pada aplikasi genggam (*mobile*) tidak boleh menggunakan desain *Gantt Chart* karena keterbatasan lebar layar. Solusi terbaik adalah menggunakan desain **Calendar-Agenda Split View**. 
Fitur ini berfungsi agar juragan rental dapat dengan cepat melihat hari apa saja yang penuh, armada/barang apa yang sedang keluar, dan siapa yang menyewa.

## 2. Instruksi Eksekusi (Frontend & UI Logic)
**Target File:** `app/admin/rental-calendar/page.tsx` (Menggantikan halaman *Under Construction* saat ini).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Pembuatan UI Kalender Bulanan (Bagian Atas):**
1. Bangun komponen Grid Kalender 7 kolom (Senin-Minggu). Anda bisa menggunakan *library* pengelolaan tanggal standar seperti `date-fns` atau `dayjs` dikombinasikan dengan UI Tailwind murni.
2. **Indikator Visual:** Berikan titik (*dot*) berwarna di bawah angka tanggal jika pada hari tersebut terdapat transaksi sewa yang aktif.
3. **Interaktivitas:** Tanggal yang dipilih (Active State) harus memiliki *background* lingkaran biru solid.

**B. Pembuatan UI Daftar Sewa / Agenda (Bagian Bawah):**
1. Di bawah komponen kalender, buat area *scrollable* untuk menampilkan daftar transaksi pada tanggal yang sedang dipilih (berdasarkan *state* tanggal aktif).
2. Desain kartu *Booking/Agenda* yang berisi informasi padat:
   - **Header Kartu:** Nama Item/Armada (misal: "Avanza G 2022") & Nama Penyewa.
   - **Waktu:** Jam/Tanggal Ambil s.d Jam/Tanggal Kembali.
   - **Status Badge (Warna Krusial):**
     - Kuning (`bg-yellow-100 text-yellow-700`): **"Booking/DP"**
     - Hijau (`bg-green-100 text-green-700`): **"Sedang Jalan/Aktif"**
     - Merah (`bg-red-100 text-red-700`): **"Terlambat/Overdue"**
     - Abu-abu (`bg-gray-100 text-gray-700`): **"Selesai"**

**C. Integrasi Layout Khusus Mobile:**
1. Pastikan area daftar kartu memiliki `padding-bottom` (misal: `pb-24`) agar kartu paling bawah tidak tertutup oleh *Bottom Navigation*.
2. Gunakan *Flexbox* secara disiplin (`min-w-0`, `truncate`) pada nama penyewa dan nama armada agar UI tidak rusak jika datanya panjang.

Silakan ganti halaman *Under Construction* tersebut dengan *layout Split View* ini! Gunakan data *dummy* (mock data) terlebih dahulu agar struktur visualnya bisa direview! Lapor jika sudah terpasang.
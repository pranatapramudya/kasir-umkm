# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.41
**Fokus:** Optimasi Filter Waktu Dashboard Khusus Karyawan

## 1. Objektif
Menyesuaikan default state pada filter waktu (Date Range Picker / Dropdown) di halaman Dashboard Ringkasan Bisnis agar lebih relevan dengan role pengguna. Karyawan harus fokus pada operasional harian.

## 2. Analisis UI/UX
Pada `image_7b0236.png`, Dashboard Karyawan secara default menampilkan data "Bulan Ini" (This Month). Secara logika bisnis POS, kasir hanya berkepentingan dengan data omzet shift/hari ini. Menampilkan omzet bulanan kepada kasir kurang relevan dan mengekspos terlalu banyak data agregat toko.

## 3. Eksekusi Perbaikan (State Management & Fetching)
**Target File:** Komponen Dashboard Analitik (`app/admin/dashboard/page.tsx` atau komponen filter yang merender dropdown "Bulan Ini").
**Instruksi Eksekusi:**
1. Tambahkan pengecekan role di inisialisasi state filter. JIKA user yang mengakses adalah Karyawan (berdasarkan session atau query DB `employee`), atur nilai awal (default state) filter menjadi `"Hari Ini"` (`today`).
2. JIKA user adalah Owner, pertahankan default state `"Bulan Ini"` (`this_month`).
3. (Opsional/Direkomendasikan) Untuk Karyawan, Anda bisa me-lock (disable) opsi dropdown tersebut agar mereka hanya bisa melihat data "Hari Ini", atau biarkan mereka bisa mengganti namun state awalnya wajib "Hari Ini".
4. Pastikan query Prisma yang mengambil total pendapatan dan transaksi merespons perubahan filter "Hari Ini" ini dengan akurat (memfilter `createdAt` dari jam 00:00 hingga 23:59 hari ini).

Silakan terapkan optimasi filter ini.
# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.01
**Fokus:** Perbaikan UI Grid Kalender & Auto-Load Agenda Hari Ini

## 1. Analisis Masalah
1. **Header Kalender Tidak Presisi:** Baris nama hari (Senin, Selasa, dst.) pada Kalender Sewa tidak sejajar dengan kotak tanggal di bawahnya, atau bahkan terpotong/hilang akibat kesalahan *CSS Grid/Flexbox* setelah penambahan kelas *sticky*.
2. **UX Agenda Tidak Otomatis:** Saat halaman Kalender Sewa pertama kali dimuat, detail Agenda di bagian bawah menampilkan status "Kosong". Pengguna harus mengeklik tanggal secara manual untuk melihat data. Seharusnya, sistem secara otomatis memuat dan menampilkan agenda untuk "Hari Ini" (*Today*) pada saat render pertama.

## 2. Instruksi Eksekusi (Frontend Layout & State Management)
**Target File:** `app/admin/rental-calendar/page.tsx` (atau komponen Kalender utama).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Perbaikan Presisi CSS Grid Kalender:**
1. Periksa kontainer baris header nama hari (Sen, Sel, Rab, dst).
2. Pastikan kontainer tersebut menggunakan kelas `grid grid-cols-7` yang sama persis dengan kontainer daftar tanggal (body kalender).
3. Samakan nilai `gap`, `padding`, dan pembungkus luar (*wrapper*) agar kolom header dan kolom tanggal sejajar sempurna dari kiri ke kanan.

**B. Auto-Load State Agenda Hari Ini:**
1. Cari *state* yang menyimpan tanggal yang sedang dipilih (misalnya `const [selectedDate, setSelectedDate] = useState(...)`).
2. Ubah nilai inisialisasinya dari `null` atau string kosong menjadi objek tanggal hari ini (contoh: `useState(new Date())`).
3. Pastikan fungsi/logika yang memfilter array `bookings/orders` untuk ditampilkan di daftar Agenda bereaksi terhadap inisialisasi awal ini. 
4. Dengan demikian, jika hari ini (saat halaman dibuka) terdapat jadwal penyewaan yang sedang aktif/jalan, detail kartu agenda tersebut akan langsung muncul di bawah kalender tanpa memerlukan *event onClick* dari pengguna.

Silakan ratakan *layout grid* kalendernya dan buat state agendanya lebih pintar! Lapor jika sudah dieksekusi dengan sempurna!
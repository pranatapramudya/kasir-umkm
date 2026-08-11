# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.53
**Fokus:** Modernisasi Komponen UI Dropdown (Custom Select) untuk Filter Periode

## 1. Analisis UI/UX
*   **Masalah Saat Ini:** Komponen pemilih periode ("Hari Ini", "Bulan Ini", dll) masih menggunakan elemen HTML `<select>` bawaan peramban (*native browser styling*). Tampilannya sangat kaku, memiliki latar belakang *hover* biru standar (seperti pada Windows lama), dan merusak estetika *premium* aplikasi.
*   **Tujuan:** Mengganti elemen *native* tersebut dengan *Custom Dropdown* yang dibangun sepenuhnya menggunakan elemen `div`/`ul` dengan bantuan *state management* React dan *styling* Tailwind CSS modern.

## 2. Instruksi Eksekusi Frontend untuk AI Agent
Tugas Anda adalah menulis ulang (*rewrite*) struktur komponen *Dropdown* Periode tanpa merusak fungsi pemilihan rentang waktunya. DILARANG KERAS menggunakan tag `<select>` dan `<option>`.

### A. Rombak Struktur Komponen (State & Trigger)
*   **Target File:** Komponen yang menampung filter tanggal/periode (misal di halaman Dasbor Utama atau Analitik).
*   **Instruksi Logika:**
    1.  Buat *state* baru untuk mengontrol buka/tutup menu (contoh: `const [isOpen, setIsOpen] = useState(false)`).
    2.  Ubah pemicu (*trigger*) yang tadinya berupa `<select>` menjadi sebuah tombol (`<button>` atau `<div>` dengan `onClick={() => setIsOpen(!isOpen)}`).

### B. Styling Tombol Trigger (Tailwind)
*   Desain tombol pemicu agar terlihat elegan. Gunakan *class* Tailwind berikut sebagai panduan:
    `flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200`.
*   Tampilkan nilai periode yang sedang aktif di dalam tombol ini, didampingi ikon kalender di kiri dan ikon *chevron-down* (panah bawah) di kanan.

### C. Desain Menu Dropdown Absolut (Popover)
*   Menu opsi harus melayang (*floating*) di bawah tombol *trigger*.
*   **Kontainer Menu:** Gunakan posisi absolut dengan *z-index* tinggi:
    `absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200`.
*   **Item Opsi (List):** Setiap pilihan ("Hari Ini", "Bulan Ini", "Tahun Ini", "Pilih Manual...") harus dirancang sebagai *div* atau *button* interaktif:
    `block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer`.
*   **Active State:** Jika sebuah opsi sedang terpilih, berikan gaya penanda (misalnya latar belakang abu-abu sangat muda atau teks yang lebih tebal `font-semibold text-blue-600`).

### D. UX Handling (Click Outside)
*   Tambahkan fungsionalitas UX standar: Menu *dropdown* harus otomatis tertutup (`setIsOpen(false)`) jika pengguna mengklik area di luar komponen *dropdown* tersebut atau saat salah satu opsi dipilih.
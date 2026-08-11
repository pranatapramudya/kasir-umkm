# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.54
**Fokus:** BUGFIX Visual - Dropdown Menu Terpotong (Overflow Clipping)

## 1. Analisis Bug Tata Letak
*   **Gejala Visual:** Daftar menu dari *custom dropdown* periode ("Hari Ini", "Bulan Ini", dst.) terpotong secara horizontal tepat di garis batas bawah kartu kontainer "Analitik & Laporan Premium".
*   **Akar Masalah (Layout Engine):** Kartu kontainer induk (*parent*) memiliki aturan gaya CSS yang secara agresif menyembunyikan elemen yang meluap (*overflow*). Akibatnya, menu *dropdown* yang dirancang melayang (absolut) ke arah luar batas kotak menjadi korban pemangkasan *rendering*.

## 2. Instruksi Eksekusi Logika untuk AI Agent
Sebagai agen pengembang, tugas Anda adalah memperbaiki konflik batas kontainer ini murni melalui penyesuaian utilitas tata letak Tailwind CSS. Jangan merombak struktur *state* React yang sudah berjalan.

### A. Pembebasan Batas Kontainer Induk
*   **Target:** Elemen pembungkus paling luar (kartu latar putih) dari *header* Analitik.
*   **Instruksi Logika:** Inspeksi kontainer ini. Anda harus mencari dan menghapus aturan utilitas yang mengunci luapan elemen (seperti penyembunyian *overflow*). Kontainer harus diatur agar membiarkan elemen anaknya bebas menembus batas bawah tanpa terpotong, namun tetap mempertahankan lekukan sudut (*border-radius*) kartu.

### B. Eskalasi Lapisan Dropdown (Stacking Context)
*   **Target:** Elemen kontainer melayang (*popover*) yang berisi daftar pilihan periode.
*   **Instruksi Logika:** Setelah kontainer induk dibebaskan, pastikan elemen menu melayang ini diberi nilai lapisan tumpukan (elevasi visual/Z-Index) yang lebih tinggi daripada elemen mana pun di halaman tersebut. Ini memastikan bahwa ketika menu terbentang ke bawah, menu tersebut akan menutupi kartu-kartu grafik di bawahnya, bukan malah menyelip di belakangnya.

### C. Validasi Quality Assurance (QA)
*   Simulasikan klik pada pemilih periode di lingkungan lokal Anda.
*   Menu opsi harus terbentang penuh 100% ke bawah.
*   Bayangan (*drop shadow*) dari menu *dropdown* juga tidak boleh terpotong oleh garis batas kartu *header*.
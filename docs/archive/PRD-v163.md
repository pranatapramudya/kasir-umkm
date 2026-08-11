# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.63
**Fokus:** Relokasi Secret Backdoor ke Landing Page (Login Card)

## 1. Analisis UX Super Admin
*   **Koreksi Alur:** Super Admin (Founder) tidak seharusnya diwajibkan melewati alur *Onboarding* (membuat *dummy tenant*) hanya untuk mengakses sistem. 
*   **Solusi:** Pintu rahasia (*Secret Backdoor*) harus diletakkan di halaman *Landing Page* / *Auth Page*, spesifik pada area kartu selamat datang (sebelah kanan), sehingga Super Admin dapat langsung melompat ke *Command Center* setelah terautentikasi.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Pindahkan logika *backdoor* dari *Sidebar* aplikasi ke *Landing Page*. DILARANG memberikan *output* kode mentah.

### A. Relokasi Pintu Rahasia (Easter Egg)
*   **Target File:** Komponen *Landing Page* atau *Custom Sign-in Page* yang menampilkan layout pada gambar (kemungkinan `app/page.tsx` versi *public*, atau komponen di dalam folder `app/(auth)`).
*   **Instruksi:**
    1. Cari elemen teks/logo **"PJTECH KASIR UMKM"** yang berada di dalam kartu/kotak putih sebelah kanan (tepat di atas teks "Selamat Datang").
    2. Bungkus teks tersebut dengan komponen `<Link href="/superadmin">`.
    3. **Penting:** Pastikan desain teks TIDAK BERUBAH. Jangan ada garis bawah (*underline*), jangan berubah warna menjadi biru *link*. Harus tetap membaur seperti teks statis biasa (*stealth mode*).
    4. *Note Keamanan:* Karena `middleware.ts` sudah kita amankan untuk *route* `/superadmin`, meskipun pengguna biasa tidak sengaja mengklik teks ini, mereka akan otomatis ditendang kembali oleh sistem.

### B. Hapus Backdoor Lama (Opsional tapi Direkomendasikan)
*   **Target File:** `components/SidebarClient.tsx`
*   **Instruksi:** Kembalikan teks `est 2026 PJTECH` di *sidebar* menjadi teks statis biasa (hapus tautan `/superadmin` yang sebelumnya dibuat di PRD-v162), agar *codebase* tetap bersih.

Silakan eksekusi pemindahan pintu rahasia ini ke garda terdepan (*Landing Page*)!
# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.50
**Fokus:** Restorasi & Optimasi UI/UX Trigger Paywall (Upgrade to Pro)

## 1. Analisis Kebutuhan UI/UX
*   **Desktop Constraint:** Kartu *upgrade* di bagian bawah *sidebar* (saat ini berwarna kuning pucat) terlihat kurang menyatu dengan desain premium dasbor. Perlu diubah menjadi elemen visual yang lebih eksklusif (*premium feel*).
*   **Mobile Constraint:** Tombol *upgrade* hilang dari tampilan *mobile*. Area *bottom navigation* sudah penuh (5 item). Tombol pemanggil *paywall* harus dipindahkan ke area *header* atas agar mudah diakses tanpa merusak tata letak.
*   **Tujuan Logika:** Mengembalikan fungsi tombol agar ketika diklik, sistem memunculkan kembali Modal Paywall 3 Paket (Pricing Tiers) yang pernah dibuat sebelumnya.

## 2. Instruksi Eksekusi UI/UX untuk AI Agent
Terapkan perubahan desain ini menggunakan Tailwind CSS pada komponen *Sidebar* dan *Header*.

### A. Optimasi Sidebar Card (Khusus Desktop)
*   **Target File:** Komponen Sidebar (contoh: `components/Sidebar.tsx` atau `app/admin/layout.tsx`).
*   **Instruksi Styling:**
    1. Ganti latar belakang kartu "Paket Basic" di bagian bawah *sidebar* dari kuning menjadi gradasi gelap yang elegan: 
       `bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white shadow-lg mx-4 mb-4`.
    2. Ubah teks judul menjadi: `<h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">👑 Akses Pro</h4>`.
    3. Ubah deskripsi menjadi: `<p className="text-[10px] text-slate-300 mt-1 mb-3">Buka semua fitur analitik lanjutan & laporan Excel.</p>`.
    4. Rombak tombol CTA: `<button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold py-2 rounded-lg transition-colors">Upgrade Sekarang</button>`.

### B. Pembuatan Header Badge (Khusus Mobile)
*   **Target File:** Komponen Top Header/Navbar untuk tampilan Mobile.
*   **Instruksi Styling:**
    1. Di sebelah kiri foto profil pengguna (avatar) di sudut kanan atas, tambahkan sebuah tombol *badge* ringkas.
    2. Terapkan kelas Tailwind: `flex md:hidden items-center gap-1 border border-amber-400 bg-amber-50/50 text-amber-600 px-2 py-1 rounded-full text-[10px] font-bold shadow-sm`.
    3. Isi teks tombol dengan: `👑 Pro`.

### C. Restorasi Logika Paywall
*   Pastikan kedua tombol di atas (di Sidebar Desktop dan di Header Mobile) memiliki *event handler* `onClick`.
*   Ikat `onClick` tersebut ke *state* yang berfungsi untuk merender Modal Pricing (misalnya `onClick={() => setShowPaywall(true)}`).
*   Pastikan komponen Modal Paywall 3 Paket sudah di-*import* kembali ke dalam *layout* ini.
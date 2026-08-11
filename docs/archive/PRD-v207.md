# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.2.07
**Fokus:** Optimasi Performa Checkout (Mengatasi Delay 30 Detik) & Loading State

## 1. Objektif
Menghilangkan *delay* panjang (lambatnya respons) saat pengguna mengklik tombol "Kirim Bukti via WhatsApp" pada saat memilih paket langganan. Memastikan transisi ke halaman `/pending-approval` terjadi secara instan dengan memberikan indikator *loading* visual agar pengguna tidak mengklik tombol berulang kali.

## 2. Instruksi Eksekusi Mutlak untuk Agent

### A. Audit & Optimasi Backend (API Pending)
1. Buka rute `app/api/subscription/pending/route.ts`.
2. **Hapus Beban Eksternal:** Pastikan di dalam API ini **TIDAK ADA** pemanggilan ke API pihak ketiga yang berat seperti `clerkClient.users.updateUserMetadata` atau pengiriman email. 
3. API ini HANYA boleh melakukan satu operasi *database* yang sangat ringan: `prisma.tenant.update(...)` (atau tabel terkait) untuk mengubah `subscriptionStatus` menjadi `PENDING`.
4. Kembalikan respons sukses (`NextResponse.json`) seketika setelah operasi Prisma selesai.

### B. Implementasi Loading State (Frontend)
1. Buka komponen UI tempat tombol pembayaran berada (contoh: `PricingSection.tsx` atau Modal Pembayaran).
2. Tambahkan *state* React untuk *loading*: `const [isLoading, setIsLoading] = useState(false)`.
3. Pada fungsi `onClick` tombol "Kirim Bukti via WhatsApp":
   * Set `setIsLoading(true)` di awal fungsi.
   * Panggil API `fetch`.
   * Setelah `await fetch` selesai, eksekusi `window.open(waLink, '_blank')` dan `router.push('/pending-approval')`.
   * Set `setIsLoading(false)` pada blok `finally`.
4. Ubah tampilan tombol saat `isLoading` menjadi "Memproses..." dan nonaktifkan tombol (`disabled={isLoading}`) agar mencegah *multiple clicks*.

### C. Mitigasi Popup Blocker
Karena fungsi `window.open` dipanggil setelah `await fetch` (proses *async*), *browser* sering kali menganggapnya sebagai *popup* ilegal dan memblokirnya.
**Solusi Terbaik:**
1. Sebelum `fetch` dipanggil, buka *tab* kosong terlebih dahulu: `const newTab = window.open('about:blank', '_blank');`
2. Lakukan `await fetch(...)`.
3. Jika *fetch* berhasil, ubah URL *tab* baru tersebut ke tautan WhatsApp: `newTab.location.href = waLink;`
4. Arahkan *tab* utama: `router.push('/pending-approval');`

## 3. Output yang Diharapkan
Terapkan penyederhanaan logika API dan indikator *loading* di *frontend*. Berikan konfirmasi bahwa proses *checkout* WhatsApp kini berjalan sangat cepat tanpa jeda puluhan detik dan aman dari pemblokiran *popup browser*.
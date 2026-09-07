# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.66  
**Fokus:** Real-Time Mobile Order Badge, Haptic Vibration & Dual-Tone Web Audio Chime Suite

## 1. Latar Belakang & Kebutuhan
Sebelumnya, sistem Kasir UMKM PJTech telah memiliki polling SWR untuk memantau pesanan masuk pada sidebar layar desktop, namun komponen navigasi bawah (*Bottom Navigation*) pada layar mobile belum memilikinya. Hal ini menyebabkan kasir atau operator toko yang mengoperasikan kasir melalui smartphone rentan melewatkan pesanan masuk (*incoming booking/order*). Diperlukan indikator visual yang responsif tanpa merusak tata letak mobile, disertai notifikasi getar (haptic) dan audio alert yang ramah (*chime bell*).

## 2. Solusi & Fitur yang Diterapkan

### A. SWR Polling & Red Badge di Mobile Bottom Nav (`components/BottomNavClient.tsx`)
- **Polling Terjadwal:** Terintegrasi dengan endpoint `/api/booking/pending-count` setiap 10 detik secara reaktif di latar belakang.
- **Zero Layout Shift:** Indikator badge merah dirender menggunakan posisi `absolute` di dalam kontainer ikon (`relative`). Hal ini memastikan tidak ada pergeseran (*layout shift*) atau distorsi ukuran tombol flexbox/grid pada navigasi bawah ponsel, bahkan di layar kompak (< 375px).
- **Format & Tampilan Dinamis:**
  - Badge disembunyikan sepenuhnya saat `pendingCount === 0` atau data belum termuat.
  - Menampilkan angka pesanan secara presisi, dengan batas nilai maksimal `"99+"` saat pesanan melebihi 99.
  - Dilengkapi border putih berkontras tinggi (`border-2 border-white`), bayangan lembut, dan animasi entrance `animate-in zoom-in duration-200`.
- **Navigasi Cerdas 2 Tingkat:**
  - Jika menu pesanan berada di tab utama (misal: "Pesanan Online"), badge langsung tampil di atas ikon tersebut.
  - Jika menu pesanan berada di dalam tombol **"Lainnya"**, badge indikator otomatis muncul di atas tombol "Lainnya" sekaligus di dalam drawer *sheet* "Menu Lainnya".

### B. Dual-Tone Web Audio Chime Bell (`lib/audio.ts`)
- **Harmonic Ascending Chime:** Menggunakan Web Audio API murni (*sine wave*) dengan transisi nada harmonik ceria dari **A5 (880 Hz)** ke **D6 (1174.66 Hz)** disertai *decay* eksponensial lembut.
- **Zero Asset Overhead:** Tidak memerlukan file `.mp3` eksternal dari CDN/server, menghilangkan latensi jaringan dan menghemat kuota internet kasir.
- **Autoplay & Browser Policy Safe:** Dibungkus dalam blok `try...catch` serta otomatis memanggil `ctx.resume()` saat terdeteksi status suspended oleh browser.
- **Anti-Echo Debounce (2 Detik):** Dilengkapi *throttle timestamp* 2000 ms sehingga saat Desktop Sidebar dan Mobile Bottom Nav sama-sama mendeteksi pertambahan pesanan, nada notifikasi **hanya berbunyi tepat 1 kali** tanpa gema.

### C. Haptic Tactile Feedback
- Mengintegrasikan API `navigator.vibrate([120, 80, 120])` pada perangkat mobile yang mendukung, memberikan umpan balik getaran taktil instan ketika ada pesanan baru masuk.

### D. Reusable Hook & Sinkronisasi Desktop (`hooks/usePendingBookingCount.ts` & `components/SidebarClient.tsx`)
- Mengenkapsulasi logika SWR, deteksi kenaikan angka pesanan (`currentCount > prevCount`), proteksi initial page reload, dan pemutaran audio ke dalam custom hook `usePendingBookingCount`.
- Menerapkan hook yang sama pada `SidebarClient.tsx` sehingga kasir di desktop maupun mobile mendapatkan pengalaman alert yang terpadu secara konsisten.

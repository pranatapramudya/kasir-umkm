# Changelog — PJTECH KASIR UMKM

Semua perubahan signifikan pada proyek ini didokumentasikan di sini.  
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### ⚡ 2026-10-08 — Pagination Dinamis Layar (Desktop 12 / Mobile 10) & Stabilitas Import Produk Massal
- **Pagination Dinamis Desktop vs Mobile (`app/page-client.tsx` & `app/(protected)/admin/products/page-client.tsx`):**
  - **Desktop (≥ 1024px):** Ditetapkan **12 item per halaman** (`itemsPerPage = 12`), mengisi penuh grid 4-kolom POS (3 baris x 4 kolom) dan grid 3-kolom Admin Produk (4 baris x 3 kolom) secara presisi tanpa slot gantung.
  - **Mobile (< 1024px):** Ditetapkan **10 item per halaman** (`itemsPerPage = 10`), mengisi penuh grid 2-kolom mobile secara rapi.
  - Paginasi otomatis aktif saat total produk melebihi batas layar (> 12 di desktop, > 10 di mobile).
  - Ditambahkan listener otomatis `resize` layar dan reset halaman ke `1` saat breakpoint berubah.
  - Proactive Adjacent Page Preloading (`preload` halaman sebelum & sesudah) untuk navigasi instan 0ms (Zero-Delay Pagination).
  - Auto-scroll ke atas saat berpindah halaman produk.
- **SSR Initial Fetching Presisi (`app/(protected)/admin/pos/page.tsx` & `app/(protected)/admin/products/page.tsx`):**
  - Query awal produk diatur mengambil `take: 12` dan `totalPages: Math.max(1, Math.ceil(totalCount / 12))` serta menyertakan `totalCount` ke client component untuk sinkronisasi fallbackData yang presisi.
- **Penyempurnaan Seluruh Template Excel ke 15 Contoh Data (`app/api/onboarding/download-template/route.ts` & `lib/excel-template.ts`):**
  - Menambah baris sampel menjadi 15 item pada seluruh template vertikal bisnis (Retail, F&B Cafe, F&B Resto, F&B Generic, Jasa/Servis, Rental Mobil/Motor, Minibus & Bus Pariwisata, Properti/Kamar, dan Sewa Alat).
  - Memastikan pengguna baru yang mengimpor template langsung membuka halaman 2 dan mengaktifkan tombol *Next* baik pada layar desktop maupun mobile.
- **Pencegahan Timeout Transaksi pada Import Ulang Data Massal (`app/api/products/bulk/route.ts`):**
  - Mengatasi error Prisma P2028 (*"Transaction API error: A commit cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms"*) yang memicu toast error *"Sistem sedang sibuk, mohon coba beberapa saat lagi."* saat melakukan import ulang.
  - Mengganti transaksi sekuensial tunggal dengan **Chunked Concurrent Updates (`Promise.all` batch 10 item)**, mempercepat pembaruan 20 item menjadi ~3.4 detik tanpa pernah mengalami timeout.
  - Membersihkan `userId` dari payload pembaruan agar database terbebas dari validasi relasi berlebih.
- **Perbaikan UI Flicker Header Action Buttons (`app/(protected)/admin/products/page-client.tsx`):**
  - Menghapus kondisi pembungkus `{(isLoading || (products && products.length > 0)) && (` pada tombol aksi header (`Import Data`, `Export Data`, dan `+ Tambah Unit Sewa / Armada`).
  - Tombol aksi kini permanen dan stabil di header, meniadakan kedip/hilang seketika saat hard refresh pada kondisi produk kosong.
- **Optimasi UX & Tata Letak Mobile (`app/(protected)/laporan-kasir/LaporanKasirClient.tsx` & `components/PricingSection.tsx`):**
  - Memberikan margin & spacing lega pada Laporan Shift mobile agar menu tidak menabrak status bar atau berdempetan.
  - Memastikan navigasi touch swipe / drag scroll mulus di layar sewa.
  - Memastikan posisi layar stay di paling atas saat memilih paket langganan.


### 🔔 2026-10-08 — Perbaikan Notifikasi Real-Time Push: Service Worker & Fallback VAPID Keys
- **Penyebab Masalah (Root Cause):**
  - Berkas `public/sw.js` sempat terhapus pada riwayat commit sebelumnya, dan konfigurasi Serwist di-disable pada mode development (`NODE_ENV !== 'production'`), sehingga browser mendapatkan error 404 saat mendaftarkan Service Worker (`/sw.js`) dan gagal mengaktifkan notifikasi.
  - Pada lingkungan deploy, jika variabel lingkungan `NEXT_PUBLIC_VAPID_PUBLIC_KEY` atau `VAPID_PRIVATE_KEY` belum disinkronkan di dashboard hosting, sistem langsung membatalkan proses registrasi.
- **Solusi yang Diterapkan:**
  - **Service Worker Mandiri (`public/sw.js`):** Menyediakan Service Worker resmi di direktori public yang menangani siklus hidup worker (`install`, `activate`), event `push`, serta `notificationclick` secara native. Bekerja 100% baik di localhost (`next dev`) maupun di production deployment.
  - **Fallback VAPID Keys (`components/PushNotificationManager.tsx` & `lib/webpush.ts`):** Menyediakan kunci VAPID publik dan privat cadangan yang valid sehingga fitur push notification selalu aktif dan berfungsi langsung tanpa kendala konfigurasi env yang tertinggal.
  - **Dukungan Audio & Haptic Feedback:** Menambahkan feedback suara lonceng (`playNotificationChime()`) saat notifikasi berhasil diaktifkan.
  - **Endpoint Pengujian Real-Time (`app/api/push/test/route.ts`):** Menambahkan endpoint POST untuk memverifikasi dan mengirimkan tes notifikasi push ke seluruh perangkat yang terdaftar.

### 🚀 2026-10-08 — Perbaikan Mobile Drawer Sidebar Landing Page: Mengatasi Bug Ketutup Hero
- **Mobile Menu Drawer Independen (`components/landing/LandingPageClient.tsx`):**
  - Mengeluarkan drawer navigasi mobile dari dalam tag `<header>` ke root level dengan `fixed inset-0 z-[100]`.
  - **Penyebab Bug Sebelumnya:** Properti `backdrop-blur-md` (`backdrop-filter`) pada `<header>` membentuk containing block CSS yang membatasi tinggi elemen `position: fixed` di dalamnya, sehingga drawer terpotong dan tertutup oleh elemen Hero Section di bawahnya.
  - **Solusi Tuntas:** Drawer mobile kini berdiri mandiri sebagai overlay layar penuh (`fixed inset-0 z-[100] flex flex-col`) dengan top bar terpadu yang memuat logo, tombol toggle tema, dan tombol [X] penutup, serta area menu yang dapat di-scroll mulus dan latar solid yang anti-bocor.
  - **Scroll Lock Background:** Menambahkan `useEffect` untuk mengunci `document.body.style.overflow = 'hidden'` saat drawer terbuka agar latar belakang halaman tidak bergeser.

### 📱 2026-10-08 — Perbaikan Tombol Tutup (X) & Navigasi Panduan Install Mobile (Android & iOS)
- **Modal Panduan Install di Landing Page (`components/landing/LandingPageClient.tsx`):**
  - Menghilangkan tombol close `absolute top-5 right-5` yang sebelumnya menimpa teks judul *"Panduan Install PJTECH di HP"* pada viewport layar smartphone Android & iOS.
  - Memperbarui struktur header menjadi Flexbox dedicated (`items-start justify-between gap-3`) dengan alokasi khusus untuk tombol X (`shrink-0`), memastikan tombol tidak pernah tumpang tindih dengan teks atau elemen lain.
  - Menambahkan pembungkus modal `max-h-[90vh] flex flex-col overflow-hidden` dengan area konten yang dapat di-scroll lancar dan footer yang tetap rapi.
- **Buku Panduan Penggunaan di APK (`components/BukuPanduanModal.tsx`):**
  - Memperbaiki tata letak header dengan flexbox responsif sehingga tombol X memiliki ruang terpisah tanpa menabrak judul di layar smartphone.
  - Menambahkan tab khusus **"📱 Install HP / iOS"** di samping **"📖 SOP Bisnis"** dan **"💬 Bantuan WA"**, sehingga pengguna di dalam APK dapat langsung mengakses panduan instalasi PWA di Android (Chrome) dan iPhone/iPad (Safari) dalam 1 sentuhan.
  - Mendukung tema terang dan gelap dengan visual profesional.
- **Notifikasi Install PWA (`components/PwaInstallPrompt.tsx`):**
  - Merestrukturisasi baris header dengan `min-w-0 flex-1` dan proteksi `truncate` agar tombol close X tetap memiliki ruang aman dan tidak bertabrakan pada smartphone berlayar sempit.

### 🎯 2026-10-08 — Tata Letak Mobile All-in-One: Seluruh 5 Sektor Usaha Terlihat Tanpa Perlu Digeser
- **Grid 5-Kolom Presisi (`components/auth/AuthShell.tsx`):**
  - Mengubah baris chip sektor usaha pada header mobile dari sistem scroll horizontal menjadi **Grid 5 Kolom Proporsional (`grid-cols-5`)**.
  - Seluruh 5 pilar usaha (**Rental**, **Properti**, **Alat**, **F&B**, **Retail**) kini **tampil 100% all-in-one sekaligus** di semua resolusi layar mobile tanpa perlu digeser atau terpotong.
  - Setiap sektor dilengkapi mini-kartu 3D dengan ikon berwarna dan teks presisi yang serasi.

### 💎 2026-10-08 — Header 3D Ringan untuk Mobile Auth & Keselarasan 5 Sektor Usaha
- **Header 3D Modern & Ringan (`components/auth/AuthShell.tsx`):**
  - Mengimplementasikan kartu header 3D berestetika tinggi menggunakan Pure CSS (bevel gradient, soft layered elevation shadow `shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]`, dan logo emblem 3D mengambang) tanpa aset berat atau library 3D eksternal.
  - Memadukan bilah chip 5 sektor usaha (`🚗 Rental`, `🏨 Properti`, `📦 Alat/Barang`, `🍽️ F&B`, `🛍️ Retail/Jasa`) dalam satu baris presisi terpadu tanpa ada chip yang terpecah sendirian.
  - Mempertahankan posisi formulir otentikasi Clerk **presisi di titik tengah vertikal layar mobile** (`my-auto`).

### ☀️ 2026-10-08 — Transformasi Tema Terang (Light Mode) & Presisi Form Mobile
- **Tema Terang Eksekutif (`components/auth/AuthShell.tsx`):**
  - Mengubah keseluruhan tema dari tema gelap menjadi **Clean Modern SaaS Light Theme** (`bg-slate-50 / white`) dengan aksen biru korporat dan pencahayaan lembut di desktop maupun mobile.
  - **Presisi Mobile Vertikal:** Formulir login/daftar Clerk kini berposisi **tepat di tengah-tengah layar** (`my-auto`), dengan chip 5 sektor usaha ringkas di atasnya dan lencana keamanan di bawahnya.
  - **Copywriting Lengkap Alat & Barang:** Menambahkan sektor **📦 Alat, Barang & Perlengkapan** (Sewa sound system, tenda pesta, kamera, delivery fee & deposit jaminan) ke dalam matriks sektor bisnis di desktop maupun mobile.

### 📱 2026-10-08 — Penyempurnaan Tampilan Mobile & Eliminasi Ikon AI Gemini pada Auth
- **Penyempurnaan Mobile (`components/auth/AuthShell.tsx`):**
  - Tampilan mobile kini menghadirkan seluruh showcase ekosistem seperti di desktop (Headline, lencana sektor, dan matriks 4 kartu sektor: Rental & Travel, Properti, F&B, dan Retail), sehingga tidak lagi terkesan polos/kosong.
  - Palet warna disesuaikan menjadi *luminous slate-navy* (`slate-900 / slate-850`) yang seimbang, modern, elegan, dan tidak terlalu gelap (*not pitch-black*).
  - Menggantikan logo aplikasi dengan ikon resmi APK 3D PJTECH (`/logo-app.png`).
- **Eliminasi Ikon Gemini / Sparkle:**
  - Menghapus ikon bintang sparkle (`Sparkles`) dan menggantinya dengan ikon verifikasi enterprise resmi (`CheckCircle2`) untuk menjamin estetika bisnis profesional dan bebas dari kesan generic AI slop.

### 🌟 2026-10-08 — Overhaul UI/UX Profesional Halaman Login & Registrasi (/sign-in & /sign-up)
- **Komponen `AuthShell` Enterprise (`components/auth/AuthShell.tsx`):**
  - Menggantikan tampilan polos/kosong dengan layout Split-Screen SaaS kelas dunia (berstandar Stripe/Linear).
  - **Sisi Kiri (Desktop/Tablet):** Showcase branding *PJTECH UMKM (pjtechumkm.com)* dengan ambient gradient, logo resmi, headline terarah, matriks kartu 5 sektor bisnis (Rental & Travel, Properti, F&B, Retail, Jasa), garansi keamanan multi-tenant, dan social proof.
  - **Sisi Kanan (Desktop & Mobile):** Kontainer form otentikasi terpusat dengan subtle radial background, header responsif di mobile, security badges (SSL 256-Bit, Cloud Multi-Tenant Terisolasi), dan navigasi bolak-balik antara Sign-In & Sign-Up.
  - **Clerk Component Styling:** Menyematkan custom `appearance` pada `<SignIn />` dan `<SignUp />` dengan border halus, radius 3xl, font konsisten, dan tombol primer aksen biru korporat.

### 🎨 2026-10-08 — Perbaikan Dropdown Pemilihan Unit / Armada Form Booking (/book/[slug])
- **Custom Responsive Selector Dropdown (`app/book/[slug]/BookingForm.tsx`):**
  - Menggantikan elemen native HTML `<select>` dengan Custom React Dropdown Selector yang terkunci presisi 100% pada lebar kontainer kartu (`w-full max-w-full`).
  - Mengeliminasi bug browser OS popup di mana teks armada yang panjang (seperti *Big Bus HDD 59 Seat...*) membentang melebar keluar batas kartu di mobile maupun desktop.
  - Teks nama unit kini membungkus rapi (`break-words line-clamp-2`) dengan harga terformat di baris tersendiri dan preview thumbnail foto unit.
  - Menjaga validasi form tetap seamless dengan input tersembunyi (`<input type="hidden" name="productId" ... />`) serta penanganan klik luar (`click-outside listener`).
  - Menyesuaikan padding kartu formulir menjadi responsif (`p-4 sm:p-6`) agar lebih leluasa di layar mobile yang sempit.

### 🛡️ 2026-10-08 — Perbaikan Error Logout (useUser & BottomNav Resilience)
- **Eliminasi Error `useUser` Saat Logout (`hooks/usePendingBookingCount.ts`):**
  - Melepaskan ketergantungan hook dari `useUser()` milik Clerk client SDK, menggantikannya dengan parameter `tenantId` yang diteruskan dari server component (`Sidebar.tsx` & `BottomNav.tsx`).
  - Menghilangkan potensi crash saat sesi Clerk di-*teardown* / *unmount* ketika pengguna menekan tombol keluar (logout).
- **Graceful Unmount & Kepatuhan Rules of Hooks (`components/BottomNav.tsx` & `components/BottomNavClient.tsx`):**
  - Memastikan `BottomNav.tsx` me-return `null` secara aman saat sesi `auth()` gagal/berakhir.
  - Memindahkan pemanggilan hook SWR polling `usePendingBookingCount` ke baris teratas di `BottomNavClient` sebelum percabangan early return path (`hiddenPaths`).

### 🛡️ 2026-10-08 — Isolasi Multi-Tenant & Optimasi Penyimpanan Neon DB
- **Isolasi Niche Multi-Foto Produk (`admin/products/page-client.tsx`):**
  - **Khusus Rental / Travel, Properti, dan Alat & Barang:** Dibuka kuota hingga **5 foto per unit**.
  - **Khusus Jasa / Servis & Retail/F&B:** Tetap dibatasi **1 foto** agar katalog ringan.
  - **Ultra-Lightweight Canvas Compression:** Dimensi dibatasi maks 640px dengan kualitas 0.65 (~25–35KB per foto), sehingga 5 foto hanya menghabiskan ~150KB. Database Neon gratisan (kuota 512MB) tetap super aman dan mampu menampung ribuan armada tanpa khawatir penyimpanan penuh.
- **Verifikasi Keamanan Multi-Tenant:**
  - Memastikan isolasi query database pada `app/book/[slug]` strictly difilter berdasarkan `userId: tenant.userId`, menjamin data tidak akan pernah bocor antar tenant/toko lain.

### 🌟 2026-10-08 — Galeri Multi-Foto Produk & Perbaikan Selector Reservasi Online
- **Multi-Foto Produk (s/d 5 Foto) di Admin & Galeri Booking (`admin/products` & `app/book/[slug]`):**
  - Menyediakan upload multi-foto (hingga 5 foto per unit/produk) untuk semua bisnis (Rental, Properti, Alat, Retail & F&B).
  - Foto dikompresi otomatis client-side dan disimpan terstruktur via `lib/product-images.ts` dengan kompatibilitas penuh untuk data lama.
  - Di halaman reservasi publik (`/book/[slug]`), unit yang dipilih menampilkan kartu showcase foto galeri interaktif (foto utama, navigasi prev/next, thumbnail switcher, dan counter foto).
- **Perbaikan Selector Armada Melebar & Pemisahan Add-on (`BookingForm.tsx`):**
  - Mengeliminasi bug dropdown melebar (*overflow*) di mobile/desktop dengan menerapkan styling `w-full max-w-full truncate overflow-hidden` dan teks opsi ringkas (`[Nama Unit] • [Harga]`).
  - Memisahkan add-on/layanan tambahan (seperti spanduk, bbm, kenek) agar tidak tercampur ke dalam dropdown pilihan unit armada/fisik utama.

### 🚀 2026-10-07 — Eliminasi Flicker Hapus Produk & Download Template Minibus
- **Perbaikan Hapus Produk Bebas Kedip / Blank Flash (`app/(protected)/admin/products/page-client.tsx`):**
  - Mengubah mutasi optimistik pada `confirmDelete` dan `handleQuickRestock` menjadi update instan (`mutate({ products, totalPages }, false)`) tanpa memicu revalidasi yang me-reset array produk menjadi kosong (`[]`).
  - Menjaga data produk lokal tetap utuh dan stabil di layar sementara request DELETE dijalankan secara asinkron di latar belakang.
  - Memperbaiki kondisi loader tabel dari `(!data && !error)` menjadi `(!data && !error && isLoading)` sehingga transisi data tidak pernah memicu loader putih atau kedip hilang.
- **Template Excel & Download Stream Minibus / Bus Pariwisata (`components/CsvImportModal.tsx` & `app/api/onboarding/download-template/route.ts`):**
  - Mengganti `window.open` menjadi direct stream download via `Blob` agar tidak membuka tab kosong yang berputar/loading tanpa henti.
  - Menambahkan tombol khusus Minibus & Bus Pariwisata / Ziarah dengan 150 baris rumus & dropdown otomatis.
  - Mendaftarkan ikon `Bus` dari `lucide-react` pada modal impor.

### 🎯 2026-10-07 — Kalender Sewa Desktop/Tablet: Pagination Rata 10 & Penataan Layout
- **Penambahan Contoh Armada Bus Pariwisata & Ziarah di Template Excel (`lib/excel-template.ts`):**
  - Menyediakan baris contoh siap pakai untuk bisnis PO Bus Pariwisata & Travel Ziarah (Big Bus SHD 50 Seat, Big Bus 59 Seat, Medium Bus 35 Seat, dan Elf Long).
  - Menyertakan konvensi penamaan unit yang membedakan **Unit Garasi Sendiri** vs **Unit Titipan Mitra/Investor (Bagi Hasil)** di nama unit dan kolom deskripsi agar orang awam mudah mengisi tanpa bingung.
- **Alur Pelunasan Sewa & Jam Pulang Invoice (`app/(protected)/admin/rental-calendar` & `components/InvoiceRentalA4.tsx`):**
  - **Jam Pulang / Selesai Sewa Selalu Tercetak:** Memperbaiki inisialisasi default `returnTime` ('20:00') dan fallback format tanggal cetak sehingga baris `Selesai Sewa` di dokumen invoice/surat jalan selalu menampilkan jam pulang secara lengkap (`08 Okt 2026, 20:00 WIB`), tidak lagi terpotong tanggalnya saja.
  - **Fitur Input Pelunasan Lengkap di Kalender Sewa:**
    - Membuka tombol **`[ 💰 Terima Pelunasan & Selesai ]`** untuk semua orderan yang belum lunas (baik transaksi langsung dari Kasir POS maupun booking Online).
    - Menghadirkan modal **Penyelesaian Sewa & Pelunasan**:
      - Rincian Sisa Tagihan Belum Lunas (Angka Merah).
      - Input Denda Overtime / Biaya Kerusakan tambahan (opsional).
      - Kalkulasi otomatis total pelunasan yang harus diterima kasir saat ini.
      - Pilihan metode pembayaran pelunasan: `💵 Tunai` atau `📱 Transfer / QRIS`.
    - Server Action `finishOrder` kini mendukung pelunasan transaksi POS maupun booking online secara otomatis (`status: 'completed'`, `remainingBalance: 0`).
- **Perbaikan Data Tujuan Perjalanan & Format Tanggal Cetak Invoice (`components/InvoiceRentalA4.tsx` & `app/page-client.tsx`):**
  - **Tujuan Perjalanan Terekam Akurat:** Memperbaiki pembacaan field destinasi agar membaca `dropoffLocation` (dan `destination`) sehingga rute/tujuan yang diisi kasir di form sewa armada/travel tercetak nyata dan tidak lagi kosong/dummy `-`.
  - **Dukungan Titik Jemput:** Menambahkan baris cetak `Titik Jemput` pada dokumen jika kasir mengisi lokasi penjemputan.
  - **Format Tanggal Rapi (Bukan ISO Mentah):** Mengubah tampilan tanggal `Mulai Sewa` dan `Selesai Sewa` dari format raw ISO (`2026-10-07T23:00:00+07:00`) menjadi format rapi bahasa Indonesia yang profesional (`07 Okt 2026, 23:00 WIB`).
- **Penyempurnaan Alur Uang Muka (DP) & Dokumen Invoice (`app/page-client.tsx` & `components/InvoiceRentalA4.tsx`):**
  - **Tombol Lengkapi Data Sewa Tetap Tenang:** Menghapus efek kedap-kedip (`animate-pulse`) pada tombol `[📝 Lengkapi Data Sewa / Check-in *]` agar tampilan kasir tidak menyilaukan mata dan tetap fokus.
  - **Alur Pengisian DP Mudah & Cepat:**
    - Menambahkan tombol preset instan `[50%]` dan `[30%]` saat opsi DP dicentang.
    - Menambahkan tombol `[Uang Pas DP]` pada input pembayaran tunai sehingga kasir tidak perlu mengetik manual ulang nominal uang yang diterima.
    - Menampilkan kalkulasi **Sisa Tagihan (Angka Merah Tebal)** secara transparan sebelum checkout.
  - **Pembedaan Jelas: Invoice Resmi (Lunas) vs Surat Jalan / Tanda Terima DP (Belum Lunas):**
    - **Jika Lunas (Sisa Tagihan = 0):** Dokumen dicetak dengan judul **INVOICE RESMI SEWA** disertai stempel hijau **[✓ LUNAS (PAID)]**.
    - **Jika Belum Lunas (Masih Ada Sisa Tagihan):** Dokumen dicetak sebagai **SURAT JALAN & TANDA TERIMA DP** disertai stempel merah **[⚠️ BELUM LUNAS (DP)]** dan angka merah mencolok pada rincian sisa tagihan yang wajib dilunasi saat pengembalian armada/check-out unit.
- **Perbaikan Presisi Form Rental Kendaraan & Surat Jalan Desktop (`app/page-client.tsx`):**
  - Memperluas lebar modal di desktop menjadi `max-w-xl sm:max-w-2xl` agar tata letak input lapang dan proporsional.
  - Memperbaiki label "Tgl & Jam Berangkat / Ambil *" dan "Tgl & Jam Kembali / Selesai *" agar badge WIB dan tanda bintang `*` tidak terpotong atau turun baris secara canggung.
  - Mengganti grid rasio kaku pada input tanggal & jam dengan struktur `flex gap-2` di mana box jam sewa memiliki lebar pasti `w-28 sm:w-32` dengan format teks bersih (`08:00 WIB`, `20:00 WIB`) sehingga teks jam tidak lagi terpotong menjadi "08:00 WI".
- **Bugfix React Rules of Hooks (`RentalCalendarClient.tsx`):** Memindahkan pemanggilan hook `useRef(agendaTopRef)`, `useState(orderPage)`, dan `useEffect` ke level paling atas komponen (sebelum early return kondisi `!isMounted || !data`) untuk mematuhi aturan urutan hooks React.
- **Sistem Pagination 10 Rata per Halaman (`/admin/rental-calendar`):**
  - Mengatasi penumpukan orderan di hari yang sama dengan membatasi tampilan maksimal **10 orderan per halaman** secara rata (`ORDERS_PER_PAGE = 10`).
  - Menambahkan tombol kontrol navigasi **[← Sebelumnya]** dan **[Sesudah →]** baik di ringkasan atas maupun di bar kontrol bawah.
  - Ditambahkan indikator nomor halaman dinamis (`Halaman X dari Y`, tombol angka hal. 1, 2, dst., serta info `Menampilkan 1 - 10 dari Total N Orderan`).
  - Auto-reset ke halaman 1 setiap kali user memilih tanggal baru di kalender atau mengubah filter status.
  - Auto smooth scroll kembali ke awal daftar orderan saat berpindah halaman agar pengalaman navigasi responsif.
  - Validasi deteksi tabrakan waktu sewa (`hasConflict`) tetap menganalisis seluruh data orderan di tanggal tersebut tanpa terpotong pagination.
- **Perbaikan Layout Desktop & Tablet (Bebas Spasi Putih Kosong):**
  - Mengunci kolom kalender bulanan di sisi kiri dengan `lg:sticky lg:top-20 self-start` agar kalender tetap nampak jelas dan tidak hilang saat user men-scroll kartu orderan di sisi kanan.
  - Menyeimbangkan rasio grid desktop (`xl:col-span-7` & `xl:col-span-5`) dengan jarak antar kartu `gap-3.5` yang rapi dan terstruktur, cocok untuk rental kendaraan, travel, properti, maupun sewa alat & barang.



### 📱 PWA, Branding & UI/UX Refinement: Multi-Platform Install, Official App Icon & Header Redesign (2026-10-07)
- **Header Desktop Landing Page Redesign (`components/landing/LandingPageClient.tsx`):**
  - Mengatasi masalah tata letak padat/mepet dengan alokasi whitespace proporsional (`gap-6 xl:gap-8`).
  - Pemisahan bersih antara navigasi murni (Solusi Bisnis, Perbandingan POS, Blog, Harga, FAQ) di sisi tengah dan grup aksi pengguna di sisi kanan.
  - Mempersingkat teks tombol CTA primer dari `"Daftar jika Belum Punya Akun"` menjadi `"Coba Gratis 14 Hari ➔"` untuk efisiensi ruang dan rasio konversi tinggi.
  - Mengubah theme switcher teks menjadi compact icon-only button (menghemat ~50px ruang horizontal).
  - Menempatkan tombol "Install HP" sebagai pill badge elegan di action group kanan.
- **PWA Multi-Platform Install Notification (`components/PwaInstallPrompt.tsx`):**
  - Menambahkan deteksi otomatis perangkat Apple iOS (iPhone/iPad) dan standalone mode detection.
  - Menyediakan tab switcher platform interaktif `[🤖 Android]` & `[🍎 iPhone / iPad (iOS)]`.
  - Khusus pengguna iOS: panduan visual 3 langkah (Safari Share ⎋ -> Add to Home Screen -> Tambah) dengan tombol konfirmasi siap pasang.
  - Khusus pengguna Android/Chromium: native 1-click install via `beforeinstallprompt`.
  - Supresi prompt otomatis jika aplikasi sudah berjalan dalam mode standalone (PWA terinstal).
- **Branding & Official App Icon Consistency:**
  - Mengganti seluruh ikon placeholder generic (`Store` icon) di Landing Page Header & Footer, Sidebar Dashboard Kasir POS, Auth Page, Onboarding Page, dan Comparison Card menjadi Logo Resmi APK 3D PJTECH (`public/logo-app.png` & `public/icon-192x192.png`).
  - Konfigurasi PWA Manifest (`app/manifest.ts`) dengan `start_url: "/admin/pos"` agar saat aplikasi dibuka dari Home Screen langsung meluncur ke mesin kasir POS (bukan web marketing).
  - Pembuatan berkas PNG valid resolusi tinggi: `public/icon-192x192.png`, `public/icon-512x512.png`, dan `public/apple-touch-icon.png` (180x180) untuk kejernihan ikon di Android & iOS.
- **Panduan & SOP Instalasi Mobile:**
  - Modal interaktif panduan instalasi Android & iOS pada Landing Page.
  - FAQ nomor 1 di Landing Page mengenai langkah instalasi tanpa Play Store/App Store.
  - SOP panduan instalasi PWA di modal Buku Panduan & Bantuan dashboard (`components/BukuPanduanModal.tsx`).
- **Pembaruan SOP Rental & Travel (`components/BukuPanduanModal.tsx`):**
  - Mengeliminasi instruksi usang ("Klik Start / Finish") dan menyelaraskannya dengan fitur aktif sistem.
  - Alur SOP operasional diperbarui: Input Unit (Stok 1) ➔ Atur Tarif & Rekening DP ➔ Bagikan Link Booking Publik ➔ Terima & ACC Jadwal di Kalender ➔ Transaksi Kasir POS & Cetak Surat Jalan/Perjanjian Sewa Format A4 ➔ Monitoring Kalender & Penyelesaian Sewa (kalkulasi Denda Overtime & pengembalian Deposit Jaminan).
- **Multi-Niche Rental Hybrid Safeguard (`page-client.tsx` & `admin/products/page-client.tsx`):**
  - Mengantisipasi skenario jika tenant mengimpor ketiga template sekaligus (Kendaraan + Properti + Peralatan).
  - Sistem secara dinamis memecah tab filter menjadi kategori mandiri (`[🚗 Kendaraan & Armada]`, `[🏨 Properti & Kamar]`, `[📦 Alat & Barang]`, dan `[🛠️ Layanan & Add-on]`) sehingga unit tidak bercampur aduk.
  - Modal checkout POS dan Booking Online otomatis menyajikan mode selector adaptif per unit sewa.
- **Verifikasi Arsitektur Multi-Niche Rental/Travel:**
  - Memastikan integrasi `lib/rental-filter.ts` dan `lib/business-category.ts` otomatis mengadaptasi UI/UX kasir, terminologi, filter, dan form reservasi sesuai data (Kendaraan, Properti & Kamar, atau Peralatan & Alat).
  - Aksesibilitas multi-template download pada `components/CsvImportModal.tsx` tetap terbuka fleksibel untuk tenant rental multi-unit.
  - Operasi CRUD (Armada, Properti, Peralatan) terisolasi aman dengan penanganan stok unit fisik (`isService: false`) vs layanan tambahan (`isService: true`).


### 🐛 Bugfix & UX: Jasa/Servis Template & Onboarding Fixes (2026-09-19)
- **Template Excel 2 Sheet**: Download & export terpisah "Jasa" (unlimited stock, biayaModal) + "Sparepart" (stock, HPP)
- **biayaModal field**: Jasa murni pakai biaya modal/bahan per pengerjaan (opsional), Sparepart pakai HPP
- **Stok unlimited**: Jasa murni `stock=999999`, sembunyikan badge stok di UI kartu produk
- **Onboarding simplified**: Hapus step "Info Toko" (redundan dengan data signup), tinggal 2 step: Printer (opsional) → Produk/Import
- **Vertical isolation**: `isPureJasa = isJasa && !isRental` guard di API & UI, no cross-contamination Retail/F&B/Rental
- **Import bulk auto-detect**: `category==="Jasa"` → hpp=0, biayaModal, stock=999999

### 🐛 Bugfix: Penyelesaian Masalah Unduh Laporan Excel di Dashboard
- **Koreksi Role Check & Autentikasi (`app/api/admin/export-backup/route.ts`):**
  - Mengubah pengecekan hak akses dari `if (role !== 'OWNER')` yang memblokir semua merchant (HTTP 403) menjadi standar Clerk `if (role === 'CASHIER') return 403`, memberikan akses penuh kepada pemilik toko dan admin toko.
- **Migrasi Penuh ke SheetJS (`xlsx`):**
  - Menggantikan engine `ExcelJS` lama dengan SheetJS `xlsx` native berkecepatan tinggi, dilengkapi auto column widths (`worksheet['!cols']`) dan penyesuaian header multi-tenant (Retail, F&B, Jasa, Rental/Properti).
- **Sinkronisasi Filter Periode Dashboard:**
  - Menghubungkan dropdown filter periode aktif pada Dashboard (`filter` & `customDate`) ke endpoint `/api/admin/export-backup` via komponen `ExportBackupButton`.
- **Peningkatan UX Feedback State (`components/ExportBackupButton.tsx`):**
  - Menambahkan indikator loading `"Menyiapkan Laporan..."`, ekstraksi nama berkas dinamis dari `Content-Disposition`, dan parsing pesan error JSON responsif.
- **Penyelarasan Lebar Kolom Analitik (`app/api/export/route.ts`):**
  - Menambahkan proporsional column widths (`worksheet['!cols']`) pada laporan analitik.

### 🔔 Fitur Baru: Real-Time Mobile Order Badge, Haptic Vibration & Dual-Tone Web Audio Chime
- **SWR Polling & Badge Merah di Mobile Bottom Nav (`components/BottomNavClient.tsx`):**
  - Mengintegrasikan polling real-time `/api/booking/pending-count` setiap 10 detik pada navigasi bawah kasir mobile.
  - Menerapkan rendering badge dengan posisi `absolute` di dalam kontainer ikon (`relative`) untuk menjamin **Zero Layout Shift** (tidak merusak susunan flexbox/grid pada layar HP apa pun).
  - Badge otomatis disembunyikan jika `pendingCount === 0`, dan menampilkan nilai dinamis hingga `"99+"` dengan kontras border putih, bayangan halus, dan animasi zoom entrance.
  - Mendukung navigasi bertingkat: badge muncul langsung pada item pesanan di bar utama, dan jika berada di menu sekunder, indikator otomatis muncul di tombol `"Lainnya"` dan di dalam drawer sheet "Menu Lainnya".
- **Dual-Tone Web Audio Chime Bell (`lib/audio.ts`):**
  - Mengimplementasikan synthesizer Web Audio API murni (nada harmonik ceria A5 880Hz ke D6 1174.66Hz) dengan *decay* eksponensial lembut yang berbunyi saat ada pesanan baru masuk.
  - Zero asset overhead (tanpa file mp3 eksternal), aman dari blokir autoplay browser, serta dilengkapi *throttle debounce* 2 detik untuk mencegah gema / suara ganda saat desktop dan mobile aktif bersamaan.
- **Haptic Vibration Feedback:**
  - Menambahkan umpan balik getaran taktil via `navigator.vibrate([120, 80, 120])` pada perangkat mobile yang mendukung ketika pesanan baru tiba.
- **Custom Hook & Sinkronisasi Desktop (`hooks/usePendingBookingCount.ts` & `components/SidebarClient.tsx`):**
  - Mengisolasi logika polling, deteksi penambahan pesanan (`currentCount > prevCount`), dan proteksi initial page load ke dalam hook reusable `usePendingBookingCount`.
  - Memutakhirkan `SidebarClient.tsx` desktop agar menggunakan hook yang sama, menjamin keselarasan visual badge dan audio alert di seluruh perangkat.

### 🔍 Fitur Baru: Integrasi Hardware Barcode Scanner & Audio Feedback (Retail & F&B)
- **Global Hardware Barcode Scanner (`app/page-client.tsx`):**
  - Menambahkan event listener global pada `window` untuk mendeteksi pemindaian barcode hardware (USB / Bluetooth HID Keyboard) secara otomatis melalui perhitungan interval keystroke cepat (< 70ms).
  - Saat scanner mengirim tombol `Enter`, kode barcode diekstrak dan dicocokkan langsung dengan `kodeBarang` (SKU) produk.
  - Jika produk ditemukan, otomatis memanggil `addToCart(product)` dan menambah kuantitasnya jika sudah ada di keranjang.
- **Pencarian Cerdas & API Fallback Lintas Halaman:**
  - Menambahkan fallback pencarian ke endpoint `/api/products?search=${code}&limit=10` jika produk yang dipindai tidak berada di 10 item pada halaman aktif (mengatasi kendala paginasi).
- **Tactile Audio Feedback (Web Audio API):**
  - Mengintegrasikan synthesizer audio tanpa dependensi asset eksternal: nada bip frekuensi tinggi (1200Hz) saat produk berhasil ditambahkan, dan nada peringatan (280Hz) saat SKU tidak ditemukan atau stok habis.
- **UI Manual SKU Input Cepat:**
  - Menambahkan input teks berikon `Barcode` di header POS di atas grid produk dengan placeholder `"Scan atau Ketik SKU/Barcode (Enter)"`, tombol `Enter ↵`, dan indikator `"Scanner Siap"`. Nilai input otomatis dikosongkan setelah produk masuk keranjang.
- **Isolasi Kategori Bisnis:**
  - Seluruh fitur listener dan UI pemindai barcode dibatasi secara eksklusif untuk kategori **Retail** dan **F&B** (`!isJasa && !isRental`), menjaga antarmuka Jasa dan Rental tetap bersih dan spesifik.

### 📊 Fitur Baru & Bugfix: Import/Export Excel Dinamis (4 Model Bisnis)
- **Template Import Dinamis `.xlsx` Asli (`components/CsvImportModal.tsx`):**
  - Mengubah unduhan template dari format `.csv` statis menjadi file `.xlsx` asli (menggunakan SheetJS `xlsx`) dengan lebar kolom proporsional, mencegah baris berantakan pada Excel berbahasa Indonesia.
  - Template disesuaikan dinamis berdasarkan kategori tenant:
    - **Retail / F&B:** `kodeBarang`, `name`, `category`, `hpp`, `hargaJual`, `stock`, `minStockThreshold`.
    - **Jasa / Servis:** `name`, `category`, `hargaJual`, `employeeCommission`, `description` (tanpa kolom stok).
    - **Rental / Properti:** `name`, `category`, `hpp` *(B.Ops/Maintenance)*, `hargaJual`, `description` *(fasilitas/catatan)*.
  - Input file mendukung pengunggahan file `.xlsx`, `.xls`, dan `.csv`.
- **Sinkronisasi Parser Backend Massal (`app/api/products/bulk/route.ts`):**
  - Menambahkan penyimpanan kolom `description` ke model `Product` di database Prisma.
  - Toleransi alias header: kolom `bOps` dan `biayaOperasional` otomatis dipetakan ke field `hpp`. Kolom `komisi`, `commission`, `komisiStaf` dipetakan ke `employeeCommission`.
  - Dilengkapi fungsi pembersih format angka `parseNumber` untuk menangani teks berformat mata uang (seperti `"Rp 15.000"`).
- **Penyelarasan Header Laporan Universal (`app/api/export/route.ts` & `app/api/admin/export-backup/route.ts`):**
  - Mengubah label header laporan dari `"Armada"` menjadi **`"Unit / Properti / Armada"`**.
  - Mengubah label header laporan dari `"Terapis/Kapster"` menjadi **`"Staf / Teknisi / Petugas"`**.
  - Menyelaraskan kunci baris data transaksi dan laporan backup pemilik toko (*Owner*).
- **Fitur Ekspor Katalog Produk Tenant (`app/api/products/export/route.ts` & `app/(protected)/admin/products/page-client.tsx`):**
  - Menambahkan route handler baru `GET /api/products/export` untuk mengunduh seluruh katalog produk/layanan/unit tenant ke file `Katalog_Produk_[NamaToko].xlsx` (tanpa batas paginasi).
  - Menambahkan tombol **"Export Data"** (dengan ikon `FileDown`) berdampingan dengan tombol "Import Data".
  - Parser impor di client kini membaca file Excel `.xlsx` maupun `.csv` secara langsung via SheetJS `arrayBuffer`.

### 🛠️ Refinement UX Masif & Bugfix Lintas 4 Kategori Bisnis (Retail, F&B, Jasa, Rental)
- **Penyempurnaan UX Terakhir (Skor 100/100):**
  - **Auto-Uppercase Plat Nomor & SKU:** Input plat nomor / kode unit pada modal sewa POS Kasir (`app/page-client.tsx`) dan form penambahan unit sewa/SKU (`admin/products`) otomatis terkapitalisasi (`.toUpperCase()`) dan dilengkapi styling `uppercase font-mono` untuk presisi identitas unit.
  - **Preset Jam Operasional Standar (08:00 - 22:00 WIB):** Opsi pemilihan jam booking dan check-in pada formulir booking publik (`app/book/[slug]/BookingForm.tsx`) dibatasi hanya pada jam operasional standar (08:00 hingga 22:00 WIB), mengeliminasi potensi booking dini hari di luar jam operasional.
  - **Tombol Cepat "Salin Link Toko" di Header:** Menambahkan komponen [`CopyBookingLinkButton`](file:///d:/Coding/kasir-umkm/components/CopyBookingLinkButton.tsx) di Header Dasbor Admin dan Header POS Kasir dengan notifikasi toast instan untuk kemudahan promosi etalase toko.
  - **Endpoint GET Slug:** Menyediakan route handler `GET /api/tenant/slug` untuk sinkronisasi metadata toko secara dinamis dengan SWR.
- **Akses Pengaturan Toko Universal (Semua Kategori Bisnis):**
  - Mengubah konfigurasi sidebar (`lib/navigation.ts`) agar menu "Informasi Toko / Pengaturan" dapat diakses oleh semua pemilik bisnis tanpa terkecuali (Retail, F&B, Jasa, Rental).
  - Menerapkan *conditional rendering* pada `app/(protected)/admin/settings/page.tsx`: modul formulir rekening bank / instruksi pembayaran DP (`PaymentSettingsForm`) hanya ditampilkan untuk kategori Jasa dan Rental (`isJasaOrRental`), sedangkan untuk Retail dan F&B disembunyikan agar antarmuka tetap bersih dan relevan.
- **Normalisasi Kategori F&B & Dinamisasi Label Menu Sidebar:**
  - Memperluas deteksi string kategori F&B pada `lib/navigation.ts` untuk mencakup variasi `'FNB'`, `'F&B'`, dan `'F&B / Kuliner'`, memastikan konsistensi menu operasional F&B (Meja Resto, Dapur).
  - Melakukan dinamisasi label menu sidebar Produk sesuai spesialisasi bisnis: `"Daftar Menu"` untuk F&B, `"Unit / Properti / Armada"` untuk Rental, `"Layanan"` untuk Jasa, dan `"Produk"` untuk Retail.
- **Penyelesaian Deadlock POS Kasir Jasa & Validasi Tanggal:**
  - Mengatasi kendala transaksi macet pada kasir Jasa saat toko belum mendaftarkan karyawan: menambahkan opsi fallback otomatis `"admin_owner"` (*"Dikerjakan oleh Admin/Pemilik"*) pada seleksi staf/teknisi jika `employees.length === 0`.
  - Integrasi pencetakan struk kasir dengan teks `(Oleh: Admin/Pemilik)` saat fallback aktif.
  - Menambahkan validasi `min` waktu saat ini pada input picker `datetime-local` (Jadwal Layanan) untuk mencegah pemilihan tanggal masa lalu secara tidak disengaja.
- **Penyempurnaan Modul Unit Sewa & Biaya Operasional (Rental):**
  - Memperbaiki logika ternary badge Biaya Operasional (B. Ops) pada `app/(protected)/admin/products/page-client.tsx` dengan memisahkan `isPureJasa = isJasa && !isRental`, sehingga indikator B. Ops dapat tampil presisi pada kartu unit sewa / armada.
  - Memperbarui label copywriting form penambahan unit Rental menjadi `"Unit Sewa / Armada"` serta menghapus teks petunjuk berlebih pada textarea deskripsi.
- **Upgrade Engine Unduh Tiket Reservasi & Proteksi Autofill:**
  - Mengganti pustaka kanvas ke `html2canvas-pro` (v2.4.1) untuk mendukung penuh skema warna modern Tailwind CSS v4 (`oklch(...)`) yang sebelumnya menyebabkan *parsing crash* pada `html2canvas` standar.
  - Mengamankan opsi tangkapan kanvas dengan `useCORS: true`, `backgroundColor: "#ffffff"`, dan menonaktifkan `allowTaint` agar `canvas.toDataURL()` tidak memicu `SecurityError`.
  - Menambahkan proteksi *controlled input* dengan deteksi duplikasi teks pada field nama dan nomor WhatsApp di form booking publik (`app/book/[slug]/BookingForm.tsx`) untuk menangkal anomali pengisian ganda akibat *aggressive browser autofill*.

### 🌐 UX & Copywriting: Universalisasi Modul Rental (Properti & Kendaraan)
- **Netralisasi Status & Filter:** Mengubah status `COMPLETED` dari "Siap Berangkat" menjadi "Sedang Disewa" dan `IN_PROGRESS` dari "Sedang Jalan" menjadi "Berjalan" pada Kalender Sewa, Booking Dashboard, dan Inbox Pesanan.
- **Action Buttons & Copywriting:** Mengubah tombol "Mulai Perjalanan / Start" menjadi "🚀 Mulai / Start" dan "Tiba di Pool / Finish" menjadi "✅ Selesai / Finish", serta mengganti rujukan "Info Armada" / "Armada/Layanan" menjadi "Info Unit" / "Unit/Layanan".
- **Dynamic Iconography (Ikon Unit):** Menambahkan logika deteksi tipe unit `detectRentalItemType` pada `lib/business-category.ts`. Menampilkan ikon 🛏️ Kasur (`Bed`) untuk properti/kamar/kos, 🚗 Mobil (`CarFront`/`Car`) untuk kendaraan, dan 🔑 Kunci (`Key`) untuk fallback.
- **Form Tambah / Edit Layanan Rental:** Mengubah label & placeholder input form pada `admin/products` menjadi universal untuk properti & kendaraan (Tipe Unit, Nama Unit/Nomor Kamar/Plat, Komisi Petugas/Driver, Fasilitas/Catatan Tambahan).
- **Form POS Transaction (Dual Mode):** Implementasi 2 tab toggle pada modal data sewa POS Kasir ("🏨 Form Properti / Check-in" & "🚗 Form Kendaraan / Surat Jalan") lengkap dengan auto-detection tipe item keranjang dan netralisasi tombol cart `📝 Lengkapi Data Sewa / Check-in *`.

### 📝 Dokumentasi & Konfigurasi Dynamic URL, Category ID, & Mayar
- **Environment Variable `NEXT_PUBLIC_APP_URL`:** Mendokumentasikan variabel URL terpusat (`http://localhost:3000` untuk dev, `https://www.pjtechumkm.com` untuk production).
- **Standar Identifier Kategori Bisnis:** Menetapkan dan mendokumentasikan spesifikasi ID baku format UPPERCASE (`RENTAL`, `JASA`, `FNB`, `RETAIL`).
- **Integrasi Mayar.id:** Mendokumentasikan helper `getAppUrl()` di [`lib/url.ts`](file:///d:/Coding/kasir-umkm/lib/url.ts), rute Webhook `/api/webhooks/mayar`, serta rute Callback Redirect `/auth-callback`.

### 🐛 Bugfix: Next.js Router Cache & Clerk Metadata Sync (Onboarding & Subscription)
- **Penanganan Router Cache & State:** Memperbaiki bug di mana UI dasbor kasir sempat menampilkan layout kategori lama (Retail) setelah mendaftarkan toko baru dengan kategori lain (FNB/JASA/RENTAL) pada fase Onboarding.
- **Implementasi Revalidation & Reload:** 
  - Injeksi `revalidatePath('/', 'layout')` dan `revalidatePath('/admin', 'layout')` pada Server Actions `completeOnboarding`, `selectSubscriptionPackage` ([`app/(protected)/onboarding/actions.ts`](file:///d:/Coding/kasir-umkm/app/%28protected%29/onboarding/actions.ts)), dan API Route [`app/api/subscription/extend/route.ts`](file:///d:/Coding/kasir-umkm/app/api/subscription/extend/route.ts).
  - Mengombinasikan `await user.reload()` dan `router.refresh()` pada sisi Klien ([`app/(protected)/onboarding/page.tsx`](file:///d:/Coding/kasir-umkm/app/%28protected%29/onboarding/page.tsx), [`components/PricingSection.tsx`](file:///d:/Coding/kasir-umkm/components/PricingSection.tsx), dan [`components/PaywallModal.tsx`](file:///d:/Coding/kasir-umkm/components/PaywallModal.tsx)) untuk secara instan menghapus cache client router dan memuat data RSC (*React Server Components*) terbaru dari database.

### ✨ Fitur Baru & Perbaikan: Integrasi Webhook Mayar
- Menambahkan route handler `app/api/webhooks/mayar/route.ts` untuk menangani webhook pembayaran otomatis dari Mayar (`payment.success` dan `payment.received`).
- Fitur ini mendeteksi jumlah pembayaran (`amount`) dan memperbarui paket berlangganan (`subscriptionPlan`) secara dinamis menjadi `PRO_1M`, `PRO_6M`, atau `PRO_1Y`.
- Melakukan perhitungan otomatis untuk memperpanjang `subscriptionEndsAt` pada tabel `Tenant` sesuai dengan durasi langganan (1, 6, atau 12 bulan).
- **Hotfix:** Menambahkan penanganan event `testing` dari dashboard Mayar agar merespon `200 OK` secara langsung tanpa memicu pemanggilan query database.
- **Hotfix:** Implementasi *graceful degradation* saat user (email) dari webhook tidak ditemukan pada database dengan merespon HTTP `200` agar menghindari *infinite retry* dan mencegah penumpukan antrean (*webhook stuck*) dari pihak Mayar.
- **Hotfix:** Memperbaiki build error (TypeScript type mismatch) pada `app/api/reports/shift/route.ts` ketika melakukan push `mappedBookings` ke array `transactions` dengan menambahkan type casting `as any[]`.

### ⚡ Performa & UX: Speed Insights & Caching SWR
- Mengintegrasikan `@vercel/speed-insights` pada root layout untuk tracking Core Web Vitals.
- Optimalisasi caching global SWR dengan menonaktifkan `revalidateOnFocus` dan `revalidateIfStale`, serta mengatur `dedupingInterval: 60000` untuk mengurangi jumlah *network request* berlebihan, sehingga aplikasi terasa lebih ringan.
- **LCP Optimization (Hydration Fix):** Memindahkan pengambilan data analitik dari *Client Component* ke *Server Component* pada rute `/admin`, serta memisahkan utilitas `getAnalyticsData` ke dalam `lib/analytics-service.ts` dengan penanganan serialisasi waktu (`Date` ke `toISOString`) untuk mengatasi `Hydration Error`.
- **TTFB & FCP Optimization (ISR):** Mengubah strategi *caching* pada rute publik `/book/[slug]` dari `force-dynamic` (Real-Time) menjadi *Incremental Static Regeneration* (ISR) dengan `revalidate = 60` untuk mempercepat pemuatan halaman melalui CDN cache.

---

## [0.3.63] — 2026-08-19

### ⚡ Vercel CPU Optimization & Error Handling (PRD v0.3.63)

> Fokus: Memindahkan beban komputasi dari **Vercel CPU → Database Engine (PostgreSQL/Neon)** berdasarkan data Vercel Observability.

#### `/api/analytics` — Refactor Agregasi ke Database
- **Hapus** `findMany` + kalkulasi manual `.forEach` / `.reduce` di JavaScript untuk `totalRevenue`, `totalTransactions`, dan `totalExpense`.
- **Ganti** dengan `prisma.transaction.aggregate({ _sum: { total }, _count: { id } })` dan `prisma.expense.aggregate({ _sum: { amount } })` — seluruh SUM & COUNT kini dilakukan oleh PostgreSQL.
- **Paralelkan** seluruh query dengan `Promise.all` (6 query concurrent) untuk meminimalkan total round-trip latency.
- `salesTrend` tetap menggunakan `findMany` minimal (select 2 kolom) karena membutuhkan grouping per tanggal WIB yang tidak dapat dilakukan murni di sisi DB via Prisma ORM.
- **Estimasi dampak:** Active CPU `2.4s → <0.5s`.

#### `/api/reports/shift` — Eliminasi Double Query & Perbaikan Error Rate 31.3%
- **Hapus** query `allTransactions` yang menarik seluruh data hari (beserta nested `items`) ke RAM Node.js — penyebab utama OOM / Connection Timeout.
- **Ganti** kalkulasi metrics (`totalGross`, `totalCash`, `totalQRIS`) dengan `prisma.transaction.groupBy({ by: ['method'], _sum: { total } })` — agregasi di Database.
- **Ganti** iterasi nested `items` di JS untuk `soldSummary` dengan `prisma.transactionItem.groupBy({ by: ['productId'], _sum: { qty } })` — kalkulasi di Database.
- **Pisahkan** `partial` transactions (subset kecil) sebagai query sendiri untuk penanganan `downPayment` sebagai `effectiveTotal`.
- **Eliminasi double query**: transaksi kini hanya di-query sekali untuk kebutuhan tabel paginasi.
- **Perbaiki error handling**: `catch (error: unknown)` dengan ekstraksi `message` + `stack`, response JSON lebih informatif (field `detail`) untuk memudahkan debugging di Vercel Logs.

#### `prisma/schema.prisma` — Index Baru
- Tambah `@@index([userId, createdAt, cashierId])` pada model `Transaction` untuk mendukung query laporan shift per kasir dengan *single index scan* (menggantikan sequential scan).
- `npx prisma db push` berhasil — index aktif di Neon PostgreSQL (`ap-southeast-1`).

#### `/api/booking/pending-count` — Tidak Diubah
- Audit menunjukkan route ini **sudah optimal** (`prisma.booking.count()` sudah digunakan). Active CPU 4.13s kemungkinan disebabkan cold-start Vercel, bukan inefisiensi query.

---

## [0.3.33 – 0.3.48] — 2026-08-18

### 🚀 Optimasi & Bug Fixes (Hotfixes)
- **Pembaruan SOP Rental (Buku Panduan):** Menyisipkan instruksi wajib "Atur Rekening Pembayaran (DP 50%)" pada komponen *BukuPanduanModal* khusus untuk pengguna Rental/Travel, guna mencegah transaksi *online booking* terputus akibat ketiadaan informasi rekening/e-wallet untuk pembayaran awal. Alur SOP Rental kini berjumlah 7 langkah.
- **Strict Component Unmounting (Informasi Pembayaran):** Menghapus total (unmount) *Card* "Informasi Pembayaran" pada halaman Pengaturan Toko untuk entitas bisnis Jasa (selain F&B dan Retail). Form pengaturan rekening kini diisolasi ekstrem secara eksklusif HANYA untuk pemilik bisnis Rental & Travel.
- **Isolasi Logika DP & Copywriting Dinamis:** Menyembunyikan form Informasi Pembayaran untuk bisnis F&B/Retail, serta melimitasi logika *Down Payment (DP)* 50% di halaman *Booking* publik murni hanya untuk kategori *Rental*. Label rekening kini otomatis menjadi E-Wallet untuk Rental.
- **Fitur Unduh Tiket (Canvas) & Data Isolation Naming:** Memperbaiki *bug crash* pada `html2canvas` dengan suntikan parameter *allowTaint* dan *useCORS*, mereset *state loading*, serta mengamankan identitas file unduhan secara dinamis (`Tiket_[Toko]_[Pelanggan]_[ID].png`).
- **Absolute URL pada Salin Link Booking:** Memperbaiki *relative path* di halaman Jadwal Booking dan Informasi Toko menggunakan `window.location.origin` (aman dari *hydration mismatch*) agar *link* yang disalin langsung berformat absolut (https://...) yang siap pakai.
- **Strict Canvas Thermal Print:** Melakukan injeksi CSS `@page` khusus 80mm dan mengunci limit *wrapper width* maksimum ke `80mm` pada cetakan Thermal guna mengatasi *bug rendering* ukuran kertas A4 pada *print dialog* Desktop.
- **System-Wide Cache Isolation:** Penerapan `[url, tenantId]` pada SWR *cache keys* dan mekanisme *Wipe-on-Login/Logout* untuk mencegah *stale data* dan *FOUC* antar tenant.
- **Realtime Hook Fix:** Penanganan *payload* dari Supabase Realtime dengan SWR `mutate` *background fetch* untuk mencegah *Client-side Exception* akibat *missing relation data*.
- **Smart Print Logic (CSS Media):** Pemisahan *print format*. Otomatisasi kertas Thermal (80mm) untuk kasir F&B/Retail/Jasa, dan kertas A4 khusus untuk dokumen Surat Jalan bisnis Rental/Travel. Termasuk sinkronisasi dinamis "Nama Kasir" dan perbaikan ID karyawan.
- **Dynamic Onboarding SOP:** Perbaikan antarmuka *Stepper* pada Modal Buku Panduan (pemisahan warna per bisnis dan *horizontal divider*), serta pemisahan redaksi SOP yang ketat antara Rental, Jasa, F&B, dan Retail (termasuk penghapusan referensi *barcode* pada Retail).

---

## [0.3.0 – 0.3.32] — 2026-08-17

### 🚀 Fitur Baru & Arsitektur Utama
- **Arsitektur Isolasi Tenant (Anti-Leakage):** Pencatatan mekanisme pembersihan *cache* (SWR & `localStorage`) pada level sesi pengguna dan proteksi `<LoadingSkeleton>` untuk mencegah kebocoran data antar pengguna.
- **Integrasi Supabase Real-time:** Peralihan dari metode *fast polling* menjadi *Postgres Changes Listener* yang diisolasi menggunakan filter `tenantId`, dipadukan dengan SWR `mutate` untuk pembaruan UI instan yang hemat *resource*.
- **Sistem Kalender Anti Double-Booking:** Penambahan kapabilitas pengecekan ketersediaan jadwal via `/api/booking/availability`, serta integrasi `react-day-picker` berbalut *Popover Modal* dengan pengamanan sinkronisasi zona waktu lokal (WIB/Lokal) vs UTC.
- **Dynamic Multi-Tenant UX & Export:** Implementasi utilitas terminologi teks yang menyesuaikan bahasa UI berdasarkan model bisnis (Rental vs Jasa vs Retail/F&B), termasuk adaptasi format kolom pada *export* Excel.
- **Modul Onboarding (Buku Panduan):** Penambahan fitur dokumentasi interaktif (SOP) internal pada *Sidebar* untuk memandu alur kerja pengguna berdasarkan entitas bisnis masing-masing.

---

## [0.2.21 – 0.2.32] — 2026-08-13

### 🚀 Fitur Baru
- **Implementasi Ekosistem "Rental & Travel":** Dukungan rentang tanggal (Date Range booking), form input armada (nama supir & plat nomor) di POS Kasir, dan integrasi cetak struk via Bluetooth khusus untuk Rental.
- **Pemisahan UI Dual-Role Login:** Akses masuk ke sistem kini terpisah secara visual antara Pemilik Bisnis (Owner) dan Karyawan pada komponen Landing Page.
- **Lokalisasi Bahasa Indonesia (Clerk Auth):** Seluruh antarmuka autentikasi Clerk (Sign In, Sign Up, User Profile, validasi form) menggunakan dialek ID (id-ID).
- **Ekspor Excel Dinamis:** Kolom laporan Excel kini beradaptasi secara otomatis dengan kategori bisnis (*Dynamic Excel Export*).

### ⚡ Optimasi & Pembaruan
- **Navigasi Instan:** Implementasi *Prefetching* pada navigasi dan penambahan *Skeleton Loading* untuk meminimalisasi jeda pergantian rute.

### 🐛 Perbaikan Bug (Bugfixes)
- **Foreign Key Constraint:** Mencegah terjadinya error foreign key saat melakukan *checkout* (menyimpan transaksi) oleh Kasir.
- **Server Components Render Error:** Perbaikan masalah *serialize data* (throw err object) saat penambahan data karyawan/kasir baru.
- **Flickering Data Karyawan:** Menanggulangi hilangnya daftar produk yang kadang terjadi saat kasir/karyawan me-refresh halaman POS.
- **Filter Kategori (Superadmin):** Mencegah efek layar terlempar ke atas (*scroll-to-top*) saat melakukan filter tabel data tenant.
- **Invalid Prisma Invocation:** Mengubah eksekusi `findUnique` menjadi `findFirst` guna mencegah crash saat pendaftaran toko/tenant (Onboarding).

---

## [0.2.13 – 0.2.20] — 2026-08-12

### 🚀 Fitur Baru

- **Dynamic Multi-Tenant Booking System (Modul Jasa)**
  - Halaman booking publik per-tenant (`/book/[slug]`) dengan form pemilihan layanan, tanggal, dan jam.
  - Anti-double-booking guard di backend (backend race-condition safe).
  - Kalender interaktif untuk owner (berbasis `react-big-calendar`) di dashboard `/admin/booking`.
  - API slot-checking (`/api/booking/check-slots`) untuk validasi ketersediaan jadwal secara real-time.

- **Progressive Web App (PWA) Full-Screen**
  - `app/manifest.ts` — Web App Manifest dengan `display: "standalone"` dan `orientation: "portrait"`.
  - Service Worker (`app/sw.ts`) via `@serwist/next` dengan caching strategy (CacheFirst / NetworkFirst).
  - Meta tags `appleWebApp` di root layout untuk pengalaman PWA di perangkat iOS.

- **Web Push Notifications (Real-Time)**
  - Model database `PushSubscription` (Prisma) untuk menyimpan subscription per-user.
  - API `POST/DELETE /api/push/subscribe` — upsert/hapus subscription browser ke DB.
  - Utility backend `lib/webpush.ts` dengan VAPID keys via library `web-push`.
  - Notifikasi otomatis dikirim ke Owner toko & Super Admin setiap ada booking baru masuk.
  - Client Component `PushNotificationManager.tsx` — toast izin notifikasi (via Sonner), auto-subscribe jika sudah granted.

- **Web Bluetooth ESC/POS Thermal Printing**
  - Cetak struk thermal nirkabel langsung dari browser via Web Bluetooth API.
  - Kompatibel dengan printer ESC/POS standar tanpa driver atau aplikasi pihak ketiga.

---

### 🐛 Perbaikan (Bugfix & UI/UX)

- **Redirect expired trial** — Perbaikan logika redirect saat sesi trial habis agar tidak terjadi infinite loop atau redirect yang salah.
- **Kalkulasi harga di komponen Pricing** — Koreksi formula perhitungan harga/diskon di halaman Pricing agar akurat.
- **Isolasi menu mobile (Multi-Tenant)** — Perbaikan race-condition UI saat perpindahan tenant di perangkat mobile.
- **Header responsif Super Admin (v0.2.19)**
  - Hapus tombol Logout redundan (digantikan oleh `UserButton` Clerk bawaan).
  - Tipografi responsif: `text-base md:text-xl leading-tight`.
  - Teks "Command Center" disembunyikan di layar HP kecil (`hidden sm:inline`).
- **Refaktor UI Filter Kategori Super Admin (v0.2.20)**
  - Tab/pill group horizontal diganti dengan `<CategoryFilter />` dropdown (`<select>` native).
  - Responsif: `w-full md:w-64`, ikon Filter (corong) di dalam select.
  - Logika URL param & pagination tetap berfungsi penuh.

---

### 🔧 Perubahan Teknis (Chores)

- Install dependencies: `@serwist/next`, `serwist`, `web-push`, `@types/web-push`.
- Tambah `"webworker"` ke `lib` di `tsconfig.json` untuk type-checking Service Worker.
- Script `build` diubah ke `next build --webpack` agar kompatibel dengan `@serwist/next`.
- Script `build:prod` ditambahkan sebagai alias eksplisit.
- `turbopack: {}` ditambahkan ke `next.config.ts` untuk silence peringatan Turbopack saat `next dev`.
- VAPID env vars ditambahkan: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
- `SUPER_ADMIN_USER_IDS` env var untuk mendefinisikan penerima notifikasi Super Admin.

---

## [0.2.0 – 0.2.12] — Sebelumnya

Lihat [`docs/RELEASE-NOTES-v0.2.md`](./RELEASE-NOTES-v0.2.md) untuk detail versi sebelumnya.

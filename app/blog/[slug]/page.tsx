import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

const posts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  featured: boolean;
  content: string;
}> = {
  'cara-pilih-pos-umkm-2024': {
    title: 'Cara Memilih Aplikasi Kasir (POS) Terbaik untuk UMKM Indonesia 2024',
    excerpt: 'Panduan lengkap memilih POS: harga, fitur vertikal, integrasi, support. Termasuk checklist 15 poin wajib cek sebelum bayar.',
    category: 'Panduan',
    readTime: '8 menit',
    date: '2024-12-01',
    tags: ['POS UMKM', 'Panduan', 'Tips Bisnis'],
    featured: true,
    content: `
# Cara Memilih Aplikasi Kasir (POS) Terbaik untuk UMKM Indonesia 2024

Memilih POS itu kayak pilih pegawai tetap — harus cocok, jujur, dan nggak bikin repot. Banyak UMKM salah pilih karena tergiur hardware "gratis" atau sales manis, tapi akhirnya stuck dengan biaya bulanan membengkak dan fitur yang nggak dipakai.

## 1. Kenali Jenis Bisnis Anda Dulu

POS nggak one-size-fits-all. Butuh beda tergantung vertikal:

| Vertikal | Fitur Wajib | Nice to Have |
|----------|-------------|--------------|
| **Retail** (toko, fashion, minimarket) | Multi-varian, barcode, stok otomatis, diskon, PPN | Label harga, multi-cabang, member/loyalty |
| **F&B** (restoran, kafe, warung) | Meja, split bill, KDS, modifier, ojol | QR order, resep bahan baku, kitchen printer |
| **Jasa** (bengkel, laundry, salon) | Booking, tracking progres, notifikasi WA, histori | Komisi teknisi, sparepart inventory, kontrak |
| **Rental** (mobil, villa, alat) | Kalender booking, deposit, denda, prorata | Kontrak digital, kondisi foto, multi-tipe unit |

**PJTECH** satu-satunya yang native support 4 vertikal ini di satu harga.

## 2. Hitung Total Cost of Ownership (TCO)

Jangan cek harga stiker saja. Hitung 1 tahun:

\`\`\`
TCO = (Fee Tahunan) + (Biaya Hardware) + (Biaya Modul Tambahan) + (Biaya Support) + (Waktu Setup & Training)
\`\`\`

Contoh real 2024:
- **PJTECH**: Rp 990.000 (all-in, nggak ada biaya tambah)
- **Moka**: Rp 1.800.000 + KDS Rp 6.000.000/th + Ojol middleware + Hardware wajib
- **Pawoon**: Rp 2.400.000 + Module tambahan per fitur
- **Qashier**: Rp 3.600.000 (termasuk hardware tapi lock-in)

## 3. Checklist 15 Poin Wajib Cek

Sebelum bayar, pastikan POS punya:

### Dasar
- [ ] **Harga transparan** di website (tanpa "hubungi sales")
- [ ] **Gratis trial minimal 14 hari** (tanpa kartu kredit)
- [ ] **Support bahasa Indonesia** jam kerja WIB

### Fitur Inti
- [ ] **Stok otomatis** berkurang saat jual + alert minimum
- [ ] **Multi-metode bayar**: Tunai, QRIS, Transfer, Kartu, Cicilan
- [ ] **Laporan pajak PPN** siap ekspor ke Jurnal/Accurate/Xero
- [ ] **Backup data otomatis** ke cloud (nggak manual export)

### Teknis
- [ ] **Jalan di HP & Laptop** (PWA / Responsive)
- [ ] **Mode offline** (tetap bisa transaksi kalau internet putus)
- [ ] **Printer bluetooth 58/80mm** auto-detect (nggak perlu driver)
- [ ] **API/Integrasi** untuk akuntansi, ojol, WA

### Vertikal Spesifik
- [ ] **F&B**: KDS included (nggak bayar tambah), split bill, integrasi ojol native
- [ ] **Retail**: Multi-varian unlimited, barcode scanner HP
- [ ] **Jasa**: Booking online, tracking progres, notifikasi WA otomatis
- [ ] **Rental**: Kalender visual, deposit/denda auto, invoice prorata

### Legal & Keamanan
- [ ] **Data isolasi total** (multi-tenant, nggak bocor ke toko lain)
- [ ] **Role-based access** (Owner, Kasir, Teknisi beda hak akses)
- [ ] **Audit log** siapa apa kapan (untuk kepercayaan & kompliance)

## 4. Red Flags (Lari Kalau Ada)

- ❌ "Gratis hardware" tapi kontrak 2-3 tahun + fee bulanan tinggi
- ❌ Harga nggak di website, harus "hubungi sales"
- ❌ KDS, Ojol, WA, Multi-cabang = bayar tambah per modul
- ❌ Support cuma chatbot / ticket (nggak ada orang nyata)
- ❌ Data nggak bisa export lengkap (vendor lock-in)
- ❌ Offline mode nggak ada (internet putus = toko tutup)

## 5. Test Drive Sebelum Bayar

**Wajib** coba trial:
1. Daftar trial (harus < 5 menit)
2. Setup 1 toko dummy (input 10 produk, 1 transaksi)
3. Test fitur vertikal Anda (meja/KDS/booking/kalender)
4. Test printer bluetooth
5. Test laporan & ekspor CSV
6. Test mode offline (matikan wifi → transaksi → nyalakan → sync)
7. Chat support → ukur response time & kualitas jawaban

## 6. Keputusan: Pilih Yang Bikin Hidup Lebih Mudah

POS yang bagus = **nggak terasa ada** (seamless). Yang buruk = **bikin kerja dobel** (input manual, reconcile manual, laporan manual).

**PJTECH** dirancang dari ground-up untuk UMKM Indonesia:
- Harga **Rp 990.000/tahun all-in** (nggak ada biaya tersembunyi)
- **4 vertikal native** di satu aplikasi
- **KDS, WA API, Ojol, Offline, Multi-cabang** included
- **Support tim Indonesia** paham operational toko/restoran/bengkel/rental
- **Gratis 14 hari** tanpa kartu kredit

---

### Siap Coba?
[Mulai Gratis 14 Hari →](/sign-up?redirect_url=/onboarding)

*Punya pertanyaan spesifik untuk bisnis Anda? [Chat kami via WhatsApp](https://wa.me/62800000000) — tim kami bantu rekomendasi setup yang pas.`
  },
  'pos-fnb-kds-ojol-terbaik': {
    title: 'POS F&B Terbaik 2024: KDS Included + Integrasi GoFood/GrabFood Native',
    excerpt: 'Kenapa restoran & kafe pindah ke PJTECH: KDS gratis di HP, order ojol masuk otomatis ke dapur, split bill fleksibel. Hemat Rp 6jt+/bln vs kompetitor.',
    category: 'F&B',
    readTime: '6 menit',
    date: '2024-11-28',
    tags: ['POS F&B', 'KDS', 'GoFood', 'GrabFood', 'Restoran'],
    featured: true,
    content: `# POS F&B Terbaik 2024: KDS Included + Integrasi GoFood/GrabFood Native

Kalau Anda punya restoran/kafe/warung makan, **Kitchen Display System (KDS)** bukan optional — wajib. Tapi kompetitor kasir KDS jual terpisah Rp 500rb - 1jt/bulan per layar.

## Masalah F&B Pakai POS Biasa

1. **KDS mahal** → Rp 500rb-1jt/bln per layar × 2-3 station = Rp 1-3jt/bln extra
2. **Ojol manual** → Order GoFood/GrabFood masuk HP terpisah → ketik manual ke POS → salah order, lambat, stok nggak sinkron
3. **Split bill ribet** → Hitung manual, cetak struk terpisah, kasir stres jam sibuk
4. **Modifier nggak sinkron stok** → "Extra telur" nggak kurangi stok telur → HPP salah

## Solusi PJTECH F&B (All Included)

| Fitur | Kompetitor | PJTECH |
|-------|------------|--------|
| **KDS** | Bayar Rp 500rb-1jt/bln/station | ✅ **Gratis** (pakai HP/Tablet lama) |
| **Integrasi GoFood/GrabFood** | Middleware Rp 500rb+/bln | ✅ **Native Official API** |
| **Split Bill** | Hanya rata | ✅ **Item / Rata / Nominal Custom** |
| **Modifier + Stok Bahan** | Catatan saja | ✅ **Resep → Auto kurangi stok bahan** |
| **Open Bill / Transfer Meja** | Basic | ✅ **Lengkap + Void dengan alasan** |
| **Multi-Printer** | Bayar tambah | ✅ **Included (Kasir + Dapur per Station)** |

## Real Case: Warung Makan "Bu Siti" - Bandung

**Sebelum (Moka):**
- Fee: Rp 1.800.000/th + KDS 2 station Rp 1.200.000/th + Ojol middleware Rp 600.000/th = **Rp 3.600.000/th**
- Order ojol manual → rata 3-5 kesalahan/hari
- Split bill hitung manual → antrian kasir panjang

**Sesudah (PJTECH):**
- Fee: **Rp 990.000/th** (all-in)
- KDS 2 station: **Gratis** (pakai 2 HP Android bekas Rp 1.5jt)
- Ojol native: **Auto sync** → 0 kesalahan
- Split bill: **3 detik** → antrian kasir cepat

**Hemat: Rp 2.610.000/tahun + operasional lancar**

## Fitur KDS PJTECH Yang Bikin Dapur Tenang

1. **Layar per Station** → Pisah: Masak / Minum / Grill / Fry
2. **Status Real-time** → Pending (kuning) → Cooking (biru) → Ready (hijau)
3. **Bump Touch/HP** → Tekan layar HP → status update (nggak perlu tombol fisik)
4. **Modifier Tampil Jelas** → "Nasi Goreng - Pedas Sedang - Telur 2 - Kerupuk"
5. **Resep Bahan Baku** → 1 Nasi Goreng = 150gr beras + 2 telur + 50gr ayam → stok bahan auto kurangi
6. **Sound Alert** → Bunyi notifikasi order baru (bisa custom)

## Integrasi GoFood & GrabFood: Native = Aman

- **Official Meta/GoTo API** → nggak unofficial/scraper (banned risk)
- **Order masuk otomatis** → label "GoFood" / "GrabFood" di POS & KDS
- **Status sync ke partner** → "Dimasak" → "Siap Antar" → partner update real-time
- **Laporan terpisah** → Penjualan dine-in vs takeaway vs ojol
- **Promo ojol** → Sinkron ke POS (diskon otomatis apply)

## Split Bill Yang Beneran Fleksibel

| Mode | Use Case |
|------|----------|
| **By Item** | Masing-masing bayar pesanannya sendiri |
| **Rata** | Nongkrong teman, bayar sama rata |
| **Nominal Custom** | A bayar 100rb, B bayar 50rb, C bayar sisanya |
| **Open Bill** | Makan dulu, bayar nanti (simpan di meja) |
| **Transfer Meja** | Pindah ke meja kosong, struk ikut pindah |

## Kesimpulan: Jangan Bayar KDS & Ojol Terpisah

**PJTECH F&B = Rp 990.000/tahun all-inclusive**

Sudah termasuk:
✅ KDS unlimited station (pakai HP/tablet yang ada)
✅ GoFood + GrabFood native integration
✅ Split bill unlimited mode
✅ Modifier + resep bahan baku
✅ Multi-printer (kasir + dapur per station)
✅ QR Order meja (pelanggan order dari HP)
✅ PPN & ekspor akuntan
✅ Mode offline (tetap jalan kalau internet putus)

---

### Lihat Demo F&B Langsung
[Coba Gratis 14 Hari →](/sign-up?redirect_url=/onboarding)

*Butuh bantuan setup KDS di dapur? Tim kami bantu remote setup gratis selama trial.`
  },
  'pos-jasa-bengkel-laundry-tracking-wa': {
    title: 'POS Jasa/Servis Terbaik: Tracking Progres + Notifikasi WA Otomatis',
    excerpt: 'Bengkel, laundry, salon butuh tracking transparan. PJTECH: booking online, progress real-time, WA auto ke pelanggan, komisi teknisi otomatis. Mulai Rp 990rb/th.',
    category: 'Jasa/Servis',
    readTime: '7 menit',
    date: '2024-11-25',
    tags: ['POS Bengkel', 'POS Laundry', 'POS Salon', 'Tracking Servis', 'WhatsApp API'],
    featured: false,
    content: `# POS Jasa/Servis Terbaik: Tracking Progres + Notifikasi WA Otomatis

Bisnis jasa (bengkel, laundry, salon, service AC/HP) beda sama retail/F&B. Produknya **waktu & keahlian**, bukan barang. Butuh: **booking → tracking → komunikasi → invoice → histori**.

## Masalah Jasa Pakai POS Retail Biasa

1. **Nggak ada booking** → Pelanggan telepon/WA manual → antrian kacau
2. **Nggak ada tracking** → Pelanggan tanya "sudah selesai?" → teknisi dipanggil → ganggu kerja
3. **WA manual** → Ketik satu-satu: "booking konfirmasi", "sudah selesai", "silakan ambil" → capek & lupa
4. **Komisi teknisi manual** → Hitung Excel akhir bulan → salah, dispute, gaji telat
5. **Histori cuma transaksi** → Nggak ada foto kerusakan, detail sparepart, catatan teknisi

## Solusi PJTECH Jasa/Servis (Native, All-In)

### 1. Booking Online + Antrian Real-time
- Pelanggan booking via **Web/WA** → masuk otomatis ke antrian
- **Estimasi selesai** otomatis berdasarkan jenis servis
- **Reminder otomatis** H-1 & H hari via WA
- **Walk-in** → kasir tambah ke antrian manual (drag-drop urutan)

### 2. Progress Tracking Transparan
\`\`\`
Status: MENUNGGU → DIKERJAKAN → SELESAI → DIAMBIL
       ↓           ↓            ↓           ↓
    (Antrian)  (Teknisi)    (Notif WA)  (Invoice)
\`\`\`
- Teknisi update status via HP (nggak perlu ke kasir)
- **Foto before/after** wajib/upload optional
- **Timeline** lengkap: siapa, kapan, apa, berapa lama

### 3. Notifikasi WhatsApp Otomatis (5 Trigger)
| Trigger | Isi Pesan |
|---------|-----------|
| **Booking Konfirmasi** | "Halo [Nama], booking [Servis] dikonfirmasi [Tanggal Jam]. Antrian ke-[N]. Estimasi selesai [Jam]." |
| **Mulai Dikerjakan** | "[Nama], unit Anda mulai dikerjakan oleh [Teknisi]. Estimasi selesai [Jam]." |
| **Selesai & Siap Diambil** | "[Nama], [Servis] sudah selesai. Total: Rp [X]. Silakan ambil di [Alamat]. Bisa bayar QRIS/Tunai/Transfer." |
| **Invoice & Pembayaran** | Link invoice PDF + payment link (Midtrans/Xendit) |
| **Rating & Follow-up** | "Bagaimana pelayanannya? Rating 1-5: [Link]. Terima kasih percaya di [Nama Toko]!" |

**Pakai WhatsApp Cloud API (Official Meta)** → badge hijau verified, nggak banned, gratis 1000 percakapan/bln.

### 4. Histori Servis Per Pelanggan (Lengkap)
Cari by: **Plat Nomor / Nama / No HP / Tanggal**
Detail tiap servis:
- Keluhan pelanggan (voice-to-text / ketik)
- Foto kerusakan (before)
- Sparepart diganti + HPP + harga jual
- Jasa yang dikerjakan + teknisi + durasi
- Foto hasil (after)
- Total biaya + pembayaran
- Rating pelanggan

**Value:** Pelanggan balik → lihat histori → "Pak, service AC tgl 15 lalu kan? Sekarang bunyi aneh lagi" → teknisi tahu konteks → cepat diagnose.

### 5. Komisi Teknisi & Slip Gaji Otomatis
Setup sekali:
- **Per Jasa**: Komisi % (contoh: Service AC 20%) / Flat (Rp 50.000)
- **Per Sparepart**: Komisi flat (Rp 10.000 per item)
- **Gaji Pokok** + **Komisi** - **Potongan** = **Total Gaji**

**Akhir bulan:** Generate slip gaji semua teknisi → PDF/WA/Print → distribusi. Nggak ada hitung manual, nggak ada dispute.

### 6. Sparepart Inventory Terpisah
- Stok sparepart beda dari "jasa"
- HPP, minimum stok, supplier, pembelian, retur rusak
- Saat servis pakai sparepart → stok auto kurangi → komisi teknisi auto hitung

## Real Case: Bengkel "Makmur Jaya" - Surabaya

**Sebelum (POS Retail + Manual):**
- Booking telepon → antrian kacau
- Pelanggan tanya status → teknisi dihentikan kerja → service lambat
- Komisi teknisi hitung manual Excel → rata 2 dispute/bln
- Histori cuma nota → pelanggan tanya "tgl berapa ganti oli?" → cari manual

**Sesudah (PJTECH Jasa):**
- Booking web/WA → antrian otomatis rapi
- Pelanggan cek status via WA → nggak ganggu teknisi
- Komisi auto → 0 dispute 6 bulan
- Histori lengkap + foto → diagnostik cepat, pelanggan trust

**Revenue naik 23%** (dari upsell sparepart yang ter-track + pelanggan repeat order)

## Cocok Untuk:
- ✅ Bengkel Motor / Mobil
- ✅ Laundry (Kiloan + Satuan + Express)
- ✅ Salon / Barbershop / Spa
- ✅ Service AC / Kulkas / Mesin Cuci
- ✅ Service HP / Laptop / Elektronik
- ✅ Bengkel Body Repair / Cat
- ✅ Tukang Servis Rumah (AC, Pipa, Listrik)

---

### Lihat Demo Jasa/Servis
[Coba Gratis 14 Hari →](/sign-up?redirect_url=/onboarding)

*Tim kami bantu setup kategori jasa, komisi teknisi, & template WA selama trial.`
  },
  'pos-rental-mobil-villa-kalender-deposit': {
    title: 'POS Rental/Travel/Properti: Kalender Booking + Deposit/Denda Otomatis',
    excerpt: 'Rental mobil, villa, apartemen, alat butuh kalender visual & perhitungan otomatis. PJTECH: drag-drop booking, deposit/denda auto, invoice prorata, kontrak digital. Mulai Rp 990rb/th.',
    category: 'Rental/Properti',
    readTime: '6 menit',
    date: '2024-11-20',
    tags: ['POS Rental Mobil', 'Booking Villa', 'Sewa Apartemen', 'Invoice Prorata', 'Kontrak Digital'],
    featured: true,
    content: `# POS Rental/Travel/Properti: Kalender Booking + Deposit/Denda Otomatis

Bisnis rental (mobil, villa, apartemen, alat/peralatan) beda fundamental: **produk = waktu**. Nggak ada stok yang "habis" — tapi **ketersediaan di rentang tanggal**.

## Masalah Rental Pakai POS/Excel Biasa

1. **Double booking** → Kalender manual/excel → 2 orang booking unit sama tanggal sama
2. **Denda manual** → Hitung kalkulator: "telat 3 jam × Rp 50.000 = Rp 150.000" → salah, dispute
3. **Invoice prorata ribet** → Booking 15-30 Januari, harga bulanan Rp 3jt → hitung manual 16 hari
4. **Deposit dispute** → "Kaca pecah siapa?" → nggak ada bukti foto check-in/out
5. **Kontrak kertas** → Hilang, nggak bisa search, e-sign nggak ada

## Solusi PJTECH Rental (Native, All-In)

### 1. Kalender Ketersediaan Visual (Drag-Drop)
- **View**: Bulanan / Mingguan / Harian
- **Warna status**: 🟢 Tersedia | 🔴 Dibooking | 🟡 Maintenance | ⚪ Offline
- **Filter**: Per unit (Avanza, Villa Melati, Kamera Sony) / Per tipe (SUV, Villa 2BR, Camera)
- **Drag-drop** geser booking → auto cek conflict
- **Multi-unit** → 10 mobil + 5 villa + 20 alat di satu kalender

### 2. Booking Berbasis Waktu Fleksibel
| Model | Contoh | Pricing |
|-------|--------|---------|
| **Per Jam** | Rental mobil pickup, alat sound | Rp 50.000/jam (min 3 jam) |
| **Per Hari** | Mobil harian, villa weekend | Rp 300.000/hari |
| **Per Minggu** | Kos/kontrakan, villa long-stay | Rp 1.500.000/minggu |
| **Per Bulan** | Apartemen, kontrakan bulanan | Rp 3.000.000/bulan |
| **Custom** | Early check-in 6AM, Late check-out 2PM | Biaya tambah otomatis |

### 3. Deposit & Denda Keterlambatan **Otomatis**
**Setup sekali di tiap unit:**
- Deposit: Persen (20%) / Flat (Rp 1.000.000)
- Denda: Per jam (Rp 50.000/jam) / Per hari (Rp 200.000/hari)
- Grace period: 15 menit / 1 jam (configurable)

**Saat check-out:** Sistem auto hitung:
\`\`\`
Waktu seharusnya: 14:00
Waktu aktual: 16:30
Telat: 2.5 jam
Denda: 2.5 × Rp 50.000 = Rp 125.000
Total tagihan: Sewa + Denda - Deposit (kalau refund)
\`\`\`
**Nggak ada hitung manual, nggak ada dispute.**

### 4. Invoice Prorata Otomatis
Booking **15-30 Januari** (16 hari), harga bulanan **Rp 3.000.000**:
\`\`\`
Harian: 3.000.000 / 31 = Rp 96.774/hari
16 hari: 16 × 96.774 = Rp 1.548.387
\`\`\`
**Otomatis generate invoice** → nggak perlu Excel. Support juga:
- Prorata mingguan/bulanan
- Upgrade/downgrade unit tengah kontrak (hitung selisih)
- Perpanjangan otomatis (auto-generate invoice berikutnya)

### 5. Kontrak Digital + E-Sign
1. **Template kontrak** custom per tipe (mobil/villa/alat)
2. **Generate PDF** otomatis dengan data: penyewa, unit, tanggal, harga, deposit, denda, syarat
3. **Kirim via WA/Email** → link e-sign
4. **Pelanggan tanda tangan** (draw/tik "Saya Setuju")
5. **Tersimpan otomatis** di histori unit & pelanggan
6. **Legal basis** → UU ITE (e-sign sah di Indonesia)

### 6. Checklist Kondisi + Foto 360° (Anti Dispute Deposit)
**Check-in (Ambil):**
- Checklist: Body (✅/❌), Kaca (✅/❌), Ban (✅/❌), Mesin (✅/❌), Interior (✅/❌)
- **Foto 360°** wajib (4 sisi + interior + dashboard/kelistrikan)
- Tersimpan di cloud + link di invoice

**Check-out (Kembalikan):**
- Checklist ulang + foto 360°
- **Auto-compare** (AI optional / manual review)
- Kerusakan baru → masuk klaim deposit → bukti foto

### 7. Multi-Tipe Unit Dalam Satu Akun
| Kategori | Unit Contoh | Pricing Bedanya |
|----------|-------------|-----------------|
| **Armada** | Avanza, Xenia, Innova, Brio, Supra X | Per jam/hari |
| **Properti** | Villa 2BR, Villa 3BR, Kamar Kos, Apt Studio | Per hari/minggu/bulan |
| **Alat** | Kamera Sony A7, Sound JBL, Tenda 4P, Generator | Per hari |
| **Travel** | Innova + Supir, Hiace + Supir | Per hari + jasa supir |

Masing-masing **kalender terpisah** tapi **satu dashboard Owner**.

## Real Case: "Rental Mobil Pak Budi" - Bali

**Sebelum (Excel + WA Manual):**
- Double booking 2×/bulan → refund + kerugian reputasi
- Denda manual → dispute 30% kasus → pelanggan bad review
- Invoice prorata hitung manual → salah → revenue leak
- Kontrak kertas → 2 hilang → sulit klaim asuransi

**Sesudah (PJTECH Rental):**
- **0 double booking** 8 bulan
- **Denda auto** → 0 dispute (pelanggan lihat hitungan transparan)
- **Invoice prorata akurat** → revenue akurat
- **Kontrak digital + foto** → klaim asuransi lancar, deposit dispute 0%

**Revenue naik 18%** (dari upgrade unit otomatis + perpanjangan auto-renew)

## Cocok Untuk:
- ✅ Rental Mobil / Motor (Harian, Mingguan, Bulanan)
- ✅ Villa / Homestay / Airbnb Host
- ✅ Apartemen / Kos / Kontrakan
- ✅ Rental Alat: Kamera, Sound, Lighting, Tenda Camping, Generator, Alat Konstruksi
- ✅ Travel: Mobil + Supir (pisah harga sewa mobil & jasa supir)
- ✅ Rental Pesta: Kursi, Meja, Tend, Panggung, AC Portable

---

### Lihat Demo Rental/Properti
[Coba Gratis 14 Hari →](/sign-up?redirect_url=/onboarding)

*Butuh setup kalender armada 20 unit? Tim kami bantu import data & konfigurasi gratis selama trial.`
  },
  'import-produk-excel-template-vertikal': {
    title: 'Import Produk via Excel: Template Siap Pakai per Vertikal',
    excerpt: 'Tidak perlu input manual satu-satu. PJTECH sediakan template Excel standar untuk Retail, F&B (3 template), Jasa, dan Rental. Upload sekali, langsung jualan.',
    category: 'Tips',
    readTime: '5 menit',
    date: '2026-08-20',
    tags: ['Import Excel', 'Template Produk', 'Setup Cepat', 'Migrasi Data'],
    featured: false,
    content: `# Import Produk via Excel: Template Siap Pakai per Vertikal

Setup POS paling makan waktu di **input data produk**. Kalau 100+ SKU input manual satu-satu → 2-3 hari kerja. PJTECH sediakan **template Excel standar per vertikal** — isi, upload, langsung jualan.

## Kenapa Template Excel?

| Cara Input | Waktu 100 SKU | Resiko Error | Cocok Untuk |
|------------|---------------|--------------|-------------|
| **Manual satu-satu** | 2-3 hari | Tinggi (typo, dobel, lupa varian) | < 20 SKU |
| **Template Excel** | **15-30 menit** | Rendah (validasi otomatis) | **Semua skala** |
| **Migrasi dari POS lama** | 30-60 menit | Sedang (butuh mapping kolom) | Pindah sistem |

## Template Tersedia per Vertikal

### 1. Retail — \`template-retail.xlsx\`
Kolom wajib:
- \`nama_produk\`, \`kategori\`, \`harga_jual\`, \`stok_awal\`
Kolom opsional:
- \`sku\`, \`barcode\`, \`varian_ukuran\`, \`varian_warna\`, \`harga_beli\`, \`stok_minimum\`, \`ppn_include\` (true/false), \`diskon_persen\`, \`deskripsi\`

**Contoh varian:** 1 produk "Kaos Polos" → 4 varian: S-Merah, S-Biru, M-Merah, M-Biru (setiap varian SKU & stok beda)

### 2. F&B — 3 Template Terpisah

| Template | File | Cocok Untuk |
|----------|------|-------------|
| **Kafe & Coffee Shop** | \`template-fnb-kafe.xlsx\` | Minuman (kopi, non-kopi), makanan ringan, modifier level manis/es/toppings |
| **Restoran & Rumah Makan** | \`template-fnb-resto.xlsx\` | Nasi, lauk, sayur, minuman, paket combo, modifier pedas/telur/nasi |
| **Warung Makan & Fast Food** | \`template-fnb-warung.xlsx\` | Menu cepat saji, paket nasi, level pedas, tambahan kerupuk/es teh |

Kolom khusus F&B:
- \`resep_bahan_baku\` (format JSON: \`[{"bahan":"Beras","qty":150,"satuan":"gr"},{"bahan":"Telur","qty":2,"satuan":"butir"}]\`)
- \`tipe_printer\` (kasir/dapur/bar)
- \`modifier_grup\` (level pedas, topping, porsi)

### 3. Jasa/Servis — \`template-jasa.xlsx\`
Kolom:
- \`nama_layanan\`, \`kategori\`, \`harga_jasa\`, \`durasi_estimasi_menit\`
- \`komisi_persen\` / \`komisi_flat\`, \`sparepart_terkait\` (opsional)
- Contoh: "Service AC Split 1PK" | AC | 150.000 | 60 | 20% | Freon, Kabel

### 4. Rental — \`template-rental.xlsx\`
Kolom:
- \`nama_unit\`, \`tipe\` (mobil/villa/kamera/alat), \`harga_per_jam\`, \`harga_per_hari\`, \`harga_per_minggu\`, \`harga_per_bulan\`
- \`deposit_flat\`, \`deposit_persen\`, \`denda_per_jam\`, \`denda_per_hari\`, \`grace_period_menit\`
- \`deskripsi_kondisi\`, \`foto_url\` (opsional)

## Cara Import (3 Langkah)

1. **Download template** dari dashboard → Menu Produk → Import Excel
2. **Isi data** di Excel (bisa pakai Google Sheets / LibreOffice / Excel)
3. **Upload file** → Sistem validasi otomatis → Preview hasil → Konfirmasi

**Validasi otomatis cek:**
- ❌ SKU/Barcode duplikat
- ❌ Harga minus / nol
- ❌ Stok negatif
- ❌ Kolom wajib kosong
- ❌ Format resep bahan baku salah (F&B)

## Migrasi dari POS Lain (Moka, Pawoon, iReap, Qashier)

1. **Export dari sistem lama** → biasanya CSV/Excel
2. **Mapping kolom** ke template PJTECH (kami sediain mapping guide)
3. **Bersihkan data** (hapus produk tidak aktif, standarkan nama kategori)
4. **Import ke PJTECH** → review preview → simpan

**Tim kami bantu remote** selama trial kalau data kompleks (> 500 SKU / multi-cabang).

## Tips Supaya Import Lancar

| Tips | Kenapa Penting |
|------|----------------|
| **Isi minimal kolom wajib** | Sistem butuh nama, harga, stok minimum |
| **Gunakan SKU unik** | Biar update stok & laporan akurat |
| **Standarkan nama kategori** | "Minuman" bukan "Minuman " (spasi) / "minuman" |
| **Test 5 produk dulu** | Cek varian, harga, stok benar sebelum import semua |
| **Backup file Excel asli** | Kalau salah, bisa import ulang cepat |

## Setelah Import: Siap Jualan Langsung

- ✅ Produk muncul di kasir dengan kategori rapi
- ✅ Varian (Retail/F&B) sudah terstruktur
- ✅ Stok real-time dari hari 1
- ✅ Resep bahan baku (F&B) → HPP otomatis
- ✅ Komisi teknisi (Jasa) sudah ter-setup
- ✅ Harga rental per jam/hari/bulan sudah aktif

---

### Coba Import Sekarang
[Gratis 14 Hari + Template Excel →](/sign-up?redirect_url=/onboarding)

*Download template langsung dari dashboard setelah daftar. Tim kami bantu review file Excel Anda sebelum import.`
  },
  'offline-mode-pwa-umkm-indonesia': {
    title: 'Mode Offline PWA: Transaksi Tetap Jalan Saat Internet Mati',
    excerpt: 'PJTECH pakai IndexedDB untuk offline-first. Kasir tetap bisa transaksi, data tersimpan lokal, auto-sync begitu internet nyala. Cocok area sinyal lemah.',
    category: 'Teknis',
    readTime: '4 menit',
    date: '2026-08-15',
    tags: ['Offline Mode', 'PWA', 'IndexedDB', 'Sinkronisasi Data'],
    featured: false,
    content: `# Mode Offline PWA: Transaksi Tetap Jalan Saat Internet Mati

Realita di Indonesia: **internet nggak selalu stabil**. Listrik padam, putus kabel, sinyal lemah di daerah, atau ISP maintenance. POS tradisional (online-only) → toko **harus tutup** kalau internet putus.

PJTECH beda: **Offline-First PWA** pakai **IndexedDB** (database di browser).

## Cara Kerja Offline-First PJTECH

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    NORMAL (ONLINE)                          │
│  Kasir → Transaksi → Server (PostgreSQL) → Sync Real-time  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE (INTERNET PUTUS)                 │
│  Kasir → Transaksi → IndexedDB (Browser/Lokal) → Queue     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    RECONNECT (INTERNET NYALA)               │
│  Queue → Auto Push ke Server → Sync Conflict Resolution    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Apa Saja Yang Bisa Dilakukan Offline?

| Fitur | Status Offline | Catatan |
|-------|----------------|---------|
| **Transaksi Penjualan** | ✅ **Full** | Scan barcode, hitung total, cetak struk |
| **Pembayaran Tunai/QRIS** | ✅ **Full** | QRIS offline pakai static QR (bayar nanti sync) |
| **Input Produk Baru** | ✅ **Full** | Masuk queue, sync ke server nanti |
| **Update Stok** | ✅ **Full** | Stok lokal kurangi, server update nanti |
| **Laporan Harian** | ✅ **Full** | Generate dari data lokal |
| **KDS (Dapur)** | ✅ **Full** | Order offline → tampil di KDS lokal |
| **Booking Rental/Jasa** | ✅ **Full** | Masuk antrian lokal |
| **Sinkronisasi Multi-Cabang** | ⏳ **Queue** | Sync begitu online, merge conflict auto |

## Teknologi: IndexedDB (Bukan localStorage)

| Aspek | localStorage | **IndexedDB (PJTECH)** |
|-------|--------------|------------------------|
| Kapasitas | ~5 MB | **Ratusan MB** (bisa ribuan transaksi) |
| Query | Key-value only | **Index, Cursor, Transaction** |
| Offline Complex | Sulit | **Native support** |
| Browser Support | Semua | Modern browsers (Chrome, Safari, Firefox, Edge) |

## Sinkronisasi Otomatis & Conflict Resolution

1. **Detect online** → Service Worker trigger sync
2. **Push queue** → Transaksi dikirim batch ke server
3. **Conflict check** → Server bandingkan timestamp & user
4. **Auto-merge** → Strategi: *Last write wins* + *Server authoritative untuk stok*
5. **Clear queue** → Data lokal dihapus setelah sukses
6. **Notifikasi** → "Sinkronisasi selesai: 23 transaksi, 0 conflict"

## Conflict Resolution: Stok Produk (Critical)

**Skenario:** Cabang A & B offline keduanya. Cabang A jual 5 unit, Cabang B jual 3 unit. Stok server = 100.

| Langkah | Aksi |
|---------|------|
| 1. Cabang A online → push 5 terjual → Server stok = 95 |
| 2. Cabang B online → push 3 terjual → Server cek: stok 95 ≥ 3 → OK → Server stok = 92 |
| 3. **Kalau stok tidak cukup** → Server reject → Cabang B notif: "Stok tidak cukup untuk sync 3 unit (tersisa 2). Hubungi admin." |

**Hasil:** Nggak ada overselling. Stok selalu akurat.

## PWA = Installable Seperti App Native

- **Install di HP** → "Add to Home Screen" → icon seperti app
- **Fullscreen** → Nggak ada address bar, feel seperti app native
- **Push Notification** → Notifikasi stok minim, order baru, sinkronisasi selesai
- **Background Sync** → Sync otomatis di background kalau HP unlock & online

## Test Offline Sendiri (5 Menit)

1. Buka POS di HP/Tablet
2. **Matikan WiFi + Data Seluler** (Mode Pesawat)
3. Lakukan transaksi: scan produk → bayar tunai → cetak struk Bluetooth
4. Cek laporan harian → data lengkap
5. **Nyalakan internet** → tunggu 5 detik → notifikasi "Sinkronisasi selesai"
6. Cek dashboard Owner (Laptop) → transaksi sudah masuk

## Cocok Untuk:

| Lokasi / Situasi | Kenapa Butuh Offline |
|------------------|---------------------|
| **Toko di mal/basement** | Sinyal lemah / tidak stabil |
| **Warung pinggir jalan** | Pakai hotspot HP, sering putus |
| **Restoran area luar kota** | ISP cuma 1, sering maintenance |
| **Event/bazaar temporary** | Nggak ada WiFi permanen |
| **Area rawan listrik padam** | UPS kasir bisa, tapi router mati |
| **Backup line** | Internet utama putus → auto pakai hotspot |

## Batasan (Jujur)

| Fitur | Offline | Butuh Online |
|-------|---------|--------------|
| **Login pertama kali** | ❌ | ✅ (butuh auth ke server) |
| **Sinkronisasi multi-cabang** | ⏳ Queue | ✅ |
| **Integrasi GoFood/GrabFood** | ❌ | ✅ (API partner butuh internet) |
| **WA Notifikasi** | ⏳ Queue | ✅ (kirim via Meta API) |
| **Backup ke Cloud** | ⏳ Queue | ✅ |
| **Update Aplikasi** | ❌ | ✅ (Service Worker update) |

**Solusi:** Login dulu saat online → setelah itu bisa offline seharian penuh.

## Kesimpulan: Offline Bukan Fitur Tambahan — Wajib

Di Indonesia, **offline-first = business continuity**. POS yang online-only = risiko toko tutup tiap kali internet gangguan.

**PJTECH: Offline-first dari hari 1, tanpa biaya tambah, tanpa setup rumit.**

---

### Coba Offline Mode Sendiri
[Gratis 14 Hari →](/sign-up?redirect_url=/onboarding)

*Test langsung: matikan internet → transaksi → nyalakan → lihat auto-sync. Tim kami bantu demo remote.`
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  
  if (!post) {
    return { title: 'Artikel Tidak Ditemukan | PJTECH' };
  }

  const url = `https://www.pjtechumkm.com/blog/${slug}`;

  return {
    title: `${post.title} | PJTECH Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      publishedTime: post.date,
      tags: post.tags,
      images: [`/og-blog-${slug}.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`/og-blog-${slug}.png`],
    },
    other: {
      'script:ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": `https://www.pjtechumkm.com/og-blog-${slug}.png`,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
          "@type": "Organization",
          "name": "PJTECH",
          "url": "https://www.pjtechumkm.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PJTECH",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.pjtechumkm.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": post.category,
        "keywords": post.tags.join(', ')
      }),
    }
  };
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';
  let inList = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushCodeBlock = () => {
    if (codeBlockContent) {
      elements.push(
        <pre key={`code-${elements.length}`} className="bg-slate-900 text-green-300 p-4 rounded overflow-x-auto text-sm my-4">
          <code>{codeBlockContent.trim()}</code>
        </pre>
      );
      codeBlockContent = '';
      inCodeBlock = false;
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const ListComponent = listType === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListComponent key={`list-${elements.length}`} className="ml-4 my-2 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="ml-4">{item}</li>
          ))}
        </ListComponent>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      } else {
        flushCodeBlock();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="text-3xl font-black text-slate-900 mt-8 mb-4">{line.slice(2)}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-3">{line.slice(3)}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-xl font-bold text-slate-900 mt-6 mb-2">{line.slice(4)}</h3>);
      continue;
    }
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      // Simple table rendering
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="min-w-full border border-slate-200">
            <tbody>
              <tr className="bg-slate-100">
                {line.split('|').slice(1, -1).map((cell, ci) => (
                  <th key={ci} className="border border-slate-200 px-3 py-2 text-left font-medium">{cell.trim()}</th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.match(/^[-*]\s+\[ \]/) || line.match(/^[-*]\s+\[x\]/)) {
      flushList();
      inList = true;
      listType = 'ul';
      listItems.push(line.replace(/^[-*]\s+\[[ x]\]\s*/, ''));
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(line.slice(2));
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
      continue;
    }
    if (line.startsWith('> ')) {
      flushList();
      elements.push(<blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4">{line.slice(2)}</blockquote>);
      continue;
    }
    if (line.startsWith('---')) {
      flushList();
      elements.push(<hr key={i} className="my-8 border-slate-200" />);
      continue;
    }
    if (line.trim() === '') {
      if (inList) {
        flushList();
      } else {
        elements.push(<div key={i} className="h-4" />);
      }
      continue;
    }

    // Regular paragraph - process inline markdown
    if (inList) {
      flushList();
    }
    const processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code className="bg-slate-100 px-1 rounded text-sm font-mono">$1</code>');
    elements.push(<p key={i} className="text-slate-700 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: processedLine }} />);
  }

  flushCodeBlock();
  flushList();

  return <div className="prose prose-slate max-w-none">{elements}</div>;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} slug={slug} />;
}
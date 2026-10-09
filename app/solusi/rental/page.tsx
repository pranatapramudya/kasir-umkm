import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CalendarDays, 
  FileText, 
  Clock, 
  ShieldAlert, 
  Car, 
  Home, 
  Camera, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Tent,
  HardHat,
  Sparkles,
  MapPin,
  Smartphone,
  HelpCircle,
  KeyRound,
  Check
} from 'lucide-react';

// 1. Schema: SoftwareApplication + Product
const rentalSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PJTech POS Rental, Travel, Properti, Sewa Alat & Barang",
  "alternateName": "Aplikasi Kasir Sewa & Rental Properti Alat PJTECH",
  "operatingSystem": "Android, iOS, Windows, macOS, Web Browser (PWA)",
  "applicationCategory": "BusinessApplication, RentalApplication, PointOfSaleApplication",
  "description": "Aplikasi kasir POS terbaik di Indonesia untuk bisnis rental dan sewa: rental mobil/motor, travel, villa/homestay, alat berat/konstruksi, kamera/audio visual, tenda camping, dan persewaan pakaian. Dilengkapi kalender ketersediaan visual anti-bentrok, hitung deposit jaminan, denda keterlambatan otomatis, dan cetak surat perjanjian sewa A4 resmi.",
  "brand": {
    "@type": "Brand",
    "name": "PJTECH KASIR",
    "url": "https://www.pjtechumkm.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "990000",
    "priceCurrency": "IDR",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "PJTECH Indonesia"
    }
  },
  "areaServed": {
    "@type": "Country",
    "name": "Indonesia",
    "identifier": "ID"
  },
  "inLanguage": "id-ID",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "135",
    "bestRating": "5",
    "worstRating": "1"
  }
};

// 2. Schema: FAQPage (Google Rich Snippets)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Bagaimana sistem kalender visual mencegah jadwal bentrok (double booking)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sistem kalender ketersediaan kami memantau unit secara real-time. Ketika sebuah armada mobil, kamar villa, atau kamera sedang disewa pada rentang tanggal/jam tertentu, sistem otomatis mengunci unit tersebut sehingga kasir tidak bisa membuat pemesanan ganda."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah denda keterlambatan pengembalian unit dihitung secara otomatis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, 100% otomatis. Anda dapat mengatur tarif denda per jam (misal overtime rental mobil) atau per hari. Ketika pelanggan mengembalikan unit lewat dari batas waktu sewa, sistem langsung mengkalkulasi nominal denda saat pelunasan di kasir."
      }
    },
    {
      "@type": "Question",
      "name": "Bisa cetak Surat Perjanjian Sewa formal dan tanda terima deposit jaminan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa langsung cetak format A4/A5 resmi berlogo bisnis Anda. Surat perjanjian mencakup identitas penyewa (KTP/SIM), jaminan barang, ceklis kondisi awal unit, tanda tangan para pihak, serta klausul tanggung jawab hukum."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah bisa mengelola rental kendaraan dan sewa properti/alat sekaligus dalam satu akun?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa. Sistem mendukung multi-kategori unit: Kendaraan (mobil/motor), Properti (villa/kamar), dan Alat/Barang (kamera, genset, tenda outdoor) dengan skema tarif sewa per jam, harian, mingguan, maupun bulanan."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah mendukung pencatatan uang muka (DP) dan pelunasan saat selesai sewa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sangat mendukung. Kasir bisa menerima uang muka (DP) atau deposit jaminan terlebih dahulu saat reservasi, dan sisa pembayaran dilunasi saat unit diserahkan atau saat unit dikembalikan."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana pencatatan kondisi fisik unit sebelum dan sesudah disewa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tersedia kolom catatan kondisi fisik dan ceklis kelengkapan barang (misal: baret body mobil, kelengkapan kabel lensa kamera, jumlah pasak tenda) yang langsung tertera di lembar serah terima sewa."
      }
    }
  ]
};

// 3. Schema: BreadcrumbList
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": "https://www.pjtechumkm.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Solusi Bisnis",
      "item": "https://www.pjtechumkm.com/solusi"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Aplikasi Kasir Rental, Properti & Sewa Alat",
      "item": "https://www.pjtechumkm.com/solusi/rental"
    }
  ]
};

export const metadata: Metadata = {
  title: 'Aplikasi Kasir Rental, Travel, Properti, Sewa Alat & Barang Terbaik | PJTECH',
  description: 'Software kasir POS rental & persewaan #1 di Indonesia untuk rental mobil/motor, villa, alat berat, kamera & tenda outdoor. Kalender visual anti-bentrok, hitung denda & deposit otomatis, serta cetak surat perjanjian sewa A4. Coba gratis!',
  keywords: [
    // Core Rental Keywords
    'aplikasi kasir rental mobil', 'software rental motor', 'aplikasi sewa alat berat konstruksi',
    'pos rental indonesia', 'software sewa villa homestay', 'aplikasi rental kamera studio',
    'program kasir persewaan tenda camping', 'surat perjanjian sewa otomatis a4', 'kalender rental anti bentrok',
    'sistem deposit jaminan sewa', 'pos rental murah indonesia',
    // GEO Local SEO Keywords
    'aplikasi rental mobil bali', 'software rental mobil jakarta', 'aplikasi sewa villa jogja',
    'software rental mobil bandung', 'aplikasi rental motor malang', 'software sewa kamera surabaya',
    'aplikasi rental mobil medan', 'software rental mobil makassar', 'software rental jawa timur',
    'aplikasi kasir rental indonesia'
  ],
  alternates: {
    canonical: 'https://www.pjtechumkm.com/solusi/rental',
  },
  openGraph: {
    title: 'Aplikasi Kasir Rental, Properti, Sewa Alat & Barang Terbaik | PJTECH Indonesia',
    description: 'Solusi manajemen sewa & rental: kalender anti-bentrok, denda overtime otomatis, deposit jaminan, dan kontrak sewa formal. All-in Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/rental',
    locale: 'id_ID',
    siteName: 'PJTECH KASIR UMKM',
    images: [
      {
        url: 'https://www.pjtechumkm.com/og-rental.png',
        width: 1200,
        height: 630,
        alt: 'PJTECH POS Rental & Sewa Indonesia'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aplikasi Kasir POS Rental, Properti & Sewa Alat Indonesia - PJTECH',
    description: 'Kalender visual anti-bentrok, kalkulasi denda otomatis & surat perjanjian sewa. Coba gratis 14 hari.',
    images: ['https://www.pjtechumkm.com/og-rental.png'],
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-6.2088;106.8456',
    'ICBM': '-6.2088, 106.8456',
    'language': 'id-ID',
    'target': 'all',
    'audience': 'Pemilik Rental Mobil, Sewa Properti, Sewa Kamera, Alat Berat, Persewaan Barang Indonesia',
    'coverage': 'Indonesia',
    'script:ld+json': JSON.stringify([rentalSchema, faqSchema, breadcrumbSchema]),
  }
};

const rentalTypes = [
  {
    title: 'Rental Mobil, Motor & Travel',
    desc: 'Atur sistem sewa lepas kunci atau plus driver, rekam nomor plat/polisi, kalkulasi denda overtime per jam, dan jaminan KTP/SIM.',
    icon: Car,
    badge: 'Mobil & Motor'
  },
  {
    title: 'Villa, Homestay & Glamping',
    desc: 'Jadwal check-in / check-out transparan, tarif sewa weekday vs weekend/libur, deposit kunci kamar, dan cetak kuitansi resmi.',
    icon: Home,
    badge: 'Properti & Villa'
  },
  {
    title: 'Sewa Kamera, Lensa & Audio Visual',
    desc: 'Manajemen sewa kamera DSLR/Mirrorless, lensa, drone & lighting. Ceklis kelengkapan aksesoris kabel/baterai agar tidak hilang.',
    icon: Camera,
    badge: 'Kamera & Audio'
  },
  {
    title: 'Sewa Alat Berat & Mesin Konstruksi',
    desc: 'Pengaturan sewa molen, genset, scaffolding, hingga excavator. Cetak Surat Perjanjian Sewa formal A4 dengan klausul legal.',
    icon: HardHat,
    badge: 'Alat Berat'
  },
  {
    title: 'Tenda Outdoor & Alat Camping',
    desc: 'Paket sewa tenda dome, matras, kompor portable, dan sleeping bag per weekend atau harian dengan kalkulasi deposit cepat.',
    icon: Tent,
    badge: 'Camping Outdoor'
  },
  {
    title: 'Baju Adat, Kebaya & Kostum Event',
    desc: 'Jadwal fitting, tanggal pengambilan, hari acara, batas pengembalian, serta denda keterlambatan atau biaya laundry kotor.',
    icon: Sparkles,
    badge: 'Pakaian & Gaun'
  }
];

const features = [
  { icon: CalendarDays, title: 'Kalender Ketersediaan Anti-Bentrok', desc: 'Pantau ketersediaan seluruh armada, kamar, dan alat sewa dalam satu kalender interaktif. Sistem otomatis mengunci unit agar tidak terjadi double booking.' },
  { icon: Clock, title: 'Kalkulasi Denda Overtime Otomatis', desc: 'Sistem menghitung otomatis denda keterlambatan per jam atau per hari begitu unit dikembalikan melewati jadwal batas sewa.' },
  { icon: ShieldAlert, title: 'Pencatatan Deposit & Jaminan Aman', desc: 'Kelola deposit uang jaminan dan dokumen identitas penyewa. Sistem menampilkan status deposit yang harus dikembalikan saat unit selesai disewa.' },
  { icon: FileText, title: 'Surat Perjanjian Sewa & Invoice A4', desc: 'Cetak Surat Perjanjian Sewa resmi format A4 lengkap dengan identitas para pihak, klausul tanggung jawab, dan tanda tangan digital.' },
  { icon: KeyRound, title: 'Serah Terima & Ceklis Kondisi Unit', desc: 'Catat kondisi awal fisik unit (baret, kilometer awal, kelengkapan alat) saat serah terima guna menghindari sengketa saat pengembalian.' },
  { icon: CheckCircle, title: 'Tarif Fleksibel (Jam, Hari, Bulan)', desc: 'Dukung skema tarif sewa per jam (transit), harian (full day), mingguan, hingga kontrak bulanan dengan perhitungan diskon otomatis.' },
];

const comparison = [
  { fitur: 'Kalender Visual Anti-Bentrok', pjtech: '✓ Built-in Real-time Terkunci', kompetitor: '⚠ Sebagian manual via Excel' },
  { fitur: 'Hitung Denda Otomatis', pjtech: '✓ Otomatis per Jam / Hari', kompetitor: '⚠ Kasir hitung manual' },
  { fitur: 'Cetak Surat Perjanjian Sewa A4', pjtech: '✓ Format Legal Siap Cetak', kompetitor: '⚠ Hanya struk kasir kecil 58mm' },
  { fitur: 'Manajemen Multi-Tipe Sewa', pjtech: '✓ Mobil, Properti, Alat, Barang', kompetitor: '⚠ Terbatas untuk 1 jenis usaha' },
  { fitur: 'Kelola Deposit & Jaminan', pjtech: '✓ Transparan di Sistem', kompetitor: '⚠ Dicatat di buku terpisah' },
  { fitur: 'Harga Langganan Tahunan', pjtech: 'Rp 990.000 / tahun (All-in)', kompetitor: 'Rp 2.500.000 - 5.000.000 / tahun' },
];

export default function RentalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-purple-600 font-bold text-xs sm:text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/solusi" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-purple-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Semua Solusi
            </Link>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Geo Badge Indonesia */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200/80 rounded-full text-purple-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Aplikasi Kasir POS Rental, Properti & Sewa Alat #1 di Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 sm:mb-6">
              Kelola Bisnis Sewa & Rental, <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Jadwal Bebas Bentrok</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Software kasir POS terlengkap untuk rental kendaraan, travel, villa, alat berat, kamera studio, dan tenda outdoor. Dilengkapi kalender ketersediaan visual anti-bentrok, hitung denda & deposit otomatis, serta cetak surat perjanjian sewa formal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-purple-600/25 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transition-all">
                <span>Daftar Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Kalender Anti-Bentrok</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Denda & Deposit Otomatis</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Cetak Surat Kontrak A4</span>
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-600 shrink-0" /> Akses di HP, Tablet & Laptop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Niche Rental & Sewa Segment (SEO & GEO Booster) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Solusi Berbagai Usaha Sewa</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2 sm:mb-3">Disesuaikan Spesifik untuk Ragam Bisnis Rental Anda</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Dari persewaan mobil harian hingga sewa properti dan alat konstruksi, PJTECH siap menjaga jadwal unit Anda tetap aman.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rentalTypes.map((type, i) => (
              <div key={i} className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-purple-400 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-purple-600">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                      {type.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{type.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="fitur" className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap Kasir Rental Modern</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Semua yang dibutuhkan pengusaha rental — kalender visual, proteksi aset, dan dokumen legal formal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan dengan POS Rental Lain */}
      <section className="py-12 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Bisnis Sewa & Rental Memilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Kalender anti-bentrok, denda otomatis, dan surat perjanjian resmi A4 — all-in-one tanpa biaya tambahan.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>👈👉</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[560px] sm:min-w-[640px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3.5 sm:py-4 px-4 font-bold text-slate-900">Kemampuan & Fitur</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-purple-600">PJTECH POS</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-slate-500">Aplikasi Kasir Lain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 sm:py-4 px-4 font-medium text-slate-900">{c.fitur}</td>
                    <td className="text-center py-3.5 sm:py-4 px-4 text-emerald-700 font-bold bg-emerald-50/30">{c.pjtech}</td>
                    <td className="text-center py-3.5 sm:py-4 px-4 text-slate-500">{c.kompetitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Jangkauan GEO Wilayah Rental Indonesia */}
      <section className="py-12 sm:py-16 bg-purple-50/50 border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pariwisata & Rental Nusantara</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Dipercaya Rental Kendaraan & Wisata Se-Indonesia</h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Mendukung pengusaha rental di destinasi pariwisata dan sentra bisnis: Denpasar Bali, Yogyakarta, Bandung, Jakarta, Surabaya, Malang, Lombok, Labuan Bajo, Medan, dan Makassar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {['Denpasar Bali', 'Yogyakarta', 'Bandung', 'Jakarta', 'Surabaya', 'Malang', 'Lombok', 'Labuan Bajo', 'Medan', 'Makassar', 'Semarang', 'Batam', 'Solo', 'Balikpapan', 'Manado', 'Padang', 'Bangka Belitung'].map((city) => (
              <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {city}
              </span>
            ))}
            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              + Seluruh Kota Indonesia
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section (Tanya Jawab Terstruktur) */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <HelpCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Tanya Jawab Seputar Kasir Rental</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Jawaban pertanyaan umum seputar operasional sewa mobil, alat berat & properti</p>
          </div>
          <dl className="space-y-3.5 sm:space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-200 transition-colors">
                <dt className="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-purple-600 font-extrabold shrink-0">Q:</span>
                  <span>{faq.name}</span>
                </dt>
                <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-purple-100 ml-1">
                  {faq.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Kelola Bisnis Sewa & Rental Anda Lebih Aman</h2>
          <p className="text-xs sm:text-base md:text-lg text-purple-100 mb-8 max-w-xl mx-auto">
            Gunakan kalender visual anti-bentrok dan surat perjanjian sewa otomatis. Coba gratis 14 hari penuh.
          </p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold text-base rounded-xl hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
            <span>Mulai Uji Coba Gratis 14 Hari</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Rental & Properti Indonesia. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-purple-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-purple-600 font-semibold">Semua Solusi</Link>
            <Link href="/comparison" className="hover:text-purple-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
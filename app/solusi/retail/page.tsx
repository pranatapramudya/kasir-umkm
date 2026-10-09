import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Store, 
  Barcode, 
  Package, 
  Tag, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  MapPin,
  Smartphone,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Check
} from 'lucide-react';

// 1. Schema: SoftwareApplication + Product
const retailSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PJTech POS Retail UMKM",
  "alternateName": "Aplikasi Kasir Toko Retail & Minimarket PJTECH",
  "operatingSystem": "Android, iOS, Windows, macOS, Web Browser (PWA)",
  "applicationCategory": "BusinessApplication, PointOfSaleApplication",
  "description": "Aplikasi kasir retail terlengkap di Indonesia untuk toko kelontong, distro fashion, minimarket, ATK, kosmetik, dan petshop. Dilengkapi fitur multi-varian, barcode scanner HP/bluetooth, stok otomatis real-time, diskon fleksibel, PPN, dan cetak struk label harga.",
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
    "reviewCount": "142",
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
      "name": "Apakah aplikasi kasir PJTECH support multi-varian ukuran dan warna untuk toko fashion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, sangat mendukung. Anda bisa menambahkan varian tak terbatas: Ukuran (S, M, L, XL, XXL), Warna, Material, atau kombinasi keduanya. Masing-masing varian memiliki SKU barcode dan manajemen stok terpisah secara otomatis."
      }
    },
    {
      "@type": "Question",
      "name": "Bisa scan barcode barang menggunakan kamera HP saja tanpa beli scanner?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa langsung tanpa alat tambahan. Kamera smartphone Anda otomatis berfungsi sebagai barcode scanner super responsif. Jika toko Anda sudah ramai, PJTECH juga kompatibel 100% dengan scanner barcode bluetooth dan wireless USB (1D/2D)."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana pencatatan stok otomatis dan peringatan stok menipis bekerja?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Setiap kali kasir memproses transaksi penjualan, stok barang otomatis berkurang secara real-time. Anda bisa mengatur batas minimum stok (Reorder Point), dan sistem akan memberi indikator visual merah serta laporan produk yang harus segera di-restock."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah ada fitur PPN dan ekspor laporan keuangan untuk akuntan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lengkap. Tersedia opsi PPN include (sudah termasuk) atau exclude (ditambahkan di struk). Anda juga bisa mengekspor laporan transaksi dalam format CSV/Excel siap impor ke software akuntansi seperti Jurnal.id, Accurate, atau diserahkan ke konsultan pajak."
      }
    },
    {
      "@type": "Question",
      "name": "Bisa digunakan untuk toko kelontong di daerah yang internetnya sering mati?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa. PJTECH dibangun dengan arsitektur Progressive Web App (PWA) dan local caching. Transaksi penjualan kasir tetap berjalan lancar saat offline, dan data akan otomatis tersinkronisasi kembali ke cloud begitu koneksi internet terhubung."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah bisa mengelola banyak cabang toko retail sekaligus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa. Dengan arsitektur cloud multi-tenant, Anda sebagai Owner dapat memantau omzet, shift kasir, dan pergerakan stok banyak cabang toko di seluruh Indonesia cukup dari satu dashboard smartphone atau laptop."
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
      "name": "Aplikasi Kasir Retail UMKM",
      "item": "https://www.pjtechumkm.com/solusi/retail"
    }
  ]
};

export const metadata: Metadata = {
  title: 'Aplikasi Kasir POS Retail Terbaik Indonesia - Toko Kelontong, Fashion, Minimarket | PJTECH',
  description: 'Software kasir POS retail #1 di Indonesia. Barcode scanner kamera HP & bluetooth, multi-varian ukuran & warna, stok otomatis real-time, diskon, PPN, dan cetak struk label harga. Coba gratis 14 hari!',
  keywords: [
    // Core Retail Keywords
    'POS retail indonesia', 'aplikasi kasir toko kelontong', 'software kasir minimarket', 'aplikasi kasir distro fashion',
    'program kasir toko atk', 'aplikasi kasir petshop', 'software toko kosmetik', 'aplikasi toko bangunan',
    'barcode scanner kasir hp', 'stok barang otomatis retail', 'sistem kasir toko sembako', 'pos kasir murah indonesia',
    // GEO Local SEO Keywords
    'aplikasi kasir jakarta', 'aplikasi kasir surabaya', 'aplikasi kasir bandung', 'aplikasi kasir semarang',
    'aplikasi kasir medan', 'aplikasi kasir makassar', 'aplikasi kasir yogyakarta', 'aplikasi kasir bali',
    'software pos jawa barat', 'software pos jawa timur', 'software pos sumatera', 'software pos sulawesi',
    'aplikasi kasir toko indonesia'
  ],
  alternates: {
    canonical: 'https://www.pjtechumkm.com/solusi/retail',
  },
  openGraph: {
    title: 'Aplikasi Kasir POS Retail Terbaik untuk Toko Kelontong, Fashion & Minimarket | PJTECH',
    description: 'Solusi kasir retail modern Indonesia: barcode HP/bluetooth, multi-varian ukuran & warna, stok real-time, PPN, dan cetak struk label harga. All-in-one Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/retail',
    locale: 'id_ID',
    siteName: 'PJTECH KASIR UMKM',
    images: [
      {
        url: 'https://www.pjtechumkm.com/og-retail.png',
        width: 1200,
        height: 630,
        alt: 'PJTECH POS Retail Indonesia'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aplikasi Kasir POS Retail UMKM Indonesia - PJTECH',
    description: 'Multi-varian, barcode scanner HP, stok real-time, PPN & cetak struk. Coba gratis sekarang.',
    images: ['https://www.pjtechumkm.com/og-retail.png'],
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-6.2088;106.8456',
    'ICBM': '-6.2088, 106.8456',
    'language': 'id-ID',
    'target': 'all',
    'audience': 'Pemilik Toko Retail, Toko Kelontong, Fashion, Minimarket, UMKM Indonesia',
    'coverage': 'Indonesia',
    'script:ld+json': JSON.stringify([retailSchema, faqSchema, breadcrumbSchema]),
  }
};

const retailTypes = [
  {
    title: 'Toko Kelontong & Sembako',
    desc: 'Kasir kilat anti-antre, pencarian barang cepat via barcode atau nama, kalkulasi kembalian akurat, cetak struk hemat kertas 58mm.',
    icon: Store,
    badge: 'Paling Populer'
  },
  {
    title: 'Distro, Butik & Fashion',
    desc: 'Dukungan multi-varian lengkap (Ukuran S/M/L/XL/XXL, Warna, Model) dengan SKU tersendiri dan manajemen stok tiap varian.',
    icon: ShoppingBag,
    badge: 'Multi-Varian'
  },
  {
    title: 'Minimarket & Swalayan',
    desc: 'Kapasitas database ribuan SKU produk, cetak label barcode rak gantung, scanner bluetooth/wireless berkecepatan tinggi.',
    icon: Barcode,
    badge: 'Ribuan SKU'
  },
  {
    title: 'Toko ATK, Fotokopi & Buku',
    desc: 'Dukungan harga bertingkat (grosir vs eceran), pencatatan ribuan variasi alat tulis, serta ekspor rekap penjualan harian.',
    icon: Layers,
    badge: 'Grosir & Eceran'
  },
  {
    title: 'Kosmetik, Skincare & Apotek',
    desc: 'Kelola varian warna/shade kosmetik, pencatatan expired date, paket bundling promo, dan laporan laba bersih otomatis.',
    icon: Sparkles,
    badge: 'Promo & Bundling'
  },
  {
    title: 'Petshop & Toko Aksesoris',
    desc: 'Pencatatan aksesoris kecil hingga pakan kiloan/karung, peringatan stok menipis otomatis agar tidak kehabisan barang.',
    icon: Package,
    badge: 'Stok Akurat'
  }
];

const features = [
  { icon: Barcode, title: 'Barcode & SKU Otomatis', desc: 'Scan barcode menggunakan kamera smartphone langsung atau scanner bluetooth/USB. Generate kode SKU otomatis untuk produk baru.' },
  { icon: Package, title: 'Multi-Varian Produk Lengkap', desc: 'Satu produk dengan banyak variasi: Ukuran (S/M/L/XL), Warna, Motif, atau Material. Setiap varian memiliki stok dan harga terpisah.' },
  { icon: Tag, title: 'Diskon Fleksibel & Grosir', desc: 'Atur diskon per barang (% atau nominal), diskon total belanja, diskon bertingkat untuk pembelian grosir, hingga promo harga khusus.' },
  { icon: TrendingUp, title: 'Stok Real-time & Peringatan Otomatis', desc: 'Stok berkurang seketika saat kasir input transaksi. Notifikasi visual merah saat stok mendekati batas minimum (Reorder Point).' },
  { icon: Shield, title: 'PPN & Ekspor Laporan Akuntan', desc: 'Opsi PPN include/exclude per item. Ekspor rekap transaksi format Excel/CSV standar software akuntansi (Jurnal, Accurate, Mekari).' },
  { icon: CheckCircle, title: 'Cetak Struk & Label Barcode', desc: 'Kompatibel dengan semua printer thermal Bluetooth 58mm & 80mm. Bisa cetak struk belanjaan, nota garansi, dan label harga rak.' },
];

const comparison = [
  { fitur: 'Harga Berlangganan', pjtech: 'Rp 990.000 / tahun (All-in)', kompetitor: 'Rp 1.800.000 - 3.500.000 / tahun' },
  { fitur: 'Fitur Multi-Varian', pjtech: '✓ Unlimited (Tanpa Batas)', kompetitor: '⚠ Dibatasi / Harus paket mahal' },
  { fitur: 'Scanner Barcode HP', pjtech: '✓ Langsung Kamera HP + Bluetooth', kompetitor: '⚠ Wajib beli scanner eksternal' },
  { fitur: 'Stok Real-time & Alert', pjtech: '✓ Otomatis Real-time', kompetitor: '✓ Ada, sebagian manual' },
  { fitur: 'Laporan Pajak & PPN', pjtech: '✓ Include / Exclude + Export CSV', kompetitor: '⚠ Manual / Biaya modul tambahan' },
  { fitur: 'Dukungan Multi-Cabang', pjtech: '✓ SaaS Cloud Terpusat', kompetitor: '⚠ Bayar lisensi per kasir/cabang' },
  { fitur: 'Dukungan Lokal Indonesia', pjtech: '✓ Format Rupiah & Pajak Indonesia', kompetitor: '⚠ Sebagian software luar negeri' },
];

export default function RetailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/solusi" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Semua Solusi
            </Link>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Geo Badge Indonesia */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Aplikasi Kasir POS Retail #1 untuk UMKM di Seluruh Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 sm:mb-6">
              Kelola Toko Retail Lebih Cepat, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Stok Selalu Akurat</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Software kasir POS terlengkap untuk toko kelontong, distro fashion, minimarket, ATK, dan petshop. Dilengkapi scanner barcode kamera HP, varian produk tanpa batas, kontrol stok otomatis, dan cetak struk instan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all">
                <span>Daftar Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Coba Gratis 14 Hari</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Tanpa Kontrak Mengikat</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Setup Mudah 5 Menit</span>
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-blue-500 shrink-0" /> Bisa di HP, Tablet & Laptop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Niche Retail Segment (SEO & GEO Booster) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Solusi Berbagai Usaha Dagang</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2 sm:mb-3">Didesain Khusus untuk Karakter Toko Retail Anda</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Setiap bisnis dagang punya alur unik. PJTECH menyediakan konfigurasi fleksibel yang pas untuk toko Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {retailTypes.map((type, i) => (
              <div key={i} className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-blue-600">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap Kasir Retail Modern</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Semua fitur yang dibutuhkan pedagang Indonesia — sudah all-in tanpa biaya modul tambahan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan dengan POS Lain */}
      <section className="py-12 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Pedagang Retail Memilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Bandingkan dengan POS lain — fitur lebih lengkap, harga transparan, tanpa biaya tersembunyi per transaksi.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>👈👉</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[560px] sm:min-w-[640px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3.5 sm:py-4 px-4 font-bold text-slate-900">Kemampuan & Fitur</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-blue-600">PJTECH POS</th>
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

      {/* Jangkauan GEO Wilayah Indonesia */}
      <section className="py-12 sm:py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Jangkauan Nasional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Siap Dipakai Toko Retail di Seluruh Pelosok Indonesia</h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Mendukung pedagang retail di Jabodetabek, Bandung, Surabaya, Semarang, Medan, Makassar, Palembang, Denpasar, Yogyakarta, hingga kota-kota tingkat II di seluruh nusantara.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Bekasi', 'Depok', 'Yogyakarta', 'Denpasar', 'Malang', 'Batam', 'Pekanbaru', 'Balikpapan', 'Samarinda', 'Banjarmasin'].map((city) => (
              <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {city}
              </span>
            ))}
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              + Semua Wilayah Indonesia
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section (Tanya Jawab Terstruktur) */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Tanya Jawab Seputar Kasir Retail</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Jawaban atas pertanyaan yang sering diajukan pemilik toko di Indonesia</p>
          </div>
          <dl className="space-y-3.5 sm:space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
                <dt className="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-blue-600 font-extrabold shrink-0">Q:</span>
                  <span>{faq.name}</span>
                </dt>
                <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-blue-100 ml-1">
                  {faq.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Siap Modernisasi Toko Retail Anda Sekarang?</h2>
          <p className="text-xs sm:text-base md:text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Tinggalkan pencatatan nota manual yang rawan selisih. Coba kasir retail PJTECH gratis 14 hari penuh tanpa kartu kredit.
          </p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold text-base rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
            <span>Mulai Uji Coba Gratis 14 Hari</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Retail Indonesia. Solusi kasir modern terjangkau UMKM.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-blue-600 font-semibold">Semua Solusi</Link>
            <Link href="/comparison" className="hover:text-blue-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
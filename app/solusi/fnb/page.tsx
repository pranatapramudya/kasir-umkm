import { Metadata } from 'next';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  ChefHat, 
  Tv2, 
  Receipt, 
  Layers, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Coffee,
  Flame,
  Store,
  MapPin,
  Smartphone,
  HelpCircle,
  Truck,
  Cake,
  Split
} from 'lucide-react';

// 1. Schema: SoftwareApplication + Product
const fnbSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PJTech POS Restoran, Kafe & Kuliner F&B",
  "alternateName": "Aplikasi Kasir Restoran, Coffee Shop & F&B PJTECH",
  "operatingSystem": "Android, iOS, Windows, macOS, Web Browser (PWA)",
  "applicationCategory": "BusinessApplication, RestaurantApplication, PointOfSaleApplication",
  "description": "Aplikasi kasir F&B terbaik di Indonesia untuk restoran, coffee shop, kafe, warung makan, bakery, dan food court. Termasuk Kitchen Display System (KDS) dapur gratis, manajemen nomor meja visual, split bill, cetak tiket dapur terpisah, dan modifier pesanan (less sugar, extra topping).",
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
    "reviewCount": "168",
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
      "name": "Apakah Kitchen Display System (KDS) layar dapur benar-benar gratis tanpa bayar lisensi tambahan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Benar, 100% sudah termasuk dalam paket langganan Rp 990.000/tahun tanpa biaya tersembunyi. Anda bisa membuka tampilan KDS Dapur di HP bekas, tablet Android, atau smart TV dapur via browser secara real-time melalui websocket."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana cara kerja cetak tiket pesanan terpisah untuk dapur dan bar minuman?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sistem mendukung printer bluetooth ESC/POS. Saat kasir menginput pesanan yang berisi makanan dan minuman, tiket order otomatis terpisah: tiket makanan dicetak ke printer dapur, sedangkan pesanan kopi/minuman dicetak langsung ke printer station barista/bar."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah mendukung pesanan dengan catatan khusus (modifier/topping) seperti less sugar atau extra shot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, sangat fleksibel. Kasir atau pelayan dapat menambahkan catatan modifier di setiap item (misal: 'Less Sugar 50%', 'Level Pedas 3', 'No Onion', 'Extra Shot Espresso'). Catatan ini langsung tampil tebal di struk dan layar monitor dapur."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana pengaturan Split Bill dan Open Bill jika pelanggan ingin bayar terpisah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PJTECH memiliki fitur Open Bill untuk menyimpan pesanan meja selama pelanggan makan. Saat pembayaran, kasir dapat memilih Split Bill untuk memecah total belanja per orang atau per pesanan item dengan kalkulasi kembalian otomatis."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah cocok untuk coffee shop atau kedai kopi kecil yang hanya pakai HP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sangat cocok. Desain UI responsif mobile membuat kasir coffee shop bisa menginput pesanan secepat kilat langsung dari smartphone android/iOS, lengkap dengan pilihan Dine-in, Takeaway, dan pembayaran QRIS statis maupun dinamis."
      }
    },
    {
      "@type": "Question",
      "name": "Tersedia template menu Excel apa saja untuk impor produk F&B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kami menyediakan 3 template Excel siap pakai: Format Coffee Shop & Kafe, Format Restoran (Manajemen Meja), dan Format Fast Food / Street Food. Cukup isi daftar menu lalu upload sekali klik tanpa input manual satu per satu."
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
      "name": "Aplikasi Kasir Restoran & Kafe F&B",
      "item": "https://www.pjtechumkm.com/solusi/fnb"
    }
  ]
};

export const metadata: Metadata = {
  title: 'Aplikasi Kasir Restoran & Kafe F&B Terbaik Indonesia - KDS Dapur & Meja | PJTECH',
  description: 'Software kasir F&B terbaik di Indonesia untuk restoran, kafe, coffee shop, warung makan & bakery. Kitchen Display System (KDS) dapur gratis, manajemen meja, split bill, cetak tiket dapur & modifier pesanan. Coba gratis!',
  keywords: [
    // Core F&B Keywords
    'aplikasi kasir restoran', 'software kasir cafe coffee shop', 'aplikasi kasir rumah makan', 'pos fnb indonesia',
    'kitchen display system kds gratis', 'software manajemen meja restoran', 'aplikasi kasir split bill',
    'cetak tiket order dapur bar', 'aplikasi kasir warmindo ayam geprek', 'program kasir bakery toko roti',
    'aplikasi kasir kedai kopi', 'pos restoran murah indonesia',
    // GEO Local SEO Keywords
    'aplikasi kasir cafe jakarta', 'aplikasi kasir restoran bandung', 'software kasir cafe surabaya',
    'aplikasi kasir resto semarang', 'aplikasi kasir cafe medan', 'aplikasi kasir restoran makassar',
    'aplikasi kasir cafe yogyakarta', 'aplikasi kasir kuliner bali', 'software fnb jawa barat',
    'aplikasi kasir rumah makan padang', 'software pos kuliner indonesia'
  ],
  alternates: {
    canonical: 'https://www.pjtechumkm.com/solusi/fnb',
  },
  openGraph: {
    title: 'Aplikasi Kasir Restoran & Coffee Shop F&B Terbaik | PJTECH Indonesia',
    description: 'Solusi kasir kuliner modern: KDS Dapur gratis, manajemen meja visual, split bill, dan cetak tiket dapur terpisah. All-in Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/fnb',
    locale: 'id_ID',
    siteName: 'PJTECH KASIR UMKM',
    images: [
      {
        url: 'https://www.pjtechumkm.com/og-fnb.png',
        width: 1200,
        height: 630,
        alt: 'PJTECH POS F&B Kuliner Indonesia'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aplikasi Kasir POS Restoran & Kafe F&B Indonesia - PJTECH',
    description: 'KDS Dapur gratis, peta meja, split bill & cetak tiket dapur. Coba gratis 14 hari.',
    images: ['https://www.pjtechumkm.com/og-fnb.png'],
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-6.2088;106.8456',
    'ICBM': '-6.2088, 106.8456',
    'language': 'id-ID',
    'target': 'all',
    'audience': 'Pemilik Restoran, Coffee Shop, Kafe, Rumah Makan, Kuliner, UMKM F&B Indonesia',
    'coverage': 'Indonesia',
    'script:ld+json': JSON.stringify([fnbSchema, faqSchema, breadcrumbSchema]),
  }
};

const fnbTypes = [
  {
    title: 'Coffee Shop & Kafe Kekinian',
    desc: 'Catat varian rasa & modifier minuman (Less Sugar, Oatmilk, Extra Shot, Ice level), kasir kilat, serta opsi Takeaway atau Dine-in.',
    icon: Coffee,
    badge: 'Barista & Modifier'
  },
  {
    title: 'Restoran & Rumah Makan Keluarga',
    desc: 'Peta meja visual interaktif, Open Bill saat tamu makan, Split Bill saat bayar rombongan, serta cetak tiket makanan ke dapur & bar terpisah.',
    icon: UtensilsCrossed,
    badge: 'Manajemen Meja'
  },
  {
    title: 'Fast Food, Ayam Geprek & Warmindo',
    desc: 'Kecepatan transaksi tinggi anti-antre, sistem nomor antrean pesanan otomatis, paket hemat bundling makanan + minuman.',
    icon: Flame,
    badge: 'Kasir Super Cepat'
  },
  {
    title: 'Food Truck & Kuliner Kaki Lima',
    desc: 'Cukup gunakan smartphone Android/iOS dan printer mini bluetooth tanpa meja kasir besar. Ringan dan hemat daya baterai.',
    icon: Truck,
    badge: 'Mobile di HP'
  },
  {
    title: 'Bakery, Toko Roti & Pastry',
    desc: 'Pencatatan batch kue harian, diskon jam tertentu (Happy Hour malam untuk cuci etalase roti), dan cetak struk nota rapi.',
    icon: Cake,
    badge: 'Promo Happy Hour'
  },
  {
    title: 'Food Court & Kantin Bersama',
    desc: 'Satu sistem untuk banyak tenant steker, laporan pembagian omzet harian transparan, dan pembayaran QRIS langsung di kasir sentral.',
    icon: Store,
    badge: 'Multi-Tenant'
  }
];

const features = [
  { icon: Tv2, title: 'KDS (Kitchen Display) Layar Dapur Gratis', desc: 'Pesanan kasir langsung muncul di layar tablet/smart TV dapur secara real-time tanpa delay. Koki tap selesai saat hidangan siap saji.' },
  { icon: Layers, title: 'Manajemen Denah Meja Interaktif', desc: 'Pantau status meja kosong, terisi, atau sedang bersantap dalam satu layar visual. Dukungan nomor meja atau area outdoor/indoor.' },
  { icon: Split, title: 'Split Bill & Open Bill Fleksibel', desc: 'Simpan tagihan meja aktif selama pelanggan makan (Open Bill), lalu pecah pembayaran per orang (Split Bill) tanpa repot hitung manual.' },
  { icon: Receipt, title: 'Cetak Tiket Dapur & Bar Terpisah', desc: 'Kirim otomatis pesanan dapur ke printer koki dan pesanan minuman ke printer station barista dengan multi-printer Bluetooth ESC/POS.' },
  { icon: Coffee, title: 'Modifier Catatan Pesanan Kustom', desc: 'Tambahkan catatan khusus tiap porsi: level pedas, tanpa seledri, manis sedang, atau extra topping dengan teks cetak tebal di struk dapur.' },
  { icon: TrendingUp, title: 'Laporan Menu Terlaris & Shift Kasir', desc: 'Analisis menu makanan & minuman paling laku (Best Seller), jam ramai pengunjung, serta laporan rekap kasir per shift tutup kas.' },
];

const comparison = [
  { fitur: 'Biaya Kitchen Display (KDS)', pjtech: '✓ GRATIS (Included Rp 990rb/th)', kompetitor: '⚠ Add-on mahal Rp 1.5jt - 3jt/th' },
  { fitur: 'Manajemen Meja Visual', pjtech: '✓ Termasuk Tanpa Batas Meja', kompetitor: '⚠ Terbatas di paket dasar' },
  { fitur: 'Split Bill & Gabung Meja', pjtech: '✓ Fleksibel & Cepat', kompetitor: '✓ Ada, sebagian rumit' },
  { fitur: 'Cetak Tiket Dapur & Bar Pisah', pjtech: '✓ Built-in Multi-Printer', kompetitor: '⚠ Butuh software bridging khusus' },
  { fitur: 'Template Menu Excel F&B', pjtech: '✓ 3 Template (Kafe, Resto, Fast Food)', kompetitor: '⚠ Manual input satu per satu' },
  { fitur: 'Bisa Pakai di HP & Tablet Apapun', pjtech: '✓ PWA Cloud Tanpa Beli Alat Baru', kompetitor: '⚠ Wajib beli tablet spek khusus' },
  { fitur: 'Harga Langganan Tahunan', pjtech: 'Rp 990.000 (All-in Tanpa Syarat)', kompetitor: 'Rp 2.400.000 - 4.800.000 / tahun' },
];

export default function FnbPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-orange-600 font-bold text-xs sm:text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/solusi" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-orange-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Semua Solusi
            </Link>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-orange-600 hover:to-amber-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Geo Badge Indonesia */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200/80 rounded-full text-orange-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Aplikasi Kasir POS Restoran, Kafe & Kuliner #1 di Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 sm:mb-6">
              Operasional Dapur Cepat, <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Meja & Pesanan Tertata Rapi</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Software kasir POS kuliner all-in-one untuk restoran, coffee shop, kafe, warung makan, dan bakery. Dilengkapi Kitchen Display System (KDS) layar dapur gratis, peta denah meja, split bill, dan pemisahan tiket dapur otomatis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-700 hover:shadow-xl transition-all">
                <span>Daftar Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> KDS Layar Dapur Gratis</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Denah Meja & Split Bill</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Cetak Tiket Dapur & Bar</span>
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-orange-500 shrink-0" /> Jalan di HP, Tablet & Smart TV</span>
            </div>
          </div>
        </div>
      </section>

      {/* Niche F&B Segment (SEO & GEO Booster) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Disesuaikan untuk Setiap Model Kuliner</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2 sm:mb-3">Solusi Spesifik Niche untuk Bisnis F&B Anda</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Dari kedai kopi estetik hingga restoran keluarga dengan puluhan meja, PJTECH siap mengakomodasi alur pesanan Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {fnbTypes.map((type, i) => (
              <div key={i} className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-orange-400 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-orange-600">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100/70 px-2.5 py-0.5 rounded-full">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap Kasir Kuliner & F&B</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Pesanan cepat ke meja, dapur memasak tepat tanpa salah, dan omzet terpantau akurat.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan dengan POS F&B Lain */}
      <section className="py-12 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Bisnis Kuliner Memilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">KDS gratis, multi-meja included, dan template Excel siap upload — tanpa langganan add-on mahal.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>👈👉</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[560px] sm:min-w-[640px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3.5 sm:py-4 px-4 font-bold text-slate-900">Kemampuan & Fitur</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-orange-600">PJTECH POS</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-slate-500">Aplikasi Kasir F&B Lain</th>
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

      {/* Jangkauan GEO Wilayah Kuliner Indonesia */}
      <section className="py-12 sm:py-16 bg-orange-50/50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kuliner Nusantara</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Dipercaya Kafe & Restoran di Seluruh Indonesia</h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Mendukung bisnis kuliner di sentra kuliner Jakarta, Bandung, Surabaya, Yogyakarta, Denpasar Bali, Medan, Semarang, Makassar, hingga Malang dan kota lainnya.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Denpasar Bali', 'Medan', 'Semarang', 'Makassar', 'Malang', 'Solo', 'Bogor', 'Tangerang', 'Bekasi', 'Palembang', 'Batam', 'Balikpapan', 'Pontianak', 'Manado'].map((city) => (
              <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {city}
              </span>
            ))}
            <span className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              + Seluruh Kota Indonesia
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section (Tanya Jawab Terstruktur) */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <HelpCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Tanya Jawab Seputar Kasir F&B</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Jawaban atas pertanyaan yang sering diajukan pengusaha restoran dan kafe di Indonesia</p>
          </div>
          <dl className="space-y-3.5 sm:space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-orange-200 transition-colors">
                <dt className="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-orange-600 font-extrabold shrink-0">Q:</span>
                  <span>{faq.name}</span>
                </dt>
                <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-orange-100 ml-1">
                  {faq.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Bikin Operasional Restoran & Kafe Anda Lebih Rapi</h2>
          <p className="text-xs sm:text-base md:text-lg text-orange-100 mb-8 max-w-xl mx-auto">
            Gunakan KDS dapur gratis dan manajemen meja modern. Uji coba gratis 14 hari penuh tanpa kartu kredit.
          </p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold text-base rounded-xl hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
            <span>Mulai Uji Coba Gratis 14 Hari</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS F&B Kuliner Indonesia. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-orange-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-orange-600 font-semibold">Semua Solusi</Link>
            <Link href="/comparison" className="hover:text-orange-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
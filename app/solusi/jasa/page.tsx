import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Wrench, 
  MessageSquare, 
  CalendarClock, 
  Receipt, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Scissors,
  Smartphone,
  Car,
  Shirt,
  Sparkles,
  MapPin,
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';

// 1. Schema: SoftwareApplication + Product
const jasaSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PJTech POS Jasa, Servis, Barbershop & Bengkel",
  "alternateName": "Aplikasi Kasir Jasa, Salon, Barbershop & Servis PJTECH",
  "operatingSystem": "Android, iOS, Windows, macOS, Web Browser (PWA)",
  "applicationCategory": "BusinessApplication, ServiceApplication, PointOfSaleApplication",
  "description": "Aplikasi kasir POS terbaik di Indonesia untuk bisnis jasa: barbershop, salon kecantikan, bengkel motor/mobil, servis HP/laptop, dan laundry. Lengkap dengan link booking online publik, jadwal antrean per sesi jam WIB, nota gabungan jasa dan sparepart, notifikasi WhatsApp otomatis, serta hitung komisi teknisi/kapster.",
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
    "reviewCount": "156",
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
      "name": "Apakah ada fitur link booking online untuk pelanggan barbershop atau salon kecantikan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, setiap toko mendapatkan website link booking publik mandiri (contoh: pjtechumkm.com/book/nama-toko). Pelanggan bisa memilih layanan, kapster/stylist favorit, dan memilih slot jam yang tersedia dengan format 24 jam WIB tanpa perlu antre di lokasi."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah sistem bisa membedakan tarif ongkos jasa dan harga sparepart suku cadang?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa dan sangat transparan. Dalam satu struk kasir, sistem memisahkan ongkos jasa pengerjaan dan harga suku cadang/sparepart. Stok sparepart otomatis terpotong dari gudang saat nota dicetak."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana cara kerja notifikasi WhatsApp otomatis ke pelanggan saat servis selesai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ketika status pengerjaan diubah menjadi 'Selesai' atau 'Siap Diambil', sistem menyediakan tombol kirim WhatsApp otomatis lengkap dengan template nama pelanggan, rincian biaya, dan pesan terima kasih tanpa perlu mengetik manual."
      }
    },
    {
      "@type": "Question",
      "name": "Bisa mencatat riwayat perbaikan berdasarkan nomor polisi (plat kendaraan) atau nomor seri HP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bisa. Cukup ketik nomor polisi kendaraan atau nomor HP pelanggan, sistem akan menampilkan riwayat tanggal servis sebelumnya, teknisi yang menangani, serta suku cadang yang pernah diganti."
      }
    },
    {
      "@type": "Question",
      "name": "Bagaimana perhitungan komisi bagi hasil untuk kapster barbershop, terapis salon, atau mekanik?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sangat otomatis. Anda bisa menentukan skema komisi (persentase % atau nominal tetap Rp per jenis layanan). Laporan rekap komisi per karyawan dapat ditarik per periode harian, mingguan, atau bulanan siap untuk penggajian."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah cocok untuk usaha laundry kiloan dan satuan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sangat cocok. Mendukung penetapan tarif per kilogram atau satuan, pencatatan rak penyimpanan pakaian, estimasi tanggal/jam selesai cucian, serta cetak nota tanda terima berbarcode."
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
      "name": "Aplikasi Kasir Jasa, Barbershop & Bengkel",
      "item": "https://www.pjtechumkm.com/solusi/jasa"
    }
  ]
};

export const metadata: Metadata = {
  title: 'Aplikasi Kasir Jasa, Barbershop, Salon & Bengkel Terbaik Indonesia | PJTECH',
  description: 'Software kasir POS jasa #1 di Indonesia untuk barbershop, salon kecantikan, bengkel motor/mobil, servis HP & laundry. Link booking online publik, jadwal antrean per sesi jam, nota jasa + sparepart, dan komisi staf otomatis. Coba gratis!',
  keywords: [
    // Core Jasa & Servis Keywords
    'aplikasi kasir barbershop', 'software kasir bengkel motor mobil', 'aplikasi kasir salon kecantikan',
    'pos jasa servis indonesia', 'aplikasi booking online barbershop', 'software kasir servis hp laptop',
    'aplikasi kasir laundry kiloan', 'rekap komisi mekanik kapster', 'nota tanda terima servis bergaransi',
    'sistem antrean servis elektronik', 'pos jasa murah indonesia',
    // GEO Local SEO Keywords
    'aplikasi kasir barbershop jakarta', 'software bengkel bandung', 'aplikasi kasir salon surabaya',
    'software kasir bengkel semarang', 'aplikasi kasir barbershop medan', 'software servis hp yogyakarta',
    'aplikasi kasir salon denpasar bali', 'aplikasi kasir bengkel makassar', 'software jasa jawa barat',
    'aplikasi kasir servis indonesia'
  ],
  alternates: {
    canonical: 'https://www.pjtechumkm.com/solusi/jasa',
  },
  openGraph: {
    title: 'Aplikasi Kasir Jasa, Barbershop, Salon & Bengkel Terbaik | PJTECH Indonesia',
    description: 'Solusi manajemen jasa modern: link booking online, jadwal antrean sesi jam, nota jasa + suku cadang, dan hitung komisi otomatis. All-in Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/jasa',
    locale: 'id_ID',
    siteName: 'PJTECH KASIR UMKM',
    images: [
      {
        url: 'https://www.pjtechumkm.com/og-jasa.png',
        width: 1200,
        height: 630,
        alt: 'PJTECH POS Jasa & Servis Indonesia'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aplikasi Kasir POS Jasa, Barbershop & Bengkel Indonesia - PJTECH',
    description: 'Booking online, jadwal antrean per sesi, nota jasa + sparepart & komisi staf. Coba gratis.',
    images: ['https://www.pjtechumkm.com/og-jasa.png'],
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-6.2088;106.8456',
    'ICBM': '-6.2088, 106.8456',
    'language': 'id-ID',
    'target': 'all',
    'audience': 'Pemilik Barbershop, Salon, Bengkel, Servis Elektronik, Laundry, UMKM Jasa Indonesia',
    'coverage': 'Indonesia',
    'script:ld+json': JSON.stringify([jasaSchema, faqSchema, breadcrumbSchema]),
  }
};

const serviceTypes = [
  {
    title: 'Barbershop & Pangkas Rambut',
    desc: 'Website link booking online mandiri per slot jam WIB, pilihan kapster favorit, antrean sesi, dan bagi hasil komisi otomatis.',
    icon: Scissors,
    badge: 'Booking Online'
  },
  {
    title: 'Bengkel Motor & Mobil',
    desc: 'Nota faktur gabungan biaya jasa montir dan sparepart suku cadang, pencatatan nomor polisi/plat kendaraan, dan riwayat servis berkala.',
    icon: Car,
    badge: 'Jasa + Sparepart'
  },
  {
    title: 'Salon Kecantikan, Spa & Nail Art',
    desc: 'Manajemen reservasi jadwal perawatan, pembagian komisi terapis/stylist, penjualan produk skincare etalase, dan reminder WhatsApp.',
    icon: Sparkles,
    badge: 'Komisi Terapis'
  },
  {
    title: 'Servis HP, Laptop & Elektronik',
    desc: 'Tanda terima servis digital, nomor seri IMEI/perangkat, tracking status pengerjaan (Pengecekan > Tunggu Part > Selesai), serta nota garansi.',
    icon: Smartphone,
    badge: 'Status Servis'
  },
  {
    title: 'Laundry Kiloan, Satuan & Cuci Sepatu',
    desc: 'Hitung tarif timbangan per Kg atau per pasang sepatu, pencatatan rak penyimpanan, serta estimasi tanggal selesai cuci.',
    icon: Shirt,
    badge: 'Tarif Kg & Satuan'
  },
  {
    title: 'Jasa Cuci AC & Home Service',
    desc: 'Penjadwalan kunjungan teknisi ke rumah pelanggan, rekap pengerjaan unit AC, dan invoice penagihan resmi via WhatsApp/PDF.',
    icon: Wrench,
    badge: 'Jadwal Kunjungan'
  }
];

const features = [
  { icon: CalendarClock, title: 'Link Booking Online & Papan Jadwal', desc: 'Beri pelanggan kemudahan reservasi lewat link publik toko Anda. Jadwal masuk otomatis ke dashboard dengan format waktu WIB tanpa tumpang tindih.' },
  { icon: Receipt, title: 'Nota Gabungan Jasa & Suku Cadang', desc: 'Cetak nota struk yang memisahkan biaya jasa teknisi dan suku cadang secara transparan. Stok sparepart gudang otomatis terpotong akurat.' },
  { icon: MessageSquare, title: 'Notifikasi WhatsApp Otomatis', desc: 'Beri tahu pelanggan saat servis atau pengerjaan selesai via WhatsApp dengan satu ketukan tombol. Ramah, profesional, dan cepat.' },
  { icon: Users, title: 'Laporan Rekap Komisi Karyawan Otomatis', desc: 'Bagi hasil komisi kapster, mekanik, atau terapis dihitung otomatis per transaksi pengerjaan. Ekspor laporan gaji tanpa kalkulator manual.' },
  { icon: Clock, title: 'Pelacakan Status Antrean Real-time', desc: 'Pantau tahapan servis dari Menunggu, Sedang Dikerjakan, hingga Selesai Pembayaran di Kasir POS dengan papan antrean visual.' },
  { icon: ShieldCheck, title: 'Garansi Servis & Rekam Riwayat Pelanggan', desc: 'Cetak klausul garansi servis di struk belanja. Cari riwayat perbaikan pelanggan berdasarkan nomor HP atau nomor plat kendaraan.' },
];

const comparison = [
  { fitur: 'Link Booking Online Publik', pjtech: '✓ Included (Gratis Slug Mandiri)', kompetitor: '⚠ Wajib langganan platform terpisah' },
  { fitur: 'Pemisahan Jasa & Sparepart', pjtech: '✓ Built-in Transparan', kompetitor: '⚠ Dicampur sebagai produk umum' },
  { fitur: 'Notifikasi WhatsApp Siap Ambil', pjtech: '✓ Satu Klik Langsung Terkirim', kompetitor: '⚠ Manual ketik satu per satu' },
  { fitur: 'Kalkulasi Komisi Teknisi/Kapster', pjtech: '✓ Otomatis per Sesi Pengerjaan', kompetitor: '⚠ Fitur terkunci di paket enterprise' },
  { fitur: 'Papan Jadwal Format WIB 24 Jam', pjtech: '✓ Standar Jam Indonesia', kompetitor: '⚠ Masih format AM/PM bawaan browser' },
  { fitur: 'Langganan Tahunan All-in', pjtech: 'Rp 990.000 / tahun', kompetitor: 'Rp 2.000.000 - 4.500.000 / tahun' },
];

export default function JasaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white selection:bg-emerald-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold text-xs sm:text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/solusi" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Semua Solusi
            </Link>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-emerald-700 hover:to-teal-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Geo Badge Indonesia */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aplikasi Kasir POS Jasa, Barbershop & Bengkel #1 di Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 sm:mb-6">
              Jadwal Booking Rapi, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Komisi & Antrean Terkelola Otomatis</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Software kasir POS spesialis usaha jasa untuk barbershop, salon, bengkel, servis HP, dan laundry. Lengkap dengan link booking online publik, format jam WIB, nota gabungan jasa & suku cadang, serta rekap komisi staf otomatis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transition-all">
                <span>Daftar Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Link Booking Publik</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Rekap Komisi Otomatis</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Notifikasi WhatsApp</span>
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-emerald-600 shrink-0" /> Kompatibel di HP & Laptop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Niche Jasa & Servis Segment (SEO & GEO Booster) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Solusi Berbagai Niche Usaha Jasa</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2 sm:mb-3">Didesain Khusus untuk Alur Bisnis Jasa Anda</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Dari barbershop perorangan hingga bengkel dengan puluhan montir, PJTECH mempermudah pencatatan pengerjaan harian.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {serviceTypes.map((type, i) => (
              <div key={i} className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-emerald-600">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap Kasir Jasa & Servis</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Transparan ke pelanggan, efisien untuk staf teknisi, dan akurat untuk pembukuan pemilik usaha.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan dengan POS Jasa Lain */}
      <section className="py-12 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Bisnis Jasa Memilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Bandingkan dengan POS lain — fitur lebih pas dengan karakter bisnis servis di Indonesia.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>👈👉</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[560px] sm:min-w-[640px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3.5 sm:py-4 px-4 font-bold text-slate-900">Kemampuan & Fitur</th>
                  <th className="text-center py-3.5 sm:py-4 px-4 font-bold text-emerald-600">PJTECH POS</th>
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

      {/* Jangkauan GEO Wilayah Jasa Indonesia */}
      <section className="py-12 sm:py-16 bg-emerald-50/50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Jangkauan Nasional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Solusi Bisnis Jasa di Seluruh Kota Indonesia</h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Dipercaya barbershop, salon kecantikan, dan bengkel di Jakarta, Bandung, Surabaya, Semarang, Medan, Makassar, Denpasar, Yogyakarta, Palembang, hingga Balikpapan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Denpasar Bali', 'Yogyakarta', 'Palembang', 'Tangerang', 'Bekasi', 'Depok', 'Malang', 'Batam', 'Pekanbaru', 'Balikpapan', 'Samarinda', 'Solo'].map((city) => (
              <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {city}
              </span>
            ))}
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              + Seluruh Wilayah Indonesia
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section (Tanya Jawab Terstruktur) */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <HelpCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Tanya Jawab Seputar Kasir Jasa & Servis</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Pertanyaan umum yang sering ditanyakan pemilik usaha barbershop, salon & bengkel</p>
          </div>
          <dl className="space-y-3.5 sm:space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-colors">
                <dt className="font-bold text-sm sm:text-base text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-emerald-600 font-extrabold shrink-0">Q:</span>
                  <span>{faq.name}</span>
                </dt>
                <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-emerald-100 ml-1">
                  {faq.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Tingkatkan Kepercayaan Pelanggan Usaha Jasa Anda</h2>
          <p className="text-xs sm:text-base md:text-lg text-emerald-100 mb-8 max-w-xl mx-auto">
            Manfaatkan link booking online mandiri dan kelola komisi staf dengan mudah. Coba gratis 14 hari tanpa biaya komitmen.
          </p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold text-base rounded-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
            <span>Mulai Uji Coba Gratis 14 Hari</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Jasa & Servis Indonesia. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-emerald-600 font-semibold">Semua Solusi</Link>
            <Link href="/comparison" className="hover:text-emerald-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
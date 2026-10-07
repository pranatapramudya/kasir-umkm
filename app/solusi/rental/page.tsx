import { Metadata } from 'next';
import Link from 'next/link';
import { Car, Home, MapPin, CalendarDays, CreditCard, Shield, CheckCircle, ArrowRight, Key, Building2, ArrowLeft } from 'lucide-react';

const rentalSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PJTech POS Rental/Travel/Properti",
  "description": "Aplikasi kasir Rental untuk mobil, villa, apartemen, alat. Kalender booking, deposit, denda, multi-unit, invoice prorata.",
  "brand": { "@type": "Brand", "name": "PJTECH" },
  "offers": { "@type": "Offer", "price": "990000", "priceCurrency": "IDR", "availability": "https://schema.org/InStock" },
  "category": "Business Software",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "54" }
};

export const metadata: Metadata = {
  title: 'POS Rental/Travel/Properti UMKM - Mobil, Villa, Apartemen, Alat | PJTECH',
  description: 'Aplikasi kasir Rental terbaik: kalender ketersediaan, booking berbasis waktu, deposit, denda keterlambatan, multi-unit, invoice prorata. Mulai Rp 990rb/tahun.',
  keywords: ['POS rental mobil', 'software rental villa', 'booking properti', 'aplikasi sewa apartemen', 'kalender ketersediaan', 'invoice prorata'],
  openGraph: {
    title: 'POS Rental/Travel/Properti UMKM - Solusi Sewa Mobil, Villa, Apartemen, Alat',
    description: 'Kalender booking, deposit, denda, multi-unit, invoice prorata. Mulai Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/rental',
    images: ['/og-rental.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(rentalSchema),
  }
};

const features = [
  { icon: CalendarDays, title: 'Kalender Ketersediaan Visual', desc: 'Drag-drop booking, warna status (tersedia/dibooking/maintenance), filter per unit/tipe, view bulanan/mingguan/harian' },
  { icon: Key, title: 'Booking Berbasis Waktu Fleksibel', desc: 'Per jam/harian/mingguan/bulanan, check-in/check-out custom, early check-in/late check-out biaya tambah' },
  { icon: CreditCard, title: 'Deposit & Denda Otomatis', desc: 'Deposit persen/flat, denda keterlambatan per jam/hari, auto-hitung saat check-out, refund deposit otomatis' },
  { icon: Car, title: 'Multi-Unit & Tipe (Mobil/Kamar/Alat)', desc: 'Armada: Sedan/SUV/Minibus. Properti: Kamar/Villa/Apartemen. Alat: Kamera/Sound/Tenda. Masing-masing beda harga & kalender' },
  { icon: Building2, title: 'Invoice Prorata & Kontrak', desc: 'Prorata harian untuk booking mid-month, generate kontrak PDF, digital sign, perpanjangan otomatis, upgrade/downgrade unit' },
  { icon: Shield, title: 'Kondisi & Foto Check-in/Out', desc: 'Checklist kondisi (body/kaca/ban/mesin), foto 360° saat ambil & kembalikan, bukti kerusakan untuk klaim deposit' },
];

const comparison = [
  { fitur: 'Harga/Tahun', pjtech: 'Rp 990.000', kompetitor: 'Rp 2.000.000 - 6.000.000' },
  { fitur: 'Kalender Visual', pjtech: '✅ Drag-Drop + Warna', kompetitor: '⚠️ List tanggal' },
  { fitur: 'Multi-Tipe Unit', pjtech: '✅ Mobil + Properti + Alat', kompetitor: '❌ Hanya 1 tipe' },
  { fitur: 'Deposit & Denda Auto', pjtech: '✅ Hitung Real-time', kompetitor: '❌ Manual kalkulator' },
  { fitur: 'Invoice Prorata', pjtech: '✅ Built-in', kompetitor: '❌ Excel manual' },
  { fitur: 'Kondisi Foto', pjtech: '✅ 360° + Checklist', kompetitor: '❌ Nggak ada' },
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
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-purple-700 hover:to-pink-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-50 text-purple-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 max-w-full leading-snug">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="truncate">Khusus Rental: Mobil, Travel, Properti, Sewa Kamera & Alat Barang</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
              POS Rental/Travel/Properti <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Yang Bikin Sewa Aman</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Dari rental kendaraan, tour & travel, homestay/villa, hingga sewa alat konstruksi — kelola kalender visual, deposit jaminan, denda telat, dan surat perjanjian sewa A4 dalam satu platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/solusi/rental#fitur" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Kalender Anti-Bentrok</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Deposit & Denda Auto</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Invoice & Kontrak A4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap untuk Rental Modern</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Dari sewa mobil harian sampai alat konstruksi mingguan — jadwal terkontrol tanpa bentrok.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-4.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan */}
      <section className="py-12 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Rental & Properti Pilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Kalender visual, denda otomatis, pencatatan deposit, dan kontrak formal — all-in-one.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>↔️</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[520px] sm:min-w-[600px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-purple-600">PJTECH</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-slate-500">POS Lain (Rata-rata)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 font-medium text-slate-900">{c.fitur}</td>
                    <td className="text-center py-3 sm:py-4 px-3 sm:px-4 text-emerald-700 font-bold">{c.pjtech}</td>
                    <td className="text-center py-3 sm:py-4 px-3 sm:px-4 text-slate-500">{c.kompetitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12">Tanya Jawab Umum Rental</h2>
          <dl className="space-y-3.5 sm:space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Bisa untuk rental kendaraan dan sewa properti/alat sekaligus?', a: 'Bisa. Satu sistem dapat mengelola armada mobil/motor, kamar villa/homestay, serta peralatan sewa dengan tarif per jam, harian, atau bulanan.' },
              { q: 'Bagaimana sistem mencegah jadwal bentrok (double booking)?', a: 'Kalender ketersediaan visual otomatis memblokir unit pada rentang tanggal/jam yang sudah dipesan sehingga kasir tidak bisa membuat order pada unit yang sedang jalan.' },
              { q: 'Apakah denda keterlambatan dihitung otomatis?', a: 'Ya. Anda dapat menentukan tarif denda per jam atau per hari. Saat pengembalian dicatat, sistem langsung mengkalkulasi denda keterlambatan secara otomatis.' },
              { q: 'Bisa cetak surat perjanjian sewa formal untuk penyewa?', a: 'Bisa! Sistem dapat mencetak invoice sewa dan Surat Perjanjian Sewa resmi format A4 berlogo bisnis Anda lengkap dengan tanda tangan digital.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-4.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt itemProp="name" className="font-bold text-sm sm:text-base text-slate-900 mb-1.5 sm:mb-2">{faq.q}</dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div itemProp="text" className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Kelola Bisnis Sewa & Rental Bebas Bentrok</h2>
          <p className="text-xs sm:text-base md:text-lg text-purple-100 mb-6 sm:mb-8">Kalender visual, deposit aman, dan surat perjanjian sewa otomatis dalam satu aplikasi.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-purple-600 font-bold text-sm sm:text-base rounded-xl hover:bg-purple-50 transition-all shadow-xl">
            <span>Mulai Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Rental & Properti. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-purple-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-purple-600 font-semibold">Solusi Lain</Link>
            <Link href="/comparison" className="hover:text-purple-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
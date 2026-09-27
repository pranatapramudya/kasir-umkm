import { Metadata } from 'next';
import Link from 'next/link';
import { Car, Home, MapPin, CalendarDays, CreditCard, Shield, CheckCircle, ArrowRight, Key, Building2 } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>
              Khusus Rental: Mobil, Villa, Apartemen, Alat/Peralatan, Travel
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              POS Rental/Travel/Properti <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Yang Bikin Sewa Aman</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Dari rental motor sampai villa mewah — kelola kalender, deposit, denda, dan kontrak dalam satu aplikasi. Nggak ada lagi sengketa deposit atau double booking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solusi/rental#fitur" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Gratis 14 hari</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Kalender visual</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Kontrak digital</span>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Fitur Lengkap untuk Rental Modern</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Dari sewa motor harian sampai kontrakan bulanan — semuanya teratur.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Mengapa Rental/Properti Pilih PJTECH?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kalender visual, denda auto, prorata, kontrak digital — all-in-one.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-4 font-bold text-purple-600">PJTECH</th>
                  <th className="text-center py-4 px-4 font-bold text-slate-500">POS Lain (Rata-rata)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{c.fitur}</td>
                    <td className="text-center py-4 px-4 text-green-700 font-semibold">{c.pjtech}</td>
                    <td className="text-center py-4 px-4 text-slate-500">{c.kompetitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Tanya Jawab Umum Rental/Travel/Properti</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Bisa untuk rental mobil harian & properti bulanan sekaligus?', a: 'Bisa. Satu akun bisa kelola: Armada (per jam/harian), Properti (mingguan/bulanan), Alat (per hari). Masing-masing punya kalender & harga terpisah.' },
              { q: 'Denda keterlambatan hitung otomatis?', a: 'Ya. Set unit: denda per jam (misal Rp 50.000/jam) atau per hari. Saat check-out, sistem auto hitung: (waktu aktual - waktu seharusnya) × denda. Masuk ke invoice final.' },
              { q: 'Invoice prorata untuk booking tengah bulan?', a: 'Otomatis. Contoh: kontrak bulanan Rp 3.000.000, booking mulai 15 Januari → invoice Januari = 16 hari × (3.000.000/31) = Rp 1.548.387. Bulan penuh normal.' },
              { q: 'Bisa kontrak digital & e-sign?', a: 'Bisa. Generate PDF kontrak dengan template custom. Kirim via WA/Email. Pelanggan tanda tangan digital (draw/tik). Tersimpan otomatis di histori unit & pelanggan.' },
              { q: 'Support rental travel (driver + mobil)?', a: 'Bisa. Setup unit "Mobil + Supir" beda harga dari "Mobil Saja". Jadwal supir terpisah. Invoice bisa pisah: sewa mobil + jasa supir.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <dt itemProp="name" className="font-semibold text-slate-900 mb-2">{faq.q}</dt>
                <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div itemProp="text" className="text-slate-600 leading-relaxed">{faq.a}</div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Siap Bikin Rental Aman & Otomatis?</h2>
          <p className="text-purple-100 mb-8 text-lg">Join 100+ rental mobil, villa, alat yang sudah pindah ke PJTECH. Kalender visual, denda auto, kontrak digital, gratis 14 hari.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
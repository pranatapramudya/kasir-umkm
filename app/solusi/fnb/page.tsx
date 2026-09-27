import { Metadata } from 'next';
import Link from 'next/link';
import { Utensils, Table, ChefHat, Zap, Printer, CheckCircle, ArrowRight, Wifi, CreditCard, RotateCcw } from 'lucide-react';

const fnbSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PJTech POS F&B",
  "description": "Aplikasi kasir F&B untuk restoran, kafe, warung makan. Meja, split bill, kitchen display, modifier. Order ojol manual input.",
  "brand": { "@type": "Brand", "name": "PJTECH" },
  "offers": { "@type": "Offer", "price": "990000", "priceCurrency": "IDR", "availability": "https://schema.org/InStock" },
  "category": "Business Software",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "112" }
};

export const metadata: Metadata = {
  title: 'POS F&B UMKM - Restoran, Kafe, Warung Makan | PJTECH',
  description: 'Aplikasi kasir F&B terbaik: manajemen meja, split bill, open bill, kitchen display, modifier. Mulai Rp 990rb/tahun.',
  keywords: ['POS restoran', 'kasir kafe', 'aplikasi kasir warung makan', 'kitchen display system', 'split bill'],
  openGraph: {
    title: 'POS F&B UMKM - Solusi Kasir Restoran, Kafe, Warung Makan',
    description: 'Manajemen meja, split bill, kitchen display, modifier. Mulai Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/fnb',
    images: ['/og-fnb.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(fnbSchema),
  }
};

const features = [
  { icon: Table, title: 'Manajemen Meja Visual', desc: 'Layout meja drag-drop, status warna (kosong/terisi/pesan), merge meja, QR order meja' },
  { icon: ChefHat, title: 'Kitchen Display System (KDS)', desc: 'Layar dapur real-time, filter per station (masak/minum), status: pending/cooking/ready, bump via touch/HP' },
  { icon: Utensils, title: 'Modifier & Resep', desc: 'Level pedas, tanpa bawang, extra topping, nasi/kurang. Resep bahan baku → auto kurangi stok bahan' },
  { icon: Zap, title: 'Split Bill & Open Bill', desc: 'Split by item/rata/nominal, open bill (bayar nanti), void item dengan alasan, transfer meja' },
  { icon: Printer, title: 'Multi-Printer Otomatis', desc: 'Struk kasir (58/80mm), tiket dapur per station, label takeaway, nota pembayaran' },
  { icon: RotateCcw, title: 'Roadmap: Integrasi Ojol', desc: 'Integrasi GoFood/GrabFood direncanakan Q1 2027. Saat ini order ojol manual input.' },
];

const comparison = [
  { fitur: 'Harga/Tahun', pjtech: 'Rp 990.000', kompetitor: 'Rp 2.000.000 - 5.000.000' },
  { fitur: 'Manajemen Meja', pjtech: '✅ Visual Drag-Drop', kompetitor: '⚠️ List biasa' },
  { fitur: 'Kitchen Display', pjtech: '✅ Included (HP/Tablet)', kompetitor: '❌ Bayar tambah Rp 500rb+/bln' },
  { fitur: 'Modifier Resep', pjtech: '✅ Unlimited + Stok Bahan', kompetitor: '⚠️ Hanya catatan' },
  { fitur: 'Integrasi Ojol', pjtech: '🔜 Roadmap Q1 2027', kompetitor: '❌ Butuh middleware mahal' },
  { fitur: 'Split Bill', pjtech: '✅ Fleksibel (item/rata/nominal)', kompetitor: '⚠️ Hanya rata' },
];

export default function FnbPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>
              Khusus F&B: Restoran, Kafe, Warung Makan, Bakso, Ayam Geprek
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              POS F&B <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Yang Bikin Dapur Tenang</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Dari warung makan sampai restoran 50 meja — kelola meja, dapur, modifier dalam satu aplikasi. Dapur nggak lagi ribet, kasir nggak lagi stres.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2">
                Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solusi/fnb#fitur" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Gratis 14 hari</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Setup KDS 10 menit</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Order ojol manual input</span>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Fitur Lengkap untuk F&B Modern</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Dapur jalan lancar, kasir cepat, pelanggan happy.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-orange-600" />
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
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Mengapa F&B Pilih PJTECH?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">KDS included, integrasi ojol native, harga transparan.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-4 font-bold text-orange-600">PJTECH</th>
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
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Tanya Jawab Umum F&B</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'KDS (Kitchen Display) butuh hardware apa?', a: 'Bisa pakai TV/monitor biasa + HP Android lama / tablet murah (Rp 1-2 jt). Nggak perlu beli KDS hardware mahal. Bisa juga print ke printer dapur thermal.' },
              { q: 'Bisa integrasi GoFood dan GrabFood sekaligus?', a: 'Belum. Integrasi GoFood/GrabFood direncanakan Q1 2027. Saat ini order ojol di-input manual ke POS.' },
              { q: 'Modifier (level pedas, topping) support stok bahan baku?', a: 'Ya. Bisa buat resep: 1 Nasi Goreng = 150gr beras + 2 butir telur + 50gr ayam. Saat jual, stok bahan baku otomatis berkurang. Alert stok bahan minimum.' },
              { q: 'Split bill bisa bayar beda metode?', a: 'Bisa. Meja 4 orang: 2 orang bayar QRIS, 1 tunai, 1 transfer. Split by item (masing-masing bayar pesanannya) atau split rata/nominal custom.' },
              { q: 'Support QR Order (scan meja → order HP pelanggan)?', a: 'Ya. Generate QR code per meja. Pelanggan scan → order dari HP → masuk ke KDS & POS. Kasir cuma konfirmasi & kasir. Kurangi beban waiter.' },
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

      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Siap Bikin Dapur & Kasir Tenang?</h2>
          <p className="text-orange-100 mb-8 text-lg">Join 300+ F&B yang sudah pindah ke PJTECH. KDS included, order ojol manual input, gratis 14 hari.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
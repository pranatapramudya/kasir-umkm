import { Metadata } from 'next';
import Link from 'next/link';
import { Utensils, Table, ChefHat, Zap, Printer, CheckCircle, ArrowRight, Wifi, CreditCard, RotateCcw, ArrowLeft } from 'lucide-react';

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orange-50 text-orange-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 max-w-full leading-snug">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="truncate">Khusus F&B: Restoran, Kafe, Warung Makan, Bakery</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
              POS F&B <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Yang Bikin Dapur Tenang</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Dari warung makan sampai restoran 50 meja — kelola denah meja, monitor dapur (KDS), modifier, dan HPP resep dalam satu aplikasi tanpa biaya lisensi tambahan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/solusi/fnb#fitur" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Gratis KDS Dapur</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> 3 Template Excel</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Split & Open Bill</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap untuk Kuliner & F&B</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Pesanan cepat ke meja, dapur memasak tanpa salah, dan stok bahan baku termonitor.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-4.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Bisnis Kuliner Pilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">KDS gratis, multi-meja included, dan template Excel siap upload — tanpa add-on mahal.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>↔️</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[520px] sm:min-w-[600px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-orange-600">PJTECH</th>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12">Tanya Jawab Umum F&B</h2>
          <dl className="space-y-3.5 sm:space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Apakah Kitchen Display System (KDS) benar-benar gratis tanpa bayar lisensi?', a: 'Ya, 100% included dalam langganan Rp 990rb/tahun. Anda bisa buka layar KDS Dapur di HP bekas atau tablet android apapun via browser secara real-time.' },
              { q: 'Bagaimana cara import menu jika punya ratusan varian minuman dan makanan?', a: 'Kami sediakan 3 template Excel standar: Format Kafe, Format Resto (Meja), dan Format Warung Fast Food. Cukup isi daftar nama menu, harga, dan kategori lalu upload sekali klik.' },
              { q: 'Apakah bisa cetak terpisah ke printer kasir dan printer dapur?', a: 'Bisa! Sistem mendukung multi-printer ESC/POS Bluetooth. Tiket order makanan bisa langsung dipisah ke dapur sedangkan minuman ke station bar.' },
              { q: 'Bagaimana pengaturan split bill saat pelanggan minta bayar pisah meja?', a: 'Kasir cukup tap tombol Split Bill pada meja aktif, lalu pilih item mana saja yang dibayar pelanggan pertama, sisanya tetap tersimpan di meja tersebut.' }
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Bikin Operasional Restoran & Kafe Lebih Rapi</h2>
          <p className="text-xs sm:text-base md:text-lg text-orange-100 mb-6 sm:mb-8">Uji coba gratis 14 hari dengan akses penuh ke sistem KDS dan Manajemen Meja.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-orange-600 font-bold text-sm sm:text-base rounded-xl hover:bg-orange-50 transition-all shadow-xl">
            <span>Mulai Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS F&B. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-orange-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-orange-600 font-semibold">Solusi Lain</Link>
            <Link href="/comparison" className="hover:text-orange-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
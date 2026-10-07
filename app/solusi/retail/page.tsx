import { Metadata } from 'next';
import Link from 'next/link';
import { Store, Barcode, Package, Tag, TrendingUp, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const retailSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PJTech POS Retail",
  "description": "Aplikasi kasir Retail untuk toko kelontong, fashion, minimarket. Multi-varian, barcode, stok otomatis, diskon, PPN.",
  "brand": { "@type": "Brand", "name": "PJTECH" },
  "offers": { "@type": "Offer", "price": "990000", "priceCurrency": "IDR", "availability": "https://schema.org/InStock" },
  "category": "Business Software",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "89" }
};

export const metadata: Metadata = {
  title: 'POS Retail UMKM - Toko Kelontong, Fashion, Minimarket | PJTECH',
  description: 'Aplikasi kasir Retail terbaik untuk UMKM: multi-varian (ukuran/warna), barcode/SKU, stok otomatis, diskon fleksibel, PPN, cetak struk & label harga. Mulai Rp 990rb/tahun.',
  keywords: ['POS retail', 'kasir toko kelontong', 'aplikasi kasir fashion', 'software minimarket', 'stok otomatis barcode'],
  openGraph: {
    title: 'POS Retail UMKM - Solusi Kasir Toko Kelontong, Fashion, Minimarket',
    description: 'Multi-varian, barcode, stok otomatis, diskon, PPN. Mulai Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/retail',
    images: ['/og-retail.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(retailSchema),
  }
};

const features = [
  { icon: Barcode, title: 'Barcode & SKU Otomatis', desc: 'Generate SKU unik, scan barcode hp/bluetooth, cari produk instan' },
  { icon: Package, title: 'Multi-Varian Produk', desc: 'Ukuran (S/M/L/XL), Warna (Merah/Biru), Kombinasi varian tak terbatas' },
  { icon: Tag, title: 'Diskon Fleksibel', desc: 'Diskon per item, persen/nominal, diskon struk, happy hour, member price' },
  { icon: TrendingUp, title: 'Stok Real-time & Alert', desc: 'Stok berkurang otomatis saat jual, notifikasi stok minimum, reorder point' },
  { icon: Shield, title: 'PPN & Laporan Pajak', desc: 'PPN include/exclude, ekspor CSV untuk Jurnal/akuntan, laporan PPN otomatis' },
  { icon: CheckCircle, title: 'Cetak Struk & Label Harga', desc: 'Printer bluetooth 58mm/80mm, label harga barcode, custom footer struk' },
];

const comparison = [
  { fitur: 'Harga/Tahun', pjtech: 'Rp 990.000', kompetitor: 'Rp 1.500.000 - 3.000.000' },
  { fitur: 'Multi-Varian', pjtech: '✅ Unlimited', kompetitor: '⚠️ Terbatas/Bayar tambah' },
  { fitur: 'Barcode Scanner', pjtech: '✅ HP + Bluetooth', kompetitor: '⚠️ Hanya hardware khusus' },
  { fitur: 'Stok Otomatis', pjtech: '✅ Real-time', kompetitor: '✅ Biasanya ada' },
  { fitur: 'PPN & Ekspor Akuntan', pjtech: '✅ Built-in', kompetitor: '⚠️ Manual/Export terbatas' },
  { fitur: 'Multi-Cabang', pjtech: '✅ SaaS Native', kompetitor: '❌ Butuh server terpisah' },
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 max-w-full leading-snug">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="truncate">Khusus Retail: Toko Kelontong, Fashion, Minimarket, ATK</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
              POS Retail <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Yang Paham UMKM</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Dari toko kelontong sampai butik fashion — kelola varian, stok, diskon, dan laporan pajak dalam satu aplikasi. Tidak perlu hardware mahal, jalan di HP, tablet & laptop.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/solusi/retail#fitur" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Gratis 14 hari</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Tanpa kontrak</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Setup 5 menit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap untuk Retail Modern</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Semua fitur yang dibutuhkan toko modern — sudah included tanpa biaya tersembunyi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-4.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa UMKM Pilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Bandingkan dengan POS lain — fitur lengkap, harga transparan, tanpa biaya tersembunyi.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>↔️</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[520px] sm:min-w-[600px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-blue-600">PJTECH</th>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12">Tanya Jawab Umum Retail</h2>
          <dl className="space-y-3.5 sm:space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Apakah support multi-varian seperti ukuran dan warna untuk toko fashion?', a: 'Ya, support varian tak terbatas: Ukuran (S/M/L/XL/XXL), Warna, Material, atau kombinasi keduanya. Setiap varian punya SKU & stok terpisah.' },
              { q: 'Bisa scan barcode pakai HP saja?', a: 'Bisa. Kamera HP jadi barcode scanner. Support juga scanner bluetooth 1D/2D (Socket Mobile, Zebra, dll) untuk volume tinggi.' },
              { q: 'Bagaimana stok otomatisnya?', a: 'Setiap transaksi penjualan, stok berkurang real-time. Bisa set minimum stok → notifikasi WA/email saat perlu restock. Support stok minus untuk pre-order.' },
              { q: 'Apakah ada fitur PPN dan laporan untuk akuntan?', a: 'Ya. PPN include/exclude per item. Ekspor CSV format Jurnal (Jurnal.id, Accurate, Mekari, Xero) siap import ke software akuntansi.' },
              { q: 'Bisa dipakai multi-cabang?', a: 'Bisa. SaaS multi-tenant native — satu akun Owner bisa kelola banyak cabang, stok terpusat atau per cabang, laporan konsolidasi otomatis.' },
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Siap Digitalisasi Toko Retail Anda?</h2>
          <p className="text-xs sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-8">Join 500+ toko retail yang sudah pindah ke PJTECH. Gratis 14 hari, setup 5 menit.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-blue-600 font-bold text-sm sm:text-base rounded-xl hover:bg-blue-50 transition-all shadow-xl">
            <span>Mulai Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Retail. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-blue-600 font-semibold">Solusi Lain</Link>
            <Link href="/comparison" className="hover:text-blue-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
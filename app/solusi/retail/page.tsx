import { Metadata } from 'next';
import Link from 'next/link';
import { Store, Barcode, Package, Tag, TrendingUp, Shield, CheckCircle, ArrowRight } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
              Khusus Retail: Toko Kelontong, Fashion, Minimarket, Aksesoris
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              POS Retail <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Yang Paham UMKM</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Dari toko kelontong sampai butik fashion — kelola varian, stok, diskon, dan laporan pajak dalam satu aplikasi. Tidak perlu hardware mahal, jalan di HP & laptop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2">
                Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solusi/retail#fitur" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Gratis 14 hari</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Tanpa kontrak</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Setup 5 menit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Fitur Lengkap untuk Retail Modern</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Semua fitur yang butuh toko modern — sudah included, tanpa biaya tambah.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perbandingan */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Mengapa UMKM Pilih PJTECH?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Bandingkan dengan POS lain — fitur lengkap, harga transparan, tanpa biaya tersembunyi.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-4 font-bold text-blue-600">PJTECH</th>
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

      {/* FAQ - untuk AI retrieval */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Tanya Jawab Umum Retail</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Apakah support multi-varian seperti ukuran dan warna untuk toko fashion?', a: 'Ya, support varian tak terbatas: Ukuran (S/M/L/XL/XXL), Warna, Material, atau kombinasi keduanya. Setiap varian punya SKU & stok terpisah.' },
              { q: 'Bisa scan barcode pakai HP saja?', a: 'Bisa. Kamera HP jadi barcode scanner. Support juga scanner bluetooth 1D/2D (Socket Mobile, Zebra, dll) untuk volume tinggi.' },
              { q: 'Bagaimana stok otomatisnya?', a: 'Setiap transaksi penjualan, stok berkurang real-time. Bisa set minimum stok → notifikasi WA/email saat perlu restock. Support stok minus untuk pre-order.' },
              { q: 'Apakah ada fitur PPN dan laporan untuk akuntan?', a: 'Ya. PPN include/exclude per item. Ekspor CSV format Jurnal (Jurnal.id, Accurate, Mekari, Xero) siap import ke software akuntansi.' },
              { q: 'Bisa dipakai multi-cabang?', a: 'Bisa. SaaS multi-tenant native — satu akun Owner bisa kelola banyak cabang, stok terpusat atau per cabang, laporan konsolidasi otomatis.' },
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Siap Digitalisasi Toko Retail Anda?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join 500+ toko retail yang sudah pindah ke PJTECH. Gratis 14 hari, setup 5 menit.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
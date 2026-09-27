import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, XCircle, Award, TrendingUp, Shield, Users, Zap, ArrowRight } from 'lucide-react';

const comparisonSchema = {
  "@context": "https://schema.org",
  "@type": "ComparisonTable",
  "name": "Perbandingan Aplikasi Kasir UMKM Indonesia 2024",
  "description": "Perbandingan fitur & harga PJTECH vs Moka vs Pawoon vs iReap vs Qashier",
  "items": [
    { "@type": "Product", "name": "PJTECH Kasir UMKM", "offers": { "price": "990000", "priceCurrency": "IDR" } },
    { "@type": "Product", "name": "Moka POS", "offers": { "price": "1800000", "priceCurrency": "IDR" } },
    { "@type": "Product", "name": "Pawoon POS", "offers": { "price": "2400000", "priceCurrency": "IDR" } },
    { "@type": "Product", "name": "iReap POS", "offers": { "price": "1200000", "priceCurrency": "IDR" } },
    { "@type": "Product", "name": "Qashier", "offers": { "price": "3600000", "priceCurrency": "IDR" } }
  ]
};

export const metadata: Metadata = {
  title: 'Perbandingan POS UMKM - PJTECH vs Moka vs Pawoon vs iReap vs Qashier | PJTECH',
  description: 'Perbandingan lengkap aplikasi kasir UMKM Indonesia 2024: PJTECH vs Moka vs Pawoon vs iReap vs Qashier. Harga, fitur retail, F&B, jasa, rental. PJTECH mulai Rp 990rb/tahun all-in.',
  keywords: ['perbandingan POS UMKM', 'PJTECH vs Moka', 'PJTECH vs Pawoon', 'PJTECH vs iReap', 'PJTECH vs Qashier', 'POS terbaik Indonesia 2024', 'aplikasi kasir termurah'],
  openGraph: {
    title: 'Perbandingan POS UMKM 2024 - PJTECH vs Moka vs Pawoon vs iReap vs Qashier',
    description: 'Harga mulai Rp 990rb/tahun all-in. Fitur Retail, F&B, Jasa, Rental lengkap. Lihat perbandingan detail.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/comparison',
    images: ['/og-comparison.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(comparisonSchema),
  }
};

const competitors = [
  {
    id: 'pjtech',
    name: 'PJTECH',
    tagline: 'All-in-One Multi-Vertikal',
    price: 990000,
    period: '/tahun',
    color: 'blue',
    badge: 'Best Value',
    highlights: ['4 Vertikal: Retail, F&B, Jasa, Rental', 'KDS Included', 'WA API Included', 'Multi-cabang Native']
  },
  {
    id: 'moka',
    name: 'Moka',
    tagline: 'Fokus F&B & Retail',
    price: 1800000,
    period: '/tahun',
    color: 'orange',
    badge: 'Popular',
    highlights: ['Hardware bundle', 'KDS bayar terpisah', 'Integrasi ojol via middleware', 'Single vertical focus']
  },
  {
    id: 'pawoon',
    name: 'Pawoon',
    tagline: 'Enterprise POS',
    price: 2400000,
    period: '/tahun',
    color: 'purple',
    badge: 'Enterprise',
    highlights: ['Fitur lengkap tapi mahal', 'KDS & Ojol bayar tambah', 'Multi-cabang butuh setup', 'Target: mid-large business']
  },
  {
    id: 'ireap',
    name: 'iReap',
    tagline: 'Inventory Heavy',
    price: 1200000,
    period: '/tahun',
    color: 'green',
    badge: 'Inventory Focus',
    highlights: ['Kuat di inventory', 'F&B basic', 'Tidak ada KDS', 'Tidak ada rental/jasa']
  },
  {
    id: 'qashier',
    name: 'Qashier',
    tagline: 'Hardware-First',
    price: 3600000,
    period: '/tahun',
    color: 'red',
    badge: 'Hardware Bundle',
    highlights: ['Termasuk hardware', 'SaaS fee tinggi', 'Vendor lock-in hardware', 'Mahal untuk UMKM kecil']
  }
];

const comparisonRows = [
  { category: 'Harga & Model', feature: 'Harga Tahunan (All-in)', pjtech: 'Rp 990.000', moka: 'Rp 1.800.000+', pawoon: 'Rp 2.400.000+', ireap: 'Rp 1.200.000+', qashier: 'Rp 3.600.000+', winner: 'pjtech' },
  { category: 'Harga & Model', feature: 'Gratis Trial', pjtech: '✅ 14 Hari', moka: '✅ 14 Hari', pawoon: '✅ 14 Hari', ireap: '✅ 14 Hari', qashier: '✅ Demo Only', winner: 'pjtech' },
  { category: 'Harga & Model', feature: 'Setup Fee', pjtech: 'Rp 0', moka: 'Rp 0 (hardware bundle)', pawoon: 'Rp 0', ireap: 'Rp 0', qashier: 'Included in hardware', winner: 'pjtech' },
  { category: 'Harga & Model', feature: 'Biaya Tersembunyi', pjtech: '❌ Tidak Ada', moka: 'KDS + Ojol + Printer', pawoon: 'Module tambahan', ireap: 'Module tambahan', qashier: 'Hardware wajib', winner: 'pjtech' },

  { category: 'Vertikal Bisnis', feature: 'Retail (Toko/Fashion)', pjtech: '✅ Lengkap + Varian', moka: '✅ Lengkap', pawoon: '✅ Lengkap', ireap: '✅ Kuat Inventory', qashier: '✅ Basic', winner: 'pjtech' },
  { category: 'Vertikal Bisnis', feature: 'F&B (Restoran/Kafe)', pjtech: '✅ Lengkap + KDS + Ojol', moka: '✅ Kuat (asalnya F&B)', pawoon: '✅ Lengkap', ireap: '⚠️ Basic', qashier: '✅ Basic', winner: 'pjtech' },
  { category: 'Vertikal Bisnis', feature: 'Jasa/Servis (Bengkel/Laundry)', pjtech: '✅ Native (Booking, Tracking, WA)', moka: '❌ Tidak Ada', pawoon: '⚠️ Workaround', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech' },
  { category: 'Vertikal Bisnis', feature: 'Rental/Travel/Properti', pjtech: '✅ Native (Kalender, Deposit, Prorata)', moka: '❌ Tidak Ada', pawoon: '❌ Tidak Ada', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech' },

  { category: 'Fitur Kunci', feature: 'Kitchen Display (KDS)', pjtech: '✅ Included (HP/Tablet)', moka: '❌ Bayar Rp 500rb+/bln', pawoon: '❌ Bayar Tambah', ireap: '❌ Tidak Ada', qashier: '❌ Bayar Tambah', winner: 'pjtech' },
  { category: 'Fitur Kunci', feature: 'Integrasi GoFood/GrabFood', pjtech: '✅ Native (Official API)', moka: '⚠️ Via Middleware', pawoon: '⚠️ Via Middleware', ireap: '❌ Tidak Ada', qashier: '⚠️ Via Middleware', winner: 'pjtech' },
  { category: 'Fitur Kunci', feature: 'WhatsApp Notifikasi', pjtech: '✅ Official Cloud API (5 trigger)', moka: '⚠️ Unofficial/Manual', pawoon: '❌ Tidak Ada', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech' },
  { category: 'Fitur Kunci', feature: 'Multi-Cabang', pjtech: '✅ SaaS Native (Stok Pusat/Cabang)', moka: '⚠️ Butuh Setup Khusus', pawoon: '✅ Ada', ireap: '✅ Ada', qashier: '✅ Ada', winner: 'pjtech' },
  { category: 'Fitur Kunci', feature: 'PPN & Ekspor Akuntan', pjtech: '✅ Built-in (Jurnal/Accurate/Xero)', moka: '✅ Ada', pawoon: '✅ Ada', ireap: '✅ Ada', qashier: '✅ Ada', winner: 'tie' },
  { category: 'Fitur Kunci', feature: 'Printer Bluetooth Auto-Detect', pjtech: '✅ 58/80mm Plug & Play', moka: '⚠️ Hanya Hardware Resmi', pawoon: '⚠️ Hanya Hardware Resmi', ireap: '✅ Support', qashier: '✅ Hardware Resmi', winner: 'pjtech' },
  { category: 'Fitur Kunci', feature: 'Offline Mode (PWA)', pjtech: '✅ IndexedDB + Auto Sync', moka: '❌ Online Only', pawoon: '❌ Online Only', ireap: '❌ Online Only', qashier: '❌ Online Only', winner: 'pjtech' },

  { category: 'Dukungan', feature: 'Support Bahasa Indonesia', pjtech: '✅ Native', moka: '✅ Native', pawoon: '✅ Native', ireap: '✅ Native', qashier: '✅ Native', winner: 'tie' },
  { category: 'Dukungan', feature: 'Jam Operasional Support', pjtech: 'Sen-Jum 09-18 WIB', moka: '24/7 (Chat)', pawoon: 'Sen-Sab 09-18', ireap: 'Sen-Jum 09-17', qashier: '24/7 (Chat)', winner: 'moka' },
  { category: 'Dukungan', feature: 'Dokumentasi & Video', pjtech: '✅ Lengkap + YouTube', moka: '✅ Lengkap', pawoon: '✅ Lengkap', ireap: '⚠️ Kurang', qashier: '✅ Lengkap', winner: 'pjtech' },
];

export default function ComparisonPage() {
  const categories = [...new Set(comparisonRows.map(r => r.category))];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <Award className="w-4 h-4" /> Diupdate: Desember 2024 • Data dari website resmi & user review
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              Perbandingan Jujur: <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PJTECH vs Kompetitor</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Kami tidak menyembunyikan harga & fitur. Bandingkan sendiri — PJTECH memberikan fitur lengkap 4 vertikal dengan harga paling transparan di Indonesia.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up?redirect_url=/onboarding" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2">
                Coba PJTECH Gratis 14 Hari <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Cards */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {competitors.map((c, i) => (
              <div key={c.id} className={`relative bg-white p-6 rounded-2xl border-2 ${c.id === 'pjtech' ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' : 'border-slate-100 hover:border-slate-200'} ${i === 0 ? 'scale-105 z-10' : ''}`}>
                {c.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${c.id === 'pjtech' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {c.badge}
                  </div>
                )}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${c.id === 'pjtech' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-slate-100'}`}>
                    <span className={`text-2xl font-black ${c.id === 'pjtech' ? 'text-white' : 'text-slate-600'}`}>
                      {c.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{c.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{c.tagline}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-slate-900">Rp {c.price.toLocaleString('id-ID')}</span>
                    <span className="text-slate-500">{c.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6">
                    {c.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${c.id === 'pjtech' ? 'text-blue-500' : 'text-green-500'}`} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  {c.id === 'pjtech' && (
                    <Link href="/sign-up?redirect_url=/onboarding" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-center hover:from-blue-700 hover:to-indigo-700 transition-all">
                      Mulai Gratis 14 Hari
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Tables */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((cat, catIndex) => (
            <div key={cat} className="mb-16">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">{catIndex + 1}</span>
                {cat}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 font-bold text-slate-900 sticky left-0 z-10 bg-slate-50">Fitur</th>
                      <th className="text-center py-4 px-4 font-bold text-blue-600 sticky left-[200px] z-10 bg-slate-50">PJTECH</th>
                      <th className="text-center py-4 px-4 font-bold text-orange-600 bg-slate-50">Moka</th>
                      <th className="text-center py-4 px-4 font-bold text-purple-600 bg-slate-50">Pawoon</th>
                      <th className="text-center py-4 px-4 font-bold text-green-600 bg-slate-50">iReap</th>
                      <th className="text-center py-4 px-4 font-bold text-red-600 bg-slate-50">Qashier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonRows.filter(r => r.category === cat).map((row, i) => (
                      <tr key={i} className={`hover:bg-slate-50 ${row.winner === 'pjtech' ? 'bg-blue-50/30' : ''}`}>
                        <td className="py-4 px-4 font-medium text-slate-900 sticky left-0 z-10 bg-white">{row.feature}</td>
                        <td className="text-center py-4 px-4 {row.winner === 'pjtech' ? 'font-bold text-blue-700' : 'text-slate-700'}">{row.pjtech}</td>
                        <td className="text-center py-4 px-4 text-slate-600">{row.moka}</td>
                        <td className="text-center py-4 px-4 text-slate-600">{row.pawoon}</td>
                        <td className="text-center py-4 px-4 text-slate-600">{row.ireap}</td>
                        <td className="text-center py-4 px-4 text-slate-600">{row.qashier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why PJTECH Wins */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Kenapa 1000+ UMKM Pilih PJTECH?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Bukan cuma harga — tapi value total yang diterima.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'ROI Tercepat', desc: 'Break-even bulan 1. Harga Rp 990rb/tahun = Rp 82.500/bln. 1 transaksi harian sudah cover biaya.' },
              { icon: Shield, title: 'Zero Vendor Lock-in', desc: 'Export data kapan saja. Tidak terikat hardware. Pindah ke sistem lain? Data CSV siap pakai.' },
              { icon: Users, title: 'Dibangun untuk UMKM Indonesia', desc: 'Bukan adaptasi dari luar. Paham PPN Indonesia, Jurnal.id, GoFood, GrabFood, WA Indonesia.' },
              { icon: Zap, title: 'Fitur Enterprise Harga UMKM', desc: 'KDS, Multi-cabang, WA API, Offline mode, Prorata rental — semuanya included tanpa upgrade.' },
              { icon: Award, title: 'Update Mingguan', desc: 'Feedback user → fitur baru minggu depan. Bukan roadmap 6 bulan seperti kompetitor enterprise.' },
              { icon: CheckCircle, title: 'Support Paham Bisnis', desc: 'Tim support paham operational toko/restoran/bengkel/rental. Bukan cuma baca script FAQ.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Mulai Digitalisasi Bisnis Anda Hari Ini</h2>
          <p className="text-blue-100 mb-8 text-lg">Gratis 14 hari. Setup 5 menit. Tidak perlu kartu kredit. Batalkan kapan saja.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
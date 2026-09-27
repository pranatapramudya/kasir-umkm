import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, XCircle, Award, TrendingUp, Shield, Users, Zap, ArrowRight, Star, BarChart, Lock, Globe, Smartphone, Download, HelpCircle, Sparkles } from 'lucide-react';

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
    highlights: ['4 Vertikal: Retail, F&B, Jasa, Rental', 'KDS Included (HP/Tablet)', 'WA Official Cloud API', 'Multi-cabang Native SaaS', 'Offline-First PWA', 'Import Excel Template']
  },
  {
    id: 'moka',
    name: 'Moka',
    tagline: 'Fokus F&B & Retail',
    price: 1800000,
    period: '/tahun',
    color: 'orange',
    badge: 'Popular',
    highlights: ['Hardware bundle wajib', 'KDS bayar Rp 500rb+/bln', 'Integrasi ojol via middleware', 'Single vertical focus', 'Online only', 'Vendor lock-in hardware']
  },
  {
    id: 'pawoon',
    name: 'Pawoon',
    tagline: 'Enterprise POS',
    price: 2400000,
    period: '/tahun',
    color: 'purple',
    badge: 'Enterprise',
    highlights: ['Fitur lengkap tapi mahal', 'KDS & Ojol bayar tambah', 'Multi-cabang butuh setup', 'Target: mid-large business', 'Online only', 'Setup fee tersembunyi']
  },
  {
    id: 'ireap',
    name: 'iReap',
    tagline: 'Inventory Heavy',
    price: 1200000,
    period: '/tahun',
    color: 'green',
    badge: 'Inventory Focus',
    highlights: ['Kuat di inventory management', 'F&B basic saja', 'Tidak ada KDS', 'Tidak ada rental/jasa', 'Online only', 'Dokumentasi minim']
  },
  {
    id: 'qashier',
    name: 'Qashier',
    tagline: 'Hardware-First',
    price: 3600000,
    period: '/tahun',
    color: 'red',
    badge: 'Hardware Bundle',
    highlights: ['Termasuk hardware proprietary', 'SaaS fee tinggi', 'Vendor lock-in hardware', 'Mahal untuk UMKM kecil', 'Online only', 'Kurang fleksibel']
  }
];

const comparisonRows = [
  { category: 'Harga & Model', feature: 'Harga Tahunan (All-in)', pjtech: 'Rp 990.000', moka: 'Rp 1.800.000+', pawoon: 'Rp 2.400.000+', ireap: 'Rp 1.200.000+', qashier: 'Rp 3.600.000+', winner: 'pjtech', highlight: '3.6x lebih hemat vs Qashier' },
  { category: 'Harga & Model', feature: 'Gratis Trial', pjtech: '✅ 14 Hari Penuh', moka: '✅ 14 Hari', pawoon: '✅ 14 Hari', ireap: '✅ 14 Hari', qashier: '❌ Demo Only', winner: 'pjtech' },
  { category: 'Harga & Model', feature: 'Setup Fee', pjtech: 'Rp 0', moka: 'Rp 0 (hardware bundle)', pawoon: 'Rp 0', ireap: 'Rp 0', qashier: 'Included in hardware', winner: 'pjtech' },
  { category: 'Harga & Model', feature: 'Biaya Tersembunyi', pjtech: '❌ Tidak Ada', moka: 'KDS + Ojol + Printer', pawoon: 'Module tambahan', ireap: 'Module tambahan', qashier: 'Hardware wajib', winner: 'pjtech', highlight: 'Transparan 100%' },

  { category: 'Vertikal Bisnis', feature: 'Retail (Toko/Fashion)', pjtech: '✅ Lengkap + Varian', moka: '✅ Lengkap', pawoon: '✅ Lengkap', ireap: '✅ Kuat Inventory', qashier: '✅ Basic', winner: 'pjtech' },
  { category: 'Vertikal Bisnis', feature: 'F&B (Restoran/Kafe)', pjtech: '✅ Lengkap + KDS + Ojol', moka: '✅ Kuat (asalnya F&B)', pawoon: '✅ Lengkap', ireap: '⚠️ Basic', qashier: '✅ Basic', winner: 'pjtech', highlight: 'Satu-satunya all-native' },
  { category: 'Vertikal Bisnis', feature: 'Jasa/Servis (Bengkel/Laundry)', pjtech: '✅ Native (Booking, Tracking, WA)', moka: '❌ Tidak Ada', pawoon: '⚠️ Workaround', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech', highlight: 'Unik di pasar' },
  { category: 'Vertikal Bisnis', feature: 'Rental/Travel/Properti', pjtech: '✅ Native (Kalender, Deposit, Prorata)', moka: '❌ Tidak Ada', pawoon: '❌ Tidak Ada', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech', highlight: 'Unik di pasar' },

  { category: 'Fitur Kunci', feature: 'Kitchen Display (KDS)', pjtech: '✅ Included (HP/Tablet)', moka: '❌ Bayar Rp 500rb+/bln', pawoon: '❌ Bayar Tambah', ireap: '❌ Tidak Ada', qashier: '❌ Bayar Tambah', winner: 'pjtech', highlight: 'Hemat Rp 6jt+/thn' },
  { category: 'Fitur Kunci', feature: 'Integrasi GoFood/GrabFood', pjtech: '✅ Native (Official API)', moka: '⚠️ Via Middleware', pawoon: '⚠️ Via Middleware', ireap: '❌ Tidak Ada', qashier: '⚠️ Via Middleware', winner: 'pjtech', highlight: 'Resmi & stabil' },
  { category: 'Fitur Kunci', feature: 'WhatsApp Notifikasi', pjtech: '✅ Official Cloud API (5 trigger)', moka: '⚠️ Unofficial/Manual', pawoon: '❌ Tidak Ada', ireap: '❌ Tidak Ada', qashier: '❌ Tidak Ada', winner: 'pjtech', highlight: 'Anti-ban, resmi Meta' },
  { category: 'Fitur Kunci', feature: 'Multi-Cabang', pjtech: '✅ SaaS Native (Stok Pusat/Cabang)', moka: '⚠️ Butuh Setup Khusus', pawoon: '✅ Ada', ireap: '✅ Ada', qashier: '✅ Ada', winner: 'pjtech', highlight: 'Plug & play' },
  { category: 'Fitur Kunci', feature: 'PPN & Ekspor Akuntan', pjtech: '✅ Built-in (Jurnal/Accurate/Xero)', moka: '✅ Ada', pawoon: '✅ Ada', ireap: '✅ Ada', qashier: '✅ Ada', winner: 'tie' },
  { category: 'Fitur Kunci', feature: 'Printer Bluetooth Auto-Detect', pjtech: '✅ 58/80mm Plug & Play', moka: '⚠️ Hanya Hardware Resmi', pawoon: '⚠️ Hanya Hardware Resmi', ireap: '✅ Support', qashier: '✅ Hardware Resmi', winner: 'pjtech', highlight: 'Bebas beli printer mana aja' },
  { category: 'Fitur Kunci', feature: 'Offline Mode (PWA)', pjtech: '✅ IndexedDB + Auto Sync', moka: '❌ Online Only', pawoon: '❌ Online Only', ireap: '❌ Online Only', qashier: '❌ Online Only', winner: 'pjtech', highlight: 'Satu-satunya offline-first' },

  { category: 'Dukungan', feature: 'Support Bahasa Indonesia', pjtech: '✅ Native', moka: '✅ Native', pawoon: '✅ Native', ireap: '✅ Native', qashier: '✅ Native', winner: 'tie' },
  { category: 'Dukungan', feature: 'Jam Operasional Support', pjtech: 'Sen-Jum 09-18 WIB', moka: '24/7 (Chat Bot)', pawoon: 'Sen-Sab 09-18', ireap: 'Sen-Jum 09-17', qashier: '24/7 (Chat Bot)', winner: 'moka' },
  { category: 'Dukungan', feature: 'Dokumentasi & Video', pjtech: '✅ Lengkap + YouTube', moka: '✅ Lengkap', pawoon: '✅ Lengkap', ireap: '⚠️ Kurang', qashier: '✅ Lengkap', winner: 'pjtech' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'Harga & Model': <BarChart className="w-5 h-5" />,
  'Vertikal Bisnis': <Globe className="w-5 h-5" />,
  'Fitur Kunci': <Smartphone className="w-5 h-5" />,
  'Dukungan': <HelpCircle className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  'Harga & Model': 'blue',
  'Vertikal Bisnis': 'indigo',
  'Fitur Kunci': 'emerald',
  'Dukungan': 'amber',
};

function CheckIcon({ status, isWinner }: { status: string; isWinner?: boolean }) {
  const hasCheck = status.includes('✅');
  const hasWarn = status.includes('⚠️');
  const hasCross = status.includes('❌');
  
  if (hasCheck) {
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-bold ${
        isWinner ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
      }`}>
        <CheckCircle className="w-5 h-5" />
      </span>
    );
  }
  if (hasWarn) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold">
        <HelpCircle className="w-5 h-5" />
      </span>
    );
  }
  if (hasCross) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold">
        <XCircle className="w-5 h-5" />
      </span>
    );
  }
  return <span className="text-slate-400 text-center w-8 h-8 inline-flex items-center justify-center">−</span>;
}

function WinnerBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">
      <Star className="w-3.5 h-3.5 fill-current" />
      {children}
    </span>
  );
}

function HighlightTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">
      <Sparkles className="w-3 h-3" />
      {children}
    </span>
  );
}

export default function ComparisonPage() {
  const categories = [...new Set(comparisonRows.map(r => r.category))];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Floating Trust Badge */}
      <div className="fixed top-4 right-4 z-50 md:top-8 md:right-8 hidden md:block">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Diupdate: Desember 2024</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Data dari website resmi & review user terverifikasi</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 backdrop-blur-sm mb-8 shadow-sm">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Perbandingan Jujur & Transparan</span>
              <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tanpa Sponsor & Tanpa Bias</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 dark:text-white mb-6 leading-[1.05]">
              Perbandingan <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">POS UMKM Indonesia 2024</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Harga transparan. Fitur lengkap 4 vertikal. Tanpa biaya tersembunyi. Data dari website resmi & review terverifikasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/sign-up?redirect_url=/onboarding" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 min-w-[280px]"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Coba PJTECH Gratis 14 Hari
              </Link>
              <Link 
                href="#detailed-comparison" 
                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 min-w-[280px]"
              >
                Lihat Detail Perbandingan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">82.500</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">/bulan efektif (tahunan)</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">4</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Vertikal bisnis native</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">0</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Biaya tersembunyi</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Export data bebas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Cards - Modern Pricing Card Style */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50" aria-labelledby="competitors-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="competitors-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Ringkasan Cepat 5 Peserta</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Semua harga basis tahunan all-in. Klik card untuk detail.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {competitors.map((c, i) => (
              <article 
                key={c.id} 
                className={`relative group bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 transition-all duration-200 ${
                  c.id === 'pjtech' 
                    ? 'border-blue-500 shadow-xl ring-2 ring-blue-500/20 scale-105 z-10' 
                    : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                    c.id === 'pjtech' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {c.badge}
                  </span>
                </div>

                {/* Logo Area */}
                <div className="text-center mb-5">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    c.id === 'pjtech' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25' : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <span className={`text-2xl font-black ${c.id === 'pjtech' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {c.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{c.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.tagline}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Rp {c.price.toLocaleString('id-ID')}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">{c.period}</span>
                  {c.id === 'pjtech' && (
                    <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">= Rp 82.500/bulan</p>
                  )}
                </div>

                {/* Highlights */}
                <ul className="space-y-3 mb-6">
                  {c.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 ${
                        c.id === 'pjtech' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                      }`}>
                        {c.id === 'pjtech' ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                      </span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {c.id === 'pjtech' ? (
                  <Link href="/sign-up?redirect_url=/onboarding" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                    Mulai Gratis 14 Hari
                  </Link>
                ) : (
                  <button className="block w-full py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium rounded-xl text-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50" disabled>
                    Lihat Detail di Bawah
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Tables - Modern, Scannable, Sticky PJTECH */}
      <section id="detailed-comparison" className="py-20 sm:py-24 bg-white dark:bg-slate-950" aria-labelledby="detailed-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="detailed-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Perbandingan Detail Fitur per Fitur</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Kolom PJTECH <strong className="text-blue-600 dark:text-blue-400">sticky (menempel)</strong> saat scroll horizontal — bandingkan mudah tanpa bolak-balik.</p>
          </div>

          {categories.map((cat, catIndex) => (
            <article key={cat} className="mb-16" aria-labelledby={`cat-${catIndex}`}>
              <header className="mb-6 flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                  categoryColors[cat] === 'blue' ? 'bg-blue-500' :
                  categoryColors[cat] === 'indigo' ? 'bg-indigo-500' :
                  categoryColors[cat] === 'emerald' ? 'bg-emerald-500' :
                  'bg-amber-500'
                }`}>
                  {categoryIcons[cat]}
                </span>
                <h3 id={`cat-${catIndex}`} className="text-2xl font-black text-slate-900 dark:text-white">{cat}</h3>
              </header>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full min-w-[900px] text-sm" role="table">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-4 font-bold text-slate-900 dark:text-white sticky left-0 z-20 bg-slate-50 dark:bg-slate-800/50 w-[280px] min-w-[280px]">Fitur</th>
                      <th className="text-center py-4 px-4 font-bold text-blue-600 dark:text-blue-400 sticky left-[280px] z-20 bg-blue-50 dark:bg-blue-900/20 w-[160px] min-w-[160px] border-l border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-sm">PJ</span>
                          </span>
                          <span className="hidden sm:inline font-medium">PJTECH</span>
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 font-bold text-orange-600 dark:text-orange-400 bg-slate-50 dark:bg-slate-800/50 w-[150px] min-w-[150px]">Moka</th>
                      <th className="text-center py-4 px-4 font-bold text-purple-600 dark:text-purple-400 bg-slate-50 dark:bg-slate-800/50 w-[150px] min-w-[150px]">Pawoon</th>
                      <th className="text-center py-4 px-4 font-bold text-green-600 dark:text-green-400 bg-slate-50 dark:bg-slate-800/50 w-[150px] min-w-[150px]">iReap</th>
                      <th className="text-center py-4 px-4 font-bold text-red-600 dark:text-red-400 bg-slate-50 dark:bg-slate-800/50 w-[150px] min-w-[150px]">Qashier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {comparisonRows.filter(r => r.category === cat).map((row, i) => (
                      <tr key={`${cat}-${i}`} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${row.winner === 'pjtech' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <td className="py-4 px-4 font-medium text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 w-[280px] min-w-[280px]">
                          <div className="flex items-center gap-2">
                            {row.winner === 'pjtech' && (
                              <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              </span>
                            )}
                            <span>{row.feature}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-medium text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20 border-l border-slate-200 dark:border-slate-700 w-[160px] min-w-[160px] sticky left-[280px] z-10 bg-white dark:bg-slate-900">
                          <div className="flex flex-col items-center gap-1">
                            <CheckIcon status={row.pjtech} isWinner={row.winner === 'pjtech'} />
                            {row.highlight && <HighlightTag>{row.highlight}</HighlightTag>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-300 w-[150px] min-w-[150px]"><CheckIcon status={row.moka} /></td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-300 w-[150px] min-w-[150px]"><CheckIcon status={row.pawoon} /></td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-300 w-[150px] min-w-[150px]"><CheckIcon status={row.ireap} /></td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-300 w-[150px] min-w-[150px]"><CheckIcon status={row.qashier} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden mt-4 space-y-3">
                {comparisonRows.filter(r => r.category === cat).map((row, i) => (
                  <div key={`${cat}-mobile-${i}`} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <p className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      {row.winner === 'pjtech' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {row.feature}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-center">
                        <p className="font-bold text-blue-600 dark:text-blue-400 mb-1">PJTECH</p>
                        <CheckIcon status={row.pjtech} isWinner={row.winner === 'pjtech'} />
                        {row.highlight && <HighlightTag>{row.highlight}</HighlightTag>}
                      </div>
                      <div className="p-2 rounded-lg text-center bg-slate-50 dark:bg-slate-700/50"><p className="font-medium text-orange-600 dark:text-orange-400 mb-1">Moka</p><CheckIcon status={row.moka} /></div>
                      <div className="p-2 rounded-lg text-center bg-slate-50 dark:bg-slate-700/50"><p className="font-medium text-purple-600 dark:text-purple-400 mb-1">Pawoon</p><CheckIcon status={row.pawoon} /></div>
                      <div className="p-2 rounded-lg text-center bg-slate-50 dark:bg-slate-700/50"><p className="font-medium text-green-600 dark:text-green-400 mb-1">iReap</p><CheckIcon status={row.ireap} /></div>
                      <div className="p-2 rounded-lg text-center bg-slate-50 dark:bg-slate-700/50"><p className="font-medium text-red-600 dark:text-red-400 mb-1">Qashier</p><CheckIcon status={row.qashier} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {/* Legend */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Legenda:</span>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <CheckIcon status="✅" />
              <span>Ya / Lengkap</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <CheckIcon status="⚠️" />
              <span>Terbatas / Workaround</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <CheckIcon status="❌" />
              <span>Tidak Ada</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 ml-2">
              <WinnerBadge>Pemenang kategori</WinnerBadge>
            </div>
          </div>
        </div>
      </section>

      {/* Why PJTECH Wins - Modern Feature Grid */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="why-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">Kenapa 1000+ UMKM Pilih PJTECH?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Bukan cuma harga — tapi <strong className="text-slate-900 dark:text-white">value total</strong> yang diterima setiap hari.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: TrendingUp, 
                iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                title: 'ROI Tercepat di Kelasnya', 
                desc: 'Break-even bulan 1. Harga Rp 990rb/tahun = Rp 82.500/bln. Cukup 1 transaksi harian sudah cover biaya langganan.',
                metric: 'Rp 82.500/bln'
              },
              { 
                icon: Shield, 
                iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                title: 'Zero Vendor Lock-in', 
                desc: 'Export data kapan saja (CSV/Excel). Tidak terikat hardware proprietary. Pindah ke sistem lain? Data siap pakai tanpa DRM.',
                metric: 'Bebas 100%'
              },
              { 
                icon: Users, 
                iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                title: 'Dibangun untuk UMKM Indonesia', 
                desc: 'Bukan adaptasi dari luar. Paham PPN Indonesia, Jurnal.id, Accurate, Xero, GoFood, GrabFood, WA Cloud API resmi.',
                metric: 'Lokal 100%'
              },
              { 
                icon: Zap, 
                iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                title: 'Fitur Enterprise Harga UMKM', 
                desc: 'KDS, Multi-cabang, WA API, Offline mode, Prorata rental, Import Excel — semuanya included tanpa upgrade atau add-on.',
                metric: 'All-in One Price'
              },
              { 
                icon: Award, 
                iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                title: 'Update Mingguan, Bukan Tahunan', 
                desc: 'Feedback user hari ini → fitur baru minggu depan. Bukan roadmap 6 bulan seperti kompetitor enterprise yang lambat.',
                metric: '52+ release/tahun'
              },
              { 
                icon: CheckCircle, 
                iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
                title: 'Support Paham Bisnis Nyata', 
                desc: 'Tim support paham operational toko/restoran/bengkel/rental. Bukan cuma baca script FAQ. Bisa bantu setup workflow bisnis Anda.',
                metric: 'Response < 2 jam'
              },
            ].map((item, i) => (
              <article key={i} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{item.desc}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${item.iconBg.replace('bg-', 'bg-').replace('text-', 'text-').replace('dark:bg-', 'dark:bg-').replace('dark:text-', 'dark:text-')}`}>
                    {item.metric}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800" aria-labelledby="proof-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="proof-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Dipercaya Ribuan UMKM Se-Indonesia</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Dari warung pojok hingga rantai toko multi-cabang.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: 'Owner Kafe', name: 'Budi S.', location: 'Bandung', quote: 'Setup 10 menit langsung jalan. KDS di HP tablet kami ganti dari Moka yang bayar Rp 500rb/bln. Sekarang gratis selamanya.', metric: 'Hemat Rp 6jt/tahun' },
              { role: 'Owner Bengkel', name: 'Agus W.', location: 'Surabaya', quote: 'Fitur booking servis + WA notif otomatis game changer. Pelanggan tau status motor real-time. Komisi mekanik otomatis hitung.', metric: 'Zero keluhan pelanggan' },
              { role: 'Owner Rental Mobil', name: 'Sari D.', location: 'Jakarta', quote: 'Kalender booking visual anti bentrok + invoice prorata otomatis. Sebelumnya manual Excel rapih. Sekarang 1 orang kelola 20 unit.', metric: 'Efisiensi 80%' },
            ].map((t, i) => (
              <article key={i} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.role} · {t.location}</p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">
                    <TrendingUp className="w-3 h-3" />
                    {t.metric}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Pertanyaan Umum</h2>
            <p className="text-slate-600 dark:text-slate-400">Sebelum memutuskan, baca jawaban pertanyaan paling sering ditanyakan.</p>
          </div>

          <dl className="space-y-4" role="list">
            {[
              { q: 'Apakah data saya aman & bisa diekspor kapan saja?', a: 'Ya. Data 100% milik Anda. Export CSV/Excel satu klik dari dashboard. Tidak ada vendor lock-in, tidak ada format proprietary. Anda bebas pindah kapan pun.' },
              { q: 'Apakah benar-benar bisa offline tanpa internet?', a: 'Ya. PJTECH menggunakan PWA + IndexedDB. Transaksi tetap tersimpan lokal saat internet putus, lalu auto-sync ke cloud begitu koneksi pulih. Cocok untuk area sinyal lemah.' },
              { q: 'Printer thermal apa saja yang didukung?', a: 'Semua printer Bluetooth 58mm & 80mm (ESC/POS). Auto-detect tanpa driver. Bisa pakai printer murah Rp 300an ribu — tidak wajib beli hardware resmi kami.' },
              { q: 'Bagaimana cara migrasi dari Moka/Pawoon/iReap?', a: 'Sediakan template Excel standar. Export data produk/pelanggan dari sistem lama → import ke PJTECH via menu Import Excel. Proses < 10 menit. Tim kami bantu remote jika perlu.' },
              { q: 'Apakah KDS benar-benar gratis tanpa batas device?', a: 'Ya. Buka browser di HP/tablet Android/iOS → masuk mode KDS. Tidak perlu beli hardware khusus, tidak ada batas jumlah device, tidak ada fee bulanan tambahan.' },
              { q: 'Integrasi GoFood/GrabFood pakai API resmi?', a: 'Ya. PJTECH menggunakan Official Merchant API dari GoFood & GrabFood. Bukan middleware/third-party. Artinya: stabil, real-time, dan aman dari blokir akun merchant.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <dt className="px-6 py-4 font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  {faq.q}
                </dt>
                <dd className="px-6 py-4 text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Siap Mulai Digitalisasi Bisnis <span className="bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">Hari Ini?</span>
          </h2>
          <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">Gratis 14 hari penuh. Setup 5 menit dengan template Excel. Tidak perlu kartu kredit. Batalkan kapan saja tanpa syarat.</p>
          <Link 
            href="/sign-up?redirect_url=/onboarding" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all shadow-2xl text-lg"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-blue-200 text-sm">Sudah punya akun? <a href="/sign-in" className="underline hover:text-white font-medium">Masuk di sini</a></p>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Data perbandingan berdasarkan website resmi, review pengguna terverifikasi, & pengujian hands-on tim PJTECH per Desember 2024.</p>
          <p className="mt-1">Harga & fitur kompetitor dapat berubah. Verifikasi langsung di website masing-masing vendor sebelum keputusan beli.</p>
          <p className="mt-3"><Link href="/solusi" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Lihat Solusi per Vertikal →</Link></p>
        </div>
      </footer>
    </main>
  );
}
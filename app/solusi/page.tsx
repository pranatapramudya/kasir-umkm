import { Metadata } from 'next';
import Link from 'next/link';
import { Store, UtensilsCrossed, Wrench, Home, ArrowRight, CheckCircle, BarChart, Users, Smartphone, Globe, Shield, Zap, Star, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solusi POS per Vertikal Bisnis - Retail, F&B, Jasa, Rental | PJTECH',
  description: 'Solusi kasir PJTECH untuk 4 vertikal UMKM: Retail (toko/fashion), F&B (restoran/kafe), Jasa (bengkel/laundry), Rental (mobil/villa/alat berat). Setiap vertikal native, bukan workaround.',
  keywords: ['POS retail', 'POS F&B', 'POS jasa servis', 'POS rental', 'aplikasi kasir per industri', 'solusi UMKM per vertikal'],
  openGraph: {
    title: 'Solusi POS per Vertikal - Retail, F&B, Jasa, Rental/Properti',
    description: '4 vertikal native dalam 1 platform. Retail, F&B, Jasa, Rental. Mulai Rp 990rb/tahun all-in.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi',
    images: ['/og-solusi.png'],
  },
};

const verticals = [
  {
    slug: 'retail',
    icon: Store,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    title: 'Retail',
    subtitle: 'Toko Kelontong, Fashion, Minimarket',
    description: 'Multi-varian (ukuran/warna), barcode/SKU, stok otomatis, diskon fleksibel, PPN, cetak struk & label harga.',
    highlights: ['Multi-varian unlimited', 'Barcode scanner HP/Bluetooth', 'Stok real-time + alert minimum', 'PPN include/exclude + ekspor akuntan', 'Multi-cabang native SaaS', 'Printer Bluetooth 58/80mm auto-detect'],
    cta: 'Lihat Detail Retail',
  },
  {
    slug: 'fnb',
    icon: UtensilsCrossed,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    title: 'F&B',
    subtitle: 'Restoran, Kafe, Warung Makan',
    description: 'Manajemen meja, KDS (dapur), modifier menu, split bill, resep & bahan baku (HPP). Integrasi ojol roadmap Q1 2027.',
    highlights: ['KDS gratis di HP/Tablet (tanpa batas device)', 'Manajemen meja visual + QR Order', 'Modifier (level pedas, topping, dll)', 'Resep & bahan baku (auto HPP)', 'Split bill, open bill, void item', 'Integrasi ojol: Roadmap Q1 2027'],
    cta: 'Lihat Detail F&B',
  },
  {
    slug: 'jasa',
    icon: Wrench,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    title: 'Jasa / Servis',
    subtitle: 'Bengkel, Laundry, Salon, Service Elektronik',
    description: 'Booking antrian, tracking progress (pending/dikerjakan/selesai), notifikasi WA otomatis, komisi teknisi, histori servis pelanggan.',
    highlights: ['Booking & antrian digital', 'Tracking status pekerjaan real-time', 'WA notifikasi otomatis (5 trigger)', 'Komisi teknisi/mekanik otomatis', 'Histori servis per pelanggan', 'Jadwal teknisi & kapasitas harian'],
    cta: 'Lihat Detail Jasa',
  },
  {
    slug: 'rental',
    icon: Home,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    title: 'Rental / Properti / Alat & Barang',
    subtitle: 'Mobil, Villa, Kamera, Alat Berat, Peralatan Bangunan',
    description: 'Kalender booking visual, deposit, invoice prorata, denda keterlambatan, multi-unit (mobil/kamar/unit alat), cek ketersediaan real-time.',
    highlights: ['Kalender booking visual anti bentrok', 'Deposit & prorata otomatis', 'Multi-unit: mobil, kamar, alat berat', 'Denda keterlambatan otomatis', 'Invoice detail unit/alat barang', 'Cocok: rental kendaraan, properti, alat konstruksi'],
    cta: 'Lihat Detail Rental',
  },
];

const trustMetrics = [
  { label: 'Harga All-in', value: 'Rp 990rb/thn', desc: 'Tanpa biaya tersembunyi' },
  { label: 'Vertikal Native', value: '4', desc: 'Bukan workaround' },
  { label: 'UMKM Aktif', value: '1000+', desc: 'Se-Indonesia' },
  { label: 'Update', value: 'Mingguan', desc: 'Bukan roadmap 6 bln' },
];

export default function SolusiPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs sm:text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/comparison" className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Bandingkan
            </Link>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:from-emerald-700 hover:to-blue-700 transition-all">
              <span>Coba Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24 lg:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 backdrop-blur-sm mb-4 sm:mb-6 shadow-sm">
              <Star className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Satu Platform, 4 Vertikal Native</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-4 sm:mb-6 leading-tight">
              Solusi POS Khusus <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-blue-600 bg-clip-text text-transparent">Tiap Industri UMKM</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Bukan software "satu ukuran untuk semua" yang dipaksa seragam. Setiap modul dirancang khusus untuk workflow nyata: scan kasir kilat, monitor dapur KDS, tracking antrean servis, hingga kalender rental mobil & villa anti-bentrok.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-14">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:from-emerald-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/comparison" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <span>Bandingkan vs Kompetitor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto">
              {trustMetrics.map((m, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{m.value}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Cards */}
      <section className="py-12 sm:py-20 md:py-24 bg-white dark:bg-slate-950" aria-labelledby="verticals-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 id="verticals-heading" className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 sm:mb-4">Pilih Vertikal Bisnis Anda</h2>
            <p className="text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Setiap vertikal dibangun dari nol untuk workflow operasional spesifik industri tersebut.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {verticals.map((v, i) => (
              <article key={v.slug} className="group relative bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all h-full flex flex-col">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 ${v.iconBg}`}>
                  <v.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">{v.subtitle}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-5 leading-relaxed flex-1">{v.description}</p>

                <ul className="space-y-2 mb-5 sm:mb-6 flex-1">
                  {v.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-emerald-500" />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/solusi/${v.slug}`} className="w-full py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl text-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-center gap-2">
                  <span>{v.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Native Matters */}
      <section className="py-12 sm:py-20 md:py-24 bg-slate-50 dark:bg-slate-900/50" aria-labelledby="native-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 id="native-heading" className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 sm:mb-4">Kenapa <strong className="text-blue-600 dark:text-blue-400">Native</strong> Bukan Workaround?</h2>
            <p className="text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Kompetitor "tambah fitur" — kami "bangun dari nol" untuk setiap vertikal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: BarChart, iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', title: 'Database & Schema Khusus', desc: 'Setiap vertikal punya schema Prisma sendiri: varian produk (retail), resep bahan baku (F&B), tracking pekerjaan (jasa), kalender booking (rental). Tidak ada kolom kosong/terbuang.' },
              { icon: Users, iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', title: 'UX untuk Operator Nyata', desc: 'Kasir toko butuh scan cepat. Kasir restoran butuh split bill. Teknisi bengkel butuh update status. UI disesuaikan per role — bukan satu dashboard untuk semua.' },
              { icon: Shield, iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', title: 'Kompliance & Integrasi Lokal', desc: 'PPN Indonesia, Jurnal.id, WA Cloud API Meta. Semua native per vertikal — tidak perlu middleware mahal & rapuh.' },
            ].map((item, i) => (
              <article key={i} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${item.iconBg}`}>
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison CTA */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden" aria-labelledby="compare-heading">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 id="compare-heading" className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4">
            Ingin Bandingkan Detail vs Moka, Pawoon, iReap, Qashier?
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-8">Lihat perbandingan fitur per fitur, harga transparan, & keunggulan PJTECH di halaman comparison.</p>
          <Link href="/comparison" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all shadow-2xl text-sm sm:text-lg">
            <span>Lihat Perbandingan Lengkap</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p>Setiap vertikal termasuk dalam harga Rp 990.000/tahun — tidak ada upgrade, add-on, atau biaya per modul.</p>
          <p className="mt-2"><Link href="/sign-up?redirect_url=/onboarding" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Mulai Gratis 14 Hari →</Link></p>
        </div>
      </footer>
    </main>
  );
}
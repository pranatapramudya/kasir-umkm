import { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, ClipboardList, Truck, CalendarClock, MessageSquare, History, CheckCircle, ArrowRight, Users, Settings, ArrowLeft } from 'lucide-react';

const jasaSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PJTech POS Jasa/Servis",
  "description": "Aplikasi kasir Jasa untuk bengkel, laundry, salon, service elektronik. Booking, tracking, notifikasi WA, invoice jasa+sparepart.",
  "brand": { "@type": "Brand", "name": "PJTECH" },
  "offers": { "@type": "Offer", "price": "990000", "priceCurrency": "IDR", "availability": "https://schema.org/InStock" },
  "category": "Business Software",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "76" }
};

export const metadata: Metadata = {
  title: 'POS Jasa/Servis UMKM - Bengkel, Laundry, Salon, Service Elektronik | PJTECH',
  description: 'Aplikasi kasir Jasa terbaik: booking antrian, estimasi biaya, progress tracking, notifikasi WA, invoice jasa+sparepart, histori servis per pelanggan. Mulai Rp 990rb/tahun.',
  keywords: ['POS bengkel', 'kasir laundry', 'aplikasi salon', 'software service elektronik', 'tracking servis', 'booking antrian bengkel'],
  openGraph: {
    title: 'POS Jasa/Servis UMKM - Solusi Kasir Bengkel, Laundry, Salon, Service',
    description: 'Booking antrian, tracking progres, notifikasi WA, invoice jasa+sparepart. Mulai Rp 990rb/tahun.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/solusi/jasa',
    images: ['/og-jasa.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(jasaSchema),
  }
};

const features = [
  { icon: CalendarClock, title: 'Booking & Antrian Online', desc: 'Pelanggan booking via WA/Web, antrian real-time, estimasi selesai, reminder otomatis H-1 & H hari' },
  { icon: ClipboardList, title: 'Estimasi & Progress Tracking', desc: 'Estimasi biaya jasa+sparepart, status: menunggu/dikerjakan/selesai/diambil, timeline foto bukti kerusakan' },
  { icon: MessageSquare, title: 'Notifikasi WhatsApp Otomatis', desc: 'Konfirmasi booking, update status, panggil ambil, invoice, follow-up rating — semua via WA API' },
  { icon: History, title: 'Histori Servis per Pelanggan', desc: 'Riwayat lengkap: keluhan, sparepart diganti, biaya, teknisi, foto before/after. Cari by plat nomor/nama/HP' },
  { icon: Users, title: 'Manajemen Teknisi & Komisi', desc: 'Jadwal shift teknisi, komisi per jasa/sparepart, leaderboard performa, gaji otomatis' },
  { icon: Settings, title: 'Sparepart & Inventaris', desc: 'Stok sparepart terpisah dari jasa, HPP, minimum stok, supplier, pembelian, retur rusak' },
];

const comparison = [
  { fitur: 'Harga/Tahun', pjtech: 'Rp 990.000', kompetitor: 'Rp 1.500.000 - 4.000.000' },
  { fitur: 'Booking Online', pjtech: '✅ Web + WA', kompetitor: '❌ Manual/Telepon' },
  { fitur: 'Progress Tracking', pjtech: '✅ Real-time + Foto', kompetitor: '⚠️ Catatan kertas' },
  { fitur: 'Notifikasi WA', pjtech: '✅ Otomatis 5 trigger', kompetitor: '❌ Manual ketik' },
  { fitur: 'Histori per Pelanggan', pjtech: '✅ Lengkap + Foto', kompetitor: '⚠️ Hanya transaksi' },
  { fitur: 'Komisi Teknisi', pjtech: '✅ Otomatis + Slip Gaji', kompetitor: '❌ Hitung manual' },
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 max-w-full leading-snug">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="truncate">Khusus Jasa: Bengkel, Laundry, Salon & Barbershop, Servis Elektronik</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
              POS Jasa/Servis <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Yang Bikin Pelanggan Yakin</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Dari bengkel motor sampai laundry kiloan — pantau antrean pengerjaan teknisi, kirim notifikasi WhatsApp otomatis, dan hitung komisi staf secara transparan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link href="/solusi/jasa#fitur" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Notifikasi WhatsApp</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Jasa + Sparepart</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Rekap Komisi Teknisi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="py-12 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Fitur Lengkap untuk Jasa & Servis</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Transparan ke pelanggan, efisien buat teknisi, dan terdata rapi untuk pemilik bisnis.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-4.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">Mengapa Bengkel & Jasa Pilih PJTECH?</h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">Pantau status pengerjaan, nota gabungan jasa & suku cadang, serta komisi otomatis.</p>
          </div>

          <p className="sm:hidden text-[11px] text-slate-500 text-center mb-3 font-semibold flex items-center justify-center gap-1.5">
            <span>↔️</span> Geser ke samping untuk melihat tabel
          </p>

          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full min-w-[520px] sm:min-w-[600px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-emerald-600">PJTECH</th>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12">Tanya Jawab Umum Jasa/Servis</h2>
          <dl className="space-y-3.5 sm:space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Apakah sistem bisa membedakan tarif jasa pengerjaan dan harga sparepart?', a: 'Ya, nota kasir menggabungkan secara rapi ongkos jasa mekanik dan harga suku cadang yang terpasang dengan kalkulasi subtotal yang jelas.' },
              { q: 'Bagaimana cara mengirim notifikasi WhatsApp saat servis selesai?', a: 'Saat mekanik atau staf mengubah status servis menjadi "Siap Diambil", tombol kirim WhatsApp otomatis terisi pesan template resmi untuk pelanggan tanpa perlu ketik manual.' },
              { q: 'Bisa mencatat riwayat servis berdasarkan nomor polisi/plat kendaraan?', a: 'Bisa! Cukup ketik nomor polisi atau nomor HP pelanggan, sistem akan menampilkan riwayat perbaikan sebelumnya dan catatan part yang pernah diganti.' },
              { q: 'Apakah ada laporan komisi bagi hasil untuk staf/mekanik?', a: 'Ya, Anda bisa menentukan persentase atau nominal bagi hasil tetap per jenis jasa. Laporan komisi per teknisi dapat diekspor langsung per periode.' }
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Tingkatkan Kepercayaan Pelanggan Jasa Anda</h2>
          <p className="text-xs sm:text-base md:text-lg text-emerald-100 mb-6 sm:mb-8">Kelola antrean servis dan kirim notifikasi WhatsApp otomatis mulai hari ini.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-emerald-700 font-bold text-sm sm:text-base rounded-xl hover:bg-emerald-50 transition-all shadow-xl">
            <span>Mulai Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PJTECH POS Jasa & Servis. Semua fitur sudah all-in Rp 990rb/tahun.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-600 font-semibold">Beranda</Link>
            <Link href="/solusi" className="hover:text-emerald-600 font-semibold">Solusi Lain</Link>
            <Link href="/comparison" className="hover:text-emerald-600 font-semibold">Bandingkan</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
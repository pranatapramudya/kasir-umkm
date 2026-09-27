import { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, ClipboardList, Truck, CalendarClock, MessageSquare, History, CheckCircle, ArrowRight, Users, Settings } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
              Khusus Jasa: Bengkel, Laundry, Salon, Service AC/Kulkas/HP
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
              POS Jasa/Servis <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Yang Bikin Pelanggan Yakin</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Dari bengkel motor sampai laundry kiloan — kelola booking, tracking progres, notifikasi WA, dan histori pelanggan dalam satu aplikasi. Pelanggan tahu status servisnya tanpa perlu tanya-tanya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/sign-up?redirect_url=/onboarding" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
                Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solusi/jasa#fitur" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2">
                Lihat Fitur Lengkap
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Gratis 14 hari</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> WA API included</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Komisi teknisi auto</span>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Fitur Lengkap untuk Jasa Modern</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Transparan ke pelanggan, efisien buat teknisi, untung buat owner.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-green-600" />
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
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Mengapa Jasa/Servis Pilih PJTECH?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Tracking real-time, WA otomatis, histori lengkap — kompetitor nggak punya.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-4 font-bold text-green-600">PJTECH</th>
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
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Tanya Jawab Umum Jasa/Servis</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'Bisa untuk bengkel motor & mobil sekaligus?', a: 'Bisa. Setup kategori: Servis Ringan, Servis Berkala, Ganti Oli, Ban, AC, Body Repair. Tiap kategori beda estimasi waktu & komisi teknisi.' },
              { q: 'Notifikasi WA butuh nomor resmi (Business API)?', a: 'Ya, pakai Meta WhatsApp Cloud API (resmi). Kami bantu setup verified business name (badge hijau). Biaya WA API dibayar ke Meta (gratis 1000 percakapan/bln).' },
              { q: 'Histori servis bisa foto before/after?', a: 'Bisa. Teknisi upload foto kerusakan & hasil perbaikan via HP. Masuk ke histori pelanggan otomatis. Bisa print/invoice sertakan foto.' },
              { q: 'Komisi teknisi otomatis hitung gaji?', a: 'Ya. Set tiap jasa: komisi persen/flat. Setiap sparepart: komisi flat. Akhir bulan generate slip gaji teknisi otomatis (gaji pokok + komisi - potongan).' },
              { q: 'Support multi-cabang bengkel?', a: 'Bisa. Satu Owner kelola banyak cabang. Stok sparepart bisa terpusat atau per cabang. Teknisi assign per cabang. Laporan konsolidasi otomatis.' },
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

      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Siap Bikin Bengkel/Salon Transparan & Efisien?</h2>
          <p className="text-green-100 mb-8 text-lg">Join 200+ bengkel, laundry, salon yang sudah pindah ke PJTECH. WA API included, komisi auto, gratis 14 hari.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
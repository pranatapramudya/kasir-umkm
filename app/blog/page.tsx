import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight, Clock, CheckCircle, ExternalLink } from 'lucide-react';

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog PJTECH Kasir UMKM",
  "description": "Panduan POS UMKM, tips digitalisasi, update fitur terbaru",
  "url": "https://www.pjtechumkm.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "PJTECH"
  }
};

const posts = [
  {
    slug: 'cara-pilih-pos-umkm-2024',
    title: 'Cara Memilih Aplikasi Kasir (POS) Terbaik untuk UMKM Indonesia 2024',
    excerpt: 'Panduan lengkap memilih POS: harga, fitur vertikal, integrasi, support. Termasuk checklist 15 poin wajib cek sebelum bayar.',
    category: 'Panduan',
    readTime: '8 menit',
    date: '2026-09-15',
    tags: ['POS UMKM', 'Panduan', 'Tips Bisnis'],
    featured: true,
  },
  {
    slug: 'pos-fnb-kds-ojol-terbaik',
    title: 'POS F&B Terbaik: KDS Included + Integrasi GoFood/GrabFood Native',
    excerpt: 'Kenapa restoran & kafe pindah ke PJTECH: KDS gratis di HP, order ojol masuk otomatis ke dapur, split bill fleksibel. Hemat signifikan vs kompetitor.',
    category: 'F&B',
    readTime: '6 menit',
    date: '2026-09-10',
    tags: ['POS F&B', 'KDS', 'GoFood', 'GrabFood', 'Restoran'],
    featured: true,
  },
  {
    slug: 'pos-jasa-bengkel-laundry-tracking-wa',
    title: 'POS Jasa/Servis: Tracking Progres + Notifikasi WA Otomatis',
    excerpt: 'Bengkel, laundry, salon butuh tracking transparan. PJTECH: booking online, progress real-time, WA auto ke pelanggan, komisi teknisi otomatis. Mulai Rp 990rb/th.',
    category: 'Jasa/Servis',
    readTime: '7 menit',
    date: '2026-09-05',
    tags: ['POS Bengkel', 'POS Laundry', 'POS Salon', 'Tracking Servis', 'WhatsApp API'],
    featured: false,
  },
  {
    slug: 'pos-rental-mobil-villa-kalender-deposit',
    title: 'POS Rental/Travel/Properti: Kalender Booking + Deposit/Denda Otomatis',
    excerpt: 'Rental mobil, villa, apartemen, alat butuh kalender visual & perhitungan otomatis. PJTECH: drag-drop booking, deposit/denda auto, invoice prorata, kontrak digital.',
    category: 'Rental/Properti',
    readTime: '6 menit',
    date: '2026-08-28',
    tags: ['POS Rental Mobil', 'Booking Villa', 'Sewa Apartemen', 'Invoice Prorata', 'Kontrak Digital'],
    featured: true,
  },
  {
    slug: 'import-produk-excel-template-vertikal',
    title: 'Import Produk via Excel: Template Siap Pakai per Vertikal',
    excerpt: 'Tidak perlu input manual satu-satu. PJTECH sediakan template Excel standar untuk Retail, F&B (3 template), Jasa, dan Rental. Upload sekali, langsung jualan.',
    category: 'Tips',
    readTime: '5 menit',
    date: '2026-08-20',
    tags: ['Import Excel', 'Template Produk', 'Setup Cepat', 'Migrasi Data'],
    featured: false,
  },
  {
    slug: 'offline-mode-pwa-umkm-indonesia',
    title: 'Mode Offline PWA: Transaksi Tetap Jalan Saat Internet Mati',
    excerpt: 'PJTECH pakai IndexedDB untuk offline-first. Kasir tetap bisa transaksi, data tersimpan lokal, auto-sync begitu internet nyala. Cocok area sinyal lemah.',
    category: 'Teknis',
    readTime: '4 menit',
    date: '2026-08-15',
    tags: ['Offline Mode', 'PWA', 'IndexedDB', 'Sinkronisasi Data'],
    featured: false,
  },
];

export const metadata: Metadata = {
  title: 'Blog PJTECH - Panduan POS UMKM, Tips Bisnis, Update Fitur',
  description: 'Blog resmi PJTECH: Panduan memilih POS UMKM, tips digitalisasi toko/restoran/bengkel/rental, update fitur terbaru. Ditulis untuk pemilik UMKM Indonesia.',
  keywords: ['blog POS UMKM', 'tips digitalisasi UMKM', 'panduan aplikasi kasir', 'bisnis UMKM Indonesia', 'update fitur PJTECH'],
  openGraph: {
    title: 'Blog PJTECH - Panduan & Tips POS untuk UMKM Indonesia',
    description: 'Panduan memilih POS, tips bisnis, update fitur terbaru PJTECH.',
    type: 'website',
    url: 'https://www.pjtechumkm.com/blog',
    images: ['/og-blog.png'],
  },
  other: {
    'script:ld+json': JSON.stringify(blogSchema),
  }
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Blog <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PJTECH</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Panduan memilih POS, tips digitalisasi UMKM, update fitur terbaru, & tutorial praktis.
            Ditulis untuk pemilik toko, restoran, bengkel, rental di Indonesia.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {posts.filter(p => p.featured).map((post) => (
              <article key={post.slug} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{post.category}</span>
                    <time className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" /> {post.readTime}
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline flex items-center gap-1">
                      Baca selengkapnya <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-8">Semua Artikel</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{post.category}</span>
                    <time className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug flex-1">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1 mt-auto">
                    Baca <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Mau Update Fitur & Tips Terbaru?</h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">Dapatkan panduan POS UMKM, tutorial, & update fitur PJTECH langsung ke email. No spam, cuma value.</p>
            <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
              Coba PJTECH Gratis 14 Hari <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
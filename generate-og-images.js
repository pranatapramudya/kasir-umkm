#!/usr/bin/env node
// generate-og-images.js
// Generates OG image SVGs for all pages - convert to PNG via sharp/imagemagick later

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');

const pages = [
  {
    filename: 'og-retail.png',
    title: 'POS Retail UMKM',
    subtitle: 'Toko Kelontong, Fashion, Minimarket',
    features: ['Multi-Varian', 'Barcode Scanner', 'Stok Otomatis', 'PPN & Laporan'],
    color: '#2563eb',
    accent: '#3b82f6'
  },
  {
    filename: 'og-fnb.png',
    title: 'POS F&B UMKM',
    subtitle: 'Restoran, Kafe, Warung Makan',
    features: ['KDS Included', 'Split Bill', 'Modifier Resep', 'Roadmap Ojol Q1 2027'],
    color: '#ea580c',
    accent: '#f97316'
  },
  {
    filename: 'og-jasa.png',
    title: 'POS Jasa/Servis UMKM',
    subtitle: 'Bengkel, Laundry, Salon, Service',
    features: ['Booking Online', 'Tracking Real-time', 'WA Otomatis', 'Komisi Teknisi'],
    color: '#16a34a',
    accent: '#22c55e'
  },
  {
    filename: 'og-rental.png',
    title: 'POS Rental/Travel/Properti',
    subtitle: 'Mobil, Villa, Apartemen, Alat',
    features: ['Kalender Visual', 'Deposit & Denda Auto', 'Invoice Prorata', 'Kontrak Digital'],
    color: '#9333ea',
    accent: '#a855f7'
  },
  {
    filename: 'og-comparison.png',
    title: 'Perbandingan POS UMKM 2024',
    subtitle: 'PJTECH vs Moka vs Pawoon vs iReap vs Qashier',
    features: ['Harga Transparan', 'Fitur Lengkap', '4 Vertikal', 'All-In One Price'],
    color: '#0f172a',
    accent: '#1e293b'
  },
  {
    filename: 'og-blog.png',
    title: 'Blog PJTECH',
    subtitle: 'Panduan POS, Tips Bisnis, Case Study',
    features: ['Panduan Beli POS', 'F&B KDS Guide', 'Jasa Tracking', 'Rental Kalender'],
    color: '#0369a1',
    accent: '#0284c7'
  },
  {
    filename: 'og-blog-cara-pilih-pos-umkm-2024.png',
    title: 'Cara Memilih POS UMKM 2024',
    subtitle: 'Checklist 15 Poin Wajib Cek Sebelum Bayar',
    features: ['Harga Transparan', 'Fitur Vertikal', 'TCO Calculator', 'Red Flags'],
    color: '#0369a1',
    accent: '#0284c7'
  },
  {
    filename: 'og-blog-pos-fnb-kds-ojol-terbaik.png',
    title: 'POS F&B: KDS + Order Ojol Manual',
    subtitle: 'Hemat Rp 6jt+/bln vs Kompetitor',
    features: ['KDS Gratis', 'Split Bill Fleksibel', 'Modifier Stok', 'Roadmap Ojol Q1 2027'],
    color: '#ea580c',
    accent: '#f97316'
  },
  {
    filename: 'og-blog-pos-rental-mobil-villa-kalender-deposit.png',
    title: 'POS Rental: Kalender + Deposit Auto',
    subtitle: '0 Double Booking, Denda Otomatis, Prorata',
    features: ['Drag-Drop Booking', 'Deposit & Denda Auto', 'Invoice Prorata', 'Kontrak Digital'],
    color: '#9333ea',
    accent: '#a855f7'
  }
];

function escapeXml(str) {
  return str.replace(/&/g, '\u0026amp;');
}

function generateSVG(page) {
  const { title, subtitle, features, color, accent } = page;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="8" fill="url(#accentBar)"/>
  
  <!-- Left accent stripe -->
  <rect x="0" y="0" width="12" height="630" fill="url(#accentBar)"/>
  
  <!-- Logo area -->
  <circle cx="100" cy="80" r="36" fill="${color}"/>
  <text x="100" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" fill="white" text-anchor="middle">PJ</text>
  <text x="100" y="135" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">KASIR UMKM</text>
  
  <!-- Main content -->
  <text x="200" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="900" fill="#0f172a" text-anchor="start">${safeTitle}</text>
  <text x="200" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#475569" text-anchor="start">${safeSubtitle}</text>
  
  <!-- Price badge -->
  <rect x="200" y="190" width="280" height="48" rx="12" fill="${color}"/>
  <text x="340" y="222" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="white" text-anchor="middle">Mulai Rp 990rb/tahun</text>
  <text x="340" y="242" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="rgba(255,255,255,0.8)" text-anchor="middle">All-in • Gratis 14 hari</text>
  
  <!-- Features grid -->
  <g font-family="system-ui, -apple-system, sans-serif">
    ${features.map((feat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 200 + col * 350;
      const y = 310 + row * 80;
      return `
        <rect x="${x}" y="${y}" width="300" height="60" rx="12" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
        <circle cx="${x + 30}" cy="${y + 30}" r="16" fill="${color}20"/>
        <text x="${x + 30}" y="${y + 35}" font-size="16" font-weight="700" fill="${color}" text-anchor="middle">✓</text>
        <text x="${x + 65}" y="${y + 36}" font-size="15" font-weight="600" fill="#1e293b">${escapeXml(feat)}</text>
      `;
    }).join('')}
  </g>
  
  <!-- CTA -->
  <rect x="200" y="490" width="480" height="56" rx="16" fill="url(#accentBar)"/>
  <text x="440" y="526" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" fill="white" text-anchor="middle">Coba Gratis 14 Hari →</text>
  
  <!-- Bottom info -->
  <text x="1100" y="600" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#94a3b8" text-anchor="end">pjtechumkm.com • #1 POS UMKM Indonesia</text>
  
  <!-- Decorative elements -->
  <circle cx="1150" cy="150" r="80" fill="${color}08"/>
  <circle cx="1100" cy="500" r="120" fill="${accent}06"/>
</svg>`;
}

pages.forEach(page => {
  const svg = generateSVG(page);
  const svgPath = path.join(outDir, page.filename.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: ${svgPath}`);
});

console.log('\n✅ All SVG templates generated.');
console.log('Next: Convert to PNG using sharp or ImageMagick:');
console.log('  npx sharp -i public/*.svg -o public/ --format png');
console.log('Or use ImageMagick: magick convert public/og-*.svg public/og-*.png');
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// JSON-LD Structured Data for GEO (Generative Engine Optimization)
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PJTech Kasir UMKM",
  "alternateName": "PJTECH POS",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Cloud",
  "url": "https://www.pjtechumkm.com",
  "logo": "https://www.pjtechumkm.com/icon-512x512.png",
  "description": "Sistem kasir SaaS multi-vertikal untuk UMKM Indonesia: Retail, F&B, Jasa/Servis, Rental/Travel/Properti. Mulai Rp 990.000/tahun. Termasuk: stok otomatis, kitchen display, tracking servis, kalender booking, laporan pajak.",
  "offers": {
    "@type": "Offer",
    "price": "990000",
    "priceCurrency": "IDR",
    "priceValidUntil": "2025-12-31",
    "billingPeriod": "P1Y",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "PJTECH",
      "url": "https://www.pjtechumkm.com"
    }
  },
  "featureList": [
      "POS Retail: multi-varian (ukuran, warna), barcode/SKU, stok otomatis, diskon item/struk, PPN, cetak struk & label harga",
      "POS F&B: manajemen meja, split bill, open bill, kitchen display/printer, modifier (level pedas, topping)",
      "POS Jasa/Servis: booking antrian, estimasi biaya, progress tracking, notifikasi WA, invoice jasa + sparepart, histori servis per pelanggan",
      "POS Rental/Travel/Properti: kalender ketersediaan, booking berbasis waktu, deposit, denda keterlambatan, multi-unit (mobil/kamar/villa), invoice prorata",
      "Multi-tenant SaaS: satu basis kode, isolasi data total per toko, role SUPERADMIN/OWNER/CASHIER",
      "Laporan: penjualan harian/bulanan, stok minim, HPP & laba, pajak PPN, ekspor CSV/Jurnal untuk akuntan"
    ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Indonesia"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "UMKM Indonesia: toko kelontong, minimarket, fashion, restoran, kafe, warung makan, bengkel, laundry, salon, rental mobil, villa, apartemen"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PJTECH",
    "url": "https://www.pjtechumkm.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.pjtechumkm.com/icon-512x512.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-12-01",
  "version": "2.4.0",
  "license": "https://www.pjtechumkm.com/terms",
  "privacyPolicy": "https://www.pjtechumkm.com/privacy"
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PJTECH",
  "alternateName": ["PJTech Kasir UMKM", "Pranajaya Tech"],
  "url": "https://www.pjtechumkm.com",
  "logo": "https://www.pjtechumkm.com/icon-512x512.png",
  "description": "Penyedia SaaS POS terkemuka untuk UMKM Indonesia dengan 4 vertikal: Retail, F&B, Jasa/Servis, Rental/Travel/Properti.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ID",
    "addressRegion": "Jawa Barat"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-800-000-000",
    "contactType": "customer service",
    "availableLanguage": ["Indonesian", "English"],
    "hoursAvailable": "Mo-Fr 09:00-18:00 WIB"
  },
  "sameAs": [
    "https://www.instagram.com/pranajayatech",
    "https://www.tiktok.com/@pranajayatech",
    "https://www.youtube.com/@pranajayatech"
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pjtechumkm.com'),
  title: {
    template: '%s | PJTECH Kasir UMKM',
    default: 'PJTECH Kasir UMKM - Aplikasi POS F&B, Retail, Jasa, Rental & Properti Mulai Rp 990rb/tahun',
  },
  description: "Sistem kasir SaaS multi-vertikal #1 untuk UMKM Indonesia: Retail, F&B, Jasa/Servis, Rental/Travel/Properti. Fitur lengkap: stok otomatis, kitchen display, tracking servis, kalender booking, laporan pajak. Mulai Rp 990.000/tahun. Gratis trial 14 hari.",
  keywords: [
    'aplikasi kasir UMKM',
    'POS Indonesia',
    'software kasir toko',
    'sistem kasir restoran',
    'aplikasi kasir kafe',
    'POS bengkel laundry',
    'software rental mobil',
    'booking properti villa',
    'kasir multi cabang',
    'SaaS POS Indonesia',
    'point of sale UMKM',
    'digitalisasi UMKM'
  ],
  authors: [{ name: 'PJTECH' }],
  creator: 'PJTECH',
  publisher: 'PJTECH',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'PJTECH Kasir UMKM - Aplikasi POS Multi-Vertikal untuk UMKM Indonesia',
    description: 'Sistem kasir SaaS terbaik untuk Retail, F&B, Jasa, Rental. Mulai Rp 990rb/tahun. Fitur: stok otomatis, kitchen display, tracking servis, kalender booking, laporan pajak.',
    siteName: 'PJTECH Kasir UMKM',
    locale: 'id_ID',
    type: 'website',
    url: 'https://www.pjtechumkm.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PJTECH Kasir UMKM - Dashboard POS Multi-Vertikal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PJTECH Kasir UMKM - POS Terbaik untuk UMKM Indonesia',
    description: 'Aplikasi kasir SaaS multi-vertikal: Retail, F&B, Jasa, Rental. Mulai Rp 990rb/tahun.',
    images: ['/og-image.png'],
    creator: '@pjtechumkm',
  },
  other: {
      'script:ld+json': JSON.stringify([softwareApplicationSchema, organizationSchema]),
    },
  icons: {
    icon: [
      { url: '/icon-192x192.png?v=4', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png?v=4', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192x192.png?v=4',
  },
  formatDetection: {
    telephone: false,
  },
  // PWA
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PJTECH Kasir",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect untuk performa & AI crawler */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.clerk.com" />
        <link rel="dns-prefetch" href="https://clerk.pjtechumkm.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

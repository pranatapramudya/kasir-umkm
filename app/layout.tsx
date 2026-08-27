import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export const metadata: Metadata = {
  title: {
    template: '%s | PJTECH Kasir UMKM',
    default: 'PJTECH Kasir UMKM - Aplikasi POS F&B, Retail, Jasa & Rental',
  },
  description: "Premium SaaS Boilerplate & Aplikasi Kasir POS UMKM modern. Mendukung penuh operasional bisnis Retail, F&B, Jasa (Salon/Klinik), dan kalender jadwal Booking untuk Rental/Travel.",
  keywords: ['Aplikasi kasir rental mobil', 'Sistem POS travel', 'Aplikasi kasir jasa', 'SaaS premium boilerplate', 'Kasir Retail UMKM', 'Software booking operasional', 'POS F&B'],
  authors: [{ name: 'PJTECH' }],
  openGraph: {
    title: 'PJTECH Kasir UMKM - Aplikasi POS 4 Pilar Bisnis',
    description: 'Premium SaaS Boilerplate & Aplikasi Kasir POS UMKM modern. Mendukung penuh operasional bisnis Retail, F&B, Jasa, dan Rental/Travel.',
    siteName: 'PJTECH Kasir UMKM',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PJTECH Kasir UMKM - Aplikasi POS 4 Pilar Bisnis',
    description: 'Premium SaaS Boilerplate & Aplikasi Kasir POS UMKM modern untuk Retail, F&B, Jasa, dan Rental/Travel.',
  },
  // PWA: Meta tags untuk perangkat Apple (iOS)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PJTECH Kasir",
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Removed customIdID from here because it moved to (protected)/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

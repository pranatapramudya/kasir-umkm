import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { SWRProvider } from "@/components/SWRProvider";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PJTECH Kasir UMKM',
    default: 'PJTECH Kasir UMKM - Aplikasi POS F&B, Retail & Jasa Terbaik',
  },
  description: "Tingkatkan omset bisnis UMKM Anda dengan PJTECH. Aplikasi kasir (POS) multi-bisnis terlengkap untuk restoran, toko kelontong, dan jasa. Pantau laba rugi secara real-time dari mana saja.",
  keywords: ['Aplikasi Kasir', 'POS UMKM', 'Kasir F&B', 'Kasir Retail', 'Aplikasi Salon', 'Software Kasir Indonesia', 'SaaS POS Terbaik'],
  authors: [{ name: 'PJTECH' }],
  openGraph: {
    title: 'PJTECH Kasir UMKM - Aplikasi POS F&B, Retail & Jasa Terbaik',
    description: 'Tingkatkan omset bisnis UMKM Anda dengan PJTECH. Aplikasi kasir (POS) multi-bisnis terlengkap.',
    siteName: 'PJTECH Kasir UMKM',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3b82f6',
          borderRadius: '0.75rem',
        }
      }}
    >
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <SWRProvider>
          {children}
          <Toaster position="top-center" richColors />
        </SWRProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { idID } from '@clerk/localizations';
import { SWRProvider } from "@/components/SWRProvider";
import { SessionTimeoutGuard } from "@/components/SessionTimeoutGuard";
import { BottomNav } from "@/components/BottomNav";
import { Analytics } from "@vercel/analytics/next";
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
      { url: '/icon-192x192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192x192.png?v=2',
  },
  formatDetection: {
    telephone: false,
  },
};

const customIdID = {
  ...idID,
  signUp: {
    ...idID.signUp,
    start: {
      ...idID.signUp?.start,
      passwordInput__hint: "Pastikan password kuat dan aman.",
    }
  },
  unstable__errors: {
    ...idID.unstable__errors,
    form_password_length_too_short: "Harus terdiri dari 8 karakter atau lebih.",
    form_password_needs_number: "Harus mengandung minimal 1 angka.",
    form_password_needs_special_char: "Harus mengandung minimal 1 karakter khusus.",
    form_password_needs_uppercase: "Harus mengandung minimal 1 huruf besar.",
    form_password_needs_lowercase: "Harus mengandung minimal 1 huruf kecil.",
  },
  // @ts-ignore
  formFieldHintText: {
    ...((idID as any).formFieldHintText || {}),
    passwordLength: "Harus terdiri dari 8 karakter atau lebih.",
    passwordNumbers: "Harus mengandung minimal 1 angka.",
    passwordSpecialCharacters: "Harus mengandung minimal 1 karakter khusus.",
    passwordUppercaseLetters: "Harus mengandung minimal 1 huruf besar.",
    passwordLowercaseLetters: "Harus mengandung minimal 1 huruf kecil.",
  }
};
(customIdID as any).signUp = {
  ...customIdID.signUp,
  password: {
    ...((customIdID.signUp as any)?.password || {}),
    validations: {
      hasMinLength: "Harus terdiri dari 8 karakter atau lebih.",
      containsNumber: "Harus mengandung minimal 1 angka.",
      containsSpecialCharacter: "Harus mengandung minimal 1 karakter khusus.",
      containsUppercase: "Harus mengandung minimal 1 huruf besar.",
      containsLowercase: "Harus mengandung minimal 1 huruf kecil.",
    },
    strength: "Kekuatan password",
  }
};
(customIdID as any).formPasswordStrength = "Kekuatan password";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={customIdID}
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
          <SWRProvider>
            <SessionTimeoutGuard>
              {children}
              <BottomNav />
            </SessionTimeoutGuard>
            <Toaster position="top-center" richColors />
          </SWRProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

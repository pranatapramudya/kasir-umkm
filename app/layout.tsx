import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { idID } from '@clerk/localizations';
import { SWRProvider } from "@/components/SWRProvider";
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
  // PWA: Meta tags untuk perangkat Apple (iOS)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PJTECH Kasir",
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
            {children}
            <Toaster position="top-center" richColors />
          </SWRProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata = {
  title: "Daftar Akun Baru — PJTECH UMKM",
  description: "Daftar gratis PJTECH UMKM. Solusi kasir & operasional terlengkap untuk Retail, F&B, Jasa, Rental, Properti, dan Alat/Barang.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;
  const targetRedirect = params?.redirect_url || '/onboarding';

  // Jika user sudah terverifikasi / terotentikasi (misal setelah input OTP berhasil),
  // langsung bawa ke onboarding tanpa blank screen
  if (userId) {
    redirect(targetRedirect);
  }

  return (
    <AuthShell mode="sign-up">
      <SignUp 
        routing="path" 
        path="/sign-up" 
        fallbackRedirectUrl={targetRedirect}
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: "w-full flex justify-center",
            card: "w-full shadow-xl border border-slate-200/90 rounded-3xl bg-white p-4 sm:p-7",
            headerTitle: "text-slate-900 font-bold text-xl sm:text-2xl",
            headerSubtitle: "text-slate-500 text-xs sm:text-sm mt-1",
            socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl py-2.5 transition-all text-xs sm:text-sm",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400 text-xs uppercase font-medium",
            formFieldLabel: "text-xs font-bold text-slate-700 uppercase tracking-wider",
            formFieldInput: "rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm py-2.5 transition-all",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl py-3 shadow-md shadow-blue-500/25 transition-all text-sm",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-bold hover:underline",
            footer: "pt-4 border-t border-slate-100",
          }
        }}
      />
    </AuthShell>
  );
}

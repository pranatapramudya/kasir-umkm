import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Keamanan Akun (MFA) — PJTECH KASIR",
  description: "Pengaturan keamanan dan otentikasi dua langkah (MFA).",
};

export default async function AdminSecurityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          Keamanan & MFA
        </h1>
        <p className="text-slate-500 text-sm">
          Lindungi akun Anda dari serangan Phishing dengan mengaktifkan Otentikasi Dua Langkah (Multi-Factor Authentication).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-1 md:p-6 flex justify-center">
        {/* Clerk UserProfile Component handles MFA configuration */}
        <UserProfile 
          routing="hash" 
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-none border-0 w-full",
            }
          }}
        />
      </div>
    </div>
  );
}

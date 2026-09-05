import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/url";
import SlugForm from "./SlugForm";
import PaymentSettingsForm from "./PaymentSettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Informasi Toko — PJTECH KASIR",
  description: "Kelola slug dan informasi toko Anda.",
};

export default async function AdminSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tenant = await prisma.tenant.findUnique({
    where: { userId },
    select: { 
      slug: true, 
      name: true, 
      category: true,
      adminWhatsApp: true,
      bankName: true,
      bankAccount: true,
      bankAccountName: true,
    },
  });

  const appUrl = getAppUrl();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Informasi Toko
        </h1>
        <p className="text-slate-500 text-sm">
          Kelola informasi toko, link booking, dan instruksi pembayaran Anda.
        </p>
      </div>

      {/* ── Bagian Kustom: Informasi Toko ── */}
      <SlugForm initialSlug={tenant?.slug ?? null} appUrl={appUrl} tenantCategory={tenant?.category} />
      
      {/* ── Bagian Kustom: Informasi Pembayaran ── */}
      <PaymentSettingsForm 
        initialWhatsApp={tenant?.adminWhatsApp ?? null}
        initialBankName={tenant?.bankName ?? null}
        initialBankAccount={tenant?.bankAccount ?? null}
        initialBankAccountName={tenant?.bankAccountName ?? null}
        tenantCategory={tenant?.category ?? null}
      />
    </div>
  );
}

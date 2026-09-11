import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/url";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";
import StoreProfileForm from "./StoreProfileForm";
import SlugForm from "./SlugForm";
import PaymentSettingsForm from "./PaymentSettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Informasi Toko — PJTECH KASIR",
  description: "Kelola profil dan informasi toko Anda.",
};

export default async function AdminSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let targetUserId = userId;
  const employee = await prisma.employee.findUnique({
    where: { clerkUserId: userId },
  });
  if (employee) {
    targetUserId = employee.tenantId;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId },
    select: { 
      slug: true, 
      name: true, 
      phone: true,
      category: true,
      adminWhatsApp: true,
      bankName: true,
      bankAccount: true,
      bankAccountName: true,
    },
  });

  const appUrl = getAppUrl();
  const isJasaOrRental = isServiceBusinessCategory(tenant?.category) || isRentalTravelCategory(tenant?.category);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Informasi Toko
        </h1>
        <p className="text-slate-500 text-sm">
          {isJasaOrRental
            ? "Kelola profil toko, link booking online, dan instruksi pembayaran Anda."
            : "Kelola profil dan informasi identitas toko Anda."}
        </p>
      </div>

      {/* ── 1. Bagian Umum: Profil & Identitas Toko (Semua Kategori: Retail, F&B, Jasa, Rental) ── */}
      <StoreProfileForm
        initialName={tenant?.name ?? ""}
        initialPhone={tenant?.phone ?? ""}
        category={tenant?.category ?? "Retail"}
      />

      {/* ── 2. Bagian Khusus: Link Booking Publik (Khusus Jasa & Rental) ── */}
      {isJasaOrRental && (
        <SlugForm initialSlug={tenant?.slug ?? null} appUrl={appUrl} tenantCategory={tenant?.category} />
      )}
      
      {/* ── 3. Bagian Khusus: Informasi Pembayaran & Rekening DP (Khusus Jasa & Rental) ── */}
      {isJasaOrRental && (
        <PaymentSettingsForm 
          initialWhatsApp={tenant?.adminWhatsApp ?? null}
          initialBankName={tenant?.bankName ?? null}
          initialBankAccount={tenant?.bankAccount ?? null}
          initialBankAccountName={tenant?.bankAccountName ?? null}
          tenantCategory={tenant?.category ?? null}
        />
      )}
    </div>
  );
}

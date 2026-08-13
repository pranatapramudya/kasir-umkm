import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SlugForm from "./SlugForm";
import { isRentalTravelCategory } from "@/lib/business-category";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan Toko — PJTECH KASIR",
  description: "Kelola profil, slug, dan informasi toko Anda.",
};

export default async function AdminSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tenant = await prisma.tenant.findUnique({
    where: { userId },
    select: { slug: true, name: true, category: true },
  });

  const isRental = isRentalTravelCategory(tenant?.category || "");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          {isRental ? "Informasi Toko" : "Pengaturan Toko"}
        </h1>
        <p className="text-slate-500 text-sm">
          Kelola informasi toko, link booking, dan pengaturan akun Anda.
        </p>
      </div>

      {/* ── Bagian Kustom: Informasi Toko ── */}
      <SlugForm initialSlug={tenant?.slug ?? null} appUrl={appUrl} />

      {/* ── Bagian Clerk: Profil & Keamanan ── */}
      {!isRental && (
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Profil &amp; Keamanan Akun
          </p>
          <div className="flex justify-center md:justify-start w-full max-w-full overflow-x-hidden">
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-full",
                  card: "w-full max-w-full rounded-2xl shadow-sm border border-slate-200",
                  navbar: "hidden md:flex",
                  navbarMobileMenuButton: "flex md:hidden",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return { title: "Toko Tidak Ditemukan" };
  return {
    title: `Buat Jadwal — ${tenant.name}`,
    description: `Pesan layanan dari ${tenant.name} secara online. Cepat, mudah, dan langsung dikonfirmasi.`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { 
      userId: true, 
      name: true, 
      category: true,
      adminWhatsApp: true,
      bankName: true,
      bankAccount: true,
      bankAccountName: true,
    },
  });

  if (!tenant) notFound();

  // Blokir akses jika kategori bisnis bukan Jasa atau Rental
  const isServiceBusiness = tenant.category === "Jasa / Servis" || tenant.category === "Rental & Travel";
  if (!isServiceBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-md max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-500 text-sm mb-6">Toko ini tidak mengaktifkan fitur layanan reservasi/booking online.</p>
        </div>
      </div>
    );
  }

  // Ambil layanan (produk dengan isService=true) milik tenant ini
  const services = await prisma.product.findMany({
    where: { userId: tenant.userId, isService: true, isArchived: false },
    orderBy: { name: "asc" },
    select: { id: true, name: true, hargaJual: true },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{tenant.name}</h1>
        <p className="text-slate-500 text-sm">
          Buat jadwal kunjungan Anda dengan mudah
        </p>
      </header>

      {/* Form Card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <BookingForm
            slug={slug}
            tenantName={tenant.name}
            services={services}
            tenantCategory={tenant.category}
            adminWhatsApp={tenant.adminWhatsApp}
            bankName={tenant.bankName}
            bankAccount={tenant.bankAccount}
            bankAccountName={tenant.bankAccountName}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-slate-600 text-xs">
          Powered by{" "}
          <span className="font-bold text-slate-500">PJTECH KASIR</span>
        </p>
      </footer>
    </div>
  );
}

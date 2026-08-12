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
  });

  if (!tenant) notFound();

  // Ambil layanan (produk dengan isService=true) milik tenant ini
  const services = await prisma.product.findMany({
    where: { userId: tenant.userId, isService: true, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, hargaJual: true },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-400"
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
        <h1 className="text-2xl font-bold text-white mb-1">{tenant.name}</h1>
        <p className="text-blue-300/70 text-sm">
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

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, Plus, ShieldCheck } from "lucide-react";
import { PegawaiClient } from "./PegawaiClient";

export const dynamic = 'force-dynamic';

export default async function PegawaiPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = sessionClaims?.role || (sessionClaims?.metadata as any)?.role;
  if (role === "CASHIER") {
    redirect("/");
  }
  const employees = await prisma.employee.findMany({
    where: { tenantId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Manajemen Karyawan
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola akses kasir untuk toko Anda.</p>
        </div>
      </div>

      <PegawaiClient initialEmployees={employees} />
    </div>
  );
}

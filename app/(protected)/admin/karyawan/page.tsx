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

      {/* Panduan Membuat Akun Kasir */}
      <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-blue-900 font-bold text-lg mb-3 flex items-center gap-2">
          <span>💡</span> Panduan Membuat Akun Kasir
        </h3>
        <p className="text-blue-900 text-sm mb-4">
          Untuk menambahkan kasir baru, silakan klik tombol <strong>+ Tambah Kasir</strong>. Anda memiliki dua pilihan untuk pendaftaran email:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-blue-900/90">
          <li>
            <strong>Gunakan Email Karyawan:</strong> Masukkan email asli karyawan Anda. Jika sistem meminta kode OTP, kode tersebut akan masuk ke email mereka.
          </li>
          <li>
            <strong>Gunakan Email Anda (Trik +Kasir):</strong> Jika karyawan tidak memiliki email, Anda bisa menggunakan email utama Anda dengan menambahkan tanda <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-xs">+kasir1</code>. 
            <br />
            <span className="italic opacity-80 mt-1 block">
              (Contoh: Jika email Anda <strong>budi@gmail.com</strong>, ketikkan <strong>budi+kasir1@gmail.com</strong>). Semua kode OTP dan notifikasi akan tetap masuk ke email utama Anda.
            </span>
          </li>
          <li>
            <strong>Cara Login:</strong> Setelah akun dibuat, arahkan karyawan Anda untuk <em>Login</em> di halaman depan website menggunakan email yang didaftarkan beserta Password Sementara yang Anda buat di bawah ini. Karyawan dapat mengubah passwordnya nanti.
          </li>
        </ul>
      </div>

      <PegawaiClient initialEmployees={employees} />
    </div>
  );
}

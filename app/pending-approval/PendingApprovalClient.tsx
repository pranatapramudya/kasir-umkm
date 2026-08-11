"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hourglass, MessageCircle } from "lucide-react";

export default function PendingApprovalClient({ plan }: { plan: string | null | undefined }) {
  const router = useRouter();
  const [dots, setDots] = useState("");

  // Polling router.refresh() setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000); // 10 detik

    return () => clearInterval(interval);
  }, [router]);

  // Animasi titik-titik loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
          <Hourglass className="w-10 h-10 animate-pulse" />
          <div className="absolute top-0 right-0 w-5 h-5 bg-orange-500 rounded-full animate-ping"></div>
          <div className="absolute top-0 right-0 w-5 h-5 bg-orange-500 rounded-full"></div>
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">
          Menunggu Verifikasi{dots}
        </h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Mohon tunggu sejenak (5-10 menit). Tim kami sedang memverifikasi pembayaran Anda untuk paket <strong className="text-slate-700">{plan || "Berbayar"}</strong>. Halaman ini akan otomatis memuat ulang setelah pembayaran disetujui.
        </p>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-8">
          <p className="text-xs text-orange-800">
            <strong>Catatan:</strong> Jika Anda belum mengirimkan bukti transfer, silakan kirimkan melalui WhatsApp di bawah ini agar proses verifikasi lebih cepat.
          </p>
        </div>

        <a
          href="https://wa.me/6285723256427?text=Halo%20PJTECH,%20saya%20ingin%20menanyakan%20status%20verifikasi%20pembayaran%20kasir%20saya."
          target="_blank"
          rel="noreferrer"
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <MessageCircle className="w-5 h-5" />
          Hubungi Bantuan (WhatsApp)
        </a>
      </div>
    </div>
  );
}

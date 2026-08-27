"use client";

import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { selectSubscriptionPackage } from "@/app/(protected)/onboarding/actions";

export function PaywallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300 print:hidden">
      <div className="relative z-[10000] bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-6 md:p-8 overflow-visible animate-in zoom-in-95 duration-300 my-8">
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center z-20">
          <span className="text-[8px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest mr-1">dev by</span>
          <span className="text-xs md:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">PJTECH</span>
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-1.5 rounded-full transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative z-10 text-center mb-10 mt-8 md:mt-2">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Pilih Paket Langganan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Tingkatkan ke Pro untuk melihat laporan keuntungan harian Anda, melacak tren penjualan, dan fitur analitik premium lainnya.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 md:gap-4 w-full relative z-10">
          {/* Paket A: Mulai Usaha */}
          <div className="w-full border border-slate-200 rounded-2xl md:rounded-3xl p-2 md:p-6 flex flex-col h-full hover:border-slate-300 hover:shadow-lg transition-all bg-white relative">
            <h3 className="text-[10px] sm:text-xs md:text-xl font-bold leading-tight text-slate-900 mb-1 md:mb-2">Mulai Usaha</h3>
            <p className="hidden md:block text-slate-500 text-sm mb-6 h-10 line-clamp-2">Pengguna baru yang ragu dan ingin mencoba.</p>
            <div className="mb-2 md:mb-6">
              <span className="text-sm sm:text-base md:text-3xl font-extrabold text-slate-900 block md:inline">Rp 0</span>
              <span className="text-slate-500 font-medium text-[8px] sm:text-[10px] md:text-sm block mt-0.5 md:mt-1 truncate">Gratis 14 Hari Pertama</span>
            </div>
            <ul className="space-y-1.5 md:space-y-4 mb-3 md:mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Akses Kasir (Point of Sales) Penuh</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Manajemen Produk Dasar</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Buka Kunci Dasbor Analitik (Terbatas)</span>
              </li>
            </ul>
            <button 
              disabled={isLoading}
              onClick={async () => {
                if (!user) return;
                setIsLoading(true);
                try {
                  const result = await selectSubscriptionPackage('TRIAL');
                  if (result?.success) {
                     await user.reload();
                     onClose();
                     toast.success("Berhasil sinkronisasi paket Trial!");
                  }
                } catch (err: any) {
                  toast.error(err.message || 'Gagal mengaktifkan Trial');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-1 px-1 text-[8px] sm:text-[10px] md:text-base md:py-2 rounded-lg md:rounded-2xl font-bold transition-colors mt-auto disabled:opacity-50"
            >
              {isLoading ? "Sinkronisasi..." : "Gunakan Akses Trial"}
            </button>
          </div>

          {/* Paket B: Pro Bulanan */}
          <div className="w-full border border-slate-200 rounded-2xl md:rounded-3xl p-2 md:p-6 flex flex-col h-full hover:border-slate-300 hover:shadow-lg transition-all bg-white relative">
            <h3 className="text-[10px] sm:text-xs md:text-xl font-bold leading-tight text-slate-900 mb-1 md:mb-2">Pro Bulanan</h3>
            <p className="hidden md:block text-slate-500 text-sm mb-6 h-10 line-clamp-2">UMKM yang butuh fleksibilitas cashflow.</p>
            <div className="mb-2 md:mb-6">
              <span className="text-sm sm:text-base md:text-3xl font-extrabold text-slate-900 block md:inline">Rp 99rb</span>
              <span className="text-slate-500 font-medium text-[8px] sm:text-[10px] md:text-sm truncate"> / bulan</span>
            </div>
            <ul className="space-y-1.5 md:space-y-4 mb-3 md:mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Semua fitur Kasir & Produk</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Laporan Pendapatan & Laba Bersih</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Manajemen Stok Otomatis</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-600 text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Ekspor Data Laporan (Excel/CSV)</span>
              </li>
            </ul>
            <button 
              onClick={() => toast.info('Integrasi pembayaran segera hadir!')}
              className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-1 px-1 text-[8px] sm:text-[10px] md:text-base md:py-2 rounded-lg md:rounded-2xl font-bold transition-colors mt-auto"
            >
              Pilih Bulanan
            </button>
          </div>

          {/* Paket C: Pro Tahunan (Best Value) */}
          <div className="w-full border-2 border-amber-400 rounded-2xl md:rounded-3xl p-2 md:p-6 flex flex-col h-full shadow-xl shadow-amber-500/10 bg-white relative transform md:-translate-y-4 z-10">
            <div className="absolute -top-2 md:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1 py-0.5 md:px-4 md:py-1.5 rounded-full text-[6px] sm:text-[8px] md:text-xs font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
              Paling Populer
            </div>
            <h3 className="text-[10px] sm:text-xs md:text-xl font-bold leading-tight text-slate-900 mb-1 md:mb-2 mt-1 md:mt-2">Pro Tahunan</h3>
            <p className="hidden md:block text-slate-500 text-sm mb-6 h-10 line-clamp-2">Pemilik bisnis serius yang butuh data mendalam.</p>
            <div className="mb-2 md:mb-6">
              <span className="text-sm sm:text-base md:text-3xl font-extrabold text-slate-900 block md:inline">Rp 1.188k</span>
              <span className="text-slate-500 font-medium text-[8px] sm:text-[10px] md:text-sm truncate"> / tahun</span>
              <p className="text-amber-600 text-[6px] sm:text-[8px] md:text-xs font-bold mt-0.5 md:mt-2 truncate">Hemat 2 Bulan</p>
            </div>
            <ul className="space-y-1.5 md:space-y-4 mb-3 md:mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-medium text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Semua Fitur Pro Bulanan</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-bold text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Analisis Jam Sibuk<span className="hidden md:inline">: <span className="font-normal text-slate-600">Pantau waktu teramai toko Anda.</span></span></span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-bold text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Peringatan Stok Cerdas<span className="hidden md:inline">: <span className="font-normal text-slate-600">Notifikasi otomatis saat stok menipis.</span></span></span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-bold text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Laporan Multi-Kasir<span className="hidden md:inline">: <span className="font-normal text-slate-600">Lacak performa penjualan tiap pegawai.</span></span></span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-bold text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1"><span className="md:hidden">Analitik Produk</span><span className="hidden md:inline">Analitik Produk (ABC): <span className="font-normal text-slate-600">Deteksi produk terlaris & dead stock.</span></span></span>
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-emerald-500 mr-1 md:mr-3 shrink-0" />
                <span className="text-slate-800 font-bold text-[8px] sm:text-[10px] md:text-sm leading-tight line-clamp-1">Database Pelanggan<span className="hidden md:inline">: <span className="font-normal text-slate-600">Kenali dan catat pembeli paling loyal.</span></span></span>
              </li>
            </ul>
            <button 
              onClick={() => toast.info('Integrasi pembayaran segera hadir!')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 py-1 px-1 text-[8px] sm:text-[10px] md:text-base md:py-2 rounded-lg md:rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 mt-auto"
            >
              Pilih Tahunan
            </button>
          </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
}

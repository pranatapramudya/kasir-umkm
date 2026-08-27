"use client";

import nextDynamic from 'next/dynamic';
import { BarChart3, Receipt, Users, CheckCircle2 } from "lucide-react";

const MiniChartWrapper = nextDynamic(() => import('@/components/MiniChartWrapper').then(mod => mod.MiniChartWrapper), { ssr: false });

export default function LandingShowcase() {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mt-16 lg:mt-0">
        <h2 className="text-5xl xl:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-6">
          Sistem Point of Sale <br />
          Era Modern.
        </h2>
        <p className="text-lg text-slate-600 mb-6 max-w-xl leading-relaxed">
          Kelola bisnis F&B, Retail, Jasa, hingga Rental & Travel Anda dengan satu platform yang dirancang untuk kecepatan, keamanan, dan skalabilitas di kelas <em className="text-blue-600 font-serif italic font-medium tracking-wide">Enterprise</em>.
        </p>

        {/* Isometric / Bento Grid Mockup */}
        <div
          className="relative w-full aspect-[4/3] rounded-[2rem] transition-all duration-700 ease-out group"
          style={{ perspective: '1200px' }}
        >
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-5 grid grid-cols-3 gap-3 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-100"
            style={{ transform: 'rotateY(12deg) rotateX(8deg) scale(0.85)', transformStyle: 'preserve-3d' }}
          >
            {/* Dummy Dashboard UI */}
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/60 p-5 flex flex-col justify-between shadow-sm transition-transform duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-sm font-bold text-slate-700">Total Pendapatan</span>
                <div className="p-2 bg-white rounded-lg shadow-sm" aria-hidden="true">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter text-blue-950 mb-1">Rp 14.500.000</h3>
                <div className="inline-flex items-center gap-1 bg-green-100/80 px-2 py-1 rounded-md text-xs font-bold text-green-700">
                  +12.5% vs bulan lalu
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full overflow-hidden rounded-b-2xl">
                <MiniChartWrapper />
              </div>
            </div>

            <div className="col-span-1 row-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-center items-center text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3" aria-hidden="true">
                <Receipt className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Transaksi</p>
              <p className="text-xl font-black text-slate-800">142</p>
            </div>

            <div className="col-span-1 row-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-center items-center text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3" aria-hidden="true">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">STAFF AKTIF</p>
              <p className="text-xl font-black text-slate-800">12</p>
            </div>

            <div className="col-span-3 bg-white/90 rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm mt-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-green-200" aria-hidden="true">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 mb-0.5">Pesanan Selesai #1042</p>
                  <p className="text-xs font-medium text-slate-600">Baru saja - Kasir Utama</p>
                </div>
              </div>
              <span className="font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Rp 250.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

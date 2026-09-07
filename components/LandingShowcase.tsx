import { BarChart3, Receipt, Users, CheckCircle2 } from "lucide-react";

export default function LandingShowcase() {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 relative overflow-hidden">


      <div className="relative z-10 max-w-2xl mt-16 lg:mt-0">
        <h2 className="text-5xl xl:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-6">
          Sistem Point of Sale <br />
          Era Modern.
        </h2>
        <p className="text-lg text-slate-600 mb-6 max-w-xl leading-relaxed">
          Kelola bisnis F&B, Retail, Jasa, Rental & Travel, hingga Manajemen Properti Anda dengan satu platform yang dirancang untuk kecepatan, keamanan, dan skalabilitas di kelas <em className="text-blue-600 font-serif italic font-medium tracking-wide">Enterprise</em>.
        </p>

        {/* Simplified Bento Grid Mockup */}
        <div className="relative w-full aspect-[4/3] rounded-[2rem]">
          <div className="absolute inset-0 bg-white border border-slate-100 rounded-[2rem] p-5 grid grid-cols-3 gap-3 shadow-xl">
            {/* Dummy Dashboard UI */}
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/60 p-5 flex flex-col justify-between shadow-sm overflow-hidden relative">
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
              <div className="absolute bottom-0 left-0 w-full overflow-hidden rounded-b-2xl opacity-80" aria-hidden="true">
                <svg viewBox="0 0 100 30" className="w-full h-16" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,20 Q10,25 20,15 T40,25 T60,10 T80,20 T100,5 L100,30 L0,30 Z" fill="url(#chart-grad)" />
                  <path d="M0,20 Q10,25 20,15 T40,25 T60,10 T80,20 T100,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
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

            <div className="col-span-3 bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm mt-2">
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

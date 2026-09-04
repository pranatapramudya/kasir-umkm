"use client";

import { Lock, BarChart2, Clock, AlertTriangle, Users, Download, Loader2, ArrowUp, ArrowDown, Crown, Calendar, ChevronDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAnalyticsData } from "./actions";
import Link from "next/link";
import { getTerms } from "@/utils/terminology";
import dynamic from 'next/dynamic';

const BusyHoursChart = dynamic(() => import('@/components/BusyHoursChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )
});

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [dateRange, setDateRange] = useState({
    from: getLocalDateString(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    to: getLocalDateString(new Date())
  });

  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [productFilterMode, setProductFilterMode] = useState<'best' | 'worst'>('best');
  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false);

  const productFilterLabels: Record<string, string> = {
    'best': 'Paling Laris',
    'worst': 'Kurang Laris'
  };

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      const res = await getAnalyticsData(dateRange.from, dateRange.to);
      if (!res.error) {
        setData(res);
      }
      setIsLoadingData(false);
    }
    if (isLoaded && user) {
      loadData();
    }
  }, [isLoaded, user, dateRange.from, dateRange.to]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(`/api/export?from=${dateRange.from}&to=${dateRange.to}`);
      if (!res.ok) throw new Error("Gagal mengunduh laporan");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Kasir_${dateRange.from}_${dateRange.to}_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengekspor laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isLoaded || (isLoadingData && user)) {
    return (
      <div className="p-8 h-96 flex flex-col items-center justify-center text-slate-500 font-medium gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        Memuat Analitik...
      </div>
    );
  }

  const isPro = user?.publicMetadata?.plan === 'pro';
  let isTrialActive = false;
  let daysLeft = 0;
  
  if (user && user.createdAt) {
    const now = new Date();
    const accountCreated = new Date(user.createdAt as Date);
    const trialEndDate = new Date(accountCreated.getTime() + 14 * 24 * 60 * 60 * 1000);
    isTrialActive = now < trialEndDate;
    
    if (isTrialActive) {
      daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
  }
  
  const hasAccess = isPro || isTrialActive;
  const terms = getTerms(data?.category);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Analitik & Laporan Premium</h1>
            <p className="text-slate-500 max-w-xl text-sm md:text-base">Dapatkan wawasan mendalam untuk kembangkan bisnis Anda. Fitur ini secara aktif mengumpulkan dan memproses miliaran titik data transaksi Anda.</p>
          </div>
          
          {hasAccess && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm mt-4 md:mt-0 shrink-0 w-full md:w-auto">
              <div className="flex flex-1 items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-2 sm:py-1 shadow-sm">
                 <input 
                   type="date" 
                   value={dateRange.from}
                   onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                   className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full"
                 />
                 <span className="text-slate-400 text-sm font-bold">-</span>
                 <input 
                   type="date" 
                   value={dateRange.to}
                   onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                   className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full text-right sm:text-left"
                 />
              </div>
              
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Unduh Excel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* 1. Grafik Jam Sibuk */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group col-span-1 md:col-span-2 lg:col-span-1">
          {!hasAccess && <LockOverlay />}
          <div className={hasAccess ? "transition-opacity duration-300 h-full flex flex-col" : "opacity-40 h-full flex flex-col"}>
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-500 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight mb-1">{terms.busyHoursTitle}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{terms.busyHoursDesc}</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-[240px] -ml-4 mt-2">
              {data?.busyHours?.length > 0 ? (
                <BusyHoursChart data={data.busyHours} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* 2. Analitik Produk (Top & Bottom) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group col-span-1 md:col-span-2 lg:col-span-1">
          {!hasAccess && <LockOverlay />}
          <div className={hasAccess ? "transition-opacity duration-300 h-full flex flex-col" : "opacity-40 h-full flex flex-col"}>
            <div className="flex items-start justify-between gap-4 mb-6 shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-500 shrink-0">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight mb-1">{terms.analyticsItemTitle}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 pr-2">{terms.analyticsItemDesc}</p>
                </div>
              </div>
              <div className="relative mt-1">
                <button 
                  onClick={() => setIsProductFilterOpen(!isProductFilterOpen)}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0 min-w-[120px]"
                >
                  <span>{productFilterLabels[productFilterMode]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isProductFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProductFilterOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <ul className="py-1">
                        {Object.entries(productFilterLabels).map(([value, label]) => (
                          <li key={value}>
                            <button
                              onClick={() => {
                                setProductFilterMode(value as 'best' | 'worst');
                                setIsProductFilterOpen(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                                productFilterMode === value 
                                  ? "font-semibold text-emerald-600 bg-emerald-50/50" 
                                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              {label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {data?.topProducts?.length > 0 ? (
                <div key={productFilterMode} className="animate-in fade-in duration-300">
                  {productFilterMode === 'best' ? (
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <ArrowUp className="w-4 h-4 text-emerald-500" /> Paling Laris
                      </h4>
                      <div className="space-y-3">
                        {data.topProducts.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 truncate mr-2">{p.name}</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{p.qty}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <ArrowDown className="w-4 h-4 text-red-500" /> Kurang Laris
                      </h4>
                      <div className="space-y-3">
                        {data.bottomProducts?.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 truncate mr-2">{p.name}</span>
                            <span className="font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md">{p.qty}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* 3. Peringatan Stok Cerdas */}
        {data?.category !== 'Jasa / Servis' && data?.category !== 'JASA' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
          {!hasAccess && <LockOverlay />}
          <div className={hasAccess ? "transition-opacity duration-300 h-full flex flex-col" : "opacity-40 h-full flex flex-col"}>
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100 text-amber-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight mb-1">Peringatan Stok Cerdas</h3>
                <p className="text-xs text-slate-500 line-clamp-2">Sistem otomatis memprediksi kapan stok akan habis.</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              {data?.lowStock?.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {data.lowStock.map((p: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${p.stock === 0 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                      <span className={`font-medium text-sm ${p.stock === 0 ? 'text-red-700' : 'text-amber-700'} truncate mr-2`}>
                        {p.name}
                      </span>
                      <span className={`text-xs font-black px-2 py-1 rounded-md ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        {p.stock} Sisa
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <AlertTriangle className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">{terms.stockWarningLabel}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* 4. Laporan Performa */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
          {!hasAccess && <LockOverlay />}
          <div className={hasAccess ? "transition-opacity duration-300 h-full flex flex-col" : "opacity-40 h-full flex flex-col"}>
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-500 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight mb-1">Laporan Pendapatan</h3>
                <p className="text-xs text-slate-500 line-clamp-2">Pantau total pendapatan dari transaksi Anda.</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
              {data?.cashierStats?.length > 0 ? (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-2 font-medium">Total Pendapatan Terakumulasi</p>
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
                    Rp {data.cashierStats.reduce((acc: number, curr: any) => acc + curr.total, 0).toLocaleString('id-ID')}
                  </h2>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <ArrowUp className="w-3 h-3" /> Berjalan Lancar
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* PAYWALL OVERLAY */}
      {!hasAccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-yellow-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl -mr-16 -mt-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl -ml-16 -mb-16 opacity-20"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-yellow-200">
                <Crown className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">Buka Potensi Penuh Bisnis Anda!</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{terms.paywalDesc}</p>
              
              <div className="w-full space-y-3">
                <button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  Upgrade Pro Sekarang <Crown className="w-5 h-5" />
                </button>
                <Link href="/admin" className="w-full block py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LockOverlay() {
  return (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-all duration-300 rounded-2xl">
      <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl transform group-hover:scale-105 transition-transform">
        <Lock className="w-3 h-3" />
        Data sedang dikumpulkan...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-slate-400 text-center">
      <div className="bg-slate-50 p-4 rounded-full mb-3">
        <BarChart2 className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-sm font-medium">Belum ada data transaksi yang memadai</p>
    </div>
  );
}

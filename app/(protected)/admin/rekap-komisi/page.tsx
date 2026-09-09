"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Wallet, Download, Search, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function RekapKomisiPage() {
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
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommissions() {
      if (!isLoaded || !user) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/commissions?start=${dateRange.from}&end=${dateRange.to}`);
        const result = await res.json();
        
        if (res.ok) {
          setData(result.data);
        } else {
          toast.error(result.error || "Gagal memuat data komisi");
        }
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan sistem");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCommissions();
  }, [dateRange.from, dateRange.to, isLoaded, user]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (!isLoaded) {
    return (
      <div className="p-8 h-96 flex flex-col items-center justify-center text-slate-500 font-medium gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        Memuat Rekap Komisi...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Rekap Komisi Staf / Karyawan</h1>
            <p className="text-slate-500 max-w-xl text-sm md:text-base">Pantau kinerja dan hitung bagi hasil karyawan Anda.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm mt-4 md:mt-0 shrink-0 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm shrink-0 w-full sm:w-auto">
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full sm:w-auto"
              />
              <span className="text-slate-400 text-sm font-bold">-</span>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full sm:w-auto"
              />
            </div>
            
            <button 
              disabled={true}
              title="Fitur Export akan segera hadir"
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 shadow-sm border-0 transition-all duration-200 ease-in-out font-bold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Unduh Laporan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {(isLoading && data.length === 0) ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p>Menghitung rekap komisi...</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-sm font-bold text-slate-600">Nama Staf / Pekerja</th>
                  <th className="p-4 text-sm font-bold text-slate-600 text-center">Total Layanan Dikerjakan</th>
                  <th className="p-4 text-sm font-bold text-slate-600 text-right">Total Komisi (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {(item.workerName || 'K').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{item.workerName || 'Karyawan'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {item.totalQty}x
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-600 text-lg">
                      {formatRupiah(item.totalCommission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Data Komisi</h3>
            <p className="text-slate-500 max-w-sm mb-6">Belum ada transaksi layanan dengan pekerja yang terekam pada rentang waktu ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

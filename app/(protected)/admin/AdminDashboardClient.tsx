"use client";

import React, { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { TrendingUp, CreditCard, DollarSign, BarChart3, Calendar, ChevronDown, Loader2 } from 'lucide-react';

import { useUser } from '@clerk/nextjs';
import ExportBackupButton from '@/components/ExportBackupButton';
import dynamic from 'next/dynamic';
import { getTerms } from '@/utils/terminology';

const AdminSalesChart = dynamic(() => import('@/components/AdminSalesChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )
});

const fetcher = (args: string | [string, string]) => {
  const url = Array.isArray(args) ? args[0] : args;
  return fetch(url).then((res) => res.json());
};

export default function AdminDashboardClient({ 
  initialData, 
  initialFilter,
  preloadedData = {},
}: { 
  initialData: any; 
  initialFilter: string;
  preloadedData?: Record<string, any>;
}) {
  const { user, isLoaded } = useUser();
  const { mutate } = useSWRConfig();
  
  // Mencegah hydration error akibat perbedaan render server vs client pada komponen yg butuh auth state
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const role = user?.publicMetadata?.role;
  const currentTenantId = role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;

  const [dateFilter, setDateFilter] = useState(initialFilter);
  const [customDate, setCustomDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Proactive SWR Cache Seeding for 0ms filter changes
  useEffect(() => {
    if (preloadedData && currentTenantId) {
      Object.entries(preloadedData).forEach(([fKey, fData]) => {
        mutate([`/api/analytics?filter=${fKey}`, currentTenantId], fData, false);
      });
    }
  }, [preloadedData, currentTenantId, mutate]);

  const dateFilterLabels: Record<string, string> = {
    'hari_ini': 'Hari Ini',
    'bulan_ini': 'Bulan Ini',
    'tahun_ini': 'Tahun Ini',
    'manual': 'Pilih Manual...'
  };

  const queryUrl = `/api/analytics?filter=${dateFilter}${dateFilter === 'manual' ? `&customDate=${customDate}` : ''}`;
  
  // Zero-Latency Instant Memory Fallback: Immediate 0ms rendering for preloaded periods
  const instantFallback = (!customDate && preloadedData[dateFilter]) 
    ? preloadedData[dateFilter] 
    : (dateFilter === initialFilter && !customDate ? initialData : undefined);

  const { data: swrAnalytics } = useSWR(
    queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : null,
    fetcher,
    { 
      keepPreviousData: false,
      fallbackData: instantFallback,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  const analytics = swrAnalytics || instantFallback;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
      .format(num)
      .replace(/\s+/g, ''); // Removes spaces to prevent wrapping e.g. -Rp 1.000 -> -Rp1.000
  };

  if (!isMounted || !isLoaded) {
    // Tampilkan skeleton/loading sederhana selama hidrasi berlangsung untuk mencegah mismatch
    return (
      <div className="p-8 h-96 flex flex-col items-center justify-center bg-slate-50 animate-pulse rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (analytics && analytics.tenantId && currentTenantId && analytics.tenantId !== currentTenantId) {
    return (
      <div className="p-8 h-96 flex flex-col items-center justify-center bg-slate-50 animate-pulse rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500 font-medium">Sinkronisasi data sesi...</p>
      </div>
    );
  }

  const terms = getTerms(analytics?.category);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Ringkasan Bisnis
          </h1>
          <p className="text-slate-500 text-sm">{terms.dashboardSubtitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={role === 'CASHIER'}
              className={`flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 min-w-[140px] ${
                role === 'CASHIER'
                  ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500'
                  : 'bg-white hover:bg-slate-50 transition-colors'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${role === 'CASHIER' ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={role === 'CASHIER' ? 'text-slate-500 font-bold' : 'text-slate-700'}>
                  {dateFilterLabels[dateFilter]}
                </span>
              </div>
              {role !== 'CASHIER' && <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <ul className="py-1">
                    {Object.entries(dateFilterLabels).map(([value, label]) => (
                      <li key={value}>
                        <button
                          onClick={() => {
                            setDateFilter(value);
                            setIsDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                            dateFilter === value 
                              ? "font-semibold text-blue-600 bg-blue-50/50" 
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
          
          {dateFilter === 'manual' && (
            <input 
              type="date" 
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
            />
          )}

          {/* Backup Button for Owner */}
          {role !== 'CASHIER' && (
            <ExportBackupButton 
              category={analytics?.category} 
              filter={dateFilter}
              customDate={customDate}
            />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Total Pendapatan</span>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1 flex items-center h-9 truncate">
              {!analytics ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.totalRevenue || 0)}
            </h3>
            <span className="text-sm text-green-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Periode terpilih
            </span>
          </div>
        </div>

        {/* Card 2: Laba Bersih */}
        {role !== 'CASHIER' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Laba Bersih</span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1 flex items-center h-9 truncate">
              {!analytics ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.netProfit || 0)}
            </h3>
            <span className="text-sm text-slate-400 font-bold flex items-center gap-1">
              {terms.profitSubtitle}
            </span>
          </div>
        </div>
        )}

        {/* Card 2.5: Total Pengeluaran */}
        {role !== 'CASHIER' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Total Pengeluaran</span>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 transform rotate-180" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1 flex items-center h-9 truncate">
              {!analytics ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.totalExpense || 0)}
            </h3>
            <span className="text-sm text-red-600 font-bold flex items-center gap-1">
              Biaya operasional
            </span>
          </div>
        </div>
        )}

        {/* Card 3: Total Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500">Total Transaksi</span>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1 flex items-center h-9 truncate">
              {!analytics ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : (analytics?.totalTransactions || 0)}
            </h3>
            <span className="text-sm text-slate-400 font-bold flex items-center gap-1">
              {terms.invoiceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex flex-col relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6 relative z-10">{terms.chartTitle}</h3>
        <div className="flex-1 relative z-10">
          {!analytics ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : analytics?.salesTrend && analytics.salesTrend.length > 0 ? (
            <AdminSalesChart data={analytics.salesTrend} />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <BarChart3 className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-medium">{terms.emptyChart}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

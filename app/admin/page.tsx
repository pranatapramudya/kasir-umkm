"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { TrendingUp, CreditCard, DollarSign, BarChart3, Calendar, ChevronDown, Loader2 } from 'lucide-react';

import { useUser } from '@clerk/nextjs';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ExportBackupButton from '@/components/ExportBackupButton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardPage() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const [dateFilter, setDateFilter] = useState(role === 'CASHIER' ? 'hari_ini' : 'bulan_ini');
  const [customDate, setCustomDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateFilterLabels: Record<string, string> = {
    'hari_ini': 'Hari Ini',
    'bulan_ini': 'Bulan Ini',
    'tahun_ini': 'Tahun Ini',
    'manual': 'Pilih Manual...'
  };

  const { data: analytics, isLoading } = useSWR(
    `/api/analytics?filter=${dateFilter}${dateFilter === 'manual' ? `&customDate=${customDate}` : ''}`,
    fetcher
  );

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
      .format(num)
      .replace(/\s+/g, ''); // Removes spaces to prevent wrapping e.g. -Rp 1.000 -> -Rp1.000
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Ringkasan Bisnis
          </h1>
          <p className="text-slate-500 text-sm">Pantau performa penjualan dan kesehatan bisnis Anda.</p>
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
          {role !== 'CASHIER' && <ExportBackupButton />}
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.totalRevenue || 0)}
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.netProfit || 0)}
            </h3>
            <span className="text-sm text-slate-400 font-bold flex items-center gap-1">
              Pendapatan dikurangi HPP & Pengeluaran
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : formatRupiah(analytics?.totalExpense || 0)}
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 shrink-0" /> : (analytics?.totalTransactions || 0)}
            </h3>
            <span className="text-sm text-slate-400 font-bold flex items-center gap-1">
              Faktur pada periode ini
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex flex-col relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6 relative z-10">Tren Penjualan</h3>
        <div className="flex-1 relative z-10">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : analytics?.salesTrend && analytics.salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth()+1}`;
                  }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => `Rp${(val / 1000)}k`}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: any) => [formatRupiah(value as number), 'Pendapatan']}
                  labelFormatter={(label: any) => new Date(label).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <BarChart3 className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-medium">Belum ada data penjualan pada periode ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

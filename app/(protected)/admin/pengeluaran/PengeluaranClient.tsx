"use client";

import React, { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { Wallet, Plus, Trash2, Loader2, X, Receipt, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string | Date;
};

type Props = {
  initialExpenses: Expense[];
  tenantId: string;
  initialDateRange: {
    from: string;
    to: string;
  };
};

const fetcher = async (args: string | [string, string]) => {
  const url = Array.isArray(args) ? args[0] : args;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal memuat data');
  return res.json();
};

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function PengeluaranClient({ initialExpenses, tenantId, initialDateRange }: Props) {
  const router = useRouter();
  const getWibDateString = (d: Date = new Date()) => {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(d);
  };

  const [dateRange, setDateRange] = useState(initialDateRange);

  const activePreset = useMemo(() => {
    const now = new Date();
    const todayStr = getWibDateString(now);
    const d7 = getWibDateString(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
    const [year, month] = todayStr.split('-');
    const thisMonthStart = `${year}-${month}-01`;
    const d30 = getWibDateString(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
    
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfPrevMonth = new Date(firstOfThisMonth.getTime() - 24 * 60 * 60 * 1000);
    const prevMonthEndStr = getWibDateString(lastDayOfPrevMonth);
    const [prevYear, prevMonth] = prevMonthEndStr.split('-');
    const lastMonthStart = `${prevYear}-${prevMonth}-01`;

    if (dateRange.from === todayStr && dateRange.to === todayStr) return 'today';
    if (dateRange.from === d7 && dateRange.to === todayStr) return '7days';
    if (dateRange.from === thisMonthStart && dateRange.to === todayStr) return 'thisMonth';
    if (dateRange.from === d30 && dateRange.to === todayStr) return '30days';
    if (dateRange.from === lastMonthStart && dateRange.to === prevMonthEndStr) return 'lastMonth';
    return 'custom';
  }, [dateRange.from, dateRange.to]);

  const handleSelectPreset = (preset: 'today' | '7days' | 'thisMonth' | '30days' | 'lastMonth') => {
    const now = new Date();
    const todayStr = getWibDateString(now);

    if (preset === 'today') {
      setDateRange({ from: todayStr, to: todayStr });
    } else if (preset === '7days') {
      const d = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      setDateRange({ from: getWibDateString(d), to: todayStr });
    } else if (preset === 'thisMonth') {
      const [year, month] = todayStr.split('-');
      setDateRange({ from: `${year}-${month}-01`, to: todayStr });
    } else if (preset === '30days') {
      const d = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      setDateRange({ from: getWibDateString(d), to: todayStr });
    } else if (preset === 'lastMonth') {
      const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfPrevMonth = new Date(firstOfThisMonth.getTime() - 24 * 60 * 60 * 1000);
      const prevMonthEndStr = getWibDateString(lastDayOfPrevMonth);
      const [prevYear, prevMonth] = prevMonthEndStr.split('-');
      setDateRange({ from: `${prevYear}-${prevMonth}-01`, to: prevMonthEndStr });
    }
  };

    const queryUrl = `/api/expenses?from=${dateRange.from}&to=${dateRange.to}`;
  
  const { data: expenses, error, isLoading, mutate: boundMutate } = useSWR<Expense[]>(
    queryUrl && tenantId ? [queryUrl, tenantId] : null,
    fetcher,
    {
      fallbackData: (dateRange.from === initialDateRange.from && dateRange.to === initialDateRange.to) 
        ? initialExpenses 
        : undefined,
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ["Operasional", "Gaji", "Utilitas (Listrik/Air)", "Sewa", "Transportasi", "Lainnya"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, amount: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("Mohon lengkapi semua kolom wajib");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengeluaran");
      
      toast.success("Pengeluaran berhasil dicatat");
      setIsModalOpen(false);
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      await boundMutate();
      router.refresh();
    } catch (err) {
      toast.error("Gagal menyimpan pengeluaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pengeluaran ini?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Gagal menghapus");
      
      toast.success("Pengeluaran berhasil dihapus");
      await boundMutate();
      router.refresh();
    } catch (err) {
      toast.error("Gagal menghapus pengeluaran");
    } finally {
      setIsDeleting(null);
    }
  };

  const currentTotalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  const formatDateRangeLabel = () => {
    try {
      const fromD = new Date(dateRange.from);
      const toD = new Date(dateRange.to);
      const fromStr = fromD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const toStr = toD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return `${fromStr} - ${toStr}`;
    } catch {
      return "Periode Terpilih";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20 md:pb-8">
      <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Header Card & Filter Tanggal Presisi */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Wallet className="w-5 h-5" />
                </div>
                <span>Pengeluaran</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Catat dan pantau biaya operasional bisnis Anda</p>
            </div>

            <div className="flex flex-col gap-3 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs shrink-0 w-full lg:w-auto">
              {/* Filter Cepat Presisi Waktu */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { id: 'today', label: 'Hari Ini' },
                  { id: '7days', label: '7 Hari' },
                  { id: 'thisMonth', label: 'Bulan Ini' },
                  { id: '30days', label: '30 Hari' },
                  { id: 'lastMonth', label: 'Bulan Lalu' },
                ].map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Tanggal Mulai, Tanggal Selesai & Tambah Pengeluaran */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1 min-w-0">
                  {/* Dari Tanggal */}
                  <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs flex flex-col justify-center focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-blue-500" /> Dari
                    </span>
                    <input
                      type="date"
                      value={dateRange.from}
                      max={dateRange.to}
                      onChange={(e) => {
                        const newFrom = e.target.value;
                        if (!newFrom) return;
                        setDateRange((prev) => ({
                          from: newFrom,
                          to: newFrom > prev.to ? newFrom : prev.to,
                        }));
                      }}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-none w-full cursor-pointer py-0.5"
                    />
                  </div>

                  {/* Sampai Tanggal */}
                  <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs flex flex-col justify-center focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-blue-500" /> Sampai
                    </span>
                    <input
                      type="date"
                      value={dateRange.to}
                      min={dateRange.from}
                      onChange={(e) => {
                        const newTo = e.target.value;
                        if (!newTo) return;
                        setDateRange((prev) => ({
                          from: newTo < prev.from ? newTo : prev.from,
                          to: newTo,
                        }));
                      }}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-none w-full cursor-pointer py-0.5"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white shadow-sm transition-all duration-200 ease-in-out font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 justify-center shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Pengeluaran ({formatDateRangeLabel()})</p>
            <p className="text-2xl font-black text-slate-800">{formatRupiah(currentTotalExpenses)}</p>
          </div>
        </div>

        {(!expenses && !error) ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
            <p className="font-medium">Memuat data pengeluaran...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
            <p className="font-bold">Gagal memuat data pengeluaran.</p>
            <p className="text-sm mt-1">Silakan muat ulang halaman.</p>
          </div>
        ) : expenses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
            <Wallet className="w-16 h-16 mb-4 text-slate-200" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada pengeluaran</h3>
            <p className="text-sm">Klik tombol Tambah Pengeluaran untuk mencatat biaya pertama Anda.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Keterangan</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4 text-right">Nominal</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses?.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {new Date(expense.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">{expense.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-red-600">
                          {formatRupiah(expense.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDelete(expense.id)}
                            disabled={isDeleting === expense.id}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            {isDeleting === expense.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden space-y-3">
              {expenses?.map((expense) => (
                <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">
                        {new Date(expense.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className="font-bold text-slate-800">{expense.title}</h3>
                    </div>
                    <button 
                      onClick={() => handleDelete(expense.id)}
                      disabled={isDeleting === expense.id}
                      className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-md transition-colors"
                    >
                      {isDeleting === expense.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      {expense.category}
                    </span>
                    <span className="font-black text-red-600">{formatRupiah(expense.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">Catat Pengeluaran</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama/Keterangan <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Mis. Bayar Listrik Bulan Ini"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
                <select 
                  name="category" 
                  required
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 outline-none transition-all"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nominal (Rp) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="amount" 
                  required 
                  value={formData.amount ? Number(formData.amount).toLocaleString('id-ID') : ''}
                  onChange={handleAmountChange} 
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 outline-none transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  value={formData.date} 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 outline-none transition-all"
                />
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
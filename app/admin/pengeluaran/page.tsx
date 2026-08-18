"use client";

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Wallet, Plus, Trash2, Loader2, X, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
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

export default function PengeluaranPage() {
  const { user } = useUser();
  const currentTenantId = user?.publicMetadata?.role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;

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

  const queryUrl = `/api/expenses?from=${dateRange.from}&to=${dateRange.to}`;
  const { data: expenses, error, isLoading } = useSWR<Expense[]>(
    queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : null,
    fetcher,
    { keepPreviousData: true }
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
      mutate('/api/expenses');
      mutate('/api/analytics');
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
      mutate('/api/expenses');
      mutate('/api/analytics');
    } catch (err) {
      toast.error("Gagal menghapus pengeluaran");
    } finally {
      setIsDeleting(null);
    }
  };

  // Hitung total pengeluaran sesuai filter
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
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20 md:pb-0">
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Wallet className="w-7 h-7 text-blue-600" />
              Pengeluaran
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Catat dan pantau biaya operasional bisnis Anda</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {/* DATE RANGE PICKER */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto justify-center">
               <input 
                 type="date" 
                 value={dateRange.from}
                 onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                 className="bg-transparent text-sm font-medium text-slate-700 outline-none px-2 py-1 w-full sm:w-auto"
               />
               <span className="text-slate-400 text-sm font-bold">-</span>
               <input 
                 type="date" 
                 value={dateRange.to}
                 onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                 className="bg-transparent text-sm font-medium text-slate-700 outline-none px-2 py-1 w-full sm:w-auto"
               />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 justify-center shrink-0"
            >
              <Plus className="w-5 h-5" />
              Tambah
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Pengeluaran ({formatDateRangeLabel()})</p>
            <p className="text-2xl font-black text-slate-800">{formatRupiah(currentTotalExpenses)}</p>
          </div>
        </div>

        {/* Data State */}
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
            {/* Desktop View: Table */}
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

            {/* Mobile View: Cards */}
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

      {/* Modal Tambah Pengeluaran */}
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

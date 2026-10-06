"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { LayoutDashboard, Plus, Edit2, Trash2, X, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DiningTable = {
  id: string;
  name: string;
  capacity: number;
  status: string;
};

const fetcher = async (args: string | [string, string]) => {
  const url = Array.isArray(args) ? args[0] : args;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data meja');
  return res.json();
};

export default function ManajemenMejaClient({ initialTables, tenantId }: { initialTables: DiningTable[], tenantId: string }) {
  const { user } = useUser();
  const isCashier = user?.publicMetadata?.role === 'CASHIER';
  const router = useRouter();

  const { data: tables, error, isLoading, mutate } = useSWR<DiningTable[]>(
    tenantId ? ['/api/tables', tenantId] : null, 
    fetcher,
    {
      fallbackData: initialTables,
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: ''
  });

  const openModal = (table?: DiningTable) => {
    if (table) {
      setEditingTable(table);
      setFormData({ name: table.name, capacity: table.capacity.toString() });
    } else {
      setEditingTable(null);
      setFormData({ name: '', capacity: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingTable ? `/api/tables/${editingTable.id}` : '/api/tables';
      const method = editingTable ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          capacity: parseInt(formData.capacity, 10) || 4
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan meja');
      }

      toast.success(editingTable ? 'Meja berhasil diperbarui' : 'Meja berhasil ditambahkan');
      await mutate();
      router.refresh();
      closeModal();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus meja ini?')) return;
    try {
      const res = await fetch(`/api/tables/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus meja');
      toast.success('Meja berhasil dihapus');
      await mutate();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    }
  };

  const toggleStatus = async (table: DiningTable) => {
    const newStatus = table.status === 'Tersedia' ? 'Terisi' : 'Tersedia';
    try {
      const res = await fetch(`/api/tables/${table.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Gagal memperbarui status');
      toast.success(`Status ${table.name} diubah menjadi ${newStatus}`);
      await mutate();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    }
  };

  if (error) return <div className="p-8 text-red-500">Gagal memuat data meja.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            Manajemen Meja
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola tata letak dan ketersediaan meja restoran Anda.</p>
        </div>
          <button 
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Meja
          </button>
      </div>
      
      {/* Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Meja / Nama Meja</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kapasitas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Status
                  <span className="text-[10px] opacity-70 block mt-0.5 normal-case font-semibold">(Klik untuk ubah)</span>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!tables && !error) ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat data...
                  </td>
                </tr>
              ) : tables && tables.length > 0 ? (
                tables.map(table => (
                  <tr key={table.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{table.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600 text-sm">
                      {table.capacity} Orang
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleStatus(table)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border active:scale-95 transition-all duration-150 cursor-pointer shadow-sm ${table.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-md' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:shadow-md'}`}
                        title="Klik untuk mengubah status meja"
                      >
                        {table.status}
                        <RefreshCw className="w-3 h-3 opacity-70" />
                      </button>
                    </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(table)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(table.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Belum ada meja. Silakan tambah meja pertama Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && tables && tables.length > 0 && (
          <div className="p-4 border-t border-slate-100 text-xs text-slate-500 text-center">
            Menampilkan {tables.length} data meja.
          </div>
        )}
      </div>

      {/* MODAL TAMBAH/EDIT MEJA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{editingTable ? 'Edit Meja' : 'Tambah Meja'}</h2>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">No. Meja / Nama Meja <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Contoh: Meja 1, VIP A" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Kapasitas (Orang) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="Contoh: 4" 
                  min="1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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

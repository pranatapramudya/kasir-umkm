"use client";

import React from 'react';
import { X } from 'lucide-react';

type BaseProduct = {
  name: string;
  hargaJual: number;
};

type FnbModifierModalProps = {
  isOpen: boolean;
  product: BaseProduct | null;
  onClose: () => void;
  modifierNote: string;
  setModifierNote: (note: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FnbModifierModal({
  isOpen,
  product,
  onClose,
  modifierNote,
  setModifierNote,
  onSubmit
}: FnbModifierModalProps) {
  if (!isOpen || !product) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace(/\s+/g, '');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800">{product.name}</h3>
            <p className="text-xs text-gray-500">{formatRupiah(product.hargaJual)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Tambahan (Opsional)</label>
            <input 
              type="text" 
              value={modifierNote}
              onChange={(e) => setModifierNote(e.target.value)}
              placeholder="Contoh: Less Sugar, Extra Shot, Oat Milk..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-lg text-sm"
              autoFocus
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90">
            Konfirmasi & Masukkan Keranjang
          </button>
        </form>
      </div>
    </div>
  );
}

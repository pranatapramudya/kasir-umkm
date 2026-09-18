"use client";

import React, { useState } from 'react';
import { Users, DollarSign, X } from 'lucide-react';

type SplitBillModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  formatRupiah: (num: number) => string;
};

export default function SplitBillModal({
  isOpen,
  onClose,
  totalAmount,
  formatRupiah,
}: SplitBillModalProps) {
  const [splitCount, setSplitCount] = useState<number>(2);

  if (!isOpen) return null;

  const perPersonAmount = Math.ceil(totalAmount / splitCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            👥 Bagi Tagihan (Split Bill)
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Belanja Info */}
        <div className="py-4 text-center bg-slate-50 rounded-xl my-4 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Total Tagihan Meja</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {formatRupiah(totalAmount)}
          </span>
        </div>

        {/* Jumlah Orang */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Dibagi Berapa Orang?</label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setSplitCount(count)}
                className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                  splitCount === count
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {count} Org
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500">Atau ketik:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={splitCount}
              onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-1.5 text-center text-sm font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-slate-500">orang</span>
          </div>
        </div>

        {/* Hasil Pembagian */}
        <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs font-bold text-emerald-800 block">Bayar per Orang:</span>
          <span className="text-xl font-black text-emerald-700 mt-0.5 block">
            {formatRupiah(perPersonAmount)}
          </span>
          <span className="text-[10px] text-emerald-600 mt-1 block">
            ({splitCount} orang × {formatRupiah(perPersonAmount)})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
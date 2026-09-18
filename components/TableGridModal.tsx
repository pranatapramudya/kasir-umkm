"use client";

import React from 'react';
import { Users, CheckCircle2, AlertCircle } from 'lucide-react';

type Table = {
  id: string;
  name: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | string;
};

type TableGridProps = {
  tables: Table[];
  selectedTableId: string;
  onSelectTable: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function TableGridModal({
  tables,
  selectedTableId,
  onSelectTable,
  isOpen,
  onClose,
}: TableGridProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              🪑 Pilih Meja / Area Makan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih meja untuk pesanan makan di tempat (Dine-in) atau pilih Takeaway
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Takeaway Quick Button */}
        <div className="py-3 border-b border-gray-100">
          <button
            onClick={() => {
              onSelectTable('takeaway');
              onClose();
            }}
            className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
              selectedTableId === 'takeaway'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🛍️</span>
              <div className="text-left">
                <span className="text-sm font-bold block">Bungkus / Takeaway</span>
                <span className="text-xs text-slate-500">Pesanan dibawa pulang, tidak pakai meja</span>
              </div>
            </div>
            {selectedTableId === 'takeaway' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 py-3 text-xs font-semibold text-slate-600 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Kosong / Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Sedang Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Meja Terpilih</span>
          </div>
        </div>

        {/* Grid Meja */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[250px]">
          {tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
              <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium">Belum ada data meja terdaftar.</p>
              <p className="text-xs text-slate-400 mt-1">Kelola daftar meja di menu Admin Settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tables.map((table) => {
                const isOccupied =
                  table.status?.toUpperCase() === 'TERISI' ||
                  table.status?.toUpperCase() === 'OCCUPIED';
                const isSelected = selectedTableId === table.id;

                return (
                  <button
                    key={table.id}
                    disabled={isOccupied}
                    onClick={() => {
                      onSelectTable(table.id);
                      onClose();
                    }}
                    className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-600/20'
                        : isOccupied
                        ? 'border-rose-200 bg-rose-50/60 text-rose-400 cursor-not-allowed opacity-75'
                        : 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-sm text-slate-800'
                    }`}
                  >
                    {/* Status Badge */}
                    <span
                      className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isOccupied
                          ? 'bg-rose-100 text-rose-700'
                          : isSelected
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isOccupied ? 'TERISI' : isSelected ? 'TERPILIH' : 'KOSONG'}
                    </span>

                    <span className="text-2xl mb-1">🍽️</span>
                    <span className="text-sm font-bold truncate max-w-full">{table.name}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Kapasitas {table.capacity}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { X } from 'lucide-react';

export default function PrinterHelpModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-bold">Panduan Printer Bluetooth</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-5 space-y-4 text-sm text-gray-700">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">1</div>
            <p><strong>Nyalakan Bluetooth</strong> di perangkat HP/PC Anda.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">2</div>
            <p>Lakukan <strong>Pairing (Sambungkan)</strong> ke printer thermal (biasanya bernama RPP02N, MTP-2, dsb) via pengaturan Bluetooth bawaan HP/PC Anda.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">3</div>
            <p>Kembali ke aplikasi, klik <strong>Cetak Struk (Bluetooth)</strong>, lalu izinkan pop-up Chrome untuk terhubung ke perangkat.</p>
          </div>
          <button onClick={onClose} className="w-full mt-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Saya Mengerti</button>
        </div>
      </div>
    </div>
  );
}

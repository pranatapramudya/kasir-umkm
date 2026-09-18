"use client";

import React, { useState, useEffect } from 'react';
import { X, Printer, Loader2, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { requestBluetoothPrinter, getCachedPrinter, testPrintBluetooth, clearCachedPrinter, isBluetoothSupported } from '@/lib/printer-auto-detect';

interface PrinterSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrinterReady: (printerName: string) => void;
}

export default function PrinterSetupModal({ isOpen, onClose, onPrinterReady }: PrinterSetupModalProps) {
  const [step, setStep] = useState<'intro' | 'pairing' | 'test' | 'done'>('intro');
  const [printer, setPrinter] = useState<{ name: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bluetoothSupported] = useState(isBluetoothSupported());

  useEffect(() => {
    if (isOpen) {
      checkCachedPrinter();
    }
  }, [isOpen]);

  const checkCachedPrinter = async () => {
    const cached = await getCachedPrinter();
    if (cached) {
      setPrinter({ name: cached.name, id: cached.id });
      setStep('test');
    } else {
      setStep('intro');
    }
  };

  const handlePairPrinter = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestBluetoothPrinter();
      if (result) {
        setPrinter({ name: result.name, id: result.id });
        setStep('test');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPrint = async () => {
    if (!printer) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await testPrintBluetooth({ device: {} as any, name: printer.name, id: printer.id });
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        setStep('done');
        onPrinterReady(printer.name);
      }, 1500);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleChangePrinter = () => {
    clearCachedPrinter();
    setPrinter(null);
    setStep('intro');
    setError(null);
    setSuccess(null);
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Setup Printer Thermal
          </h2>
          <button onClick={handleSkip} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!bluetoothSupported && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Browser Tidak Support Bluetooth</p>
                <p className="text-sm mt-1">Gunakan Chrome/Edge di Android atau Windows 10+. Safari/iOS tidak support Web Bluetooth.</p>
              </div>
            </div>
          )}

          {/* Step 1: Intro */}
          {step === 'intro' && (
            <div className="space-y-4 text-center">
              <Printer className="w-16 h-16 text-blue-100 mx-auto" />
              <h3 className="text-xl font-bold">Hubungkan Printer Thermal</h3>
              <p className="text-gray-600">
                Pilih printer Bluetooth 58mm/80mm Anda. Hanya perlu sekali — berikutnya otomatis konek.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 justify-center text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> ESC/POS Support
                </div>
                <div className="flex items-center gap-2 justify-center text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> 58mm & 80mm
                </div>
                <div className="flex items-center gap-2 justify-center text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Auto Reconnect
                </div>
                <div className="flex items-center gap-2 justify-center text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Test Print 1 Klik
                </div>
              </div>
              <button
                onClick={handlePairPrinter}
                disabled={loading || !bluetoothSupported}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? 'Mencari Printer...' : 'Cari & Hubungkan Printer'}
              </button>
              <button onClick={handleSkip} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                Lewati (Nanti Saja)
              </button>
            </div>
          )}

          {/* Step 2: Pairing */}
          {step === 'pairing' && (
            <div className="space-y-4 text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
              <h3 className="text-xl font-bold">Mencari Printer...</h3>
              <p className="text-gray-600">Pastikan printer menyala & mode pairing. Popup browser akan muncul.</p>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Test Print */}
          {step === 'test' && printer && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Printer Tersambung</p>
                  <p className="text-sm text-green-600">{printer.name}</p>
                </div>
              </div>

              <p className="text-center text-gray-600">Cetak halaman test untuk memastikan printer berfungsi normal.</p>

              <button
                onClick={handleTestPrint}
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? 'Mencetak Test...' : '🖨️ Cetak Test Print'}
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {success}
                </div>
              )}

              <button onClick={handleChangePrinter} className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ganti Printer Lain
              </button>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 'done' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700">Printer Siap Digunakan!</h3>
              <p className="text-gray-600">Printer thermal akan otomatis konek setiap kali buka kasir.</p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
              >
                Selesai & Buka Kasir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Printer, Package, Loader2, AlertCircle, Sparkles, Download, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';


interface OnboardingWizardProps {
  isOpen: boolean;
  tenantCategory?: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingWizard({ isOpen, tenantCategory, onClose, onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2: First product (optional - bisa skip kalau import data)
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const handleNext = async () => {
    if (step === 1) {
      // Printer step is optional, just go next
      setStep(2);
      setError(null);
    } else if (step === 2) {
      if (!productName.trim() || !productPrice) return setError('Nama & harga produk wajib diisi');
      await submitAll();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  const submitAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      // Create first product
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: productName,
          hargaJual: Number(productPrice),
          category: productCategory || 'Umum',
          stock: 0,
          minStockThreshold: 5,
        }),
      });

      localStorage.setItem('onboarding_completed', 'true');
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan onboarding');
    } finally {
      setLoading(false);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const stepConfig = [
    { num: 1, label: 'Printer', icon: Printer, color: 'indigo' },
    { num: 2, label: 'Produk', icon: Package, color: 'amber' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100">
        {/* Progress Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {stepConfig.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.num ? `bg-${s.color}-600 text-white shadow-lg shadow-${s.color}-600/30` : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  {i < 1 && (
                    <div className={`w-16 h-1 mx-2 transition-all ${
                      step > s.num ? `bg-${stepConfig[i].color}-500` : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center mt-2 font-medium">
            Langkah {step} dari 2
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Step 1: Printer Setup (Optional) */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Printer className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Setup Printer (Opsional)</h3>
                  <p className="text-sm text-gray-500">Hubungkan printer struk Bluetooth/USB. Bisa di-skip & diatur nanti di Pengaturan.</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Printer Thermal Bluetooth</p>
                    <p className="text-sm text-gray-500">Cetak struk otomatis saat transaksi selesai</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
                    Hubungkan
                  </button>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">Bisa di-skip & diatur nanti di menu Pengaturan → Printer</p>
            </div>
          )}

          {/* Step 2: First Product / Import Data */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Produk / Layanan Pertama</h3>
                  <p className="text-sm text-gray-500">Tambah manual atau import dari Excel (lebih cepat).</p>
                </div>
              </div>

              {/* Import Data Option - RECOMMENDED */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-800">Import dari Excel (Direkomendasikan)</span>
                </div>
                <p className="text-sm text-blue-700">Download template, isi data, upload sekaligus. Paling cepat untuk katalog banyak.</p>
                <button 
                  type="button"
                  onClick={async () => {
                    const cat = tenantCategory || 'Jasa';
                    try {
                      const res = await fetch(`/api/onboarding/download-template?category=${encodeURIComponent(cat)}`);
                      if (!res.ok) throw new Error('Gagal');
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `template_import_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}.xlsx`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (e) {
                      window.location.href = `/api/onboarding/download-template?category=${encodeURIComponent(cat)}`;
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Template {tenantCategory === 'RENTAL' || tenantCategory === 'Rental & Travel' || tenantCategory === 'Rental/Travel' ? 'Rental/Travel/Properti' : tenantCategory === 'FNB' || tenantCategory === 'F&B' || tenantCategory === 'F&B / Kuliner' ? 'F&B' : tenantCategory === 'JASA' || tenantCategory === 'Jasa / Servis' || tenantCategory === 'Jasa/Servis' ? 'Jasa/Servis' : 'Retail'}
                </button>
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <input 
                    type="file" 
                    accept=".xlsx,.xls,.csv" 
                    className="flex-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Trigger import modal via parent
                        localStorage.setItem('import_file', file.name);
                        window.dispatchEvent(new CustomEvent('open-import-modal', { detail: file }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Atau tambah manual</span>
                </div>
              </div>

              {/* Manual Product Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Layanan / Produk <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    placeholder="Contoh: Potong Rambut Pria"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Rp</span>
                    <input
                      type="text"
                      value={productPrice}
                      onChange={e => setProductPrice(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
                      placeholder="Contoh: 45.000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
                  <select
                    value={productCategory}
                    onChange={e => setProductCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Jasa / Servis">Jasa / Servis</option>
                    <option value="Produk / Barang">Produk / Barang</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            {step === 1 && (
              <button onClick={skipOnboarding} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Lewati Semua
              </button>
            )}
            {step === 2 && (
              <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm border-0 transition-all duration-200 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 2 ? 'Selesai & Mulai' : 'Lanjut'}
              {step === 1 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

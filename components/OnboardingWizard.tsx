"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Store, Printer, Package, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Store info
  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState('RETAIL');
  const [storePhone, setStorePhone] = useState('');

  // Step 3: First product
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const categories = ['RETAIL', 'FNB', 'JASA', 'RENTAL'];

  const handleNext = async () => {
    if (step === 1) {
      if (!storeName.trim()) return setError('Nama toko wajib diisi');
      setStep(2);
      setError(null);
    } else if (step === 2) {
      // Printer step is optional, just go next
      setStep(3);
      setError(null);
    } else if (step === 3) {
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
      // 1. Update tenant profile (store info)
      await fetch('/api/tenant/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: storeName, category: storeCategory, phone: storePhone }),
      });

      // 2. Create first product
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: productName,
          hargaJual: Number(productPrice),
          category: productCategory || storeCategory,
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
    { num: 1, label: 'Toko', icon: Store, color: 'emerald' },
    { num: 2, label: 'Printer', icon: Printer, color: 'indigo' },
    { num: 3, label: 'Produk', icon: Package, color: 'amber' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100">
        {/* Progress Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {stepConfig.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.num ? `bg-${s.color}-600 text-white shadow-lg shadow-${s.color}-600/30` : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  {i < 2 && (
                    <div className={`w-16 h-1 mx-2 transition-all ${
                      step > s.num ? `bg-${stepConfig[i].color}-500` : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center mt-2 font-medium">
            Langkah {step} dari 3
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Step 1: Store Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Info Toko</h3>
                  <p className="text-sm text-gray-500">Isi data dasar toko Anda. Bisa diubah nanti di Pengaturan.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Toko <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="Contoh: Warung Makmur"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Usaha <span className="text-red-500">*</span></label>
                <select
                  value={storeCategory}
                  onChange={e => setStoreCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="RETAIL">🛍️ Retail / Toko Kelontong</option>
                  <option value="FNB">☕ F&B / Resto / Kafe</option>
                  <option value="JASA">🔧 Jasa / Bengkel / Salon</option>
                  <option value="RENTAL">🏠 Rental / Sewa / Properti</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon / WA</label>
                <input
                  type="tel"
                  value={storePhone}
                  onChange={e => setStorePhone(e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 2: Printer */}
          {step === 2 && (
            <div className="space-y-5 text-center">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Printer className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Setup Printer Thermal</h3>
                  <p className="text-sm text-gray-500">Hubungkan printer Bluetooth 58mm/80mm.</p>
                </div>
              </div>
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <Printer className="w-14 h-14 text-indigo-300 mx-auto mb-3" />
                <p className="font-medium text-indigo-800">Printer akan dicari otomatis</p>
                <p className="text-sm text-indigo-600 mt-1">Klik "Lanjut" untuk buka setup printer</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 text-left">
                  <p className="font-medium">Tips:</p>
                  <p>Pastikan printer sudah dinyalakan & mode pairing Bluetooth aktif.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: First Product */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Produk Pertama</h3>
                  <p className="text-sm text-gray-500">Tambah satu produk/contoh agar kasir siap dipakai.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="Contoh: Nasi Goreng / Sabun Cuci"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga Jual <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={e => setProductPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                  <input
                    type="text"
                    value={productCategory}
                    onChange={e => setProductCategory(e.target.value)}
                    placeholder={storeCategory}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-2 rounded-lg transition-all font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <div className="flex gap-2">
              <button
                onClick={skipOnboarding}
                className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all font-medium"
              >
                Lewati
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30 transition-all"
              >
                {step === 3 ? 'Selesai & Buka Kasir' : 'Lanjut'}
                {step < 3 && <ChevronRight className="w-4 h-4" />}
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
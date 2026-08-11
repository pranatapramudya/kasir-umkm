"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Crown, Clock, AlertTriangle, Loader2, Check, X, Copy } from 'lucide-react';

import PricingSection from '@/components/PricingSection';

export default function SubscriptionClient({ initialStatus }: { initialStatus: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!status.endsAt) return;

    const calculateTimeLeft = () => {
      const targetTime = new Date(status.endsAt).getTime();
      const currentTime = new Date().getTime();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [status.endsAt]);

  const isExpired = status.isExpired || (mounted && !timeLeft && status.endsAt);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-blue-600" />
          Paket & Tagihan
        </h1>
        <p className="text-slate-500 mt-1">Kelola masa aktif aplikasi Kasir POS Anda di sini.</p>
      </div>

      {/* STATUS CARD (Horizontal Layout on Desktop) */}
      <div className={`p-6 md:px-8 md:py-6 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${isExpired ? 'bg-red-50 border-red-200' : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'}`}>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-500/20 text-orange-400'}`}>
            {isExpired ? <AlertTriangle className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
          </div>
          <div className="flex flex-col justify-center">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${isExpired ? 'text-red-500' : 'text-slate-400'}`}>
              Status Akun{initialStatus.storeName ? ` - ${initialStatus.storeName.toUpperCase()}` : ''}
            </h3>
            <div className={`text-2xl md:text-3xl font-black ${isExpired ? 'text-red-700' : 'text-white'}`}>
              {status.plan === 'PRO_YEARLY_BUNDLE' ? 'Pro 1 Tahun + Hardware' :
               status.plan === 'PRO_YEARLY' ? 'Pro 1 Tahun' :
               status.plan === 'PRO_SEMI_ANNUAL' ? 'Pro 6 Bulan' :
               'Free Trial'}
            </div>
            {status.endsAt && (
              <div className={`text-xs mt-1.5 font-medium ${isExpired ? 'text-red-500' : 'text-slate-400'}`}>
                Berakhir: {new Date(status.endsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>

        <div className={`w-full md:w-auto p-4 rounded-2xl border ${isExpired ? 'bg-white/60 border-red-100' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className={`flex items-center justify-center gap-2 mb-3 font-medium ${isExpired ? 'text-red-600' : 'text-slate-300'}`}>
            <Clock className="w-4 h-4" /> Sisa Waktu
          </div>
          {mounted ? (
            timeLeft ? (
              <div className="grid grid-cols-4 gap-2 md:gap-3 text-center min-w-[240px]">
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">{timeLeft.days}</span>
                  <span className="text-[10px] text-slate-400 font-bold">HARI</span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">{timeLeft.hours}</span>
                  <span className="text-[10px] text-slate-400 font-bold">JAM</span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-slate-400 font-bold">MNT</span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-slate-400 font-bold">DTK</span>
                </div>
              </div>
            ) : (
              <div className="text-xl font-black text-red-600 text-center min-w-[240px]">Kedaluwarsa</div>
            )
          ) : (
            <div className="text-sm font-bold text-slate-400 text-center min-w-[240px]">Menghitung...</div>
          )}
        </div>
      </div>

      {/* PRICING CATALOG COMPONENT */}
      <PricingSection currentPlan={status.plan} />

    </div>
  );
}

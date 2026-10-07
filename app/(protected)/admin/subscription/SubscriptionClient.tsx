"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import {
  CreditCard,
  Crown,
  Clock,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";

import PricingSection from "@/components/PricingSection";

interface SubscriptionStatus {
  plan?: string | null;
  isExpired?: boolean;
  inTrial?: boolean;
  trialEndsAt?: string | Date | null;
  endsAt?: string | Date | null;
  storeName?: string | null;
  [key: string]: unknown;
}

const emptySubscribe = () => () => {};

export default function SubscriptionClient({
  initialStatus,
}: {
  initialStatus: SubscriptionStatus;
}) {
  const [status] = useState(initialStatus);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    // Gunakan trialEndsAt jika masih trial, atau endsAt jika berbayar
    const activeEndsAt = status.inTrial ? status.trialEndsAt : status.endsAt;

    if (!activeEndsAt) return;

    const calculateTimeLeft = () => {
      const targetTime = new Date(activeEndsAt).getTime();
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
  }, [status.endsAt, status.trialEndsAt, status.inTrial]);

  // isExpired murni didapat dari server calculation (yang mengecek trialEndsAt juga)
  const isExpired = Boolean(
    status.isExpired ||
    (mounted && !timeLeft && (status.endsAt || status.trialEndsAt)),
  );
  const activeEndsAt = status.inTrial ? status.trialEndsAt : status.endsAt;

  const scrollToPricing = () => {
    const el = document.getElementById("pricing-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {isExpired && (status.plan === "FREE" || status.plan === "TRIAL") && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-amber-900 font-bold text-lg">
                Masa Trial 14 Hari Kamu Telah Berakhir!
              </h3>
              <p className="text-amber-700 mt-1 text-sm md:text-base font-medium leading-relaxed">
                Akses kasir dan transaksi sementara dikunci. Silakan pilih paket
                langganan di bawah untuk langsung mengaktifkan kembali akun
                tokomu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToPricing}
            className="w-full md:w-auto shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white px-6 py-3.5 rounded-xl font-bold transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Pilih Paket Berlangganan</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-blue-600" />
          Paket & Tagihan
        </h1>
        <p className="text-slate-500 mt-1">
          Kelola masa aktif aplikasi Kasir POS Anda di sini.
        </p>
      </div>

      {/* STATUS CARD (Horizontal Layout on Desktop) */}
      <div
        className={`p-6 md:px-8 md:py-6 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${isExpired ? "bg-red-50 border-red-200" : "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700"}`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${isExpired ? "bg-red-100 text-red-600" : "bg-orange-500/20 text-orange-400"}`}
          >
            {isExpired ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <Crown className="w-8 h-8" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h3
              className={`text-sm font-bold uppercase tracking-wider mb-1 ${isExpired ? "text-red-500" : "text-slate-400"}`}
            >
              Status Akun
              {initialStatus.storeName
                ? ` - ${String(initialStatus.storeName).toUpperCase()}`
                : ""}
            </h3>
            <div
              className={`text-2xl md:text-3xl font-black ${isExpired ? "text-red-700" : "text-white"}`}
            >
              {status.plan === "PRO_YEARLY_BUNDLE"
                ? "Pro 1 Tahun + Hardware"
                : status.plan === "PRO_YEARLY"
                  ? "Pro 1 Tahun"
                  : status.plan === "PRO_SEMI_ANNUAL"
                    ? "Pro 6 Bulan"
                    : "Free Trial"}
            </div>
            {activeEndsAt && (
              <div
                className={`text-xs mt-1.5 font-medium ${isExpired ? "text-red-500" : "text-slate-400"}`}
              >
                Berakhir:{" "}
                {new Date(activeEndsAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>

        <div
          className={`w-full md:w-auto p-4 rounded-2xl border ${isExpired ? "bg-white/60 border-red-100" : "bg-slate-800/50 border-slate-700"}`}
        >
          <div
            className={`flex items-center justify-center gap-2 mb-3 font-medium ${isExpired ? "text-red-600" : "text-slate-300"}`}
          >
            <Clock className="w-4 h-4" /> Sisa Waktu
          </div>
          {mounted ? (
            timeLeft ? (
              <div className="grid grid-cols-4 gap-2 md:gap-3 text-center min-w-[240px]">
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    HARI
                  </span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    JAM
                  </span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    MNT
                  </span>
                </div>
                <div className="flex flex-col bg-slate-800/80 rounded-lg p-2 border border-slate-700">
                  <span className="text-xl font-black text-white">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    DTK
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xl font-black text-red-600 text-center min-w-[240px]">
                Kedaluwarsa
              </div>
            )
          ) : (
            <div className="text-sm font-bold text-slate-400 text-center min-w-[240px]">
              Menghitung...
            </div>
          )}
        </div>
      </div>

      {/* PRICING CATALOG COMPONENT */}
      <div id="pricing-section" className="scroll-mt-8">
        <PricingSection currentPlan={status.plan} />
      </div>
    </div>
  );
}

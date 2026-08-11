"use client";

import { useEffect, useState } from "react";

interface SubscriptionTimerProps {
  endsAt: string | null;
  plan?: string;
}

export function SubscriptionTimer({ endsAt, plan }: SubscriptionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!endsAt) return;

    const calculateTimeLeft = () => {
      if (endsAt === "null" || endsAt === "undefined") return;
      const targetTime = new Date(endsAt).getTime();
      const currentTime = new Date().getTime();
      
      if (isNaN(targetTime)) return;
      
      const difference = targetTime - currentTime;
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
      } else {
        setIsExpired(false);
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
  }, [endsAt]);

  if (!mounted) {
    return <p className="text-[11px] font-bold text-white mt-1 mb-3">Menghitung...</p>;
  }

  if (!endsAt || endsAt === "null" || endsAt === "undefined") {
    return <p className="text-[11px] text-slate-300 mt-1 mb-3">Belum ada paket aktif</p>;
  }

  if (isExpired) {
    return (
      <div className="mt-1 mb-3">
        <p className="text-[12px] font-black text-red-500">Status: Kedaluwarsa</p>
      </div>
    );
  }

  if (!timeLeft) {
      return null;
  }

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(endsAt));

  return (
    <div className="mt-1 mb-3">
      <p className="text-[12px] font-bold text-emerald-400">Status: Aktif</p>
      <p className="text-[10px] text-slate-400 mt-0.5 mb-1">
        Berakhir: {formattedDate}
      </p>
      <p className="text-[11px] font-medium text-slate-200 mt-0.5">
        Sisa: {timeLeft.days} Hari {timeLeft.hours} Jam {timeLeft.minutes} Menit {timeLeft.seconds} Detik
      </p>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Clock, ChevronDown, Check, X } from "lucide-react";

interface ModernTimePickerProps {
  value: string; // e.g. "08:00"
  onChange: (time: string) => void;
  id?: string;
  label?: string;
  title?: string;
  disabledSlots?: string[];
  placeholder?: string;
  className?: string;
  theme?: "amber" | "emerald" | "blue";
  size?: "sm" | "md" | "lg";
}

// 48 slot per 30 menit
const ALL_TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, "0");
    slots.push(`${hh}:00`);
    slots.push(`${hh}:30`);
  }
  return slots;
})();

type TimePeriod = "all" | "pagi" | "siang" | "sore" | "malam" | "dini_hari";

const PERIOD_CONFIG: Record<TimePeriod, { label: string; icon: string; minHour: number; maxHour: number }> = {
  all: { label: "Semua Jam", icon: "⏰", minHour: 0, maxHour: 24 },
  pagi: { label: "Pagi", icon: "🌅", minHour: 6, maxHour: 11 },
  siang: { label: "Siang", icon: "☀️", minHour: 11, maxHour: 15 },
  sore: { label: "Sore", icon: "🌤️", minHour: 15, maxHour: 18 },
  malam: { label: "Malam", icon: "🌙", minHour: 18, maxHour: 24 },
  dini_hari: { label: "Subuh / Dini Hari", icon: "🌌", minHour: 0, maxHour: 6 },
};

function getTimePeriod(time: string): { label: string; emoji: string } {
  const [h] = (time || "08:00").split(":").map(Number);
  if (h >= 6 && h < 11) return { label: "Pagi", emoji: "🌅" };
  if (h >= 11 && h < 15) return { label: "Siang", emoji: "☀️" };
  if (h >= 15 && h < 18) return { label: "Sore", emoji: "🌤️" };
  if (h >= 18 && h < 24) return { label: "Malam", emoji: "🌙" };
  if (h >= 0 && h < 4) return { label: "Dini Hari", emoji: "🌌" };
  return { label: "Subuh", emoji: "🌄" };
}

export default function ModernTimePicker({
  value,
  onChange,
  id,
  label,
  title,
  disabledSlots = [],
  placeholder = "Pilih Jam",
  className = "",
  theme = "amber",
  size = "md",
}: ModernTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("all");
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter slots sesuai tab waktu
  const displayedSlots = useMemo(() => {
    if (activePeriod === "all") return ALL_TIME_SLOTS;
    const { minHour, maxHour } = PERIOD_CONFIG[activePeriod];
    return ALL_TIME_SLOTS.filter((time) => {
      const [h] = time.split(":").map(Number);
      return h >= minHour && h < maxHour;
    });
  }, [activePeriod]);

  const currentTime = value || "08:00";
  const periodInfo = getTimePeriod(currentTime);

  // Theme styling
  const themeClasses = {
    amber: {
      borderFocus: "focus:border-amber-500 focus:ring-amber-200 border-amber-300/80 hover:border-amber-400",
      activeChip: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black shadow-md shadow-amber-500/30 ring-2 ring-amber-400",
      activePill: "bg-amber-500 text-white shadow-xs font-bold",
      accentText: "text-amber-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-500",
    },
    emerald: {
      borderFocus: "focus:border-emerald-500 focus:ring-emerald-200 border-emerald-300/80 hover:border-emerald-400",
      activeChip: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400",
      activePill: "bg-emerald-600 text-white shadow-xs font-bold",
      accentText: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    blue: {
      borderFocus: "focus:border-blue-500 focus:ring-blue-200 border-blue-300/80 hover:border-blue-400",
      activeChip: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md shadow-blue-500/30 ring-2 ring-blue-400",
      activePill: "bg-blue-600 text-white shadow-xs font-bold",
      accentText: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-500",
    },
  }[theme];

  const handleSelectTime = (time: string) => {
    if (disabledSlots.includes(time)) return;
    onChange(time);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button - Modern Pill Design */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        title={title || label || "Pilih Jam"}
        onClick={() => setIsOpen(true)}
        className={`group relative flex items-center justify-between gap-1.5 bg-white rounded-xl border transition-all text-slate-800 shadow-xs cursor-pointer select-none text-left whitespace-nowrap ${themeClasses.borderFocus} ${
          size === "sm" ? "px-2.5 py-1.5 text-xs" : size === "lg" ? "px-3.5 py-3 text-sm" : "px-3 py-2.5 sm:py-3 text-xs sm:text-sm"
        } ${className}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${themeClasses.iconColor}`} />
          <span className="font-extrabold text-slate-900 tracking-tight text-xs sm:text-sm">
            {currentTime}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">WIB</span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ml-1 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Modal / Dialog Overlay - Menggunakan React Portal agar tidak terpotong overflow container */}
      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[80vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-amber-100/70 text-amber-700`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                    {label || "Pilih Jam (WIB)"}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format 24 Jam • Interval 30 Menit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block font-medium">Terpilih:</span>
                  <span className="text-xs font-extrabold text-slate-800">{currentTime} WIB ({periodInfo.emoji} {periodInfo.label})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Period Filter Pills */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {(Object.keys(PERIOD_CONFIG) as TimePeriod[]).map((periodKey) => {
                const cfg = PERIOD_CONFIG[periodKey];
                const isActive = activePeriod === periodKey;
                return (
                  <button
                    key={periodKey}
                    type="button"
                    onClick={() => setActivePeriod(periodKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? themeClasses.activePill
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
                    }`}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Slots Grid (4 Kolom Rapi) */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-[220px]">
              <div className="grid grid-cols-4 gap-2">
                {displayedSlots.map((time) => {
                  const isSelected = currentTime === time;
                  const isBooked = disabledSlots.includes(time);

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => handleSelectTime(time)}
                      className={`relative py-2.5 px-1.5 rounded-xl text-center text-xs sm:text-sm transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? themeClasses.activeChip
                          : isBooked
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-55 border border-slate-200"
                          : "bg-slate-50 hover:bg-amber-50/80 text-slate-800 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 font-bold active:scale-95"
                      }`}
                    >
                      <span className="font-extrabold tracking-tight">
                        {time}
                      </span>
                      {isSelected ? (
                        <span className="text-[9px] font-black tracking-wider flex items-center gap-0.5 opacity-90">
                          <Check className="w-2.5 h-2.5 stroke-[3]" /> AKTIF
                        </span>
                      ) : isBooked ? (
                        <span className="text-[9px] font-medium text-rose-500">
                          Penuh
                        </span>
                      ) : (
                        <span className="text-[9px] font-medium text-slate-400">
                          WIB
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="p-3 sm:px-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Ketuk salah satu jam untuk memilih langsung</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold text-xs hover:bg-slate-900 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
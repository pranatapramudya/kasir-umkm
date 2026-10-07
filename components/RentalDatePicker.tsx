"use client";

import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";

// Helper to convert Date to local ISO string (YYYY-MM-DD) safely
function toLocalISOString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD to a local Date object at midnight
function parseLocalISOString(dateString: string) {
  if (!dateString) return undefined;
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface RentalDatePickerProps {
  slug: string;
  productId: string;
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  onClearError?: () => void;
}

export function RentalDatePicker({ slug, productId, startDate, endDate, onChange, onClearError }: RentalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookedRanges, setBookedRanges] = useState<{ startDate: string, endDate: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for the picker selection
  const [range, setRange] = useState<DateRange | undefined>({
    from: parseLocalISOString(startDate),
    to: parseLocalISOString(endDate)
  });

  // Fetch availability when opening modal or productId changes
  useEffect(() => {
    if (!isOpen || !productId) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    fetch(`/api/booking/availability?slug=${encodeURIComponent(slug)}&serviceId=${encodeURIComponent(productId)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.bookedRanges) {
          setBookedRanges(data.bookedRanges);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [isOpen, productId, slug]);

  // Sync props to local state if changed from outside
  useEffect(() => {
    setRange({
      from: parseLocalISOString(startDate),
      to: parseLocalISOString(endDate)
    });
  }, [startDate, endDate]);

  const disabledDates = bookedRanges.map(br => {
    return {
      from: parseLocalISOString(br.startDate.split("T")[0])!,
      to: parseLocalISOString(br.endDate.split("T")[0])!
    };
  });
  
  // Prevent past dates from being selectable
  const todayLocal = new Date();
  todayLocal.setHours(0,0,0,0);
  disabledDates.push({ from: new Date(0), to: new Date(todayLocal.getTime() - 86400000) });

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    onClearError?.();
  };

  const handleConfirm = () => {
    if (range?.from && range?.to) {
      // Validasi apakah rentang yang dipilih beririsan dengan disabled dates
      let isOverlap = false;
      const rFrom = range.from.getTime();
      const rTo = range.to.getTime();
      
      for (const br of bookedRanges) {
        const brFrom = parseLocalISOString(br.startDate.split("T")[0])!.getTime();
        const brTo = parseLocalISOString(br.endDate.split("T")[0])!.getTime();
        
        if (rFrom <= brTo && rTo >= brFrom) {
          isOverlap = true;
          break;
        }
      }
      
      if (isOverlap) {
        alert("Pilihan Anda beririsan dengan tanggal yang sudah dipesan. Silakan pilih rentang yang valid.");
        setRange({ from: undefined, to: undefined });
        return;
      }
      
      onChange(toLocalISOString(range.from), toLocalISOString(range.to));
      setIsOpen(false);
    } else if (range?.from && !range?.to) {
      // Jika hanya pilih start, asumsikan 1 hari (start = end)
      onChange(toLocalISOString(range.from), toLocalISOString(range.from));
      setIsOpen(false);
    } else {
      alert("Silakan pilih tanggal keberangkatan dan kepulangan.");
    }
  };

  const displayFormat = (dateStr: string) => {
    if (!dateStr) return "Pilih Tanggal";
    const d = parseLocalISOString(dateStr);
    return d ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";
  };

  return (
    <>
      <div className="space-y-1.5" onClick={() => setIsOpen(true)}>
        <label className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">
          <span>Jadwal Tanggal Berangkat & Kepulangan *</span>
          <span className="text-amber-600 font-bold normal-case text-xs">Klik buka kalender</span>
        </label>
        <div className="w-full bg-white border border-slate-200 hover:border-amber-500 rounded-xl px-3.5 py-3 text-slate-900 text-[13px] sm:text-sm cursor-pointer shadow-sm transition-all flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span className="font-semibold">{startDate ? displayFormat(startDate) : "Pilih Tgl Berangkat"}</span>
          </div>
          <span className="text-amber-500 font-bold mx-2">➜</span>
          <div className="flex items-center gap-2 text-right">
            <span className="font-semibold">{endDate ? displayFormat(endDate) : "Pilih Tgl Pulang"}</span>
            <span className="text-base">🏁</span>
          </div>
        </div>
      </div>

      {/* Modal Kalender Indonesia */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Kalender Sewa & Perjalanan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Waktu Indonesia (WIB) - Jadwal Terverifikasi</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
                title="Tutup Kalender"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Helper Text UX Berbahasa Indonesia */}
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-left">
              <span className="text-amber-600 shrink-0 text-base">ℹ️</span>
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Cara Memilih:</strong> Klik tanggal <strong>BERANGKAT</strong>, lalu klik tanggal <strong>KEPULANGAN</strong>. Tanggal yang dicoret menandakan armada sudah terisi penuh oleh rombongan lain.
              </p>
            </div>
            
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center gap-2">
                <svg className="w-8 h-8 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-xs text-slate-500">Memeriksa ketersediaan armada...</span>
              </div>
            ) : (
              <div className="flex justify-center rd-picker-custom overflow-x-auto p-1">
                <DayPicker
                  locale={id}
                  mode="range"
                  selected={range}
                  onSelect={handleSelect}
                  disabled={disabledDates}
                  className="bg-white"
                  classNames={{
                    day: "text-slate-900 font-medium",
                    selected: "bg-amber-500 text-white hover:bg-amber-600 hover:text-white font-bold",
                    disabled: "text-slate-300 line-through bg-slate-50 cursor-not-allowed",
                    month_caption: "text-slate-900 font-bold text-base capitalize",
                    weekday: "text-slate-600 font-semibold text-xs capitalize",
                    button_next: "text-slate-800 hover:bg-slate-100 rounded-lg p-1",
                    button_previous: "text-slate-800 hover:bg-slate-100 rounded-lg p-1",
                    chevron: "text-slate-800 fill-slate-800"
                  }}
                />
              </div>
            )}

            {range?.from && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-slate-500">Jadwal Terpilih: </span>
                  <span className="font-bold text-slate-900">
                    {displayFormat(toLocalISOString(range.from))}
                    {range.to && ` s/d ${displayFormat(toLocalISOString(range.to))}`}
                  </span>
                </div>
              </div>
            )}
            
            <div className="mt-5 border-t border-slate-100 pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={handleConfirm}
                disabled={!range?.from}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-md"
              >
                Gunakan Jadwal Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

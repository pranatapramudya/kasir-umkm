"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Timer,
  Check,
  Eye,
  Sliders
} from "lucide-react";
import { toast } from "sonner";
import ModernTimePicker from "@/components/ModernTimePicker";

interface Props {
  initialOpenTime?: string | null;
  initialCloseTime?: string | null;
  initialSlotDuration?: number | null;
}

const DURATION_PRESETS = [
  { value: 15, label: "15 Menit", tag: "Kilat", desc: "Express / Cepat" },
  { value: 30, label: "30 Menit", tag: "Standar", desc: "Paling Populer" },
  { value: 45, label: "45 Menit", tag: "Medium", desc: "Potong + Cuci" },
  { value: 60, label: "1 Jam", tag: "Lengkap", desc: "Perawatan Full" },
  { value: 90, label: "1.5 Jam", tag: "Spesial", desc: "Treatment Berat" },
  { value: 120, label: "2 Jam", tag: "Maksimal", desc: "Layanan Ekstra" },
];

function getTimePeriodInfo(timeStr: string) {
  const [h] = timeStr.split(":").map(Number);
  if (h >= 5 && h < 12) return { label: "Pagi", icon: Sun, color: "text-amber-500 bg-amber-50 border-amber-200" };
  if (h >= 12 && h < 15) return { label: "Siang", icon: Sun, color: "text-orange-500 bg-orange-50 border-orange-200" };
  if (h >= 15 && h < 18) return { label: "Sore", icon: Sunset, color: "text-rose-500 bg-rose-50 border-rose-200" };
  return { label: "Malam", icon: Moon, color: "text-indigo-500 bg-indigo-50 border-indigo-200" };
}

function parseMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function BookingScheduleForm({
  initialOpenTime,
  initialCloseTime,
  initialSlotDuration,
}: Props) {
  const [openTime, setOpenTime] = useState(initialOpenTime || "08:00");
  const [closeTime, setCloseTime] = useState(initialCloseTime || "21:00");
  const [slotDuration, setSlotDuration] = useState<number>(initialSlotDuration || 30);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perhitungan slot simulasi live
  const previewSlots = useMemo(() => {
    const slots: string[] = [];
    const startMins = parseMinutes(openTime);
    const endMins = parseMinutes(closeTime);
    const step = slotDuration > 0 ? slotDuration : 30;

    if (startMins >= endMins) return [];

    for (let current = startMins; current <= endMins; current += step) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      if (h < 24) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  }, [openTime, closeTime, slotDuration]);

  // Total durasi operasional
  const totalOperationalHours = useMemo(() => {
    const startMins = parseMinutes(openTime);
    const endMins = parseMinutes(closeTime);
    if (startMins >= endMins) return 0;
    const diff = endMins - startMins;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (m === 0) return `${h} Jam`;
    return `${h} Jam ${m} Mnt`;
  }, [openTime, closeTime]);

  const openPeriod = getTimePeriodInfo(openTime);
  const closePeriod = getTimePeriodInfo(closeTime);
  const OpenIcon = openPeriod.icon;
  const CloseIcon = closePeriod.icon;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (parseMinutes(openTime) >= parseMinutes(closeTime)) {
      setError("Jam mulai buka harus lebih awal dari jam tutup/sesi terakhir.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/tenant/booking-schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingOpenTime: openTime,
          bookingCloseTime: closeTime,
          bookingSlotDuration: slotDuration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan pengaturan jadwal.");
        return;
      }

      setSuccess(true);
      toast.success("Jadwal operasional & jeda booking berhasil diperbarui!");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Header Card dengan Nuansa Emerald Modern */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Jadwal & Jam Kunjungan Booking
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> Jasa & Servis
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi jam operasional harian dan interval sesi antrian janji temu pelanggan.
              </p>
            </div>
          </div>

          {/* Quick Badge Operasional */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-semibold text-slate-700 shadow-2xs">
            <Timer className="w-3.5 h-3.5 text-emerald-600" />
            <span>Operasional: <b className="text-emerald-700">{totalOperationalHours || "Invalid"}</b></span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>Pengaturan jadwal booking berhasil disimpan dan otomatis disinkronkan ke link booking publik pelanggan!</span>
          </div>
        )}

        {/* ── BAGIAN 1: PEMILIH JAM BUKA & TUTUP (MODERN TIME PICKER) ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Jam Operasional Layanan</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Ketuk untuk membuka modal jam interaktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Jam Mulai Buka */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 hover:border-emerald-300 transition-all group shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Slot Pertama (Buka)
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${openPeriod.color}`}>
                  <OpenIcon className="w-2.5 h-2.5" /> {openPeriod.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ModernTimePicker
                  id="booking-open-time"
                  currentTime={openTime}
                  onChange={(val) => {
                    setOpenTime(val);
                    setError(null);
                    setSuccess(false);
                  }}
                  theme="emerald"
                  size="lg"
                  label="Jam Mulai Buka"
                  className="w-full !rounded-xl !border-slate-200/90 hover:!border-emerald-400 !bg-white !py-3 !shadow-xs"
                />
              </div>

              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Jam paling awal pelanggan dapat membuat janji temu.
              </p>
            </div>

            {/* Jam Tutup / Selesai */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 hover:border-emerald-300 transition-all group shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Sesi Terakhir (Tutup)
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${closePeriod.color}`}>
                  <CloseIcon className="w-2.5 h-2.5" /> {closePeriod.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ModernTimePicker
                  id="booking-close-time"
                  currentTime={closeTime}
                  onChange={(val) => {
                    setCloseTime(val);
                    setError(null);
                    setSuccess(false);
                  }}
                  theme="emerald"
                  size="lg"
                  label="Jam Tutup / Sesi Terakhir"
                  className="w-full !rounded-xl !border-slate-200/90 hover:!border-emerald-400 !bg-white !py-3 !shadow-xs"
                />
              </div>

              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>
                Batas waktu sesi booking terakhir yang dapat dipilih.
              </p>
            </div>
          </div>
        </div>

        {/* ── BAGIAN 2: DURASI / JEDA WAKTU PER SESI (MODERN CARDS) ── */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Durasi & Interval Jeda Tiap Sesi</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Terpilih: {DURATION_PRESETS.find(d => d.value === slotDuration)?.label || `${slotDuration} Menit`}
            </span>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {DURATION_PRESETS.map((opt) => {
              const isSelected = slotDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSlotDuration(opt.value);
                    setError(null);
                    setSuccess(false);
                  }}
                  className={`relative p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400 scale-[1.02]"
                      : "bg-slate-50/70 hover:bg-emerald-50/50 text-slate-800 border-slate-200/90 hover:border-emerald-300 hover:shadow-xs active:scale-98"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/70 text-slate-600"
                      }`}
                    >
                      {opt.tag}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="block font-black text-sm tracking-tight">
                      {opt.label}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 truncate ${
                        isSelected ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BAGIAN 3: LIVE PREVIEW SLOT DI HALAMAN PELANGGAN ── */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-4.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                Simulasi Tampilan Slot Jam di Halaman Pelanggan
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Total {previewSlots.length} Slot Waktu Tersedia
            </span>
          </div>

          {/* Slot Chips Container */}
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 no-scrollbar">
            {previewSlots.length > 0 ? (
              previewSlots.map((slot, idx) => (
                <span
                  key={slot}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-tight transition-all border ${
                    idx === 0
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {slot} <span className="text-[9px] font-medium opacity-70">WIB</span>
                  {idx === 0 && <span className="text-[8px] bg-white/20 px-1 py-0.2 rounded font-black ml-0.5">SLOT 1</span>}
                </span>
              ))
            ) : (
              <span className="text-xs text-rose-500 font-semibold italic">
                Jam buka dan jam tutup belum valid. Pastikan jam buka lebih awal dari jam tutup.
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 leading-relaxed">
            💡 Pelanggan hanya dapat memilih dari slot jam di atas saat membuat janji temu online. Setiap slot memiliki jeda <b>{slotDuration} menit</b>.
          </p>
        </div>

        {/* ── ACTION BUTTON ── */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            Perubahan langsung tersinkron ke link booking publik.
          </div>

          <button
            type="submit"
            disabled={isLoading || parseMinutes(openTime) >= parseMinutes(closeTime)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Jadwal Booking</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

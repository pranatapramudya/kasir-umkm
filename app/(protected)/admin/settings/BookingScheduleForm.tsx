"use client";

import { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialOpenTime?: string | null;
  initialCloseTime?: string | null;
  initialSlotDuration?: number | null;
}

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const DURATION_OPTIONS = [
  { value: 15, label: "15 Menit (Kilat)" },
  { value: 30, label: "30 Menit (Standar)" },
  { value: 45, label: "45 Menit" },
  { value: 60, label: "60 Menit (1 Jam)" },
  { value: 90, label: "90 Menit (1.5 Jam)" },
  { value: 120, label: "120 Menit (2 Jam)" },
];

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (openTime >= closeTime) {
      setError("Jam buka harus lebih awal dari jam tutup.");
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Card */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">
              Jadwal & Jam Kunjungan Booking
            </h2>
            <p className="text-xs text-slate-500">
              Khusus Jasa / Servis: Atur jam buka, jam tutup, dan durasi jeda per sesi kunjungan pelanggan.
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="p-6 space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pengaturan jadwal booking berhasil disimpan dan otomatis diterapkan di link booking publik!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jam Mulai Buka */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jam Mulai Buka (Slot Pertama) *
            </label>
            <select
              value={openTime}
              onChange={(e) => {
                setOpenTime(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={`open-${time}`} value={time}>
                  {time} WIB
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Jam paling awal pelanggan bisa membuat janji temu.
            </p>
          </div>

          {/* Jam Tutup / Selesai */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jam Tutup / Sesi Terakhir *
            </label>
            <select
              value={closeTime}
              onChange={(e) => {
                setCloseTime(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={`close-${time}`} value={time}>
                  {time} WIB
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Batas jam sesi terakhir yang bisa dipesan pelanggan.
            </p>
          </div>
        </div>

        {/* Jeda Waktu Per Sesi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Durasi / Jeda Waktu Per Sesi *
          </label>
          <select
            value={slotDuration}
            onChange={(e) => {
              setSlotDuration(Number(e.target.value));
              setError(null);
              setSuccess(false);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Contoh: Jika memilih <b>60 Menit (1 Jam)</b> dengan jam buka <b>08:00 - 17:00</b>, maka kotak slot jam yang muncul di halaman pelanggan adalah: <i>08:00, 09:00, 10:00, dst</i>.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Jadwal Booking"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

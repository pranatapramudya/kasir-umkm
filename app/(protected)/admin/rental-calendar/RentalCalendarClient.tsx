"use client";

import React, { useState } from "react";
import {
  format, addDays, subDays, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, isSameDay, isSameMonth,
  addMonths, subMonths, eachDayOfInterval
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock, 
  User, 
  CarFront, 
  Bed, 
  Key, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Package,
  AlertTriangle,
  MessageCircle,
  LogIn,
  LogOut,
  Sparkles,
  Copy,
  ExternalLink,
  Share2
} from "lucide-react";
import { startOrder, finishOrder, approveOrder } from "../orders/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { detectRentalItemType, getTenantRentalType } from "@/lib/business-category";

type BookingStatus = "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE";

interface Booking {
  id: string;
  customerName: string;
  customerPhone?: string | null;
  itemName: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  // Equipment/Alat fields
  returnTime?: string | null;
  deposit?: number | null;
  conditionNotes?: string | null;
  source?: "ONLINE" | "POS";
}

interface Props {
  initialBookings: Booking[];
  tenantId: string;
  tenantCategory?: string;
  tenantSlug?: string | null;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string, bg: string }> = {
  PENDING: { label: "Menunggu", bg: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "Sedang Disewa", bg: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "Berjalan", bg: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Terlambat", bg: "bg-red-100 text-red-700" },
  FINISHED: { label: "Selesai", bg: "bg-gray-100 text-gray-700" }
};

export default function RentalCalendarClient({ initialBookings, tenantId, tenantCategory, tenantSlug }: Props) {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Realtime hook
  useSupabaseRealtime(tenantId);
  
  // SWR for fetching calendar data with auto-refresh fallback
  const { data, mutate, isLoading } = useSWR<{ bookings: Booking[] }>(
    tenantId ? ["/api/booking/calendar", tenantId] : null,
    (args: string | [string, string]) => fetch(Array.isArray(args) ? args[0] : args).then((res) => res.json()),
    {
      fallbackData: { bookings: initialBookings },
      keepPreviousData: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000,
    }
  );
  
  // Deteksi kategori rental untuk terminologi agenda otomatis
  const rentalNiche = React.useMemo(() => {
    return getTenantRentalType(tenantCategory) || "property";
  }, [tenantCategory]);

  const getStatusBadge = (status: BookingStatus, niche: "property" | "vehicle" | "equipment") => {
    switch (status) {
      case "PENDING":
        return { label: "Menunggu Konfirmasi", bg: "bg-amber-100 text-amber-800 border-amber-200" };
      case "COMPLETED":
        if (niche === "property") return { label: "Siap Check-in", bg: "bg-blue-100 text-blue-800 border-blue-200" };
        if (niche === "vehicle") return { label: "Siap Berangkat", bg: "bg-blue-100 text-blue-800 border-blue-200" };
        return { label: "Siap Diambil", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      case "IN_PROGRESS":
        if (niche === "property") return { label: "Tamu Menginap", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
        if (niche === "vehicle") return { label: "Sedang Jalan", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
        return { label: "Sedang Disewa", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "OVERDUE":
        if (niche === "property") return { label: "Lewat Waktu Check-out", bg: "bg-rose-100 text-rose-800 border-rose-200" };
        if (niche === "vehicle") return { label: "Terlambat Kembali", bg: "bg-rose-100 text-rose-800 border-rose-200" };
        return { label: "Terlambat Pengembalian", bg: "bg-rose-100 text-rose-800 border-rose-200" };
      case "FINISHED":
        return { label: "Selesai", bg: "bg-slate-100 text-slate-700 border-slate-200" };
      default:
        return { label: status, bg: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const getActionLabels = (niche: "property" | "vehicle" | "equipment") => {
    if (niche === "property") {
      return {
        start: "🔑 Check-in Tamu",
        finish: "🛎️ Check-out Selesai",
        customerTitle: "Tamu / Pemesan",
        itemTitle: "Kamar / Unit",
        startLabel: "Waktu Check-in",
        endLabel: "Waktu Check-out",
        finishModalTitle: "Check-out Kamar & Penyelesaian",
      };
    }
    if (niche === "vehicle") {
      return {
        start: "🚗 Serah Kunci / Jalan",
        finish: "🏁 Terima Armada Kembali",
        customerTitle: "Penyewa Armada",
        itemTitle: "Unit Kendaraan",
        startLabel: "Mulai Sewa / Ambil",
        endLabel: "Jadwal Kembali",
        finishModalTitle: "Pengembalian Armada & Selesai",
      };
    }
    return {
      start: "📦 Serah Alat ke Penyewa",
      finish: "📥 Terima Pengembalian Alat",
      customerTitle: "Penyewa Alat",
      itemTitle: "Peralatan / Barang",
      startLabel: "Waktu Pengambilan",
      endLabel: "Batas Waktu Pengembalian",
      finishModalTitle: "Pengembalian Alat & Selesai",
    };
  };

  const actionLabels = getActionLabels(rentalNiche);
  const calendarBookings = data?.bookings || [];

  const safeDate = (dateStr?: string | null) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [finishingOrder, setFinishingOrder] = useState<Booking | null>(null);
  const [overtimeFee, setOvertimeFee] = useState<string>("0");
  const [isFinishing, setIsFinishing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !data) {
    return (
      <div className="flex flex-col h-full bg-slate-50 min-h-screen p-4 items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat Kalender...</p>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    toast.loading("Memproses...", { id: "approve" });
    const res = await approveOrder(id);
    if (res.success) {
      toast.success("Disetujui!", { id: "approve" });
      router.refresh();
    } else {
      toast.error("Gagal menyetujui", { id: "approve" });
    }
  };

  const handleStart = async (id: string) => {
    toast.loading("Memproses...", { id: "start" });
    const res = await startOrder(id);
    if (res.success) {
      toast.success("Sewa dimulai!", { id: "start" });
      router.refresh();
    } else {
      toast.error("Gagal", { id: "start" });
    }
  };

  const handleFinishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishingOrder) return;
    setIsFinishing(true);
    const fee = parseInt(overtimeFee.replace(/\D/g, ""), 10) || 0;
    const res = await finishOrder(finishingOrder.id, fee);
    if (res.success) {
      toast.success("Pesanan selesai!");
      setFinishingOrder(null);
      router.refresh();
    } else {
      toast.error("Gagal menyelesaikan");
    }
    setIsFinishing(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  // Check if a date has any active booking
  // Removed hasBooking as getBookingsForDate handles both logic

  // Get bookings for selected date
  const getBookingsForDate = (day: Date) => {
    return calendarBookings.filter(b => {
      if (!b?.startDate || !b?.endDate) return false;
      if (filter !== "ALL" && b.status !== filter) return false;
      const start = new Date(b.startDate).setHours(0, 0, 0, 0);
      const end = new Date(b.endDate).setHours(0, 0, 0, 0);
      const check = new Date(day).setHours(0, 0, 0, 0);
      return check >= start && check <= end;
    });
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Kalender Sewa
          </h1>
          {tenantSlug && (
            <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs flex-wrap sm:flex-nowrap">
              <span className="text-slate-500 font-medium">Link Reservasi:</span>
              <span className="font-mono text-blue-700 font-bold truncate max-w-[170px] sm:max-w-[200px]">
                /book/{tenantSlug}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/book/${tenantSlug}`;
                    navigator.clipboard.writeText(url);
                    setCopiedLink(true);
                    toast.success("Link booking publik berhasil disalin!");
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-2 py-1 bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 font-bold text-[11px] shadow-xs"
                >
                  {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Tersalin" : "Salin"}</span>
                </button>
                <a
                  href={`/book/${tenantSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 font-bold text-[11px] shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Form</span>
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {(["ALL", "PENDING", "COMPLETED", "IN_PROGRESS", "FINISHED"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f === "ALL" ? "Semua" : STATUS_CONFIG[f as BookingStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Area */}
      <div className="bg-white p-4 mb-2 shadow-sm border-b border-slate-200">
        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={prevMonth} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="font-bold text-slate-800 text-lg">
            {format(currentDate, "MMMM yyyy", { locale: idLocale })}
          </h2>
          <button onClick={nextMonth} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Inner Scroll Container */}
        <div className="max-h-[55vh] overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-inner relative">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 sticky top-0 z-30 bg-white shadow-sm py-2 px-1 md:px-2 border-b border-slate-200">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
              <div key={i} className="text-center text-xs font-bold text-slate-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 p-1 md:p-2">
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const dayBookings = getBookingsForDate(day);

            return (
              <div
                key={i}
                onClick={() => onDateClick(day)}
                className={`flex flex-col border border-slate-100 rounded-xl p-1 md:p-2 min-h-[60px] md:min-h-[100px] cursor-pointer transition-all ${isSelected ? "bg-blue-50/50 border-blue-200" : "hover:bg-slate-50"
                  }`}
              >
                {/* Date Number */}
                <div className="flex justify-end mb-1">
                  <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full text-xs md:text-sm font-semibold transition-all ${isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : isToday
                      ? "bg-blue-100 text-blue-700"
                      : isCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-300"
                    }`}>
                    {format(day, dateFormat)}
                  </div>
                </div>

                {/* Event Badges */}
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  {dayBookings.slice(0, 2).map((b, idx) => (
                    <div key={idx} className={`truncate px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[9px] md:text-xs font-medium w-full ${(STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING).bg}`}>
                      {b.customerName || "Pelanggan Baru"}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-[9px] md:text-xs text-slate-400 font-medium px-1">
                      +{dayBookings.length - 2} lainnya
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Agenda/List Area */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Agenda: {format(selectedDate, "EEEE, dd MMM yyyy", { locale: idLocale })}
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
            {selectedDateBookings.length} Jadwal
          </span>
        </div>

        {selectedDateBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm font-medium">Kosong</p>
            <p className="text-slate-400 text-xs mt-1">Tidak ada jadwal sewa / reservasi untuk tanggal ini.</p>
          </div>
        ) : (
          selectedDateBookings.map((b) => {
            const badge = getStatusBadge(b.status, rentalNiche);
            const itemType = detectRentalItemType(b.itemName);

            // Cek collision / jadwal beririsan dengan booking lain di unit yang sama
            const bStart = new Date(b.startDate).getTime();
            const bEnd = new Date(b.endDate).getTime();
            const hasConflict = selectedDateBookings.some(other => {
              if (other.id === b.id || other.itemName !== b.itemName || other.status === "FINISHED") return false;
              const oStart = new Date(other.startDate).getTime();
              const oEnd = new Date(other.endDate).getTime();
              return bStart <= oEnd && bEnd >= oStart;
            });

            return (
              <div key={b.id} className={`bg-white rounded-2xl p-4 border transition-all ${
                hasConflict ? "border-rose-300 shadow-sm shadow-rose-100 ring-1 ring-rose-300" : "border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
              } flex flex-col gap-3`}>
                
                {/* Conflict Alert Banner */}
                {hasConflict && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 flex items-center gap-2 text-rose-700 text-xs font-semibold animate-pulse">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>⚠️ Peringatan: Jam sewa unit ini bertabrakan dengan jadwal lain!</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {itemType === "property" ? (
                        <Bed className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : itemType === "equipment" ? (
                        <Package className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <CarFront className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <h4 className="font-bold text-slate-800 text-sm truncate">{b.itemName || "Menunggu Info Unit"}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-600 font-medium truncate">{b.customerName || "Pelanggan Baru"}</p>
                      </div>
                      {b.customerPhone && (
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(
                            `Halo Kak ${b.customerName}, konfirmasi jadwal sewa ${b.itemName} pada ${format(safeDate(b.startDate), "dd MMM yyyy, HH:mm", { locale: idLocale })}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat WA
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border shrink-0 ${badge.bg}`}>
                    {badge.label}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex-1 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{actionLabels.startLabel}</span>
                      <span className="font-semibold text-slate-700">
                        {format(safeDate(b.startDate), "dd MMM, HH:mm", { locale: idLocale })} WIB
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 border-dashed" />
                  <div className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex-1 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{actionLabels.endLabel}</span>
                      <span className="font-semibold text-slate-700">
                        {format(safeDate(b.endDate), "dd MMM, HH:mm", { locale: idLocale })} WIB
                      </span>
                    </div>
                  </div>

                  {/* Extra Details */}
                  {(b.pickupLocation || b.dropoffLocation || b.returnTime || b.deposit || b.conditionNotes) && (
                    <>
                      <div className="border-t border-slate-200 border-dashed mt-1 mb-1" />
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {b.dropoffLocation && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Tujuan / Lokasi</span>
                            <span className="text-xs text-slate-700 font-medium truncate">{b.dropoffLocation}</span>
                          </div>
                        )}
                        {b.returnTime && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Jam Selesai</span>
                            <span className="text-xs text-slate-700 font-medium truncate">{b.returnTime}</span>
                          </div>
                        )}
                        {b.deposit && b.deposit > 0 && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Deposit Jaminan</span>
                            <span className="text-xs text-slate-700 font-medium truncate">Rp {new Intl.NumberFormat("id-ID").format(b.deposit)}</span>
                          </div>
                        )}
                        {b.conditionNotes && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Catatan Khusus</span>
                            <span className="text-xs text-slate-700 font-medium truncate">{b.conditionNotes}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Action Buttons */}
                {b.source === "ONLINE" && b.status !== "FINISHED" && (
                  <div className="flex gap-2 mt-1 pt-2 border-t border-slate-100">
                    {b.status === "PENDING" && (
                      <button onClick={() => handleApprove(b.id)} className="w-full px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                        ✅ Setujui Pesanan
                      </button>
                    )}
                    {b.status === "COMPLETED" && (
                      <button onClick={() => handleStart(b.id)} className="w-full px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5">
                        {actionLabels.start}
                      </button>
                    )}
                    {(b.status === "IN_PROGRESS" || b.status === "OVERDUE") && (
                      <button onClick={() => { setFinishingOrder(b); setOvertimeFee("0"); }} className="w-full px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5">
                        {actionLabels.finish}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Penyelesaian Sewa */}
      {finishingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800">Penyelesaian Sewa</h2>
              <button onClick={() => setFinishingOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFinishSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Penyewa</span>
                  <span className="font-semibold text-slate-800">{finishingOrder?.customerName || "Pelanggan Baru"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Unit/Layanan</span>
                  <span className="font-semibold text-slate-800">{finishingOrder?.itemName || "Menunggu Info Unit"}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Biaya Tambahan / Denda Overtime (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                  <input 
                    type="text" 
                    value={overtimeFee}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOvertimeFee(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                    }}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Isi jika penyewa melebihi batas waktu (overtime) atau ada biaya kerusakan. Kosongkan jika tidak ada.</p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isFinishing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isFinishing && <Loader2 className="w-5 h-5 animate-spin" />}
                  Konfirmasi Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

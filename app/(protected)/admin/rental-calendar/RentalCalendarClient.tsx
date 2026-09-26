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
import { startOrder, finishOrder, approveOrder, rejectOrder } from "../orders/actions";
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
  PENDING: { label: "Terjadwal", bg: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Terjadwal", bg: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "Aktif Digunakan", bg: "bg-emerald-100 text-emerald-800" },
  OVERDUE: { label: "Terlambat", bg: "bg-rose-100 text-rose-800" },
  FINISHED: { label: "Selesai", bg: "bg-slate-100 text-slate-700" }
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
      case "COMPLETED":
        if (niche === "property") return { label: "Terjadwal (Siap Check-in)", bg: "bg-blue-100 text-blue-800 border-blue-200" };
        if (niche === "vehicle") return { label: "Terjadwal (Siap Berangkat)", bg: "bg-blue-100 text-blue-800 border-blue-200" };
        return { label: "Terjadwal (Siap Diambil)", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      case "IN_PROGRESS":
        if (niche === "property") return { label: "Tamu Menginap", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
        if (niche === "vehicle") return { label: "Sedang Digunakan", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
        return { label: "Sedang Disewa", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "OVERDUE":
        if (niche === "property") return { label: "Lewat Waktu Check-out", bg: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse" };
        if (niche === "vehicle") return { label: "Terlambat Pengembalian", bg: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse" };
        return { label: "Terlambat Pengembalian", bg: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse" };
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
        finish: "🛎️ Check-out & Selesai",
        customerTitle: "Tamu / Pemesan",
        itemTitle: "Kamar / Unit",
        startLabel: "Waktu Check-in",
        endLabel: "Waktu Check-out",
        finishModalTitle: "Check-out Kamar & Selesai",
      };
    }
    if (niche === "vehicle") {
      return {
        start: "🚗 Serah Kunci / Jalan",
        finish: "🏁 Terima Armada & Selesai",
        customerTitle: "Penyewa Armada",
        itemTitle: "Unit Kendaraan",
        startLabel: "Mulai Sewa / Ambil",
        endLabel: "Jadwal Kembali",
        finishModalTitle: "Pengembalian Armada & Selesai",
      };
    }
    return {
      start: "📦 Serah Alat ke Penyewa",
      finish: "📥 Terima Alat & Selesai",
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

  const handleFinishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishingOrder) return;
    setIsFinishing(true);
    const fee = parseInt(overtimeFee.replace(/\D/g, ""), 10) || 0;
    const res = await finishOrder(finishingOrder.id, fee);
    if (res.success) {
      toast.success("Pesanan berhasil diselesaikan!");
      setFinishingOrder(null);
      await mutate();
      router.refresh();
    } else {
      toast.error("Gagal menyelesaikan pesanan");
    }
    setIsFinishing(false);
  };

  const handleCancelOrder = async (id: string, name: string) => {
      if (!confirm(`Yakin ingin membatalkan reservasi oleh ${name}?`)) return;
      toast.loading("Membatalkan...", { id: `cancel-${id}` });
      const res = await rejectOrder(id);
      if (res.success) {
        toast.success("Reservasi dibatalkan", { id: `cancel-${id}` });
        await mutate();
        router.refresh();
      } else {
        toast.error("Gagal membatalkan reservasi", { id: `cancel-${id}` });
      }
    };

    const handleApprove = async (id: string) => {
      toast.loading("Memproses...", { id: "approve" });
      const res = await approveOrder(id);
      if (res.success) {
        toast.success("Disetujui!", { id: "approve" });
        await mutate();
        router.refresh();
      } else {
        toast.error("Gagal menyetujui", { id: "approve" });
      }
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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 border-b border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              Kalender Sewa & Reservasi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola jadwal booking, check-in, dan ketersediaan unit secara real-time.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
            {rentalNiche === "property" ? "🏢 Properti & Kamar" : rentalNiche === "vehicle" ? "🚗 Rental & Travel" : "📦 Rental Alat & Barang"}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {([
            { value: "ALL", label: "Semua" },
            { value: "COMPLETED", label: "Terjadwal" },
            { value: "IN_PROGRESS", label: rentalNiche === "property" ? "Tamu Menginap" : rentalNiche === "vehicle" ? "Sedang Digunakan" : "Sedang Disewa" },
            { value: "OVERDUE", label: rentalNiche === "property" ? "Lewat Check-out" : "Terlambat" },
            { value: "FINISHED", label: "Selesai" }
          ] as const).map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as "ALL" | BookingStatus)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.value ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content (2-Columns on lg+, Stacked on mobile) */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto w-full">
        {/* Left Column: Monthly Calendar */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center px-1">
            <button
              onClick={prevMonth}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg capitalize">
              {format(currentDate, "MMMM yyyy", { locale: idLocale })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid Container */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2.5">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
                <div key={i} className="text-xs font-bold text-slate-600">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50/20">
              {days.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const dayBookings = getBookingsForDate(day);

                return (
                  <div
                    key={i}
                    onClick={() => onDateClick(day)}
                    className={`flex flex-col p-1.5 sm:p-2 min-h-[75px] sm:min-h-[95px] cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 ring-2 ring-blue-500 ring-inset z-10"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {/* Date Number */}
                    <div className="flex justify-end mb-1">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/40"
                            : isToday
                            ? "bg-blue-100 text-blue-700 font-extrabold"
                            : isCurrentMonth
                            ? "text-slate-700"
                            : "text-slate-300"
                        }`}
                      >
                        {format(day, dateFormat)}
                      </div>
                    </div>

                    {/* Event Badges */}
                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                      {dayBookings.slice(0, 2).map((b, idx) => {
                        const badge = getStatusBadge(b.status, rentalNiche);
                        return (
                          <div
                            key={idx}
                            className={`truncate px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium w-full border border-current/15 ${badge.bg}`}
                          >
                            {b.customerName || "Pelanggan Baru"}
                          </div>
                        );
                      })}
                      {dayBookings.length > 2 && (
                        <div className="text-[10px] text-slate-400 font-bold px-1">
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

        {/* Right Column: Agenda / Selected Date Bookings */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 lg:sticky lg:top-24">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Tanggal</span>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base capitalize">
                {format(selectedDate, "EEEE, dd MMM yyyy", { locale: idLocale })}
              </h3>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-bold shrink-0">
              {selectedDateBookings.length} Jadwal
            </span>
          </div>

          {selectedDateBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xs">
              <CalendarDays className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-600 text-sm font-bold">Tidak Ada Jadwal</p>
              <p className="text-slate-400 text-xs mt-1">Belum ada reservasi atau sewa untuk tanggal ini.</p>
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
                                      <>
                                        <button onClick={() => handleApprove(b.id)} className="flex-1 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                                          ✅ Setujui Pesanan
                                        </button>
                                        <button onClick={() => handleCancelOrder(b.id, b.customerName || "Pelanggan Baru")} className="flex-1 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-xl transition-colors shadow-sm">
                                          ❌ Batalkan
                                        </button>
                                      </>
                                    )}
                                    {b.status === "COMPLETED" && (
                                      <button onClick={() => handleCancelOrder(b.id, b.customerName || "Pelanggan Baru")} className="w-full px-3 py-2 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-xl transition-colors shadow-sm">
                                        ❌ Batalkan Reservasi
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

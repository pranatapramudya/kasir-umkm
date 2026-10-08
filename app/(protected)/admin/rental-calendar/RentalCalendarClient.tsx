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
  pickupTime?: string | null;
  returnTime?: string | null;
  notes?: string | null;
  conditionNotes?: string | null;
  deposit?: number | null;
  driverName?: string | null;
  licensePlate?: string | null;
  guarantee?: string | null;
  downPayment?: number | null;
  remainingBalance?: number | null;
  total?: number | null;
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
        return { label: "Menunggu ACC / Konfirmasi", bg: "bg-amber-100 text-amber-900 border-amber-300 font-bold" };
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
  const [finishPaymentMethod, setFinishPaymentMethod] = useState<string>("TUNAI");
  const [isFinishing, setIsFinishing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const agendaTopRef = React.useRef<HTMLDivElement>(null);
  const ORDERS_PER_PAGE = 10;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset pagination ke halaman 1 jika tanggal yang dipilih atau filter berubah
  React.useEffect(() => {
    setOrderPage(1);
  }, [selectedDate, filter]);

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
    const res = await finishOrder(finishingOrder.id, fee, finishPaymentMethod);
    if (res.success) {
      toast.success("Pelunasan berhasil diterima! Transaksi kini LUNAS.");
      setFinishingOrder(null);
      await mutate();
      router.refresh();
    } else {
      toast.error(res.error || "Gagal menyelesaikan pelunasan");
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
  const totalOrderPages = Math.max(1, Math.ceil(selectedDateBookings.length / ORDERS_PER_PAGE));
  const safeCurrentPage = Math.min(orderPage, totalOrderPages);
  const startIndex = (safeCurrentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = Math.min(startIndex + ORDERS_PER_PAGE, selectedDateBookings.length);
  const paginatedBookings = selectedDateBookings.slice(startIndex, endIndex);

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
            { value: "PENDING", label: "Menunggu ACC" },
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
        <div className="lg:col-span-7 xl:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 lg:sticky lg:top-20 self-start">
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
        <div ref={agendaTopRef} className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3.5 scroll-mt-24">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Tanggal</span>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base capitalize">
                {format(selectedDate, "EEEE, dd MMM yyyy", { locale: idLocale })}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-bold shrink-0">
                {selectedDateBookings.length} Orderan
              </span>
              {totalOrderPages > 1 && (
                <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-bold shrink-0">
                  Hal. {safeCurrentPage}/{totalOrderPages}
                </span>
              )}
            </div>
          </div>

          {/* Quick Pagination Bar di atas jika orderan > 10 */}
          {selectedDateBookings.length > ORDERS_PER_PAGE && (
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-slate-500 shadow-xs">
              <span>
                Menampilkan <strong className="text-slate-800">{startIndex + 1} - {endIndex}</strong> dari <strong className="text-slate-800">{selectedDateBookings.length}</strong> orderan
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOrderPage(p => Math.max(1, p - 1));
                    agendaTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  disabled={safeCurrentPage <= 1}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderPage(p => Math.min(totalOrderPages, p + 1));
                    agendaTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  disabled={safeCurrentPage >= totalOrderPages}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                  title="Halaman Sesudah"
                >
                  <span>Sesudah</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {selectedDateBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xs">
              <CalendarDays className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-600 text-sm font-bold">Tidak Ada Jadwal</p>
              <p className="text-slate-400 text-xs mt-1">Belum ada reservasi atau sewa untuk tanggal ini.</p>
            </div>
          ) : (
          paginatedBookings.map((b) => {
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
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{b.itemName || "Menunggu Info Unit"}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-700 font-semibold">{b.customerName || "Pelanggan Baru"}</p>
                      </div>
                      {b.customerPhone && (
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(
                            `Halo Kak ${b.customerName}, konfirmasi jadwal sewa armada ${b.itemName} pada ${format(safeDate(b.startDate), "dd MMM yyyy, HH:mm", { locale: idLocale })} WIB.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat WA
                        </a>
                      )}
                      {b.source === "ONLINE" ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          🌐 Booking Online
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          🏪 Kasir Manual POS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border shrink-0 ${badge.bg}`}>
                    {badge.label}
                  </div>
                </div>

                {/* Box Waktu Berangkat & Kembali */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <div className="flex-1 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{actionLabels.startLabel}</span>
                      <span className="font-bold text-slate-800">
                        {format(safeDate(b.startDate), "dd MMM yyyy, HH:mm", { locale: idLocale })} WIB
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 border-dashed" />
                  <div className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div className="flex-1 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{actionLabels.endLabel}</span>
                      <span className="font-bold text-slate-800">
                        {format(safeDate(b.endDate), "dd MMM yyyy, HH:mm", { locale: idLocale })} WIB
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 border-dashed" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Durasi Perjalanan:</span>
                    <span className="font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300 text-[11px]">
                      ⏱️ {Math.max(1, Math.round((safeDate(b.endDate).getTime() - safeDate(b.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} Hari Sewa
                    </span>
                  </div>
                </div>

                {/* Rute & Lokasi (Penjemputan & Tujuan) — Teks Lengkap Tanpa Terpotong */}
                {(b.pickupLocation || b.dropoffLocation) && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex flex-col gap-2 text-xs">
                    {b.pickupLocation && (
                      <div className="flex items-start gap-2">
                        <span className="text-base shrink-0 mt-0.5">📍</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Titik Jemput / Lokasi Kumpul:</span>
                          <span className="text-slate-900 font-semibold leading-relaxed break-words">{b.pickupLocation}</span>
                        </div>
                      </div>
                    )}
                    {b.pickupLocation && b.dropoffLocation && (
                      <div className="border-t border-amber-200/60" />
                    )}
                    {b.dropoffLocation && (
                      <div className="flex items-start gap-2">
                        <span className="text-base shrink-0 mt-0.5">🏁</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Destinasi / Rute Tujuan:</span>
                          <span className="text-slate-900 font-semibold leading-relaxed break-words">{b.dropoffLocation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Catatan / Request Khusus Rombongan */}
                {(b.notes || b.conditionNotes) && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs flex flex-col gap-1.5">
                    {b.notes && (
                      <div>
                        <span className="text-[10px] text-blue-900 font-bold uppercase tracking-wider block">📝 Catatan / Request Rombongan:</span>
                        <p className="text-slate-800 italic leading-relaxed break-words mt-0.5 bg-white p-2.5 rounded-lg border border-blue-100">"{b.notes}"</p>
                      </div>
                    )}
                    {b.notes && b.conditionNotes && (
                      <div className="border-t border-blue-200/60 my-0.5" />
                    )}
                    {b.conditionNotes && (
                      <div>
                        <span className="text-[10px] text-blue-900 font-bold uppercase tracking-wider block">🔧 Catatan Armada / Unit:</span>
                        <p className="text-slate-700 leading-relaxed break-words mt-0.5">{b.conditionNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Info Driver, Plat Nomor & Jaminan Dokumen (Khusus Kasir POS) */}
                {(b.driverName || b.licensePlate || b.guarantee) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    {b.driverName && (
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Supir / Driver:</span>
                        <span className="text-slate-900 font-bold">{b.driverName}</span>
                      </div>
                    )}
                    {b.licensePlate && (
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Plat Nomor:</span>
                        <span className="text-slate-900 font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{b.licensePlate}</span>
                      </div>
                    )}
                    {b.guarantee && (
                      <div className="col-span-2 pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Jaminan Titipan (KTP/SIM/Paspor):</span>
                        <span className="text-slate-800 font-medium">{b.guarantee}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Rincian Finansial / Pembayaran */}
                {(Boolean(b.deposit && b.deposit > 0) || Boolean(b.downPayment && b.downPayment > 0) || Boolean(b.total && b.total > 0)) && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs flex-wrap gap-2">
                    {b.total ? (
                      <div>
                        <span className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider block">Total Biaya:</span>
                        <span className="font-bold text-emerald-700">Rp {new Intl.NumberFormat("id-ID").format(b.total)}</span>
                      </div>
                    ) : null}
                    {b.downPayment ? (
                      <div>
                        <span className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider block">DP / Tanda Jadi:</span>
                        <span className="font-semibold text-emerald-700">Rp {new Intl.NumberFormat("id-ID").format(b.downPayment)}</span>
                      </div>
                    ) : null}
                    {b.remainingBalance && b.remainingBalance > 0 ? (
                      <div>
                        <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">Sisa Pelunasan:</span>
                        <span className="font-bold text-rose-600">Rp {new Intl.NumberFormat("id-ID").format(b.remainingBalance)}</span>
                      </div>
                    ) : null}
                    {b.deposit && b.deposit > 0 ? (
                      <div>
                        <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">Deposit:</span>
                        <span className="font-semibold text-amber-700">Rp {new Intl.NumberFormat("id-ID").format(b.deposit)}</span>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {/* Action Buttons */}
                                {b.status !== "FINISHED" && (
                                  <div className="flex gap-2 mt-1 pt-2 border-t border-slate-100">
                                    {b.source === "ONLINE" && b.status === "PENDING" && (
                                      <>
                                        <button
                                          onClick={() => handleApprove(b.id)}
                                          className="flex-1 min-w-[130px] px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          ACC / Setujui Pesanan
                                        </button>
                                        <button
                                          onClick={() => router.push("/admin/pos")}
                                          className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                                        >
                                          Tarik ke POS
                                        </button>
                                        <button
                                          onClick={() => handleCancelOrder(b.id, b.customerName || "Pelanggan Baru")}
                                          className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-sm"
                                        >
                                          Tolak
                                        </button>
                                      </>
                                    )}
                                    {b.source === "ONLINE" && b.status === "COMPLETED" && (
                                      <>
                                        <button
                                          onClick={() => router.push("/admin/pos")}
                                          className="flex-1 min-w-[140px] px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                          <LogIn className="w-3.5 h-3.5" />
                                          Proses di Kasir POS (Check-in)
                                        </button>
                                        <button
                                          onClick={() => handleCancelOrder(b.id, b.customerName || "Pelanggan Baru")}
                                          className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-sm"
                                        >
                                          Batalkan Reservasi
                                        </button>
                                      </>
                                    )}
                                    {(b.status === "IN_PROGRESS" || b.status === "OVERDUE" || (b.remainingBalance && b.remainingBalance > 0)) && (
                                      <button 
                                        onClick={() => { 
                                          setFinishingOrder(b); 
                                          setOvertimeFee("0"); 
                                          setFinishPaymentMethod("TUNAI");
                                        }} 
                                        className={`w-full px-3 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                                          b.remainingBalance && b.remainingBalance > 0
                                            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                        }`}
                                      >
                                        {b.remainingBalance && b.remainingBalance > 0 ? "💰 Terima Pelunasan & Selesai" : actionLabels.finish}
                                      </button>
                                    )}
                                  </div>
                                )}
              </div>
            );
          })
        )}

          {/* Bottom Pagination Control Bar */}
          {totalOrderPages > 1 && (
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setOrderPage(p => Math.max(1, p - 1));
                  agendaTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                disabled={safeCurrentPage <= 1}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  safeCurrentPage <= 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 shadow-xs"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-1.5">
                {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    totalOrderPages <= 6 ||
                    pageNum === 1 ||
                    pageNum === totalOrderPages ||
                    Math.abs(pageNum - safeCurrentPage) <= 1
                  ) {
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setOrderPage(pageNum);
                          agendaTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-extrabold"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === 2 && safeCurrentPage > 3) ||
                    (pageNum === totalOrderPages - 1 && safeCurrentPage < totalOrderPages - 2)
                  ) {
                    return <span key={pageNum} className="text-slate-400 text-xs px-0.5">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderPage(p => Math.min(totalOrderPages, p + 1));
                  agendaTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                disabled={safeCurrentPage >= totalOrderPages}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  safeCurrentPage >= totalOrderPages
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95"
                }`}
              >
                <span>Sesudah</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penyewa</span>
                  <span className="font-bold text-slate-900">{finishingOrder?.customerName || "Pelanggan"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit / Armada</span>
                  <span className="font-semibold text-slate-800">{finishingOrder?.itemName || "-"}</span>
                </div>
                {finishingOrder?.remainingBalance && finishingOrder.remainingBalance > 0 ? (
                  <div className="flex justify-between pt-2 border-t border-slate-200 items-center">
                    <span className="font-bold text-rose-700">Sisa Tagihan Belum Lunas:</span>
                    <span className="font-black text-rose-600 text-sm">
                      Rp {new Intl.NumberFormat("id-ID").format(finishingOrder.remainingBalance)}
                    </span>
                  </div>
                ) : null}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Denda Overtime / Biaya Kerusakan (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rp</span>
                  <input 
                    type="text" 
                    value={overtimeFee}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOvertimeFee(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                    }}
                    className="bg-white border border-slate-300 text-slate-900 text-xs rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 p-2.5 font-bold"
                    placeholder="0"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Isi jika ada overtime/denda. Kosongkan jika tidak ada.</p>
              </div>

              {/* Total Pelunasan Wajib Dibayar */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Total Pelunasan Sekarang:</span>
                  <span className="text-[10px] text-emerald-600">Sisa Tagihan + Denda / Overtime</span>
                </div>
                <span className="text-base font-black text-emerald-700">
                  Rp {new Intl.NumberFormat("id-ID").format((finishingOrder?.remainingBalance || 0) + (parseInt(overtimeFee.replace(/\D/g, "") || "0")))}
                </span>
              </div>

              {/* Metode Pembayaran Pelunasan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metode Pembayaran Pelunasan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFinishPaymentMethod("TUNAI")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${finishPaymentMethod === "TUNAI" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                  >
                    💵 Tunai
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinishPaymentMethod("TRANSFER / QRIS")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${finishPaymentMethod !== "TUNAI" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                  >
                    📱 Transfer / QRIS
                  </button>
                </div>

                {finishPaymentMethod !== "TUNAI" && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                    <p className="font-bold flex items-center gap-1 text-emerald-950 mb-0.5">
                      <span>📱</span> Verifikasi Pembayaran Digital / QRIS
                    </p>
                    <p>
                      Pastikan bukti transfer atau mutasi pembayaran QRIS dari penyewa sudah berhasil masuk ke rekening sebelum menyelesaikan sewa.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isFinishing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm shadow-emerald-600/30 text-xs sm:text-sm"
                >
                  {isFinishing && <Loader2 className="w-4 h-4 animate-spin" />}
                  ✓ Simpan Pelunasan & Selesaikan Sewa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

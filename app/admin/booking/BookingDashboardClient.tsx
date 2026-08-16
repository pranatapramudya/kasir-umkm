"use client";

import { isRentalTravelCategory } from "@/lib/business-category";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  StickyNote,
  LayoutList,
  CalendarDays,
  X,
} from "lucide-react";
import { Calendar, dateFnsLocalizer, type Event as CalendarEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "id-ID": idLocale },
});

type BookingStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FINISHED";

interface BookingProduct {
  name: string;
  hargaJual: number;
}

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  notes: string | null;
  status: BookingStatus;
  product: BookingProduct | null;
  createdAt: string;
  startDate?: string | null;
  endDate?: string | null;
  destination?: string | null;
  overtimeFee?: number;
}

interface Props {
  initialBookings: Booking[];
  tenantName: string;
  bookingLink: string | null;
  tenantSlug: string | null;
  tenantCategory?: string | null;
}

interface BookingCalendarEvent extends CalendarEvent {
  resource: Booking;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeShort(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_MAP: Record<
  BookingStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Menunggu",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    label: "Selesai",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  FINISHED: {
    label: "Selesai (Pool)",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

/** Warna event kalender berdasarkan status */
function eventStyleGetter(event: BookingCalendarEvent) {
  const status = event.resource.status;
  const styleMap: Record<BookingStatus, React.CSSProperties> = {
    PENDING: { backgroundColor: "#f59e0b", color: "#fff", borderRadius: "6px", border: "none" },
    COMPLETED: { backgroundColor: "#10b981", color: "#fff", borderRadius: "6px", border: "none" },
    CANCELLED: { backgroundColor: "#ef4444", color: "#fff", borderRadius: "6px", border: "none" },
    FINISHED: { backgroundColor: "#64748b", color: "#fff", borderRadius: "6px", border: "none" },
  };
  return { style: styleMap[status] ?? {} };
}

export default function BookingDashboardClient({
  initialBookings,
  tenantName,
  bookingLink,
  tenantSlug,
  tenantCategory,
}: Props) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  // View mode: list atau calendar
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Modal detail event kalender
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings terbaru
  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/booking", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setLastRefresh(new Date());
      }
    } catch {
      // silent fail
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => fetchBookings(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  // Update status booking
  async function updateStatus(bookingId: string, status: BookingStatus) {
    setActionLoading(bookingId + status);
    try {
      const res = await fetch("/api/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
        // Update juga booking yang sedang dibuka di modal
        setSelectedBooking((prev) =>
          prev?.id === bookingId ? { ...prev, status } : prev
        );
      }
    } catch {
      alert("Gagal memperbarui status. Coba lagi.");
    } finally {
      setActionLoading(null);
    }
  }

  // Proses ke kasir
  function handleProsesKeKasir(booking: Booking) {
    updateStatus(booking.id, "COMPLETED");
    if (booking.product) {
      const params = new URLSearchParams({
        bookingId: booking.id,
        customerName: booking.customerName,
        productName: booking.product.name,
        productPrice: booking.product.hargaJual.toString(),
      });
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/?customerName=${encodeURIComponent(booking.customerName)}`);
    }
    setSelectedBooking(null);
  }

  function copyLink() {
    if (!bookingLink) return;
    navigator.clipboard.writeText(bookingLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Data untuk kalender
  const calendarEvents: BookingCalendarEvent[] = bookings.map((b) => {
    const start = new Date(b.bookingDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 jam
    return {
      title: `${b.customerName}${b.product ? ` — ${b.product.name}` : ""}`,
      start,
      end,
      resource: b,
    };
  });

  const filteredBookings = bookings.filter(
    (b) => filter === "ALL" || b.status === filter
  );

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;



  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">Jadwal Booking</h1>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount} baru
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            Kelola jadwal pelanggan {tenantName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle View */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              id="view-list-btn"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <LayoutList className="w-4 h-4" />
              Daftar
            </button>
            <button
              id="view-calendar-btn"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === "calendar"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              Kalender
            </button>
          </div>

          <button
            onClick={() => fetchBookings(false)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Booking Link Banner */}
      {bookingLink ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
            Link Booking Publik Anda
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700 font-mono break-all min-w-0">
              {bookingLink}
            </code>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Tersalin!" : "Salin"}
              </button>
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Slug toko belum diatur</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Atur slug unik di{" "}
              <Link href="/admin/settings" className="underline font-semibold">
                Pengaturan
              </Link>{" "}
              agar pelanggan bisa mengakses halaman booking Anda.
            </p>
          </div>
        </div>
      )}

      {/* ===== CALENDAR VIEW ===== */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <style>{`
            .rbc-calendar { font-family: inherit; }
            .rbc-toolbar { padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
            .rbc-toolbar button { border-radius: 8px; font-weight: 600; font-size: 13px; }
            .rbc-toolbar button.rbc-active { background-color: #2563eb; color: white; border-color: #2563eb; }
            .rbc-toolbar button:hover { background-color: #eff6ff; }
            .rbc-toolbar .rbc-toolbar-label { font-weight: 700; font-size: 15px; color: #1e293b; }
            .rbc-header { padding: 8px 4px; font-weight: 700; font-size: 12px; color: #64748b; background: #f8fafc; }
            .rbc-today { background-color: #eff6ff !important; }
            .rbc-event { font-size: 12px; padding: 2px 6px; }
            .rbc-event:focus { outline: 2px solid #2563eb; }
            .rbc-show-more { color: #2563eb; font-weight: 600; }
          `}</style>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            culture="id-ID"
            messages={{
              next: "Selanjutnya",
              previous: "Sebelumnya",
              today: "Hari Ini",
              month: "Bulan",
              week: "Minggu",
              day: "Hari",
              agenda: "Agenda",
              noEventsInRange: "Tidak ada booking pada periode ini.",
              showMore: (count) => `+${count} lainnya`,
            }}
            eventPropGetter={(event) =>
              eventStyleGetter(event as BookingCalendarEvent)
            }
            onSelectEvent={(event) =>
              setSelectedBooking((event as BookingCalendarEvent).resource)
            }
            popup
          />
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {viewMode === "list" && (
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${filter === f
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {f === "ALL"
                  ? `Semua (${bookings.length})`
                  : f === "PENDING"
                    ? `Menunggu (${bookings.filter((b) => b.status === "PENDING").length})`
                    : f === "COMPLETED"
                      ? `Selesai (${bookings.filter((b) => b.status === "COMPLETED").length})`
                      : `Dibatalkan (${bookings.filter((b) => b.status === "CANCELLED").length})`}
              </button>
            ))}
          </div>

          {/* Booking Cards */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-500">Belum ada jadwal</p>
              <p className="text-sm mt-1">
                {filter === "ALL"
                  ? "Bagikan link booking ke pelanggan Anda."
                  : `Tidak ada booking dengan status "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => {
                const statusInfo = STATUS_MAP[booking.status];
                const isPending = booking.status === "PENDING";

                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isPending
                        ? "border-amber-200 shadow-amber-100/50"
                        : "border-slate-200"
                      }`}
                  >
                    <div className="p-4">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {booking.customerName}
                            </p>
                            <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                              <Phone className="w-3 h-3" />
                              {booking.customerPhone}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusInfo.color} ${statusInfo.bg} shrink-0`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-xs text-slate-400 mb-0.5">Tanggal</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {formatDateShort(booking.bookingDate)}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-xs text-slate-400 mb-0.5">Jam</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {formatTimeShort(booking.bookingDate)} WIB
                          </p>
                        </div>
                        {booking.product && (
                          <div className="col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-2.5">
                            <p className="text-xs text-blue-400 mb-0.5">Layanan</p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold text-blue-700">
                                {booking.product.name}
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                {formatRupiah(booking.product.hargaJual)}
                              </p>
                            </div>
                          </div>
                        )}
                        {booking.notes && (
                          <div className="col-span-2 bg-slate-50 rounded-xl p-2.5">
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                              <StickyNote className="w-3 h-3" />
                              Catatan
                            </div>
                            <p className="text-sm text-slate-600">{booking.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions — only for PENDING */}
                      {isPending && (
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                          <button
                            id={`proses-kasir-${booking.id}`}
                            onClick={() => handleProsesKeKasir(booking)}
                            disabled={actionLoading === booking.id + "COMPLETED"}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {actionLoading === booking.id + "COMPLETED"
                              ? "Memproses..."
                              : "Proses ke Kasir"}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`batalkan-${booking.id}`}
                            onClick={() => updateStatus(booking.id, "CANCELLED")}
                            disabled={actionLoading === booking.id + "CANCELLED"}
                            className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-60"
                          >
                            <XCircle className="w-4 h-4" />
                            Batal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Last refresh indicator */}
      <p className="text-center text-xs text-slate-400 pb-2">
        Terakhir diperbarui: {lastRefresh.toLocaleTimeString("id-ID")} · Auto-refresh setiap 30 detik
      </p>

      {/* ===== MODAL DETAIL BOOKING (dari klik kalender) ===== */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{selectedBooking.customerName}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedBooking.customerPhone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Tanggal</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDateShort(selectedBooking.bookingDate)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Jam</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatTimeShort(selectedBooking.bookingDate)} WIB
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${STATUS_MAP[selectedBooking.status].color
                    } ${STATUS_MAP[selectedBooking.status].bg}`}
                >
                  {STATUS_MAP[selectedBooking.status].icon}
                  {STATUS_MAP[selectedBooking.status].label}
                </span>
              </div>

              {selectedBooking.product && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-400 mb-1">Layanan</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-blue-700">
                      {selectedBooking.product.name}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatRupiah(selectedBooking.product.hargaJual)}
                    </p>
                  </div>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                    <StickyNote className="w-3 h-3" />
                    Catatan
                  </div>
                  <p className="text-sm text-slate-600">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedBooking.status === "PENDING" && (
              <div className="flex gap-2 px-5 pb-5">
                <button
                  id={`modal-proses-kasir-${selectedBooking.id}`}
                  onClick={() => handleProsesKeKasir(selectedBooking)}
                  disabled={actionLoading === selectedBooking.id + "COMPLETED"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {actionLoading === selectedBooking.id + "COMPLETED"
                    ? "Memproses..."
                    : "Proses ke Kasir"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`modal-batalkan-${selectedBooking.id}`}
                  onClick={() => updateStatus(selectedBooking.id, "CANCELLED")}
                  disabled={actionLoading === selectedBooking.id + "CANCELLED"}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4" />
                  Batal
                </button>
              </div>
            )}

            {selectedBooking.status !== "PENDING" && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

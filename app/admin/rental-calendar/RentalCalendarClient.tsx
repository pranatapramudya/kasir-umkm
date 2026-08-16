"use client";

import React, { useState } from "react";
import {
  format, addDays, subDays, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, isSameDay, isSameMonth,
  addMonths, subMonths, eachDayOfInterval
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, User, CarFront } from "lucide-react";

type BookingStatus = "PENDING" | "ACTIVE" | "OVERDUE" | "COMPLETED";

interface Booking {
  id: string;
  customerName: string;
  itemName: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  destination?: string | null;
  driverName?: string | null;
  licensePlate?: string | null;
  guarantee?: string | null;
}

interface Props {
  initialBookings: Booking[];
}

const STATUS_CONFIG: Record<BookingStatus, { label: string, bg: string }> = {
  PENDING: { label: "Booking/DP", bg: "bg-yellow-100 text-yellow-700" },
  ACTIVE: { label: "Sedang Jalan/Aktif", bg: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Terlambat/Overdue", bg: "bg-red-100 text-red-700" },
  COMPLETED: { label: "Selesai", bg: "bg-gray-100 text-gray-700" }
};

export default function RentalCalendarClient({ initialBookings }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    return initialBookings.filter(b => {
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
      <div className="bg-white p-4 border-b border-slate-200 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Kalender Sewa
        </h1>
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
          <div className="grid grid-cols-7 gap-1 md:gap-2 sticky top-0 z-20 bg-white shadow-sm py-2 px-1 md:px-2 border-b border-slate-200">
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
                    <div key={idx} className="truncate px-1.5 md:px-2 py-0.5 md:py-1 bg-amber-100 text-amber-800 rounded-md text-[9px] md:text-xs font-medium w-full">
                      {b.customerName}
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
        <h3 className="font-bold text-slate-700 text-sm mb-1">
          Agenda: {format(selectedDate, "EEEE, dd MMM yyyy", { locale: idLocale })}
        </h3>

        {selectedDateBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm font-medium">Kosong</p>
            <p className="text-slate-400 text-xs mt-1">Tidak ada jadwal sewa untuk tanggal ini.</p>
          </div>
        ) : (
          selectedDateBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CarFront className="w-4 h-4 text-blue-600 shrink-0" />
                    <h4 className="font-bold text-slate-800 text-sm truncate">{b.itemName}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <p className="text-xs text-slate-500 font-medium truncate">{b.customerName}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border shrink-0 ${STATUS_CONFIG[b.status].bg} border-current/20`}>
                  {STATUS_CONFIG[b.status].label}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Mulai</span>
                    <span className="font-semibold text-slate-700">
                      {format(new Date(b.startDate), "dd MMM, HH:mm", { locale: idLocale })}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 border-dashed" />
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Selesai</span>
                    <span className="font-semibold text-slate-700">
                      {format(new Date(b.endDate), "dd MMM, HH:mm", { locale: idLocale })}
                    </span>
                  </div>
                </div>

                {/* Extra Details */}
                {(b.destination || b.driverName || b.licensePlate || b.guarantee) && (
                  <>
                    <div className="border-t border-slate-200 border-dashed mt-1 mb-1" />
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {b.destination && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Tujuan</span>
                          <span className="text-xs text-slate-700 font-medium truncate">{b.destination}</span>
                        </div>
                      )}
                      {b.driverName && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Supir</span>
                          <span className="text-xs text-slate-700 font-medium truncate">{b.driverName}</span>
                        </div>
                      )}
                      {b.licensePlate && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Plat No</span>
                          <span className="text-xs text-slate-700 font-medium truncate">{b.licensePlate}</span>
                        </div>
                      )}
                      {b.guarantee && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Jaminan</span>
                          <span className="text-xs text-slate-700 font-medium truncate">{b.guarantee}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

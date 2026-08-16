"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { isRentalTravelCategory } from "@/lib/business-category";
import html2canvas from "html2canvas";

interface Service {
  id: number;
  name: string;
  hargaJual: number;
}

interface BookingFormProps {
  slug: string;
  tenantName: string;
  services: Service[];
  tenantCategory?: string | null;
  adminWhatsApp?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
}

type FormStep = "form" | "success";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Generate time slots 08:00 - 21:00, interval 30 menit
function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = 8; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 21) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

// Tanggal minimum = hari ini
function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingForm({ slug, tenantName, services, tenantCategory, adminWhatsApp, bankName, bankAccount, bankAccountName }: BookingFormProps) {
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const todayISO = useMemo(() => getTodayISO(), []);

  const [step, setStep] = useState<FormStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Anti-double booking state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  // Receipt / ticket state
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadTicket() {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        background: "#ffffff", // white agar cocok dengan light theme
        scale: 2, // retina quality
        useCORS: true,
      } as any);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Tiket-Booking-${tenantName.replace(/\s+/g, "-")}.png`;
      link.click();
    } catch {
      alert("Gagal mengunduh tiket. Coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  }

  function handleShareWA() {
    // Generate pre-filled WA text based on category
    let text = "";
    if (isRental) {
      const startLabel = new Date(rentalData.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const endLabel   = new Date(rentalData.endDate).toLocaleDateString("id-ID",   { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const serviceText = selectedService ? ` untuk *${selectedService.name}*` : "";
      
      text = `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
             `Nama Pemesan: *${formData.customerName}*\n` +
             `Layanan: *${tenantName}*${serviceText}\n` +
             `Tanggal Sewa: *${startLabel}* s/d *${endLabel}*.\n\n` +
             `Berikut bukti transfernya...`;
    } else {
      const dateLabel = new Date(`${formData.bookingDate}T${formData.bookingTime}`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const serviceText = selectedService ? ` untuk layanan *${selectedService.name}*` : "";
      
      text = `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
             `Nama Pemesan: *${formData.customerName}*\n` +
             `Layanan: *${tenantName}*${serviceText}\n` +
             `Waktu Kunjungan: *${dateLabel}* jam *${formData.bookingTime} WIB*.\n\n` +
             `Berikut bukti transfernya...`;
    }
    
    const waNumber = adminWhatsApp ? adminWhatsApp.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';
    const url = waNumber 
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }
    const btn = document.getElementById('gps-btn');
    if(btn) btn.innerHTML = "⏳";
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setRentalData(prev => ({
          ...prev,
          destination: `https://maps.google.com/?q=${lat},${lon}`
        }));
        if(btn) btn.innerHTML = "📍 GPS";
      },
      (error) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
        if(btn) btn.innerHTML = "📍 GPS";
      }
    );
  }


  const isRental = isRentalTravelCategory(tenantCategory);

  const [formData, setFormData] = useState({
    productId: services[0]?.id?.toString() ?? "",
    bookingDate: todayISO,
    bookingTime: "09:00",
    customerName: "",
    customerPhone: "",
    notes: "",
  });

  // State khusus Rental & Travel
  const [rentalData, setRentalData] = useState({
    startDate: todayISO,
    endDate: todayISO,
    destination: "",
  });

  const selectedService = services.find(
    (s) => s.id.toString() === formData.productId
  );

  // Fetch booked slots whenever date changes
  const checkSlots = useCallback(
    async (date: string) => {
      setIsCheckingSlots(true);
      try {
        const res = await fetch(
          `/api/booking/check-slots?date=${encodeURIComponent(date)}&slug=${encodeURIComponent(slug)}`
        );
        if (res.ok) {
          const data = await res.json();
          const slots: string[] = data.bookedSlots ?? [];
          setBookedSlots(slots);

          // Auto-deselect current time if it just became booked
          setFormData((prev) => {
            if (slots.includes(prev.bookingTime)) {
              // Find next available slot
              const nextFree = timeSlots.find((s) => !slots.includes(s));
              return { ...prev, bookingTime: nextFree ?? prev.bookingTime };
            }
            return prev;
          });
        }
      } catch {
        // Silent fail — don't block form usage
      } finally {
        setIsCheckingSlots(false);
      }
    },
    [slug, timeSlots]
  );

  // Check slots on initial load and on date change
  useEffect(() => {
    checkSlots(formData.bookingDate);
  }, [formData.bookingDate, checkSlots]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }
    if (!formData.customerPhone.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    // === Validasi khusus Rental ===
    if (isRental) {
      if (!rentalData.startDate) {
        setError("Tanggal mulai sewa wajib dipilih.");
        return;
      }
      if (!rentalData.endDate) {
        setError("Tanggal selesai sewa wajib dipilih.");
        return;
      }
      if (rentalData.endDate < rentalData.startDate) {
        setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
        return;
      }
    } else {
      if (!formData.bookingDate) {
        setError("Tanggal kunjungan wajib dipilih.");
        return;
      }
      // Guard: chosen time might have been taken between page load and submit
      if (bookedSlots.includes(formData.bookingTime)) {
        setError("Jam yang Anda pilih sudah penuh. Pilih jam lain.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Untuk Rental: gunakan startDate sebagai bookingDate (wajib di schema)
      const bookingDateTime = isRental
        ? new Date(`${rentalData.startDate}T08:00:00`)
        : new Date(`${formData.bookingDate}T${formData.bookingTime}:00`);

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          bookingDate: bookingDateTime.toISOString(),
          notes: formData.notes.trim() || null,
          productId: formData.productId ? Number(formData.productId) : null,
          // Field rental (null jika bukan Rental)
          startDate: isRental ? new Date(`${rentalData.startDate}T00:00:00`).toISOString() : null,
          endDate:   isRental ? new Date(`${rentalData.endDate}T23:59:59`).toISOString()   : null,
          destination: isRental ? (rentalData.destination.trim() || null) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        if (!isRental) checkSlots(formData.bookingDate);
        return;
      }

      if (data.bookingId) {
        setBookingId(data.bookingId);
      }
      setStep("success");
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-md">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-10 h-10 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Jadwal Dibuat!</h2>
        <p className="text-slate-500 text-sm mb-1">
          Halo <span className="text-slate-900 font-semibold">{formData.customerName}</span>,
        </p>
        <p className="text-slate-500 text-sm mb-6">
          Jadwal Anda di{" "}
          <span className="text-blue-600 font-semibold">{tenantName}</span> telah
          berhasil disimpan. Tim kami akan menghubungi Anda melalui nomor{" "}
          <span className="text-slate-900 font-semibold">{formData.customerPhone}</span>.
        </p>

        {/* Ticket Container — captured by html2canvas */}
        <div
          id="ticket-container"
          ref={ticketRef}
          className="bg-slate-50 rounded-2xl p-5 text-left text-sm space-y-3 mb-5 border border-slate-200"
        >
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
                Bukti Reservasi
              </p>
              <p className="text-slate-900 font-bold text-base">{tenantName}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Nama</span>
              <span className="text-slate-900 font-semibold text-xs">{formData.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">No. HP</span>
              <span className="text-slate-900 font-semibold text-xs">{formData.customerPhone}</span>
            </div>
            {selectedService && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Layanan</span>
                <span className="text-slate-900 font-semibold text-xs">{selectedService.name}</span>
              </div>
            )}
            {/* === Baris khusus Rental === */}
            {isRental ? (
              <>
                {rentalData.destination && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Tujuan</span>
                    <span className="text-slate-900 font-semibold text-xs">{rentalData.destination}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Mulai Sewa</span>
                  <span className="text-slate-900 font-semibold text-xs">
                    {new Date(rentalData.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Selesai Sewa</span>
                  <span className="text-slate-900 font-semibold text-xs">
                    {new Date(rentalData.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Tanggal</span>
                  <span className="text-slate-900 font-semibold text-xs">
                    {new Date(`${formData.bookingDate}T${formData.bookingTime}`).toLocaleDateString(
                      "id-ID",
                      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Jam</span>
                  <span className="text-slate-900 font-semibold text-xs">{formData.bookingTime} WIB</span>
                </div>
              </>
            )}
          </div>

          {/* Barcode-style bottom strip */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-1 opacity-30">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-full"
                style={{ width: i % 3 === 0 ? 3 : 2, height: i % 5 === 0 ? 20 : 14 }}
              />
            ))}
          </div>
        </div>

          {/* Instruksi Pembayaran */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5 text-left">
            <h3 className="font-bold text-blue-900 mb-3 text-sm">Instruksi Pembayaran</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                <span className="text-xs text-slate-500 font-medium">Total Tagihan (DP)</span>
                <span className="font-bold text-blue-700">
                  {selectedService ? formatRupiah(selectedService.hargaJual * 0.5) : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Transfer ke Rekening</span>
                  <span className="font-bold text-slate-800 text-sm">{bankName || 'BCA'} - {bankAccount || '1234567890'}</span>
                  <span className="text-[10px] text-slate-400">a.n. {bankAccountName || 'Pemilik Toko'}</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-blue-600/80 mt-3 italic text-center">
              *Silakan transfer sesuai nominal DP di atas dan siapkan bukti transfer Anda.
            </p>
          </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-5">
          <button
            id="share-wa-btn"
            onClick={handleShareWA}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white text-sm font-bold transition-all duration-150 shadow-lg shadow-green-600/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Konfirmasi Pembayaran via WhatsApp
          </button>
          
          <button
            id="download-ticket-btn"
            onClick={handleDownloadTicket}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-sm font-bold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Menyiapkan Gambar...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh Tiket Reservasi
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setStep("form");
            setFormData((prev) => ({ ...prev, customerName: "", customerPhone: "", notes: "" }));
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          Buat jadwal baru
        </button>
      </div>
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">Isi Detail Jadwal</h2>
        <p className="text-slate-500 text-xs">Semua field bertanda * wajib diisi</p>
      </div>

      {/* Pilih Layanan */}
      {services.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="productId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Layanan *
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
          >
            <option value="" className="bg-white text-slate-500">— Pilih Layanan —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.name} — {formatRupiah(s.hargaJual)}
              </option>
            ))}
          </select>
          {selectedService && (
            <p className="text-blue-600 text-xs font-medium pl-1">
              Harga: {formatRupiah(selectedService.hargaJual)}
            </p>
          )}
        </div>
      )}

      {/* Tanggal Kunjungan — hanya tampil untuk non-Rental */}
      {!isRental && (
        <div className="space-y-1.5">
          <label htmlFor="bookingDate" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tanggal Kunjungan *
          </label>
          <input
            id="bookingDate"
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            min={todayISO}
            onChange={handleChange}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [color-scheme:light]"
          />
        </div>
      )}

      {/* Jam Kunjungan — hanya untuk non-Rental */}
      {isRental ? (
        /* ===== RENTAL: Date Range + Tujuan ===== */
        <div className="space-y-4">
          {/* Banner identitas rental */}
          <div className="bg-blue-50 text-blue-800 border border-blue-200 p-3 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-2">
            <span className="text-lg">🚗</span>
            <span>INFORMASI SEWA KENDARAAN</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tanggal Mulai */}
            <div className="space-y-1.5">
              <label htmlFor="rental-startDate" className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mulai Sewa *
              </label>
              <input
                id="rental-startDate"
                type="date"
                value={rentalData.startDate}
                min={todayISO}
                onChange={(e) => {
                  const val = e.target.value;
                  setRentalData((prev) => ({
                    ...prev,
                    startDate: val,
                    // Jika endDate < startDate baru, sesuaikan
                    endDate: prev.endDate < val ? val : prev.endDate,
                  }));
                  setError(null);
                }}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:light]"
              />
            </div>

            {/* Tanggal Selesai */}
            <div className="space-y-1.5">
              <label htmlFor="rental-endDate" className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Selesai Sewa *
              </label>
              <input
                id="rental-endDate"
                type="date"
                value={rentalData.endDate}
                min={rentalData.startDate || todayISO}
                onChange={(e) => {
                  setRentalData((prev) => ({ ...prev, endDate: e.target.value }));
                  setError(null);
                }}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:light]"
              />
            </div>
          </div>
          
          {/* Tampilkan durasi jika ada */}
          {rentalData.startDate && rentalData.endDate && rentalData.endDate >= rentalData.startDate && (
            <p className="text-amber-600 text-xs font-medium">
              Durasi sewa:{" "}
              {Math.max(1, Math.ceil(
                (new Date(rentalData.endDate).getTime() - new Date(rentalData.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ))}{" "}
              hari
            </p>
          )}

          {/* Tujuan */}
          <div className="space-y-1.5">
            <label htmlFor="rental-destination" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lokasi Penjemputan / Tujuan <span className="normal-case font-normal text-slate-500">(opsional)</span>
            </label>
            <div className="flex gap-2">
              <input
                id="rental-destination"
                type="text"
                value={rentalData.destination}
                onChange={(e) => {
                  setRentalData((prev) => ({ ...prev, destination: e.target.value }));
                  setError(null);
                }}
                placeholder="contoh: Bandara Ngurah Rai atau Klik GPS"
                className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <button 
                id="gps-btn"
                type="button" 
                onClick={handleGeolocation} 
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-xl text-slate-700 font-bold text-sm flex-shrink-0 transition-colors tooltip"
                title="Gunakan Lokasi Saat Ini"
              >
                📍 GPS
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===== NON-RENTAL: Grid slot waktu 30 menit ===== */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jam Kunjungan *
            </label>
            {isCheckingSlots && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Mengecek ketersediaan...
              </span>
            )}
          </div>

          {/* Grid tombol jam */}
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = formData.bookingTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked || isCheckingSlots}
                  onClick={() => {
                    if (!isBooked) {
                      setFormData((prev) => ({ ...prev, bookingTime: slot }));
                      setError(null);
                    }
                  }}
                  className={`
                    relative py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-150
                    ${isBooked
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-600 text-white border border-blue-600 shadow-lg shadow-blue-600/30 scale-[1.04]"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    }
                  `}
                >
                  {slot}
                  {isBooked && (
                    <span className="block text-[9px] text-slate-400 font-normal leading-none mt-0.5">
                      Penuh
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-slate-500 text-xs">
            Jam berwarna abu-abu sudah terisi. Pilih jam yang tersedia.
          </p>
        </div>
      )}

      {/* Nama */}
      <div className="space-y-1.5">
        <label htmlFor="customerName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Nama Lengkap *
        </label>
        <input
          id="customerName"
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="contoh: Budi Santoso"
          required
          autoComplete="name"
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* HP */}
      <div className="space-y-1.5">
        <label htmlFor="customerPhone" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Nomor HP / WhatsApp *
        </label>
        <input
          id="customerPhone"
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="contoh: 08123456789"
          required
          autoComplete="tel"
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Catatan */}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Catatan <span className="normal-case font-normal text-slate-500">(opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Ada permintaan khusus? tulis di sini..."
          rows={3}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Informasi DP & Follow up */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 items-start">
        <span className="text-amber-600 mt-0.5 text-base">⚠️</span>
        <div className="text-[11px] md:text-xs text-amber-800 space-y-1 leading-relaxed">
          <p className="font-bold">Informasi Pembayaran & Konfirmasi:</p>
          <p>Pesanan ini memerlukan <strong>Down Payment (DP) minimal 50%</strong> dari total tagihan.</p>
          <p>Setelah form dikirim, Admin kami akan segera menghubungi Anda melalui WhatsApp untuk memberikan rincian pembayaran dan menyelesaikan proses booking.</p>
        </div>
      </div>

      {/* Submit */}
      <button
        id="submit-booking-btn"
        type="submit"
        disabled={isSubmitting || (!isRental && isCheckingSlots)}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isSubmitting || (!isRental && isCheckingSlots)
            ? "bg-blue-100 text-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
          }`}
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Menyimpan...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isRental ? "Pesan Rental Sekarang" : "Buat Jadwal Sekarang"}
          </>
        )}
      </button>
    </form>
  );
}

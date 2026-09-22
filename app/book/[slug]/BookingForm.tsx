"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { RentalDatePicker } from "@/components/RentalDatePicker";
import { isRentalTravelCategory } from "@/lib/business-category";
import html2canvas from "html2canvas-pro";

interface Service {
  id: number;
  name: string;
  hargaJual: number;
  description?: string | null;
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
  bookingOpenTime?: string | null;
  bookingCloseTime?: string | null;
  bookingSlotDuration?: number | null;
}

interface Region {
  id: string;
  name: string;
}

type FormStep = "form" | "success";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Generate time slots dinamis berdasarkan jam buka, jam tutup, dan durasi jeda menit
function generateTimeSlots(
  openTimeStr: string = "08:00",
  closeTimeStr: string = "21:00",
  durationMinutes: number = 30
) {
  const slots: string[] = [];

  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const startTotalMinutes = parseMinutes(openTimeStr);
  const endTotalMinutes = parseMinutes(closeTimeStr);
  const interval = durationMinutes > 0 ? durationMinutes : 30;

  for (let current = startTotalMinutes; current <= endTotalMinutes; current += interval) {
    const hours = Math.floor(current / 60);
    const mins = current % 60;
    if (hours < 24) {
      slots.push(`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`);
    }
  }

  // Fallback jika perhitungan kosong
  if (slots.length === 0) {
    slots.push("08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00");
  }

  return slots;
}

// Generate rental time slots 08:00 - 22:00 (Jam Operasional Standar), interval 30 menit
function generateRentalTimeSlots() {
  const slots: string[] = [];
  for (let h = 8; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

// Tanggal minimum = hari ini
function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingForm({
  slug,
  tenantName,
  services,
  tenantCategory,
  adminWhatsApp,
  bankName,
  bankAccount,
  bankAccountName,
  bookingOpenTime,
  bookingCloseTime,
  bookingSlotDuration,
}: BookingFormProps) {
  const timeSlots = useMemo(
    () =>
      generateTimeSlots(
        bookingOpenTime || "08:00",
        bookingCloseTime || "21:00",
        bookingSlotDuration || 30
      ),
    [bookingOpenTime, bookingCloseTime, bookingSlotDuration]
  );
  const rentalTimeSlots = useMemo(() => generateRentalTimeSlots(), []);
  const todayISO = useMemo(() => getTodayISO(), []);

  const [step, setStep] = useState<FormStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Anti-double booking state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [bookedRentalRanges, setBookedRentalRanges] = useState<{ startDate: string, endDate: string }[]>([]);

  // Receipt / ticket state
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const hasBankPayment = Boolean(bankName && bankAccount);

  async function handleDownloadTicket() {
    if (!ticketRef.current) {
      console.error("Gagal mengunduh tiket: Elemen tiket (ticketRef) tidak ditemukan di DOM.");
      return;
    }
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;

      const cleanTenantName = (tenantName || "Toko").trim().replace(/\s+/g, "_");
      const cleanCustomerName = (formData.customerName || "Pelanggan").trim().replace(/\s+/g, "_");
      const txId = bookingId ? `#${bookingId.slice(0, 8)}` : "unknown";

      link.download = `Tiket_${cleanTenantName}_${cleanCustomerName}_${txId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Gagal membuat/mengunduh tiket reservasi:", error);
      alert("Gagal mengunduh tiket. Coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  }


  function handleGeolocation() {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }
    const btn = document.getElementById('gps-btn');
    if (btn) btn.innerHTML = "⏳";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setRentalData(prev => ({
          ...prev,
          pickupLocation: `https://maps.google.com/?q=${lat},${lon}`
        }));
        if (btn) btn.innerHTML = "📍 GPS";
      },
      (error) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
        if (btn) btn.innerHTML = "📍 GPS";
      }
    );
  }


  function detectRentalItemType(name: string, description?: string | null): "property" | "vehicle" | "equipment" {
      const combined = `${name || ""} ${description || ""}`.toLowerCase();
      const vehicleKeywords = [
        "mobil", "motor", "car", "bike", "bus", "travel", "avanza",
        "innova", "hiace", "elf", "nmax", "pcx", "beat", "supra",
        "scooter", "kendaraan", "driver", "supir", "pickup", "shuttle",
        "charter", "armada", "sewa mobil", "sewa motor"
      ];
      const equipmentKeywords = [
        "kamera", "drone", "sound", "lighting", "tender", "camping",
        "playstation", "alat berat", "generator", "proyektor", "mic",
        "speaker", "mixer", "amplifier", "gitar", "drum", "keyboard",
        "kabel", "stand", "tripod", "softbox", "ring light", "mic wireless"
      ];
      const matchesVehicle = vehicleKeywords.some(kw => combined.includes(kw));
      const matchesEquipment = equipmentKeywords.some(kw => combined.includes(kw));
      if (matchesEquipment) return "equipment";
      if (matchesVehicle) return "vehicle";
      return "property";
    }

  const isRental = isRentalTravelCategory(tenantCategory);

  const [rentalCategoryType, setRentalCategoryType] = useState<"property" | "vehicle" | "equipment">("property");
  const [rentalModeDuration, setRentalModeDuration] = useState<"hourly" | "daily">("hourly");

  // State khusus Transit Per Jam (Hourly Property)
  const [hourlyData, setHourlyData] = useState({
    checkInDate: todayISO,
    checkInTime: "12:00",
    durationHours: 3,
  });

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
      pickupTime: "08:00",
      endDate: todayISO,
      pickupLocation: "",
      dropoffProvince: "",
      dropoffRegency: "",
      dropoffDistrict: "",
      dropoffLocation: "",
      returnTime: "17:00",
      deposit: 0,
      conditionNotes: "",
    });

  // State untuk data wilayah (Emsifa API)
  const [provincesData, setProvincesData] = useState<Region[]>([]);
  const [regenciesData, setRegenciesData] = useState<Region[]>([]);
  const [districtsData, setDistrictsData] = useState<Region[]>([]);
  const [isFetchingRegion, setIsFetchingRegion] = useState(false);

  const selectedService = services.find(
    (s) => s.id.toString() === formData.productId
  );

  // Auto-set category type when selectedService changes
  useEffect(() => {
    if (selectedService) {
      setRentalCategoryType(detectRentalItemType(selectedService.name, selectedService.description));
    }
  }, [selectedService]);

  // Calculated info for hourly transit
  const hourlyCheckoutInfo = useMemo(() => {
    if (!hourlyData.checkInDate || !hourlyData.checkInTime) {
      return { checkInLabel: "-", checkOutLabel: "-", startIso: "", endIso: "" };
    }
    const [h, m] = hourlyData.checkInTime.split(":").map(Number);
    const start = new Date(`${hourlyData.checkInDate}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + hourlyData.durationHours * 60 * 60 * 1000);

    const checkInLabel = start.toLocaleDateString("id-ID", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    }) + ` jam ${hourlyData.checkInTime} WIB`;

    const endH = String(end.getHours()).padStart(2, "0");
    const endM = String(end.getMinutes()).padStart(2, "0");
    const checkOutLabel = end.toLocaleDateString("id-ID", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    }) + ` jam ${endH}:${endM} WIB`;

    return {
      checkInLabel,
      checkOutLabel,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      startDateStr: hourlyData.checkInDate,
      endDateStr: end.toISOString().split("T")[0],
    };
  }, [hourlyData.checkInDate, hourlyData.checkInTime, hourlyData.durationHours]);

  useEffect(() => {
    if (isRental && rentalCategoryType === "vehicle") {
      setIsFetchingRegion(true);
      fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then(res => res.json())
        .then(data => setProvincesData(data))
        .catch(err => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  }, [isRental, rentalCategoryType]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceVal = e.target.value;
    setRentalData(prev => ({ ...prev, dropoffProvince: provinceVal, dropoffRegency: "", dropoffDistrict: "" }));
    setRegenciesData([]);
    setDistrictsData([]);
    setError(null);
    if (provinceVal) {
      const provinceId = provinceVal.split("|")[0];
      setIsFetchingRegion(true);
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
        .then(res => res.json())
        .then(data => setRegenciesData(data))
        .catch(err => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyVal = e.target.value;
    setRentalData(prev => ({ ...prev, dropoffRegency: regencyVal, dropoffDistrict: "" }));
    setDistrictsData([]);
    setError(null);
    if (regencyVal) {
      const regencyId = regencyVal.split("|")[0];
      setIsFetchingRegion(true);
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`)
        .then(res => res.json())
        .then(data => setDistrictsData(data))
        .catch(err => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  };

  // Fetch booked slots whenever date changes
  const checkSlots = useCallback(
    async (date: string) => {
      setIsCheckingSlots(true);
      try {
        const res = await fetch(
          `/api/booking/check-slots?date=${encodeURIComponent(date)}&slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(formData.productId)}`
        );
        if (res.ok) {
          const data = await res.json();
          const slots: string[] = data.bookedSlots ?? [];
          setBookedSlots(slots);

          // Auto-deselect current time if it just became booked
          setFormData((prev) => {
            if (slots.includes(prev.bookingTime)) {
              const nextFree = timeSlots.find((s) => !slots.includes(s));
              return { ...prev, bookingTime: nextFree ?? prev.bookingTime };
            }
            return prev;
          });
        }
      } catch {
        // Silent fail
      } finally {
        setIsCheckingSlots(false);
      }
    },
    [slug, timeSlots, formData.productId]
  );

  // Check slots on initial load and on date change
  useEffect(() => {
    if (!isRental) {
      checkSlots(formData.bookingDate);
    }
  }, [formData.bookingDate, formData.productId, checkSlots, isRental]);

  const checkRentalRanges = useCallback(
    async (productId: string) => {
      if (!isRental || !productId) return;
      try {
        const res = await fetch(
          `/api/booking/check-rental?slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(productId)}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookedRentalRanges(data.bookedRanges ?? []);
        }
      } catch {
        // silent fail
      }
    },
    [isRental, slug]
  );

  useEffect(() => {
    if (isRental) {
      checkRentalRanges(formData.productId);
    }
  }, [formData.productId, isRental, checkRentalRanges]);

  useEffect(() => {
    if (isRental && rentalCategoryType === "vehicle" && rentalData.startDate && rentalData.endDate) {
      const start = new Date(rentalData.startDate);
      const end = new Date(rentalData.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      let isOverlap = false;
      for (const range of bookedRentalRanges) {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        if (start <= rangeEnd && end >= rangeStart) {
          isOverlap = true;
          break;
        }
      }

      if (isOverlap) {
        setError("Armada sudah disewa pada tanggal tersebut.");
      } else {
        setError(prev => prev === "Armada sudah disewa pada tanggal tersebut." ? null : prev);
      }
    }
  }, [rentalData.startDate, rentalData.endDate, bookedRentalRanges, isRental, rentalCategoryType]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (prev[name as keyof typeof prev] === value) return prev;
      return { ...prev, [name]: value };
    });
    setError(null);
  }

  function handleCustomerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value;
    // Deteksi bug autofill browser yang menempelkan string duplikat (misal: "Budi SantosoBudi Santoso")
    if (val.length >= 6 && val.length % 2 === 0) {
      const half = val.length / 2;
      if (val.slice(0, half) === val.slice(half)) {
        val = val.slice(0, half);
      }
    }
    if (val.length >= 9 && val.length % 3 === 0) {
      const third = val.length / 3;
      if (val.slice(0, third) === val.slice(third, third * 2) && val.slice(0, third) === val.slice(third * 2)) {
        val = val.slice(0, third);
      }
    }
    setFormData((prev) => (prev.customerName === val ? prev : { ...prev, customerName: val }));
    setError(null);
  }

  function handleCustomerPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/[^\d+\-\s]/g, "");
    // Deteksi duplikasi nomor telepon berulang dari autofill agresif (misal: "081234567890081234567890")
    if (val.length >= 16 && val.length % 2 === 0) {
      const half = val.length / 2;
      if (val.slice(0, half) === val.slice(half)) {
        val = val.slice(0, half);
      }
    }
    if (val.length >= 24 && val.length % 3 === 0) {
      const third = val.length / 3;
      if (val.slice(0, third) === val.slice(third, third * 2) && val.slice(0, third) === val.slice(third * 2)) {
        val = val.slice(0, third);
      }
    }
    setFormData((prev) => (prev.customerPhone === val ? prev : { ...prev, customerPhone: val }));
    setError(null);
  }

  function handleShareWA() {
    let text = "";
    if (isRental) {
      const serviceText = selectedService ? ` untuk *${selectedService.name}*` : "";
      if (rentalCategoryType === "property" && rentalModeDuration === "hourly") {
        text = `Halo, saya ingin mengkonfirmasi reservasi kamar/unit dengan ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Properti: *${tenantName}*${serviceText}\n` +
          `Waktu Check-in: *${hourlyCheckoutInfo.checkInLabel}*\n` +
          `Waktu Check-out: *${hourlyCheckoutInfo.checkOutLabel}* (*${hourlyData.durationHours} Jam Transit*).\n\n` +
          `Berikut bukti transfernya...`;
      } else if (rentalCategoryType === "property") {
              const startLabel = new Date(rentalData.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
              const endLabel = new Date(rentalData.endDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
              text = `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
                `Nama Pemesan: *${formData.customerName}*\n` +
                `Properti: *${tenantName}*${serviceText}\n` +
                `Tanggal Sewa: *${startLabel}* s/d *${endLabel}*.\n\n` +
                `Berikut bukti transfernya...`;
            } else if (rentalCategoryType === "equipment") {
                          const startLabel = new Date(rentalData.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                          const endLabel = new Date(rentalData.endDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                          const pickupTime = rentalData.pickupTime || "08:00";
                          const returnTime = rentalData.returnTime || "17:00";
                          text = `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
                            `Nama Pemesan: *${formData.customerName}*\n` +
                            `Alat: *${tenantName}*${serviceText}\n` +
                            `Tanggal Sewa: *${startLabel}* s/d *${endLabel}*\n` +
                            `Jam Ambil: *${pickupTime} WIB*\n` +
                            `Jam Kembali: *${returnTime} WIB*\n` +
                            (rentalData.deposit > 0 ? `DP / Deposit: *Rp ${new Intl.NumberFormat("id-ID").format(rentalData.deposit)}*\n` : "") +
                            `\nBerikut bukti transfernya...`;
            } else {
        const startLabel = new Date(rentalData.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        const endLabel = new Date(rentalData.endDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        text = `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Tanggal Sewa: *${startLabel}* jam *${rentalData.pickupTime}* s/d *${endLabel}*.\n\n` +
          `Berikut bukti transfernya...`;
      }
    } else {
      const dateLabel = new Date(`${formData.bookingDate}T${formData.bookingTime}`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const serviceText = selectedService ? ` untuk layanan *${selectedService.name}*` : "";

      if (hasBankPayment) {
        text = `Halo, saya sudah membuat jadwal dan melakukan transfer DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Waktu Kunjungan: *${dateLabel}* jam *${formData.bookingTime} WIB*.\n\n` +
          `Berikut saya lampirkan bukti transfernya...`;
      } else {
        text = `Halo, saya ingin mengkonfirmasi reservasi jadwal dengan ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Waktu Kunjungan: *${dateLabel}* jam *${formData.bookingTime} WIB*.`;
      }
    }

    const waNumber = adminWhatsApp ? adminWhatsApp.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';
    const url = waNumber
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
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
      if (rentalCategoryType === "property" && rentalModeDuration === "hourly") {
        if (!hourlyData.checkInDate) {
          setError("Tanggal check-in wajib dipilih.");
          return;
        }
        if (!hourlyData.checkInTime) {
          setError("Jam masuk check-in wajib dipilih.");
          return;
        }
      } else {
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
                if (rentalCategoryType === "vehicle") {
                  if (!rentalData.dropoffProvince || !rentalData.dropoffRegency || !rentalData.dropoffDistrict) {
                    setError("Provinsi, Kota/Kabupaten, dan Kecamatan tujuan wajib dipilih.");
                    return;
                  }
                }
                if (rentalCategoryType === "equipment") {
                  if (!rentalData.returnTime) {
                    setError("Jam kembali wajib dipilih.");
                    return;
                  }
                }
              }
    } else {
      if (!formData.bookingDate) {
        setError("Tanggal kunjungan wajib dipilih.");
        return;
      }
      if (bookedSlots.includes(formData.bookingTime)) {
        setError("Jam yang Anda pilih sudah penuh. Pilih jam lain.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let bookingDateTime: Date;
      let startDateIso: string | null = null;
      let endDateIso: string | null = null;
      let finalPickup: string | null = null;
      let finalDropoff: string | null = null;

      if (isRental) {
        if (rentalCategoryType === "property" && rentalModeDuration === "hourly") {
          bookingDateTime = new Date(`${hourlyData.checkInDate}T${hourlyData.checkInTime}:00`);
          startDateIso = hourlyCheckoutInfo.startIso;
          endDateIso = hourlyCheckoutInfo.endIso;
          finalPickup = null;
          finalDropoff = null;
        } else {
          bookingDateTime = new Date(`${rentalData.startDate}T${rentalData.pickupTime}:00`);
          startDateIso = new Date(`${rentalData.startDate}T${rentalData.pickupTime}:00`).toISOString();
          endDateIso = new Date(`${rentalData.endDate}T23:59:59`).toISOString();

          if (rentalCategoryType === "vehicle") {
            const provName = rentalData.dropoffProvince.split("|")[1] || "";
            const regName = rentalData.dropoffRegency.split("|")[1] || "";
            const distName = rentalData.dropoffDistrict.split("|")[1] || "";
            finalDropoff = provName
              ? `[${provName} - ${regName} - ${distName}] ${rentalData.dropoffLocation}`.trim()
              : rentalData.dropoffLocation;
            finalPickup = rentalData.pickupLocation.trim() || null;
          } else {
            finalPickup = null;
            finalDropoff = null;
          }
        }
      } else {
        bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}:00`);
      }

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
                startDate: startDateIso,
                endDate: endDateIso,
                pickupLocation: finalPickup,
                dropoffLocation: finalDropoff,
                // Equipment fields
                returnTime: rentalCategoryType === "equipment" ? rentalData.returnTime : null,
                deposit: rentalCategoryType === "equipment" ? rentalData.deposit : 0,
                conditionNotes: rentalCategoryType === "equipment" ? rentalData.conditionNotes : null,
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

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isRental ? "Reservasi Berhasil Dibuat!" : "Jadwal Antrean Berhasil Dibuat!"}
        </h2>
        <p className="text-slate-500 text-sm mb-1">
          Halo <span className="text-slate-900 font-semibold">{formData.customerName}</span>,
        </p>
        {isRental ? (
          <p className="text-slate-500 text-sm mb-6">
            Pesanan Anda di{" "}
            <span className="text-blue-600 font-semibold">{tenantName}</span> telah
            berhasil dicatat. Tim kami akan menghubungi Anda melalui nomor{" "}
            <span className="text-slate-900 font-semibold">{formData.customerPhone}</span>.
          </p>
        ) : hasBankPayment ? (
          <p className="text-slate-500 text-sm mb-6">
            Antrean reservasi Anda di <span className="text-blue-600 font-semibold">{tenantName}</span> berhasil dicatat.
            Silakan selesaikan pembayaran DP / tanda jadi ke rekening di bawah dan kirim bukti transfer ke WhatsApp kami untuk konfirmasi slot.
          </p>
        ) : (
          <p className="text-slate-500 text-sm mb-6">
            Antrean Anda di <span className="text-blue-600 font-semibold">{tenantName}</span> berhasil dicatat.
            Silakan datang ke lokasi sesuai jadwal dan lakukan pembayaran langsung di Kasir.
          </p>
        )}

        {/* Ticket Container */}
        <div
          id="ticket-container"
          ref={ticketRef}
          className="bg-slate-50 rounded-2xl p-5 text-left text-sm space-y-3 mb-5 border border-slate-200"
        >
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
                {isRental ? "Bukti Reservasi Sewa" : "Tiket Antrean Layanan"}
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
                <span className="text-slate-500 text-xs">{isRental ? "Unit / Armada" : "Layanan / Servis"}</span>
                <span className="text-slate-900 font-semibold text-xs">{selectedService.name}</span>
              </div>
            )}

            {/* === Rincian Rental (Properti Kos Transit vs Kendaraan) === */}
            {isRental ? (
              rentalCategoryType === "property" && rentalModeDuration === "hourly" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Check-in</span>
                    <span className="text-slate-900 font-semibold text-xs">{hourlyCheckoutInfo.checkInLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Check-out</span>
                    <span className="text-slate-900 font-semibold text-xs">{hourlyCheckoutInfo.checkOutLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Durasi Transit</span>
                    <span className="text-blue-600 font-bold text-xs">{hourlyData.durationHours} Jam</span>
                  </div>
                </>
              ) : rentalCategoryType === "property" ? (
                <>
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
              ) : rentalCategoryType === "equipment" ? (
                <>
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
              ) : (                <>
                  {(rentalData.dropoffProvince || rentalData.dropoffLocation) && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Tujuan</span>
                      <span className="text-slate-900 font-semibold text-xs text-right max-w-[65%] truncate">
                        {rentalData.dropoffProvince ? `[${rentalData.dropoffProvince.split("|")[1]} - ${rentalData.dropoffRegency.split("|")[1]} - ${rentalData.dropoffDistrict.split("|")[1]}] ` : ''}{rentalData.dropoffLocation}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Mulai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} {rentalData.pickupTime} WIB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Selesai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </>
              )
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

        {/* Instruksi Pembayaran Transfer Rekening (Rental ATAU Jasa dengan Rekening Diatur) */}
        {(isRental || hasBankPayment) && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5 text-left">
            <h3 className="font-bold text-blue-900 mb-3 text-sm flex items-center justify-between">
              <span>Instruksi Pembayaran Transfer</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                {isRental ? "DP 50%" : "Tanda Jadi / DP"}
              </span>
            </h3>
            <div className="space-y-3">
              {selectedService && selectedService.hargaJual > 0 && (
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-slate-500 font-medium">
                    {isRental ? "Total Tagihan (DP 50%)" : "Estimasi DP / Tanda Jadi (50%)"}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-blue-700 text-sm">
                      {formatRupiah(Math.round(selectedService.hargaJual * 0.5))}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Total Layanan: {formatRupiah(selectedService.hargaJual)}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100 gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-500 font-medium">Transfer ke Rekening</span>
                  <span className="font-bold text-slate-800 text-sm font-mono truncate">
                    {bankName || 'BCA'} - {bankAccount}
                  </span>
                  <span className="text-[10px] text-slate-400">a.n. {bankAccountName || tenantName}</span>
                </div>
                {bankAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(bankAccount);
                      setCopiedBank(true);
                      setTimeout(() => setCopiedBank(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold shrink-0 transition-colors"
                  >
                    {copiedBank ? "Tersalin!" : "Salin"}
                  </button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-blue-600/80 mt-3 italic text-center">
              *Silakan transfer sesuai nominal DP di atas dan lampirkan bukti transfer via WhatsApp agar jadwal langsung dikunci oleh Admin.
            </p>
          </div>
        )}

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
            {(hasBankPayment || isRental) ? "Kirim Bukti Transfer via WhatsApp" : (isRental ? "Hubungi Admin via WhatsApp" : "Konfirmasi Antrean via WhatsApp")}
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
                {isRental ? "Unduh Tiket Reservasi" : "Unduh Tiket Antrean"}
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
          {isRental ? "Buat reservasi baru" : "Buat jadwal antrean baru"}
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
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">
          {isRental ? "Isi Detail Reservasi Sewa" : "Isi Detail Jadwal Layanan"}
        </h2>
        <p className="text-slate-500 text-xs">Semua field bertanda * wajib diisi</p>
      </div>

      {/* Pilih Layanan / Unit */}
      {services.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="productId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {isRental ? "Pilih Unit / Kamar *" : "Pilih Layanan / Servis *"}
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
          >
            <option value="" className="bg-white text-slate-500">
              {isRental ? "— Pilih Unit / Kamar —" : "— Pilih Layanan —"}
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.name} — {isRental ? `Estimasi / Mulai dari ${formatRupiah(s.hargaJual)}` : formatRupiah(s.hargaJual)}
              </option>
            ))}
          </select>
          {selectedService && (
            <div className="pl-1">
              <p className="text-blue-600 text-xs font-medium">
                Harga: {isRental ? `Estimasi / Mulai dari ${formatRupiah(selectedService.hargaJual)}` : formatRupiah(selectedService.hargaJual)}
              </p>
              {selectedService.description && (
                <div className="mt-2 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] text-slate-500 italic">
                  * {selectedService.description}
                </div>
              )}
            </div>
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

      {/* RENTAL FORM LOGIC */}
      {isRental ? (
        <div className="space-y-4">
          {/* Selector Tipe Rental (Properti vs Kendaraan vs Peralatan) */}
          <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => {
                setRentalCategoryType("property");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${rentalCategoryType === "property"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <span>🏨</span>
              <span className="hidden sm:inline">Properti / Kos</span>
              <span className="sm:hidden">Properti</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRentalCategoryType("vehicle");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${rentalCategoryType === "vehicle"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <span>🚗</span>
              <span className="hidden sm:inline">Kendaraan</span>
              <span className="sm:hidden">Kendaraan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRentalCategoryType("equipment");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${rentalCategoryType === "equipment"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <span>📦</span>
              <span className="hidden sm:inline">Alat / Barang</span>
              <span className="sm:hidden">Alat</span>
            </button>
          </div>

          {/* Banner Informasi Mode */}
          <div className="bg-blue-50 text-blue-800 border border-blue-200 p-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
            <span>
              {rentalCategoryType === "property"
                ? "🏨 RESERVASI PROPERTI / KOS TRANSIT"
                : rentalCategoryType === "equipment"
                ? "📦 DETAIL SEWA ALAT / PERALATAN"
                : "📋 DETAIL RESERVASI KENDARAAN"}
            </span>
          </div>

          {/* === BILA SISI PROPERTI / KOS TRANSIT === */}
          {rentalCategoryType === "property" ? (
            <div className="space-y-4">
              {/* Mode durasi rental: Transit (Per Jam) vs Sewa Harian */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tipe Durasi Sewa:
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setRentalModeDuration("hourly")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${rentalModeDuration === "hourly"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    ⏱️ Transit Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setRentalModeDuration("daily")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${rentalModeDuration === "daily"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    📅 Harian
                  </button>
                </div>
              </div>

              {rentalModeDuration === "hourly" ? (
                /* ===== TRANSIT HOURLY PICKER ===== */
                <div className="space-y-3.5 bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl">
                  {/* Tanggal Check-in */}
                  <div className="space-y-1.5">
                    <label htmlFor="hourly-checkInDate" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Tanggal Check-in *
                    </label>
                    <input
                      id="hourly-checkInDate"
                      type="date"
                      value={hourlyData.checkInDate}
                      min={todayISO}
                      onChange={(e) => {
                        setHourlyData(prev => ({ ...prev, checkInDate: e.target.value }));
                        setError(null);
                      }}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:light]"
                    />
                  </div>

                  {/* Jam Masuk (Check-in Time) */}
                  <div className="space-y-1.5">
                    <label htmlFor="hourly-checkInTime" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Jam Masuk (Check-in) *
                    </label>
                    <select
                      id="hourly-checkInTime"
                      value={hourlyData.checkInTime}
                      onChange={(e) => {
                        setHourlyData(prev => ({ ...prev, checkInTime: e.target.value }));
                        setError(null);
                      }}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                    >
                      {rentalTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} WIB
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Durasi Jam Transit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Durasi Jam Transit *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => {
                        const isSelected = hourlyData.durationHours === hours;
                        return (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => {
                              setHourlyData(prev => ({ ...prev, durationHours: hours }));
                              setError(null);
                            }}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${isSelected
                              ? "bg-amber-500 text-white border border-amber-500 shadow-md scale-[1.03]"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                              }`}
                          >
                            {hours} Jam
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ringkasan Check-out Otomatis */}
                  <div className="bg-white border border-amber-200 rounded-xl p-3.5 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Check-in:</span>
                      <span className="font-semibold text-slate-800">{hourlyCheckoutInfo.checkInLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Check-out (Estimasi):</span>
                      <span className="font-semibold text-amber-600">{hourlyCheckoutInfo.checkOutLabel}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic pt-1 text-right">
                      *Durasi sewa: {hourlyData.durationHours} jam transit
                    </p>
                  </div>
                </div>
              ) : (
                /* ===== DAILY PROPERTY RENTAL ===== */
                <div className="space-y-3">
                  <RentalDatePicker
                    slug={slug}
                    productId={formData.productId}
                    startDate={rentalData.startDate}
                    endDate={rentalData.endDate}
                    onChange={(start, end) => {
                      setRentalData((prev) => ({ ...prev, startDate: start, endDate: end }));
                      setError(null);
                    }}
                    onClearError={() => setError(null)}
                  />
                  <div className="space-y-1.5">
                    <label htmlFor="rental-pickupTime" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Jam Check-in *
                    </label>
                    <select
                      id="rental-pickupTime"
                      value={rentalData.pickupTime}
                      onChange={(e) => {
                        setRentalData((prev) => ({ ...prev, pickupTime: e.target.value }));
                        setError(null);
                      }}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                    >
                      {rentalTimeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time} WIB
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : rentalCategoryType === "equipment" ? (
                                /* ===== BILA PERALATAN / ALAT ===== */
                                <div className="space-y-4">
                                  <RentalDatePicker
                                    slug={slug}
                                    productId={formData.productId}
                                    startDate={rentalData.startDate}
                                    endDate={rentalData.endDate}
                                    onChange={(start, end) => {
                                      setRentalData((prev) => ({ ...prev, startDate: start, endDate: end }));
                                      setError(null);
                                    }}
                                    onClearError={() => setError(null)}
                                  />

                                  {/* Jam Ambil & Jam Kembali */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <label htmlFor="rental-pickupTime" className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Jam Ambil *
                                      </label>
                                      <select
                                        id="rental-pickupTime"
                                        value={rentalData.pickupTime}
                                        onChange={(e) => {
                                          setRentalData((prev) => ({ ...prev, pickupTime: e.target.value }));
                                          setError(null);
                                        }}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                                      >
                                        {rentalTimeSlots.map((time) => (
                                          <option key={time} value={time}>
                                            {time} WIB
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1.5">
                                      <label htmlFor="rental-returnTime" className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Jam Kembali *
                                      </label>
                                      <select
                                        id="rental-returnTime"
                                        value={rentalData.returnTime || "17:00"}
                                        onChange={(e) => {
                                          setRentalData((prev) => ({ ...prev, returnTime: e.target.value }));
                                          setError(null);
                                        }}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                                      >
                                        {rentalTimeSlots.map((time) => (
                                          <option key={time} value={time}>
                                            {time} WIB
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Tampilkan durasi jika ada */}
                                  {rentalData.startDate && rentalData.endDate && rentalData.endDate >= rentalData.startDate && (
                                    <p className="text-amber-600 text-xs font-medium">
                                      Durasi sewa:{" "}
                                      {Math.round(
                                        (new Date(rentalData.endDate).getTime() - new Date(rentalData.startDate).getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      ) + 1}{" "}
                                      hari
                                    </p>
                                  )}

                                  {/* Lokasi Ambil / Pengiriman */}
                                  <div className="space-y-1.5">
                                    <label htmlFor="rental-pickup" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                      LOKASI AMBIL / PENGIRIMAN <span className="normal-case font-normal text-slate-500">(opsional)</span>
                                    </label>
                                    <div className="flex gap-2">
                                      <input
                                        id="rental-pickup"
                                        type="text"
                                        value={rentalData.pickupLocation}
                                        onChange={(e) => {
                                          setRentalData((prev) => ({ ...prev, pickupLocation: e.target.value }));
                                          setError(null);
                                        }}
                                        placeholder="contoh: Toko kami di Jl. Sudirman No. 10 / Antar ke hotel"
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

                                  {/* Deposit / Jaminan */}
                                  <div className="space-y-1.5">
                                    <label htmlFor="rental-deposit" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                      DEPOSIT / JAMINAN <span className="normal-case font-normal text-slate-500">(opsional, isi 0 jika tidak ada)</span>
                                    </label>
                                    <input
                                      id="rental-deposit"
                                      type="number"
                                      min="0"
                                      step="1000"
                                      value={rentalData.deposit || 0}
                                      onChange={(e) => {
                                        setRentalData((prev) => ({ ...prev, deposit: Number(e.target.value) || 0 }));
                                        setError(null);
                                      }}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                      placeholder="contoh: 500000"
                                    />
                                    <p className="text-[10px] text-amber-600 mt-1">
                                      Akan ditambahkan ke total tagihan & dikembalikan saat alat dikembalikan utuh.
                                    </p>
                                  </div>

                                  {/* Catatan Kondisi / Request Khusus */}
                                  <div className="space-y-1.5">
                                    <label htmlFor="rental-condition" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                      CATATAN KONDISI / REQUEST KHUSUS <span className="normal-case font-normal text-slate-500">(opsional)</span>
                                    </label>
                                    <textarea
                                      id="rental-condition"
                                      rows={3}
                                      value={rentalData.conditionNotes || ""}
                                      onChange={(e) => {
                                        setRentalData((prev) => ({ ...prev, conditionNotes: e.target.value }));
                                        setError(null);
                                      }}
                                      placeholder="contoh: Lens filter sudah dipasang, bawa charger tambahan, butuh tas kamera..."
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                    />
                                  </div>
                                </div>
                              ) : (
                      /* ===== BILA KENDARAAN / TRAVEL ===== */
            <div className="space-y-4">
              <RentalDatePicker
                slug={slug}
                productId={formData.productId}
                startDate={rentalData.startDate}
                endDate={rentalData.endDate}
                onChange={(start, end) => {
                  setRentalData((prev) => ({ ...prev, startDate: start, endDate: end }));
                  setError(null);
                }}
                onClearError={() => setError(null)}
              />

              {/* Jam Penjemputan / Ambil / Mulai Sewa */}
              <div className="space-y-1.5">
                <label htmlFor="rental-pickupTime" className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jam Ambil / Mulai Sewa *
                </label>
                <select
                  id="rental-pickupTime"
                  value={rentalData.pickupTime}
                  onChange={(e) => {
                    setRentalData((prev) => ({ ...prev, pickupTime: e.target.value }));
                    setError(null);
                  }}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                >
                  {rentalTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time} WIB
                    </option>
                  ))}
                </select>
              </div>

              {/* Tampilkan durasi jika ada */}
              {rentalData.startDate && rentalData.endDate && rentalData.endDate >= rentalData.startDate && (
                <p className="text-amber-600 text-xs font-medium">
                  Durasi sewa:{" "}
                  {Math.round(
                    (new Date(rentalData.endDate).getTime() - new Date(rentalData.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                  ) + 1}{" "}
                  hari
                </p>
              )}

              {/* Lokasi Penjemputan / Alamat */}
              <div className="space-y-1.5">
                <label htmlFor="rental-pickup" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  LOKASI AMBIL / ALAMAT AWAL <span className="normal-case font-normal text-slate-500">(opsional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="rental-pickup"
                    type="text"
                    value={rentalData.pickupLocation}
                    onChange={(e) => {
                      setRentalData((prev) => ({ ...prev, pickupLocation: e.target.value }));
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

              {/* Lokasi Tujuan */}
              <div className="space-y-3">
                {isFetchingRegion && <div className="text-[10px] text-blue-500 font-semibold animate-pulse">Memuat data wilayah...</div>}

                <div className="space-y-1.5">
                  <label htmlFor="rental-dropoffProvince" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    PROVINSI TUJUAN *
                  </label>
                  <select
                    id="rental-dropoffProvince"
                    value={rentalData.dropoffProvince}
                    onChange={handleProvinceChange}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                  >
                    <option value="" disabled className="text-slate-500">Pilih Provinsi Tujuan</option>
                    {provincesData.map((prov) => (
                      <option key={prov.id} value={`${prov.id}|${prov.name}`}>{prov.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rental-dropoffRegency" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    KOTA/KABUPATEN TUJUAN *
                  </label>
                  <select
                    id="rental-dropoffRegency"
                    value={rentalData.dropoffRegency}
                    onChange={handleRegencyChange}
                    disabled={!rentalData.dropoffProvince || regenciesData.length === 0}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled className="text-slate-500">Pilih Kota/Kabupaten</option>
                    {regenciesData.map((reg) => (
                      <option key={reg.id} value={`${reg.id}|${reg.name}`}>{reg.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rental-dropoffDistrict" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    KECAMATAN TUJUAN *
                  </label>
                  <select
                    id="rental-dropoffDistrict"
                    value={rentalData.dropoffDistrict}
                    onChange={(e) => {
                      setRentalData(prev => ({ ...prev, dropoffDistrict: e.target.value }));
                      setError(null);
                    }}
                    disabled={!rentalData.dropoffRegency || districtsData.length === 0}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled className="text-slate-500">Pilih Kecamatan</option>
                    {districtsData.map((dist) => (
                      <option key={dist.id} value={`${dist.id}|${dist.name}`}>{dist.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rental-dropoff" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    ALAMAT DETAIL TUJUAN <span className="normal-case font-normal text-slate-500">(opsional)</span>
                  </label>
                  <input
                    id="rental-dropoff"
                    type="text"
                    value={rentalData.dropoffLocation}
                    onChange={(e) => {
                      setRentalData((prev) => ({ ...prev, dropoffLocation: e.target.value }));
                      setError(null);
                    }}
                    placeholder="contoh: Hotel Aston Denpasar"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  <p className="text-[10px] text-amber-600 mt-1">
                    *Catatan: Harga di atas adalah harga dasar/dalam kota. Harga final akan disesuaikan dengan jarak rute tujuan Anda dan dikonfirmasi melalui WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}
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
          onChange={handleCustomerNameChange}
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
          onChange={handleCustomerPhoneChange}
          placeholder="contoh: 08123456789"
          required
          autoComplete="tel"
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Catatan / Request Khusus */}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Catatan / Request Khusus <span className="normal-case font-normal text-slate-500">(opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder={isRental ? "Cth: Request kamar di bawah, butuh supir, sewa helm tambahan..." : "Cth: Model potongan rambut, keluhan kerusakan motor/alat, request staf tertentu..."}
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
          {isRental ? (
            <>
              <p className="font-bold">Informasi Pembayaran & Konfirmasi:</p>
              <p>Pesanan sewa ini memerlukan <strong>Down Payment (DP) 50%</strong> dari total tagihan.</p>
              <p>Setelah form dikirim, nomor rekening transfer akan ditampilkan dan Anda dapat langsung mengirim bukti pembayaran via WhatsApp.</p>
            </>
          ) : hasBankPayment ? (
            <>
              <p className="font-bold">Informasi Reservasi & Tanda Jadi (DP):</p>
              <p>Untuk mengunci antrean jadwal Anda, diperlukan <strong>transfer DP / Tanda Jadi 50%</strong> ke rekening resmi toko.</p>
              <p>Setelah reservasi dikirim, nomor rekening akan muncul di tiket dan Anda dapat mengonfirmasi bukti transfer melalui WhatsApp Admin.</p>
            </>
          ) : (
            <>
              <p className="font-bold">Informasi Kedatangan:</p>
              <p>Silakan datang ke lokasi sesuai dengan jadwal yang telah Anda pilih. Pembayaran dapat dilakukan langsung di Kasir setelah pelayanan selesai.</p>
            </>
          )}
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
            {isRental ? "Buat Reservasi Sekarang" : "Booking Jadwal Sekarang"}
          </>
        )}
      </button>
    </form>
  );
}


"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { RentalDatePicker } from "@/components/RentalDatePicker";
import ModernTimePicker from "@/components/ModernTimePicker";
import {
  isRentalTravelCategory,
  detectRentalItemType,
} from "@/lib/business-category";
import { parseProductImages } from "@/lib/product-images";
import { ChevronDown, Check } from "lucide-react";
import html2canvas from "html2canvas-pro";

interface Service {
  id: number;
  name: string;
  category?: string | null;
  hargaJual: number;
  description?: string | null;
  isService?: boolean;
  image?: string | null;
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
  durationMinutes: number = 30,
) {
  const slots: string[] = [];

  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const startTotalMinutes = parseMinutes(openTimeStr);
  const endTotalMinutes = parseMinutes(closeTimeStr);
  const interval = durationMinutes > 0 ? durationMinutes : 30;

  for (
    let current = startTotalMinutes;
    current <= endTotalMinutes;
    current += interval
  ) {
    const hours = Math.floor(current / 60);
    const mins = current % 60;
    if (hours < 24) {
      slots.push(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
      );
    }
  }

  // Fallback jika perhitungan kosong
  if (slots.length === 0) {
    slots.push(
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    );
  }

  return slots;
}

// Helper label format jam Indonesia (24 Jam WIB Penuh 00:00 - 23:30)
function formatIndoTimeSlot(time: string) {
  const [h] = time.split(":").map(Number);
  let period = "Pagi";
  if (h === 0) period = "Tengah Malam";
  else if (h >= 1 && h < 4) period = "Dini Hari";
  else if (h >= 4 && h < 6) period = "Subuh";
  else if (h >= 6 && h < 11) period = "Pagi";
  else if (h >= 11 && h < 15) period = "Siang";
  else if (h >= 15 && h < 18) period = "Sore";
  else period = "Malam";
  return `${time} WIB (${period})`;
}

// Generate rental time slots 24 Jam Penuh (Standar Rental, Bus Pariwisata & Travel Indonesia)
function generateRentalTimeSlots() {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, "0");
    slots.push(`${hh}:00`);
    slots.push(`${hh}:30`);
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
        bookingSlotDuration || 30,
      ),
    [bookingOpenTime, bookingCloseTime, bookingSlotDuration],
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
  const [bookedRentalRanges, setBookedRentalRanges] = useState<
    { startDate: string; endDate: string }[]
  >([]);

  // Receipt / ticket state
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const hasBankPayment = Boolean(bankName && bankAccount);

  async function handleDownloadTicket() {
    if (!ticketRef.current) {
      console.error(
        "Gagal mengunduh tiket: Elemen tiket (ticketRef) tidak ditemukan di DOM.",
      );
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

      const cleanTenantName = (tenantName || "Toko")
        .trim()
        .replace(/\s+/g, "_");
      const cleanCustomerName = (formData.customerName || "Pelanggan")
        .trim()
        .replace(/\s+/g, "_");
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
    const btn = document.getElementById("gps-btn");
    if (btn) btn.innerHTML = "⏳";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setRentalData((prev) => ({
          ...prev,
          pickupLocation: `https://maps.google.com/?q=${lat},${lon}`,
        }));
        if (btn) btn.innerHTML = "📍 GPS";
      },
      (error) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
        if (btn) btn.innerHTML = "📍 GPS";
      },
    );
  }

  const isRental = isRentalTravelCategory(tenantCategory);

  // Deteksi tipe rental yang benar-benar ada di katalog produk tenant ini
  // Hanya hitung unit fisik (isService=false), jangan hitung layanan tambahan (isService=true)
  const availableRentalTypes = useMemo(() => {
    if (!isRental || !services || services.length === 0)
      return ["equipment", "vehicle", "property"] as (
        "property" | "vehicle" | "equipment"
      )[];
    const types = new Set<"property" | "vehicle" | "equipment">();
    for (const s of services) {
      if (s.isService) continue; // Skip layanan tambahan (supir, extra bed, dll)
      const detected = detectRentalItemType(s.name, s.description, s.category);
      if (detected !== "unknown") types.add(detected);
    }
    return Array.from(types);
  }, [services, isRental]);

  const initialRentalType = useMemo(() => {
    const physicalUnits = services.filter((s) => !s.isService);
    if (physicalUnits.length > 0) {
      const detected = detectRentalItemType(
        physicalUnits[0].name,
        physicalUnits[0].description,
        physicalUnits[0].category,
      );
      return detected !== "unknown" ? detected : "equipment";
    }
    return "equipment";
  }, [services]);

  const [rentalCategoryType, setRentalCategoryType] = useState<
    "property" | "vehicle" | "equipment"
  >(initialRentalType);
  const [rentalModeDuration, setRentalModeDuration] = useState<
    "hourly" | "daily"
  >("hourly");

  // State khusus Transit Per Jam (Hourly Property)
  const [hourlyData, setHourlyData] = useState({
    checkInDate: todayISO,
    checkInTime: "12:00",
    durationHours: 3,
  });

  // Inisialisasi formData terlebih dahulu agar tidak terjadi Temporal Dead Zone (TDZ)
  const [formData, setFormData] = useState({
    productId:
      (services.find((s) => !s.isService) || services[0])?.id?.toString() ?? "",
    bookingDate: todayISO,
    bookingTime: "09:00",
    customerName: "",
    customerPhone: "",
    notes: "",
  });

  // Filter unit fisik untuk dropdown sewa (menyingkirkan add-on seperti spanduk, bbm, kenek)
  const selectableServices = useMemo(() => {
    if (!isRental) return services;
    const units = services.filter((s) => !s.isService);
    if (availableRentalTypes.length > 1) {
      const typeFiltered = units.filter((s) => {
        const type = detectRentalItemType(s.name, s.description, s.category);
        return type === rentalCategoryType;
      });
      if (typeFiltered.length > 0) return typeFiltered;
    }
    return units.length > 0 ? units : services.filter((s) => !s.isService);
  }, [services, isRental, availableRentalTypes, rentalCategoryType]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sinkronisasi otomatis productId saat selectableServices berubah
  useEffect(() => {
    if (selectableServices.length > 0) {
      const exists = selectableServices.some(
        (s) => s.id.toString() === formData.productId,
      );
      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          productId: selectableServices[0].id.toString(),
        }));
      }
    }
  }, [selectableServices, formData.productId]);

  useEffect(() => {
    setActivePhotoIdx(0);
  }, [formData.productId]);

  // State khusus Rental & Travel
  // State khusus Rental & Travel
  const [rentalData, setRentalData] = useState({
    startDate: todayISO,
    pickupTime: "08:00",
    endDate: todayISO,
    fulfillmentType: "pickup" as "pickup" | "delivery",
    pickupLocation: "",
    dropoffProvince: "",
    dropoffRegency: "",
    dropoffDistrict: "",
    dropoffLocation: "",
    returnTime: "17:00",
    deposit: 0,
    conditionNotes: "",
    deliveryFee: 0,
    setupNote: "",
  });

  // State untuk data wilayah (Emsifa API)
  const [provincesData, setProvincesData] = useState<Region[]>([]);
  const [regenciesData, setRegenciesData] = useState<Region[]>([]);
  const [districtsData, setDistrictsData] = useState<Region[]>([]);
  const [isFetchingRegion, setIsFetchingRegion] = useState(false);

  const selectedService = services.find(
    (s) => s.id.toString() === formData.productId,
  );

  const selectedServiceImages = useMemo(() => {
    return parseProductImages(selectedService?.image);
  }, [selectedService]);

  // Auto-set category type when selectedService changes or fallback to available
  useEffect(() => {
    if (selectedService) {
      const detected = detectRentalItemType(
        selectedService.name,
        selectedService.description,
        selectedService.category,
      );
      if (detected !== "unknown") setRentalCategoryType(detected);
    } else if (
      availableRentalTypes.length > 0 &&
      !availableRentalTypes.includes(rentalCategoryType)
    ) {
      setRentalCategoryType(availableRentalTypes[0]);
    }
  }, [selectedService, availableRentalTypes, rentalCategoryType]);

  // Calculated info for hourly transit
  const hourlyCheckoutInfo = useMemo(() => {
    if (!hourlyData.checkInDate || !hourlyData.checkInTime) {
      return {
        checkInLabel: "-",
        checkOutLabel: "-",
        startIso: "",
        endIso: "",
      };
    }
    const [h, m] = hourlyData.checkInTime.split(":").map(Number);
    const start = new Date(
      `${hourlyData.checkInDate}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
    );
    const end = new Date(
      start.getTime() + hourlyData.durationHours * 60 * 60 * 1000,
    );

    const checkInLabel =
      start.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + ` jam ${hourlyData.checkInTime} WIB`;

    const endH = String(end.getHours()).padStart(2, "0");
    const endM = String(end.getMinutes()).padStart(2, "0");
    const checkOutLabel =
      end.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + ` jam ${endH}:${endM} WIB`;

    return {
      checkInLabel,
      checkOutLabel,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      startDateStr: hourlyData.checkInDate,
      endDateStr: end.toISOString().split("T")[0],
    };
  }, [
    hourlyData.checkInDate,
    hourlyData.checkInTime,
    hourlyData.durationHours,
  ]);

  useEffect(() => {
    if (isRental && rentalCategoryType === "vehicle") {
      setIsFetchingRegion(true);
      fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then((res) => res.json())
        .then((data) => setProvincesData(data))
        .catch((err) => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  }, [isRental, rentalCategoryType]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceVal = e.target.value;
    setRentalData((prev) => ({
      ...prev,
      dropoffProvince: provinceVal,
      dropoffRegency: "",
      dropoffDistrict: "",
    }));
    setRegenciesData([]);
    setDistrictsData([]);
    setError(null);
    if (provinceVal) {
      const provinceId = provinceVal.split("|")[0];
      setIsFetchingRegion(true);
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
      )
        .then((res) => res.json())
        .then((data) => setRegenciesData(data))
        .catch((err) => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyVal = e.target.value;
    setRentalData((prev) => ({
      ...prev,
      dropoffRegency: regencyVal,
      dropoffDistrict: "",
    }));
    setDistrictsData([]);
    setError(null);
    if (regencyVal) {
      const regencyId = regencyVal.split("|")[0];
      setIsFetchingRegion(true);
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`,
      )
        .then((res) => res.json())
        .then((data) => setDistrictsData(data))
        .catch((err) => console.error(err))
        .finally(() => setIsFetchingRegion(false));
    }
  };

  // Fetch booked slots whenever date changes
  const checkSlots = useCallback(
    async (date: string) => {
      setIsCheckingSlots(true);
      try {
        const res = await fetch(
          `/api/booking/check-slots?date=${encodeURIComponent(date)}&slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(formData.productId)}`,
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
    [slug, timeSlots, formData.productId],
  );

  // For non-rental (Jasa) - check on bookingDate change
  useEffect(() => {
    if (!isRental) {
      checkSlots(formData.bookingDate);
    }
  }, [formData.bookingDate, formData.productId, checkSlots, isRental]);

  // For Property Hourly (Transit) - check on checkInDate change
  useEffect(() => {
    if (
      isRental &&
      rentalCategoryType === "property" &&
      rentalModeDuration === "hourly"
    ) {
      checkSlots(hourlyData.checkInDate);
    }
  }, [
    hourlyData.checkInDate,
    formData.productId,
    checkSlots,
    isRental,
    rentalCategoryType,
    rentalModeDuration,
  ]);

  const checkRentalRanges = useCallback(
    async (productId: string) => {
      if (!isRental || !productId) return;
      try {
        const res = await fetch(
          `/api/booking/check-rental?slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(productId)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setBookedRentalRanges(data.bookedRanges ?? []);
        }
      } catch {
        // silent fail
      }
    },
    [isRental, slug],
  );

  useEffect(() => {
    if (isRental) {
      checkRentalRanges(formData.productId);
    }
  }, [formData.productId, isRental, checkRentalRanges]);

  useEffect(() => {
    if (isRental && rentalData.startDate && rentalData.endDate) {
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
        setError(
          `${rentalCategoryType === "property" ? "Kamar / Unit" : rentalCategoryType === "vehicle" ? "Armada" : "Peralatan"} sudah disewa pada tanggal tersebut.`,
        );
      } else {
        setError((prev) => (prev?.includes("sudah disewa") ? null : prev));
      }
    }
  }, [
    rentalData.startDate,
    rentalData.endDate,
    bookedRentalRanges,
    isRental,
    rentalCategoryType,
  ]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      if (
        val.slice(0, third) === val.slice(third, third * 2) &&
        val.slice(0, third) === val.slice(third * 2)
      ) {
        val = val.slice(0, third);
      }
    }
    setFormData((prev) =>
      prev.customerName === val ? prev : { ...prev, customerName: val },
    );
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
      if (
        val.slice(0, third) === val.slice(third, third * 2) &&
        val.slice(0, third) === val.slice(third * 2)
      ) {
        val = val.slice(0, third);
      }
    }
    setFormData((prev) =>
      prev.customerPhone === val ? prev : { ...prev, customerPhone: val },
    );
    setError(null);
  }

  function handleShareWA() {
    let text = "";
    if (isRental) {
      const serviceText = selectedService
        ? ` untuk *${selectedService.name}*`
        : "";
      if (
        rentalCategoryType === "property" &&
        rentalModeDuration === "hourly"
      ) {
        text =
          `Halo, saya ingin mengkonfirmasi reservasi kamar/unit dengan ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Properti: *${tenantName}*${serviceText}\n` +
          `Waktu Check-in: *${hourlyCheckoutInfo.checkInLabel}*\n` +
          `Waktu Check-out: *${hourlyCheckoutInfo.checkOutLabel}* (*${hourlyData.durationHours} Jam Transit*).\n\n` +
          `Berikut bukti transfernya...`;
      } else if (rentalCategoryType === "property") {
        const startLabel = new Date(rentalData.startDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        const endLabel = new Date(rentalData.endDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        text =
          `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Properti: *${tenantName}*${serviceText}\n` +
          `Tanggal Sewa: *${startLabel}* s/d *${endLabel}*.\n\n` +
          `Berikut bukti transfernya...`;
      } else if (rentalCategoryType === "equipment") {
        const startLabel = new Date(rentalData.startDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        const endLabel = new Date(rentalData.endDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        const pickupTime = rentalData.pickupTime || "08:00";
        const returnTime = rentalData.returnTime || "17:00";
        text =
          `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Alat: *${tenantName}*${serviceText}\n` +
          `Tanggal Sewa: *${startLabel}* s/d *${endLabel}*\n` +
          `Jam Ambil: *${pickupTime} WIB*\n` +
          `Jam Kembali: *${returnTime} WIB*\n` +
          (rentalData.deposit > 0
            ? `DP / Deposit: *Rp ${new Intl.NumberFormat("id-ID").format(rentalData.deposit)}*\n`
            : "") +
          `\nBerikut bukti transfernya...`;
      } else {
        const startLabel = new Date(rentalData.startDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        const endLabel = new Date(rentalData.endDate).toLocaleDateString(
          "id-ID",
          { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        );
        text =
          `Halo, saya sudah melakukan pembayaran/DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Jadwal Berangkat: *${startLabel}* jam *${rentalData.pickupTime} WIB*\nJadwal Kepulangan: *${endLabel}* jam *${rentalData.returnTime || "20:00"} WIB*.\n\n` +
          `Berikut bukti transfernya...`;
      }
    } else {
      const dateLabel = new Date(
        `${formData.bookingDate}T${formData.bookingTime}`,
      ).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const serviceText = selectedService
        ? ` untuk layanan *${selectedService.name}*`
        : "";

      if (hasBankPayment) {
        text =
          `Halo, saya sudah membuat jadwal dan melakukan transfer DP untuk ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Waktu Kunjungan: *${dateLabel}* jam *${formData.bookingTime} WIB*.\n\n` +
          `Berikut saya lampirkan bukti transfernya...`;
      } else {
        text =
          `Halo, saya ingin mengkonfirmasi reservasi jadwal dengan ID Pesanan: *${bookingId ? bookingId.slice(0, 8) : "-"}*.\n` +
          `Nama Pemesan: *${formData.customerName}*\n` +
          `Layanan: *${tenantName}*${serviceText}\n` +
          `Waktu Kunjungan: *${dateLabel}* jam *${formData.bookingTime} WIB*.`;
      }
    }

    const waNumber = adminWhatsApp
      ? adminWhatsApp.replace(/[^0-9]/g, "").replace(/^0/, "62")
      : "";
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
      if (
        rentalCategoryType === "property" &&
        rentalModeDuration === "hourly"
      ) {
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
          if (
            !rentalData.dropoffProvince ||
            !rentalData.dropoffRegency ||
            !rentalData.dropoffDistrict
          ) {
            setError(
              "Provinsi, Kota/Kabupaten, dan Kecamatan tujuan wajib dipilih.",
            );
            return;
          }
        }
        if (rentalCategoryType === "equipment") {
          if (!rentalData.returnTime) {
            setError("Jam kembali wajib dipilih.");
            return;
          }
          if (
            rentalData.fulfillmentType === "delivery" &&
            !rentalData.dropoffLocation.trim()
          ) {
            setError("Alamat tujuan pengiriman wajib diisi untuk mode antar.");
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
        if (
          rentalCategoryType === "property" &&
          rentalModeDuration === "hourly"
        ) {
          bookingDateTime = new Date(
            `${hourlyData.checkInDate}T${hourlyData.checkInTime}:00`,
          );
          startDateIso = hourlyCheckoutInfo.startIso;
          endDateIso = hourlyCheckoutInfo.endIso;
          finalPickup = null;
          finalDropoff = null;
        } else {
          bookingDateTime = new Date(
            `${rentalData.startDate}T${rentalData.pickupTime}:00`,
          );
          startDateIso = new Date(
            `${rentalData.startDate}T${rentalData.pickupTime}:00`,
          ).toISOString();
          endDateIso = new Date(
            `${rentalData.endDate}T${rentalData.returnTime || "23:59"}:00`,
          ).toISOString();

          if (rentalCategoryType === "vehicle") {
            const provName = rentalData.dropoffProvince.split("|")[1] || "";
            const regName = rentalData.dropoffRegency.split("|")[1] || "";
            const distName = rentalData.dropoffDistrict.split("|")[1] || "";
            finalDropoff = provName
              ? `[${provName} - ${regName} - ${distName}] ${rentalData.dropoffLocation}`.trim()
              : rentalData.dropoffLocation;
            finalPickup = rentalData.pickupLocation.trim() || null;
          } else {
            // equipment: handle pickup vs delivery
            if (rentalData.fulfillmentType === "pickup") {
              finalPickup = rentalData.pickupLocation || tenantName; // toko address
              finalDropoff = null;
            } else {
              finalPickup = rentalData.pickupLocation || tenantName;
              finalDropoff = rentalData.dropoffLocation.trim() || null;
            }
          }
        }
      } else {
        bookingDateTime = new Date(
          `${formData.bookingDate}T${formData.bookingTime}:00`,
        );
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
          pickupTime:
            rentalCategoryType === "equipment" ||
            rentalCategoryType === "vehicle"
              ? rentalData.pickupTime || "08:00"
              : null,
          returnTime:
            rentalCategoryType === "equipment" ||
            rentalCategoryType === "vehicle"
              ? rentalData.returnTime || "20:00"
              : null,
          deposit: rentalCategoryType === "equipment" ? rentalData.deposit : 0,
          conditionNotes:
            rentalCategoryType === "equipment"
              ? rentalData.conditionNotes
              : null,
          fulfillmentType:
            rentalCategoryType === "equipment"
              ? rentalData.fulfillmentType
              : null,
          deliveryFee:
            rentalCategoryType === "equipment" ? rentalData.deliveryFee : 0,
          setupNote:
            rentalCategoryType === "equipment" ? rentalData.setupNote : null,
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isRental
            ? "Reservasi Berhasil Dibuat!"
            : "Jadwal Antrean Berhasil Dibuat!"}
        </h2>
        <p className="text-slate-500 text-sm mb-1">
          Halo{" "}
          <span className="text-slate-900 font-semibold">
            {formData.customerName}
          </span>
          ,
        </p>
        {isRental ? (
          <p className="text-slate-500 text-sm mb-6">
            Pesanan Anda di{" "}
            <span className="text-blue-600 font-semibold">{tenantName}</span>{" "}
            telah berhasil dicatat. Tim kami akan menghubungi Anda melalui nomor{" "}
            <span className="text-slate-900 font-semibold">
              {formData.customerPhone}
            </span>
            .
          </p>
        ) : hasBankPayment ? (
          <p className="text-slate-500 text-sm mb-6">
            Antrean reservasi Anda di{" "}
            <span className="text-blue-600 font-semibold">{tenantName}</span>{" "}
            berhasil dicatat. Silakan selesaikan pembayaran DP / tanda jadi ke
            rekening di bawah dan kirim bukti transfer ke WhatsApp kami untuk
            konfirmasi slot.
          </p>
        ) : (
          <p className="text-slate-500 text-sm mb-6">
            Antrean Anda di{" "}
            <span className="text-blue-600 font-semibold">{tenantName}</span>{" "}
            berhasil dicatat. Silakan datang ke lokasi sesuai jadwal dan lakukan
            pembayaran langsung di Kasir.
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
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Nama</span>
              <span className="text-slate-900 font-semibold text-xs">
                {formData.customerName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">No. HP</span>
              <span className="text-slate-900 font-semibold text-xs">
                {formData.customerPhone}
              </span>
            </div>
            {selectedService && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">
                  {isRental ? "Unit / Armada" : "Layanan / Servis"}
                </span>
                <span className="text-slate-900 font-semibold text-xs">
                  {selectedService.name}
                </span>
              </div>
            )}

            {/* === Rincian Rental (Properti Kos Transit vs Kendaraan) === */}
            {isRental ? (
              rentalCategoryType === "property" &&
              rentalModeDuration === "hourly" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Check-in</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {hourlyCheckoutInfo.checkInLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Check-out</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {hourlyCheckoutInfo.checkOutLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">
                      Durasi Transit
                    </span>
                    <span className="text-blue-600 font-bold text-xs">
                      {hourlyData.durationHours} Jam
                    </span>
                  </div>
                </>
              ) : rentalCategoryType === "property" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Mulai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.startDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Selesai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.endDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </>
              ) : rentalCategoryType === "equipment" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Mulai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.startDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Selesai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.endDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {(rentalData.dropoffProvince ||
                    rentalData.dropoffLocation) && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Tujuan</span>
                      <span className="text-slate-900 font-semibold text-xs text-right max-w-[65%] truncate">
                        {rentalData.dropoffProvince
                          ? `[${rentalData.dropoffProvince.split("|")[1]} - ${rentalData.dropoffRegency.split("|")[1]} - ${rentalData.dropoffDistrict.split("|")[1]}] `
                          : ""}
                        {rentalData.dropoffLocation}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Mulai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.startDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}{" "}
                      {rentalData.pickupTime} WIB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Selesai Sewa</span>
                    <span className="text-slate-900 font-semibold text-xs">
                      {new Date(rentalData.endDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Tanggal</span>
                  <span className="text-slate-900 font-semibold text-xs">
                    {new Date(
                      `${formData.bookingDate}T${formData.bookingTime}`,
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Jam</span>
                  <span className="text-slate-900 font-semibold text-xs">
                    {formData.bookingTime} WIB
                  </span>
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
                style={{
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 5 === 0 ? 20 : 14,
                }}
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
                    {isRental
                      ? "Total Tagihan (DP 50%)"
                      : "Estimasi DP / Tanda Jadi (50%)"}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-blue-700 text-sm">
                      {formatRupiah(
                        Math.round(selectedService.hargaJual * 0.5),
                      )}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Total Layanan: {formatRupiah(selectedService.hargaJual)}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100 gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-500 font-medium">
                    Transfer ke Rekening
                  </span>
                  <span className="font-bold text-slate-800 text-sm font-mono truncate">
                    {bankName || "BCA"} - {bankAccount}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    a.n. {bankAccountName || tenantName}
                  </span>
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
              *Silakan transfer sesuai nominal DP di atas dan lampirkan bukti
              transfer via WhatsApp agar jadwal langsung dikunci oleh Admin.
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
            {hasBankPayment || isRental
              ? "Kirim Bukti Transfer via WhatsApp"
              : isRental
                ? "Hubungi Admin via WhatsApp"
                : "Konfirmasi Antrean via WhatsApp"}
          </button>

          <button
            id="download-ticket-btn"
            onClick={handleDownloadTicket}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-sm font-bold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Menyiapkan Gambar...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {isRental ? "Unduh Tiket Reservasi" : "Unduh Tiket Antrean"}
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setStep("form");
            setFormData((prev) => ({
              ...prev,
              customerName: "",
              customerPhone: "",
              notes: "",
            }));
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
      className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-md space-y-5 w-full max-w-full"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">
          {isRental
            ? "Formulir Pemesanan Sewa & Travel"
            : "Isi Detail Jadwal Layanan"}
        </h2>
        <p className="text-slate-500 text-xs">
          Semua field bertanda * wajib diisi
        </p>
      </div>

      {/* Pilih Layanan / Unit */}
      {services.length > 0 && (
        <div className="space-y-3 w-full max-w-full">
          <div className="space-y-1.5 w-full max-w-full">
            <label
              htmlFor="productId"
              className="text-xs font-bold text-slate-700 uppercase tracking-wider block"
            >
              {isRental ? (
                <>
                  {availableRentalTypes.length === 1 &&
                    availableRentalTypes[0] === "equipment" &&
                    "Pilih Alat / Perlengkapan *"}
                  {availableRentalTypes.length === 1 &&
                    availableRentalTypes[0] === "vehicle" &&
                    "Pilih Kendaraan / Armada *"}
                  {availableRentalTypes.length === 1 &&
                    availableRentalTypes[0] === "property" &&
                    "Pilih Unit / Kamar *"}
                  {availableRentalTypes.length > 1 &&
                    (rentalCategoryType === "vehicle"
                      ? "Pilih Kendaraan / Armada *"
                      : rentalCategoryType === "property"
                        ? "Pilih Unit / Kamar *"
                        : "Pilih Alat / Perlengkapan *")}
                </>
              ) : (
                "Pilih Layanan / Servis *"
              )}
            </label>

            {/* Selector Custom Responsif: Tidak Pernah Melebar di Desktop maupun Mobile */}
            <div
              ref={productDropdownRef}
              className="relative w-full max-w-full"
            >
              <input
                type="hidden"
                id="productId"
                name="productId"
                value={formData.productId}
                required
              />

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsProductDropdownOpen((prev) => !prev)}
                className={`w-full max-w-full bg-white border rounded-xl px-3.5 py-2.5 sm:py-3 text-left transition-all shadow-sm flex items-center justify-between gap-2.5 cursor-pointer ${
                  isProductDropdownOpen
                    ? "border-blue-500 ring-2 ring-blue-500/20"
                    : "border-slate-300 hover:border-blue-400"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isProductDropdownOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  {selectedService ? (
                    <>
                      {(() => {
                        const imgs = parseProductImages(selectedService.image);
                        if (imgs.length > 0) {
                          return (
                            <img
                              src={imgs[0]}
                              alt=""
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                            />
                          );
                        }
                        return null;
                      })()}
                      <div className="min-w-0 flex-1 truncate">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {selectedService.name}
                        </p>
                        <p className="text-[11px] sm:text-xs font-semibold text-blue-600 truncate">
                          {formatRupiah(selectedService.hargaJual)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {isRental
                        ? rentalCategoryType === "vehicle"
                          ? "— Pilih Kendaraan / Armada —"
                          : rentalCategoryType === "property"
                            ? "— Pilih Unit / Kamar —"
                            : "— Pilih Alat / Perlengkapan —"
                        : "— Pilih Layanan —"}
                    </span>
                  )}
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isProductDropdownOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Popover (Lebar terkunci 100% container) */}
              {isProductDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100 w-full max-w-full">
                  {selectableServices.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      Tidak ada pilihan yang tersedia
                    </div>
                  ) : (
                    selectableServices.map((s) => {
                      const isSelected = s.id.toString() === formData.productId;
                      const imgs = parseProductImages(s.image);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              productId: s.id.toString(),
                            }));
                            setIsProductDropdownOpen(false);
                            setError(null);
                          }}
                          className={`w-full text-left p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/90 text-blue-900"
                              : "hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                            {imgs.length > 0 ? (
                              <img
                                src={imgs[0]}
                                alt=""
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                              />
                            ) : (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 text-xs">
                                📷
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs sm:text-sm leading-snug break-words line-clamp-2 ${
                                  isSelected
                                    ? "font-bold text-blue-900"
                                    : "font-semibold text-slate-800"
                                }`}
                              >
                                {s.name}
                              </p>
                              <p className="text-[11px] sm:text-xs font-bold text-blue-600 mt-0.5">
                                {formatRupiah(s.hargaJual)}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-1">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Unit Showcase Card: Foto Galeri & Detail Unit */}
          {selectedService && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 transition-all w-full max-w-full overflow-hidden">
              {/* Photo Showcase (jika ada foto) */}
              {selectedServiceImages.length > 0 && (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner group">
                    <img
                      src={
                        selectedServiceImages[activePhotoIdx] ||
                        selectedServiceImages[0]
                      }
                      alt={selectedService.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Badge Photo Count */}
                    {selectedServiceImages.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <span>📷</span>
                        <span>
                          {activePhotoIdx + 1}/{selectedServiceImages.length}
                        </span>
                      </div>
                    )}
                    {/* Prev/Next arrows if multiple photos */}
                    {selectedServiceImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActivePhotoIdx((prev) =>
                              prev === 0
                                ? selectedServiceImages.length - 1
                                : prev - 1,
                            );
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-xs transition-colors shadow"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActivePhotoIdx((prev) =>
                              prev === selectedServiceImages.length - 1
                                ? 0
                                : prev + 1,
                            );
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-xs transition-colors shadow"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {selectedServiceImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                      {selectedServiceImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            activePhotoIdx === idx
                              ? "border-blue-600 scale-105 shadow-sm"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Detail Info Unit */}
              <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-100">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {selectedService.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isRental ? "Unit / Armada Terpilih" : "Layanan Terpilih"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Tarif Sewa Mulai
                  </span>
                  <span className="font-black text-blue-600 text-sm sm:text-base">
                    {formatRupiah(selectedService.hargaJual)}
                  </span>
                </div>
              </div>

              {/* Deskripsi & Spesifikasi Unit */}
              {selectedService.description && (
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs text-slate-600 leading-relaxed">
                  {selectedService.description}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tanggal Kunjungan — hanya tampil untuk non-Rental */}
      {!isRental && (
        <div className="space-y-1.5">
          <label
            htmlFor="bookingDate"
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
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
          {/* Selector Tipe Rental — hanya muncul jika tenant memiliki lebih dari 1 jenis sewa */}
          {availableRentalTypes.length > 1 && (
            <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold gap-1">
              {availableRentalTypes.includes("property") && (
                <button
                  type="button"
                  onClick={() => {
                    setRentalCategoryType("property");
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    rentalCategoryType === "property"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>🏨</span>
                  <span className="hidden sm:inline">Properti / Kos</span>
                  <span className="sm:hidden">Properti</span>
                </button>
              )}
              {availableRentalTypes.includes("vehicle") && (
                <button
                  type="button"
                  onClick={() => {
                    setRentalCategoryType("vehicle");
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    rentalCategoryType === "vehicle"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>🚗</span>
                  <span className="hidden sm:inline">Kendaraan</span>
                  <span className="sm:hidden">Kendaraan</span>
                </button>
              )}
              {availableRentalTypes.includes("equipment") && (
                <button
                  type="button"
                  onClick={() => {
                    setRentalCategoryType("equipment");
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    rentalCategoryType === "equipment"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>📦</span>
                  <span className="hidden sm:inline">Alat / Barang</span>
                  <span className="sm:hidden">Alat</span>
                </button>
              )}
            </div>
          )}

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
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      rentalModeDuration === "hourly"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    ⏱️ Transit Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setRentalModeDuration("daily")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      rentalModeDuration === "daily"
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
                    <label
                      htmlFor="hourly-checkInDate"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Tanggal Check-in *
                    </label>
                    <input
                      id="hourly-checkInDate"
                      type="date"
                      value={hourlyData.checkInDate}
                      min={todayISO}
                      onChange={(e) => {
                        setHourlyData((prev) => ({
                          ...prev,
                          checkInDate: e.target.value,
                        }));
                        setError(null);
                      }}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:light]"
                    />
                  </div>

                  {/* Jam Masuk (Check-in Time) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="hourly-checkInTime"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Jam Masuk (Check-in) *
                    </label>
                    <ModernTimePicker
                      id="hourly-checkInTime"
                      value={hourlyData.checkInTime}
                      onChange={async (val) => {
                        setHourlyData((prev) => ({
                          ...prev,
                          checkInTime: val,
                        }));
                        setError(null);
                        const dateToCheck = hourlyData.checkInDate;
                        if (dateToCheck) {
                          const res = await fetch(
                            `/api/booking/check-slots?date=${encodeURIComponent(dateToCheck)}&slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(formData.productId)}`,
                          );
                          if (res.ok) {
                            const data = await res.json();
                            const booked = data.bookedSlots ?? [];
                            if (booked.includes(val)) {
                              setError(
                                `Jam ${val} sudah dipesan pada tanggal tersebut. Pilih jam lain.`,
                              );
                            }
                          }
                        }
                      }}
                      disabledSlots={bookedSlots}
                      label="Jam Masuk (Check-in)"
                      theme="amber"
                      className="w-full"
                    />
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
                              setHourlyData((prev) => ({
                                ...prev,
                                durationHours: hours,
                              }));
                              setError(null);
                            }}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                              isSelected
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
                      <span className="text-slate-500 font-medium">
                        Check-in:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {hourlyCheckoutInfo.checkInLabel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">
                        Check-out (Estimasi):
                      </span>
                      <span className="font-semibold text-amber-600">
                        {hourlyCheckoutInfo.checkOutLabel}
                      </span>
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
                      setRentalData((prev) => ({
                        ...prev,
                        startDate: start,
                        endDate: end,
                      }));
                      setError(null);
                    }}
                    onClearError={() => setError(null)}
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="rental-pickupTime"
                      className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Jam Check-in *
                    </label>
                    <ModernTimePicker
                      id="rental-pickupTime"
                      value={rentalData.pickupTime}
                      onChange={(val) => {
                        setRentalData((prev) => ({ ...prev, pickupTime: val }));
                        setError(null);
                      }}
                      disabledSlots={bookedSlots}
                      label="Jam Check-in (WIB)"
                      theme="amber"
                      className="w-full"
                    />
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
                  setRentalData((prev) => ({
                    ...prev,
                    startDate: start,
                    endDate: end,
                  }));
                  setError(null);
                }}
                onClearError={() => setError(null)}
              />

              {/* Jam Ambil & Jam Kembali */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-pickupTime"
                    className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Jam Ambil *
                  </label>
                  <ModernTimePicker
                    id="rental-pickupTime-equip"
                    value={rentalData.pickupTime}
                    onChange={(val) => {
                      setRentalData((prev) => ({ ...prev, pickupTime: val }));
                      setError(null);
                    }}
                    disabledSlots={bookedSlots}
                    label="Jam Ambil (WIB)"
                    theme="amber"
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-returnTime"
                    className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Jam Kembali *
                  </label>
                  <ModernTimePicker
                    id="rental-returnTime-equip"
                    value={rentalData.returnTime || "17:00"}
                    onChange={(val) => {
                      setRentalData((prev) => ({ ...prev, returnTime: val }));
                      setError(null);
                    }}
                    label="Jam Kembali (WIB)"
                    theme="amber"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Tampilkan durasi jika ada */}
              {rentalData.startDate &&
                rentalData.endDate &&
                rentalData.endDate >= rentalData.startDate && (
                  <p className="text-amber-600 text-xs font-medium">
                    Durasi sewa:{" "}
                    {Math.round(
                      (new Date(rentalData.endDate).getTime() -
                        new Date(rentalData.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) + 1}{" "}
                    hari
                  </p>
                )}

              {/* Fulfilment Type Selector - KHUSUS EQUIPMENT */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  MODE PENGAMBILAN *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setRentalData((prev) => ({
                        ...prev,
                        fulfillmentType: "pickup",
                      }))
                    }
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      rentalData.fulfillmentType === "pickup"
                        ? "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>🏪</span>
                      <span>Ambil di Toko</span>
                    </div>
                    <p className="text-[10px] mt-0.5 opacity-80">
                      Customer datang ambil & cek barang
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setRentalData((prev) => ({
                        ...prev,
                        fulfillmentType: "delivery",
                      }))
                    }
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      rentalData.fulfillmentType === "delivery"
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>🚚</span>
                      <span>Diantar ke Lokasi</span>
                    </div>
                    <p className="text-[10px] mt-0.5 opacity-80">
                      Kami antar ke alamat event/hotel
                    </p>
                  </button>
                </div>
              </div>

              {/* Pickup Mode - Alamat Toko (readonly) */}
              {rentalData.fulfillmentType === "pickup" && (
                <div className="space-y-1.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    LOKASI PENGIRIMAN (ALAMAT TOKO)
                  </label>
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-700">
                      {tenantName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customer datang ke toko untuk ambil & cek kondisi alat
                    </p>
                  </div>
                  <input
                    type="hidden"
                    name="pickupLocation"
                    value={tenantName}
                    onChange={(e) =>
                      setRentalData((prev) => ({
                        ...prev,
                        pickupLocation: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {/* Delivery Mode - Input Lokasi Tujuan */}
              {rentalData.fulfillmentType === "delivery" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="rental-dropoff"
                      className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      ALAMAT TUJUAN PENGIRIMAN *
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="rental-dropoff"
                        type="text"
                        value={rentalData.dropoffLocation}
                        onChange={(e) => {
                          setRentalData((prev) => ({
                            ...prev,
                            dropoffLocation: e.target.value,
                          }));
                          setError(null);
                        }}
                        placeholder="contoh: Hotel Aston Denpasar, Jl. Raya Kuta No. 123"
                        required
                        className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button
                        id="gps-btn-delivery"
                        type="button"
                        onClick={handleGeolocation}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-xl text-slate-700 font-bold text-sm flex-shrink-0 transition-colors tooltip"
                        title="Gunakan Lokasi Saat Ini"
                      >
                        📍 GPS
                      </button>
                    </div>
                  </div>

                  {/* Optional: Ongkir & Setup Note */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="rental-deliveryFee"
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        BIAYA ONGKIR (Opsional)
                      </label>
                      <input
                        id="rental-deliveryFee"
                        type="number"
                        min="0"
                        step="1000"
                        value={rentalData.deliveryFee || 0}
                        onChange={(e) => {
                          setRentalData((prev) => ({
                            ...prev,
                            deliveryFee: Number(e.target.value) || 0,
                          }));
                          setError(null);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="contoh: 50000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="rental-setupNote"
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        CATATAN SETUP (Opsional)
                      </label>
                      <input
                        id="rental-setupNote"
                        type="text"
                        value={rentalData.setupNote || ""}
                        onChange={(e) => {
                          setRentalData((prev) => ({
                            ...prev,
                            setupNote: e.target.value,
                          }));
                          setError(null);
                        }}
                        placeholder="contoh: Butuh teknisi sound, setup pukul 08:00"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Deposit / Jaminan */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rental-deposit"
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  DEPOSIT / JAMINAN{" "}
                  <span className="normal-case font-normal text-slate-500">
                    (opsional, isi 0 jika tidak ada)
                  </span>
                </label>
                <input
                  id="rental-deposit"
                  type="number"
                  min="0"
                  step="1000"
                  value={rentalData.deposit || 0}
                  onChange={(e) => {
                    setRentalData((prev) => ({
                      ...prev,
                      deposit: Number(e.target.value) || 0,
                    }));
                    setError(null);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="contoh: 500000"
                />
                <p className="text-[10px] text-amber-600 mt-1">
                  Akan ditambahkan ke total tagihan & dikembalikan saat alat
                  dikembalikan utuh.
                </p>
              </div>

              {/* Catatan Kondisi / Request Khusus */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rental-condition"
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  CATATAN KONDISI / REQUEST KHUSUS{" "}
                  <span className="normal-case font-normal text-slate-500">
                    (opsional)
                  </span>
                </label>
                <textarea
                  id="rental-condition"
                  rows={3}
                  value={rentalData.conditionNotes || ""}
                  onChange={(e) => {
                    setRentalData((prev) => ({
                      ...prev,
                      conditionNotes: e.target.value,
                    }));
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
                  setRentalData((prev) => ({
                    ...prev,
                    startDate: start,
                    endDate: end,
                  }));
                  setError(null);
                }}
                onClearError={() => setError(null)}
              />

              {/* Jadwal Jam Berangkat & Jam Pulang (24 Jam WIB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-pickupTime"
                    className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>Jam Berangkat / Jemput *</span>
                    <span className="text-[10px] text-amber-600 font-bold lowercase">
                      24 jam wib
                    </span>
                  </label>
                  <ModernTimePicker
                    id="rental-pickupTime-veh"
                    value={rentalData.pickupTime || "08:00"}
                    onChange={(val) => {
                      setRentalData((prev) => ({ ...prev, pickupTime: val }));
                      setError(null);
                    }}
                    disabledSlots={bookedSlots}
                    label="Jam Berangkat / Jemput (WIB)"
                    theme="amber"
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-returnTime"
                    className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>Jam Pulang / Selesai *</span>
                    <span className="text-[10px] text-amber-600 font-bold lowercase">
                      24 jam wib
                    </span>
                  </label>
                  <ModernTimePicker
                    id="rental-returnTime-veh"
                    value={rentalData.returnTime || "20:00"}
                    onChange={(val) => {
                      setRentalData((prev) => ({ ...prev, returnTime: val }));
                      setError(null);
                    }}
                    label="Jam Pulang / Selesai (WIB)"
                    theme="amber"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Tampilkan durasi sewa & ringkasan rute */}
              {rentalData.startDate &&
                rentalData.endDate &&
                rentalData.endDate >= rentalData.startDate && (
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-amber-900">
                    <span className="font-semibold">
                      Total Durasi Perjalanan:
                    </span>
                    <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-800 shadow-sm">
                      {Math.round(
                        (new Date(rentalData.endDate).getTime() -
                          new Date(rentalData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      ) + 1}{" "}
                      Hari
                    </span>
                  </div>
                )}

              {/* Lokasi Penjemputan / Alamat */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rental-pickup"
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  TITIK PENJEMPUTAN / LOKASI KUMPUL ROMBONGAN{" "}
                  <span className="normal-case font-normal text-slate-500">
                    (opsional)
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="rental-pickup"
                    type="text"
                    value={rentalData.pickupLocation}
                    onChange={(e) => {
                      setRentalData((prev) => ({
                        ...prev,
                        pickupLocation: e.target.value,
                      }));
                      setError(null);
                    }}
                    placeholder="contoh: Depan Pool Garasi, Bandara, Kantor, atau Alamat Rombongan"
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
                {isFetchingRegion && (
                  <div className="text-[10px] text-blue-500 font-semibold animate-pulse">
                    Memuat data wilayah...
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-dropoffProvince"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    PROVINSI TUJUAN WISATA / PERJALANAN *
                  </label>
                  <select
                    id="rental-dropoffProvince"
                    value={rentalData.dropoffProvince}
                    onChange={handleProvinceChange}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none"
                  >
                    <option value="" disabled className="text-slate-500">
                      Pilih Provinsi Tujuan
                    </option>
                    {provincesData.map((prov) => (
                      <option key={prov.id} value={`${prov.id}|${prov.name}`}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-dropoffRegency"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    KOTA / KABUPATEN TUJUAN *
                  </label>
                  <select
                    id="rental-dropoffRegency"
                    value={rentalData.dropoffRegency}
                    onChange={handleRegencyChange}
                    disabled={
                      !rentalData.dropoffProvince || regenciesData.length === 0
                    }
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled className="text-slate-500">
                      Pilih Kota/Kabupaten
                    </option>
                    {regenciesData.map((reg) => (
                      <option key={reg.id} value={`${reg.id}|${reg.name}`}>
                        {reg.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-dropoffDistrict"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    KECAMATAN / AREA TUJUAN *
                  </label>
                  <select
                    id="rental-dropoffDistrict"
                    value={rentalData.dropoffDistrict}
                    onChange={(e) => {
                      setRentalData((prev) => ({
                        ...prev,
                        dropoffDistrict: e.target.value,
                      }));
                      setError(null);
                    }}
                    disabled={
                      !rentalData.dropoffRegency || districtsData.length === 0
                    }
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled className="text-slate-500">
                      Pilih Kecamatan
                    </option>
                    {districtsData.map((dist) => (
                      <option key={dist.id} value={`${dist.id}|${dist.name}`}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rental-dropoff"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    ALAMAT DETAIL DESTINASI / LOKASI ACARA{" "}
                    <span className="normal-case font-normal text-slate-500">
                      (opsional)
                    </span>
                  </label>
                  <input
                    id="rental-dropoff"
                    type="text"
                    value={rentalData.dropoffLocation}
                    onChange={(e) => {
                      setRentalData((prev) => ({
                        ...prev,
                        dropoffLocation: e.target.value,
                      }));
                      setError(null);
                    }}
                    placeholder="contoh: Kawasan Wisata Bromo, Hotel Santika, Candi Borobudur, dll."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  <p className="text-[10px] text-amber-600 mt-1">
                    *Catatan: Harga tercantum adalah tarif dasar. Biaya final
                    akan disesuaikan dengan rute jarak tempuh (km), armada yang
                    dipilih, dan kebutuhan operasional jalan.
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
                <svg
                  className="w-3 h-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Mengecek ketersediaan...
              </span>
            )}
          </div>

          {/* Grid tombol jam — Format Waktu Indonesia (WIB) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                    relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all duration-150
                    ${
                      isBooked
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                        : isSelected
                          ? "bg-blue-600 text-white border border-blue-600 shadow-lg shadow-blue-600/30 scale-[1.04]"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 active:scale-95"
                    }
                  `}
                >
                  <span className="text-sm font-bold leading-tight">
                    {slot}
                  </span>
                  <span
                    className={`text-[10px] font-medium leading-none mt-0.5 ${isSelected ? "text-blue-200" : isBooked ? "text-slate-400" : "text-slate-400"}`}
                  >
                    WIB
                  </span>
                  <span
                    className={`text-[9px] leading-none mt-0.5 ${isSelected ? "text-blue-100" : isBooked ? "text-slate-400" : "text-slate-400"}`}
                  >
                    {isBooked
                      ? "Terisi"
                      : (() => {
                          const h = parseInt(slot.split(":")[0], 10);
                          if (h === 0) return "Tengah Malam";
                          if (h >= 1 && h < 4) return "Dini Hari";
                          if (h >= 4 && h < 6) return "Subuh";
                          if (h >= 6 && h < 11) return "Pagi";
                          if (h >= 11 && h < 15) return "Siang";
                          if (h >= 15 && h < 18) return "Sore";
                          return "Malam";
                        })()}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600"></div>
              <span className="text-[10px] text-slate-500">Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
              <span className="text-[10px] text-slate-500">Terisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border border-slate-200"></div>
              <span className="text-[10px] text-slate-500">Tersedia</span>
            </div>
          </div>
        </div>
      )}

      {/* Nama */}
      <div className="space-y-1.5">
        <label
          htmlFor="customerName"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          {isRental
            ? "Nama Penanggung Jawab / Kontak Rombongan *"
            : "Nama Lengkap *"}
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
        <label
          htmlFor="customerPhone"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          {isRental
            ? "Nomor WhatsApp Pemesan (Aktif) *"
            : "Nomor HP / WhatsApp *"}
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
        <label
          htmlFor="notes"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          {isRental && rentalCategoryType === "vehicle"
            ? "Catatan / Request Khusus Perjalanan"
            : isRental && rentalCategoryType === "equipment"
              ? "Catatan / Request Sewa Alat"
              : isRental && rentalCategoryType === "property"
                ? "Catatan / Request Kamar / Unit"
                : "Catatan / Request Khusus"}{" "}
          <span className="normal-case font-normal text-slate-500">
            (opsional)
          </span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder={
            isRental && rentalCategoryType === "vehicle"
              ? "Cth: Bawa banyak koper/bagasi rombongan, rute mampir ke rest area/pusat oleh-oleh, request mic karaoke bus, butuh supir berpengalaman..."
              : isRental && rentalCategoryType === "equipment"
                ? "Cth: Butuh kabel ekstensi cadangan, tes fungsi alat sebelum dikirim, bantuan pasang tenda..."
                : isRental && rentalCategoryType === "property"
                  ? "Cth: Request kamar non-smoking, check-in lebih awal, kasur tambahan..."
                  : "Cth: Model potongan rambut, keluhan kerusakan motor/alat, request staf tertentu..."
          }
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
            rentalCategoryType === "vehicle" ? (
              <>
                <p className="font-bold">
                  Informasi Reservasi Armada & Konfirmasi:
                </p>
                <p>
                  Pemesanan armada/travel ini memerlukan{" "}
                  <strong>Uang Muka (DP) / Tanda Jadi</strong> untuk mengunci
                  jadwal armada di tanggal pilihan rombongan Anda.
                </p>
                <p>
                  Setelah formulir dikirim, nomor rekening pembayaran akan
                  ditampilkan dan Admin kami siap berkoordinasi via WhatsApp
                  terkait rute, kontak driver, dan penjemputan.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold">Informasi Pembayaran & Konfirmasi:</p>
                <p>
                  Pesanan sewa ini memerlukan{" "}
                  <strong>Down Payment (DP) 50%</strong> dari total tagihan.
                </p>
                <p>
                  Setelah form dikirim, nomor rekening transfer akan ditampilkan
                  dan Anda dapat langsung mengirim bukti pembayaran via
                  WhatsApp.
                </p>
              </>
            )
          ) : hasBankPayment ? (
            <>
              <p className="font-bold">
                Informasi Reservasi & Tanda Jadi (DP):
              </p>
              <p>
                Untuk mengunci antrean jadwal Anda, diperlukan{" "}
                <strong>transfer DP / Tanda Jadi 50%</strong> ke rekening resmi
                toko.
              </p>
              <p>
                Setelah reservasi dikirim, nomor rekening akan muncul di tiket
                dan Anda dapat mengonfirmasi bukti transfer melalui WhatsApp
                Admin.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold">Informasi Kedatangan:</p>
              <p>
                Silakan datang ke lokasi sesuai dengan jadwal yang telah Anda
                pilih. Pembayaran dapat dilakukan langsung di Kasir setelah
                pelayanan selesai.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        id="submit-booking-btn"
        type="submit"
        disabled={isSubmitting || (!isRental && isCheckingSlots)}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isSubmitting || (!isRental && isCheckingSlots)
            ? "bg-blue-100 text-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Menyimpan...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isRental ? "Buat Reservasi Sekarang" : "Booking Jadwal Sekarang"}
          </>
        )}
      </button>
    </form>
  );
}

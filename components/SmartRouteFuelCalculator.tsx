"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Fuel, 
  MapPin, 
  ArrowLeftRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Settings2,
  Car
} from 'lucide-react';
import { 
  FUEL_TYPES, 
  detectVehicleProfile, 
  calculateFuelEstimate, 
  FuelEstimateResult 
} from '@/lib/fuel-config';

interface SmartRouteFuelCalculatorProps {
  vehicleName: string;
  basePrice?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  onApplyPricing: (newPrice: number, tripBreakdown: string) => void;
  onUpdateLocations?: (pickup: string, dropoff: string) => void;
}

// Helper pemisah ribuan standar Indonesia (titik)
const formatThousand = (val: number | ''): string => {
  if (val === '' || isNaN(val)) return '';
  return new Intl.NumberFormat('id-ID').format(val);
};

// Helper parse string ribuan kembali ke number murni
const parseThousand = (str: string): number | '' => {
  const clean = str.replace(/\D/g, '');
  return clean === '' ? '' : Number(clean);
};

// Format Rupiah rapi dengan spasi & pemisah ribuan (contoh: "Rp 250.000")
const formatRupiah = (val: number): string => {
  if (isNaN(val) || val === null || val === undefined) return "Rp 0";
  return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(val))}`;
};

export default function SmartRouteFuelCalculator({
  vehicleName,
  basePrice = 0,
  pickupLocation = '',
  dropoffLocation = '',
  onApplyPricing,
  onUpdateLocations,
}: SmartRouteFuelCalculatorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAdvancedFuel, setShowAdvancedFuel] = useState(false);
  const [appliedMode, setAppliedMode] = useState<"all_in" | "add_to_base" | null>(null);
  
  // Rute & Jarak
  const [pickup, setPickup] = useState(pickupLocation);
  const [dropoff, setDropoff] = useState(dropoffLocation);
  const [distanceKm, setDistanceKm] = useState<number | ''>(150);
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  // Auto profile
  const profile = useMemo(() => detectVehicleProfile(vehicleName), [vehicleName]);

  // Fuel configuration overrides
  const [selectedFuelId, setSelectedFuelId] = useState(profile.defaultFuelId);
  const [customKmPerLiter, setCustomKmPerLiter] = useState<number | ''>(profile.defaultKmPerLiter);
  const [customFuelPrice, setCustomFuelPrice] = useState<number | ''>(FUEL_TYPES[profile.defaultFuelId]?.defaultPrice || 6800);

  // Additional options
  const [includeSafetyMargin, setIncludeSafetyMargin] = useState(true);
  const [includeDriver, setIncludeDriver] = useState(true);
  const [driverFee, setDriverFee] = useState<number | ''>(profile.recommendedDriverFee);
  const [tollAndParkingFee, setTollAndParkingFee] = useState<number | ''>(100000);

  // Sync state when vehicleName changes
  useEffect(() => {
    const newProfile = detectVehicleProfile(vehicleName);
    setSelectedFuelId(newProfile.defaultFuelId);
    setCustomKmPerLiter(newProfile.defaultKmPerLiter);
    setCustomFuelPrice(FUEL_TYPES[newProfile.defaultFuelId]?.defaultPrice || 6800);
    setDriverFee(newProfile.recommendedDriverFee);
  }, [vehicleName]);

  // Sync external pickup & dropoff if changed
  useEffect(() => {
    if (pickupLocation) setPickup(pickupLocation);
  }, [pickupLocation]);

  useEffect(() => {
    if (dropoffLocation) setDropoff(dropoffLocation);
  }, [dropoffLocation]);

  // Calculation Result
  const estimate: FuelEstimateResult = useMemo(() => {
    return calculateFuelEstimate({
      oneWayDistanceKm: typeof distanceKm === 'number' ? distanceKm : 0,
      isRoundTrip,
      vehicleName,
      fuelTypeId: selectedFuelId,
      customFuelPrice: typeof customFuelPrice === 'number' ? customFuelPrice : undefined,
      customKmPerLiter: typeof customKmPerLiter === 'number' ? customKmPerLiter : undefined,
      includeSafetyMargin,
      includeDriver,
      driverFee: typeof driverFee === 'number' ? driverFee : 0,
      tollAndParkingFee: typeof tollAndParkingFee === 'number' ? tollAndParkingFee : 0,
    });
  }, [
    distanceKm,
    isRoundTrip,
    vehicleName,
    selectedFuelId,
    customFuelPrice,
    customKmPerLiter,
    includeSafetyMargin,
    includeDriver,
    driverFee,
    tollAndParkingFee,
  ]);

  const presetDistances = [
    { label: 'Dalam Kota', km: 40, desc: '40 km' },
    { label: 'Drop Bandara', km: 80, desc: '80 km' },
    { label: 'Luar Kota', km: 180, desc: '180 km' },
    { label: 'Lintas Provinsi', km: 450, desc: '450 km' },
  ];

  const handleApply = (mode: 'all_in' | 'add_to_base') => {
    setAppliedMode(mode);
    const finalPrice = mode === 'all_in' 
      ? estimate.grandTotalTripCost 
      : basePrice + estimate.grandTotalTripCost;

    const routeText = pickup && dropoff ? `${pickup} -> ${dropoff}` : dropoff || 'Carter Perjalanan';
    const breakdown = `Rute: ${routeText} (${estimate.totalDistanceKm} km ${isRoundTrip ? 'PP' : '1x'}) | BBM: ${estimate.litersNeeded} L ${estimate.fuelTypeInfo.name.split(' ')[0]} (${formatRupiah(estimate.totalFuelCost)})${includeDriver ? ` + Driver (${formatRupiah(estimate.driverFeeCost)})` : ''}${estimate.tollAndParkingCost > 0 ? ` + Tol/Parkir (${formatRupiah(estimate.tollAndParkingCost)})` : ''}`;

    if (onUpdateLocations && (pickup || dropoff)) {
      onUpdateLocations(pickup, dropoff);
    }

    onApplyPricing(finalPrice, breakdown);
  };

  return (
    <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Header Bersih & Polosan */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Kalkulator Tarif Rute & Operasional
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hitung otomatis estimasi BBM, supir, dan tol berdasarkan jarak rute
            </p>
          </div>
        </div>

        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          title={isOpen ? "Tutup Kalkulator" : "Buka Kalkulator"}
        >
          <span>{isOpen ? "Tutup Kalkulator" : "Buka Kalkulator"}</span>
          <span className="p-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4 text-xs">
          {/* Baris Info Armada Terdeteksi */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500">Armada:</span>
              <span className="font-bold text-slate-900">{profile.categoryName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">BBM Standar:</span>
              <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                {estimate.fuelTypeInfo.name} ({formatRupiah(estimate.fuelPricePerLiter)} / Liter)
              </span>
            </div>
          </div>

          {/* Bagian 1: Pilihan Jarak Rute */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. Pilih Preset Rute Cepat:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetDistances.map((preset, idx) => {
                const isSelected = distanceKm === preset.km;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDistanceKm(preset.km)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="text-xs font-semibold">{preset.label}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-amber-100 font-bold' : 'text-slate-400'}`}>
                      {preset.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bagian 2: Input Jarak & Jenis Perjalanan (Segmented Switch Rapi) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Jarak Tempuh Satu Arah (KM) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={distanceKm === '' ? '' : formatThousand(distanceKm)}
                  onChange={(e) => setDistanceKm(parseThousand(e.target.value))}
                  placeholder="contoh: 150"
                  className="w-full p-2.5 pr-12 bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl font-bold text-slate-900 text-sm"
                />
                <span className="absolute right-3.5 top-2.5 font-bold text-slate-400 text-xs">KM</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Jenis Perjalanan
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 h-[42px] items-center">
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(false)}
                  className={`flex-1 h-full rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    !isRoundTrip 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Satu Arah (1x)
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(true)}
                  className={`flex-1 h-full rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isRoundTrip 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Pulang-Pergi (PP)
                </button>
              </div>
            </div>
          </div>

          {/* Bagian 3: Biaya Supir, Tol & Parkir dengan format pemisah ribuan */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block">
              2. Komponen Biaya Tambahan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Jasa Supir */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeDriver}
                      onChange={(e) => setIncludeDriver(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 text-xs">Jasa Supir / Driver</span>
                  </label>
                  {includeDriver && typeof driverFee === 'number' && driverFee > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700">
                      {formatRupiah(driverFee)}
                    </span>
                  )}
                </div>
                {includeDriver && (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={driverFee === '' ? '' : formatThousand(driverFee)}
                        onChange={(e) => setDriverFee(parseThousand(e.target.value))}
                        placeholder="contoh: 200.000"
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    {/* Chip Preset Supir */}
                    <div className="flex gap-1 flex-wrap">
                      {[150000, 200000, 250000, 300000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDriverFee(amt)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors font-medium ${
                            driverFee === amt
                              ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {formatThousand(amt)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tol & Parkir */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Estimasi Tol & Parkir</span>
                  {typeof tollAndParkingFee === 'number' && tollAndParkingFee > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700">
                      {formatRupiah(tollAndParkingFee)}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={tollAndParkingFee === '' ? '' : formatThousand(tollAndParkingFee)}
                      onChange={(e) => setTollAndParkingFee(parseThousand(e.target.value))}
                      placeholder="Isi 0 jika tidak ada tol"
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {/* Chip Preset Tol */}
                  <div className="flex gap-1 flex-wrap">
                    {[0, 50000, 100000, 200000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTollAndParkingFee(amt)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors font-medium ${
                          tollAndParkingFee === amt
                            ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {amt === 0 ? '0 (Gratis)' : formatThousand(amt)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengaturan BBM Lanjutan (Collapsible) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvancedFuel(!showAdvancedFuel)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] text-slate-800 font-bold text-xs flex items-center justify-between w-full sm:w-auto gap-3 transition-all shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{showAdvancedFuel ? 'Tutup Pengaturan Jenis BBM & Mesin' : 'Buka Pengaturan Jenis BBM & Mesin'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 shrink-0">
                <span>{showAdvancedFuel ? 'Tutup' : 'Buka'}</span>
                {showAdvancedFuel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showAdvancedFuel && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 mt-2 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Jenis Bahan Bakar</label>
                  <select
                    value={selectedFuelId}
                    onChange={(e) => {
                      setSelectedFuelId(e.target.value);
                      const newFuel = FUEL_TYPES[e.target.value];
                      if (newFuel) setCustomFuelPrice(newFuel.defaultPrice);
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {Object.values(FUEL_TYPES).map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({formatRupiah(f.defaultPrice)}/L)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Harga BBM per Liter</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customFuelPrice === '' ? '' : formatThousand(customFuelPrice)}
                      onChange={(e) => setCustomFuelPrice(parseThousand(e.target.value))}
                      className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Konsumsi Mesin (KM/Liter)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={customKmPerLiter}
                    onChange={(e) => setCustomKmPerLiter(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Kotak Rincian Hasil & Tombol Terapkan */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-md space-y-3">
            <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Jarak</span>
                <strong className="text-white text-xs sm:text-sm">{estimate.totalDistanceKm} km {isRoundTrip ? '(PP)' : ''}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Kebutuhan BBM</span>
                <strong className="text-amber-400 text-xs sm:text-sm">{estimate.litersNeeded} Liter</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Biaya BBM</span>
                <strong className="text-emerald-400 text-xs sm:text-sm">{formatRupiah(estimate.totalFuelCost)}</strong>
              </div>
            </div>

            {/* Indikator Status Tarif Aktif */}
            {appliedMode && (
              <div className="w-full mb-2.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-slate-300">
                    Tarif Aktif di Kasir:{" "}
                    <strong className="text-amber-300 font-extrabold">
                      {appliedMode === "all_in" ? "Biaya Jalan Saja" : "Sewa Unit + Biaya Jalan"}
                    </strong>
                  </span>
                </div>
                <span className="text-emerald-400 font-extrabold font-mono">
                  {formatRupiah(appliedMode === "all_in" ? estimate.grandTotalTripCost : basePrice + estimate.grandTotalTripCost)}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Total Biaya Operasional (BBM + Supir + Tol):</span>
                <span className="text-lg sm:text-xl font-black text-amber-400 leading-tight">
                  {formatRupiah(estimate.grandTotalTripCost)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Tombol 1: Biaya Jalan Saja */}
                <button
                  type="button"
                  onClick={() => handleApply('all_in')}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer leading-tight text-center active:scale-95 ${
                    appliedMode === 'all_in'
                      ? 'bg-amber-500 text-white ring-2 ring-white shadow-lg shadow-amber-500/40'
                      : appliedMode === 'add_to_base'
                      ? 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  }`}
                  title="Pasang hanya biaya jalan ini sebagai harga sewa final (Paket Carter/Drop-off)"
                >
                  <div className="flex items-center gap-1.5">
                    {appliedMode === 'all_in' ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-700 text-white text-[9px] font-black uppercase tracking-wide flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Terpilih
                      </span>
                    ) : (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>Biaya Jalan Saja</span>
                  </div>
                  <span className={`text-[10px] font-medium ${appliedMode === 'all_in' ? 'text-white font-bold' : 'text-amber-100'}`}>
                    ({formatRupiah(estimate.grandTotalTripCost)})
                  </span>
                </button>

                {/* Tombol 2: Sewa Unit + Biaya Jalan */}
                {basePrice > 0 && (
                  <button
                    type="button"
                    onClick={() => handleApply('add_to_base')}
                    className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer leading-tight text-center active:scale-95 ${
                      appliedMode === 'add_to_base'
                        ? 'bg-emerald-600 text-white ring-2 ring-white shadow-lg shadow-emerald-500/40'
                        : appliedMode === 'all_in'
                        ? 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-md'
                    }`}
                    title="Gabungkan biaya sewa dasar unit mobil dengan biaya operasional jalan"
                  >
                    <div className="flex items-center gap-1.5">
                      {appliedMode === 'add_to_base' ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-800 text-white text-[9px] font-black uppercase tracking-wide flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Terpilih
                        </span>
                      ) : null}
                      <span>Sewa Unit + Biaya Jalan</span>
                    </div>
                    <span className={`text-[10px] font-bold ${appliedMode === 'add_to_base' ? 'text-white' : 'text-emerald-400'}`}>
                      Total: {formatRupiah(basePrice + estimate.grandTotalTripCost)}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

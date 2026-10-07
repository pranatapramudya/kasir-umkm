// Configuration and smart estimation logic for Fuel & Distance Pricing

export interface FuelTypeInfo {
  id: string;
  name: string;
  defaultPrice: number;
  category: 'diesel' | 'gasoline';
  badgeColor: string;
}

export const FUEL_TYPES: Record<string, FuelTypeInfo> = {
  biosolar: {
    id: 'biosolar',
    name: 'Biosolar (Subsidi)',
    defaultPrice: 6800,
    category: 'diesel',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  pertalite: {
    id: 'pertalite',
    name: 'Pertalite (Subsidi)',
    defaultPrice: 10000,
    category: 'gasoline',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  pertamax: {
    id: 'pertamax',
    name: 'Pertamax (RON 92)',
    defaultPrice: 12100,
    category: 'gasoline',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  dexlite: {
    id: 'dexlite',
    name: 'Dexlite (CN 51)',
    defaultPrice: 13050,
    category: 'diesel',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  pertamina_dex: {
    id: 'pertamina_dex',
    name: 'Pertamina Dex (CN 53)',
    defaultPrice: 13850,
    category: 'diesel',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
};

export interface VehicleProfile {
  categoryName: string;
  defaultFuelId: string;
  defaultKmPerLiter: number;
  recommendedDriverFee: number;
}

export function detectVehicleProfile(name: string): VehicleProfile {
  const lower = (name || '').toLowerCase();

  // Big Bus (45-50+ seat)
  if (lower.includes('big bus') || lower.includes('bus besar') || lower.includes('50 seat') || lower.includes('shd') || lower.includes('hdd')) {
    return {
      categoryName: 'Big Bus Pariwisata (45-50+ Seat)',
      defaultFuelId: 'biosolar',
      defaultKmPerLiter: 3.5,
      recommendedDriverFee: 300000,
    };
  }

  // Medium Bus (30-35 seat)
  if (lower.includes('medium bus') || lower.includes('bus sedang') || lower.includes('31 seat') || lower.includes('35 seat')) {
    return {
      categoryName: 'Medium Bus (30-35 Seat)',
      defaultFuelId: 'biosolar',
      defaultKmPerLiter: 5.0,
      recommendedDriverFee: 250000,
    };
  }

  // Microbus / Elf Long
  if (lower.includes('elf') || lower.includes('giga') || lower.includes('microbus') || lower.includes('19 seat')) {
    return {
      categoryName: 'Microbus / Isuzu Elf',
      defaultFuelId: 'biosolar',
      defaultKmPerLiter: 8.0,
      recommendedDriverFee: 200000,
    };
  }

  // Hiace Commuter / Premio / Van Diesel
  if (lower.includes('hiace') || lower.includes('commuter') || lower.includes('premio') || lower.includes('diesel')) {
    return {
      categoryName: 'Toyota Hiace / Van Diesel',
      defaultFuelId: 'biosolar',
      defaultKmPerLiter: 10.0,
      recommendedDriverFee: 200000,
    };
  }

  // Motor
  if (lower.includes('nmax') || lower.includes('pcx') || lower.includes('beat') || lower.includes('vario') || lower.includes('scoopy') || lower.includes('aerox')) {
    return {
      categoryName: 'Sepeda Motor',
      defaultFuelId: 'pertalite',
      defaultKmPerLiter: 40.0,
      recommendedDriverFee: 0,
    };
  }

  // MPV / Mobil Bensin (Avanza, Xpander, Innova Reborn, dll.)
  return {
    categoryName: 'Mobil Penumpang / MPV',
    defaultFuelId: 'pertalite',
    defaultKmPerLiter: 12.0,
    recommendedDriverFee: 150000,
  };
}

export interface FuelEstimateInput {
  oneWayDistanceKm: number;
  isRoundTrip: boolean;
  vehicleName: string;
  fuelTypeId?: string;
  customFuelPrice?: number;
  customKmPerLiter?: number;
  includeSafetyMargin?: boolean; // +10% macet / jalan menanjak
  includeDriver?: boolean;
  driverFee?: number;
  tollAndParkingFee?: number;
}

export interface FuelEstimateResult {
  categoryName: string;
  totalDistanceKm: number;
  kmPerLiter: number;
  fuelTypeInfo: FuelTypeInfo;
  fuelPricePerLiter: number;
  litersNeeded: number;
  baseFuelCost: number;
  safetyMarginCost: number;
  totalFuelCost: number;
  driverFeeCost: number;
  tollAndParkingCost: number;
  grandTotalTripCost: number;
}

export function calculateFuelEstimate(input: FuelEstimateInput): FuelEstimateResult {
  const profile = detectVehicleProfile(input.vehicleName);
  const fuelId = input.fuelTypeId || profile.defaultFuelId;
  const fuelInfo = FUEL_TYPES[fuelId] || FUEL_TYPES.biosolar;

  const pricePerLiter = input.customFuelPrice && input.customFuelPrice > 0 
    ? input.customFuelPrice 
    : fuelInfo.defaultPrice;

  const kmPerLiter = input.customKmPerLiter && input.customKmPerLiter > 0 
    ? input.customKmPerLiter 
    : profile.defaultKmPerLiter;

  const rawDistance = Math.max(0, Number(input.oneWayDistanceKm) || 0);
  const totalDistanceKm = input.isRoundTrip ? rawDistance * 2 : rawDistance;

  // Liters needed rounded to 1 decimal place
  const litersNeeded = totalDistanceKm > 0 ? Number((totalDistanceKm / kmPerLiter).toFixed(1)) : 0;
  const baseFuelCost = Math.round(litersNeeded * pricePerLiter);
  const safetyMarginCost = input.includeSafetyMargin ? Math.round(baseFuelCost * 0.10) : 0;
  const totalFuelCost = baseFuelCost + safetyMarginCost;

  const driverFeeCost = input.includeDriver 
    ? (input.driverFee !== undefined ? Number(input.driverFee) : profile.recommendedDriverFee) 
    : 0;

  const tollAndParkingCost = Number(input.tollAndParkingFee) || 0;

  const grandTotalTripCost = totalFuelCost + driverFeeCost + tollAndParkingCost;

  return {
    categoryName: profile.categoryName,
    totalDistanceKm,
    kmPerLiter,
    fuelTypeInfo: fuelInfo,
    fuelPricePerLiter: pricePerLiter,
    litersNeeded,
    baseFuelCost,
    safetyMarginCost,
    totalFuelCost,
    driverFeeCost,
    tollAndParkingCost,
    grandTotalTripCost,
  };
}

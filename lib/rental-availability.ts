import { detectRentalItemType, isRentalTravelCategory } from './business-category';

export type AvailabilityItem = {
  id: string;
  name: string;
  code: string;
  type: 'vehicle' | 'property' | 'travel';
  status: string;
  // Vehicle specific
  transmission?: string;
  year?: number;
  dailyRate?: number;
  hourlyRate?: number;
  operationalCost?: number;
  // Property specific
  capacity?: number;
  bathrooms?: string;
  monthlyRate?: number;
  electricityCost?: number;
  // Travel specific
  departureDate?: Date;
  route?: string;
  totalSeats?: number;
  availableSeats?: number;
};

export type AvailabilityResult = {
  item: AvailabilityItem;
  isAvailable: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  reason?: string;
  // For travel
  seatsLeft?: number;
};

export function checkRentalAvailability(
  items: AvailabilityItem[],
  startDate: Date,
  endDate: Date,
  itemType?: 'vehicle' | 'property'
): AvailabilityResult[] {
  const results: AvailabilityResult[] = [];

  for (const item of items) {
    const type = itemType || item.type;

    if (item.status !== 'Tersedia' && item.status !== 'Available') {
      results.push({
        item,
        isAvailable: false,
        reason: `Unit status: ${item.status}`,
      });
      continue;
    }

    if (type === 'vehicle' || type === 'property') {
      // Calendar-based availability: check if unit has conflicting booking
      // This is a placeholder - actual implementation needs to check bookings
      // For now, assume available if status is 'Tersedia'
      results.push({
        item,
        isAvailable: true,
        availableFrom: startDate,
        availableTo: endDate,
      });
    }
  }

  return results;
}

export function checkTravelAvailability(
  schedules: AvailabilityItem[],
  departureDate: Date,
  route: string,
  requiredSeats: number = 1
): AvailabilityResult[] {
  const results: AvailabilityResult[] = [];

  for (const schedule of schedules) {
    if (schedule.type !== 'travel') continue;

    // Match by departure date and route
    const schedDate = schedule.departureDate ? new Date(schedule.departureDate) : null;
    const matchDate = schedDate && schedDate.toDateString() === departureDate.toDateString();
    const matchRoute = schedule.route?.toLowerCase() === route.toLowerCase();

    if (!matchDate || !matchRoute) {
      continue;
    }

    const seatsLeft = (schedule.availableSeats ?? schedule.totalSeats ?? 0);
    const isAvailable = seatsLeft >= requiredSeats;

    results.push({
      item: schedule,
      isAvailable,
      seatsLeft,
      reason: isAvailable ? undefined : `Sisa ${seatsLeft} kursi, butuh ${requiredSeats}`,
    });
  }

  return results;
}

export function checkPropertyAvailability(
  items: AvailabilityItem[],
  startDate: Date,
  endDate: Date
): AvailabilityResult[] {
  return checkRentalAvailability(items, startDate, endDate, 'property');
}

export function getItemTypeFromCategory(category: string): 'vehicle' | 'property' | 'travel' | 'service' {
  const normalized = category.toLowerCase().trim();
  
  const vehicleTypes = ['kendaraan', 'vehicle', 'armada', 'mobil', 'motor', 'bus', 'truck', 'pickup', 'minibus', 'suv', 'mpv', 'sedan'];
  const propertyTypes = ['properti', 'property', 'kamar', 'kost', 'villa', 'homestay', 'hotel', 'apartment', 'studio', 'rumah', 'meeting room', 'coworking'];
  const travelTypes = ['travel', 'jadwal', 'schedule', 'keberangkatan', 'rute', 'route', 'bus travel', 'pesawat', 'kereta'];
  
  if (vehicleTypes.some(t => normalized.includes(t))) return 'vehicle';
  if (propertyTypes.some(t => normalized.includes(t))) return 'property';
  if (travelTypes.some(t => normalized.includes(t))) return 'travel';
  
  return 'service';
}

export function isCalendarBasedAvailability(category: string): boolean {
  const type = getItemTypeFromCategory(category);
  return type === 'vehicle' || type === 'property';
}

export function isScheduleBasedAvailability(category: string): boolean {
  const type = getItemTypeFromCategory(category);
  return type === 'travel';
}
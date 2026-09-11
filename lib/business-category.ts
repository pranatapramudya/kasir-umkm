const SERVICE_BUSINESS_CATEGORIES = ["JASA", "Jasa / Servis", "Jasa/Servis", "RENTAL", "Rental & Travel", "Rental/Travel"];
const RENTAL_TRAVEL_CATEGORIES = ["RENTAL", "Rental & Travel", "Rental/Travel"];

export function isServiceBusinessCategory(category?: string | null) {
  return SERVICE_BUSINESS_CATEGORIES.includes(category ?? "");
}

export function isRentalTravelCategory(category?: string | null) {
  return RENTAL_TRAVEL_CATEGORIES.includes(category ?? "");
}

export function detectRentalItemType(name?: string | null, description?: string | null): "property" | "vehicle" | "unknown" {
  const combined = `${name || ""} ${description || ""}`.toLowerCase();
  if (!combined.trim()) return "unknown";

  const vehicleKeywords = [
    "mobil", "motor", "car", "bike", "bus", "travel", "avanza",
    "innova", "hiace", "elf", "nmax", "pcx", "beat", "supra",
    "scooter", "kendaraan", "driver", "supir", "pickup", "shuttle",
    "charter", "armada", "sewa mobil", "sewa motor", "helm", "vespa", "truck", "truk", "fortuner", "pajero", "xenia", "brio"
  ];

  const propertyKeywords = [
    "properti", "property", "kamar", "room", "kos", "kost", "villa", "vila", "homestay", "hotel",
    "apartemen", "apartment", "unit", "bed", "kasur", "transit", "studio",
    "resort", "house", "rumah", "glamping", "paviliun", "penginapan", "ruang", "space"
  ];

  const matchesVehicle = vehicleKeywords.some(kw => combined.includes(kw));
  const matchesProperty = propertyKeywords.some(kw => combined.includes(kw));

  if (matchesProperty && !matchesVehicle) return "property";
  if (matchesVehicle && !matchesProperty) return "vehicle";
  if (matchesProperty) return "property";
  if (matchesVehicle) return "vehicle";

  return "unknown";
}


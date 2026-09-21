const SERVICE_BUSINESS_CATEGORIES = ["JASA", "Jasa / Servis", "Jasa/Servis"];
const RENTAL_TRAVEL_CATEGORIES = [
  "RENTAL", 
  "Rental & Travel", 
  "Rental/Travel",
  "Rental/Travel/Properti",
  "Rental Travel Properti",
  "Rental Travel",
  "Travel",
  "Properti",
  "Property",
  "Rental Properti"
];

export function isServiceBusinessCategory(category?: string | null) {
  return SERVICE_BUSINESS_CATEGORIES.includes(category ?? "");
}

export function isRentalTravelCategory(category?: string | null) {
  return RENTAL_TRAVEL_CATEGORIES.includes(category ?? "");
}

export function isPureServiceCategory(category?: string | null) {
  return isServiceBusinessCategory(category) && !isRentalTravelCategory(category);
}

export function detectRentalItemType(name?: string | null, description?: string | null): "property" | "vehicle" | "equipment" | "unknown" {
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

  const equipmentKeywords = [
    "kamera", "camera", "lensa", "lens", "drone", "gimbal", "tripod", "lighting", "audio", "sound", "speaker", "mic", "microphone", "mixer", "genset", "generator",
    "tenda", "tent", "carrier", "matras", "sleeping bag", "kompor", "portable", "camping", "outdoor", "trekking", "hiking",
    "playstation", "ps5", "ps4", "nintendo", "switch", "xbox", "console", "game", "vr", "headset",
    "alat berat", "molen", "bor", "gerinda", "kompresor", "pompa", "generator", "pipa", "scaffolding",
    "perlengkapan", "aksesoris", "kabel", "stand", "softbox", "ring light", "reflector",
    "alat", "equipment", "gear", "rental alat", "sewa alat"
  ];

  const matchesVehicle = vehicleKeywords.some(kw => combined.includes(kw));
  const matchesProperty = propertyKeywords.some(kw => combined.includes(kw));
  const matchesEquipment = equipmentKeywords.some(kw => combined.includes(kw));

  // Priority: spesifik dulu
  if (matchesEquipment && !matchesVehicle && !matchesProperty) return "equipment";
  if (matchesProperty && !matchesVehicle && !matchesEquipment) return "property";
  if (matchesVehicle && !matchesProperty && !matchesEquipment) return "vehicle";

  // Fallback kalau overlapping
  if (matchesEquipment) return "equipment";
  if (matchesProperty) return "property";
  if (matchesVehicle) return "vehicle";

  return "unknown";
}


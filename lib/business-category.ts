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

export function detectRentalItemType(name?: string | null, description?: string | null, category?: string | null): "property" | "vehicle" | "equipment" | "unknown" {
  const cat = (category || "").toLowerCase();
  
  if (
    cat.includes("alat") ||
    cat.includes("peralatan") ||
    cat.includes("equipment") ||
    cat.includes("kamera") ||
    cat.includes("camera") ||
    cat.includes("sound") ||
    cat.includes("camping") ||
    cat.includes("game") ||
    cat.includes("console") ||
    cat.includes("outdoor")
  ) {
    return "equipment";
  }
  if (
    cat.includes("armada") ||
    cat.includes("kendaraan") ||
    cat.includes("mobil") ||
    cat.includes("motor") ||
    cat.includes("travel") ||
    cat.includes("shuttle") ||
    cat.includes("bus")
  ) {
    return "vehicle";
  }
  if (
    cat.includes("properti") ||
    cat.includes("property") ||
    cat.includes("kamar") ||
    cat.includes("villa") ||
    cat.includes("vila") ||
    cat.includes("kost") ||
    cat.includes("kos") ||
    cat.includes("hotel") ||
    cat.includes("glamping") ||
    cat.includes("homestay") ||
    cat.includes("apartemen")
  ) {
    return "property";
  }

  const combined = `${name || ""} ${description || ""}`.toLowerCase();
  if (!combined.trim()) return "unknown";

  const vehicleKeywords = [
    "mobil", "motor", "car", "bike", "bus", "travel", "avanza",
    "innova", "hiace", "elf", "nmax", "pcx", "beat", "supra",
    "scooter", "kendaraan", "driver", "supir", "pickup", "shuttle",
    "charter", "armada", "sewa mobil", "sewa motor", "helm", "vespa", "truck", "truk", "fortuner", "pajero", "xenia", "brio", "alphard", "sigra", "calya"
  ];

  const propertyKeywords = [
    "properti", "property", "kamar", "room", "kos", "kost", "villa", "vila", "homestay", "hotel",
    "apartemen", "apartment", "unit", "bed", "kasur", "transit", "studio",
    "resort", "house", "rumah", "glamping", "paviliun", "penginapan", "ruang", "space", "deluxe", "superior", "standard room"
  ];

  const equipmentKeywords = [
    "kamera", "camera", "lensa", "lens", "drone", "gimbal", "tripod", "lighting", "audio", "sound", "speaker", "mic", "microphone", "mixer", "genset", "generator",
    "tenda", "tent", "carrier", "matras", "sleeping bag", "kompor", "portable", "camping", "outdoor", "trekking", "hiking",
    "playstation", "ps5", "ps4", "nintendo", "switch", "xbox", "console", "game", "vr", "headset",
    "alat berat", "molen", "bor", "gerinda", "kompresor", "pompa", "pipa", "scaffolding",
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

export function getTenantRentalType(category?: string | null): "property" | "vehicle" | "equipment" | null {
  const cat = (category || "").toLowerCase();
  
  if (
    cat.includes("alat") ||
    cat.includes("peralatan") ||
    cat.includes("equipment")
  ) {
    return "equipment";
  }
  if (
    cat.includes("kendaraan") ||
    cat.includes("armada") ||
    cat.includes("travel") ||
    cat.includes("mobil") ||
    cat.includes("motor")
  ) {
    return "vehicle";
  }
  if (
    cat.includes("properti") ||
    cat.includes("property") ||
    cat.includes("kamar") ||
    cat.includes("kost") ||
    cat.includes("kos") ||
    cat.includes("villa") ||
    cat.includes("hotel") ||
    cat.includes("glamping") ||
    cat.includes("homestay") ||
    cat.includes("apartemen")
  ) {
    return "property";
  }
  return null;
}


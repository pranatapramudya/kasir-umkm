const SERVICE_BUSINESS_CATEGORIES = ["JASA", "Jasa / Servis", "Jasa/Servis", "RENTAL", "Rental & Travel"];
const RENTAL_TRAVEL_CATEGORIES = ["RENTAL", "Rental & Travel", "Rental/Travel"];

export function isServiceBusinessCategory(category?: string | null) {
  return SERVICE_BUSINESS_CATEGORIES.includes(category ?? "");
}

export function isRentalTravelCategory(category?: string | null) {
  return RENTAL_TRAVEL_CATEGORIES.includes(category ?? "");
}

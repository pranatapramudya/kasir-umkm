const SERVICE_BUSINESS_CATEGORIES = ["Jasa / Servis", "Rental & Travel"];
const RENTAL_TRAVEL_CATEGORY = "Rental & Travel";

export function isServiceBusinessCategory(category?: string | null) {
  return SERVICE_BUSINESS_CATEGORIES.includes(category ?? "");
}

export function isRentalTravelCategory(category?: string | null) {
  return category === RENTAL_TRAVEL_CATEGORY;
}

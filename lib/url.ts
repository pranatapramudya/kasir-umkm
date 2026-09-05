/**
 * Utility untuk mendapatkan Base URL Aplikasi secara dinamis.
 * Membaca dari environment variable NEXT_PUBLIC_APP_URL dengan fallback yang sesuai 
 * untuk lingkungan Local (http://localhost:3000) dan Production (https://www.pjtechumkm.com).
 */
export function getAppUrl(): string {
  // 1. Utamakan environment variable jika sudah diset
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  // 2. Jika dipanggil di browser (client-side), gunakan location.origin
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 3. Jika berjalan di Vercel Serverless environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Fallback berdasarkan NODE_ENV
  if (process.env.NODE_ENV === "production") {
    return "https://www.pjtechumkm.com";
  }

  // 5. Default fallback untuk development lokal
  return "http://localhost:3000";
}

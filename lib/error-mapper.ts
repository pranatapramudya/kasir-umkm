export function humanizeError(error: any): string {
    const errorMsg = typeof error === 'string' ? error : (error?.message || error?.error || String(error));
    
    const lowerError = errorMsg.toLowerCase();

    // 1. Network Errors
    if (lowerError.includes('failed to fetch') || lowerError.includes('network error') || lowerError.includes('internet disconnected')) {
        return "Yah, koneksi internet toko sedang putus. Cek WiFi/Kouta Anda ya.";
    }

    // 2. Server Errors
    if (lowerError.includes('500') || lowerError.includes('internal server error') || lowerError.includes('timeout')) {
        return "Sistem sedang sibuk, mohon coba beberapa saat lagi.";
    }

    // 3. Auth Errors
    if (lowerError.includes('401') || lowerError.includes('unauthorized') || lowerError.includes('invalid token')) {
        return "Sesi Anda sudah habis, silakan login ulang demi keamanan.";
    }

    // 4. Prisma/DB Specific Errors
    if (lowerError.includes('prisma') || lowerError.includes('database')) {
        return "Terjadi kendala pada pangkalan data (database). Silakan lapor ke tim teknis.";
    }

    // Default fallback if it's already a friendly message or unknown
    return errorMsg;
}

/**
 * Helper untuk mengelola multi-foto produk (up to 5 foto per unit)
 * Mendukung format string lama (single URL/base64) & format baru (JSON array)
 */
export function parseProductImages(imageStr?: string | null): string[] {
  if (!imageStr) return [];
  const trimmed = imageStr.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
      }
    } catch {}
  }
  return [trimmed].filter(Boolean);
}

export function serializeProductImages(images: string[]): string {
  const clean = images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  return JSON.stringify(clean);
}

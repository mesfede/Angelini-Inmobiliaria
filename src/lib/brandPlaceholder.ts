/**
 * Official Brand Placeholder and Fallbacks for Angelini Inmobiliaria.
 * Used when a property does not have photos yet or is processing images.
 * Strict rule: NEVER display random stock photos of houses or models.
 */

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#041020" />
      <stop offset="100%" stop-color="#0b1d36" />
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="#B08237" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#B08237" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bgGrad)" />
  <circle cx="400" cy="180" r="200" fill="url(#goldGlow)" />
  
  <!-- Subtle architectural grid frame -->
  <rect x="24" y="24" width="752" height="452" rx="14" fill="none" stroke="#B08237" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="6 5" />

  <!-- Camera / Gallery Badge Icon -->
  <g transform="translate(400, 160)">
    <circle cx="0" cy="0" r="52" fill="#041020" stroke="#B08237" stroke-width="2.5" />
    <path d="M-22,-4 L-15,-16 L15,-16 L22,-4 L26,-4 C29,-4 32,-1 32,3 L32,23 C32,27 29,30 26,30 L-26,30 C-29,30 -32,27 -32,23 L-32,3 C-32,-1 -29,-4 -26,-4 Z" fill="none" stroke="#B08237" stroke-width="2.2" stroke-linejoin="round" />
    <circle cx="0" cy="13" r="10" fill="none" stroke="#B08237" stroke-width="2.2" />
    <circle cx="18" cy="4" r="2.5" fill="#B08237" />
  </g>

  <!-- Typography -->
  <text x="400" y="275" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" letter-spacing="4">ANGELINI INMOBILIARIA</text>
  
  <!-- Status Chip -->
  <g transform="translate(400, 325)">
    <rect x="-195" y="-18" width="390" height="36" rx="18" fill="#B08237" fill-opacity="0.18" stroke="#B08237" stroke-width="1.2" />
    <text x="0" y="5" text-anchor="middle" fill="#E5C178" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="2">PROCESANDO MATERIAL FOTOGRÁFICO</text>
  </g>

  <text x="400" y="380" text-anchor="middle" fill="#94A3B8" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">Fotografías oficiales disponibles a la brevedad</text>
</svg>`;

export const BRAND_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

export const BRAND_AGENT_AVATAR = '/angelini-bull-emblem.svg';

/**
 * Checks whether an image URL is a generic stock photo, unsplash url, empty or invalid placeholder.
 */
export const isStockOrInvalidImage = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('unsplash.com') ||
    lower.includes('images.unsplash') ||
    lower.includes('pexels.com') ||
    lower.includes('pixabay.com') ||
    lower.includes('placeholder.com') ||
    lower.includes('via.placeholder') ||
    lower.includes('dummyimage') ||
    lower.includes('stock-photo') ||
    lower.includes('photo-1600596542815') ||
    lower.includes('photo-1600585154340') ||
    lower.includes('photo-1512917774080') ||
    lower.includes('photo-1560250097')
  ) {
    return true;
  }
  return false;
};

/**
 * Returns either the clean real user image URL or the official Angelini branded placeholder.
 */
export const sanitizeImageUrl = (url?: string | null, fallback: string = BRAND_PLACEHOLDER_IMAGE): string => {
  if (isStockOrInvalidImage(url)) {
    return fallback;
  }
  return url!.trim();
};

/**
 * Sanitizes a list of property images, eliminating all stock/unsplash links and guaranteeing
 * that if no valid user photo exists, it contains [BRAND_PLACEHOLDER_IMAGE].
 */
export const sanitizePropertyImages = (images?: string[] | null): string[] => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [BRAND_PLACEHOLDER_IMAGE];
  }

  const cleanList = images
    .filter((img) => typeof img === 'string' && img.trim().length > 0 && !isStockOrInvalidImage(img))
    .map((img) => img.trim());

  if (cleanList.length === 0) {
    return [BRAND_PLACEHOLDER_IMAGE];
  }

  return cleanList;
};


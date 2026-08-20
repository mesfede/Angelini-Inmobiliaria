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
 * Normalizes an image URL (supports HTTP/HTTPS, base64, Google Drive share links, Dropbox, etc.)
 */
export const normalizeImageUrl = (rawUrl?: string | null): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (!url || url === 'undefined' || url === 'null') return '';

  // Handle data:image, blob:
  if (url.startsWith('data:image/') || url.startsWith('blob:')) {
    return url;
  }

  // Handle missing protocol
  if (url.startsWith('www.')) {
    url = 'https://' + url;
  } else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url;
    }
  } else if (url.startsWith('//')) {
    url = 'https:' + url;
  }

  // Google Drive share link converter
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  // Google Drive direct export links
  if (url.includes('drive.google.com/uc')) {
    const fileIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  // Dropbox link converter
  if (url.includes('dropbox.com')) {
    return url.replace('?dl=0', '?raw=1').replace('&dl=0', '&raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  return url;
};

/**
 * Checks whether an image URL is empty or invalid.
 */
export const isStockOrInvalidImage = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  const normalized = normalizeImageUrl(url);
  if (!normalized || normalized.length < 5) return true;
  return false;
};

/**
 * Returns either the clean real user image URL or the official Angelini branded placeholder.
 */
export const sanitizeImageUrl = (url?: string | null, fallback: string = BRAND_PLACEHOLDER_IMAGE): string => {
  const normalized = normalizeImageUrl(url);
  if (!normalized) {
    return fallback;
  }
  return normalized;
};

/**
 * Sanitizes a list of property images, guaranteeing
 * that if no valid user photo exists, it contains [BRAND_PLACEHOLDER_IMAGE].
 */
export const sanitizePropertyImages = (images?: string[] | null): string[] => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [BRAND_PLACEHOLDER_IMAGE];
  }

  const cleanList = images
    .map((img) => normalizeImageUrl(img))
    .filter((img) => img.length > 0);

  if (cleanList.length === 0) {
    return [BRAND_PLACEHOLDER_IMAGE];
  }

  return cleanList;
};


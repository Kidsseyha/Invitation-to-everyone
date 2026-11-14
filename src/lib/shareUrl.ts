export const PUBLIC_APP_URL = 'https://ais-pre-oi572nxogafsw6nsowqaaj-935767504529.asia-southeast1.run.app';
export const VERCEL_APP_URL = 'https://invitationonline-six.vercel.app';

export interface ShareUrlOptions {
  customOrigin?: string;
  lang?: string;
}

/**
 * Generates the live working share URL for wedding guests.
 * Automatically converts internal dev URLs (ais-dev-) and localhost to publicly accessible preview URLs (ais-pre-)
 * or honors customOrigin (such as Vercel domain) and adds Khmer language support.
 */
export function getPublicShareUrl(
  guestName?: string,
  eventId?: string,
  eventType?: string,
  options?: ShareUrlOptions
): string {
  let origin = options?.customOrigin || PUBLIC_APP_URL;

  if (!options?.customOrigin && typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    // If running on a public custom domain or live host (and not localhost or internal dev)
    if (
      currentOrigin &&
      !currentOrigin.includes('localhost') &&
      !currentOrigin.includes('127.0.0.1')
    ) {
      if (currentOrigin.includes('ais-dev-')) {
        origin = currentOrigin.replace('ais-dev-', 'ais-pre-');
      } else {
        origin = currentOrigin;
      }
    }
  }

  const url = new URL(origin + '/');

  // Append ID if customized or needed for the invitation type (ប្រភេទធៀប)
  if (eventId) {
    url.searchParams.set('id', eventId);
  }

  if (eventType && eventType.trim()) {
    url.searchParams.set('type', eventType.trim());
  }

  // Language parameter for 100% Khmer support across social networks and Vercel
  const targetLang = options?.lang || 'kh';
  if (targetLang) {
    url.searchParams.set('lang', targetLang);
  }

  url.searchParams.set('share', '1');

  if (guestName && guestName.trim() && guestName.trim() !== 'Your Name') {
    url.searchParams.set('name', guestName.trim());
  }

  return url.toString();
}

/**
 * In-memory cache for shortened URLs so repeated requests are instantaneous
 */
const shortUrlCache = new Map<string, string>();

/**
 * Converts a long URL to a short link (using in-app /s/:code)
 */
export async function shortenUrl(longUrl: string, customOrigin?: string): Promise<string> {
  if (!longUrl) return '';

  const fallbackOrigin = customOrigin || (longUrl.startsWith(VERCEL_APP_URL) ? VERCEL_APP_URL : PUBLIC_APP_URL);

  let cleanedUrl = longUrl;
  if (cleanedUrl.includes('localhost') || cleanedUrl.includes('127.0.0.1')) {
    cleanedUrl = cleanedUrl.replace(/http:\/\/localhost:\d+/, fallbackOrigin).replace(/https:\/\/localhost:\d+/, fallbackOrigin);
  }
  if (cleanedUrl.includes('ais-dev-')) {
    cleanedUrl = cleanedUrl.replace('ais-dev-', 'ais-pre-');
  }

  const cacheKey = `${fallbackOrigin}::${cleanedUrl}`;
  if (shortUrlCache.has(cacheKey)) {
    return shortUrlCache.get(cacheKey)!;
  }

  // Try server-side shortener endpoint
  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanedUrl, origin: fallbackOrigin }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.shortUrl) {
        let finalShortUrl = data.shortUrl;
        if (finalShortUrl.includes('localhost') || finalShortUrl.includes('127.0.0.1')) {
          finalShortUrl = finalShortUrl.replace(/http:\/\/localhost:\d+/, fallbackOrigin).replace(/https:\/\/localhost:\d+/, fallbackOrigin);
        }
        if (finalShortUrl.includes('ais-dev-')) {
          finalShortUrl = finalShortUrl.replace('ais-dev-', 'ais-pre-');
        }
        shortUrlCache.set(cacheKey, finalShortUrl);
        return finalShortUrl;
      }
    }
  } catch (err) {
    console.warn('API shorten failed, falling back to direct URL:', err);
  }

  return cleanedUrl;
}



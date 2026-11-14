import { EVENT_PRESETS, findTemplatePreset, getCategoryCoverImage } from '../data/eventTemplates';

export type InvitationCategory = 'wedding' | 'engagement' | 'housewarming' | 'birthday' | 'anniversary';

export interface InvitationMetaResult {
  title: string;
  description: string;
  image: string;
  url: string;
  category: InvitationCategory;
}

const VALID_CATEGORIES = new Set<InvitationCategory>([
  'wedding',
  'engagement',
  'housewarming',
  'birthday',
  'anniversary',
]);

export function normalizeCategoryString(raw?: string | null): InvitationCategory | null {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.toLowerCase().trim();
  if (!s) return null;
  if (VALID_CATEGORIES.has(s as InvitationCategory)) return s as InvitationCategory;
  if (s.includes('anniversary') || s.includes('ខួបអាពាហ៍ពិពាហ៍')) return 'anniversary';
  if (s.includes('birthday') || s.includes('ខួបកំណើត') || s.includes('ខួប')) return 'birthday';
  if (s.includes('housewarming') || s.includes('ឡើងផ្ទះ') || s.includes('ឡើងគេហដ្ឋាន') || s.includes('house')) return 'housewarming';
  if (s.includes('engagement') || s.includes('ភ្ជាប់ពាក្យ') || s.includes('engage')) return 'engagement';
  if (s.includes('wedding') || s.includes('មង្គលការ') || s.includes('អាពាហ៍ពិពាហ៍')) return 'wedding';
  return null;
}

export function resolveCategoryFromHints(hints: {
  queryType?: string | null;
  eventType?: string | null;
  eventId?: string | null;
  eventName?: string | null;
}): InvitationCategory {
  return (
    normalizeCategoryString(hints.queryType) ||
    normalizeCategoryString(hints.eventType) ||
    normalizeCategoryString(hints.eventId) ||
    normalizeCategoryString(hints.eventName) ||
    'wedding'
  );
}

export function toAbsoluteHttpUrl(rawUrl: string | undefined | null, origin: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('data:')) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const cleanOrigin = (origin || '').replace(/\/+$/, '');
  if (!cleanOrigin) return trimmed;
  if (trimmed.startsWith('/')) return `${cleanOrigin}${trimmed}`;
  return `${cleanOrigin}/${trimmed}`;
}

export function buildInvitationMeta(params: {
  event?: any;
  guestName?: string | null;
  queryType?: string | null;
  eventId?: string | null;
  origin: string;
  pageUrl?: string;
}): InvitationMetaResult {
  const { event, guestName, queryType, eventId, origin, pageUrl } = params;

  const eventCategory = event
    ? resolveCategoryFromHints({
        eventType: event?.eventType,
        eventId: event?.id,
        eventName: event?.name,
      })
    : null;

  const explicitCategory = normalizeCategoryString(queryType);
  const category: InvitationCategory =
    explicitCategory ||
    eventCategory ||
    resolveCategoryFromHints({ queryType, eventId });

  // If queryType explicitly requests a different category than the loaded event (or no event was loaded),
  // pull information from that category's preset template.
  let effectiveEvent = event;
  if (!effectiveEvent || (explicitCategory && eventCategory && explicitCategory !== eventCategory)) {
    const preset =
      EVENT_PRESETS.find((p) => p.type === category) ||
      findTemplatePreset(queryType || eventId || category);
    if (preset) {
      effectiveEvent = preset.sampleEvent;
    }
  }

  const isBday = category === 'birthday';
  const isHouse = category === 'housewarming';
  const isEngage = category === 'engagement';
  const isAnniv = category === 'anniversary';

  const hostKhmerName = (effectiveEvent?.groom || '').trim();
  const brideKhmerName = (effectiveEvent?.bride || '').trim();

  const eventName =
    (isBday
      ? hostKhmerName
        ? `ពិធីខួបកំណើត ${hostKhmerName}`
        : effectiveEvent?.name || 'ពិធីខួបកំណើត'
      : isHouse
      ? hostKhmerName
        ? `ពិធីឡើងគេហដ្ឋានថ្មី ${hostKhmerName}`
        : effectiveEvent?.name || 'ពិធីឡើងគេហដ្ឋានថ្មី'
      : isEngage
      ? hostKhmerName && brideKhmerName
        ? `ពិធីភ្ជាប់ពាក្យ ${hostKhmerName} & ${brideKhmerName}`
        : effectiveEvent?.name || 'ពិធីភ្ជាប់ពាក្យ'
      : isAnniv
      ? hostKhmerName && brideKhmerName
        ? `ពិធីខួបអាពាហ៍ពិពាហ៍ ${hostKhmerName} & ${brideKhmerName}`
        : effectiveEvent?.name || 'ពិធីខួបអាពាហ៍ពិពាហ៍'
      : effectiveEvent?.singlePerson
      ? hostKhmerName
        ? `កម្មវិធី ${hostKhmerName}`
        : effectiveEvent?.name || 'លិខិតអញ្ជើញឌីជីថល'
      : hostKhmerName && brideKhmerName
      ? `អាពាហ៍ពិពាហ៍ ${hostKhmerName} & ${brideKhmerName}`
      : effectiveEvent?.name || 'លិខិតអញ្ជើញឌីជីថល') || 'លិខិតអញ្ជើញឌីជីថល';

  const cleanGuest = guestName && guestName.trim() && guestName.trim() !== 'Your Name' ? guestName.trim() : '';
  const title = cleanGuest ? `${eventName} - សូមគោរពអញ្ជើញ ${cleanGuest}` : eventName;

  let description = `សូមគោរពអញ្ជើញ ${cleanGuest || 'ភ្ញៀវកិត្តិយស'} ចូលរួមជាអធិបតី និងប្រសិទ្ធពរជ័យ`;
  if (isBday) {
    const milestone = effectiveEvent?.config?.anniversary_milestone || effectiveEvent?.anniversary_milestone;
    description += ` ក្នុងពិធីខួបកំណើត ${hostKhmerName || eventName}${milestone ? ` (${milestone})` : ''}`;
  } else if (isHouse) {
    description += ` ក្នុងពិធីឡើងគេហដ្ឋានថ្មី ${hostKhmerName || eventName}`;
  } else if (isEngage) {
    description += ` ក្នុងពិធីភ្ជាប់ពាក្យ ${hostKhmerName} & ${brideKhmerName}`.trimEnd();
  } else if (isAnniv) {
    description += ` ក្នុងពិធីខួបអាពាហ៍ពិពាហ៍ ${hostKhmerName} & ${brideKhmerName}`.trimEnd();
  } else if (hostKhmerName && brideKhmerName && !effectiveEvent?.singlePerson) {
    description += ` ក្នុងពិធីមង្គលការរវាង ${hostKhmerName} & ${brideKhmerName}`;
  } else if (hostKhmerName) {
    description += ` ក្នុងកម្មវិធី ${hostKhmerName}`;
  }

  const eventDate =
    effectiveEvent?.date ||
    effectiveEvent?.config?.invitation_kh?.date_time ||
    effectiveEvent?.schedules?.[0]?.shifts?.[0]?.name ||
    '';
  if (eventDate) {
    description += ` នៅថ្ងៃទី ${eventDate}`;
  }

  const eventLocation =
    typeof effectiveEvent?.location === 'string'
      ? effectiveEvent.location
      : effectiveEvent?.location?.name || effectiveEvent?.config?.invitation_kh?.location || '';
  if (eventLocation) {
    description += ` ទីតាំង៖ ${eventLocation}`;
  }

  const candidateImages = [
    effectiveEvent?.cover_image,
    effectiveEvent?.image,
    effectiveEvent?.config?.cover_background,
    effectiveEvent?.config?.photo_gallary?.photo1,
  ];

  let selectedImage = '';
  for (const candidate of candidateImages) {
    if (!candidate || typeof candidate !== 'string') continue;
    if (candidate.startsWith('data:')) continue;
    if (category !== 'wedding' && candidate.includes('491657278')) continue;
    const abs = toAbsoluteHttpUrl(candidate, origin);
    if (abs) {
      selectedImage = abs;
      break;
    }
  }

  if (!selectedImage) {
    selectedImage = toAbsoluteHttpUrl(getCategoryCoverImage(category), origin);
  }

  return {
    title,
    description,
    image: selectedImage,
    url: pageUrl || origin,
    category,
  };
}

export function escapeHtml(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectMetaIntoHtml(html: string, meta: InvitationMetaResult): string {
  const safeTitleText = meta.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let result = html;

  if (/<title>[\s\S]*?<\/title>/i.test(result)) {
    result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitleText}</title>`);
  } else {
    result = result.replace('</head>', `  <title>${safeTitleText}</title>\n  </head>`);
  }

  const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
    if (!content) return;
    const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`<meta\\b[^>]*\\b${attr}=["']${escapedKey}["'][^>]*>`, 'i');
    const replacement = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
    if (regex.test(result)) {
      result = result.replace(regex, replacement);
    } else {
      result = result.replace('</head>', `    ${replacement}\n  </head>`);
    }
  };

  upsertMeta('name', 'description', meta.description);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:image', meta.image);
  upsertMeta('property', 'og:url', meta.url);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  upsertMeta('name', 'twitter:image', meta.image);

  return result;
}

export function parseFirestoreValue(val: any): any {
  if (!val || typeof val !== 'object') return val;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('timestampValue' in val) return val.timestampValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    const values = val.arrayValue?.values;
    return Array.isArray(values) ? values.map(parseFirestoreValue) : [];
  }
  if ('mapValue' in val) {
    return parseFirestoreDocumentFields(val.mapValue?.fields || {});
  }
  return undefined;
}

export function parseFirestoreDocumentFields(fields: Record<string, any> | undefined | null): Record<string, any> {
  if (!fields || typeof fields !== 'object') return {};
  const out: Record<string, any> = {};
  for (const [key, val] of Object.entries(fields)) {
    out[key] = parseFirestoreValue(val);
  }
  return out;
}

export async function fetchEventFromFirestoreRest(options: {
  projectId: string;
  databaseId?: string;
  eventId: string;
  timeoutMs?: number;
}): Promise<Record<string, any> | null> {
  const { projectId, databaseId = '(default)', eventId, timeoutMs = 2500 } = options;
  if (!projectId || !eventId) return null;

  const dbSegment = databaseId || '(default)';
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/${encodeURIComponent(dbSegment)}/documents/events/${encodeURIComponent(eventId)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { fields?: Record<string, any> };
    if (!json || !json.fields) return null;
    const parsed = parseFirestoreDocumentFields(json.fields);
    if (!parsed.id) parsed.id = eventId;
    return parsed;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

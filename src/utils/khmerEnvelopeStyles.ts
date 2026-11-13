import { toKhmerNumber } from './khmerHelpers';

export type KhmerEnvelopeStyleId =
  | 'traditional-wedding'
  | 'modern-wedding'
  | 'anniversary'
  | 'engagement'
  | 'housewarming'
  | 'birthday';

export interface KhmerEnvelopePalette {
  styleId: KhmerEnvelopeStyleId;
  themeNameKh: string;
  themeNameEn: string;
  champagneGold: string;
  royalGold: string;
  metallicBorder: string;
  ivoryPaper: string;
  ivoryDeep: string;
  accentColor: string;
  inkColor: string;
  subtleInkColor: string;
  ribbonColor: string;
  subtitleDefaultKh: string;
  subtitleDefaultEn: string;
  openLabelKh: string;
  openLabelEn: string;
  confettiColors: string[];
}

export interface ResolveStyleInput {
  eventType?: string;
  id?: string;
  name?: string;
}

const LUXURY_BASE = {
  champagneGold: '#D9A441',
  royalGold: '#F5B82E',
  metallicBorder: '#E8BD65',
  ivoryPaper: '#FFF8E9',
  ivoryDeep: '#F5EBD6',
  inkColor: '#593B22',
  subtleInkColor: '#8B6842',
};

export function resolveKhmerEnvelopeVariant(input: ResolveStyleInput): KhmerEnvelopePalette {
  const eventTypeLower = (input.eventType || '').toLowerCase();
  const idLower = (input.id || '').toLowerCase();
  const nameLower = (input.name || '').toLowerCase();

  const isAnniversary =
    eventTypeLower === 'anniversary' ||
    idLower.includes('anniversary') ||
    nameLower.includes('ខួបអាពាហ៍ពិពាហ៍') ||
    nameLower.includes('anniversary');

  const isBirthday =
    !isAnniversary &&
    (eventTypeLower === 'birthday' ||
      idLower.includes('birthday') ||
      nameLower.includes('ខួបកំណើត') ||
      nameLower.includes('birthday'));

  const isEngagement =
    eventTypeLower === 'engagement' ||
    idLower.includes('engagement') ||
    nameLower.includes('ភ្ជាប់ពាក្យ') ||
    nameLower.includes('engage');

  const isHousewarming =
    eventTypeLower === 'housewarming' ||
    idLower.includes('housewarming') ||
    nameLower.includes('ឡើងផ្ទះ') ||
    nameLower.includes('ឡើងគេហដ្ឋាន') ||
    nameLower.includes('house');

  const isModernWedding =
    !isAnniversary &&
    !isBirthday &&
    !isEngagement &&
    !isHousewarming &&
    (idLower.includes('modern') || nameLower.includes('សម័យ') || nameLower.includes('modern'));

  if (isAnniversary) {
    return {
      ...LUXURY_BASE,
      styleId: 'anniversary',
      themeNameKh: 'ខួបអាពាហ៍ពិពាហ៍ប្រណីតខ្មែរ',
      themeNameEn: 'Khmer Royal Anniversary',
      accentColor: '#8B2435',
      ribbonColor: '#8B2435',
      subtitleDefaultKh: 'រីករាយខួបអាពាហ៍ពិពាហ៍',
      subtitleDefaultEn: 'HAPPY ANNIVERSARY',
      openLabelKh: 'បើកលិខិតអញ្ជើញ',
      openLabelEn: 'Open Invitation',
      confettiColors: ['#D9A441', '#F5B82E', '#8B2435', '#FFF8E9', '#E8BD65'],
    };
  }

  if (isBirthday) {
    return {
      ...LUXURY_BASE,
      styleId: 'birthday',
      themeNameKh: 'ពិធីខួបកំណើតសិរីមង្គល',
      themeNameEn: 'Khmer Auspicious Birthday',
      accentColor: '#115E46',
      ribbonColor: '#8B2435',
      subtitleDefaultKh: 'រីករាយពិធីខួបកំណើត',
      subtitleDefaultEn: 'HAPPY BIRTHDAY',
      openLabelKh: 'បើកធៀបខួបកំណើត',
      openLabelEn: 'Open Birthday Invitation',
      confettiColors: ['#D9A441', '#F5B82E', '#115E46', '#FFF8E9', '#E8BD65'],
    };
  }

  if (isEngagement) {
    return {
      ...LUXURY_BASE,
      styleId: 'engagement',
      themeNameKh: 'ពិធីភ្ជាប់ពាក្យប្រពៃណីខ្មែរ',
      themeNameEn: 'Khmer Royal Engagement',
      accentColor: '#8B2435',
      ribbonColor: '#8B2435',
      subtitleDefaultKh: 'សិរីមង្គលពិធីភ្ជាប់ពាក្យ',
      subtitleDefaultEn: 'ROYAL ENGAGEMENT',
      openLabelKh: 'បើកលិខិតអញ្ជើញ',
      openLabelEn: 'Open Invitation',
      confettiColors: ['#D9A441', '#F5B82E', '#8B2435', '#FFF8E9', '#E8BD65'],
    };
  }

  if (isHousewarming) {
    return {
      ...LUXURY_BASE,
      styleId: 'housewarming',
      themeNameKh: 'ពិធីឡើងគេហដ្ឋានថ្មី',
      themeNameEn: 'Khmer Royal Housewarming',
      accentColor: '#115E46',
      ribbonColor: '#115E46',
      subtitleDefaultKh: 'សិរីមង្គលឡើងគេហដ្ឋានថ្មី',
      subtitleDefaultEn: 'HOUSEWARMING BLESSING',
      openLabelKh: 'អូសទៅស្តាំដើម្បីបើកធៀប',
      openLabelEn: 'Slide Right to Open',
      confettiColors: ['#D9A441', '#F5B82E', '#115E46', '#FFF8E9', '#E8BD65'],
    };
  }

  if (isModernWedding) {
    return {
      ...LUXURY_BASE,
      styleId: 'modern-wedding',
      themeNameKh: 'អាពាហ៍ពិពាហ៍សម័យខ្មែរ',
      themeNameEn: 'Khmer Modern Royal Wedding',
      accentColor: '#8B2435',
      ribbonColor: '#8B2435',
      subtitleDefaultKh: 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
      subtitleDefaultEn: 'WEDDING CELEBRATION',
      openLabelKh: 'បើកលិខិតអញ្ជើញ',
      openLabelEn: 'Open Invitation',
      confettiColors: ['#D9A441', '#F5B82E', '#8B2435', '#FFF8E9', '#E8BD65'],
    };
  }

  return {
    ...LUXURY_BASE,
    styleId: 'traditional-wedding',
    themeNameKh: 'មង្គលការប្រពៃណីខ្មែរ',
    themeNameEn: 'Khmer Traditional Wedding',
    accentColor: '#8B2435',
    ribbonColor: '#8B2435',
    subtitleDefaultKh: 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
    subtitleDefaultEn: 'ROYAL KHMER WEDDING',
    openLabelKh: 'បើកលិខិតអញ្ជើញ',
    openLabelEn: 'Open Invitation',
    confettiColors: ['#D9A441', '#F5B82E', '#8B2435', '#FFF8E9', '#E8BD65'],
  };
}

/**
 * Extracts Khmer primary consonant initials (given name letter in Khmer convention)
 * cleanly stripping Cambodian honorifics, with fallback to Latin characters.
 */
export function extractSingleKhmerInitial(name?: string, fallback = 'ម'): string {
  if (!name || !name.trim()) return fallback;
  const cleaned = name
    .trim()
    .replace(/^(លោកជំទាវ|ឯកឧត្តម|អ្នកឧកញ៉ា|ឧកញ៉ា|អ្នកស្រី|កញ្ញា|លោក|កូនកម្លោះ|កូនកំលោះ|កូនក្រមុំ|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '');
  const words = cleaned.trim().split(/\s+/).filter(Boolean);
  const targetWord = words.length > 1 ? words[words.length - 1] : (words[0] || '');
  const match = targetWord.match(/[\u1780-\u17A2]/);
  if (match) return match[0];
  const latinMatch = targetWord.match(/[A-Za-z]/);
  return latinMatch ? latinMatch[0].toUpperCase() : fallback;
}

export function extractKhmerMonogramInitials(
  groom?: string,
  bride?: string,
  groomFallback = 'ម',
  brideFallback = 'វ'
): { groomInitial: string; brideInitial: string } {
  return {
    groomInitial: extractSingleKhmerInitial(groom, groomFallback),
    brideInitial: extractSingleKhmerInitial(bride, brideFallback),
  };
}

export interface KhmerCoverDateBadge {
  monthKh: string;
  monthEn: string;
  dayKh: string;
  dayEn: string;
  weekdayKh: string;
  weekdayEn: string;
  timeDisplay: string;
}

const KHMER_WEEKDAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const EN_WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
];
const EN_MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

export function formatKhmerCoverDateBadge(eventDate?: string, eventTime?: string): KhmerCoverDateBadge {
  const fallback: KhmerCoverDateBadge = {
    monthKh: 'ធ្នូ',
    monthEn: 'DECEMBER',
    dayKh: '១២',
    dayEn: '12',
    weekdayKh: 'ថ្ងៃសៅរ៍',
    weekdayEn: 'SATURDAY',
    timeDisplay: eventTime?.trim() || '06:30 PM',
  };

  if (!eventDate || !eventDate.trim()) return fallback;

  const isoMatch = eventDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  let parsed: Date | null = null;
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = Number(isoMatch[3]);
    parsed = new Date(y, m - 1, d);
  } else {
    const tryDate = new Date(eventDate);
    if (!isNaN(tryDate.getTime())) {
      parsed = tryDate;
    }
  }

  if (!parsed || isNaN(parsed.getTime())) {
    const numMatch = eventDate.match(/(\d{1,2})/);
    if (numMatch) {
      const n = String(Number(numMatch[1])).padStart(2, '0');
      return {
        ...fallback,
        dayEn: n,
        dayKh: toKhmerNumber(n),
      };
    }
    return fallback;
  }

  const dayNum = parsed.getDate();
  const dayStr = String(dayNum).padStart(2, '0');
  const monthIdx = parsed.getMonth();
  const weekdayIdx = parsed.getDay();

  return {
    monthKh: KHMER_MONTHS[monthIdx] || fallback.monthKh,
    monthEn: EN_MONTHS[monthIdx] || fallback.monthEn,
    dayKh: toKhmerNumber(dayStr),
    dayEn: dayStr,
    weekdayKh: `ថ្ងៃ${KHMER_WEEKDAYS[weekdayIdx] || 'សៅរ៍'}`,
    weekdayEn: EN_WEEKDAYS[weekdayIdx] || 'SATURDAY',
    timeDisplay: eventTime?.trim() || fallback.timeDisplay,
  };
}

/**
 * Strips brittle third-party stock/CDN default backgrounds and falls back to verified local assets.
 */
export function sanitizeCoverBackgroundUrl(
  rawUrl?: string,
  localFallback = '/assets/template15/opening-background.webp'
): string {
  if (!rawUrl || !rawUrl.trim()) return localFallback;
  const trimmed = rawUrl.trim();
  if (
    trimmed.includes('focuz-staging-space') ||
    trimmed.includes('free-background') ||
    trimmed.includes('images.unsplash.com') ||
    trimmed === 'default' ||
    trimmed === 'none'
  ) {
    return localFallback;
  }
  return trimmed;
}

import { formatKhmerDate, formatEnDate, toKhmerNumber } from './khmerHelpers';

export interface ParsedHousewarmingSchedule {
  dateLabelKh: string;
  dateLabelEn: string;
  timeLabelKh: string;
  timeLabelEn: string;
}

/**
 * Formats an ISO or YYYY-MM-DD event date and time string into clean
 * Khmer and English housewarming display strings.
 */
export function formatHousewarmingSchedule(
  eventDate?: string,
  eventTime?: string
): ParsedHousewarmingSchedule {
  let isoDate = '';
  if (eventDate) {
    const isoMatch = eventDate.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      isoDate = isoMatch[1];
    } else {
      const parsed = new Date(eventDate);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const d = String(parsed.getDate()).padStart(2, '0');
        isoDate = `${y}-${m}-${d}`;
      }
    }
  }

  const dateLabelKh = isoDate
    ? formatKhmerDate(isoDate)
    : eventDate?.trim() || 'ថ្ងៃអាទិត្យ ទី០៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦';

  const dateLabelEn = isoDate
    ? formatEnDate(isoDate)
    : eventDate?.trim() || 'Sunday, November 8, 2026';

  let cleanTime = (eventTime || '').trim();
  if (cleanTime && cleanTime.includes('T')) {
    const d = new Date(cleanTime);
    if (!isNaN(d.getTime())) {
      cleanTime = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  }

  const timeEn = cleanTime || '05:30 PM';
  const timeKh = formatKhmerTimeLabel(timeEn);

  return {
    dateLabelKh,
    dateLabelEn,
    timeLabelKh: timeKh,
    timeLabelEn: timeEn,
  };
}

export function formatKhmerTimeLabel(timeStr: string): string {
  const clean = (timeStr || '').trim();
  if (!clean) return 'ម៉ោង ០៥:៣០ ល្ងាច';
  if (/[\u1780-\u17FF]/.test(clean)) return clean;

  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return clean;

  const hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = (match[3] || '').toUpperCase();

  let khPeriod = '';
  if (period === 'AM') {
    khPeriod = hour < 12 ? 'ព្រឹក' : 'ថ្ងៃត្រង់';
  } else if (period === 'PM') {
    khPeriod = hour >= 5 && hour < 12 ? 'ល្ងាច' : hour === 12 ? 'ថ្ងៃត្រង់' : 'រសៀល';
  }

  const hStr = hour < 10 ? `0${hour}` : `${hour}`;
  return `ម៉ោង ${toKhmerNumber(hStr)}:${toKhmerNumber(minute)}${khPeriod ? ` ${khPeriod}` : ''}`;
}

export function buildHousewarmingHostsDisplay(
  groom?: string,
  bride?: string,
  singlePerson?: boolean
): string {
  let g = (groom || '').trim();
  let b = (bride || '').trim();

  if (g.includes('ពិធី') || g.includes('ខួប') || g.includes('រៀបការ')) {
    const parts = g.split(/[:–—\-]/);
    if (parts.length > 1) {
      g = parts[parts.length - 1].trim();
    }
  }

  if (singlePerson) return g || b || 'ម្ចាស់គេហដ្ឋាន';
  if (g && b) {
    if (g.toLowerCase() === b.toLowerCase() || g.toLowerCase().includes(b.toLowerCase())) return g;
    if (b.toLowerCase().includes(g.toLowerCase())) return b;
    return `${g} & ${b}`;
  }
  return g || b || 'លោក សំ ភារម្យ & អ្នកស្រី កែវ ស្រីមុំ';
}

export function buildGoogleMapsSearchUrl(location?: string): string {
  const query = (location || '').trim() || 'Phnom Penh, Cambodia';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function containsKhmerScript(text?: string): boolean {
  return /[\u1780-\u17FF]/.test(text || '');
}

const DEFAULT_HW_LOC_KH = 'គេហដ្ឋានថ្មី (បុរី ជីបម៉ុង លែន ផ្លូវ៦០ម៉ែត្រ)';
const DEFAULT_HW_LOC_EN = 'New Residence (Borey Chip Mong Land 60M Street)';

export function formatHousewarmingLocation(
  eventLocation: string | undefined,
  language: 'kh' | 'en'
): string {
  const trimmed = (eventLocation || '').trim();
  if (!trimmed) {
    return language === 'kh' ? DEFAULT_HW_LOC_KH : DEFAULT_HW_LOC_EN;
  }
  if (language === 'en' && trimmed === DEFAULT_HW_LOC_KH) {
    return DEFAULT_HW_LOC_EN;
  }
  if (language === 'kh' && trimmed === DEFAULT_HW_LOC_EN) {
    return DEFAULT_HW_LOC_KH;
  }
  return trimmed;
}


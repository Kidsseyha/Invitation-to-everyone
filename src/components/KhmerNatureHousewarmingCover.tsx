import React, { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Home,
  MapPin,
  ChevronDown,
  Globe,
  Volume2,
  VolumeX,
  SkipForward,
  User,
  Check,
  X,
  ChevronsRight,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeMode } from './ThemeToggle';
import { GuestPreset } from '../data/guests';
import { KhmerCornerKbach, KhmerDividerKbach } from './KhmerRoyalOrnament';
import {
  formatHousewarmingSchedule,
  buildHousewarmingHostsDisplay,
  buildGoogleMapsSearchUrl,
  containsKhmerScript,
  formatHousewarmingLocation,
} from '../utils/housewarmingHelpers';
import khmerNatureBg from '../assets/images/khmer_nature_housewarming_bg_1794537019312.jpg';
import khmerVillaEmblem from '../assets/images/khmer_housewarming_villa_emblem_1794537020715.jpg';

export { khmerNatureBg, khmerVillaEmblem };

interface KhmerNatureHousewarmingCoverProps {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  singlePerson?: boolean;
  subtitleKh?: string;
  subtitleEn?: string;
  ribbonLabel?: string;
  guestName?: string;
  language: Language;
  theme: ThemeMode;
  isOpening?: boolean;
  isAdmin?: boolean;
  savedGuestsList?: GuestPreset[];
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  coverBackground?: string;
  primaryColor?: string;
  coverEnNameColor?: string;
  coverEnFontFamily?: string;
  guestNameFontFamily?: string;
  guestNameFontSize?: string;
  activeEnvelopeColor?: string;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onRestartMusic: () => void;
  onToggleLanguage?: () => void;
  onOpenDesignTab?: () => void;
  onSelectFromDropbox: (name: string) => void;
  onOpenAddGuestModal?: () => void;
  onUpdateGuestName?: (name: string) => void;
  onOpenInvitation: () => void;
}

const NATURE_MOTES = [
  { id: 'm1', left: '14%', top: '22%', size: 6, delay: 0, dur: 5.5 },
  { id: 'm2', left: '84%', top: '18%', size: 5, delay: 1.1, dur: 6.2 },
  { id: 'm3', left: '11%', top: '62%', size: 7, delay: 2.0, dur: 5.8 },
  { id: 'm4', left: '88%', top: '58%', size: 5, delay: 0.7, dur: 6.6 },
  { id: 'm5', left: '22%', top: '82%', size: 6, delay: 1.6, dur: 5.2 },
  { id: 'm6', left: '78%', top: '80%', size: 6, delay: 2.5, dur: 6.0 },
];

export default function KhmerNatureHousewarmingCover({
  groom,
  bride,
  groomEn,
  brideEn,
  singlePerson = false,
  subtitleKh,
  subtitleEn,
  ribbonLabel,
  guestName,
  language,
  theme,
  isOpening = false,
  isAdmin = false,
  savedGuestsList = [],
  eventDate,
  eventTime,
  eventLocation,
  coverBackground,
  coverEnNameColor,
  coverEnFontFamily,
  guestNameFontFamily,
  guestNameFontSize,
  activeEnvelopeColor,
  isPlayingMusic,
  onToggleMusic,
  onRestartMusic,
  onToggleLanguage,
  onOpenDesignTab,
  onSelectFromDropbox,
  onOpenAddGuestModal,
  onUpdateGuestName,
  onOpenInvitation,
}: KhmerNatureHousewarmingCoverProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLight = theme === 'light';

  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName || '');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);
  const [emblemFailed, setEmblemFailed] = useState(false);

  const schedule = formatHousewarmingSchedule(eventDate, eventTime);
  const hostsKh = buildHousewarmingHostsDisplay(groom, bride, singlePerson);
  const hostsEn = buildHousewarmingHostsDisplay(
    groomEn || groom,
    brideEn || bride,
    singlePerson
  );

  const cleanLocation = formatHousewarmingLocation(eventLocation, language);

  const displayGuest =
    guestName && guestName !== 'Your Name'
      ? guestName
      : language === 'kh'
      ? 'ភ្ញៀវកិត្តិយស'
      : 'Honored Guest';

  // Use bespoke Khmer botanical art unless admin uploaded a custom non-default photo
  const hasCustomCover =
    Boolean(coverBackground) &&
    !coverBackground!.includes('free-background') &&
    !coverBackground!.includes('default') &&
    !coverBackground!.includes('white_arch_columns');
  const backdropImage = !bgFailed
    ? hasCustomCover
      ? coverBackground!
      : khmerNatureBg
    : '';

  const handleSaveInlineGuest = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = tempGuestName.trim();
    if (trimmed && onUpdateGuestName) {
      onUpdateGuestName(trimmed);
    }
    setIsEditingGuest(false);
  };

  // Curated color tokens with guaranteed WCAG AA legibility
  const goldInk = isLight ? '#8a5a10' : '#f4cb5c';
  const primaryTitleColor = isLight ? '#103b2a' : '#fef8e8';
  const secondaryTextColor = isLight ? '#2c4c3e' : '#d5e5dc';
  const mutedHairlineColor = isLight ? 'rgba(138, 90, 16, 0.28)' : 'rgba(244, 203, 92, 0.32)';

  return (
    <div
      data-housewarming-theme={theme}
      className={`relative isolate w-full h-full min-h-[600px] sm:min-h-[680px] md:min-h-[730px] flex flex-col justify-between items-center text-center overflow-hidden rounded-[28px] select-none px-4 sm:px-7 py-5 sm:py-6 ${
        isLight ? 'bg-[#f8f5eb] text-[#103b2a]' : 'bg-[#071e16] text-[#fef8e8]'
      }`}
    >
      {/* 1. Botanical Khmer Nature Artwork Background */}
      {backdropImage ? (
        <img
          src={backdropImage}
          alt="Khmer botanical housewarming background"
          referrerPolicy="no-referrer"
          onError={() => setBgFailed(true)}
          className="pointer-events-none absolute inset-0 -z-20 w-full h-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#0b2e21] via-[#124231] to-[#082218]"
        />
      )}

      {/* 2. Measured Scrim Layer so Botanical Edges Glow while Center Stays High-Contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-500"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 78% 76% at 50% 48%, rgba(252, 249, 241, 0.96) 0%, rgba(250, 246, 234, 0.88) 58%, rgba(246, 240, 224, 0.22) 100%)'
            : 'radial-gradient(ellipse 76% 74% at 50% 50%, rgba(6, 28, 20, 0.94) 0%, rgba(8, 36, 26, 0.85) 56%, rgba(4, 20, 14, 0.35) 100%)',
        }}
      />

      {/* 3. Subtle Inner Double Khmer Hairline Frame & Corner Kbach */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded-[22px] border z-10"
        style={{ borderColor: isLight ? 'rgba(138, 90, 16, 0.38)' : 'rgba(244, 203, 92, 0.36)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 sm:inset-4 rounded-[18px] border z-10"
        style={{ borderColor: isLight ? 'rgba(16, 59, 42, 0.16)' : 'rgba(167, 243, 208, 0.14)' }}
      />

      <div className="pointer-events-none absolute top-2 left-2 z-10 opacity-90">
        <KhmerCornerKbach position="top-left" className="w-11 h-11 sm:w-12 sm:h-12" />
      </div>
      <div className="pointer-events-none absolute top-2 right-2 z-10 opacity-90">
        <KhmerCornerKbach position="top-right" className="w-11 h-11 sm:w-12 sm:h-12" />
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 z-10 opacity-90">
        <KhmerCornerKbach position="bottom-left" className="w-11 h-11 sm:w-12 sm:h-12" />
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 z-10 opacity-90">
        <KhmerCornerKbach position="bottom-right" className="w-11 h-11 sm:w-12 sm:h-12" />
      </div>

      {/* 4. Gentle Sunlit Golden Botanical Motes (Compositor-Only) */}
      {!prefersReducedMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {NATURE_MOTES.map((mote) => (
            <motion.span
              key={mote.id}
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.22, 0.65, 0.22],
              }}
              transition={{
                duration: mote.dur,
                delay: mote.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute rounded-full ${
                isLight ? 'bg-amber-500/45' : 'bg-amber-300/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* 5. Top Utility Controls Row */}
      <div className="relative z-30 w-full flex items-center justify-between gap-2 pt-0.5 px-1">
        <div className="flex items-center gap-1.5">
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              aria-label={language === 'kh' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-khmer font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white/85 hover:bg-white text-[#103b2a] border-[#8a5a10]/30 shadow-xs'
                  : 'bg-[#0b2a1f]/85 hover:bg-[#113c2d] text-amber-200 border-amber-400/35 shadow-xs'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}</span>
            </button>
          )}
          {isAdmin && onOpenDesignTab && (
            <button
              type="button"
              onClick={onOpenDesignTab}
              aria-label={language === 'kh' ? 'កែការរចនា' : 'Edit Design'}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-khmer font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white/85 hover:bg-white text-[#8a5a10] border-[#8a5a10]/30 shadow-xs'
                  : 'bg-[#0b2a1f]/85 hover:bg-[#113c2d] text-amber-200 border-amber-400/35 shadow-xs'
              }`}
            >
              <Palette
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: activeEnvelopeColor || goldInk }}
              />
              <span>{language === 'kh' ? 'កែរចនា' : 'Design'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRestartMusic}
            aria-label={language === 'kh' ? 'ចាក់ភ្លេងឡើងវិញ' : 'Restart music'}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-white/85 hover:bg-white text-[#103b2a] border-[#8a5a10]/30 shadow-xs'
                : 'bg-[#0b2a1f]/85 hover:bg-[#113c2d] text-amber-200 border-amber-400/35 shadow-xs'
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isPlayingMusic ? 'Mute background music' : 'Play background music'}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-white/85 hover:bg-white text-[#103b2a] border-[#8a5a10]/30 shadow-xs'
                : 'bg-[#0b2a1f]/85 hover:bg-[#113c2d] text-amber-200 border-amber-400/35 shadow-xs'
            }`}
          >
            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 6. Auspicious Khmer Header */}
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex flex-col items-center w-full max-w-md mt-1"
      >
        {/* Khmer Lotus Crest SVG */}
        <svg
          viewBox="0 0 120 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-24 h-7 mb-1"
        >
          <path
            d="M10 22 Q 35 22 48 16 M110 22 Q 85 22 72 16"
            stroke={goldInk}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M60 4 C 55 12, 55 20, 60 26 C 65 20, 65 12, 60 4 Z"
            fill={goldInk}
            opacity="0.9"
          />
          <path
            d="M60 25 C 52 22, 46 16, 48 10 C 52 12, 56 17, 60 25 Z"
            fill={goldInk}
            opacity="0.65"
          />
          <path
            d="M60 25 C 68 22, 74 16, 72 10 C 68 12, 64 17, 60 25 Z"
            fill={goldInk}
            opacity="0.65"
          />
          <circle cx="60" cy="30" r="1.8" fill={goldInk} />
        </svg>

        <h1
          className={`text-xl sm:text-2xl md:text-[26px] font-bold leading-[1.55] px-2 text-balance ${
            language === 'kh' ? 'tracking-normal' : 'tracking-wide'
          }`}
          style={{
            fontFamily: language === 'kh' ? "'Moul', serif" : "'Playfair Display', serif",
            color: goldInk,
            textShadow: isLight
              ? '0 1px 0 rgba(255,255,255,0.9)'
              : '0 2px 10px rgba(0,0,0,0.55)',
          }}
        >
          {language === 'kh'
            ? subtitleKh || 'ពិធីឡើងគេហដ្ឋានថ្មី'
            : subtitleEn || 'Housewarming Blessing'}
        </h1>

        <p
          className={`mt-0.5 font-semibold ${
            language === 'kh'
              ? 'text-[11px] sm:text-xs tracking-[0.16em] uppercase'
              : 'text-xs sm:text-[13px] tracking-normal font-khmer'
          }`}
          style={{ color: secondaryTextColor }}
        >
          {language === 'kh'
            ? subtitleEn || 'Housewarming Blessing'
            : subtitleKh || 'ពិធីឡើងគេហដ្ឋានថ្មី'}
        </p>

        <KhmerDividerKbach className="w-44 sm:w-56 h-4 mt-2 opacity-90" color={goldInk} />
      </motion.header>

      {/* 7. Centerpiece: Khmer Teakwood Home & Lotus Pond Nature Medallion */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex flex-col items-center my-2"
      >
        <div
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, #d4af37, #fef3c7, #8a5a10)'
              : 'linear-gradient(135deg, #f4cb5c, #2dd4bf, #9a6d16)',
          }}
        >
          <div
            className={`w-full h-full rounded-full overflow-hidden border-2 ${
              isLight ? 'border-white/90 bg-[#f7f3e8]' : 'border-[#071e16] bg-[#0b2a1f]'
            }`}
          >
            {!emblemFailed ? (
              <img
                src={khmerVillaEmblem}
                alt={
                  language === 'kh'
                    ? 'រូបភាពគេហដ្ឋានប្រពៃណីខ្មែរ និងធម្មជាតិស្រស់បំព្រង'
                    : 'Traditional Khmer home nestled in lush lotus nature garden'
                }
                referrerPolicy="no-referrer"
                onError={() => setEmblemFailed(true)}
                className="w-full h-full object-cover scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-200">
                <Home className="w-10 h-10 mb-1" />
                <span className="text-[10px] font-khmer">សិរីមង្គល</span>
              </div>
            )}
          </div>
        </div>

        {/* Host Names */}
        <div className="mt-2.5 space-y-0.5 max-w-sm px-2">
          <h2
            className="text-[17px] sm:text-xl font-normal leading-[1.6] tracking-normal text-balance"
            style={{
              fontFamily: containsKhmerScript(hostsKh) ? "'Moul', serif" : "'Playfair Display', serif",
              color: primaryTitleColor,
            }}
          >
            {hostsKh}
          </h2>
          <p
            className="text-sm sm:text-base font-medium tracking-wide"
            style={{
              color: coverEnNameColor && !coverEnNameColor.includes('fde047')
                ? coverEnNameColor
                : goldInk,
              fontFamily: coverEnFontFamily || "'Playfair Display', serif",
            }}
          >
            {hostsEn}
          </p>
        </div>
      </motion.div>

      {/* 8. Clean Typographic Date, Time & Venue Strip (Zero-Pill Hairline Layout) */}
      <div
        className="relative z-20 w-full max-w-sm py-2 px-2 border-y"
        style={{ borderColor: mutedHairlineColor }}
      >
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs sm:text-[13px] font-semibold tabular-nums"
          style={{ color: primaryTitleColor }}
        >
          <span>{language === 'kh' ? schedule.dateLabelKh : schedule.dateLabelEn}</span>
          <span aria-hidden="true" style={{ color: goldInk }}>
            ·
          </span>
          <span>{language === 'kh' ? schedule.timeLabelKh : schedule.timeLabelEn}</span>
        </div>

        <div className="mt-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsLocationExpanded((prev) => !prev)}
            aria-expanded={isLocationExpanded}
            className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium max-w-full hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: secondaryTextColor }}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: goldInk }} />
            <span className="truncate max-w-[235px] sm:max-w-[290px]">{cleanLocation}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                isLocationExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isLocationExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden w-full pt-1.5 text-center"
              >
                <a
                  href={buildGoogleMapsSearchUrl(cleanLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold underline underline-offset-2 hover:opacity-80"
                  style={{ color: goldInk }}
                >
                  <span>
                    {language === 'kh'
                      ? 'បើកមើលទីតាំងលើ Google Maps'
                      : 'Open location in Google Maps'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 9. Honored Guest Plaque & Optional Guest Selector */}
      <div className="relative z-20 w-full max-w-sm flex flex-col items-center my-2 space-y-2">
        {savedGuestsList.length > 0 && (
          <div className="w-full max-w-[300px]">
            <label htmlFor="guest-database-dropbox-select" className="sr-only">
              {language === 'kh' ? 'ជ្រើសរើសឈ្មោះភ្ញៀវ' : 'Select Guest'}
            </label>
            <select
              id="guest-database-dropbox-select"
              value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
              onChange={(e) => onSelectFromDropbox(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-khmer border focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors ${
                isLight
                  ? 'bg-white/90 text-[#103b2a] border-[#8a5a10]/35 focus-visible:ring-amber-600'
                  : 'bg-[#09241b]/90 text-amber-100 border-amber-400/35 focus-visible:ring-amber-400'
              }`}
            >
              <option value="" disabled>
                {language === 'kh'
                  ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពីបញ្ជី...'
                  : '▼ Select Guest from List...'}
              </option>
              {savedGuestsList.map((g, idx) => (
                <option key={g.id ? `${g.id}-${idx}` : `hw-guest-${idx}`} value={g.name}>
                  {g.name}{' '}
                  {g.categoryLabelKh
                    ? `(${language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn || g.categoryLabelKh})`
                    : ''}
                </option>
              ))}
              {isAdmin && (
                <option value="__ADD_NEW__">
                  + {language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី...' : 'Add New Guest...'}
                </option>
              )}
            </select>
          </div>
        )}

        {!isEditingGuest ? (
          <div
            className={`w-full max-w-[320px] px-4 py-2.5 rounded-xl border transition-colors ${
              isLight
                ? 'bg-white/80 border-[#8a5a10]/35 shadow-sm'
                : 'bg-[#09241b]/80 border-amber-400/35 shadow-md'
            }`}
          >
            <p
              className="text-[11px] sm:text-xs font-khmer font-semibold tracking-wide"
              style={{ color: goldInk }}
            >
              {ribbonLabel ||
                (language === 'kh'
                  ? 'សូមគោរពអញ្ជើញចូលរួមពិធីឡើងគេហដ្ឋានថ្មី'
                  : 'Cordially Invited to Our Housewarming')}
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenAddGuestModal) {
                    onOpenAddGuestModal();
                  } else {
                    setTempGuestName(guestName || '');
                    setIsEditingGuest(true);
                  }
                }}
                title={
                  language === 'kh'
                    ? 'ចុចដើម្បីបន្ថែម ឬកែឈ្មោះភ្ញៀវ'
                    : 'Click to edit or add guest name'
                }
                className="w-full mt-0.5 text-center hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span
                  className={`block truncate leading-relaxed ${
                    containsKhmerScript(displayGuest)
                      ? 'font-moul text-base sm:text-lg tracking-normal'
                      : 'font-bold text-lg sm:text-xl tracking-wide'
                  }`}
                  style={{
                    fontFamily:
                      guestNameFontFamily && containsKhmerScript(displayGuest)
                        ? guestNameFontFamily
                        : containsKhmerScript(displayGuest)
                        ? "'Moul', serif"
                        : "'Playfair Display', serif",
                    fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
                    color: primaryTitleColor,
                  }}
                >
                  {displayGuest}
                </span>
              </button>
            ) : (
              <span
                className={`block truncate leading-relaxed mt-0.5 ${
                  containsKhmerScript(displayGuest)
                    ? 'font-moul text-base sm:text-lg tracking-normal'
                    : 'font-bold text-lg sm:text-xl tracking-wide'
                }`}
                style={{
                  fontFamily:
                    guestNameFontFamily && containsKhmerScript(displayGuest)
                      ? guestNameFontFamily
                      : containsKhmerScript(displayGuest)
                      ? "'Moul', serif"
                      : "'Playfair Display', serif",
                  fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
                  color: primaryTitleColor,
                }}
              >
                {displayGuest}
              </span>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSaveInlineGuest}
            className={`w-full max-w-[320px] p-2.5 rounded-xl border space-y-2 ${
              isLight
                ? 'bg-white/95 border-[#8a5a10]/40'
                : 'bg-[#09241b]/95 border-amber-400/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-khmer font-semibold">
              <span className="flex items-center gap-1" style={{ color: goldInk }}>
                <User className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'ឈ្មោះភ្ញៀវកិត្តិយស' : 'Guest Name'}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditingGuest(false)}
                aria-label="Cancel editing guest name"
                className="p-1 rounded hover:opacity-75 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="guest-name-input"
                type="text"
                value={tempGuestName}
                onChange={(e) => setTempGuestName(e.target.value)}
                autoFocus
                placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវ...' : 'Guest name...'}
                className={`flex-1 px-3 py-1.5 rounded-lg border text-sm font-moul text-center focus:outline-none ${
                  isLight
                    ? 'bg-white text-[#103b2a] border-[#8a5a10]/35'
                    : 'bg-[#051812] text-amber-100 border-amber-400/35'
                }`}
              />
              <button
                id="save-guest-name-btn"
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#14533c] text-amber-100 text-xs font-khmer font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'kh' ? 'រក្សាទុក' : 'Save'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 10. Primary Open Invitation Button (Accessible Native Button) */}
      <div className="relative z-20 w-full flex justify-center pt-1">
        <motion.button
          id="open-invitation-btn"
          type="button"
          onClick={onOpenInvitation}
          disabled={isOpening}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -1 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="relative group px-7 py-3 rounded-full bg-gradient-to-r from-[#0e4531] via-[#156045] to-[#0c3c2b] hover:from-[#12563e] hover:to-[#0f4a35] text-amber-100 border border-[#e8bf54]/80 shadow-[0_10px_24px_rgba(8,40,28,0.4)] flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          <Home className="relative z-10 w-4 h-4 text-[#f4cb5c] shrink-0" />
          <span
            className="relative z-10 text-xs sm:text-sm font-bold tracking-wide text-[#fef8e8]"
            style={{ fontFamily: "'Noto Serif Khmer', serif" }}
          >
            {isOpening
              ? language === 'kh'
                ? 'កំពុងបើកធៀប...'
                : 'Opening Invitation...'
              : language === 'kh'
              ? 'សូមចុចបើកធៀប'
              : 'Open Invitation'}
          </span>
          <ChevronsRight className="relative z-10 w-4 h-4 text-[#f4cb5c] shrink-0" />
        </motion.button>
      </div>
    </div>
  );
}

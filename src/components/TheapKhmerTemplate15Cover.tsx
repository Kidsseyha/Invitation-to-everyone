import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Check, X } from 'lucide-react';

interface TheapKhmerTemplate15CoverProps {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  subtitleKh?: string;
  subtitleEn?: string;
  guestName?: string;
  language?: string;
  isOpening?: boolean;
  onOpenInvitation?: () => void;
  isAdmin?: boolean;
  savedGuestsList?: Array<{ id?: string; name: string; categoryLabelKh?: string; categoryLabelEn?: string }>;
  onSelectFromDropbox?: (name: string) => void;
  onOpenAddGuestModal?: () => void;
  onUpdateGuestName?: (name: string) => void;
  guestNameFontFamily?: string;
  guestNameColor?: string;
  guestNameFontSize?: string;
}

export function TheapKhmerDivider({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <img
      src="/assets/template15/divider.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none object-contain ${inverted ? 'scale-y-[-1]' : ''} ${className || 'w-48 sm:w-56 h-auto mx-auto'}`}
    />
  );
}

function getLatinInitial(nameEn?: string, nameKh?: string, fallback = 'R', useLastWord = false): string {
  if (nameEn && nameEn.trim()) {
    const cleaned = nameEn
      .trim()
      .replace(/^(mr|mrs|ms|miss|dr)\.?\s+/i, '');
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length > 0) {
      const target = useLastWord ? parts[parts.length - 1] : parts[0];
      return target.charAt(0).toUpperCase();
    }
  }
  if (nameKh && nameKh.trim()) {
    return nameKh.trim().charAt(0);
  }
  return fallback;
}

export default function TheapKhmerTemplate15Cover({
  groom = 'រ៉ូ ម៉ាឡេ',
  bride = 'អួម វល្ខ័ក',
  groomEn = 'Ro Malay',
  brideEn = 'Uom Volak',
  subtitleKh = 'សិរីសួស្តីអាពាហ៍ពិពាហ៍',
  subtitleEn = 'Wedding Celebration',
  guestName = 'លោក ស្រី មករា',
  language = 'kh',
  isOpening = false,
  onOpenInvitation,
  isAdmin = false,
  savedGuestsList = [],
  onSelectFromDropbox,
  onOpenAddGuestModal,
  onUpdateGuestName,
  guestNameFontFamily,
  guestNameColor,
  guestNameFontSize,
}: TheapKhmerTemplate15CoverProps) {
  const [isEditingInlineGuest, setIsEditingInlineGuest] = useState(false);
  const [tempGuestInput, setTempGuestInput] = useState(guestName || '');

  const displayGuest =
    guestName && guestName !== 'Your Name'
      ? guestName.trim()
      : language === 'kh'
      ? 'លោក ស្រី មករា'
      : 'Honored Guest';

  const groomInit = getLatinInitial(groomEn, groom, 'R', false);
  const brideInit = getLatinInitial(brideEn, bride, 'V', true);

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempGuestInput.trim() && onUpdateGuestName) {
      onUpdateGuestName(tempGuestInput.trim());
    }
    setIsEditingInlineGuest(false);
  };

  return (
    <div
      className="relative isolate w-full h-full min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center overflow-hidden select-none px-5 sm:px-8 pt-24 sm:pt-28 pb-9 sm:pb-11"
      style={{
        backgroundColor: '#fcfaf5',
        color: '#8f6c2e',
      }}
    >
      {/* Classical Floral Arch & Ionic Columns Wallpaper */}
      <img
        src="/assets/template15/opening-background.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover object-center"
      />

      {/* Hanging White Floral Garlands at Arch Apex */}
      <img
        src="/assets/template15/hanging-flowers.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute top-0 inset-x-0 z-[2] w-full max-h-44 object-cover object-top select-none"
      />

      {/* 1. Header Banner Title + Golden Scrollwork Divider */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
        className="relative z-[10] flex flex-col items-center w-full mt-2"
      >
        <h1
          className="text-2xl sm:text-[28px] font-bold tracking-wide leading-[1.65] px-2"
          style={{
            fontFamily:
              language === 'kh'
                ? "'AKbalthom Kbach', 'AKbalthom-Kbach', 'Moulpali', 'Moul', serif"
                : "'Playfair Display', Georgia, serif",
            color: '#9c732d',
            textShadow: '0 1px 2px rgba(255,255,255,0.95)',
          }}
        >
          {language === 'kh' ? subtitleKh || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍' : subtitleEn || 'Wedding Celebration'}
        </h1>

        <TheapKhmerDivider className="w-48 sm:w-56 h-auto mt-1" />
      </motion.header>

      {/* 2. Center Baroque Gold Monogram Wreath */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.16, ease: 'easeOut' }}
        className="relative z-[10] flex items-center justify-center my-2"
      >
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <img
            src="/assets/template15/monogram.webp"
            alt={`${groom} and ${bride} wedding monogram`}
            draggable={false}
            className="w-full h-full object-contain select-none drop-shadow-[0_4px_10px_rgba(148,110,44,0.2)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              fontFamily: "'Great Vibes', 'Playfair Display', Georgia, serif",
              color: '#9c732d',
              textShadow: '0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            <span className="text-[28px] sm:text-[32px] italic font-semibold -translate-y-1.5 -translate-x-0.5">
              {groomInit}
            </span>
            <span className="text-[19px] sm:text-[22px] italic font-medium mx-0.5 translate-y-0.5">
              &amp;
            </span>
            <span className="text-[28px] sm:text-[32px] italic font-semibold translate-y-1.5 translate-x-0.5">
              {brideInit}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Invited Guest Section */}
      <motion.section
        aria-label="Invited guest"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24, ease: 'easeOut' }}
        className="relative z-[10] w-full flex flex-col items-center gap-1.5 my-1"
      >
        {isAdmin && savedGuestsList.length > 0 && onSelectFromDropbox && (
          <div className="w-full max-w-[240px] relative mb-1">
            <select
              id="guest-dropbox-select-t15"
              value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
              onChange={(e) => onSelectFromDropbox(e.target.value)}
              style={{ color: '#8f6c2e', borderColor: '#c9a45c' }}
              className="w-full px-3 py-1 pr-7 rounded-full bg-white/90 border text-xs font-khmer focus:outline-none cursor-pointer shadow-xs appearance-none"
            >
              <option value="" disabled>
                {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវ...' : '▼ Select Guest...'}
              </option>
              {savedGuestsList.map((g, idx) => (
                <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className="bg-white text-neutral-800">
                  {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                </option>
              ))}
              <option value="__ADD_NEW__" className="font-bold">
                + {language === 'kh' ? 'បន្ថែមឈ្មោះភ្ញៀវថ្មី...' : 'Add New Custom Guest...'}
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9c732d]" />
          </div>
        )}

        <p
          className="text-base sm:text-lg font-bold tracking-wide"
          style={{
            fontFamily: language === 'kh' ? "'Moulpali', 'Moul', serif" : "'Playfair Display', Georgia, serif",
            color: '#9c732d',
            textShadow: '0 1px 2px rgba(255,255,255,0.95)',
          }}
        >
          {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
        </p>

        {isEditingInlineGuest ? (
          <form
            onSubmit={handleSaveInline}
            className="p-2 rounded-2xl bg-white/95 border border-[#c9a45c] shadow-md flex items-center gap-1.5"
          >
            <input
              type="text"
              value={tempGuestInput}
              onChange={(e) => setTempGuestInput(e.target.value)}
              autoFocus
              placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
              className="px-2.5 py-1 text-xs border rounded-lg border-[#c9a45c] font-moul text-center text-[#7c5a1e] focus:outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#9c732d] text-white rounded-lg text-xs font-bold cursor-pointer hover:opacity-90"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingInlineGuest(false)}
              className="px-2 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs cursor-pointer hover:bg-stone-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <h2
            onClick={() => {
              if (!isAdmin) return;
              if (onOpenAddGuestModal) {
                onOpenAddGuestModal();
              } else {
                setTempGuestInput(displayGuest);
                setIsEditingInlineGuest(true);
              }
            }}
            title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បីបន្ថែម ឬកែឈ្មោះភ្ញៀវ' : 'Click to add or edit guest') : undefined}
            className={`text-lg sm:text-xl font-bold tracking-wide px-4 ${
              isAdmin ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
            }`}
            style={{
              fontFamily: guestNameFontFamily || "'Moul', 'Moulpali', 'Noto Serif Khmer', serif",
              color:
                guestNameColor && guestNameColor !== '#364153'
                  ? guestNameColor
                  : '#9c732d',
              fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
              textShadow: '0 1px 2px rgba(255,255,255,0.95)',
              lineHeight: 1.7,
            }}
          >
            {displayGuest}
          </h2>
        )}

        <TheapKhmerDivider className="w-44 sm:w-52 h-auto mt-1" />
      </motion.section>

      {/* 4. Framed Gold Open Invitation Button */}
      {onOpenInvitation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
          className="relative z-[10] flex flex-col items-center mt-1"
        >
          <button
            type="button"
            onClick={onOpenInvitation}
            disabled={isOpening}
            className="group relative inline-flex items-center justify-center w-52 sm:w-56 h-14 sm:h-16 cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70"
          >
            <img
              src="/assets/template15/button-frame.webp"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain select-none drop-shadow-[0_4px_12px_rgba(148,110,44,0.22)]"
            />
            <span
              className="relative z-10 text-xs sm:text-sm font-bold tracking-wide"
              style={{
                fontFamily: language === 'kh' ? "'Moulpali', 'Noto Serif Khmer', serif" : "'Playfair Display', Georgia, serif",
                color: '#8f6c2e',
              }}
            >
              {isOpening
                ? language === 'kh'
                  ? 'កំពុងបើក...'
                  : 'Opening...'
                : language === 'kh'
                ? 'បើកលិខិតអញ្ជើញ'
                : 'Open Invitation'}
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

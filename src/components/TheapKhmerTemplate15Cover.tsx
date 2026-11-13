import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Check, X } from 'lucide-react';
import {
  KhmerCardLuxuryFrameLayer,
  KhmerTopLotusGarland,
  KhmerDiamondDivider,
  KhmerRoyalGoldMedallion,
  KhmerKbachGuestCartouche,
  KhmerRoyalActionOpenButton,
} from './KhmerInvitationOrnaments';
import { extractKhmerMonogramInitials } from '../utils/khmerEnvelopeStyles';

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
}: {
  className?: string;
  inverted?: boolean;
}) {
  return <KhmerDiamondDivider className={className || 'w-48 sm:w-56 h-5'} accentColor="#8B2435" />;
}

export default function TheapKhmerTemplate15Cover({
  groom = 'ជា ដារ៉ា',
  bride = 'សុខ បុប្ផា',
  groomEn,
  brideEn,
  subtitleKh = 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
  subtitleEn = 'ROYAL KHMER WEDDING',
  guestName = 'ភ្ញៀវកិត្តិយស',
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
      ? 'ភ្ញៀវកិត្តិយស'
      : 'Honored Guest';

  const { groomInitial, brideInitial } = extractKhmerMonogramInitials(groom, bride, 'ម', 'វ');

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempGuestInput.trim() && onUpdateGuestName) {
      onUpdateGuestName(tempGuestInput.trim());
    }
    setIsEditingInlineGuest(false);
  };

  const coupleDisplay =
    language === 'kh'
      ? `${groom || 'កូនកម្លោះ'}  &  ${bride || 'កូនក្រមុំ'}`
      : `${groomEn || groom || 'Groom'}  &  ${brideEn || bride || 'Bride'}`;

  return (
    <div
      className="relative isolate w-full h-full min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center overflow-hidden select-none px-5 sm:px-8 pt-12 sm:pt-14 pb-7 sm:pb-9"
      style={{
        background: 'radial-gradient(ellipse at 50% 34%, #FFFDF8 0%, #FFF8E9 56%, #F6EBD4 100%)',
        color: '#593B22',
      }}
    >
      {/* Subtle heritage cream parchment backdrop artwork */}
      <img
        src="/assets/template15/opening-background.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover opacity-[0.22] mix-blend-multiply"
      />

      {/* Double Metallic Gold Borders & Cambodian Kbach Corners + Dotted Paper Pattern */}
      <KhmerCardLuxuryFrameLayer accentColor="#8B2435" />

      {/* Top Cambodian Lotus & Jasmine Garland Arch */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        className="pointer-events-none absolute top-3 sm:top-4 inset-x-4 z-[4]"
      >
        <KhmerTopLotusGarland accentColor="#8B2435" />
      </motion.div>

      {/* 1. Header Hierarchy: Royal Title & English Subtitle & Diamond Separator */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
        className="relative z-[10] flex flex-col items-center mt-5 sm:mt-6 w-full"
      >
        <h1
          className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-wide leading-[1.6] px-2"
          style={{
            fontFamily: language === 'kh' ? "'Moulpali', 'Moul', serif" : "'Playfair Display', Georgia, serif",
            color: '#8B2435',
            textShadow: '0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {language === 'kh' ? subtitleKh || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍' : subtitleEn || 'ROYAL KHMER WEDDING'}
        </h1>

        <span
          className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase mt-0.5"
          style={{
            color: '#8B6842',
            fontFamily: language === 'kh' ? "'Playfair Display', Georgia, serif" : "'Moulpali', serif",
          }}
        >
          {language === 'kh' ? subtitleEn || 'ROYAL KHMER WEDDING' : subtitleKh || 'សិរីសួស្តីអាពាហ៍ពិពាហ៍'}
        </span>

        <KhmerDiamondDivider className="w-44 sm:w-56 h-5 mt-2" accentColor="#8B2435" />
      </motion.header>

      {/* 2. Center Gold Wax Medallion with Burgundy Ribbon + Couple Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.22, ease: 'easeOut' }}
        className="relative z-[10] flex flex-col items-center my-2 sm:my-3"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <KhmerRoyalGoldMedallion
            leftInitial={groomInitial}
            rightInitial={brideInitial}
            ribbonColor="#8B2435"
            showRibbon={true}
            className="w-32 h-36 sm:w-36 sm:h-40"
          />
        </motion.div>

        <p
          className="mt-1 text-base sm:text-lg font-bold tracking-wide px-3"
          style={{
            fontFamily: language === 'kh' ? "'Moul', 'Moulpali', serif" : "'Playfair Display', serif",
            color: '#593B22',
            lineHeight: '1.7',
          }}
        >
          {coupleDisplay}
        </p>
      </motion.div>

      {/* 3. Honored Guest Plaque & Admin Selection */}
      <motion.section
        aria-label="Invited guest"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.35, ease: 'easeOut' }}
        className="relative z-[10] w-full flex flex-col items-center gap-2 my-1"
      >
        {isAdmin && savedGuestsList.length > 0 && onSelectFromDropbox && (
          <div className="w-full max-w-[260px] relative">
            <select
              id="guest-dropbox-select-t15"
              value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
              onChange={(e) => onSelectFromDropbox(e.target.value)}
              style={{ color: '#593B22', borderColor: '#D9A441' }}
              className="w-full px-3 py-1.5 pr-7 rounded-full bg-[#FFFDF8] border text-xs font-khmer focus:outline-none cursor-pointer shadow-xs appearance-none"
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
            <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B6842]" />
          </div>
        )}

        {isEditingInlineGuest ? (
          <form
            onSubmit={handleSaveInline}
            className="p-2 rounded-2xl bg-[#FFFDF8] border border-[#D9A441] shadow-md flex items-center gap-1.5"
          >
            <input
              type="text"
              value={tempGuestInput}
              onChange={(e) => setTempGuestInput(e.target.value)}
              autoFocus
              placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
              className="px-2.5 py-1 text-xs border rounded-lg border-[#E8BD65] font-moul text-center text-[#593B22] focus:outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#8B2435] text-white rounded-lg text-xs font-bold cursor-pointer hover:opacity-90"
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
          <KhmerKbachGuestCartouche
            invitedLabel={language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
            guestName={displayGuest}
            accentColor="#8B2435"
            guestFontFamily={guestNameFontFamily}
            guestColor={guestNameColor}
            guestFontSize={guestNameFontSize}
            isAdmin={isAdmin}
            onClick={() => {
              if (isAdmin) {
                if (onOpenAddGuestModal) {
                  onOpenAddGuestModal();
                } else {
                  setTempGuestInput(displayGuest);
                  setIsEditingInlineGuest(true);
                }
              }
            }}
            title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បីបន្ថែម ឬកែឈ្មោះភ្ញៀវ' : 'Click to add or edit guest') : undefined}
          />
        )}
      </motion.section>

      {/* 4. Interactive Gold-Foil Khmer Open Invitation Button */}
      {onOpenInvitation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45, ease: 'easeOut' }}
          className="relative z-[10] pt-3 flex flex-col items-center"
        >
          <KhmerRoyalActionOpenButton
            label={
              isOpening
                ? language === 'kh'
                  ? 'កំពុងបើក...'
                  : 'Opening...'
                : language === 'kh'
                ? 'បើកលិខិតអញ្ជើញ'
                : 'Open Invitation'
            }
            sublabel={language === 'kh' ? 'OPEN INVITATION' : 'បើកលិខិតអញ្ជើញ'}
            onOpen={onOpenInvitation}
            isOpening={isOpening}
            accentColor="#8B2435"
          />
        </motion.div>
      )}
    </div>
  );
}


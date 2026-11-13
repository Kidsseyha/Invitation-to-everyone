import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  X,
  User,
  ChevronDown,
  Home,
  ChevronsRight,
  Gift,
  MapPin,
} from 'lucide-react';
import { Language } from '../types';
import { getSavedGuests, GuestPreset } from '../data/guests';
import {
  KhmerRoyalModernWeddingCover,
} from './KhmerRoyalOrnament';
import TheapKhmerTemplate15Cover from './TheapKhmerTemplate15Cover';
import {
  KhmerCardLuxuryFrameLayer,
  KhmerTopLotusGarland,
  KhmerDiamondDivider,
  KhmerRoyalGoldMedallion,
  KhmerCeremonyCrest,
  KhmerKbachGuestCartouche,
  KhmerRoyalActionOpenButton,
} from './KhmerInvitationOrnaments';
import {
  resolveKhmerEnvelopeVariant,
  extractKhmerMonogramInitials,
  formatKhmerCoverDateBadge,
  sanitizeCoverBackgroundUrl,
} from '../utils/khmerEnvelopeStyles';

interface EnvelopeModalProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  onUpdateGuestName?: (newName: string) => void;
  onOpenAddGuestModal?: () => void;
  groom: string;
  bride: string;
  groomEn?: string;
  brideEn?: string;
  singlePerson?: boolean;
  id?: string;
  eventType?: string;
  name?: string;
  language: Language;
  isAdmin?: boolean;
  coverBackground?: string;
  primaryColor?: string;
  textColor?: string;
  envelopeFrame?: string;
  envelopeHeaderImage?: string;
  onUpdateEnvelopeHeaderImage?: (url: string) => void;
  mainTitleKh?: string;
  mainTitleEn?: string;
  coverSubtitleKh?: string;
  coverSubtitleEn?: string;
  invitationSubtitleKh?: string;
  invitationSubtitleEn?: string;
  invitationTitleKh?: string;
  invitationTitleEn?: string;
  coverEnNameColor?: string;
  coverEnFontFamily?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  titleTextShape?: 'straight' | 'arch-up' | 'arch-down' | 'wave';
  guestNameColor?: string;
  guestNameFontFamily?: string;
  guestNameFontSize?: string;
  envelopeThemeColor?: string;
  guestFrameStyle?: string;
  onOpenDesignTab?: () => void;
  onToggleLanguage?: () => void;
  theme?: ThemeMode;
}

import { compressImageFile } from '../utils/imageCompressor';

// Compress image via canvas to prevent database quota errors
function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.68): Promise<string> {
  return compressImageFile(file, { maxWidth, maxHeight, quality });
}

export default function EnvelopeModal({
  isOpen,
  onOpen,
  guestName,
  onUpdateGuestName,
  onOpenAddGuestModal,
  groom,
  bride,
  groomEn,
  brideEn,
  singlePerson,
  id,
  eventType,
  name,
  language,
  isAdmin = false,
  coverBackground,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  envelopeFrame,
  envelopeHeaderImage,
  onUpdateEnvelopeHeaderImage,
  mainTitleKh,
  mainTitleEn,
  coverSubtitleKh,
  coverSubtitleEn,
  invitationSubtitleKh,
  invitationSubtitleEn,
  invitationTitleKh,
  invitationTitleEn,
  coverEnNameColor,
  coverEnFontFamily,
  eventDate,
  eventTime,
  eventLocation,
  titleTextShape,
  guestNameColor = '#364153',
  guestNameFontFamily,
  guestNameFontSize,
  envelopeThemeColor,
  guestFrameStyle,
  onOpenDesignTab,
  onToggleLanguage,
  theme = 'dark',
}: EnvelopeModalProps) {
  const khmerPalette = resolveKhmerEnvelopeVariant({ eventType, id, name });
  const [isOpening, setIsOpening] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [savedGuestsList, setSavedGuestsList] = useState<GuestPreset[]>([]);
  const [currentGuestInfo, setCurrentGuestInfo] = useState<GuestPreset | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isWaxFlapOpen, setIsWaxFlapOpen] = useState(false);
  const [isGiftSurpriseOpen, setIsGiftSurpriseOpen] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const handleGiftClick = () => {
    setIsGiftSurpriseOpen(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: khmerPalette.confettiColors,
      });
    } catch {}
    setTimeout(() => {
      setIsGiftSurpriseOpen(false);
    }, 4000);
  };

  const isAnniversary = khmerPalette.styleId === 'anniversary';
  const isBirthday = khmerPalette.styleId === 'birthday';
  const isEngagement = khmerPalette.styleId === 'engagement';
  const isHousewarming = khmerPalette.styleId === 'housewarming';
  const isModernWedding = khmerPalette.styleId === 'modern-wedding';
  const isTraditionalWedding = khmerPalette.styleId === 'traditional-wedding';
  const isWeddingStyle = isTraditionalWedding || isModernWedding;

  // Directly pull from ចំណងជើងធំ (Main Title) first, then coverSubtitleKh, with contextual Khmer fallbacks
  let subtitleKh = mainTitleKh?.trim() || coverSubtitleKh?.trim();
  if (!subtitleKh || (isBirthday && (subtitleKh === 'សូមគោរពអញ្ជើញ' || subtitleKh === 'សិរីសួស្តី អាពាហ៍ពិពាហ៍' || subtitleKh === 'រីករាយថ្ងៃកំណើត'))) {
    subtitleKh = khmerPalette.subtitleDefaultKh;
  }

  if (subtitleKh === 'រីករាយថ្ងៃកំណើត') {
    subtitleKh = 'រីករាយពិធីខួបកំណើត';
  }

  const subtitleEn = mainTitleEn?.trim() || coverSubtitleEn?.trim() || khmerPalette.subtitleDefaultEn;

  const ribbonLabel = language === 'kh'
    ? (isBirthday || isHousewarming
        ? (invitationSubtitleKh?.trim() || invitationTitleKh?.trim() || (isBirthday ? 'សូមគោរពអញ្ជើញចូលរួមពិធីខួបកំណើត' : 'សូមគោរពអញ្ជើញចូលរួមពិធីឡើងគេហដ្ឋានថ្មី'))
        : (invitationSubtitleKh?.trim() || 'សូមគោរពអញ្ជើញ'))
    : (isBirthday || isHousewarming
        ? (invitationSubtitleEn?.trim() || invitationTitleEn?.trim() || (isBirthday ? 'Cordially Invited to Birthday Celebration' : 'Cordially Invited to Housewarming Blessing'))
        : (invitationSubtitleEn?.trim() || 'Cordially Invited'));

  const activeCoverBg = sanitizeCoverBackgroundUrl(
    coverBackground,
    isTraditionalWedding ? '/assets/template15/opening-background.webp' : '/assets/images/khmer_royal_gold_wedding_cover_1790393678341.jpg'
  );
  const { groomInitial, brideInitial } = extractKhmerMonogramInitials(groom, bride, 'ម', 'វ');
  const birthdayDateBadge = formatKhmerCoverDateBadge(eventDate, eventTime);

  const headerImageInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderImageClick = () => {
    if (isAdmin && onUpdateEnvelopeHeaderImage) {
      headerImageInputRef.current?.click();
    }
  };

  const handleHeaderImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onUpdateEnvelopeHeaderImage) {
      try {
        const compressedBase64 = await compressImage(files[0]);
        onUpdateEnvelopeHeaderImage(compressedBase64);
      } catch (err) {
        console.error('Error uploading envelope header image:', err);
      }
    }
  };

  const handleResetHeaderImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (onUpdateEnvelopeHeaderImage) {
      onUpdateEnvelopeHeaderImage('none');
    }
  };

  useEffect(() => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio) {
      setIsPlayingMusic(!audio.paused);
      const handlePlay = () => setIsPlayingMusic(true);
      const handlePause = () => setIsPlayingMusic(false);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [isOpen]);

  const toggleMusicPlay = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    } else {
      audio.pause();
      setIsPlayingMusic(false);
    }
  };

  useEffect(() => {
    setTempGuestName(guestName);
    const guests = getSavedGuests();
    setSavedGuestsList(guests);
    const match = guests.find(g => g.name.toLowerCase() === (guestName || '').toLowerCase());
    setCurrentGuestInfo(match || null);
  }, [guestName, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const triggerAutoPlayMusic = () => {
    try {
      const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
      if (audio) {
        audio.muted = false;
        audio.currentTime = audio.currentTime || 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlayingMusic(true);
            })
            .catch(err => {
              console.warn('Direct audio play error:', err);
            });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSelectFromDropbox = (selectedName: string) => {
    if (!selectedName) return;
    if (selectedName === '__ADD_NEW__') {
      if (onOpenAddGuestModal) {
        onOpenAddGuestModal();
      } else {
        setIsEditingGuest(true);
      }
      return;
    }

    if (onUpdateGuestName) {
      onUpdateGuestName(selectedName);
    }
    const match = savedGuestsList.find(g => g.name === selectedName);
    setCurrentGuestInfo(match || null);
    setTempGuestName(selectedName);
  };

  const handleOpenInvitation = () => {
    // Auto-play music when clicking open invitation button
    triggerAutoPlayMusic();
    setIsOpening(true);

    // Trigger golden celebratory confetti burst
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#f5b80f', '#d97706', '#fbbf24', '#fef3c7', '#f43f5e', '#ffffff'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 800);
  };

  const handleSaveGuestName = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = tempGuestName.trim();
    if (trimmed) {
      if (onUpdateGuestName) {
        onUpdateGuestName(trimmed);
      }
    }
    setIsEditingGuest(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-40 overflow-y-auto scroll-smooth touch-auto transition-colors duration-500"
          style={{
            background:
              theme === 'light'
                ? 'radial-gradient(circle at 50% 35%, #FFFDF8 0%, #F7ECD6 52%, #EAD8B5 100%)'
                : 'radial-gradient(circle at 50% 35%, #231A0F 0%, #16100A 55%, #0D0905 100%)',
          }}
        >
          {/* Blurred Champagne Ambient Wallpaper */}
          <div
            className="fixed inset-0 z-0 bg-cover bg-center filter blur-[14px] pointer-events-none scale-110 transition-all duration-700"
            style={{
              backgroundImage: `url(${activeCoverBg})`,
              opacity: theme === 'light' ? 0.22 : 0.16,
            }}
          />

          {/* Soft Warm Bokeh Lighting & Floating Gold Particles */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full blur-[120px] opacity-35"
              style={{ background: 'radial-gradient(circle, rgba(245,184,46,0.4) 0%, rgba(217,164,65,0) 70%)' }}
            />
            <div
              className="absolute bottom-[10%] left-[20%] w-[360px] h-[360px] rounded-full blur-[110px] opacity-25"
              style={{ background: 'radial-gradient(circle, rgba(139,36,53,0.22) 0%, transparent 72%)' }}
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(#F5B82E 1px, transparent 1px)',
                backgroundSize: '34px 34px',
              }}
            />
          </div>

          <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 py-6 sm:py-8 relative z-10">
            {/* Envelope Card Outer Gold Halo Rim */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={
                isOpening
                  ? { scale: [1, 1.04, 0.94], y: -50, opacity: [1, 1, 0] }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{
                duration: isOpening ? 0.75 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-[395px] sm:max-w-[445px] md:max-w-[480px] mx-auto my-auto rounded-[32px] p-[2px] transition-shadow duration-500"
              style={{
                background: 'linear-gradient(155deg, #FFF3CC 0%, #E8BD65 35%, #D9A441 70%, #9C6F21 100%)',
                boxShadow:
                  theme === 'light'
                    ? '0 24px 60px rgba(89, 59, 34, 0.2), 0 0 38px rgba(217, 164, 65, 0.25)'
                    : '0 28px 75px rgba(0, 0, 0, 0.72), 0 0 42px rgba(217, 164, 65, 0.22)',
              }}
            >
              {/* Luxury Khmer Ivory Invitation Card Body */}
              <div
                className="relative rounded-[30px] overflow-hidden min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center transition-all duration-300"
                style={{
                  background: 'linear-gradient(168deg, #FFFDF7 0%, #FFF8E9 55%, #F6EAD2 100%)',
                  color: '#593B22',
                }}
              >
                {/* Card-Specific Actions (Edit / Envelope Flap) positioned cleanly inside inner gold rim */}
                {((isAnniversary && isWaxFlapOpen) || (isAdmin && onOpenDesignTab)) && (
                  <div className="flex absolute top-5 right-5 z-30 items-center gap-1.5">
                    {isAnniversary && isWaxFlapOpen && (
                      <button
                        type="button"
                        onClick={() => setIsWaxFlapOpen(false)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(255, 251, 240, 0.94)',
                          borderColor: 'rgba(217, 164, 65, 0.7)',
                          color: '#8B2435',
                        }}
                        title={language === 'kh' ? 'មើលគម្របស្រោមសំបុត្រ' : 'View Wax Flap'}
                      >
                        <span>✉️ {language === 'kh' ? 'ស្រោម' : 'Flap'}</span>
                      </button>
                    )}
                    {isAdmin && onOpenDesignTab && (
                      <button
                        type="button"
                        onClick={onOpenDesignTab}
                        className="px-2.5 py-1 rounded-full text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(255, 251, 240, 0.94)',
                          borderColor: 'rgba(217, 164, 65, 0.7)',
                          color: '#593B22',
                        }}
                        title={language === 'kh' ? 'កែការរចនាសំបុត្រ' : 'Customize Design'}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0"
                          style={{ backgroundColor: envelopeThemeColor || khmerPalette.accentColor }}
                        />
                        <span>{language === 'kh' ? 'កែ' : 'Edit'}</span>
                      </button>
                    )}
                  </div>
                )}

                {isAnniversary ? (
                  /* 1. KHMER ROYAL ANNIVERSARY STYLE */
                  <div className="relative w-full h-full min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center px-5 sm:px-8 pt-12 sm:pt-14 pb-7 sm:pb-9 overflow-hidden">
                    <KhmerCardLuxuryFrameLayer accentColor="#8B2435" />

                    <div className="pointer-events-none absolute top-3 sm:top-4 inset-x-4 z-[4]">
                      <KhmerTopLotusGarland accentColor="#8B2435" />
                    </div>

                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.1 }}
                      className="relative z-20 mt-5 sm:mt-6 flex flex-col items-center w-full"
                    >
                      <h1
                        className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-wide leading-[1.6] px-2"
                        style={{
                          fontFamily: language === 'kh' ? "'Moulpali', 'Moul', serif" : "'Playfair Display', Georgia, serif",
                          color: '#8B2435',
                        }}
                      >
                        {language === 'kh' ? (subtitleKh || 'រីករាយខួបអាពាហ៍ពិពាហ៍') : (subtitleEn || 'HAPPY ANNIVERSARY')}
                      </h1>
                      <span
                        className="text-[11px] sm:text-xs tracking-[0.26em] uppercase font-semibold mt-0.5"
                        style={{
                          color: '#8B6842',
                          fontFamily: language === 'kh' ? "'Playfair Display', Georgia, serif" : "'Moulpali', serif",
                        }}
                      >
                        {language === 'kh' ? (subtitleEn || 'HAPPY ANNIVERSARY') : (subtitleKh || 'រីករាយខួបអាពាហ៍ពិពាហ៍')}
                      </span>
                      <KhmerDiamondDivider className="w-44 sm:w-56 h-5 mt-2" accentColor="#8B2435" />
                    </motion.div>

                    {/* Center Medallion & Couple Names */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative z-20 flex flex-col items-center my-2 sm:my-3"
                    >
                      <KhmerRoyalGoldMedallion
                        leftInitial={groomInitial}
                        rightInitial={brideInitial}
                        ribbonColor="#8B2435"
                        showRibbon={true}
                        className="w-32 h-36 sm:w-36 sm:h-40"
                      />
                      <p
                        className="mt-1 font-bold text-[20px] leading-[40px] tracking-wide"
                        style={{
                          fontFamily: "'Moul', 'Moulpali', serif",
                          color: '#593B22',
                        }}
                      >
                        {groom || 'ជា ដារ៉ា'} &amp; {bride || 'សុខ បុប្ផា'}
                      </p>
                      {(groomEn || brideEn) && (
                        <p
                          className="text-base sm:text-lg font-medium tracking-wider"
                          style={{ fontFamily: "'Great Vibes', 'Norican', cursive", color: '#8B2435' }}
                        >
                          {groomEn || groom} &amp; {brideEn || bride}
                        </p>
                      )}
                    </motion.div>

                    {/* Honored Guest Plaque */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.3 }}
                      className="relative z-20 w-full flex flex-col items-center gap-2 my-1"
                    >
                      {!isEditingGuest ? (
                        <div className="w-full flex flex-col items-center gap-2">
                          {isAdmin && savedGuestsList.length > 0 && (
                            <div className="w-full max-w-[260px] relative">
                              <select
                                id="guest-dropbox-select"
                                value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
                                onChange={(e) => handleSelectFromDropbox(e.target.value)}
                                style={{ color: '#593B22', borderColor: '#D9A441' }}
                                className="w-full px-3 py-1.5 pr-7 rounded-full bg-[#FFFDF8] border text-xs font-khmer focus:outline-none appearance-none cursor-pointer shadow-xs"
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

                          <KhmerKbachGuestCartouche
                            invitedLabel={language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                            guestName={
                              guestName && guestName !== 'Your Name'
                                ? guestName
                                : language === 'kh'
                                ? 'ភ្ញៀវកិត្តិយស'
                                : 'Honored Guest'
                            }
                            accentColor="#8B2435"
                            guestFontFamily={guestNameFontFamily}
                            guestColor={guestNameColor}
                            guestFontSize={guestNameFontSize}
                            isAdmin={isAdmin}
                            onClick={() => {
                              if (!isAdmin) return;
                              if (onOpenAddGuestModal) {
                                onOpenAddGuestModal();
                              } else {
                                setTempGuestName(guestName);
                                setIsEditingGuest(true);
                              }
                            }}
                            title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បីបន្ថែម ឬកែឈ្មោះភ្ញៀវ' : 'Click to Add Guest or edit name') : undefined}
                          />
                        </div>
                      ) : (
                        <form
                          onSubmit={handleSaveGuestName}
                          className="space-y-2 py-2.5 px-4 rounded-2xl bg-[#FFFDF8] border border-[#D9A441] max-w-sm mx-auto shadow-md"
                        >
                          <div className="flex items-center justify-between text-xs font-khmer font-semibold text-[#8B2435]">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស' : 'Enter Guest Name'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingGuest(false)}
                              className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
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
                              style={{ color: '#593B22', borderColor: '#D9A441' }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border font-moul text-sm text-center focus:outline-none"
                              placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវ...' : 'Guest name...'}
                            />
                            <button
                              id="save-guest-name-btn"
                              type="submit"
                              style={{ backgroundColor: '#8B2435' }}
                              className="px-3.5 py-1.5 rounded-lg text-white font-moul text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer hover:opacity-90"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'kh' ? 'យល់ព្រម' : 'Save'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>

                    {/* Open Action */}
                    <div className="relative z-20 pt-3 flex flex-col items-center">
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
                        onOpen={handleOpenInvitation}
                        isOpening={isOpening}
                        accentColor="#8B2435"
                      />
                    </div>

                    {/* Interactive Khmer Wax Seal Envelope Flap Overlay */}
                    <AnimatePresence>
                      {!isWaxFlapOpen && (
                        <motion.div
                          id="theapkhmer-opening-screen1"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.55 } }}
                          className="absolute inset-0 z-40 flex flex-col items-center justify-between px-5 sm:px-8 pt-12 sm:pt-14 pb-7 sm:pb-9 rounded-[30px] overflow-hidden select-none cursor-pointer"
                          style={{
                            background: 'radial-gradient(ellipse at 50% 35%, #FFFDF8 0%, #FFF8E9 55%, #F2E3C6 100%)',
                          }}
                          onClick={() => {
                            try {
                              confetti({
                                particleCount: 95,
                                spread: 75,
                                origin: { y: 0.58 },
                                colors: khmerPalette.confettiColors,
                              });
                            } catch {}
                            triggerAutoPlayMusic();
                            setIsWaxFlapOpen(true);
                          }}
                        >
                          <KhmerCardLuxuryFrameLayer accentColor="#8B2435" />
                          <div className="pointer-events-none absolute top-3 sm:top-4 inset-x-4 z-[4]">
                            <KhmerTopLotusGarland accentColor="#8B2435" />
                          </div>

                          {/* Header */}
                          <div className="relative z-20 mt-5 sm:mt-6 flex flex-col items-center w-full">
                            <h2
                              className="text-xl sm:text-2xl font-bold tracking-wide leading-[1.6]"
                              style={{
                                fontFamily: language === 'kh' ? "'Moulpali', 'Moul', serif" : "'Playfair Display', serif",
                                color: '#8B2435',
                              }}
                            >
                              {language === 'kh' ? (subtitleKh || 'រីករាយខួបអាពាហ៍ពិពាហ៍') : (subtitleEn || 'HAPPY ANNIVERSARY')}
                            </h2>
                            <span
                              className="text-[11px] sm:text-xs tracking-[0.26em] uppercase font-semibold mt-0.5"
                              style={{ color: '#8B6842' }}
                            >
                              {language === 'kh' ? (subtitleEn || 'HAPPY ANNIVERSARY') : (subtitleKh || 'រីករាយខួបអាពាហ៍ពិពាហ៍')}
                            </span>
                            <KhmerDiamondDivider className="w-44 sm:w-56 h-5 mt-2" accentColor="#8B2435" />
                          </div>

                          {/* Centerpiece Gold Wax Seal */}
                          <div className="relative z-20 flex flex-col items-center my-2">
                            <div className="transition-transform duration-300 hover:scale-105">
                              <KhmerRoyalGoldMedallion
                                leftInitial={groomInitial}
                                rightInitial={brideInitial}
                                ribbonColor="#8B2435"
                                showRibbon={true}
                                className="w-32 h-36 sm:w-36 sm:h-40"
                              />
                            </div>
                            <p
                              className="mt-1 text-base sm:text-lg font-bold tracking-wide"
                              style={{ fontFamily: "'Moul', serif", color: '#593B22', lineHeight: '1.65' }}
                            >
                              {groom || 'ជា ដារ៉ា'} &amp; {bride || 'សុខ បុប្ផា'}
                            </p>
                            {(groomEn || brideEn) && (
                              <p
                                className="text-base sm:text-lg font-medium tracking-wider"
                                style={{ fontFamily: "'Great Vibes', 'Norican', cursive", color: '#8B2435' }}
                              >
                                {groomEn || groom} &amp; {brideEn || bride}
                              </p>
                            )}
                          </div>

                          {/* Honored Guest Plaque on Front Cover */}
                          <div className="relative z-20 w-full flex flex-col items-center my-1">
                            <KhmerKbachGuestCartouche
                              invitedLabel={language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                              guestName={
                                guestName && guestName !== 'Your Name'
                                  ? guestName
                                  : language === 'kh'
                                  ? 'ភ្ញៀវកិត្តិយស'
                                  : 'Honored Guest'
                              }
                              accentColor="#8B2435"
                              guestFontFamily={guestNameFontFamily}
                              guestColor={guestNameColor}
                              guestFontSize={guestNameFontSize}
                            />
                          </div>

                          {/* Tap to Unfold CTA */}
                          <div className="relative z-20 flex flex-col items-center gap-2 pt-2">
                            <div
                              className="px-7 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                              style={{
                                background: 'linear-gradient(135deg, #FFF7DC 0%, #F5B82E 55%, #C68D2C 100%)',
                                border: '1.5px solid #E8BD65',
                                color: '#472B14',
                              }}
                            >
                              <Sparkles className="w-4 h-4" style={{ color: '#8B2435' }} />
                              <span
                                className="text-xs sm:text-sm font-bold tracking-wide"
                                style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                              >
                                {language === 'kh' ? 'សូមចុចបើកសំបុត្រ' : 'TAP TO OPEN'}
                              </span>
                            </div>
                            <span className="text-[11px] font-khmer" style={{ color: '#8B6842' }}>
                              {language === 'kh' ? '• ប៉ះលើត្រាមាសដើម្បីបើកធៀប •' : '• Touch Wax Seal to Unfold Invitation •'}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : isWeddingStyle ? (
                  isModernWedding ? (
                    <div className="relative z-20 w-full h-full flex flex-col justify-between items-center">
                      <KhmerRoyalModernWeddingCover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                        titleShape={titleTextShape}
                        language={language}
                        onOpenInvitation={handleOpenInvitation}
                        isOpening={isOpening}
                        isAdmin={isAdmin}
                        savedGuestsList={savedGuestsList}
                        onSelectFromDropbox={handleSelectFromDropbox}
                        onOpenAddGuestModal={onOpenAddGuestModal}
                        onUpdateGuestName={onUpdateGuestName}
                      />
                    </div>
                  ) : (
                    <div className="relative z-20 w-full h-full flex flex-col justify-between items-center">
                      <TheapKhmerTemplate15Cover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        subtitleEn={subtitleEn}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'លោក ស្រី មករា' : 'Honored Guest')}
                        language={language}
                        onOpenInvitation={handleOpenInvitation}
                        isOpening={isOpening}
                        isAdmin={isAdmin}
                        savedGuestsList={savedGuestsList}
                        onSelectFromDropbox={handleSelectFromDropbox}
                        onOpenAddGuestModal={onOpenAddGuestModal}
                        onUpdateGuestName={onUpdateGuestName}
                        guestNameFontFamily={guestNameFontFamily}
                        guestNameColor={guestNameColor}
                        guestNameFontSize={guestNameFontSize}
                      />
                    </div>
                  )
                ) : isBirthday ? (
                  /* 4. KHMER AUSPICIOUS ROYAL BIRTHDAY INVITATION */
                  <div
                    className="relative z-10 w-full h-full min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center px-5 sm:px-7 pt-12 sm:pt-14 pb-7 sm:pb-8 overflow-hidden select-none"
                    style={{
                      background: 'linear-gradient(168deg, #FFFDF7 0%, #FFF7E4 55%, #F2E4C8 100%)',
                      color: '#593B22',
                    }}
                  >
                    <KhmerCardLuxuryFrameLayer accentColor="#115E46" />

                    {/* Header with Khmer Auspicious Lotus Crest */}
                    <div className="relative z-10 flex flex-col items-center mt-1 w-full">
                      <KhmerCeremonyCrest variant="birthday" accentColor="#115E46" className="w-16 h-16 sm:w-20 sm:h-20 mb-1" />

                      <h1
                        className="text-xl sm:text-2xl font-bold tracking-wide leading-[1.6]"
                        style={{
                          fontFamily: language === 'kh' ? "'Moul', 'Moulpali', serif" : "'Playfair Display', serif",
                          color: '#115E46',
                        }}
                      >
                        {language === 'kh' ? (subtitleKh || 'រីករាយពិធីខួបកំណើត') : (subtitleEn || 'HAPPY BIRTHDAY')}
                      </h1>
                      <span
                        className="text-[11px] font-semibold tracking-[0.26em] uppercase"
                        style={{ color: '#9C6F21' }}
                      >
                        {language === 'kh' ? (subtitleEn || 'CELEBRATING LIFE & JOY') : (subtitleKh || 'រីករាយពិធីខួបកំណើត')}
                      </span>

                      <KhmerDiamondDivider className="w-40 sm:w-52 h-4 mt-1.5" accentColor="#115E46" />
                    </div>

                    {/* Celebrant Name, Circular Royal Gold Cameo & Centered Gift Blessing Pill */}
                    <div className="relative z-20 flex flex-col items-center my-1">
                      {(singlePerson ? groom : (groom || bride)) && (
                        <span
                          className="text-lg sm:text-xl font-bold tracking-wide"
                          style={{
                            fontFamily: "'Moul', 'Khmer OS Bokor', serif",
                            color: '#593B22',
                            lineHeight: '1.6',
                          }}
                        >
                          {singlePerson ? groom : (groom || bride)}
                        </span>
                      )}
                      <span
                        className="text-lg sm:text-xl font-medium tracking-wide"
                        style={{
                          fontFamily: "'Great Vibes', 'Dancing Script', cursive",
                          color: '#8B2435',
                        }}
                      >
                        {(singlePerson ? (groomEn || groom) : (groomEn || groom)) || 'Samara'}
                      </span>

                      <div
                        className="mt-2 p-1.5 rounded-full shadow-md"
                        style={{
                          background: 'linear-gradient(135deg, #FFF7D6 0%, #F5B82E 55%, #C68D2C 100%)',
                          border: '1.5px solid #E8BD65',
                        }}
                      >
                        <div className="p-0.5 rounded-full border border-[#115E46]/45 bg-[#FFFDF8]">
                          <img
                            src="/assets/images/real_birthday_cake.jpg"
                            alt="Birthday Celebration Cake"
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full"
                          />
                        </div>
                      </div>

                      {/* Centered Interactive Blessing Gift Pill */}
                      <div className="relative mt-2">
                        <button
                          type="button"
                          onClick={handleGiftClick}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-khmer font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border"
                          style={{
                            backgroundColor: 'rgba(255, 251, 240, 0.96)',
                            borderColor: 'rgba(217, 164, 65, 0.8)',
                            color: '#115E46',
                          }}
                        >
                          <Gift className="w-3.5 h-3.5" style={{ color: '#D9A441' }} />
                          <span>{language === 'kh' ? 'ផ្ញើកាដូពរជ័យ' : 'Send Birthday Blessing'}</span>
                        </button>

                        <AnimatePresence>
                          {isGiftSurpriseOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.92 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.92 }}
                              className="absolute top-9 left-1/2 -translate-x-1/2 z-40 w-56 p-3 rounded-2xl text-xs shadow-xl text-center border"
                              style={{
                                backgroundColor: '#FFFDF8',
                                borderColor: '#D9A441',
                                color: '#593B22',
                              }}
                            >
                              <div className="font-bold mb-1" style={{ color: '#115E46' }}>
                                ✨ {language === 'kh' ? 'រីករាយថ្ងៃខួបកំណើត!' : 'Happy Birthday!'}
                              </div>
                              <p className="text-[11px] leading-relaxed" style={{ color: '#593B22' }}>
                                {language === 'kh'
                                  ? 'សូមជូនពរសុខភាពល្អ សិរីសួស្តី និងជោគជ័យគ្រប់ភារកិច្ច!'
                                  : 'Wishing you abundant joy, health, and success!'}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Khmer & English Date / Time / Location Plaque */}
                    <div
                      className="relative z-10 w-full max-w-[310px] sm:max-w-[345px] px-3.5 py-2 rounded-2xl shadow-xs"
                      style={{
                        backgroundColor: 'rgba(255, 252, 244, 0.9)',
                        border: '1px solid rgba(217, 164, 65, 0.65)',
                      }}
                    >
                      <div className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#9C6F21' }}>
                        {language === 'kh' ? `ខែ${birthdayDateBadge.monthKh} • ${birthdayDateBadge.monthEn}` : birthdayDateBadge.monthEn}
                      </div>

                      <div
                        className="my-1 py-1 flex items-center justify-between px-2 border-y"
                        style={{ borderColor: 'rgba(217, 164, 65, 0.35)' }}
                      >
                        <span className="text-xs font-bold" style={{ color: '#593B22' }}>
                          {language === 'kh' ? birthdayDateBadge.weekdayKh : birthdayDateBadge.weekdayEn}
                        </span>
                        <span
                          className="text-2xl sm:text-3xl font-extrabold px-2 leading-none"
                          style={{ color: '#115E46', fontFamily: language === 'kh' ? "'Moul', serif" : "'Playfair Display', serif" }}
                        >
                          {language === 'kh' ? birthdayDateBadge.dayKh : birthdayDateBadge.dayEn}
                        </span>
                        <span className="text-xs font-bold" style={{ color: '#593B22' }}>
                          {birthdayDateBadge.timeDisplay}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                        className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold cursor-pointer hover:opacity-80"
                        style={{ color: '#8B2435' }}
                      >
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: '#D9A441' }} />
                        <span className="truncate max-w-[220px]">
                          {eventLocation || 'សួនមនោរម្យ (កោះពេជ្រ)'}
                        </span>
                        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${isLocationExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isLocationExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2 mt-1.5 border-t text-center"
                            style={{ borderColor: 'rgba(217, 164, 65, 0.3)' }}
                          >
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                eventLocation || 'Koh Pich Phnom Penh'
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-xs"
                              style={{ backgroundColor: '#115E46' }}
                            >
                              <MapPin className="w-3 h-3" style={{ color: '#F5B82E' }} />
                              <span>{language === 'kh' ? 'បើកផែនទី Google Maps' : 'Open Google Maps'}</span>
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Guest Cartouche & Dropdown */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-1.5 my-1">
                      {isAdmin && savedGuestsList.length > 0 && (
                        <div className="w-full max-w-[260px] relative">
                          <select
                            id="guest-database-dropbox-select"
                            value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
                            onChange={(e) => handleSelectFromDropbox(e.target.value)}
                            style={{ color: '#593B22', borderColor: '#D9A441' }}
                            className="w-full px-3 py-1 pr-7 rounded-full bg-[#FFFDF8] border text-xs font-khmer focus:outline-none cursor-pointer appearance-none shadow-xs"
                          >
                            <option value="" disabled>
                              {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវ...' : '▼ Select Guest...'}
                            </option>
                            {savedGuestsList.map((g, idx) => (
                              <option key={g.id ? `${g.id}-${idx}` : `db-guest-${idx}`} value={g.name} className="bg-white text-neutral-800">
                                {g.name} {g.categoryLabelKh ? `(${language === 'kh' ? g.categoryLabelKh : (g.categoryLabelEn || g.categoryLabelKh)})` : ''}
                              </option>
                            ))}
                            <option value="__ADD_NEW__" className="font-bold">
                              + {language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី...' : '+ Add New Guest...'}
                            </option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B6842]" />
                        </div>
                      )}

                      <KhmerKbachGuestCartouche
                        invitedLabel={ribbonLabel || (language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited')}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                        accentColor="#115E46"
                        guestFontFamily={guestNameFontFamily}
                        guestColor={guestNameColor}
                        guestFontSize={guestNameFontSize}
                        isAdmin={isAdmin}
                        onClick={() => {
                          if (isAdmin && onOpenAddGuestModal) onOpenAddGuestModal();
                        }}
                      />
                    </div>

                    {/* Birthday Open CTA */}
                    <div className="relative z-10 pt-1">
                      <KhmerRoyalActionOpenButton
                        label={
                          isOpening
                            ? language === 'kh'
                              ? 'កំពុងបើក...'
                              : 'Opening...'
                            : language === 'kh'
                            ? 'បើកធៀបខួបកំណើត'
                            : 'Open Birthday Card'
                        }
                        sublabel={language === 'kh' ? 'OPEN INVITATION' : 'បើកលិខិតអញ្ជើញ'}
                        onOpen={handleOpenInvitation}
                        isOpening={isOpening}
                        accentColor="#115E46"
                      />
                    </div>
                  </div>
                ) : (
                  /* 5. KHMER ENGAGEMENT / HOUSEWARMING / CEREMONIAL INVITATION */
                  <div
                    className="relative w-full h-full min-h-[620px] sm:min-h-[680px] md:min-h-[720px] flex flex-col justify-between items-center text-center px-5 sm:px-8 pt-12 sm:pt-14 pb-7 sm:pb-9 overflow-hidden"
                    style={{
                      background: 'linear-gradient(168deg, #FFFDF7 0%, #FFF8E9 55%, #F6EAD2 100%)',
                      color: '#593B22',
                    }}
                  >
                    <KhmerCardLuxuryFrameLayer accentColor={isHousewarming ? '#115E46' : '#8B2435'} />

                    <div className="pointer-events-none absolute top-3 sm:top-4 inset-x-4 z-[4]">
                      <KhmerTopLotusGarland accentColor={isHousewarming ? '#115E46' : '#8B2435'} />
                    </div>

                    {/* Top Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.1 }}
                      className="flex flex-col items-center relative z-10 mt-5 sm:mt-6 w-full"
                    >
                      <h1
                        className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-wide leading-[1.6] px-2"
                        style={{
                          fontFamily: language === 'kh' ? "'Moul', 'Moulpali', serif" : "'Playfair Display', Georgia, serif",
                          color: isHousewarming ? '#115E46' : '#8B2435',
                        }}
                      >
                        {language === 'kh' ? subtitleKh : subtitleEn}
                      </h1>

                      <span
                        className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase mt-0.5"
                        style={{
                          color: '#8B6842',
                          fontFamily: language === 'kh' ? "'Playfair Display', Georgia, serif" : "'Moulpali', serif",
                        }}
                      >
                        {language === 'kh' ? subtitleEn : subtitleKh}
                      </span>

                      <KhmerDiamondDivider
                        className="w-44 sm:w-56 h-5 mt-2"
                        accentColor={isHousewarming ? '#115E46' : '#8B2435'}
                      />
                    </motion.div>

                    {/* Center Ceremonial Emblem & Names */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.75, delay: 0.2 }}
                      className="relative z-10 flex flex-col items-center my-2"
                    >
                      <KhmerCeremonyCrest
                        variant={isHousewarming ? 'housewarming' : 'engagement'}
                        accentColor={isHousewarming ? '#115E46' : '#8B2435'}
                        className="w-24 h-24 sm:w-28 sm:h-28 mb-2"
                      />

                      <h2
                        className="text-lg sm:text-xl font-bold tracking-wide px-2"
                        style={{
                          fontFamily: "'Moul', serif",
                          color: '#593B22',
                          lineHeight: '1.7',
                        }}
                      >
                        {singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom)}
                      </h2>

                      <p
                        className="text-base sm:text-lg font-medium tracking-wider mt-0.5"
                        style={{
                          fontFamily: coverEnFontFamily || "'Great Vibes', 'Norican', cursive",
                          color: isHousewarming ? '#115E46' : '#8B2435',
                        }}
                      >
                        {singlePerson
                          ? (groomEn || groom)
                          : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || (bride ? `${groom} & ${bride}` : groom)))}
                      </p>
                    </motion.div>

                    {/* Middle Guest Plaque */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.3 }}
                      className="relative z-10 w-full flex flex-col items-center gap-2 my-1"
                    >
                      {isAdmin && savedGuestsList.length > 0 && (
                        <div className="w-full max-w-[260px] relative">
                          <select
                            id="guest-database-dropbox-select"
                            value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
                            onChange={(e) => handleSelectFromDropbox(e.target.value)}
                            style={{ color: '#593B22', borderColor: '#D9A441' }}
                            className="w-full px-3 py-1.5 pr-7 rounded-full bg-[#FFFDF8] text-xs font-khmer border shadow-xs focus:outline-none cursor-pointer appearance-none"
                          >
                            <option value="" disabled>
                              {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវ...' : '▼ Select Guest...'}
                            </option>
                            {savedGuestsList.map((g, idx) => (
                              <option key={g.id ? `${g.id}-${idx}` : `db-guest-${idx}`} value={g.name} className="bg-white text-neutral-800">
                                {g.name} {g.categoryLabelKh ? `(${language === 'kh' ? g.categoryLabelKh : (g.categoryLabelEn || g.categoryLabelKh)})` : ''}
                              </option>
                            ))}
                            <option value="__ADD_NEW__" className="font-bold">
                              + {language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី...' : '+ Add New Guest...'}
                            </option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B6842]" />
                        </div>
                      )}

                      <KhmerKbachGuestCartouche
                        invitedLabel={ribbonLabel}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                        accentColor={isHousewarming ? '#115E46' : '#8B2435'}
                        guestFontFamily={guestNameFontFamily}
                        guestColor={guestNameColor}
                        guestFontSize={guestNameFontSize}
                        isAdmin={isAdmin}
                        onClick={() => {
                          if (isAdmin && onOpenAddGuestModal) onOpenAddGuestModal();
                        }}
                      />
                    </motion.div>

                    {/* Bottom Action */}
                    <div className="relative z-10 w-full flex flex-col items-center pt-2">
                      {isHousewarming ? (
                        <div className="relative w-full max-w-[310px] sm:max-w-[335px] mx-auto select-none">
                          <div
                            id="open-invitation-btn"
                            role="button"
                            tabIndex={0}
                            aria-label={language === 'kh' ? 'អូសទៅស្តាំដើម្បីបើកធៀប' : 'Slide right to open invitation'}
                            onClick={() => {
                              if (!isOpening) handleOpenInvitation();
                            }}
                            onKeyDown={(e) => {
                              if ((e.key === 'Enter' || e.key === ' ') && !isOpening) {
                                e.preventDefault();
                                handleOpenInvitation();
                              }
                            }}
                            className="relative w-full h-14 rounded-full p-1.5 flex items-center justify-between overflow-hidden cursor-pointer shadow-lg group"
                            style={{
                              background: 'linear-gradient(90deg, #115E46 0%, #17785B 50%, #115E46 100%)',
                              border: '2px solid #E8BD65',
                            }}
                          >
                            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center pl-10 pr-6">
                              <span
                                className="text-xs sm:text-sm font-bold flex items-center gap-1.5"
                                style={{ fontFamily: "'Noto Serif Khmer', serif", color: '#FFF8E9' }}
                              >
                                <span>
                                  {isOpening
                                    ? language === 'kh'
                                      ? 'កំពុងបើក...'
                                      : 'Opening...'
                                    : language === 'kh'
                                    ? 'អូសទៅស្តាំដើម្បីបើកធៀប'
                                    : 'Slide right to open'}
                                </span>
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                  <ChevronsRight className="w-4 h-4" style={{ color: '#F5B82E' }} />
                                </motion.span>
                              </span>
                            </div>

                            <motion.div
                              drag="x"
                              dragConstraints={{ left: 0, right: 215 }}
                              dragElastic={0.12}
                              dragMomentum={false}
                              onDragEnd={(_, info) => {
                                if (info.offset.x > 100 || info.velocity.x > 220) {
                                  handleOpenInvitation();
                                }
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.96 }}
                              className="relative z-[2] w-11 h-11 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 shadow-md"
                              style={{
                                background: 'linear-gradient(135deg, #FFF7DC 0%, #F5B82E 65%, #D9A441 100%)',
                                border: '1.5px solid #FFF8E9',
                              }}
                            >
                              <Home className="w-5 h-5" style={{ color: '#472B14' }} />
                            </motion.div>

                            <div
                              className="relative z-[1] w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: 'rgba(255, 248, 233, 0.14)',
                                border: '1px solid rgba(232, 189, 101, 0.5)',
                              }}
                            >
                              <Sparkles className="w-4 h-4" style={{ color: '#F5B82E' }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <KhmerRoyalActionOpenButton
                          label={
                            isOpening
                              ? language === 'kh'
                                ? 'កំពុងបើកសំបុត្រ...'
                                : 'Opening...'
                              : language === 'kh'
                              ? 'បើកសំបុត្រអញ្ជើញ'
                              : 'Open Invitation'
                          }
                          sublabel={language === 'kh' ? 'OPEN INVITATION' : 'បើកលិខិតអញ្ជើញ'}
                          onOpen={handleOpenInvitation}
                          isOpening={isOpening}
                          accentColor="#8B2435"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

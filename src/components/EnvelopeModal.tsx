import { ThemeMode } from "./ThemeToggle";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  MailOpen,
  Edit3,
  Check,
  X,
  User,
  UserPlus,
  ChevronDown,
  Users,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  SkipForward,
  Camera,
  Trash2,
  Globe,
  Cake,
  Home,
  ChevronsRight,
  Gift,
  MapPin,
  Calendar,
  Clock,
  Star,
} from 'lucide-react';
import { Language } from '../types';
import { getSavedGuests, GuestPreset } from '../data/guests';
import RoyalGoldRibbonBanner from './RoyalGoldRibbonBanner';
import IntertwinedRibbonHearts from './IntertwinedRibbonHearts';
import RingIcon from './RingIcon';
import BeautifulButterflies from './BeautifulButterflies';
import FloatingEngagementRingsAndSparkles from './FloatingEngagementRingsAndSparkles';
import FloatingBalloonsAndGifts from './FloatingBalloonsAndGifts';
import weddingArchBg from '../assets/images/wedding_arch_bg_1790321830759.jpg';
const khmerRoyalGoldWeddingCover = '/assets/images/white_arch_columns_wedding_cover_1790394461049.jpg';
import {
  KhmerCornerKbach,
  RoyalWeddingMonogram,
  KhmerDividerKbach,
  RoyalWaxSealEmblem,
  CameoFloralWeddingEmblem,
  KhmerWeddingTitleWithBotanicalFlourish,
  HangingGarlandsOverlay,
  VintageScallopedGuestPlaque,
  KhmerRoyalGoldenGuestPlaque,
  AngkorTemplePillarsOverlay,
  RomanticRoseGardenArchOverlay,
  RoseGoldAnniversaryCalligraphy,
  RoseGoldOrnateGuestPlaque,
  TheapKhmerTemplate1WaxSeal,
  TheapKhmerBotanicalBranches,
  TheapKhmerCover1ArchOverlay,
  RoseGoldBeveledOpenButton,
  KhmerGoldenTeardropLocket,
  GoldenGlitterPlayButton,
  CircularPlayOpenButton,
  FiligreeGoldOrnamentDivider,
  FiligreeGoldCircularMonogramCrest,
  FiligreeGoldPillOpenButton,
  FiligreeGoldOvalMonogramCrest,
  ModernWeddingScallopedOpenButton,
  ModernWeddingCrystalOctagonCrest,
  ModernWeddingFullCrystalRococoFrame,
  ModernWeddingFloralCalendarCover,
  KhmerRoyalModernWeddingCover,
  ShapedTitleText,
  getKhmerInitial,
} from './KhmerRoyalOrnament';
import TheapKhmerTemplate15Cover from './TheapKhmerTemplate15Cover';
import KhmerNatureHousewarmingCover, { khmerNatureBg } from './KhmerNatureHousewarmingCover';

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
  const activeEnvelopeColor = envelopeThemeColor || '#6c2925';
  const plaqueStyle = guestFrameStyle || 'rose-gold';
  const GuestPlaqueWrapper = (plaqueStyle === 'royal-gold' || plaqueStyle === 'vintage-leaf')
    ? KhmerRoyalGoldenGuestPlaque
    : (plaqueStyle === 'vintage' || plaqueStyle === 'vintage-scallop')
    ? VintageScallopedGuestPlaque
    : RoseGoldOrnateGuestPlaque;
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
        colors: ['#2dd4bf', '#fde047', '#38bdf8', '#f43f5e', '#ffffff'],
      });
    } catch {}
    setTimeout(() => {
      setIsGiftSurpriseOpen(false);
    }, 4000);
  };

  const eventTypeLower = (eventType || '').toLowerCase();
  const idLower = (id || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  const isAnniversary = eventTypeLower === 'anniversary' || idLower.includes('anniversary') || nameLower.includes('ខួបអាពាហ៍ពិពាហ៍') || nameLower.includes('anniversary');
  const isBirthday = !isAnniversary && (eventTypeLower === 'birthday' || idLower.includes('birthday') || nameLower.includes('ខួបកំណើត') || nameLower.includes('birthday'));
  const isEngagement = eventTypeLower === 'engagement' || idLower.includes('engagement') || nameLower.includes('ភ្ជាប់ពាក្យ') || nameLower.includes('engage');
  const isHousewarming = eventTypeLower === 'housewarming' || idLower.includes('housewarming') || nameLower.includes('ឡើងផ្ទះ') || nameLower.includes('house');

  // Directly pull from ចំណងជើងធំ (Main Title) first, then coverSubtitleKh, with contextual fallbacks
  let subtitleKh = mainTitleKh?.trim() || coverSubtitleKh?.trim();
  if (!subtitleKh || (isBirthday && (subtitleKh === 'សូមគោរពអញ្ជើញ' || subtitleKh === 'សិរីសួស្តី អាពាហ៍ពិពាហ៍' || subtitleKh === 'រីករាយថ្ងៃកំណើត'))) {
    subtitleKh = isBirthday
      ? 'រីករាយពិធីខួបកំណើត'
      : isAnniversary
      ? 'ខួបអាពាហ៍ពិពាហ៍'
      : isEngagement
      ? 'ពិធីភ្ជាប់ពាក្យ'
      : isHousewarming
      ? 'ពិធីឡើងគេហដ្ឋានថ្មី'
      : 'សិរីសួស្តី អាពាហ៍ពិពាហ៍';
  }

  if (subtitleKh === 'រីករាយថ្ងៃកំណើត') {
    subtitleKh = 'រីករាយពិធីខួបកំណើត';
  }

  const subtitleEn = mainTitleEn?.trim() || coverSubtitleEn?.trim() || (isBirthday
    ? 'HAPPY BIRTHDAY INVITATION'
    : isAnniversary
    ? 'WEDDING ANNIVERSARY INVITATION'
    : isEngagement
    ? 'ENGAGEMENT INVITATION'
    : isHousewarming
    ? 'HOUSEWARMING INVITATION'
    : 'ROYAL WEDDING INVITATION');

  const isWeddingStyle = !isBirthday && !isEngagement && !isHousewarming;
  const isModernWedding = isWeddingStyle && (idLower.includes('modern') || nameLower.includes('សម័យ') || nameLower.includes('modern'));
  const isTraditionalWedding = isWeddingStyle && !isModernWedding;

  // Information label / subtitle customized from Design (ការរចនា)
  const ribbonLabel = language === 'kh'
    ? (isBirthday || isHousewarming
        ? (invitationSubtitleKh?.trim() || invitationTitleKh?.trim() || (isBirthday ? 'សូមគោរពអញ្ជើញចូលរួមពិធីខួបកំណើត' : 'សូមគោរពអញ្ជើញចូលរួមពិធីឡើងគេហដ្ឋានថ្មី'))
        : (invitationSubtitleKh?.trim() || 'សូមគោរពអញ្ជើញ'))
    : (isBirthday || isHousewarming
        ? (invitationSubtitleEn?.trim() || invitationTitleEn?.trim() || (isBirthday ? 'Cordially Invited to Birthday Party' : 'Cordially Invited to Housewarming Blessing'))
        : (invitationSubtitleEn?.trim() || 'Cordially Invited'));

  const activeCoverBg = isAnniversary
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') ? coverBackground : 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop')
    : isHousewarming
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') && !coverBackground.includes('white_arch_columns') ? coverBackground : khmerNatureBg)
    : isEngagement
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') && !coverBackground.includes('white_arch_columns') ? coverBackground : '/assets/aistudio/image_6e49a03a.png')
    : isWeddingStyle
    ? (coverBackground && !coverBackground.includes('free-background') && !coverBackground.includes('default') ? coverBackground : (isModernWedding ? 'https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/free-background.jpg' : '/assets/template15/opening-background.webp'))
    : (coverBackground || khmerRoyalGoldWeddingCover);

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
          className={`fixed inset-0 z-40 overflow-y-auto scroll-smooth touch-auto ${
            isTraditionalWedding
              ? 'bg-[#e9e4dc]'
              : isHousewarming || isEngagement
              ? (theme === 'light'
                  ? 'bg-gradient-to-b from-[#edf3e8] via-[#f7f4e9] to-[#e1ebda]'
                  : 'bg-gradient-to-b from-[#04140e] via-[#09241b] to-[#030f0a]')
              : isBirthday
              ? 'bg-gradient-to-b from-[#021317] via-[#06232b] to-[#010b0e]'
              : theme === 'light'
              ? 'bg-gradient-to-b from-white via-amber-50 to-white'
              : theme === 'gray'
              ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950'
              : 'bg-gradient-to-b from-black via-black to-black'
          }`}
        >
          {/* Subtle Background Image Wallpaper with Blur */}
          {!isBirthday && (
            <div
              className={`fixed inset-0 z-0 bg-cover bg-center ${theme === 'light' ? 'opacity-35' : 'opacity-45'} filter blur-[8px] pointer-events-none scale-110 transition-all duration-700`}
              style={{ backgroundImage: `url(${activeCoverBg})` }}
            />
          )}

          {/* Luxury Midnight Teal & Gold Ambient Glow for Birthday */}
          {isBirthday && (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0d9488]/25 via-[#2dd4bf]/20 to-[#fde047]/10 blur-[120px]" />
              <div className="absolute bottom-10 left-1/3 w-[380px] h-[380px] rounded-full bg-[#14b8a6]/15 blur-[100px]" />
              <div className="absolute -top-20 right-10 w-[300px] h-[300px] rounded-full bg-[#fde047]/10 blur-[90px]" />
            </div>
          )}

          {/* Subtle Golden Particles Background */}
          <div className={`fixed inset-0 z-0 ${isBirthday ? 'opacity-30' : theme === 'light' ? 'opacity-10' : 'opacity-20'} pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:28px_28px]`} />

          <div
            className={`min-h-screen w-full flex flex-col items-center justify-center relative z-10 ${
              isHousewarming
                ? `px-3 sm:px-6 md:px-8 pt-[92px] pb-5 sm:py-8 ${
                    theme === 'light'
                      ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(232,191,84,0.16),transparent_65%)]'
                      : 'bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.14),transparent_68%)]'
                  }`
                : 'p-3 sm:p-6 md:p-8 py-5 sm:py-8'
            }`}
          >
            {/* Envelope Card Container */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={
                isOpening
                  ? { scale: [1, 1.04, 0.94], y: -50, opacity: [1, 1, 0] }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{
                duration: isOpening ? 0.75 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative w-full ${isBirthday ? 'max-w-[360px] sm:max-w-[395px] md:max-w-[425px]' : 'max-w-sm sm:max-w-md md:max-w-lg'} mx-auto my-auto rounded-[32px] p-0.5 transition-shadow duration-500 ${
                isBirthday
                  ? 'bg-gradient-to-b from-[#2dd4bf]/50 via-[#fde047]/35 to-[#0d9488]/60 shadow-[0_25px_60px_rgba(1,14,18,0.9),0_0_40px_rgba(45,212,191,0.2)]'
                  : isHousewarming
                  ? (theme === 'light'
                      ? 'bg-gradient-to-b from-[#d4af37]/75 via-[#2e6f52]/55 to-[#8a5a10]/75 shadow-[0_24px_60px_rgba(16,59,42,0.22),0_0_32px_rgba(212,175,55,0.18)]'
                      : 'bg-gradient-to-b from-[#f4cb5c]/75 via-[#156045]/75 to-[#9a6d16]/80 shadow-[0_28px_70px_rgba(2,14,10,0.85),0_0_40px_rgba(244,203,92,0.18)]')
                  : isAnniversary
                  ? 'bg-gradient-to-b from-[#fce7f3] via-[#ffffff] to-[#fbcfe8] shadow-[0_25px_60px_rgba(159,18,57,0.22)]'
                  : isWeddingStyle
                  ? (isModernWedding
                      ? 'bg-gradient-to-b from-[#fef9c3]/70 via-[#fde047]/50 to-[#d97706]/60 shadow-[0_20px_50px_rgba(30,58,138,0.2)]'
                      : 'bg-gradient-to-b from-[#e5dfd5] via-[#dcd5c9] to-[#bfb39f] shadow-[0_0_42px_rgba(91,76,54,0.18)]')
                  : theme === 'light'
                  ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-[0_20px_60px_rgba(245,184,15,0.25),0_8px_25px_rgba(0,0,0,0.08)]'
                  : 'bg-gradient-to-b from-amber-300/80 via-amber-500/60 to-amber-900/80 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(245,184,15,0.2)]'
              }`}
            >
              {/* Modern Invitation Card Body */}
              <div
                className={`relative rounded-[30px] overflow-hidden min-h-[580px] sm:min-h-[660px] md:min-h-[720px] flex flex-col justify-between items-center text-center border backdrop-blur-xl transition-all duration-300 ${
                  isBirthday
                    ? 'p-0 border-[#2dd4bf]/40 shadow-[0_20px_50px_rgba(1,14,18,0.85),inset_0_1px_3px_rgba(255,255,255,0.25)] bg-gradient-to-b from-[#051f26]/95 via-[#082d36]/90 to-[#021317]/98'
                    : isHousewarming || isEngagement
                    ? (theme === 'light'
                        ? 'p-0 border-[#c9972c]/50 shadow-[0_18px_45px_rgba(16,59,42,0.16)] bg-[#f8f5eb]'
                        : 'p-0 border-[#f4cb5c]/45 shadow-[0_20px_55px_rgba(2,14,10,0.8)] bg-[#071e16]')
                    : isAnniversary
                    ? 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-[#fbcfe8] shadow-[0_15px_45px_rgba(159,18,57,0.18)] bg-gradient-to-b from-[#fff5f7]/90 via-[#fdf2f8]/80 to-[#ffe4e6]/95'
                    : isWeddingStyle
                    ? (isModernWedding
                        ? 'p-0 border-[#d4af37]/60 shadow-[0_15px_45px_rgba(30,58,138,0.18)] bg-[#fbfcf9]'
                        : 'p-0 border-[#ad8b55]/30 shadow-[0_0_42px_rgba(91,76,54,0.14)] bg-[#faf7f2]')
                    : theme === 'light'
                    ? 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-amber-300/70 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_10px_35px_rgba(245,184,15,0.2)]'
                    : 'py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 border-amber-400/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_45px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Crisp Cover Background Layer Inside Envelope Card */}
                {!isWeddingStyle && !isBirthday && !isHousewarming && (
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
                    style={{ backgroundImage: `url(${activeCoverBg})` }}
                  />
                )}

                {isModernWedding && (
                  <>
                    {/* Golden Border Overlays (Matching Screenshot 1) */}
                    <div className="absolute inset-3 border-[1.5px] border-[#d4af37]/50 rounded-[22px] pointer-events-none z-10" />
                    <div className="absolute inset-4 border border-[#d4af37]/30 rounded-[20px] pointer-events-none z-10" />

                    {/* Corner Flourishes */}
                    <div className="absolute top-4 left-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="top-left" className="w-full h-full" />
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="top-right" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-4 left-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="bottom-left" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 text-[#d4af37]/80 pointer-events-none z-10">
                      <KhmerCornerKbach position="bottom-right" className="w-full h-full" />
                    </div>

                    {/* Floating Peonies with Gold Outlines on Left, Right and Top */}
                    <div className="absolute bottom-0 right-0 w-44 sm:w-56 h-44 sm:h-56 opacity-85 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-right.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute bottom-12 left-0 w-36 sm:w-48 h-36 sm:h-48 opacity-80 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute top-16 right-0 w-36 sm:w-44 h-36 sm:h-44 opacity-75 pointer-events-none z-10 select-none">
                      <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-top-right.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  </>
                )}

                {isAnniversary ? (
                  <>
                    {/* Subtle Romantic Golden & Rose Ambient Warm Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-200/30 via-pink-100/15 to-rose-300/30 pointer-events-none" />

                    {/* Top Right Floating Controls */}
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                      {isWaxFlapOpen && (
                        <button
                          type="button"
                          onClick={() => setIsWaxFlapOpen(false)}
                          className="px-2 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-khmer font-bold flex items-center gap-1 shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                          title="មើលស្រោមសំបុត្រ (View Envelope Cover)"
                        >
                          <span>✉️ ស្រោម</span>
                        </button>
                      )}
                      {isAdmin && onOpenDesignTab && (
                        <button
                          type="button"
                          onClick={onOpenDesignTab}
                          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-xs font-khmer font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                          title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-white shadow-xs shrink-0"
                            style={{ backgroundColor: activeEnvelopeColor || '#881337' }}
                          />
                          <span>{language === 'kh' ? 'កែការរចនា' : 'Design'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                          if (audio) {
                            audio.currentTime = 0;
                            audio.play().catch(() => {});
                            setIsPlayingMusic(true);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                        title="Replay / Restart Music"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={toggleMusicPlay}
                        className="w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-95 border cursor-pointer text-[#881337] border-[#881337]/30"
                        title={isPlayingMusic ? 'Mute' : 'Play'}
                      >
                        {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Grand Roman Ionic Colonnade Arch with Hanging Cherry Blossoms & Rose Mounds */}
                    <RomanticRoseGardenArchOverlay />

                    {/* TOP HEADER: Traditional Flourish Wings & Title */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="relative z-20 pt-7 sm:pt-9 flex flex-col items-center justify-center w-full px-4"
                    >
                      <div className="flex items-center justify-center gap-2 max-w-full">
                        {/* Left Traditional Flourish Wing */}
                        <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-8 h-5 text-[#881337] shrink-0">
                          <path d="M34 12 C 24 12, 16 6, 8 10 C 2 13, 4 22, 10 18 C 14 15, 12 10, 4 10" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                          <circle cx="6" cy="10" r="1.5" fill="#881337" />
                        </svg>

                        <h1
                          className="text-base sm:text-lg md:text-xl font-moulpali font-bold tracking-wider text-center"
                          style={{
                            fontFamily: language === 'kh' ? "'Moulpali', serif" : "'Playfair Display', serif",
                            color: '#881337',
                            textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 2px 8px rgba(136,19,55,0.2)',
                          }}
                        >
                          {language === 'kh' ? (subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍') : subtitleEn}
                        </h1>

                        {/* Right Traditional Flourish Wing */}
                        <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-8 h-5 text-[#881337] shrink-0 scale-x-[-1]">
                          <path d="M34 12 C 24 12, 16 6, 8 10 C 2 13, 4 22, 10 18 C 14 15, 12 10, 4 10" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                          <circle cx="6" cy="10" r="1.5" fill="#881337" />
                        </svg>
                      </div>

                      <div className="flex flex-col items-center mt-0.5">
                        <span
                          className="font-norican text-lg sm:text-xl md:text-2xl tracking-wide capitalize select-none"
                          style={{
                            color: '#881337',
                            fontFamily: language === 'kh' ? "'Norican', 'Great Vibes', cursive" : "'Moul', serif",
                            textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                          }}
                        >
                          {language === 'kh' ? subtitleEn : (subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍')}
                        </span>
                        <div className="w-28 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-[#881337]/60 to-transparent -mt-0.5" />
                      </div>
                    </motion.div>

                    {/* CENTER COUPLE SECTION: 3D Calligraphy */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.85, delay: 0.25 }}
                      className="relative z-20 my-auto py-2"
                    >
                      <RoseGoldAnniversaryCalligraphy groom={groom} bride={bride} />
                    </motion.div>

                    {/* GUEST SECTION */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35 }}
                      className="relative z-20 w-full flex flex-col items-center my-2 sm:my-3 px-4"
                    >
                      <span
                        style={{ color: '#881337', fontFamily: "'Noto Sans Khmer', sans-serif" }}
                        className="block text-sm sm:text-base md:text-lg font-bold mb-2 tracking-wider drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]"
                      >
                        {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                      </span>

                      {!isEditingGuest ? (
                        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
                          {isAdmin && (
                            <div className="max-w-xs mx-auto mb-2 w-full">
                              <div className="relative">
                                <select
                                  id="guest-dropbox-select"
                                  value={savedGuestsList.some(g => g.name === guestName) ? guestName : ''}
                                  onChange={e => handleSelectFromDropbox(e.target.value)}
                                  style={{ color: '#881337', borderColor: '#88133740' }}
                                  className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-white/95 border text-xs font-khmer focus:outline-none appearance-none cursor-pointer transition-all shadow-sm"
                                >
                                  <option value="" disabled>
                                    {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពី Drop box...' : '▼ Select Guest from Drop box...'}
                                  </option>
                                  {savedGuestsList.map((g, idx) => (
                                    <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className="bg-white text-neutral-800 py-1">
                                      {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                                    </option>
                                  ))}
                                  <option value="__ADD_NEW__" className="bg-rose-100 text-rose-950 font-bold">
                                    + {language === 'kh' ? 'Add ភ្ញៀវថ្មី / បន្ថែមឈ្មោះ...' : 'Add New Custom Guest...'}
                                  </option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#881337]" />
                              </div>
                            </div>
                          )}

                          <GuestPlaqueWrapper
                            accentColor="#881337"
                            className={`${isAdmin ? 'cursor-pointer group/name' : ''} hover:scale-[1.02] transition-transform duration-300`}
                          >
                            <div
                              onClick={() => {
                                if (!isAdmin) return;
                                if (onOpenAddGuestModal) {
                                  onOpenAddGuestModal();
                                } else {
                                  setTempGuestName(guestName);
                                  setIsEditingGuest(true);
                                }
                              }}
                              className="flex items-center justify-center text-center w-full px-2"
                              title={isAdmin ? (language === 'kh' ? 'ចុចដើម្បី Add ភ្ញៀវ ឬកែប្រែឈ្មោះ' : 'Click to Add Guest or edit name') : undefined}
                            >
                              <span
                                style={{
                                  fontFamily: guestNameFontFamily || "'Moul', serif",
                                  color: '#881337',
                                  fontSize: guestNameFontSize ? `${guestNameFontSize}px` : undefined,
                                }}
                                className="font-moul text-sm sm:text-base md:text-lg tracking-wide max-w-[240px] sm:max-w-[300px] text-[#881337] drop-shadow-xs leading-relaxed text-center"
                              >
                                {guestName && guestName !== 'Your Name'
                                  ? guestName
                                  : language === 'kh'
                                  ? 'លោក ពិសិដ្ឋ សក្កា និង កញ្ញា ផែ រក្សា'
                                  : 'Honored Guest'}
                              </span>
                            </div>
                          </GuestPlaqueWrapper>
                        </div>
                      ) : (
                        <form onSubmit={handleSaveGuestName} className="space-y-2 py-2 px-4 rounded-2xl bg-white/95 border border-[#881337]/40 max-w-sm mx-auto shadow-md">
                          <div className="flex items-center justify-between text-xs font-khmer font-semibold text-[#881337]">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស' : 'Enter Guest Name'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingGuest(false)}
                              className="p-1 text-neutral-500 hover:text-neutral-900 rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              id="guest-name-input"
                              type="text"
                              value={tempGuestName}
                              onChange={e => setTempGuestName(e.target.value)}
                              autoFocus
                              style={{ color: '#881337', borderColor: '#88133740' }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border font-moul text-sm text-center focus:outline-none"
                              placeholder={language === 'kh' ? 'ឈ្មោះភ្ញៀវ...' : 'Guest name...'}
                            />
                            <button
                              id="save-guest-name-btn"
                              type="submit"
                              style={{ backgroundColor: '#881337' }}
                              className="px-3.5 py-1.5 rounded-lg text-white font-moul text-xs font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer hover:opacity-90"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'kh' ? 'យល់ព្រម' : 'Save'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>

                    {/* BOTTOM: Rose Gold Beveled Action Button: សូមចុចបើកធៀប / Open Invitation */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.45 }}
                      className="relative z-20 w-full flex flex-col items-center pb-2 px-4"
                    >
                      <RoseGoldBeveledOpenButton
                        onOpen={handleOpenInvitation}
                        isOpening={isOpening}
                        labelKh={language === 'kh' ? 'សូមចុចបើកធៀប' : 'Open Invitation'}
                      />
                    </motion.div>

                    {/* ========================================================= */}
                    {/* THEAP KHMER TEMPLATE 1 - BI-FOLD WAX SEAL FLAP OVERLAY     */}
                    {/* (Matching theapkhmer.com/template1/opening-screen1)       */}
                    {/* ========================================================= */}
                    <AnimatePresence>
                      {!isWaxFlapOpen && (
                        isModernWedding ? (
                          <motion.div
                            id="modern-wedding-envelope-flap"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.6 } }}
                            className="absolute inset-0 z-40 flex flex-col items-center justify-between p-6 sm:p-8 rounded-[30px] overflow-hidden select-none cursor-pointer"
                            style={{
                              background: 'linear-gradient(145deg, #f5eae6 0%, #ebd9d4 50%, #e1c8c2 100%)',
                              boxShadow: 'inset 0 0 50px rgba(136, 19, 55, 0.12)',
                            }}
                            onClick={() => {
                              try {
                                confetti({
                                  particleCount: 120,
                                  spread: 80,
                                  origin: { y: 0.6 },
                                  colors: ['#fb7185', '#f43f5e', '#d4af37', '#fef3c7', '#ffffff'],
                                });
                              } catch {}
                              triggerAutoPlayMusic();
                              setIsWaxFlapOpen(true);
                            }}
                          >
                            {/* Decorative Hanging Crystals & Gold Flourish in Top Corners (Screenshot 2) */}
                            <div className="absolute top-0 left-0 w-36 h-36 opacity-90 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/corner-crystals-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <div className="absolute top-0 right-0 w-36 h-36 opacity-90 pointer-events-none z-10 scale-x-[-1]">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/corner-crystals-left.png" className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>

                            {/* Bottom Corner Magnificent Quartz Crystals & Flowers (Screenshot 2) */}
                            <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 opacity-95 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-left.png" className="absolute bottom-0 left-0 w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
                              {/* Sparkling Crystal Overlay */}
                              <div className="absolute bottom-2 left-2 w-24 h-24 bg-gradient-to-tr from-pink-300/40 via-purple-300/20 to-white/40 blur-md rounded-full mix-blend-screen animate-pulse" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 sm:w-48 h-40 sm:h-48 opacity-95 pointer-events-none z-10">
                              <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-right.png" className="absolute bottom-0 right-0 w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
                              {/* Sparkling Crystal Overlay */}
                              <div className="absolute bottom-2 right-2 w-24 h-24 bg-gradient-to-tr from-pink-300/40 via-purple-300/20 to-white/40 blur-md rounded-full mix-blend-screen animate-pulse" />
                            </div>

                            {/* Elegant Lace Triangular Flap Line Overlay (Screenshot 2) */}
                            <svg className="absolute top-0 inset-x-0 w-full h-[55%] text-[#ebd9d4] pointer-events-none z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]" viewBox="0 0 320 180" preserveAspectRatio="none">
                              {/* Flap Body */}
                              <path d="M 0 0 L 320 0 L 320 20 L 160 162 L 0 20 Z" fill="#ebd9d4" />
                              {/* Flap Gold Rim */}
                              <path d="M 0 18 L 160 160 L 320 18" stroke="#d4af37" strokeWidth="2.2" fill="none" opacity="0.85" />
                              {/* White Lace Border Motif along Flap Edge */}
                              <path d="M 0 18 L 160 160 L 320 18" stroke="#ffffff" strokeWidth="6" strokeDasharray="3 4" fill="none" opacity="0.9" />
                            </svg>

                            {/* Center Rose Gold & Crystal Wax Seal (Screenshot 2) */}
                            <div className="relative z-30 flex flex-col items-center my-auto pt-44 sm:pt-48">
                              {/* Ambient Halo */}
                              <div className="absolute inset-0 -m-8 rounded-full bg-pink-400/20 blur-2xl animate-pulse pointer-events-none" />

                              {/* Rose Gold Filigree Seal Frame */}
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-[0_12px_36px_rgba(136,19,55,0.45)] border-4 border-[#e1c8c2] bg-gradient-to-br from-[#fbcfe8] via-[#e1cdc8] to-[#f472b6]">
                                {/* Glass Shimmer */}
                                <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/40 pointer-events-none" />
                                
                                {/* Gold Beveled Ring */}
                                <div className="absolute inset-2 rounded-full border border-[#d4af37]/60" />

                                {/* Hanging Diamond Crystal at Flap Seal Bottom (Screenshot 2) */}
                                <div className="absolute -bottom-6 w-3 h-8 flex flex-col items-center animate-bounce">
                                  <div className="w-[1.5px] h-3 bg-[#d4af37]" />
                                  <div className="w-2.5 h-4 bg-gradient-to-b from-purple-200 to-pink-400 rotate-45 border border-white/60 shadow-md" />
                                </div>

                                {/* Initials: e.g. T & D / D & B */}
                                <div className="relative z-10 flex items-center justify-center font-serif text-rose-950 font-bold tracking-tight">
                                  <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl sm:text-3xl text-rose-900 drop-shadow-sm transform -translate-x-0.5 -translate-y-0.5">
                                    {getKhmerInitial(groom) || 'D'}
                                  </span>
                                  <span className="text-xs text-[#b8860b] mx-0.5 opacity-80">&</span>
                                  <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl sm:text-3xl text-rose-900 drop-shadow-sm transform translate-x-0.5 translate-y-0.5">
                                    {getKhmerInitial(bride) || 'B'}
                                  </span>
                                </div>
                              </div>

                              {/* TAP TO OPEN Prompt */}
                              <div className="mt-8 flex flex-col items-center gap-1.5">
                                <span className="font-serif text-xs sm:text-sm tracking-[0.3em] text-rose-900 uppercase font-black animate-pulse drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
                                  {language === 'kh' ? 'សូមចុចបើកសំបុត្រ' : 'TAP TO OPEN'}
                                </span>
                                <span className="text-[10px] font-khmer text-rose-950/70 uppercase tracking-widest">
                                  {language === 'kh' ? '• ចុចលើត្រាកម្រងផ្កាដើម្បីបើកធៀប •' : '• Click Crystal Wax Seal to Open •'}
                                </span>
                              </div>
                            </div>

                            {/* Empty bottom space to keep wax seal centered */}
                            <div className="h-6" />
                          </motion.div>
                        ) : (
                          <motion.div
                            id="theapkhmer-opening-screen1"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.6 } }}
                            className="absolute inset-0 z-40 flex flex-col items-center justify-between p-5 sm:p-7 rounded-[30px] overflow-hidden select-none cursor-pointer"
                            style={{
                              background: 'radial-gradient(ellipse at 50% 25%, #fffdfa 0%, #fbf8f0 42%, #f5eee0 75%, #eae0cc 100%)',
                              boxShadow: 'inset 0 0 60px rgba(180, 110, 25, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.9), 0 20px 45px rgba(0, 0, 0, 0.2)',
                            }}
                            onClick={() => {
                              // Celebrate opening with confetti and music
                              try {
                                confetti({
                                  particleCount: 85,
                                  spread: 75,
                                  origin: { y: 0.58 },
                                  colors: ['#f5b80f', '#fbbf24', '#d97706', '#fef3c7', '#ffffff', '#881337'],
                                });
                              } catch {
                                // ignore
                              }
                              triggerAutoPlayMusic();
                              setIsWaxFlapOpen(true);
                            }}
                          >
                            {/* Delicate Golden Botanical Foliage Vines in Background */}
                            <TheapKhmerBotanicalBranches />

                            {/* Subtle Linen / Handcrafted Cotton Paper Grain Texture */}
                            <div
                              className="absolute inset-0 opacity-20 pointer-events-none"
                              style={{
                                backgroundImage: `radial-gradient(#b45309 0.75px, transparent 0.75px)`,
                                backgroundSize: '14px 14px',
                              }}
                            />

                            {/* Royal Center Silk Ribbon Band (Physical Portfolio Fold Effect) */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 bg-gradient-to-r from-amber-600/8 via-amber-500/18 to-amber-600/8 border-x border-amber-400/35 pointer-events-none shadow-[0_0_15px_rgba(217,119,6,0.06)]" />

                            {/* Outer Elegant Gold Filigree Inset Frame */}
                            <div className="absolute inset-2 sm:inset-3 rounded-[24px] border border-amber-400/40 pointer-events-none" />
                            <div className="absolute inset-3 sm:inset-4 rounded-[20px] border border-dashed border-amber-500/25 pointer-events-none" />

                            {/* Traditional Khmer Corner Kbach Flourishes */}
                            <div className="absolute top-2 left-2 z-10 opacity-75">
                              <KhmerCornerKbach position="top-left" className="w-9 h-9 sm:w-11 sm:h-11" color="#d97706" />
                            </div>
                            <div className="absolute top-2 right-2 z-10 opacity-75">
                              <KhmerCornerKbach position="top-right" className="w-9 h-9 sm:w-11 sm:h-11" color="#d97706" />
                            </div>
                            <div className="absolute bottom-2 left-2 z-10 opacity-75">
                              <KhmerCornerKbach position="bottom-left" className="w-9 h-9 sm:w-11 sm:h-11" color="#d97706" />
                            </div>
                            <div className="absolute bottom-2 right-2 z-10 opacity-75">
                              <KhmerCornerKbach position="bottom-right" className="w-9 h-9 sm:w-11 sm:h-11" color="#d97706" />
                            </div>

                            {/* TOP HEADER: Royal Crown Finial & Dignified Multilingual Typography */}
                            <div className="relative z-20 flex flex-col items-center pt-5 sm:pt-7 px-4">
                              {/* Golden Royal Crown / Lotus Emblem */}
                              <div className="mb-2 flex items-center justify-center">
                                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-amber-500 filter drop-shadow-[0_2px_4px_rgba(180,110,25,0.35)]" viewBox="0 0 48 48" fill="none">
                                  <defs>
                                    <linearGradient id="royalLotusGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#fef08a" />
                                      <stop offset="50%" stopColor="#d97706" />
                                      <stop offset="100%" stopColor="#92400e" />
                                    </linearGradient>
                                  </defs>
                                  {/* Center Sacred Lotus Petal */}
                                  <path d="M24 6 C24 16, 29 23, 24 34 C19 23, 24 16, 24 6 Z" fill="url(#royalLotusGold)" />
                                  {/* Side Flanking Petals */}
                                  <path d="M24 14 C17 19, 13 26, 17 33 C21 31, 23 27, 24 23 Z" fill="url(#royalLotusGold)" opacity="0.9" />
                                  <path d="M24 14 C31 19, 35 26, 31 33 C27 31, 25 27, 24 23 Z" fill="url(#royalLotusGold)" opacity="0.9" />
                                  {/* Outer Graceful Petals */}
                                  <path d="M24 20 C14 23, 8 30, 11 36 C17 36, 21 32, 23 28 Z" fill="url(#royalLotusGold)" opacity="0.75" />
                                  <path d="M24 20 C34 23, 40 30, 37 36 C31 36, 27 32, 25 28 Z" fill="url(#royalLotusGold)" opacity="0.75" />
                                  {/* Base Pedestal with Beaded Gems */}
                                  <circle cx="24" cy="38" r="2.5" fill="#f59e0b" />
                                  <circle cx="18" cy="39" r="1.8" fill="#d97706" />
                                  <circle cx="30" cy="39" r="1.8" fill="#d97706" />
                                  <circle cx="24" cy="5" r="1.8" fill="#fef08a" />
                                </svg>
                              </div>

                              {/* Main Royal Khmer Title with Moulpali Font */}
                              <h2
                                className="text-base sm:text-lg tracking-wide text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#781919] via-[#b45309] to-[#781919] drop-shadow-sm leading-relaxed"
                                style={{
                                  fontFamily: "'Moulpali', 'Moul', serif",
                                  textShadow: '0 1px 1px rgba(255,255,255,0.85)',
                                }}
                              >
                                {language === 'kh' ? (subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍') : (subtitleEn || 'WEDDING INVITATION')}
                              </h2>

                              {/* Secondary Cursive Script Subtitle */}
                              <span
                                className="font-norican text-xs sm:text-sm text-[#881337]/90 tracking-widest uppercase mt-0.5"
                                style={{
                                  fontFamily: language === 'kh' ? "'Norican', 'Great Vibes', cursive" : "'Moul', serif",
                                }}
                              >
                                {language === 'kh' ? (subtitleEn || 'Wedding Invitation') : (subtitleKh || 'សិរីមង្គលអាពាហ៍ពិពាហ៍')}
                              </span>

                              {/* Delicate Floral Filigree Divider */}
                              <div className="flex items-center gap-2 mt-2 w-36 sm:w-44 justify-center">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-amber-600/80" />
                                <div className="w-1.5 h-1.5 rotate-45 bg-amber-500 shadow-sm" />
                                <div className="w-2 h-2 rotate-45 border border-amber-600 bg-amber-200" />
                                <div className="w-1.5 h-1.5 rotate-45 bg-amber-500 shadow-sm" />
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-500/60 to-amber-600/80" />
                              </div>

                              {/* Couple's Names Inscribed Cartouche */}
                              {(groom || bride) && (
                                <div className="mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100/60 via-amber-50/90 to-amber-100/60 border border-amber-300/60 shadow-xs flex items-center gap-1.5 text-xs text-amber-950 font-serif">
                                  <span className="font-medium text-[#781919]">{groom || 'កូនកម្លោះ'}</span>
                                  <span className="text-amber-500 font-serif text-[11px]">&</span>
                                  <span className="font-medium text-[#781919]">{bride || 'កូនក្រមុំ'}</span>
                                </div>
                              )}
                            </div>

                            {/* CENTERPIECE: Realistic 3D Wax Seal with Swallowtail Satin Ribbons & Radiant Glow */}
                            <div className="relative z-30 flex flex-col items-center my-auto py-2">
                              {/* Ambient Pulsing Warm Halo */}
                              <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-300/25 to-amber-500/20 blur-2xl animate-pulse pointer-events-none" />

                              {/* Realistic Twin Hanging Satin Ribbons Behind Seal */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-28 pointer-events-none z-0">
                                {/* Left Ribbon Tail */}
                                <div
                                  className="absolute left-1 top-2 w-5 h-24 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#781919] shadow-md border-x border-amber-300/40"
                                  style={{
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                                    transform: 'rotate(-7deg)',
                                    transformOrigin: 'top center',
                                  }}
                                />
                                {/* Right Ribbon Tail */}
                                <div
                                  className="absolute right-1 top-2 w-5 h-24 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#781919] shadow-md border-x border-amber-300/40"
                                  style={{
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                                    transform: 'rotate(7deg)',
                                    transformOrigin: 'top center',
                                  }}
                                />
                              </div>

                              {/* Center 3D Wax Medal Seal with Monogram */}
                              <div className="relative z-10 transition-transform duration-300 hover:scale-105 active:scale-95">
                                <TheapKhmerTemplate1WaxSeal
                                  initials={`${getKhmerInitial(groom)}${getKhmerInitial(bride)}` || 'HP'}
                                  className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_14px_35px_rgba(180,100,20,0.65)]"
                                />
                              </div>
                            </div>

                            {/* BOTTOM: Luxury Gilded Tap-to-Open Action Button & Prompt */}
                            <div className="relative z-20 flex flex-col items-center pb-2 sm:pb-3 w-full">
                              {/* Illuminated Royal Pill Button */}
                              <div className="group relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 shadow-[0_6px_22px_rgba(217,119,6,0.45)] border border-amber-200/80 flex items-center gap-2 transform transition-all duration-300 hover:shadow-[0_8px_28px_rgba(217,119,6,0.6)] hover:scale-105">
                                {/* Button Glass Sheen Overlay */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/25 to-white/50 pointer-events-none opacity-80" />
                                
                                <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-spin" style={{ animationDuration: '6s' }} />
                                
                                <span
                                  className="relative z-10 text-xs sm:text-sm tracking-wider text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                                  style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                                >
                                  {language === 'kh' ? 'សូមចុចបើកសំបុត្រ' : 'TAP TO OPEN'}
                                </span>

                                <ChevronsRight className="w-3.5 h-3.5 text-amber-100 animate-pulse" />
                              </div>

                              {/* Gentle Subtitle Hint */}
                              <span className="mt-2 text-[10px] sm:text-[11px] font-khmer text-amber-900/80 tracking-wide">
                                {language === 'kh' ? '• ប៉ះលើត្រាមាសដើម្បីបើកធៀបមង្គលការ •' : '• Touch Wax Seal to Unfold Invitation •'}
                              </span>
                            </div>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </>
                ) : isWeddingStyle ? (
                  isModernWedding ? (
                    <div className="relative z-20 w-full h-full flex flex-col justify-between items-center">
                      {/* Top Right Floating Controls: Next Track & Audio Toggle & Quick Design Editor */}
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
                        {onToggleLanguage && (
                          <button
                            type="button"
                            onClick={onToggleLanguage}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                            title={language === 'kh' ? 'ប្តូរទៅអង់គ្លេស / Switch to English' : 'Switch to Khmer / ប្តូរទៅខ្មែរ'}
                          >
                            <Globe className="w-3 h-3" />
                            <span>{language === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}</span>
                          </button>
                        )}
                        {isAdmin && onOpenDesignTab && (
                          <button
                            type="button"
                            onClick={onOpenDesignTab}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                            title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0"
                              style={{ backgroundColor: activeEnvelopeColor || '#f59e0b' }}
                            />
                            <span>{language === 'kh' ? 'កែ' : 'Edit'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                            if (audio) {
                              audio.currentTime = 0;
                              audio.play().catch(() => {});
                              setIsPlayingMusic(true);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                          title="Replay / Restart Music"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleMusicPlay}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm border cursor-pointer text-amber-900 border-amber-300"
                          title={isPlayingMusic ? 'Mute' : 'Play'}
                        >
                          {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <KhmerRoyalModernWeddingCover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'លោក រ៉ូហ្សា\nនិងភរិយាព្រមទាំងបុត្រ' : 'Honored Guest')}
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
                      {/* Top Right Floating Controls: Next Track & Audio Toggle & Quick Design Editor */}
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
                        {onToggleLanguage && (
                          <button
                            type="button"
                            onClick={onToggleLanguage}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                            title={language === 'kh' ? 'ប្តូរទៅអង់គ្លេស / Switch to English' : 'Switch to Khmer / ប្តូរទៅខ្មែរ'}
                          >
                            <Globe className="w-3 h-3" />
                            <span>{language === 'kh' ? 'ខ្មែរ | EN' : 'EN | ខ្មែរ'}</span>
                          </button>
                        )}
                        {isAdmin && onOpenDesignTab && (
                          <button
                            type="button"
                            onClick={onOpenDesignTab}
                            className="px-2 py-0.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-khmer font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                            title={language === 'kh' ? 'កែពណ៌សំបុត្រក្នុង "ការរចនា"' : 'Edit Color in "Design" Tab'}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0"
                              style={{ backgroundColor: activeEnvelopeColor || '#ad8b55' }}
                            />
                            <span>{language === 'kh' ? 'កែ' : 'Edit'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                            if (audio) {
                              audio.currentTime = 0;
                              audio.play().catch(() => {});
                              setIsPlayingMusic(true);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                          title="Replay / Restart Music"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleMusicPlay}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-sm border cursor-pointer text-[#ad8b55] border-[#ad8b55]/40"
                          title={isPlayingMusic ? 'Mute' : 'Play'}
                        >
                          {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <TheapKhmerTemplate15Cover
                        groom={groom}
                        bride={bride}
                        groomEn={groomEn}
                        brideEn={brideEn}
                        subtitleKh={subtitleKh}
                        guestName={guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'លោក វ៉ាន់ សុខា' : 'Honored Guest')}
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
                  /* Premium Luxury Midnight Teal & Champagne Gold Birthday Party Invitation */
                  <div className="relative z-10 w-full max-w-[360px] sm:max-w-[395px] md:max-w-[420px] mx-auto my-auto self-center h-full min-h-[600px] sm:min-h-[650px] flex flex-col justify-between items-center text-center px-3.5 sm:px-5 py-4 sm:py-5 overflow-hidden rounded-[28px] bg-gradient-to-b from-[#072d36]/90 via-[#0a3843]/80 to-[#02181d]/95 backdrop-blur-2xl text-white shadow-[0_20px_60px_rgba(1,14,18,0.9),inset_0_1px_2px_rgba(255,255,255,0.25)] select-none border border-[#2dd4bf]/40">
                    {/* Inner Beveled Double Gold Hairline Border */}
                    <div className="absolute inset-2 sm:inset-2.5 rounded-[22px] border border-[#fde047]/30 pointer-events-none z-10" />
                    <div className="absolute inset-3 sm:inset-3.5 rounded-[20px] border border-[#2dd4bf]/20 pointer-events-none z-10" />

                    {/* Ambient Glass Reflections & Glows */}
                    <div className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-white/20 via-[#2dd4bf]/15 to-transparent blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-tl from-[#fde047]/20 via-[#0d9488]/15 to-transparent blur-2xl" />

                    {/* Floating Metallic Balloons, Streamers & Sparkles SVG Layer */}
                    <svg
                      viewBox="0 0 380 660"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="pointer-events-none absolute inset-0 w-full h-full z-0 opacity-80"
                    >
                      <defs>
                        <radialGradient id="goldBalloonGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="45%" stopColor="#fde047" />
                          <stop offset="85%" stopColor="#ca8a04" />
                          <stop offset="100%" stopColor="#854d0e" />
                        </radialGradient>
                        <radialGradient id="tealBalloonGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#99f6e4" />
                          <stop offset="45%" stopColor="#2dd4bf" />
                          <stop offset="85%" stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#042f2e" />
                        </radialGradient>
                      </defs>

                      {/* Top Left Floating Stars */}
                      <polygon points="32,28 35,37 44,37 37,42 40,51 32,46 24,51 27,42 20,37 29,37" fill="#fde047" opacity="0.9" />
                      <polygon points="58,62 60,67 66,67 61,71 63,77 58,73 53,77 55,71 50,67 56,67" fill="#2dd4bf" opacity="0.8" />
                      <polygon points="345,35 347,41 354,41 349,45 351,52 345,48 339,52 341,45 336,41 343,41" fill="#fde047" opacity="0.85" />
                      <polygon points="322,78 324,83 330,83 325,87 327,93 322,89 317,93 319,87 314,83 320,83" fill="#2dd4bf" opacity="0.75" />

                      {/* Golden Twisting Streamers */}
                      <path d="M 14 75 Q 26 84 18 100 T 30 125" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                      <path d="M 8 112 Q 22 120 14 136 T 24 160" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                      <path d="M 358 110 Q 344 122 352 140 T 340 168" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />

                      {/* Floating Confetti Circles */}
                      <circle cx="28" cy="180" r="2.5" fill="#fde047" opacity="0.8" />
                      <circle cx="48" cy="220" r="2" fill="#5eead4" opacity="0.7" />
                      <circle cx="340" cy="205" r="2.5" fill="#fde047" opacity="0.75" />
                      <circle cx="355" cy="260" r="3" fill="#2dd4bf" opacity="0.8" />
                      <circle cx="30" cy="440" r="2.5" fill="#fde047" opacity="0.7" />

                      {/* Top-Right Decorative Balloon (Teal) */}
                      <ellipse cx="348" cy="98" rx="16" ry="21" fill="url(#tealBalloonGrad)" opacity="0.85" />
                      <polygon points="348,118 345,122 351,122" fill="#0d9488" opacity="0.85" />
                      <path d="M 342,90 A 6,10 0 0,1 346,85" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                      <path d="M 348,122 Q 352,136 349,152" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

                      {/* Bottom-Right Luxury Gold & Teal Balloons */}
                      <ellipse cx="342" cy="528" rx="19" ry="25" fill="url(#goldBalloonGrad)" opacity="0.9" />
                      <polygon points="342,552 338,557 346,557" fill="#ca8a04" opacity="0.9" />
                      <path d="M 334,516 A 8,12 0 0,1 340,510" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                      <path d="M 342,557 Q 346,575 342,598" stroke="#ca8a04" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />

                      <ellipse cx="316" cy="558" rx="16" ry="21" fill="url(#tealBalloonGrad)" opacity="0.85" />
                      <polygon points="316,578 313,582 319,582" fill="#0d9488" opacity="0.85" />
                      <path d="M 310,548 A 6,10 0 0,1 314,544" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                      <path d="M 316,582 Q 320,596 318,615" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
                    </svg>

                    {/* Top Controls Bar: Surprise Gift Box + Music Toggle */}
                    <div className="relative z-20 w-full flex items-center justify-between px-2 pt-1">
                      {/* Surprise Gift Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleGiftClick}
                          title="Click for birthday surprise!"
                          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#fde047]/20 via-[#2dd4bf]/20 to-[#fde047]/10 border border-[#fde047]/50 hover:border-[#fde047] text-[#fef08a] hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                        >
                          <Gift className="w-4 h-4 text-[#fde047] animate-bounce shrink-0" />
                          <span className="text-[11px] font-bold tracking-wide">
                            {language === 'kh' ? 'កាដូភ្ញាក់ផ្អើល' : 'Gift'}
                          </span>
                          <Sparkles className="w-3 h-3 text-[#5eead4] shrink-0" />
                        </button>

                        {/* Interactive Surprise Toast */}
                        <AnimatePresence>
                          {isGiftSurpriseOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.9 }}
                              className="absolute top-9 left-0 z-30 w-52 p-2.5 rounded-xl bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#042f2e] text-white text-xs font-semibold shadow-xl border border-[#fde047]/60 text-center"
                            >
                              <div className="flex items-center justify-center gap-1 text-[#fde047] mb-1 font-bold">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{language === 'kh' ? 'រីករាយថ្ងៃខួបកំណើត!' : 'Happy Birthday!'}</span>
                              </div>
                              <p className="text-[11px] text-teal-100 leading-tight">
                                {language === 'kh'
                                  ? 'សូមជូនពរសុខភាពល្អ សុភមង្គល និងជោគជ័យគ្រប់ភារកិច្ច! ✨'
                                  : 'Wishing you abundant joy, good health, and wonderful success! ✨'}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Crown Sparkle Center Ornament */}
                      <div className="flex items-center gap-1 text-[#fde047]/90 drop-shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-[#fde047]" />
                        <span className="text-xs">👑</span>
                        <Star className="w-3.5 h-3.5 fill-[#fde047]" />
                      </div>

                      {/* Music Player Button */}
                      <button
                        type="button"
                        onClick={toggleMusicPlay}
                        title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
                        className={`p-1.5 rounded-full border transition-all duration-300 cursor-pointer backdrop-blur-md flex items-center justify-center ${
                          isPlayingMusic
                            ? 'bg-[#2dd4bf]/25 border-[#2dd4bf] text-[#5eead4] shadow-[0_0_12px_rgba(45,212,191,0.5)]'
                            : 'bg-black/30 border-white/20 text-white/70 hover:text-white hover:border-[#fde047]/60'
                        }`}
                      >
                        {isPlayingMusic ? (
                          <Volume2 className="w-4 h-4 animate-pulse text-[#5eead4]" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Main Headline: Bold & Highly Readable Khmer Headline */}
                    <div className="relative z-10 flex flex-col items-center justify-center mt-1 mb-0.5 px-2">
                      <h1
                        className="tracking-wide font-bold font-moul bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#2dd4bf] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(253,224,71,0.4)]"
                        style={{
                          fontFamily: "'Moul', serif",
                          fontSize: '26px',
                          lineHeight: '50px',
                        }}
                      >
                        {language === 'kh' 
                          ? (subtitleKh || 'រីករាយពិធីខួបកំណើត') 
                          : (subtitleEn || 'HAPPY BIRTHDAY PARTY')}
                      </h1>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#5eead4] uppercase mt-0.5 drop-shadow-sm">
                        CELEBRATING LIFE & JOY
                      </span>
                    </div>

                    {/* Celebrant / Host Name */}
                    <div className="relative z-10 flex flex-col items-center my-0.5">
                      {(singlePerson ? groom : (groom || bride)) && (
                        <span
                          className="text-[#99f6e4] tracking-wide mb-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                          style={{
                            fontFamily: "'Khmer OS Bokor', 'Bokor', display",
                            fontSize: '22px',
                            lineHeight: '30px',
                          }}
                        >
                          {singlePerson ? groom : (groom || bride)}
                        </span>
                      )}
                      <h2
                        className="tracking-wider text-white py-0.5 drop-shadow-[0_2px_10px_rgba(45,212,191,0.6)] font-bold"
                        style={{
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: '30px',
                          lineHeight: '36px',
                        }}
                      >
                        {(singlePerson ? (groomEn || groom) : (groomEn || groom)) || 'SAMARA'}
                      </h2>
                    </div>

                    {/* Date, Time & Venue Badge (Centerpiece) */}
                    <div className="relative z-10 w-full max-w-[290px] sm:max-w-[330px] mx-auto my-1 px-3 py-2 rounded-2xl bg-[#04242b]/75 border border-[#2dd4bf]/40 shadow-[0_8px_25px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      {/* Month Label with Gold Stars */}
                      <div className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.26em] text-[#fde047] uppercase mb-1 flex items-center justify-center gap-2">
                        <Star className="w-2.5 h-2.5 fill-[#fde047] text-[#fde047]" />
                        <span>
                          {(() => {
                            if (eventDate) {
                              const d = new Date(eventDate);
                              if (!isNaN(d.getTime())) {
                                return d.toLocaleString('en-US', { month: 'long' }).toUpperCase();
                              }
                            }
                            return 'DECEMBER';
                          })()}
                        </span>
                        <Star className="w-2.5 h-2.5 fill-[#fde047] text-[#fde047]" />
                      </div>

                      {/* Day, Date & Time Row */}
                      <div className="w-full border-t border-b border-[#2dd4bf]/50 py-1.5 flex items-center justify-between px-2 text-white">
                        <span className="font-bold tracking-wider uppercase text-[12px] sm:text-[13px] text-teal-100">
                          {(() => {
                            if (eventDate) {
                              const d = new Date(eventDate);
                              if (!isNaN(d.getTime())) {
                                return d.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
                              }
                            }
                            return 'SATURDAY';
                          })()}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-[#fde047] leading-none px-2 drop-shadow-[0_0_12px_rgba(253,224,71,0.6)]">
                          {(() => {
                            if (eventDate) {
                              const d = new Date(eventDate);
                              if (!isNaN(d.getTime())) {
                                return String(d.getDate());
                              }
                              const m = eventDate.match(/(\d{1,2})/);
                              if (m) return m[1];
                            }
                            return '12';
                          })()}
                        </span>
                        <span className="font-bold tracking-wider uppercase text-[12px] sm:text-[13px] text-teal-100">
                          {eventTime || '06:30 PM'}
                        </span>
                      </div>

                      {/* Expandable Location Section */}
                      <div className="mt-1.5 flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                          className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#5eead4] hover:text-[#fde047] transition-colors cursor-pointer max-w-full"
                        >
                          <MapPin className="w-3 h-3 text-[#fde047] shrink-0" />
                          <span className="truncate max-w-[210px] sm:max-w-[240px]">
                            {eventLocation || 'Suon Monorom Sky Lounge & Restaurant (Koh Pich)'}
                          </span>
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
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
                              className="w-full mt-2 pt-2 border-t border-[#2dd4bf]/20 text-center"
                            >
                              <p className="text-[11px] text-teal-100 font-medium mb-1.5">
                                {eventLocation || 'Suon Monorom Sky Lounge & Restaurant, Koh Pich, Phnom Penh'}
                              </p>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  eventLocation || 'Suon Monorom Sky Lounge Koh Pich Phnom Penh'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0d9488]/80 hover:bg-[#0d9488] text-white text-[10px] font-bold border border-[#5eead4]/50 shadow-sm transition-all"
                              >
                                <MapPin className="w-3 h-3 text-[#fde047]" />
                                <span>{language === 'kh' ? 'មើលទីតាំងលើផែនទី Google Maps' : 'View on Google Maps'}</span>
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Real Birthday Cake Image with Golden Glow Border */}
                    <div className="relative z-10 my-1 flex justify-center">
                      <div className="relative group p-1 rounded-2xl bg-gradient-to-tr from-[#2dd4bf]/50 via-[#fde047]/40 to-[#0d9488]/60 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
                        <img
                          src="/assets/images/real_birthday_cake.jpg"
                          alt="Birthday Celebration Cake"
                          onError={(e) => {
                            // Fallback to secondary asset or high-res cake image if needed
                            const target = e.currentTarget;
                            if (!target.src.includes('real_birthday_cake_1790740588590')) {
                              target.src = '/src/assets/images/real_birthday_cake_1790740588590.jpg';
                            } else {
                              target.src = 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop';
                            }
                          }}
                          className="w-22 h-22 sm:w-26 sm:h-26 object-cover rounded-xl border border-white/40 shadow-inner group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-1.5 -right-1.5 bg-[#fde047] text-neutral-900 rounded-full p-1 shadow-md">
                          <Sparkles className="w-3 h-3 text-[#854d0e]" />
                        </div>
                      </div>
                    </div>

                    {/* Guest Selection Drop Box & Honored Guest Plaque */}
                    <div className="relative z-10 w-full max-w-[290px] sm:max-w-[330px] flex flex-col items-center my-0.5">
                      {savedGuestsList.length > 0 && (
                        <div className="w-full mb-1.5">
                          <select
                            id="guest-database-dropbox-select"
                            value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
                            onChange={(e) => handleSelectFromDropbox(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#04242b]/90 text-teal-100 font-khmer text-xs border border-[#2dd4bf]/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/50 cursor-pointer backdrop-blur-md"
                          >
                            <option value="" disabled className="bg-[#031d23] text-teal-200">
                              {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពីបញ្ជី (Drop box)...' : '▼ Select Guest from Database (Drop box)...'}
                            </option>
                            {savedGuestsList.map((g, idx) => (
                              <option key={g.id ? `${g.id}-${idx}` : `db-guest-${idx}`} value={g.name} className="bg-[#031d23] text-white py-1">
                                {g.name} {g.categoryLabelKh ? `(${language === 'kh' ? g.categoryLabelKh : (g.categoryLabelEn || g.categoryLabelKh)})` : ''}
                              </option>
                            ))}
                            {isAdmin && (
                              <option value="__ADD_NEW__" className="bg-[#0d9488] text-white font-bold">
                                + {language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី / Add Guest...' : '+ Add New Guest...'}
                              </option>
                            )}
                          </select>
                        </div>
                      )}

                      {/* Guest Card: Premium Glassmorphism Plaque */}
                      <div className="w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-[#032026]/90 via-[#073642]/85 to-[#032026]/90 border border-[#2dd4bf]/40 shadow-[0_6px_20px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col items-center">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#fde047] uppercase">
                          {ribbonLabel || (language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited')}
                        </span>
                        <span
                          className="font-bold tracking-wide truncate max-w-[260px] mt-0.5 text-center text-white drop-shadow-[0_2px_8px_rgba(45,212,191,0.5)]"
                          style={{
                            fontFamily: guestNameFontFamily || "'Moul', serif",
                            fontSize: guestNameFontSize ? `${guestNameFontSize}px` : '16px',
                            lineHeight: '28px',
                          }}
                        >
                          {guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                        </span>
                      </div>
                    </div>

                    {/* Main Glowing Open Birthday Button */}
                    <div className="relative z-20 w-full flex justify-center pt-1 pb-1">
                      <motion.button
                        id="open-invitation-btn"
                        onClick={handleOpenInvitation}
                        disabled={isOpening}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative group w-auto max-w-[260px] sm:max-w-[280px] mx-auto py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0f766e] hover:from-[#14b8a6] hover:to-[#0d9488] shadow-[0_8px_25px_rgba(20,184,166,0.55),0_0_20px_rgba(253,224,71,0.3)] border-2 border-[#fde047]/80 flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden cursor-pointer"
                      >
                        {/* Golden Shimmer Sweep */}
                        <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[100%] bg-gradient-to-r from-transparent via-[#fde047]/40 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

                        <div className="relative z-[2] flex items-center justify-center gap-2">
                          <Cake className="w-4 h-4 text-[#fde047] animate-bounce shrink-0" />
                          <span
                            className="tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] font-bold text-xs sm:text-sm"
                            style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                          >
                            {isOpening
                              ? (language === 'kh' ? 'កំពុងបើកធៀប...' : 'Opening Invitation...')
                              : (language === 'kh' ? 'សូមចុចបើកធៀប' : 'Open Birthday Invitation')}
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-[#fde047] shrink-0" />
                        </div>
                      </motion.button>
                    </div>
                  </div>
                ) : isHousewarming ? (
                  <KhmerNatureHousewarmingCover
                    groom={groom}
                    bride={bride}
                    groomEn={groomEn}
                    brideEn={brideEn}
                    singlePerson={singlePerson}
                    subtitleKh={subtitleKh}
                    subtitleEn={subtitleEn}
                    ribbonLabel={ribbonLabel}
                    guestName={guestName}
                    language={language}
                    theme={theme}
                    isOpening={isOpening}
                    isAdmin={isAdmin}
                    savedGuestsList={savedGuestsList}
                    eventDate={eventDate}
                    eventTime={eventTime}
                    eventLocation={eventLocation}
                    coverBackground={coverBackground}
                    primaryColor={primaryColor}
                    coverEnNameColor={coverEnNameColor}
                    coverEnFontFamily={coverEnFontFamily}
                    guestNameFontFamily={guestNameFontFamily}
                    guestNameFontSize={guestNameFontSize}
                    activeEnvelopeColor={activeEnvelopeColor}
                    isPlayingMusic={isPlayingMusic}
                    onToggleMusic={toggleMusicPlay}
                    onRestartMusic={() => {
                      const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
                      if (audio) {
                        audio.currentTime = 0;
                        audio.play().catch(() => {});
                        setIsPlayingMusic(true);
                      }
                    }}
                    onToggleLanguage={onToggleLanguage}
                    onOpenDesignTab={onOpenDesignTab}
                    onSelectFromDropbox={handleSelectFromDropbox}
                    onOpenAddGuestModal={onOpenAddGuestModal}
                    onUpdateGuestName={onUpdateGuestName}
                    onOpenInvitation={handleOpenInvitation}
                  />
                ) : (
                  <>
                    {/* Refined Balanced Contrast Gradient Scrim */}
                    <div
                      className={`absolute inset-0 pointer-events-none transition-opacity ${
                        theme === 'light'
                          ? 'bg-gradient-to-b from-white/40 via-amber-50/20 to-white/50'
                          : 'bg-gradient-to-b from-black/45 via-black/25 to-black/60'
                      }`}
                    />

                    {/* Inner Beveled Double Gold Hairline Border */}
                    <div className="absolute inset-2.5 sm:inset-3.5 rounded-[22px] border border-amber-400/40 pointer-events-none z-10" />
                    <div className="absolute inset-3 sm:inset-4 rounded-[20px] border border-amber-300/20 pointer-events-none z-10" />

                    {/* Khmer Royal Traditional Corner Filigrees (Kbach Phni Tes) */}
                    <div className="absolute top-2 left-2 z-10">
                      <KhmerCornerKbach position="top-left" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <KhmerCornerKbach position="top-right" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute bottom-2 left-2 z-10">
                      <KhmerCornerKbach position="bottom-left" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>
                    <div className="absolute bottom-2 right-2 z-10">
                      <KhmerCornerKbach position="bottom-right" className="w-12 h-12 sm:w-14 sm:h-14" />
                    </div>

                    {/* Floating Animations */}
                    {isBirthday ? (
                      <FloatingBalloonsAndGifts />
                    ) : (
                      <FloatingEngagementRingsAndSparkles />
                    )}

                    {/* Top Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center relative z-10 pt-2"
                    >
                      {/* Curved Heading with Shimmer Animation */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center -mt-2 mb-1 select-none w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                      >
                        <motion.svg
                          viewBox="0 0 340 90"
                          animate={{
                            y: [0, -4, 0, 3, 0],
                            scale: [1, 1.02, 1, 1.015, 1],
                          }}
                          transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-full max-w-[340px] h-auto overflow-visible"
                        >
                          <defs>
                            <linearGradient id="curveGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#d4af37" />
                              <stop offset="25%" stopColor="#fff8db" />
                              <stop offset="50%" stopColor="#f5b80f" />
                              <stop offset="75%" stopColor="#fff8db" />
                              <stop offset="100%" stopColor="#d4af37" />
                            </linearGradient>
                          </defs>
                          <path
                            id="subtitleCurve"
                            d="M 20,78 Q 170,20 320,78"
                            fill="transparent"
                          />
                          <text
                            style={{
                              fill: 'url(#curveGoldGradient)',
                              fontFamily: language === 'kh' ? 'Moul, Moulpali, serif' : 'Norican, cursive',
                              fontSize: '24px',
                              letterSpacing: '0.12em',
                              fontWeight: 'bold',
                            }}
                          >
                            <textPath href="#subtitleCurve" startOffset="50%" textAnchor="middle">
                              {language === 'kh' ? subtitleKh : subtitleEn}
                            </textPath>
                          </text>
                        </motion.svg>
                      </motion.div>

                      {/* Couple / Host Names */}
                      <div className="space-y-0.5 my-1 flex flex-col items-center">
                        <motion.h1
                          style={{
                            color: primaryColor || '#f5b80f',
                            fontSize: '24px',
                            fontWeight: 'normal',
                            fontFamily: "'Moul', serif",
                            lineHeight: '35px',
                          }}
                          className="font-moul text-[24px] py-0.5 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                        >
                          <span>{singlePerson ? groom : (bride ? `${groom} & ${bride}` : groom)}</span>
                        </motion.h1>

                        {/* English Name Below */}
                        <motion.p
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          style={{
                            color: coverEnNameColor || '#fde047',
                            fontFamily: coverEnFontFamily || "'Norican', cursive",
                            fontSize: '20px',
                            lineHeight: '28px',
                            letterSpacing: '0.06em',
                          }}
                          className="font-norican text-[20px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] capitalize tracking-wider select-none"
                        >
                          <span>{singlePerson ? (groomEn || groom) : (brideEn ? `${groomEn || groom} & ${brideEn}` : (groomEn || (bride ? `${groom} & ${bride}` : groom)))}</span>
                        </motion.p>
                      </div>

                      <KhmerDividerKbach className="w-52 sm:w-64 h-5 my-3" color={primaryColor} />
                    </motion.div>

                    {/* Middle Section: Guest */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 my-3 sm:my-5 text-center w-full flex flex-col items-center"
                    >
                      {/* Database Guests Drop Box */}
                      {savedGuestsList.length > 0 && (
                        <div className="w-full max-w-[280px] sm:max-w-[320px] mb-2.5 flex items-center justify-center">
                          <select
                            id="guest-database-dropbox-select"
                            value={savedGuestsList.some((g) => g.name === guestName) ? guestName : ''}
                            onChange={(e) => handleSelectFromDropbox(e.target.value)}
                            style={{
                              borderColor: primaryColor || '#f5b80f',
                              color: '#854d0e',
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-white/95 text-amber-950 font-khmer text-xs border-2 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer backdrop-blur-sm transition-all"
                          >
                            <option value="" disabled>
                              {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពីបញ្ជី (Drop box)...' : '▼ Select Guest from Database (Drop box)...'}
                            </option>
                            {savedGuestsList.map((g, idx) => (
                              <option key={g.id ? `${g.id}-${idx}` : `db-guest-${idx}`} value={g.name} className="bg-white text-neutral-800 py-1">
                                {g.name} {g.categoryLabelKh ? `(${language === 'kh' ? g.categoryLabelKh : (g.categoryLabelEn || g.categoryLabelKh)})` : ''}
                              </option>
                            ))}
                            <option value="__ADD_NEW__" className="bg-amber-50 text-amber-900 font-bold">
                              + {language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី / Add Guest...' : '+ Add New Guest...'}
                            </option>
                          </select>
                        </div>
                      )}

                      <RoyalGoldRibbonBanner className="hover:scale-[1.02] transition-transform duration-300">
                        <span className="block text-[11px] sm:text-xs md:text-sm font-khmer font-semibold text-[#854d0e] mb-1 tracking-wide">
                          {ribbonLabel}
                        </span>
                        <div className="text-lg sm:text-xl md:text-2xl font-moul text-[#172554] tracking-wide flex items-center justify-center">
                          <span
                            className="truncate max-w-[280px]"
                            style={{
                              fontFamily: "'Moul', serif",
                              fontSize: '20px',
                              lineHeight: '35px',
                            }}
                          >
                            {guestName && guestName !== 'Your Name' ? guestName : (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                          </span>
                        </div>
                      </RoyalGoldRibbonBanner>
                    </motion.div>

                    {/* Bottom Action Button - Slide Right Button for Housewarming, Short Pill for Birthday, Royal Kbach for Wedding */}
                    <div className="relative z-10 w-full flex flex-col items-center">
                      {isHousewarming ? (
                        <div className="relative w-full max-w-[320px] sm:max-w-[340px] mx-auto select-none">
                          {/* Slide Track Container */}
                          <div
                            id="open-invitation-btn"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              if (!isOpening) handleOpenInvitation();
                            }}
                            className="relative w-full h-14 sm:h-16 rounded-full bg-gradient-to-r from-emerald-950/95 via-teal-900/90 to-amber-950/95 border-2 border-amber-300/80 shadow-[0_10px_30px_rgba(5,150,105,0.4),inset_0_2px_6px_rgba(255,255,255,0.2)] p-1.5 flex items-center justify-between overflow-hidden cursor-pointer backdrop-blur-md group"
                          >
                            {/* Animated Background Shimmer Glow */}
                            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-emerald-500/15 via-amber-400/25 to-emerald-500/15 animate-pulse" />

                            {/* Centered Guide Text with Moving Chevrons */}
                            <div className="absolute inset-0 z-[1] flex items-center justify-center pl-10 pr-4 pointer-events-none">
                              <span
                                className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                                style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                              >
                                <span>{isOpening ? (language === 'kh' ? 'កំពុងបើក...' : 'Opening...') : (language === 'kh' ? 'អូសទៅស្តាំដើម្បីបើកធៀប' : 'Slide right to open')}</span>
                                <motion.span
                                  animate={{ x: [0, 6, 0] }}
                                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                  className="text-amber-300 font-bold flex items-center"
                                >
                                  <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                                </motion.span>
                              </span>
                            </div>

                            {/* Draggable Golden Housewarming Knob */}
                            <motion.div
                              drag="x"
                              dragConstraints={{ left: 0, right: 230 }}
                              dragElastic={0.15}
                              dragMomentum={false}
                              onDragEnd={(_, info) => {
                                if (info.offset.x > 110 || info.velocity.x > 250) {
                                  handleOpenInvitation();
                                }
                              }}
                              whileHover={{ scale: 1.06 }}
                              whileTap={{ scale: 0.96 }}
                              className="relative z-[2] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-[#fff7d1] via-[#f5b80f] to-[#b47d10] border-2 border-white shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_12px_rgba(245,184,15,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
                            >
                              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950 filter drop-shadow-xs" />
                            </motion.div>

                            {/* Right End Target Icon */}
                            <div className="relative z-[1] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 border border-amber-300/40 flex items-center justify-center shrink-0">
                              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                            </div>
                          </div>
                        </div>
                      ) : isBirthday ? (
                        <motion.button
                          id="open-invitation-btn"
                          onClick={handleOpenInvitation}
                          disabled={isOpening}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group w-auto max-w-[220px] sm:max-w-[240px] mx-auto py-2.5 sm:py-3 px-5 sm:px-6 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 shadow-[0_10px_25px_rgba(168,85,247,0.5),0_0_20px_rgba(236,72,153,0.35)] border-2 border-pink-300/80 flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                          {/* Shimmer sweep */}
                          <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[100%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

                          <div className="relative z-[2] flex items-center justify-center gap-2">
                            <Cake className="w-4 h-4 text-yellow-300 animate-bounce shrink-0" />
                            <span
                              className="tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-bold text-xs sm:text-sm"
                              style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                            >
                              {isOpening
                                ? (language === 'kh' ? 'កំពុងបើក...' : 'Opening...')
                                : (language === 'kh' ? 'បើកធៀបខួបកំណើត' : 'Open Birthday Card')}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                          </div>
                        </motion.button>
                      ) : (
                        <motion.button
                          id="open-invitation-btn"
                          onClick={handleOpenInvitation}
                          disabled={isOpening}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="relative group w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl font-bold bg-gradient-to-r from-[#fff3b0] via-[#ffd24d] to-[#f5b80f] hover:from-[#fff7d1] hover:via-[#ffe066] hover:to-[#f5b80f] text-amber-950 shadow-[0_12px_32px_rgba(245,158,11,0.45),0_0_20px_rgba(255,234,167,0.35)] border-2 border-white/90 flex items-center justify-between gap-3 transition-all duration-300 overflow-hidden cursor-pointer select-none backdrop-blur-md"
                        >
                          {/* Modern Ambient Glow & Shimmer sweep */}
                          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-amber-400/20 via-yellow-200/40 to-amber-400/20 animate-pulse" />
                          <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[100%] bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

                          {/* Left Icon Badge */}
                          <div className="relative z-[2] w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-950 to-[#451a03] text-amber-300 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                            <MailOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-200 drop-shadow-xs" />
                          </div>

                          {/* Center Text Hierarchy */}
                          <div className="relative z-[2] flex flex-col items-center justify-center flex-1 px-1">
                            <span
                              className="text-amber-950 font-bold tracking-wide text-sm sm:text-base leading-tight drop-shadow-xs"
                              style={{ fontFamily: "'Noto Serif Khmer', serif" }}
                            >
                              {isOpening
                                ? (language === 'kh' ? 'កំពុងបើកសំបុត្រ...' : 'Opening Invitation...')
                                : (language === 'kh' ? 'បើកសំបុត្រអញ្ជើញ' : 'Open Invitation')}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900/80 tracking-wider uppercase font-sans mt-0.5">
                              {language === 'kh' ? 'ចុចដើម្បីទស្សនាធៀប' : 'Click to view invitation'}
                            </span>
                          </div>

                          {/* Right Sparkle / Action Indicator */}
                          <div className="relative z-[2] w-8 h-8 rounded-lg bg-amber-950/10 border border-amber-950/15 flex items-center justify-center text-amber-950 group-hover:bg-amber-950/20 group-hover:scale-110 transition-all shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-900 animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

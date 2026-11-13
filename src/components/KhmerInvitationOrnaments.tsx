import React, { useId } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

/**
 * Intricate Cambodian Kbach Phni Tes Corner Ornament
 * Crisp SVG vector with champagne gold foil gradients.
 */
export function KhmerKbachCornerOrnament({
  position = 'top-left',
  className = 'w-14 h-14 sm:w-16 sm:h-16',
  accentColor = '#8B2435',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  accentColor?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const transform =
    position === 'top-right'
      ? 'scaleX(-1)'
      : position === 'bottom-left'
      ? 'scaleY(-1)'
      : position === 'bottom-right'
      ? 'scale(-1, -1)'
      : 'none';

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ transform }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`kbach-foil-${uid}`} x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="30%" stopColor="#F5B82E" />
          <stop offset="65%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#9C6F21" />
        </linearGradient>
      </defs>

      {/* Outer L-frame line */}
      <path
        d="M5 74 V 18 C 5 10.8 10.8 5 18 5 H 74"
        stroke={`url(#kbach-foil-${uid})`}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Inner double metallic hairline */}
      <path
        d="M10 72 V 20 C 10 14.4 14.4 10 20 10 H 72"
        stroke={`url(#kbach-foil-${uid})`}
        strokeWidth="1"
        strokeOpacity="0.8"
        strokeLinecap="round"
      />

      {/* Kbach Phni Tes flame-scroll petals */}
      <path
        d="M15 15 C 24 14 34 20 38 29 C 40 35 35 42 29 41 C 24 40 21 35 23 30 C 25 25 31 24 33 28"
        stroke={`url(#kbach-foil-${uid})`}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 15 C 14 24 20 34 29 38 C 35 40 42 35 41 29"
        stroke={`url(#kbach-foil-${uid})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.88"
      />
      {/* Secondary Kbach leaf tendrils along edges */}
      <path
        d="M32 10 C 40 12 46 17 50 22 C 45 20 40 17 34 15"
        fill={`url(#kbach-foil-${uid})`}
        opacity="0.72"
      />
      <path
        d="M10 32 C 12 40 17 46 22 50 C 20 45 17 40 15 34"
        fill={`url(#kbach-foil-${uid})`}
        opacity="0.72"
      />
      {/* Lotus bud spire tip */}
      <path
        d="M8 8 C 11 4 16 6 15 11 C 14 15 11 16 8 15 C 6 14 4 11 8 8 Z"
        fill={`url(#kbach-foil-${uid})`}
        stroke={accentColor}
        strokeWidth="0.6"
        strokeOpacity="0.45"
      />
      <circle cx="11" cy="11" r="2.1" fill="#FFF8E9" />
      <circle cx="58" cy="5" r="1.6" fill="#F5B82E" />
      <circle cx="5" cy="58" r="1.6" fill="#F5B82E" />
    </svg>
  );
}

/**
 * Cambodian Kbach Lotus Top Archway & Cascading Romduol / Jasmine Flower Garland
 */
export function KhmerTopLotusGarland({
  accentColor = '#8B2435',
  className = '',
}: {
  accentColor?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`pointer-events-none select-none w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 420 118" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <linearGradient id={`arch-gold-${uid}`} x1="0" y1="0" x2="420" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#F5B82E" />
            <stop offset="50%" stopColor="#FFF2B8" />
            <stop offset="75%" stopColor="#F5B82E" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Graceful Khmer Kbach scalloped arch filigree */}
        <path
          d="M 16 20 Q 115 62 210 24 Q 305 62 404 20"
          stroke={`url(#arch-gold-${uid})`}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M 28 10 Q 120 48 210 14 Q 300 48 392 10"
          stroke={`url(#arch-gold-${uid})`}
          strokeWidth="0.9"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.7"
        />

        {/* Delicate cascading jasmine strands (Phka Mliss garlands) */}
        {[46, 78, 114, 306, 342, 374].map((x, idx) => {
          const drop = idx === 0 || idx === 5 ? 58 : idx === 1 || idx === 4 ? 46 : 36;
          return (
            <g key={x} opacity={0.88}>
              <line x1={x} y1={14} x2={x} y2={drop + 16} stroke="#D9A441" strokeWidth="0.8" strokeOpacity="0.55" />
              <circle cx={x} cy={drop * 0.48 + 12} r="2.4" fill="#FFF8E9" stroke="#D9A441" strokeWidth="0.8" />
              <circle cx={x} cy={drop * 0.78 + 14} r="2.8" fill="#FFF8E9" stroke="#E8BD65" strokeWidth="0.9" />
              <path
                d={`M ${x} ${drop + 12} C ${x + 4} ${drop + 17}, ${x + 3} ${drop + 23}, ${x} ${drop + 25} C ${x - 3} ${drop + 23}, ${x - 4} ${drop + 17}, ${x} ${drop + 12} Z`}
                fill="#F5B82E"
                opacity="0.85"
              />
            </g>
          );
        })}

        {/* Central Khmer Top Lotus Crown (ព្រះចន្ទលំអ និងផ្កាឈូក) */}
        <g transform="translate(210, 26)">
          <path d="M 0 -17 C 5 -9 7 -2 0 6 C -7 -2 -5 -9 0 -17 Z" fill="#F5B82E" stroke="#9C6F21" strokeWidth="0.6" />
          <path d="M -11 -9 C -5 -7 -1 -1 -5 5 C -11 4 -13 -3 -11 -9 Z" fill="#E8BD65" stroke="#9C6F21" strokeWidth="0.5" />
          <path d="M 11 -9 C 5 -7 1 -1 5 5 C 11 4 13 -3 11 -9 Z" fill="#E8BD65" stroke="#9C6F21" strokeWidth="0.5" />
          <path d="M -20 -1 C -13 -2 -8 1 -9 6 C -16 7 -20 3 -20 -1 Z" fill="#D9A441" opacity="0.85" />
          <path d="M 20 -1 C 13 -2 8 1 9 6 C 16 7 20 3 20 -1 Z" fill="#D9A441" opacity="0.85" />
          <circle cx="0" cy="-1" r="2.6" fill={accentColor} stroke="#FFF8E9" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Gold Diamond & Lotus Petal Divider (◇ ◆ ◇)
 */
export function KhmerDiamondDivider({
  accentColor = '#8B2435',
  className = 'w-48 sm:w-60 h-5',
}: {
  accentColor?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`flex items-center justify-center mx-auto pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 280 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id={`div-gold-${uid}`} x1="0" y1="11" x2="280" y2="11" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0" />
            <stop offset="28%" stopColor="#D9A441" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#F5B82E" />
            <stop offset="72%" stopColor="#D9A441" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="12" y1="11" x2="110" y2="11" stroke={`url(#div-gold-${uid})`} strokeWidth="1.2" />
        <polygon points="120,11 124,7 128,11 124,15" fill="#E8BD65" stroke="#9C6F21" strokeWidth="0.6" />
        <polygon points="140,4 147,11 140,18 133,11" fill="#F5B82E" stroke="#9C6F21" strokeWidth="0.7" />
        <circle cx="140" cy="11" r="2" fill={accentColor} />
        <polygon points="160,11 156,7 152,11 156,15" fill="#E8BD65" stroke="#9C6F21" strokeWidth="0.6" />
        <line x1="170" y1="11" x2="268" y2="11" stroke={`url(#div-gold-${uid})`} strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/**
 * Luxury Cambodian Wax Seal & Kbach Lotus Medallion
 * Displays dynamic Khmer initials (or symbol) in champagne gold foil with silk swallowtail ribbon underneath.
 */
export function KhmerRoyalGoldMedallion({
  leftInitial = 'ម',
  rightInitial = 'វ',
  ribbonColor = '#8B2435',
  showRibbon = true,
  className = 'w-32 h-36 sm:w-36 sm:h-40',
}: {
  leftInitial?: string;
  rightInitial?: string;
  ribbonColor?: string;
  showRibbon?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`relative flex items-center justify-center mx-auto select-none pointer-events-none ${className}`}>
      {/* Soft Golden Radiant Aura */}
      <div
        className="absolute inset-2 rounded-full blur-xl opacity-45 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(245,184,46,0.55) 0%, rgba(217,164,65,0) 72%)' }}
      />

      <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-[0_10px_22px_rgba(89,59,34,0.22)]">
        <defs>
          <radialGradient id={`med-face-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="52%" stopColor="#FFF6DA" />
            <stop offset="86%" stopColor="#F4D382" />
            <stop offset="100%" stopColor="#D9A441" />
          </radialGradient>
          <linearGradient id={`med-rim-${uid}`} x1="20" y1="15" x2="160" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="35%" stopColor="#F5B82E" />
            <stop offset="70%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#8B611C" />
          </linearGradient>
        </defs>

        {/* Luxury Swallowtail Silk Ribbon underneath medallion */}
        {showRibbon && (
          <g>
            <path
              d="M64 128 L 52 186 L 70 174 L 84 188 L 86 130 Z"
              fill={ribbonColor}
              stroke="#E8BD65"
              strokeWidth="0.9"
            />
            <path
              d="M116 128 L 128 186 L 110 174 L 96 188 L 94 130 Z"
              fill={ribbonColor}
              stroke="#E8BD65"
              strokeWidth="0.9"
            />
            <path d="M58 180 L 67 132" stroke="#F5B82E" strokeWidth="0.6" strokeOpacity="0.6" />
            <path d="M122 180 L 113 132" stroke="#F5B82E" strokeWidth="0.6" strokeOpacity="0.6" />
          </g>
        )}

        {/* Angkor Top Spire Finial above medallion */}
        <path d="M90 8 C 94 15 95 21 90 27 C 85 21 86 15 90 8 Z" fill={`url(#med-rim-${uid})`} stroke="#7B5416" strokeWidth="0.6" />
        <path d="M77 16 C 83 18 86 22 84 28 C 78 26 75 21 77 16 Z" fill={`url(#med-rim-${uid})`} opacity="0.9" />
        <path d="M103 16 C 97 18 94 22 96 28 C 102 26 105 21 103 16 Z" fill={`url(#med-rim-${uid})`} opacity="0.9" />

        {/* Outer Scalloped Lotus Petals Wreath (16 petals around medallion) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = i * 22.5;
          return (
            <g key={i} transform={`rotate(${angle} 90 90)`}>
              <path
                d="M90 25 C 94 31 94 37 90 40 C 86 37 86 31 90 25 Z"
                fill={`url(#med-rim-${uid})`}
                opacity={i % 2 === 0 ? '0.92' : '0.68'}
              />
            </g>
          );
        })}

        {/* Main Circular Gold Foil Ring */}
        <circle cx="90" cy="90" r="54" fill={`url(#med-rim-${uid})`} stroke="#7B5416" strokeWidth="1" />
        <circle cx="90" cy="90" r="49" fill={`url(#med-face-${uid})`} stroke="#FFF8E9" strokeWidth="1.2" />
        <circle cx="90" cy="90" r="44" fill="none" stroke="#D9A441" strokeWidth="1.1" strokeDasharray="3 2.5" />

        {/* Subtle Diagonal Gold Filigree Divider */}
        <path
          d="M 56 106 Q 90 90 124 74"
          stroke="#D9A441"
          strokeOpacity="0.38"
          strokeWidth="1"
          fill="none"
        />

        {/* Monogram Khmer Letters balanced symmetrically across the emblem */}
        <text
          x="67"
          y="85"
          textAnchor="middle"
          fill={ribbonColor}
          style={{
            fontFamily: "'Moul', 'Khmer OS Muol Light', serif",
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {leftInitial}
        </text>
        <text
          x="90"
          y="96"
          textAnchor="middle"
          fill="#9C6F21"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '13px',
            fontStyle: 'italic',
            fontWeight: 'bold',
          }}
        >
          &amp;
        </text>
        <text
          x="112"
          y="107"
          textAnchor="middle"
          fill={ribbonColor}
          style={{
            fontFamily: "'Moul', 'Khmer OS Muol Light', serif",
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {rightInitial}
        </text>
      </svg>
    </div>
  );
}

/**
 * Cambodian Ceremonial Emblem for Engagement, Housewarming & Birthday Covers
 */
export function KhmerCeremonyCrest({
  variant,
  accentColor = '#8B2435',
  className = 'w-24 h-24 sm:w-28 sm:h-28',
}: {
  variant: 'engagement' | 'housewarming' | 'birthday';
  accentColor?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`relative flex items-center justify-center mx-auto pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_6px_16px_rgba(89,59,34,0.2)]">
        <defs>
          <linearGradient id={`crest-gold-${uid}`} x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="40%" stopColor="#F5B82E" />
            <stop offset="80%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#8B611C" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="50" fill="#FFF8E9" fillOpacity="0.92" stroke={`url(#crest-gold-${uid})`} strokeWidth="2.5" />
        <circle cx="60" cy="60" r="44" stroke="#D9A441" strokeWidth="1" strokeDasharray="3 2.5" />

        {variant === 'engagement' && (
          <g>
            {/* Intertwined Khmer gold rings + Lotus Crown */}
            <path d="M60 18 C 64 25 65 30 60 35 C 55 30 56 25 60 18 Z" fill={`url(#crest-gold-${uid})`} />
            <circle cx="49" cy="63" r="15" stroke={`url(#crest-gold-${uid})`} strokeWidth="3.5" fill="none" />
            <circle cx="71" cy="63" r="15" stroke="#B88329" strokeWidth="3.5" fill="none" />
            <polygon points="60,39 65,45 60,51 55,45" fill={accentColor} stroke="#FFF8E9" strokeWidth="1" />
          </g>
        )}

        {variant === 'housewarming' && (
          <g>
            {/* Cambodian Traditional Gabled Roof + Auspicious Lotus */}
            <path
              d="M26 58 L 60 28 L 94 58"
              stroke={`url(#crest-gold-${uid})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M60 20 L 63 28 L 60 32 L 57 28 Z" fill="#F5B82E" />
            <rect x="38" y="56" width="44" height="30" rx="3" stroke={accentColor} strokeWidth="2" fill="#FFFDF7" />
            <path d="M53 86 V 68 C 53 64 67 64 67 68 V 86" fill={`url(#crest-gold-${uid})`} />
          </g>
        )}

        {variant === 'birthday' && (
          <g>
            {/* Cambodian Royal Baisrey Spire / Auspicious Lotus Lantern */}
            <path d="M60 20 C 66 32 67 42 60 52 C 53 42 54 32 60 20 Z" fill={`url(#crest-gold-${uid})`} />
            <path d="M44 36 C 53 38 58 44 54 53 C 46 51 42 44 44 36 Z" fill="#E8BD65" />
            <path d="M76 36 C 67 38 62 44 66 53 C 74 51 78 44 76 36 Z" fill="#E8BD65" />
            <path d="M36 60 H 84 L 77 78 H 43 L 36 60 Z" fill={accentColor} stroke={`url(#crest-gold-${uid})`} strokeWidth="1.5" />
            <rect x="46" y="78" width="28" height="7" rx="3" fill={`url(#crest-gold-${uid})`} />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Authentic Khmer Scalloped Ivory & Champagne Gold Guest Cartouche Plaque
 * Replaces garish #172554 blue text and riveted metallic bars.
 */
export function KhmerKbachGuestCartouche({
  invitedLabel,
  guestName,
  accentColor = '#8B2435',
  guestFontFamily,
  guestColor,
  guestFontSize,
  isAdmin = false,
  onClick,
  title,
  className = '',
}: {
  invitedLabel: string;
  guestName: string;
  accentColor?: string;
  guestFontFamily?: string;
  guestColor?: string;
  guestFontSize?: string;
  isAdmin?: boolean;
  onClick?: () => void;
  title?: string;
  className?: string;
}) {
  const safeGuestColor =
    guestColor && guestColor !== '#364153' && guestColor !== '#172554' ? guestColor : '#593B22';

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative w-full max-w-[330px] sm:max-w-[370px] mx-auto px-5 py-3 sm:py-3.5 rounded-[20px] transition-transform duration-300 ${
        isAdmin ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(160deg, rgba(255,252,243,0.96) 0%, rgba(252,243,221,0.94) 55%, rgba(246,232,201,0.96) 100%)',
        border: '1.5px solid #D9A441',
        boxShadow: '0 8px 24px rgba(89,59,34,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      {/* Inner double metallic hairline */}
      <div
        className="pointer-events-none absolute inset-[4px] rounded-[15px]"
        style={{ border: '1px solid rgba(217,164,65,0.45)' }}
      />
      {/* Left & Right Lotus Diamond Finials */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
        style={{ backgroundColor: '#F5B82E', border: `1px solid ${accentColor}` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
        style={{ backgroundColor: '#F5B82E', border: `1px solid ${accentColor}` }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-3">
        <span
          className="text-xs sm:text-sm font-bold tracking-wide"
          style={{
            fontFamily: "'Noto Sans Khmer', sans-serif",
            color: accentColor,
          }}
        >
          {invitedLabel}
        </span>
        <span
          className="mt-1 max-w-[270px] sm:max-w-[310px] truncate leading-relaxed font-normal"
          style={{
            fontFamily: guestFontFamily || "'Moul', 'Moulpali', 'Khmer OS Muol Light', serif",
            color: safeGuestColor,
            fontSize: guestFontSize ? `${guestFontSize}px` : '18px',
            lineHeight: '32px',
          }}
        >
          {guestName}
        </span>
      </div>
    </div>
  );
}

/**
 * Luxury Khmer Gold-Foil Open Invitation Button with Kbach Finials & Gentle Pulse
 */
export function KhmerRoyalActionOpenButton({
  id = 'open-invitation-btn',
  label,
  sublabel,
  onOpen,
  isOpening = false,
  accentColor = '#8B2435',
  className = '',
}: {
  id?: string;
  label: string;
  sublabel?: string;
  onOpen: () => void;
  isOpening?: boolean;
  accentColor?: string;
  className?: string;
}) {
  return (
    <motion.button
      id={id}
      type="button"
      onClick={onOpen}
      disabled={isOpening}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center justify-center gap-3 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full cursor-pointer overflow-hidden transition-all duration-300 select-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #FFF7DC 0%, #F7D47A 35%, #D9A441 75%, #C68D2C 100%)',
        border: '1.5px solid #E8BD65',
        boxShadow: '0 10px 28px rgba(140, 95, 25, 0.28), 0 0 0 3px rgba(232, 189, 101, 0.22), inset 0 1px 1px rgba(255,255,255,0.85)',
      }}
    >
      {/* Gentle Pulse Halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full animate-pulse opacity-35"
        style={{ boxShadow: 'inset 0 0 14px rgba(255,255,255,0.8)' }}
      />
      {/* Shimmer Light Sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />

      {/* Left Gold-Burgundy Diamond */}
      <span
        aria-hidden="true"
        className="relative z-10 w-2.5 h-2.5 rotate-45 shrink-0"
        style={{ backgroundColor: accentColor, border: '1px solid #FFF8E9' }}
      />

      <span className="relative z-10 flex flex-col items-center leading-tight">
        <span
          className="text-sm sm:text-base font-bold tracking-wide whitespace-nowrap"
          style={{
            fontFamily: "'Noto Serif Khmer', 'Moulpali', serif",
            color: '#472B14',
            textShadow: '0 1px 0 rgba(255,248,233,0.75)',
          }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-[10px] tracking-[0.16em] uppercase font-semibold mt-0.5 whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {sublabel}
          </span>
        )}
      </span>

      {/* Right Sparkle Accent */}
      <Sparkles className="relative z-10 w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" style={{ color: accentColor }} />
    </motion.button>
  );
}

/**
 * Shared Khmer Warm Ivory Paper Texture, Diagonal Botanical Shimmer & Double Gold Border Overlay
 */
export function KhmerCardLuxuryFrameLayer({
  accentColor = '#8B2435',
}: {
  accentColor?: string;
}) {
  return (
    <>
      {/* Subtle Cambodian dotted paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14] z-[1]"
        style={{
          backgroundImage: 'radial-gradient(#B5832D 0.85px, transparent 0.85px)',
          backgroundSize: '15px 15px',
        }}
      />

      {/* Diagonal delicate golden leaf/vine watermark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 420 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 w-full h-full z-[1] opacity-[0.18]"
      >
        <path
          d="M -20 560 C 95 450, 175 340, 250 245 C 315 160, 365 85, 445 -10"
          stroke="#D9A441"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M 80 455 C 95 445, 108 452, 102 465 C 92 468, 82 462, 80 455 Z"
          fill="#E8BD65"
        />
        <path
          d="M 305 145 C 320 135, 333 142, 327 155 C 317 158, 307 152, 305 145 Z"
          fill="#E8BD65"
        />
      </svg>

      {/* Double metallic gold inset borders */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10px] sm:inset-[12px] rounded-[22px] z-[15]"
        style={{ border: '1.5px solid rgba(217, 164, 65, 0.72)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[15px] sm:inset-[18px] rounded-[18px] z-[15]"
        style={{ border: '1px solid rgba(232, 189, 101, 0.42)' }}
      />

      {/* Four Cambodian Kbach Phni Tes Corner Spires */}
      <div className="pointer-events-none absolute top-[12px] left-[12px] sm:top-[14px] sm:left-[14px] z-[16]">
        <KhmerKbachCornerOrnament position="top-left" accentColor={accentColor} />
      </div>
      <div className="pointer-events-none absolute top-[12px] right-[12px] sm:top-[14px] sm:right-[14px] z-[16]">
        <KhmerKbachCornerOrnament position="top-right" accentColor={accentColor} />
      </div>
      <div className="pointer-events-none absolute bottom-[12px] left-[12px] sm:bottom-[14px] sm:left-[14px] z-[16]">
        <KhmerKbachCornerOrnament position="bottom-left" accentColor={accentColor} />
      </div>
      <div className="pointer-events-none absolute bottom-[12px] right-[12px] sm:bottom-[14px] sm:right-[14px] z-[16]">
        <KhmerKbachCornerOrnament position="bottom-right" accentColor={accentColor} />
      </div>
    </>
  );
}

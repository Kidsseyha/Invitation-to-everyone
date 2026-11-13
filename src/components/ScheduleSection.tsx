import { ThemeMode } from "./ThemeToggle";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Users,
  Gift,
  Sparkles,
  Scissors,
  Flame,
  Utensils,
  Heart,
  Crown,
  Wine,
  CalendarCheck,
  Calendar,
  Layers,
  Home,
} from 'lucide-react';
import { Language, Shift } from '../types';
import RingIcon from './RingIcon';
import { formatKhmerDate, formatEnDate, toKhmerNumber } from '../utils/khmerHelpers';

interface ScheduleSectionProps {
  shifts: Shift[];
  language: Language;
  primaryColor?: string;
  textColor?: string;
  theme?: ThemeMode;
  eventType?: string;
}

export default function ScheduleSection({
  shifts,
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
  theme = 'dark',
  eventType,
}: ScheduleSectionProps) {
  const isHousewarming = eventType === 'housewarming';
  // Always display all days sequentially (Day 1 then Day 2)
  const [quickJumpIdx, setQuickJumpIdx] = useState<number | null>(null);

  const getIcon = (iconName?: string) => {
    const props = { className: 'w-4 h-4', style: { color: primaryColor } };
    switch (iconName) {
      case 'users':
        return <Users {...props} />;
      case 'gift':
        return <Gift {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'scissors':
        return <Scissors {...props} />;
      case 'flame':
        return <Flame {...props} />;
      case 'utensils':
        return <Utensils {...props} />;
      case 'heart':
        return <Heart {...props} />;
      case 'crown':
        return <Crown {...props} />;
      case 'wine':
        return <Wine {...props} />;
      case 'ring':
        return <RingIcon {...props} />;
      default:
        return <Clock {...props} />;
    }
  };

  const scrollToDay = (index: number) => {
    setQuickJumpIdx(index);
    const element = document.getElementById(`schedule-day-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="schedule-section" className="py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-khmer mb-2 shadow-sm ${
              isHousewarming
                ? theme === 'light'
                  ? 'bg-emerald-900/10 border-emerald-700/30'
                  : 'bg-emerald-950/60 border-emerald-400/35'
                : 'bg-amber-950/50 border-amber-500/30'
            }`}
          >
            {isHousewarming ? (
              <Home className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            ) : (
              <CalendarCheck className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            )}
            <span style={{ color: primaryColor }}>
              {isHousewarming
                ? language === 'kh'
                  ? 'កម្មវិធីពិធីឡើងគេហដ្ឋានថ្មី'
                  : 'Housewarming Program'
                : shifts.length > 1
                ? language === 'kh'
                  ? 'កម្មវិធីមង្គលការ ២ ថ្ងៃ'
                  : '2-Day Wedding Program'
                : language === 'kh'
                ? 'កម្មវិធីមង្គលការ'
                : 'Wedding Schedule'}
            </span>
          </div>
          <h2
            style={{ color: primaryColor }}
            className="text-xl sm:text-2xl font-moul drop-shadow-sm"
          >
            {language === 'kh'
              ? 'របៀបវារៈកម្មវិធី'
              : isHousewarming
              ? 'HOUSEWARMING AGENDA'
              : 'WEDDING AGENDA'}
          </h2>
          <p
            style={{ color: textColor }}
            className="text-xs font-khmer mt-1 opacity-90"
          >
            {isHousewarming
              ? language === 'kh'
                ? 'កម្មវិធីតាមគន្លងប្រពៃណីខ្មែរ និងធម្មជាតិស្រស់បំព្រង'
                : 'Traditional Khmer Housewarming Itinerary'
              : language === 'kh'
              ? 'បែងចែកជាពីរថ្ងៃ តាមគន្លងប្រពៃណីខ្មែរ'
              : '2-Day Traditional Khmer Wedding Itinerary'}
          </p>
        </div>

        {/* Quick Day Shortcut Pills */}
        {shifts.length > 1 && (
          <div className="flex items-center justify-center p-1.5 rounded-2xl bg-gradient-to-r from-black/95 via-[#181308] to-black/95 border border-amber-500/40 mb-8 shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-md gap-2 ring-1 ring-amber-400/20">
            {shifts.map((shift, idx) => {
              const isSelected = quickJumpIdx === idx;
              
              // Dynamic Day label & date with year from shift data
              let dayBadge = language === 'kh' ? `ថ្ងៃទី${toKhmerNumber(idx + 1)}` : `Day ${idx + 1}`;
              let dateDetails = '';
              let fullTitle = '';

              if (shift.date) {
                const parts = shift.date.split('-');
                if (parts.length === 3) {
                  const y = parseInt(parts[0], 10);
                  const m = parseInt(parts[1], 10);
                  const d = parseInt(parts[2], 10);
                  const dateObj = new Date(y, m - 1, d);

                  if (language === 'kh') {
                    const khmerShortDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
                    const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
                    const dStr = d < 10 ? `0${d}` : `${d}`;
                    dateDetails = `${khmerShortDays[dateObj.getDay()]} ${toKhmerNumber(dStr)} ${khmerMonths[m - 1]} ${toKhmerNumber(y)}`;
                    fullTitle = `${dayBadge} ៖ ${formatKhmerDate(shift.date)}`;
                  } else {
                    const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const dStr = d < 10 ? `0${d}` : `${d}`;
                    dateDetails = `${enDays[dateObj.getDay()]}, ${enMonths[m - 1]} ${dStr}, ${y}`;
                    fullTitle = `${dayBadge}: ${formatEnDate(shift.date)}`;
                  }
                }
              } else {
                dateDetails = language === 'kh' ? (shift.name || '') : (shift.nameEn || '');
                fullTitle = dateDetails;
              }

              const isDayOne = idx === 0;
              const buttonIcon = isDayOne ? (
                <Crown className="w-4 h-4" />
              ) : (
                <Wine className="w-4 h-4" />
              );

              return (
                <button
                  key={`sched-tab-${shift.id || idx}-${idx}`}
                  id={`schedule-day-tab-${idx + 1}`}
                  type="button"
                  onClick={() => scrollToDay(idx)}
                  title={fullTitle}
                  className={`flex-1 py-3 px-4 sm:px-5 rounded-2xl text-xs font-khmer transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
                    isDayOne
                      ? isSelected
                        ? 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-amber-950 font-extrabold shadow-[0_5px_24px_rgba(217,119,6,0.45)] border-2 border-amber-300 ring-2 ring-amber-400/80 scale-[1.03]'
                        : theme === 'light'
                        ? 'bg-[#fffbeb] text-amber-900 border-2 border-amber-300 hover:bg-[#fef3c7] hover:border-amber-400 shadow-sm'
                        : 'bg-black/60 text-amber-200 border-2 border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-400 shadow-sm'
                      : isSelected
                      ? 'bg-gradient-to-r from-rose-600 via-pink-400 to-amber-400 text-white font-extrabold shadow-[0_5px_24px_rgba(225,29,72,0.45)] scale-[1.03] border-2 border-rose-200 ring-2 ring-rose-400/80'
                      : theme === 'light'
                      ? 'bg-[#fff1f2] text-rose-900 border-2 border-rose-300 hover:bg-[#ffe4e6] hover:border-rose-400 shadow-sm'
                      : 'bg-black/60 text-pink-200 border-2 border-rose-500/40 hover:bg-rose-500/10 hover:border-rose-400 shadow-sm'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full shrink-0 transition-transform ${
                      isDayOne
                        ? isSelected
                          ? 'bg-amber-950/20 text-amber-950 scale-110'
                          : theme === 'light'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-amber-400/15 text-amber-300'
                        : isSelected
                        ? 'bg-white/25 text-white scale-110'
                        : theme === 'light'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-rose-400/15 text-pink-300'
                    }`}
                  >
                    {buttonIcon}
                  </div>
                  <div className="flex flex-col items-start gap-0.5 text-left">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                        isDayOne
                          ? isSelected
                            ? 'bg-amber-950/20 text-amber-950'
                            : theme === 'light'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-amber-400/20 text-amber-300'
                          : isSelected
                          ? 'bg-white/20 text-white'
                          : theme === 'light'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-rose-400/20 text-pink-300'
                      }`}
                    >
                      {dayBadge}
                    </span>
                    <span className="font-bold text-xs sm:text-[13px] tracking-tight truncate max-w-[120px] sm:max-w-[150px]">
                      {dateDetails}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Timeline Content: Display Day 1 and Day 2 together sequentially */}
        <div className="space-y-10">
          {shifts.map((shift, shiftIndex) => {
            const actualDayNum = shiftIndex + 1;
            const isCardDayOne = shiftIndex === 0;

            return (
              <div
                key={`sched-shift-${shift.id || shiftIndex}-${shiftIndex}`}
                id={`schedule-day-${shiftIndex}`}
                className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden backdrop-blur-sm scroll-mt-24 transition-all ${
                  isHousewarming
                    ? theme === 'light'
                      ? 'bg-gradient-to-b from-[#f3f7ef] via-white to-[#edf4e8] border-emerald-700/25 shadow-lg'
                      : 'bg-gradient-to-b from-[#08261c]/95 via-[#051b14]/95 to-[#04140e]/95 border-[#d4af37]/35 shadow-2xl ring-1 ring-emerald-400/15'
                    : isCardDayOne
                    ? theme === 'light'
                      ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-amber-300 shadow-xl'
                      : 'bg-gradient-to-b from-[#181308]/95 via-black/90 to-black/95 border-amber-500/40 shadow-2xl ring-1 ring-amber-400/20'
                    : theme === 'light'
                    ? 'bg-gradient-to-b from-rose-50/90 via-white to-pink-50/60 border-rose-300 shadow-xl'
                    : 'bg-gradient-to-b from-[#1c0c13]/95 via-black/90 to-black/95 border-rose-500/40 shadow-2xl ring-1 ring-rose-400/20'
                }`}
              >
                {/* Day Header Badge */}
                <div
                  className={`flex items-center justify-between pb-3.5 mb-4 border-b ${
                    isCardDayOne
                      ? theme === 'light'
                        ? 'border-amber-300/60'
                        : 'border-amber-500/25'
                      : theme === 'light'
                      ? 'border-rose-300/60'
                      : 'border-rose-500/25'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center font-mono shadow-sm border ${
                        isCardDayOne
                          ? theme === 'light'
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-gradient-to-br from-amber-400/30 to-amber-600/20 border-amber-400/50 text-amber-300'
                          : theme === 'light'
                          ? 'bg-rose-100 border-rose-300 text-rose-900'
                          : 'bg-gradient-to-br from-rose-400/30 to-pink-600/20 border-rose-400/50 text-pink-300'
                      }`}
                    >
                      #{actualDayNum}
                    </span>
                    <div>
                      <h3
                        className={`text-sm sm:text-base font-bold font-moul leading-snug ${
                          isHousewarming
                            ? theme === 'light'
                              ? 'text-[#103b2a]'
                              : 'text-amber-200'
                            : isCardDayOne
                            ? theme === 'light'
                              ? 'text-amber-950'
                              : 'text-amber-200'
                            : theme === 'light'
                            ? 'text-rose-950'
                            : 'text-pink-200'
                        }`}
                      >
                        {language === 'kh' ? shift.name : shift.nameEn || shift.name}
                      </h3>
                      {shift.date && (
                        <span
                          className={`text-[11px] font-mono flex items-center gap-1.5 mt-0.5 ${
                            isHousewarming
                              ? theme === 'light'
                                ? 'text-emerald-800'
                                : 'text-emerald-300/85'
                              : isCardDayOne
                              ? theme === 'light'
                                ? 'text-amber-800'
                                : 'text-amber-300/80'
                              : theme === 'light'
                              ? 'text-rose-800'
                              : 'text-pink-300/80'
                          }`}
                        >
                          <Calendar
                            className={`w-3 h-3 ${
                              isHousewarming
                                ? theme === 'light'
                                  ? 'text-emerald-700'
                                  : 'text-emerald-400'
                                : isCardDayOne
                                ? theme === 'light'
                                  ? 'text-amber-600'
                                  : 'text-amber-400'
                                : theme === 'light'
                                ? 'text-rose-600'
                                : 'text-pink-400'
                            }`}
                          />
                          <span>{shift.date}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-[11px] font-khmer font-bold shrink-0 shadow-sm ${
                      isHousewarming
                        ? theme === 'light'
                          ? 'bg-emerald-100/80 border-emerald-700/30 text-[#103b2a]'
                          : 'bg-emerald-900/50 border-emerald-400/40 text-amber-200'
                        : isCardDayOne
                        ? theme === 'light'
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : theme === 'light'
                        ? 'bg-rose-100 border-rose-300 text-rose-900'
                        : 'bg-rose-500/20 border-rose-500/40 text-pink-300'
                    }`}
                  >
                    {language === 'kh' ? `ថ្ងៃទី ${actualDayNum}` : `Day ${actualDayNum}`}
                  </span>
                </div>

                {/* Timeline list */}
                <div
                  className={`relative pl-6 border-l-2 space-y-5 my-2 ${
                    isHousewarming
                      ? 'border-emerald-500/35'
                      : isCardDayOne
                      ? 'border-amber-500/30'
                      : 'border-rose-500/30'
                  }`}
                >
                  {shift.timeLine.map((item, idx) => (
                    <motion.div
                      key={`sched-item-${shiftIndex}-${idx}-${item.id || idx}`}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      className="relative group"
                    >
                      {/* Timeline dot with ceremony icon */}
                      <div
                        className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center group-hover:scale-110 transition-all ${
                          isHousewarming
                            ? theme === 'light'
                              ? 'bg-[#f8f5eb] border-emerald-700 shadow-sm'
                              : 'bg-[#062017] border-[#f4cb5c] shadow-md'
                            : theme === 'light'
                            ? 'bg-white border-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:border-amber-300'
                            : 'bg-black border-amber-400 shadow-black/60 shadow-md group-hover:border-amber-300'
                        }`}
                      >
                        {getIcon(item.icon)}
                      </div>

                      {/* Card */}
                      <div
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all shadow-sm ${
                          isHousewarming
                            ? theme === 'light'
                              ? 'bg-white/90 hover:bg-emerald-50/60 border-emerald-700/20 hover:border-emerald-700/45'
                              : 'bg-[#041711]/75 hover:bg-[#07261c]/85 border-emerald-500/25 hover:border-[#f4cb5c]/50'
                            : theme === 'light'
                            ? 'bg-amber-50/50 hover:bg-amber-100/50 border-amber-200 hover:border-amber-400'
                            : 'bg-black/50 hover:bg-black/70 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider font-mono border ${
                              isHousewarming
                                ? theme === 'light'
                                  ? 'bg-emerald-100/80 text-[#0e5c40] border-emerald-700/25'
                                  : 'bg-emerald-950/70 text-[#f4cb5c] border-[#f4cb5c]/35'
                                : theme === 'light'
                                ? 'bg-amber-200/50 text-amber-800 border-amber-300'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {item.time}
                          </span>
                        </div>
                        <h4
                          className={`text-xs sm:text-sm font-semibold font-khmer leading-snug ${
                            isHousewarming
                              ? theme === 'light'
                                ? 'text-[#103b2a]'
                                : 'text-[#fef8e8]'
                              : theme === 'light'
                              ? 'text-amber-950'
                              : 'text-amber-100'
                          }`}
                        >
                          {language === 'kh' ? item.name : item.nameEn || item.name}
                        </h4>
                        {language === 'en' && item.nameEn && (
                          <p
                            className={`text-[11px] font-sans mt-0.5 ${
                              isHousewarming
                                ? theme === 'light'
                                  ? 'text-emerald-900/70'
                                  : 'text-emerald-200/70'
                                : theme === 'light'
                                ? 'text-neutral-600'
                                : 'text-neutral-400'
                            }`}
                          >
                            {item.nameEn}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative flourish */}
        <div className="flex items-center justify-center my-6">
          <img
            src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/underline-kbach-2.png"
            alt=""
            className="w-40 opacity-70"
          />
        </div>
      </motion.div>
    </section>
  );
}

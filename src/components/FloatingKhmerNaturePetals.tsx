import { motion, useReducedMotion } from 'motion/react';
import { ThemeMode } from './ThemeToggle';

const BOTANICAL_PETALS = [
  { id: 'p1', left: '8%', delay: 0, dur: 11, size: 16, sway: 22, kind: 'leaf' as const },
  { id: 'p2', left: '19%', delay: 2.2, dur: 13, size: 12, sway: -18, kind: 'lotus' as const },
  { id: 'p3', left: '34%', delay: 4.1, dur: 12, size: 14, sway: 20, kind: 'leaf' as const },
  { id: 'p4', left: '66%', delay: 1.5, dur: 14, size: 13, sway: -22, kind: 'lotus' as const },
  { id: 'p5', left: '81%', delay: 3.4, dur: 11.5, size: 15, sway: 18, kind: 'leaf' as const },
  { id: 'p6', left: '92%', delay: 0.8, dur: 12.5, size: 11, sway: -16, kind: 'firefly' as const },
  { id: 'p7', left: '14%', delay: 5.5, dur: 10.5, size: 8, sway: 14, kind: 'firefly' as const },
  { id: 'p8', left: '87%', delay: 6.0, dur: 12, size: 8, sway: -14, kind: 'firefly' as const },
];

export default function FloatingKhmerNaturePetals({ theme = 'dark' }: { theme?: ThemeMode }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const isLight = theme === 'light';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {BOTANICAL_PETALS.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: '-8vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '108vh',
            x: [0, petal.sway, -petal.sway * 0.6, petal.sway * 0.4, 0],
            opacity: [0, 0.72, 0.68, 0.45, 0],
            rotate: [0, 35, -20, 45, 10],
          }}
          transition={{
            duration: petal.dur,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ left: petal.left }}
          className="absolute top-0"
        >
          {petal.kind === 'leaf' ? (
            <svg
              width={petal.size}
              height={petal.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2C12 2 5 7 5 14C5 18.5 8.1 21.5 12 22C15.9 21.5 19 18.5 19 14C19 7 12 2 12 2Z"
                fill={isLight ? 'rgba(20, 110, 74, 0.35)' : 'rgba(52, 211, 153, 0.35)'}
                stroke={isLight ? 'rgba(138, 90, 16, 0.45)' : 'rgba(244, 203, 92, 0.45)'}
                strokeWidth="1"
              />
              <path
                d="M12 4V21"
                stroke={isLight ? 'rgba(138, 90, 16, 0.4)' : 'rgba(244, 203, 92, 0.4)'}
                strokeWidth="0.9"
              />
            </svg>
          ) : petal.kind === 'lotus' ? (
            <svg
              width={petal.size}
              height={petal.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3C9 8 8 14 12 20C16 14 15 8 12 3Z"
                fill={isLight ? 'rgba(219, 128, 154, 0.45)' : 'rgba(249, 168, 212, 0.38)'}
                stroke={isLight ? 'rgba(180, 100, 120, 0.4)' : 'rgba(251, 207, 232, 0.45)'}
                strokeWidth="0.8"
              />
            </svg>
          ) : (
            <span
              className="block rounded-full"
              style={{
                width: petal.size,
                height: petal.size,
                background: isLight
                  ? 'radial-gradient(circle, rgba(212,175,55,0.65) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(253,224,71,0.75) 0%, transparent 70%)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

'use client';
import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;
const HEADLINE = ['СОЗДАЙ', 'ФОРМУ', 'СВОЕЙ', 'КОМАНДЫ'];
const ACCENT = 3;

const line = {
  hidden: { y: '115%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.95, delay: 0.5 + i * 0.11, ease: EASE },
  }),
};
const fade = (delay: number) => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: EASE } },
});

// Детерминированные частицы (без Math.random — без рассинхрона гидрации)
const REAR = [
  { x: 30, y: 34, s: 2, d: 0.0, dur: 9 },
  { x: 52, y: 22, s: 3, d: 1.4, dur: 11 },
  { x: 66, y: 46, s: 2, d: 0.7, dur: 8 },
  { x: 78, y: 30, s: 2, d: 2.0, dur: 10 },
  { x: 60, y: 64, s: 3, d: 1.1, dur: 12 },
  { x: 84, y: 56, s: 2, d: 0.4, dur: 9 },
  { x: 44, y: 52, s: 2, d: 1.7, dur: 11 },
  { x: 72, y: 18, s: 2, d: 2.4, dur: 8.5 },
];
const FRONT = [
  { x: 46, y: 82, s: 4, d: 0.2, dur: 6 },
  { x: 58, y: 90, s: 5, d: 1.0, dur: 5.5 },
  { x: 70, y: 84, s: 3, d: 1.8, dur: 6.5 },
  { x: 82, y: 92, s: 4, d: 0.6, dur: 5 },
  { x: 64, y: 76, s: 3, d: 2.2, dur: 7 },
  { x: 90, y: 80, s: 3, d: 1.3, dur: 6.2 },
];

function TrustIcon({ kind }: { kind: 'kit' | 'factory' | 'shield' }) {
  const common = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
  if (kind === 'kit')
    return (
      <svg {...common}>
        <path d="M8 4l4 2 4-2 4 3-2 3-2-1v9H8v-9L6 10 4 7l4-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'factory')
    return (
      <svg {...common}>
        <path d="M3 20V9l6 4V9l6 4V6l6 3v11H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const TRUST = [
  { kind: 'factory' as const, label: 'Собственное производство' },
  { kind: 'shield' as const, label: 'Работаем с 2004 года' },
  { kind: 'kit' as const, label: 'От 5 комплектов' },
];

/** Компактная премиальная строка преимуществ с разделителями «·». */
function TrustRow({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-ink2 ${className}`}>
      {TRUST.map((t, i) => (
        <li key={t.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="mr-1 hidden text-line2 sm:inline">·</span>}
          <span className="text-red"><TrustIcon kind={t.kind} /></span>
          <span className="text-[12.5px] font-medium tracking-[0.01em]">{t.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Headline({ reduce }: { reduce: boolean | null }) {
  return (
    <h1 className="font-display font-black uppercase leading-[0.9] tracking-[-0.02em] text-ink text-[clamp(40px,6.4vw,84px)]">
      {HEADLINE.map((w, i) => (
        <span key={w} className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            style={i === ACCENT ? { color: '#E4141C' } : undefined}
            custom={i}
            variants={reduce ? undefined : line}
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'show'}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function Ctas({ studioHref, compact }: { studioHref: string; compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-3.5 sm:flex-row sm:items-center'}>
      <a
        href={studioHref}
        onClick={() => track('create_form_click', { place: 'hockey_hero' })}
        className={`group inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-full bg-red px-8 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(228,20,28,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${compact ? 'w-full' : ''}`}
      >
        Рассчитать стоимость
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <a
        href="#production"
        className={`group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full pr-6 text-[15px] font-semibold text-ink transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${compact ? 'pl-6' : 'pl-2'}`}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        Смотреть видео
      </a>
    </div>
  );
}

function Particles({ set, className }: { set: typeof REAR; className: string }) {
  return (
    <div className={className} aria-hidden>
      {set.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 0 6px rgba(180,210,240,0.9)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.d, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/**
 * HockeyHero — доведённый премиальный Hero /hockey. Многослойная сцена
 * (фон-градиент · дальний туман · свечение · красная энерго-линия · игрок-
 * вырезка через object-contain · ледяные частицы сзади и спереди · текст),
 * а не одна плоская картинка. Игрок целиком в кадре (шлем/руки/ноги/коньки/
 * клюшка), воздух над шлемом. Премиальные анимации: intro-zoom + clip-path,
 * очень слабое дыхание, параллакс 8–12px, курсор-реактивная красная линия,
 * медленный туман, частицы на разной скорости. Уважает prefers-reduced-motion.
 */
export function HockeyHero({ studioHref = '#lead' }: { studioHref?: string }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 22 });
  const sy = useSpring(my, { stiffness: 45, damping: 22 });

  // Параллакс слоёв на разной скорости (игрок — не более 8–12px)
  const playerX = useTransform(sx, [-0.5, 0.5], [11, -11]);
  const playerY = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const fogX = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const glowX = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rearX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const frontX = useTransform(sx, [-0.5, 0.5], [34, -34]);
  const lineX = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const lineRot = useTransform(sx, [-0.5, 0.5], [-2.5, 2.5]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={stage}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label="Хоккейная форма на заказ"
      className="relative min-h-[100svh] w-full overflow-hidden bg-white"
    >
      {/* L0 — фон-градиент */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_100%_at_72%_28%,#FFFFFF_0%,#EEF3F9_52%,#E3EBF4_100%)]" />

      {/* L1 — дальний туман (медленный дрейф) */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={reduce ? undefined : { x: fogX }}>
        <motion.div
          className="absolute right-[6%] top-[10%] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_64%)] blur-[10px]"
          animate={reduce ? undefined : { x: [0, 26, 0], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[38%] bottom-[6%] h-[44vh] w-[52vw] rounded-full bg-[radial-gradient(circle,rgba(214,228,242,0.6),transparent_70%)] blur-[14px]"
          animate={reduce ? undefined : { x: [0, -30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* L2 — свечение за игроком */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[16%] h-[68vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85),rgba(230,240,250,0.25)_46%,transparent_70%)]"
        style={reduce ? undefined : { x: glowX }}
      />

      {/* L3 — красная энерго-линия (реагирует на курсор) */}
      <motion.svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        style={reduce ? undefined : { x: lineX, rotate: lineRot }}
      >
        <motion.path
          d="M70 250 C 260 180, 470 250, 640 360 C 820 476, 1010 470, 1210 372"
          stroke="#E4141C"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
          animate={reduce ? undefined : { pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
        />
      </motion.svg>

      {/* L4 — ледяные частицы сзади */}
      {!reduce && <motion.div className="pointer-events-none absolute inset-0" style={{ x: rearX }}><Particles set={REAR} className="absolute inset-0" /></motion.div>}

      {/* L5 — хоккеист (вырезка, object-contain) — DESKTOP */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[clamp(96px,13svh,150px)] z-[2] hidden lg:left-[26%] lg:block"
        style={reduce ? undefined : { x: playerX, y: playerY }}
      >
        <motion.div
          className="relative h-full w-full will-change-transform"
          initial={reduce ? undefined : { opacity: 0, scale: 1.04, x: 26, clipPath: 'inset(0% 0% 10% 0%)' }}
          animate={reduce ? undefined : { opacity: 1, scale: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduce ? undefined : { scale: [1, 1.008, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/assets/hero/hockey-player.webp"
              alt="Хоккеист команды-клиента в форме с логотипом их клуба на льду"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 74vw"
              className="object-contain object-bottom lg:object-[right_bottom]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* L6 — ледяные частицы спереди */}
      {!reduce && <motion.div className="pointer-events-none absolute inset-0 z-[3]" style={{ x: frontX }}><Particles set={FRONT} className="absolute inset-0" /></motion.div>}

      {/* L7 — текст и управление */}
      <div className="relative z-[4] flex min-h-[100svh] flex-col pt-[92px]">
        <Container className="flex flex-1 flex-col">
          {/* ═══ DESKTOP ═══ */}
          <motion.div
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'show'}
            className="hidden flex-1 items-center lg:flex"
          >
            <div className="max-w-[42%]">
              <motion.div variants={fade(0.2)} className="mb-6 inline-flex items-center gap-3">
                <span className="h-px w-8 bg-red" />
                <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-red">Создаём командный дух</span>
              </motion.div>
              <Headline reduce={reduce} />
              <motion.p variants={fade(1.0)} className="mt-7 max-w-[40ch] text-[17px] leading-relaxed text-ink2 sm:text-[18px]">
                Разработаем дизайн. Изготовим форму. Нанесём символику вашей команды.
                Минимальный заказ — <b className="font-semibold text-ink">от 5 комплектов</b>.
              </motion.p>
              <motion.div variants={fade(1.12)} className="mt-9">
                <Ctas studioHref={studioHref} />
              </motion.div>
              <motion.div variants={fade(1.28)} className="mt-10">
                <TrustRow />
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ MOBILE ═══ */}
          <motion.div
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'show'}
            className="flex flex-1 flex-col lg:hidden"
          >
            <div className="relative z-[4] pt-2">
              <motion.div variants={fade(0.2)} className="mb-3.5 inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-red" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-red">Создаём командный дух</span>
              </motion.div>
              <Headline reduce={reduce} />
            </div>

            {/* хоккеист — своя мобильная раскладка (целиком в кадре, без наложения на текст) */}
            <div className="relative min-h-0 flex-1">
              <motion.div
                className="absolute inset-x-[-8%] bottom-0 top-0 will-change-transform"
                initial={reduce ? undefined : { opacity: 0, scale: 1.04, y: 18, clipPath: 'inset(0% 0% 8% 0%)' }}
                animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
              >
                <Image
                  src="/assets/hero/hockey-player.webp"
                  alt="Хоккеист команды-клиента в форме с логотипом их клуба на льду"
                  fill
                  priority
                  sizes="116vw"
                  className="object-contain object-bottom"
                />
              </motion.div>
            </div>

            <motion.div variants={fade(1.0)} className="relative z-[4] pb-6">
              <Ctas studioHref={studioHref} compact />
              <TrustRow className="mt-5 justify-center" />
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

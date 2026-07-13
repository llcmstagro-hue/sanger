'use client';
import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';
import { Container } from '@/components/ui/Container';
import type { Atmosphere } from '@/lib/atmosphere';

export interface HeroCta {
  label: string;
  href: string;
  onClick?: () => void;
}

interface Props {
  kicker: string;
  /** заголовок построчно — крупный, смелый, uppercase */
  lines: string[];
  /** индексы строк, которые красим красным */
  accentLines?: number[];
  sub: string;
  primary: HeroCta;
  secondary?: HeroCta;
  note?: string;
  atmosphere: Atmosphere;
  /** реальное фото спортсмена (когда появится) — иначе премиум-плейсхолдер */
  imageSrc?: string;
  imageAlt?: string;
}

// Детерминированные частицы — без Math.random, чтобы не ловить рассинхрон гидрации.
const PARTICLES = [
  { x: 12, y: 18, s: 3, d: 0 },
  { x: 28, y: 62, s: 2, d: 1.4 },
  { x: 44, y: 32, s: 4, d: 0.6 },
  { x: 63, y: 74, s: 2, d: 2.1 },
  { x: 78, y: 24, s: 3, d: 1.1 },
  { x: 88, y: 56, s: 2, d: 0.3 },
  { x: 20, y: 84, s: 3, d: 1.8 },
  { x: 54, y: 12, s: 2, d: 2.5 },
  { x: 70, y: 44, s: 3, d: 0.9 },
  { x: 36, y: 50, s: 2, d: 1.6 },
];

const wordVariant = {
  hidden: { y: '112%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.12 + i * 0.11, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function PlayIcon() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:scale-110">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function AtmosphereHero({
  kicker,
  lines,
  accentLines = [],
  sub,
  primary,
  secondary,
  note,
  atmosphere,
  imageSrc,
  imageAlt,
}: Props) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);

  // тилт по указателю
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-7, 7]);

  // параллакс по скроллу
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end start'],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const particleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const figureScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06]);

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
      ref={section}
      className="relative overflow-hidden pt-[112px] sm:pt-[128px]"
      style={{ background: `linear-gradient(180deg, ${atmosphere.tint} 0%, #FFFFFF 62%)` }}
    >
      {/* живой свет за фигурой — нейтральный, не цветной */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-[4%] hidden h-[640px] w-[640px] rounded-full blur-[6px] lg:block"
        style={{ background: `radial-gradient(circle, ${atmosphere.light}, transparent 68%)` }}
      />

      <Container>
        <div className="grid items-center gap-10 pb-16 lg:grid-cols-[1.04fr_.96fr] lg:gap-8 lg:pb-24">
          {/* ЛЕВО — текст */}
          <div className="relative z-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line2 bg-white/60 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ink2 backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ background: atmosphere.stitch }}
                  />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: atmosphere.stitch }} />
              </span>
              {kicker}
            </motion.div>

            <h1 className="font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-ink text-[clamp(44px,9vw,104px)]">
              {lines.map((w, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block will-change-transform"
                    style={accentLines.includes(i) ? { color: atmosphere.stitch } : undefined}
                    custom={i}
                    variants={reduce ? undefined : wordVariant}
                    initial={reduce ? false : 'hidden'}
                    animate={reduce ? undefined : 'show'}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* красная строчка */}
            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 h-px w-[132px] origin-left"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${atmosphere.stitch} 0 10px, transparent 10px 18px)`,
              }}
            />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.78 }}
              className="mt-7 max-w-[42ch] text-[17px] leading-relaxed text-muted sm:text-[19px]"
            >
              {sub}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href={primary.href}
                onClick={primary.onClick}
                className="group inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-full px-8 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(228,20,28,0.75)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: atmosphere.stitch, outlineColor: atmosphere.stitch }}
              >
                {primary.label}
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {secondary && (
                <a
                  href={secondary.href}
                  onClick={secondary.onClick}
                  className="group inline-flex min-h-[58px] items-center justify-start gap-3 rounded-full pl-2 pr-6 text-[15px] font-semibold text-ink transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <PlayIcon />
                  {secondary.label}
                </a>
              )}
            </motion.div>

            {note && (
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.05 }}
                className="mt-9 font-sans text-[12.5px] uppercase tracking-[0.12em] text-muted"
              >
                {note}
              </motion.p>
            )}
          </div>

          {/* ПРАВО — сцена со спортсменом */}
          <motion.div
            ref={stage}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ y: figureY }}
            className="relative"
          >
            <motion.div
              style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1200, scale: figureScale }}
              className="relative"
            >
              {/* «дыхание» */}
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0], scale: [1, 1.012, 1] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[26px] border border-line bg-white shadow-[0_50px_90px_-50px_rgba(17,17,17,0.5)]"
              >
                {imageSrc ? (
                  <Image src={imageSrc} alt={imageAlt || ''} fill priority sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
                ) : (
                  <PremiumFigure atmosphere={atmosphere} />
                )}

                {/* контровой блик */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(120% 80% at 78% 12%, rgba(255,255,255,0.55), transparent 46%)' }}
                />
              </motion.div>
            </motion.div>

            {/* микрочастицы над сценой */}
            {!reduce && (
              <motion.div style={{ y: particleY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
                {PARTICLES.map((p, i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: p.s,
                      height: p.s,
                      background: atmosphere.particle === 'smoke' ? 'rgba(120,124,130,0.5)' : 'rgba(255,255,255,0.9)',
                      boxShadow: atmosphere.particle === 'ice' ? '0 0 6px rgba(180,210,240,0.9)' : 'none',
                    }}
                    animate={{ y: [0, -14, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: p.d, ease: 'easeInOut' }}
                  />
                ))}
              </motion.div>
            )}

            {/* подпись-атмосфера */}
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">{atmosphere.scene}</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">{atmosphere.temperature}</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Премиум-плейсхолдер: студийный кадр джерси (сам продукт) с бейджем
// «ВАШ ЛОГОТИП» на груди и клиентским клубом. Заменяется на next/image
// с реальным фото спортсмена без изменения вёрстки.
function PremiumFigure({ atmosphere }: { atmosphere: Atmosphere }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#FDFDFE_0%,#EDEEF1_100%)]">
      <svg viewBox="0 0 400 500" className="h-[92%] w-[92%] drop-shadow-[0_40px_60px_rgba(17,17,17,0.28)]" role="img" aria-label="Игровая форма с логотипом вашего клуба">
        <defs>
          <linearGradient id="fabric" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#26282F" />
            <stop offset="0.5" stopColor="#15171C" />
            <stop offset="1" stopColor="#0C0D11" />
          </linearGradient>
          <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* тень на поверхности */}
        <ellipse cx="200" cy="466" rx="118" ry="14" fill="rgba(17,17,17,0.12)" />

        {/* корпус джерси (перёд, короткий рукав) */}
        <path
          d="M172 150 L128 160 L70 206 L86 252 L120 232 L112 436 Q200 456 288 436 L280 232 L314 252 L330 206 L272 160 L228 150 Q200 180 172 150 Z"
          fill="url(#fabric)"
        />
        {/* мягкий вертикальный блик по ткани */}
        <rect x="150" y="150" width="100" height="300" fill="url(#sheen)" />

        {/* воротник-рибана */}
        <path d="M172 150 Q200 180 228 150" fill="none" stroke="#34363E" strokeWidth="7" strokeLinecap="round" />

        {/* красная строчка: боковые швы + манжеты */}
        <g stroke={atmosphere.stitch} strokeWidth="2.4" strokeDasharray="9 7" opacity="0.9" fill="none">
          <path d="M118 250 L110 430" />
          <path d="M282 250 L290 430" />
          <path d="M74 240 L84 250" />
          <path d="M326 240 L316 250" />
        </g>
      </svg>

      {/* бейдж «ВАШ ЛОГОТИП» на груди */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
        <div className="grid h-[74px] w-[74px] place-items-center rounded-full border-2 border-dashed border-white/45">
          <span className="text-center font-sans text-[8.5px] font-bold uppercase leading-tight tracking-[0.12em] text-white/80">
            ВАШ<br />ЛОГОТИП
          </span>
        </div>
      </div>

      {/* тег клиентского клуба */}
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink px-5 py-2 font-display text-[12px] font-bold uppercase tracking-[0.22em] text-white shadow-lg">
        {atmosphere.clientClub}
      </span>
    </div>
  );
}

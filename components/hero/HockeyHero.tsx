'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
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
const ACCENT = 3; // «КОМАНДЫ» красным

// Детерминированные частицы льда — без Math.random (без рассинхрона гидрации)
const PARTICLES = [
  { x: 16, y: 26, s: 3, d: 0.0, dur: 7 },
  { x: 34, y: 66, s: 2, d: 1.4, dur: 6 },
  { x: 52, y: 20, s: 4, d: 0.6, dur: 8 },
  { x: 61, y: 78, s: 2, d: 2.1, dur: 6.5 },
  { x: 72, y: 34, s: 3, d: 1.1, dur: 7.5 },
  { x: 84, y: 58, s: 2, d: 0.3, dur: 6 },
  { x: 24, y: 84, s: 3, d: 1.8, dur: 8 },
  { x: 46, y: 46, s: 2, d: 2.5, dur: 6.8 },
  { x: 90, y: 30, s: 3, d: 0.9, dur: 7.2 },
  { x: 8, y: 54, s: 2, d: 1.6, dur: 6.4 },
  { x: 66, y: 12, s: 2, d: 2.0, dur: 7.8 },
  { x: 40, y: 90, s: 3, d: 0.5, dur: 6.6 },
];

const line = {
  hidden: { y: '115%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.95, delay: 0.5 + i * 0.11, ease: EASE },
  }),
};
const fade = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: EASE } },
});

function TrustIcon({ kind }: { kind: 'kit' | 'factory' | 'shield' }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
  if (kind === 'kit')
    return (
      <svg {...common}>
        <path d="M8 4l4 2 4-2 4 3-2 3-2-1v9H8v-9L6 10 4 7l4-3z" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'factory')
    return (
      <svg {...common}>
        <path d="M3 20V9l6 4V9l6 4V6l6 3v11H3z" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3z" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#E4141C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TRUST = [
  { kind: 'factory' as const, label: 'собственное\nпроизводство' },
  { kind: 'shield' as const, label: 'работаем\nс 2004 года' },
  { kind: 'kit' as const, label: 'от 5\nкомплектов' },
];

/**
 * HockeyHero — эталонный hero хоккейной страницы (TASK 001).
 * Светлый ледяной фон (CSS), огромный спортсмен-вырезка встроен в сцену,
 * красная швейная нить с узлом и настоящей иглой уходит ЗА спортсмена,
 * дыхание / блик по шлему / микрочастицы / деликатный параллакс на разных
 * скоростях. Полностью уважает prefers-reduced-motion. Мобайл — отдельная сцена.
 */
export function HockeyHero({ studioHref = '#lead' }: { studioHref?: string }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const threadWrap = useRef<SVGGElement>(null);
  const needleRef = useRef<SVGGElement>(null);

  // Параллакс по указателю — у каждого слоя своя скорость
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const playerX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const playerY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const threadX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const particlesX = useTransform(sx, [-0.5, 0.5], [26, -26]);
  const glowX = useTransform(sx, [-0.5, 0.5], [-6, 6]);

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

  // Красная нить: прошивается на старте (GSAP-таймлайн), затем едва колышется.
  useEffect(() => {
    if (reduce || !threadRef.current) return;
    const path = threadRef.current;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    if (needleRef.current) gsap.set(needleRef.current, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({ delay: 0.35 });
    tl.to(path, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut' });
    if (needleRef.current) tl.to(needleRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, '-=0.35');

    const sway = threadWrap.current
      ? gsap.to(threadWrap.current, {
          y: 5,
          rotate: 0.5,
          transformOrigin: '50% 50%',
          repeat: -1,
          yoyo: true,
          duration: 5.5,
          ease: 'sine.inOut',
        })
      : null;

    return () => {
      tl.kill();
      sway?.kill();
    };
  }, [reduce]);

  return (
    <section
      ref={stage}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label="Хоккейная форма на заказ"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white pt-[74px]"
    >
      {/* ── Ледяной фон (CSS) ─────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_72%_18%,#FFFFFF_0%,#EEF4FA_46%,#E4EDF6_100%)]" />
        {/* туман */}
        <motion.div
          style={reduce ? undefined : { x: glowX }}
          className="absolute right-[-6%] top-[8%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_62%)] blur-[8px]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.85))]" />
        {/* нижняя ледяная дымка/отражение под коньками */}
        <div className="absolute bottom-[6%] left-[46%] h-[16vh] w-[48vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(200,220,240,0.55),transparent)] blur-md" />
      </div>

      {/* ── Красная швейная нить + игла (слой ЗА спортсменом) ─────────── */}
      <motion.svg
        aria-hidden
        style={reduce ? undefined : { x: threadX }}
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="needleMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C9CDd4" />
            <stop offset="0.5" stopColor="#8A9099" />
            <stop offset="1" stopColor="#EDEFF3" />
          </linearGradient>
        </defs>
        <g ref={threadWrap}>
          <path
            ref={threadRef}
            d="M70 250 C 210 205, 330 250, 425 330 C 500 396, 470 476, 398 470 C 336 465, 350 372, 432 378 C 566 388, 720 336, 940 306 C 1120 282, 1250 330, 1352 452"
            stroke="#E4141C"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* игла на конце нити */}
          <g ref={needleRef}>
            <line x1="1352" y1="452" x2="1410" y2="560" stroke="url(#needleMetal)" strokeWidth="5" strokeLinecap="round" />
            <line x1="1352" y1="452" x2="1410" y2="560" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="1358" cy="463" rx="3.4" ry="7" fill="none" stroke="url(#needleMetal)" strokeWidth="2.4" transform="rotate(28 1358 463)" />
          </g>
        </g>
      </motion.svg>

      {/* ── Микрочастицы льда ─────────────────────────────────────────── */}
      {!reduce && (
        <motion.div style={{ x: particlesX }} className="pointer-events-none absolute inset-0" aria-hidden>
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 0 6px rgba(180,210,240,0.9)',
              }}
              animate={{ y: [0, -16, 0], opacity: [0, 1, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.d, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Контент ───────────────────────────────────────────────────── */}
      <Container className="relative z-10 flex flex-1 flex-col">
        {/* ═══ DESKTOP ═══ */}
        <div className="hidden w-full flex-1 items-center gap-6 lg:grid lg:grid-cols-[1.02fr_.98fr]">
          {/* ЛЕВО — текст */}
          <div className="relative z-20">
            <motion.div
              variants={fade(0.15)}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'show'}
              className="mb-6 inline-flex items-center gap-3"
            >
              <span className="h-px w-8 bg-red" />
              <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-red">
                Создаём командный дух
              </span>
            </motion.div>

            <h1 className="font-display font-black uppercase leading-[0.9] tracking-[-0.02em] text-ink text-[clamp(44px,7.4vw,92px)]">
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

            <motion.p
              variants={fade(1.0)}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'show'}
              className="mt-7 max-w-[44ch] text-[16px] leading-relaxed text-muted sm:text-[18px]"
            >
              Разработаем дизайн. Изготовим форму. Нанесём символику вашей команды.
              Минимальный заказ — <b className="font-semibold text-ink">от 5 комплектов</b>.
            </motion.p>

            <motion.div
              variants={fade(1.12)}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'show'}
              className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <a
                href={studioHref}
                onClick={() => track('create_form_click', { place: 'hockey_hero' })}
                className="group inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-full bg-red px-8 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(228,20,28,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              >
                Рассчитать стоимость
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#production"
                className="group inline-flex min-h-[58px] items-center justify-start gap-3 rounded-full bg-white/70 pl-2 pr-6 text-[15px] font-semibold text-ink backdrop-blur transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Смотреть видео
              </a>
            </motion.div>

            <motion.ul
              variants={fade(1.28)}
              initial={reduce ? undefined : 'hidden'}
              animate={reduce ? undefined : 'show'}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line2 bg-white/60">
                    <TrustIcon kind={t.kind} />
                  </span>
                  <span className="whitespace-pre-line text-[12.5px] font-medium uppercase leading-tight tracking-[0.06em] text-ink2">
                    {t.label}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ПРАВО — спортсмен, встроенный в сцену (desktop) */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, x: 90 }}
            animate={reduce ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.25 }}
            style={reduce ? undefined : { x: playerX, y: playerY }}
            className="pointer-events-none relative z-10 hidden lg:block"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto aspect-[1423/1787] w-[min(52vw,720px)]"
            >
              <Image
                src="/assets/hero/hockey-player.webp"
                alt="Хоккеист в форме с логотипом клуба на груди"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 52vw"
                className="object-contain drop-shadow-[0_60px_60px_rgba(17,17,17,0.22)]"
              />
              {/* блик по шлему раз в ~10с */}
              {!reduce && (
                <motion.div
                  aria-hidden
                  className="absolute left-[40%] top-[2%] h-[22%] w-[34%] -rotate-[18deg] rounded-full bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.85),transparent)] blur-[2px]"
                  animate={{ x: ['-60%', '160%'], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 9, ease: 'easeInOut' }}
                />
              )}
            </motion.div>
            {/* ледяная пыль под коньками */}
            <div aria-hidden className="absolute bottom-[4%] left-1/2 h-[10%] w-[60%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),transparent)] blur-[3px]" />
          </motion.div>

        </div>

        {/* ═══ MOBILE (отдельная композиция, всё в первом экране) ═══ */}
        <div className="flex w-full flex-1 flex-col lg:hidden">
          <div className="pt-3">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="mb-3.5 inline-flex items-center gap-2.5"
            >
              <span className="h-px w-6 bg-red" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-red">
                Создаём командный дух
              </span>
            </motion.div>

            <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em] text-ink text-[clamp(38px,11.2vw,56px)]">
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
          </div>

          {/* спортсемен — главный объект, забирает всё оставшееся место */}
          <div className="relative -mx-5 min-h-0 flex-1">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.35 }}
              className="pointer-events-none absolute inset-0"
            >
              <Image
                src="/assets/hero/hockey-player.webp"
                alt="Хоккеист в форме с логотипом клуба на груди"
                fill
                priority
                sizes="100vw"
                className="object-contain object-bottom drop-shadow-[0_36px_44px_rgba(17,17,17,0.2)]"
              />
            </motion.div>
            <div aria-hidden className="absolute bottom-[4%] left-1/2 h-[8%] w-[62%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),transparent)] blur-[3px]" />
            {/* скрим снизу, чтобы CTA читались поверх коньков */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(238,244,250,0.92)_78%)]" />
          </div>

          {/* CTA + доверие — прижаты к низу, поверх скрима */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="relative z-20 -mt-6 pb-5"
          >
            <a
              href={studioHref}
              onClick={() => track('create_form_click', { place: 'hockey_hero' })}
              className="group flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full bg-red px-6 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(228,20,28,0.75)] transition-all duration-300 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              Рассчитать стоимость
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#production" className="mt-3 flex items-center justify-center gap-2.5 text-[14px] font-semibold text-ink">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Смотреть видео
            </a>
            <ul className="mt-5 grid grid-cols-3 gap-2">
              {TRUST.map((t) => (
                <li key={t.label} className="flex min-w-0 items-center gap-1.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line2 bg-white/70">
                    <TrustIcon kind={t.kind} />
                  </span>
                  <span className="min-w-0 text-[9px] font-semibold uppercase leading-[1.2] tracking-[0.01em] text-ink2">
                    {t.label.replace('\n', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

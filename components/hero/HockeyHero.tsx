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
    transition: { duration: 0.95, delay: 0.45 + i * 0.11, ease: EASE },
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

function Eyebrow() {
  return (
    <motion.div
      variants={fade(0.15)}
      className="mb-6 inline-flex items-center gap-3"
    >
      <span className="h-px w-8 bg-red" />
      <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-red">
        Создаём командный дух
      </span>
    </motion.div>
  );
}

function Headline({ reduce }: { reduce: boolean | null }) {
  return (
    <h1 className="font-display font-black uppercase leading-[0.9] tracking-[-0.02em] text-ink text-[clamp(42px,7vw,88px)]">
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
        className={`group inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-red px-8 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(228,20,28,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${compact ? 'w-full' : ''}`}
      >
        Рассчитать стоимость
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <a
        href="#production"
        className={`group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full pr-6 text-[15px] font-semibold text-ink transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${compact ? 'pl-6' : 'pl-2'}`}
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

/**
 * HockeyHero v2 — рекламный кадр элитной экипировки: игрок справа целиком
 * (вся клюшка и коньки в кадре), слева — воздух под интерфейс. Полноэкранное
 * фото ледяной сцены (Higgsfield Soul 2.0), поверх — живой текст с масочным
 * релизом, CTA, доверие; деликатный параллакс фото по указателю и медленный
 * Ken-Burns. Всё уважает prefers-reduced-motion. Мобайл — своя раскладка.
 */
export function HockeyHero({ studioHref = '#lead' }: { studioHref?: string }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 22 });
  const sy = useSpring(my, { stiffness: 45, damping: 22 });
  const sceneX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const sceneY = useTransform(sy, [-0.5, 0.5], [10, -10]);

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
      {/* ── Полноэкранная ледяная сцена ─────────────────────────────── */}
      <motion.div aria-hidden className="absolute inset-0" style={reduce ? undefined : { x: sceneX, y: sceneY }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? undefined : { scale: 1.12, opacity: 0 }}
          animate={reduce ? undefined : { scale: 1.06, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Image
            src="/assets/hero/hockey-scene.webp"
            alt="Хоккеист команды-клиента в форме с логотипом их клуба на льду"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] lg:object-center"
          />
        </motion.div>
      </motion.div>

      {/* ── Скримы для читаемости текста ────────────────────────────── */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#FFFFFF_0%,rgba(255,255,255,0.92)_26%,rgba(255,255,255,0.45)_46%,rgba(255,255,255,0)_64%)] lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.72)_22%,rgba(255,255,255,0.05)_46%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.9)_100%)] lg:hidden" />
      </div>

      {/* ── Контент ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-[100svh] flex-col pt-[74px]">
        <Container className="flex flex-1 flex-col">
          {/* ═══ DESKTOP ═══ */}
          <motion.div
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'show'}
            className="hidden flex-1 items-center lg:flex"
          >
            <div className="max-w-[50%]">
              <Eyebrow />
              <Headline reduce={reduce} />
              <motion.p variants={fade(0.95)} className="mt-7 max-w-[40ch] text-[17px] leading-relaxed text-ink2 sm:text-[18px]">
                Разработаем дизайн. Изготовим форму. Нанесём символику вашей команды.
                Минимальный заказ — <b className="font-semibold text-ink">от 5 комплектов</b>.
              </motion.p>
              <motion.div variants={fade(1.08)} className="mt-9">
                <Ctas studioHref={studioHref} />
              </motion.div>
              <motion.ul variants={fade(1.24)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                {TRUST.map((t) => (
                  <li key={t.label} className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-line2 bg-white/70">
                      <TrustIcon kind={t.kind} />
                    </span>
                    <span className="whitespace-pre-line text-[12.5px] font-medium uppercase leading-tight tracking-[0.06em] text-ink2">
                      {t.label}
                    </span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* ═══ MOBILE ═══ */}
          <motion.div
            initial={reduce ? undefined : 'hidden'}
            animate={reduce ? undefined : 'show'}
            className="flex flex-1 flex-col lg:hidden"
          >
            <div className="pt-3">
              <Eyebrow />
              <Headline reduce={reduce} />
            </div>
            <div className="flex-1" />
            <div className="pb-6">
              <motion.p variants={fade(0.95)} className="mb-5 max-w-[34ch] text-[15px] leading-relaxed text-ink2">
                Разработаем дизайн, изготовим форму и нанесём символику вашей команды.
                <b className="font-semibold text-ink"> От 5 комплектов.</b>
              </motion.p>
              <motion.div variants={fade(1.05)}>
                <Ctas studioHref={studioHref} compact />
              </motion.div>
              <motion.ul variants={fade(1.2)} className="mt-6 grid grid-cols-3 gap-2">
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
              </motion.ul>
            </div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

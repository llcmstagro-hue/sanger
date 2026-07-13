'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Placeholder } from '@/components/ui/Placeholder';

type Step = {
  k: string;
  v: string;
  label: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    k: 'Материалы',
    v: 'Дышащие ткани, которые держат цвет и форму сезон за сезоном.',
    label: 'Ткань крупным планом',
    detail: 'Отбор ткани',
  },
  {
    k: 'Пошив',
    v: 'Аккуратные швы и посадка по фигуре на собственном производстве.',
    label: 'Швейная машина · руки мастера',
    detail: 'Крой и пошив',
  },
  {
    k: 'Нанесение',
    v: 'Фамилии, номера и логотип вашего клуба — чётко и надолго.',
    label: 'Нанесение номера',
    detail: 'Печать и вышивка',
  },
  {
    k: 'Контроль',
    v: 'Проверяем каждый комплект перед отправкой и бережно упаковываем.',
    label: 'Готовые комплекты · упаковка',
    detail: 'Контроль качества',
  },
];

function Visual({
  step,
  className,
  style,
}: {
  step: Step;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      <Placeholder label={step.label} ratio="aspect-[4/5]" className="h-full w-full" rounded="rounded-[22px]" />
    </div>
  );
}

// Премиальная секция производства с GSAP-пиннингом: сцена «прилипает»,
// а шаги сменяются по мере скролла (кроссфейд визуала + текста + красный рельс).
// Fallback: до гидрации / при prefers-reduced-motion — доступный стек-грид.
export function Production() {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);

  // 1) решаем, включать ли усиленный режим: десктоп (>=1024px) и вне reduced-motion.
  //    На мобайле — чистый доступный стек, без риска дёрганого пиннинга.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!reduce && desktop) setEnhanced(true);
  }, []);

  // 2) когда пиннинг-разметка смонтирована — навешиваем ScrollTrigger
  useEffect(() => {
    if (!enhanced || !stageRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stageRef.current!,
        start: 'top top',
        end: `+=${STEPS.length * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
          setActive(idx);
          if (railRef.current) {
            railRef.current.style.transform = `scaleY(${self.progress})`;
          }
        },
      });
    }, stageRef);

    // пересчёт после раскладки/загрузки шрифтов
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [enhanced]);

  return (
    <section className="py-16 sm:py-24" id="production">
      <Container>
        <SectionHeading eyebrow="Производство" title={<>Собственное производство</>}>
          Полный цикл под одной крышей: ткань, крой, пошив, нанесение и контроль.
        </SectionHeading>
      </Container>

      {enhanced ? (
        // ── Пиннинг ──────────────────────────────────────────────────────
        <div
          ref={stageRef}
          className="relative flex min-h-[100svh] items-center overflow-hidden"
        >
          <Container className="w-full">
            <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
              {/* ЛЕВО — шаги */}
              <div className="order-2 lg:order-1">
                <div className="mb-8 hidden items-center gap-4 lg:flex">
                  <span className="font-display text-[13px] font-bold tracking-[0.2em] text-red">
                    {String(active + 1).padStart(2, '0')}
                    <span className="text-muted"> / {String(STEPS.length).padStart(2, '0')}</span>
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <ul className="flex flex-col gap-5 sm:gap-6">
                  {STEPS.map((s, i) => {
                    const on = i === active;
                    return (
                      <li key={s.k}>
                        <button
                          type="button"
                          aria-current={on}
                          className="group flex w-full items-start gap-4 text-left"
                          onClick={() => setActive(i)}
                        >
                          <span
                            className="mt-1 h-6 w-6 shrink-0 rounded-full border text-center font-sans text-[11px] font-bold leading-6 transition-colors duration-500"
                            style={{
                              borderColor: on ? '#E4141C' : 'rgba(17,17,17,0.14)',
                              background: on ? '#E4141C' : 'transparent',
                              color: on ? '#fff' : '#6B6B6B',
                            }}
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0">
                            <span
                              className="block font-display text-[24px] font-bold uppercase leading-[1.05] tracking-tight transition-colors duration-500 sm:text-[30px]"
                              style={{ color: on ? '#111' : 'rgba(17,17,17,0.30)' }}
                            >
                              {s.k}
                            </span>
                            <span
                              className="mt-1.5 block max-w-[40ch] text-[13.5px] leading-snug transition-colors duration-500 sm:text-[15px]"
                              style={{ color: on ? '#6B6B6B' : 'rgba(17,17,17,0.22)' }}
                            >
                              {s.v}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ПРАВО — визуал со сменой + красный рельс */}
              <div className="relative order-1 lg:order-2">
                <div className="flex gap-5">
                  {/* вертикальный прогресс-рельс */}
                  <div className="relative hidden w-px shrink-0 bg-line sm:block">
                    <span
                      ref={railRef}
                      aria-hidden="true"
                      className="absolute inset-x-[-0.5px] top-0 h-full origin-top bg-red"
                      style={{ transform: 'scaleY(0)' }}
                    />
                  </div>

                  <div className="relative mx-auto aspect-[4/5] h-[44svh] w-auto lg:aspect-[4/3] lg:h-auto lg:w-full">
                    {STEPS.map((s, i) => {
                      const on = i === active;
                      return (
                        <Visual
                          key={s.k}
                          step={s}
                          className="absolute inset-0 transition-all duration-700 ease-sanger"
                          style={{
                            opacity: on ? 1 : 0,
                            transform: on ? 'scale(1)' : 'scale(1.04)',
                            pointerEvents: on ? 'auto' : 'none',
                          }}
                        />
                      );
                    })}

                    {/* плавающий тег текущего этапа */}
                    <div className="pointer-events-none absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-ink/90 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-red" />
                        {STEPS[active].detail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      ) : (
        // ── Доступный fallback (SSR / reduced-motion) ────────────────────
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.05}>
                <figure>
                  <Placeholder label={c.label} ratio="aspect-[3/3.4]" className="w-full" />
                  <figcaption className="mt-4">
                    <div className="font-display text-[15px] font-bold uppercase text-ink">{c.k}</div>
                    <p className="mt-1 text-[13.5px] leading-snug text-muted">{c.v}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}

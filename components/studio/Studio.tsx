'use client';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FigureView } from './MockupStage';
import { StudioControls } from './StudioControls';
import { useStudio } from '@/store/studioStore';
import { track } from '@/lib/analytics';
import type { SportSlug } from '@/types';

export function Studio({ defaultSport }: { defaultSport?: SportSlug }) {
  const s = useStudio();
  const setSport = useStudio((st) => st.setSport);
  const ref = useRef<HTMLElement>(null);
  const [sheet, setSheet] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    if (defaultSport) setSport(defaultSport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSport]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !opened.current) {
            opened.current = true;
            track('studio_open', { sport: s.sport });
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goEstimate = () => {
    track('estimate_form_open', { from: 'studio', sport: s.sport });
    document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="bg-paper2/50 py-16 sm:py-24" id="studio">
      <Container>
        <SectionHeading eyebrow="Студия дизайна · онлайн" title={<>Соберите форму команды</>}>
          Быстро создайте пример формы: цвет, шаблон, фамилия и номер — и получите бесплатный расчёт.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* controls — desktop */}
          <div className="hidden rounded-2xl border border-line bg-white p-6 lg:block">
            <StudioControls />
          </div>

          {/* stage */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">
                Ваша форма · {' '}живой предпросмотр
              </span>
              {/* переключатель нужен только на мобильном — на десктопе видны обе фигуры */}
              <div className="flex items-center gap-2 lg:hidden" role="group" aria-label="Вид формы">
                <button
                  onClick={() => s.setSide('front')}
                  aria-pressed={s.side === 'front'}
                  className={`min-h-[40px] rounded-full px-4 text-[12px] font-semibold ${
                    s.side === 'front' ? 'bg-ink text-white' : 'border border-line2 text-ink'
                  }`}
                >
                  Спереди
                </button>
                <button
                  onClick={() => s.setSide('back')}
                  aria-pressed={s.side === 'back'}
                  className={`min-h-[40px] rounded-full px-4 text-[12px] font-semibold ${
                    s.side === 'back' ? 'bg-ink text-white' : 'border border-line2 text-ink'
                  }`}
                >
                  Сзади
                </button>
              </div>
            </div>

            {/* Desktop: две крупные фигуры (спереди и сзади), между ними 360° — как в эталоне */}
            <div className="relative hidden grid-cols-2 items-center gap-2 bg-[radial-gradient(80%_60%_at_50%_25%,rgba(228,20,28,0.05),transparent_65%)] px-6 py-10 lg:grid">
              <FigureView side="front" />
              <FigureView side="back" />
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line2 bg-white font-sans text-[11px] font-bold text-ink shadow-soft"
                aria-hidden="true"
              >
                360°
              </span>
            </div>

            {/* Mobile: одна фигура + переключатель сверху */}
            <div className="grid place-items-center bg-[radial-gradient(80%_60%_at_50%_25%,rgba(228,20,28,0.05),transparent_65%)] px-6 py-8 lg:hidden">
              <FigureView side={s.side} />
            </div>

            <div className="border-t border-line px-5 py-5">
              <button
                onClick={goEstimate}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-red text-[15px] font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-red-600"
              >
                Получить расчёт
              </button>
              <p className="mt-3 text-center text-[13px] text-muted">
                Наш дизайнер бесплатно доработает ваш макет и подготовит профессиональную визуализацию.
              </p>
            </div>
          </div>
        </div>

        {/* mobile controls trigger */}
        <button
          onClick={() => setSheet(true)}
          className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-line2 font-semibold text-ink lg:hidden"
        >
          Настроить форму
        </button>
      </Container>

      {/* mobile bottom sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-label="Настройки формы">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-3xl bg-white p-6 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">Настройки формы</span>
              <button
                onClick={() => setSheet(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-line2"
                aria-label="Закрыть"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <StudioControls />
            <button
              onClick={() => {
                setSheet(false);
                goEstimate();
              }}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-full bg-red font-semibold uppercase text-white"
            >
              Получить расчёт
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
